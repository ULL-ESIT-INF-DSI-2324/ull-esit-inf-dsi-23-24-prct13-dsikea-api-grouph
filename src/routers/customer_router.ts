import express from 'express';
import { Customer } from '../models/customer.js';


// {
//     "name": "Francisco Felipe Martin",
//     "nif": "44444444W",
//     "email": "alu1111111111@ull.edu.es",
//     "mobilePhone": 123456789,
//     "address": "Camino El Pino"
// }

export const customerRouter = express.Router();

/**
 * Route to create a new customer.
 * @param {express.Request} req - The request object, containing the body with the customer details.
 * @param {express.Response} res - The response object used to send back the created customer or an error message.
 * @returns Sends a 201 status and the created customer data or a 500 status with an error message.
 */
customerRouter.post('/customers', async (req, res) => {
    try {
        const customer = new Customer(req.body);
        await customer.save();
        res.status(201).send(customer);
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 * Route to update a customer by NIF using query parameters.
 * @param {express.Request} req - The request object, containing the body with the update data and the NIF in the query.
 * @param {express.Response} res - The response object used to send back the updated customer or an error message.
 * @returns Sends the updated customer data, or an error message with status 400 if validation fails or 404 if the customer is not found and 500 if an error occurs.
 */
customerRouter.patch('/customers', async (req, res) => {
    if(!req.query.nif) {
        return res.status(400).send({
            error: 'NIF is required'
        });
    }

    const allowedUpdates = ['name', 'email', 'mobilePhone', 'address'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if(!isValidUpdate) {
        return res.status(400).send({
            error: 'Update is not allowed'
        });
    }

    try {
        const customer = await Customer.findOneAndUpdate({ nif: req.query.nif }, req.body, { new: true, runValidators: true });
        if(!customer) {
            return res.status(404).send({ 
                error: 'Customer not found' 
            });
        }
        return res.send(customer);
    } catch (error) {
        return res.status(500).send(error);
    }
});

/**
 * Route to retrieve a customer by NIF using query parameters.
 * @param {express.Request} req - The request object, containing the NIF in the query.
 * @param {express.Response} res - The response object used to send back the customer data or an error message.
 * @returns Sends the customer data, or an error message with status 400 if NIF is missing or 404 if no customer is found and 500 if an error occurs.
 */
customerRouter.patch('/customers/:id', async (req, res) => {
    const allowedUpdates = ['name', 'email', 'mobilePhone', 'address'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if(!isValidUpdate) {
        return res.status(400).send({
            error: 'Update is not allowed'
        });
    }

    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if(!customer) {
            return res.status(404).send({ 
                error: 'Customer not found' 
            });
        }
        return res.send(customer);
    } catch (error) {
        return res.status(500).send(error);
    }
});

/**
 * Route to retrieve a customer by NIF using query parameters.
 * @param {express.Request} req - The request object, containing the NIF in the query.
 * @param {express.Response} res - The response object used to send back the customer data or an error message.
 * @returns Sends the customer data, or an error message with status 400 if NIF is missing or 404 if no customer is found and 500 if an error occurs.
 */
customerRouter.get('/customers', async (req, res) => {
    if(!req.query.nif) {
        return res.status(400).send({
            error: 'NIF is required'
        });
    }

    try {
        const customer = await Customer.findOne({ nif: req.query.nif });
        if(!customer) {
            return res.status(404).send({ 
                error: 'Customer not found' 
            });
        }
        return res.send(customer);
    } catch (error) {
        return res.status(500).send(error);
    }
});

/**
 * Route to retrieve a customer by ID.
 * @param {express.Request} req - The request object, containing the customer ID.
 * @param {express.Response} res - The response object used to send back the customer data or an error message.
 * @returns Sends the customer data, or an error message with status 404 if no customer is found, and 500 if an error occurs.
 */
customerRouter.get('/customers/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if(!customer) {
            return res.status(404).send({ 
                error: 'Customer not found' 
            });
        }
        return res.send(customer);
    } catch (error) {
        return res.status(500).send(error);
    }
});

/**
 * Route to delete a customer by NIF using query parameters.
 * @param {express.Request} req - The request object, containing the NIF in the query.
 * @param {express.Response} res - The response object used to send back the deleted customer data or an error message.
 * @returns Sends the deleted customer data, or an error message with status 400 if NIF is missing or 404 if no customer is found, and 500 if an error occurs.
 */
customerRouter.delete('/customers', async (req, res) => {
    if(!req.query.nif) {
        return res.status(400).send({
            error: 'NIF is required'
        });
    }

    try {
        const customer = await Customer.findOneAndDelete({ nif: req.query.nif });
        if(!customer) {
            return res.status(404).send({ 
                error: 'Customer not found' 
            });
        }
        return res.send(customer);
    } catch (error) {
        return res.status(500).send(error);
    }
});

/**
 * Route to delete a customer by ID.
 * @param {express.Request} req - The request object, containing the customer ID.
 * @param {express.Response} res - The response object used to send back the deleted customer data or an error message.
 * @returns Sends the deleted customer data, or an error message with status 404 if no customer is found, and 500 if an error occurs.
 */
customerRouter.delete('/customers/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if(!customer) {
            return res.status(404).send({ 
                error: 'Customer not found' 
            });
        }
        return res.send(customer);
    } catch (error) {
        return res.status(500).send(error);
    }
});





