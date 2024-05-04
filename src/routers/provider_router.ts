import express from 'express';
import { Provider } from '../models/provider.js';

export const providerRouter = express.Router();

// {
//     "name": "Rafa Nadal",
//     "cif": "W22222222",
//     "email": "rafa@gmail.com",
//     "mobilePhone": 222222222,
//     "address": "Calle Manacor"
// }

/**
 *  Create a new provider
*/
providerRouter.post('/providers', async (req, res) => {
    try {
        const provider = new Provider(req.body);
        await provider.save();
        res.status(201).send(provider);
    } catch (error) {
        res.status(500).send(error);
    }
});

providerRouter.patch('/providers', async (req, res) => {
    if(!req.query.cif) {
        return res.status(400).send({
            error: 'CIF is required'
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
        const provider = await Provider.findOneAndUpdate({ cif: req.query.cif }, req.body, { new: true, runValidators: true });
        if(!provider) {
            return res.status(404).send({ 
                error: 'Provider not found' 
            });
        }
        return res.send(provider);
    } catch (error) {
        return res.status(500).send(error);
    }
});

providerRouter.patch('/providers/:id', async (req, res) => {
    const allowedUpdates = ['name', 'email', 'mobilePhone', 'address'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if(!isValidUpdate) {
        return res.status(400).send({
            error: 'Update is not allowed'
        });
    }

    try {
        const provider = await Provider.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if(!provider) {
            return res.status(404).send({ 
                error: 'Provider not found' 
            });
        }
        return res.send(provider);
    } catch (error) {
        return res.status(500).send(error);
    }
});

providerRouter.get('/providers', async (req, res) => {
    if(!req.query.cif) {
        return res.status(400).send({
            error: 'CIF is required'
        });
    }

    try {
        const provider = await Provider.findOne({ cif: req.query.cif });
        if(!provider) {
            return res.status(404).send({ 
                error: 'Provider not found' 
            });
        }
        return res.send(provider);
    } catch (error) {
        return res.status(500).send(error);
    }
});

providerRouter.get('/providers/:id', async (req, res) => {
    try {
        const provider = await Provider.findById(req.params.id);
        if(!provider) {
            return res.status(404).send({ 
                error: 'Provider not found' 
            });
        }
        return res.send(provider);
    } catch (error) {
        return res.status(500).send(error);
    }
});

providerRouter.delete('/providers', async (req, res) => {
    if(!req.query.cif) {
        return res.status(400).send({
            error: 'CIF is required'
        });
    }

    try {
        const provider = await Provider.findOneAndDelete({ cif: req.query.cif });
        if(!provider) {
            return res.status(404).send({ 
                error: 'Provider not found' 
            });
        }
        return res.send(provider);
    } catch (error) {
        return res.status(500).send(error);
    }
});

providerRouter.delete('/providers/:id', async (req, res) => {
    try {
        const provider = await Provider.findByIdAndDelete(req.params.id);
        if(!provider) {
            return res.status(404).send({ 
                error: 'Provider not found' 
            });
        }
        return res.send(provider);
    } catch (error) {
        return res.status(500).send(error);
    }
});