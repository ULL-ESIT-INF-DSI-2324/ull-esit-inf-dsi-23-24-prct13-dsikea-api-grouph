import { Document, Schema, model } from 'mongoose';

export interface FurnitureDocumentInterface extends Document {
    name: string,
    description: string,
    material: string,
    color: 'rojo' | 'azul' | 'verde' | 'amarillo' | 'negro' | 'blanco' | 'marron',
    price: number,
    type: 'Silla' | 'Mesa' | 'Armario',
    stock: number,
}

export const furnitureSchema = new Schema<FurnitureDocumentInterface>({
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    material: {
        type: String,
        required: true,
        trim: true,
    },
    color: {
        type: String,
        required: true,
        enum: ['rojo', 'azul', 'verde', 'amarillo', 'negro', 'blanco', 'marron'],
    },
    price: {
        type: Number,
        required: true,
        validate(value: number) {
            if (value <= 0) {
                throw new Error('Price must be greater than 0');
            }
        }
    },
    type: {
        type: String,
        required: true,
        enum: ['Silla', 'Mesa', 'Armario'],
    },
    stock: {
        type: Number,
        required: true,
        validate(value: number) {
            if (value < 0) {
                throw new Error('Stock must be greater than or equal to 0');
            }
        }
    }
});

export const Furniture = model<FurnitureDocumentInterface>('Furniture', furnitureSchema);