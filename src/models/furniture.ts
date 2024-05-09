import { Document, Schema, model } from 'mongoose';

/**
 * Represents the structure of a furniture document object with type enforcement.
 * @interface
 */
export interface FurnitureDocumentInterface extends Document {
    name: string,
    description: string,
    material: string,
    color: 'rojo' | 'azul' | 'verde' | 'amarillo' | 'negro' | 'blanco' | 'marron',
    price: number,
    type: 'Silla' | 'Mesa' | 'Armario',
    stock: number,
}

/**
 * Mongoose schema definition for the Furniture model, enforcing data types and validation rules.
 */
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

/**
 * Model creation for `Furniture`, based on the defined schema.
 * This model will be used to interact with the 'furniture' collection in the database.
 */
export const Furniture = model<FurnitureDocumentInterface>('Furniture', furnitureSchema);