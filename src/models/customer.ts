import { Document, Schema, model } from 'mongoose';
import validator from 'validator';

export interface CustomerDocumentInterface extends Document {
    name: string,
    nif: string,
    email: string,
    mobilePhone?: number,
    address: string,
}

const customerSchema = new Schema<CustomerDocumentInterface>({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    nif: { 
        type: String, 
        required: true,
        unique: true, 
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
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value: string) {
          if (!validator.default.isEmail(value)) {
            throw new Error('Email is invalid');
          }
        }
    },
    mobilePhone: {
        type: Number,
        required: false,
        validate(value: number) {
          if (value.toString().length !== 9) {
            throw new Error('Mobile phone must have 9 digits');
          }
        }
    },
    address: {
        type: String,
        required: true,
        trim: true,
    }
});

export const Customer = model<CustomerDocumentInterface>('Customer', customerSchema);

