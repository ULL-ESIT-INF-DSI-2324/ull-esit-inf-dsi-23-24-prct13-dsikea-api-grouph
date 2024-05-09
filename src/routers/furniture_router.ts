import express from 'express';
import { Furniture } from '../models/furniture.js';

export const furnitureRouter = express.Router();

// {
//     "name": "Silla de Escritorio",
//     "description": "Silla para estudiar por muchas horas",
//     "material": "Plastico",
//     "color": "negro",
//     "price": 50,
//     "type": "Silla",
//     "stock": 10
// }

/**
 * Route to create a new furniture item.
 * @param {express.Request} req - The request object, containing the furniture details en el cuerpo de la solicitud.
 * @param {express.Response} res - The response object used to send back the created furniture item or an error message.
 * @returns Sends a 201 status and the created furniture data or un 500 status con un mensaje de error.
 */
furnitureRouter.post('/furnitures', async (req, res) => {
    try {
        const furniture = new Furniture(req.body);
        await furniture.save();
        res.status(201).send(furniture);
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 * Route to update multiple furniture items based on query parameters.
 * @param {express.Request} req - The request object, containing query parameters para filtrar los items que se deben actualizar.
 * @param {express.Response} res - The response object used to send back the result or an error message.
 * @returns If successful, returns the count of updated items; otherwise, returns an error message.
 */
furnitureRouter.patch('/furnitures', async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any>  = {};
    ['name', 'description', 'material', 'color', 'price', 'type', 'stock'].forEach((field) => {
        if(req.query[field]) {
            filter[field] = req.query[field];
        }
    });

    if (Object.keys(filter).length === 0) {
        return res.status(400).send({ message: 'At least one query parameter is required for filtering' });
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'description', 'material', 'color', 'price', 'type', 'stock'];
    const isValidUpdate = updates.every(update => allowedUpdates.includes(update));

    if (!isValidUpdate) {
        return res.status(400).send({ error: 'Invalid update' });
    }

    try {
        const updated = await Furniture.updateMany(filter, req.body, { new: true, runValidators: true });
        if (updated.modifiedCount === 0) {
            return res.status(404).send({ error: 'Furniture not found' });
        }
        return res.status(200).send({
            message: `${updated.modifiedCount} furniture(s) updated`
        });
    } catch (error) {
        return res.status(500).send(error);
    }
});

/**
 * Route to update a furniture item by ID.
 * @param {express.Request} req - The request object, containing the update data and the ID in the params.
 * @param {express.Response} res - The response object used to send back the updated furniture item or an error message.
 * @returns Sends the updated furniture data, or an error message with status 400 if validation fails or 404 if the furniture item is not found and 500 if an error occurs.
 */
furnitureRouter.patch('/furnitures/:id', async (req, res) => {
    const allowedUpdates = ['name', 'description', 'material', 'color', 'price', 'type', 'stock'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if(!isValidUpdate) {
        return res.status(400).send({
            error: 'Update is not allowed'
        });
    }

    try {
        const furniture = await Furniture.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if(!furniture) {
            return res.status(404).send({ 
                error: 'Furniture not found' 
            });
        }
        return res.status(200).send(furniture);
    } catch (error) {
        return res.status(500).send(error);
    }
});

/**
 * Route to retrieve all furniture items.
 * @param {express.Request} req - The request object, containing query parameters to filter the items.
 * @param {express.Response} res - The response object used to send back the furniture items or an error message.
 * @returns Sends the furniture items that match the query parameters, or an error message with status 500 if an error occurs.
 */
furnitureRouter.get('/furnitures', async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any>  = {};
    ['name', 'description', 'material', 'color', 'price', 'type', 'stock'].forEach((field) => {
        if(req.query[field]) {
            filter[field] = req.query[field];
        }
    });

    try {
        const furnitures = await Furniture.find(filter);
        if(furnitures.length === 0) {
            return res.status(404).send({ 
                error: 'Furniture not found' 
            });
        }
        return res.send(furnitures);
    } catch (error) {
        return res.status(500).send(error);
    }
});

/**
 * Route to retrieve a furniture item by ID.
 * @param {express.Request} req - The request object, containing the ID in the params.
 * @param {express.Response} res - The response object used to send back the furniture item or an error message.
 * @returns Sends the furniture item, or an error message with status 404 if the furniture item is not found and 500 if an error occurs.
 */
furnitureRouter.get('/furnitures/:id', async (req, res) => {
    try {
        const furniture = await Furniture.findById(req.params.id);
        if(!furniture) {
            return res.status(404).send({ 
                error: 'Furniture not found' 
            });
        }
        return res.send(furniture);
    } catch (error) {
        return res.status(500).send(error);
    }
});

/**
 * Route to delete multiple furniture items based on query parameters.
 * @param {express.Request} req - The request object, containing query parameters to filter the items that should be deleted.
 * @param {express.Response} res - The response object used to send back the result or an error message.
 * @returns If successful, returns the count of deleted items; otherwise, returns an error message.
 */
furnitureRouter.delete('/furnitures', async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any>  = {};
    ['name', 'description', 'material', 'color', 'price', 'type', 'stock'].forEach((field) => {
        if(req.query[field]) {
            filter[field] = req.query[field];
        }
    });

    if (Object.keys(filter).length === 0) {
        return res.status(400).send({ message: 'At least one query parameter is required for filtering' });
    }

    try {
        const deleted = await Furniture.deleteMany(filter);
        if(deleted.deletedCount === 0) {
            return res.status(404).send({ 
                error: 'Furniture not found' 
            });
        }
        return res.send({
            message: `${deleted.deletedCount} furniture(s) deleted`
        }).status(200);
    } catch (error) {
        return res.status(500).send(error);
    }
});

/**
 * Route to delete a furniture item by ID.
 * @param {express.Request} req - The request object, containing the ID in the params.
 * @param {express.Response} res - The response object used to send back the deleted furniture item or an error message.
 * @returns Sends the deleted furniture item, or an error message with status 404 if the furniture item is not found and 500 if an error occurs.
 */
furnitureRouter.delete('/furnitures/:id', async (req, res) => {
    try {
        const furniture = await Furniture.findByIdAndDelete(req.params.id);
        if(!furniture) {
            return res.status(404).send({ 
                error: 'Furniture not found' 
            });
        }
        return res.send(furniture);
    } catch (error) {
        return res.status(500).send(error);
    }
});