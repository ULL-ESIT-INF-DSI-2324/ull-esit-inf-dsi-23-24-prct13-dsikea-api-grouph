import { Document, Schema, Types, model } from 'mongoose';
//import validator from 'validator';
import { FurnitureDocumentInterface } from './furniture.js';

/**
 * Interface to represent the structure of a transaction document with type enforcement.
 * Extends the base `Document` to include Mongoose document properties.
 * @interface
 */
export interface TransactionDocumentInterface extends Document {
    customerNIF?: string,
    providerCIF?: string,
    type: 'SALE' | 'PURCHASE',
    furnitureList: { furnitureId: FurnitureDocumentInterface | number; quantity: number} [],
    totalPrice: number,
    date: Date,
}

/**
 * Mongoose schema definition for the Transaction model, enforcing data types and validation rules
 */
const transactionSchema = new Schema<TransactionDocumentInterface>({
    customerNIF: {
      type: String,
      trim: true,
      validate: {
        validator: function(value: string) {
          if (!/^[0-9]{8}[A-Z]$/i.test(value)) {
            throw new Error('NIF must have 8 digits followed by a letter and be exactly 9 characters long');
          }
          return true;
        }
      },
      required: function() {
          return this.type === 'SALE';
      }
    },
    providerCIF: {
        type: String,
        trim: true,
        validate: {
            validator: function(value: string) {
                if (!/^[A-Z][0-9]{8}$/i.test(value)) {
                    throw new Error('CIF must have 8 digits followed by a letter and be exactly 9 characters long');
                }
                return true;
            }
        },
        required: function() {
            return this.type === 'PURCHASE';
        }
    },
    type: {
        type: String,
        required: true,
        enum: ['SALE', 'PURCHASE'],
    },
    furnitureList: [{
        furnitureId: {
            type: Types.ObjectId,
            ref: 'Furniture',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            validate: {
                validator: Number.isInteger,
                message: 'Quantity must be an integer.'
            }
        }
    }],
    totalPrice: {
        type: Number,
        required: true,
        default: 0,
        validate(value: number) {
            if (value <= 0) {
                throw new Error('Total price must be greater than 0');
            }
        }
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
},  { timestamps: false },
);

/**
 * Represents a Transaction model object with the TransactionDocumentInterface structure
 */
export const Transaction = model<TransactionDocumentInterface>('Transaction', transactionSchema);