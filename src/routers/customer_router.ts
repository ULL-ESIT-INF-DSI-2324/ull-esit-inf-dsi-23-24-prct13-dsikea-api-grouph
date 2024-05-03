import express from 'express';
import { Customer } from '../models/customer.js';
//import { Transaction } from '../models/transaction.js';

// {
//     "name": "Francisco Felipe Martin",
//     "nif": "44444444W",
//     "email": "alu1111111111@ull.edu.es",
//     "mobilePhone": 123456789,
//     "address": "Camino El Pino"
// }

export const customerRouter = express.Router();

/**
 *  Create a new customer
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





