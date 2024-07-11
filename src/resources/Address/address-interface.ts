import mongoose, { Document } from "mongoose";

interface Location {
    type: string;
    coordinates: [number, number];
}

interface Address {
    doorNo: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    location: Location;
}

interface Contact {
    email: string;
    phone: string;
}

export interface UserAddress extends Document {
    createdBy: mongoose.Schema.Types.ObjectId;
    isDefault: boolean;
    name: string;
    contact: Contact;
    address: Address;
    additionalInstructions: string;
}
