import { Document, Schema, model } from 'mongoose';
import validator from 'validator';

export interface ProviderDocumentInterface extends Document {
    name: string,
    cif: string,
    email: string,
    mobilePhone?: number,
    address: string,
}

const providerSchema = new Schema<ProviderDocumentInterface>({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    cif: { 
        type: String, 
        required: true,
        unique: true, 
        trim: true,
        validate: {
          validator: function(value: string) {
            if (!/^[A-Z][0-9]{8}$/i.test(value)) {
              throw new Error('CIF must have a letter followed by 8 digits and be exactly 9 characters long');
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

export const Provider = model<ProviderDocumentInterface>('Provider', providerSchema);