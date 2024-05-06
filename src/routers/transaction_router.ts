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

/**
 * Find a customer by NIF
 */
async function findCustomer(nif: string): Promise<CustomerDocumentInterface | null> {
    return Customer.findOne({ nif: nif }).exec();
}

/**
 * Find a provider by CIF
 */
async function findProvider(cif: string): Promise<ProviderDocumentInterface | null> {
    return Provider.findOne({ cif: cif }).exec();
}

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

            furniture.stock += type === 'PURCHASE' ? item.quantity : -item.quantity;
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



