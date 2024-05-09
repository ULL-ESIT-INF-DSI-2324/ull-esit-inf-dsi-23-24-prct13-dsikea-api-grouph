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
 * Creates a new provider and stores it in the database.
 * @param {express.Request} req - The request object containing the provider details in the body.
 * @param {express.Response} res - The response object used to send back the created provider or an error message.
 * @returns Sends a 201 status and the created provider data or a 500 status with an error message if an error occurs.
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

/**
 * Updates a provider by CIF using query parameters.
 * @param {express.Request} req - The request object containing the update data and the CIF in the query.
 * @param {express.Response} res - The response object used to send back the updated provider or an error message.
 * @returns Sends the updated provider data, or an error message with status 400 if validation fails or 404 if the provider is not found and 500 if an error occurs.
 */
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

/**
 * Updates a provider by ID.
 * @param {express.Request} req - The request object containing the update data and the provider ID.
 * @param {express.Response} res - The response object used to send back the updated provider or an error message.
 * @returns Sends the updated provider data, or an error message with status 400 if validation fails or 404 if the provider is not found and 500 if an error occurs.
 */
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

/**
 * Retrieves a provider by CIF using query parameters.
 * @param {express.Request} req - The request object containing the CIF in the query.
 * @param {express.Response} res - The response object used to send back the provider data or an error message.
 * @returns Sends the provider data, or an error message with status 400 if CIF is not provided or 404 if the provider is not found and 500 if an error occurs.
 */
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

/**
 * Retrieves a provider by ID.
 * @param {express.Request} req - The request object containing the provider ID.
 * @param {express.Response} res - The response object used to send back the provider data or an error message.
 * @returns Sends the provider data, or an error message with status 404 if the provider is not found and 500 if an error occurs.
 */
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

/**
 * Deletes a provider by CIF using query parameters.
 * @param {express.Request} req - The request object containing the CIF in the query.
 * @param {express.Response} res - The response object used to send back the deleted provider or an error message.
 * @returns Sends the deleted provider data, or an error message with status 400 if CIF is not provided or 404 if the provider is not found and 500 if an error occurs.
 */
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

/**
 * Deletes a provider by ID.
 * @param {express.Request} req - The request object containing the provider ID.
 * @param {express.Response} res - The response object used to send back the deleted provider or an error message.
 * @returns Sends the deleted provider data, or an error message with status 404 if the provider is not found and 500 if an error occurs.
 */
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