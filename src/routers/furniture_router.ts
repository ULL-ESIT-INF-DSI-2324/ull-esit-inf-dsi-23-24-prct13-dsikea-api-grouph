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
 *  Create a new furniture
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
        });
    } catch (error) {
        return res.status(500).send(error);
    }
});

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