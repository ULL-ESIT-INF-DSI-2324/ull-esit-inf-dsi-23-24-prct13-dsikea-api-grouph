import { Document, Schema, Types, model } from 'mongoose';
//import validator from 'validator';
import { FurnitureDocumentInterface } from './furniture.js';

export interface TransactionDocumentInterface extends Document {
    customerNIF: string,
    providerCIF: string,
    type: 'SALE' | 'PURCHASE',
    furnitureList: { furnitureID: FurnitureDocumentInterface | number; quantity: number} [],
    totalPrice: number,
    date: Date,
}

const transactionSchema = new Schema<TransactionDocumentInterface>({
    customerNIF: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function(value: string) {
          if (!/^[0-9]{8}[A-Z]$/i.test(value)) {
            throw new Error('NIF must have 8 digits followed by a letter and be exactly 9 characters long');
          }
          return true;
        }
      }
    },
    providerCIF: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(value: string) {
                if (!/^[0-9]{8}[A-Z]$/i.test(value)) {
                    throw new Error('CIF must have 8 digits followed by a letter and be exactly 9 characters long');
                }
                return true;
            }
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
        validate(value: number) {
            if (value <= 0) {
                throw new Error('Total price must be greater than 0');
            }
        }
    },
    date: {
        type: Date,
        required: true,
    },
},  { timestamps: false },
);

export const Transaction = model<TransactionDocumentInterface>('Transaction', transactionSchema);