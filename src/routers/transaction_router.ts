import express from 'express';
import { Customer } from '../models/customer.js';
import { Provider } from '../models/provider.js';
import { Furniture} from '../models/furniture.js';
import { Transaction } from '../models/transaction.js';
import { CustomerDocumentInterface } from '../models/customer.js';
import { ProviderDocumentInterface } from '../models/provider.js';

export const transactionRouter = express.Router();

// {
//     "customerNIF": "44444444W",
//     "type": "SALE",
//     "furnitureList": [
//       {
//         "furnitureId": "6637c5f5664f4a696e58f87e",
//         "quantity": 5
//       },
//       {
//         "furnitureId": "6637c607664f4a696e58f880",
//         "quantity": 3
//       }
//     ]
// }

//http://localhost:3000/transactions/by-date?startDate=2024-05-06&endDate=2024-05-08&type=SALE

//Para patch el body es asi (dependiendo de los muebles obvio):
// {
//     "furnitureList": [
//       {
//         "furnitureId": "6637c5f5664f4a696e58f87e",
//         "quantity": 2
//       },
//       {
//         "furnitureId": "6637c607664f4a696e58f880",
//         "quantity": 6
//       }
//     ]
//   }

/**
 * Retrieves a customer from the database based on their NIF.
 * @param {string} nif - The National Identification Number of the customer to be retrieved.
 * @returns {Promise<CustomerDocumentInterface | null>} A promise that resolves with the customer document if found, otherwise null.
 */
async function findCustomer(nif: string): Promise<CustomerDocumentInterface | null> {
    return Customer.findOne({ nif: nif }).exec();
}

/**
 * Retrieves a provider from the database based on their CIF.
 * @param {string} cif - The Corporate Identification Number of the provider to be retrieved.
 * @returns {Promise<ProviderDocumentInterface | null>} A promise that resolves with the provider document if found, otherwise null.
 */
async function findProvider(cif: string): Promise<ProviderDocumentInterface | null> {
    return Provider.findOne({ cif: cif }).exec();
}

/**
 * Route to create a new transaction.
 * @param {express.Request} req - The request object, containing the transaction details in the request body.
 * @param {express.Response} res - The response object used to send back the created transaction or an error message.
 * @returns Sends a 201 status and the created transaction data or a 500 status with an error message.
 */
transactionRouter.post('/transactions', async (req, res) => {
    const { type, customerNIF, providerCIF, furnitureList } = req.body;

    if (type !== 'SALE' && type !== 'PURCHASE') {
        return res.status(400).send({ error: 'Invalid transaction type' });
    }
    if (!furnitureList || furnitureList.length === 0) {
        return res.status(400).send({ error: 'Furniture list must be provided' });
    }

    try {
        let party = null;
        if (type === 'SALE') {
            if (!customerNIF) {
                return res.status(400).send({ error: 'Customer NIF is required for SALE transactions' });
            }
            party = await findCustomer(customerNIF);
            if (!party) {
                return res.status(404).send({ error: 'Customer not found' });
            }
        } else if (type === 'PURCHASE') {
            if (!providerCIF) {
                return res.status(400).send({ error: 'Provider CIF is required for PURCHASE transactions' });
            }
            party = await findProvider(providerCIF);
            if (!party) {
                return res.status(404).send({ error: 'Supplier not found' });
            }
        }

        let totalPrice = 0;
        for (const item of furnitureList) {
            const furniture = await Furniture.findById(item.furnitureId);
            if (!furniture) {
                return res.status(404).send({ error: 'Furniture not found' });
            }

            if ((type === 'SALE' && furniture.stock < item.quantity) || 
                (type === 'PURCHASE' && item.quantity < 0)) {
                return res.status(400).send({ error: 'Insufficient stock for sale or invalid quantity for purchase' });
            }

            furniture.stock += (type === 'PURCHASE' ? item.quantity : (-item.quantity));
            await furniture.save();
            totalPrice += furniture.price * item.quantity;
        }

        const transaction = new Transaction({
            customerNIF: type === 'SALE' ? customerNIF : undefined,
            providerCIF: type === 'PURCHASE' ? providerCIF : undefined,
            type,
            furnitureList,
            totalPrice,
            date: new Date()
        });

        await transaction.save();
        return res.status(201).send(transaction);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

/**
 * Route to retrieve all transactions.
 * @param {express.Request} req - The request object, containing query parameters to filter the transactions.
 * @param {express.Response} res - The response object used to send back the transactions or an error message.
 * @returns Sends the transactions that match the query parameters, or an error message with status 500 if an error occurs.
 */
transactionRouter.get('/transactions', async (req, res) => {
    const { customerNIF, providerCIF } = req.query;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    try {
        if (customerNIF) {
            const customerExists = await Customer.exists({ nif: customerNIF });
            if (!customerExists) {
                return res.status(404).send({ message: `No customer found with NIF: ${customerNIF}` });
            }
        }

        if (providerCIF) {
            const providerExists = await Provider.exists({ cif: providerCIF });
            if (!providerExists) {
                return res.status(404).send({ message: `No provider found with CIF: ${providerCIF}` });
            }
        }

        if (customerNIF) {
            filter.customerNIF = customerNIF;
        }
        if (providerCIF) {
            filter.providerCIF = providerCIF;
        }

        const transactions = await Transaction.find(filter);
        if (transactions.length === 0) {
            return res.status(404).send({ message: 'No transactions found for the provided identifiers.' });
        }
        return res.status(200).send(transactions);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

/**
 * Route to retrieve a transaction by ID.
 * @param {express.Request} req - The request object, containing the ID in the params.
 * @param {express.Response} res - The response object used to send back the transaction or an error message.
 * @returns Sends the transaction, or an error message with status 404 if the transaction is not found and 500 if an error occurs.
 */
transactionRouter.patch('/transactions/:id', async (req, res) => {
    const { id } = req.params;
    const { furnitureList } = req.body;

    try {
        const transaction = await Transaction.findById(id);
        if (!transaction) {
            return res.status(404).send('Transaction not found.');
        }

        let newTotalPrice = 0;

        if (transaction.furnitureList && transaction.furnitureList.length > 0) {
            await Promise.all(transaction.furnitureList.map(async (item) => {
                const furniture = await Furniture.findById(item.furnitureId);
                if (furniture) {
                    const stockAdjustment = transaction.type === 'PURCHASE' ? -item.quantity : item.quantity;
                    furniture.stock += stockAdjustment;
                    await furniture.save();
                }
            }));
        }

        if (furnitureList && furnitureList.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await Promise.all(furnitureList.map(async (newItem: { furnitureId: any; quantity: number; }) => {
                const furniture = await Furniture.findById(newItem.furnitureId);
                if (furniture) {
                    const stockAdjustment = transaction.type === 'PURCHASE' ? newItem.quantity : -newItem.quantity;
                    furniture.stock += stockAdjustment;
                    await furniture.save();
                    newTotalPrice += newItem.quantity * furniture.price;
                } else {
                    throw new Error(`Furniture not found for ID: ${newItem.furnitureId}`);
                }
            }));
        }

        transaction.furnitureList = furnitureList;
        transaction.totalPrice = newTotalPrice; 
        await transaction.save();

        return res.send(transaction);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

/**
 * Route to retrieve a transaction by ID.
 * @param {express.Request} req - The request object, containing the ID in the params.
 * @param {express.Response} res - The response object used to send back the transaction or an error message.
 * @returns Sends the transaction, or an error message with status 404 if the transaction is not found and 500 if an error occurs.
 */
transactionRouter.delete('/transactions/:id', async (req, res) => {
    try {
      const transaction = await Transaction.findById(req.params.id);
      if (!transaction) {
        return res.status(404).send('Transaction not found');
      }
  
      for (const item of transaction.furnitureList) {
        const furniture = await Furniture.findById(item.furnitureId);
        if (!furniture) {
          return res.status(404).send({ message: 'Furniture not found for ID: ' + item.furnitureId });
        }

        const newStockLevel = transaction.type === 'PURCHASE' ? furniture.stock - item.quantity : furniture.stock + item.quantity;

        if (newStockLevel < 0) {
          return res.status(400).send({
            message: `Insufficient stock to reverse the transaction for furniture ID: ${item.furnitureId}. Available stock: ${furniture.stock}, trying to subtract: ${item.quantity}`
          });
        }
  
        furniture.stock = newStockLevel;
        await furniture.save();
      }

      await Transaction.findByIdAndDelete(req.params.id);
      return res.status(200).send({ message: 'Transaction deleted and stock adjusted successfully.' });
    } catch (error) {
        return res.status(500).send({ message: 'Error deleting transaction: ' + error.message });
    }
});
