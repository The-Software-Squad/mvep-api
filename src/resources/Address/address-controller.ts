import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express-serve-static-core";
import { Controller } from "../../utils/interfaces/controller-interface";
import { verifyAuthOrSudo } from "./address-middleware";
import Address from "./address-model";
import User from "../User/user-model";


export default class UserAddressController implements Controller {
    router: Router = Router();
    path: string = "address";

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/', verifyAuthOrSudo, this.getAllAddress)
        this.router.get('/:id', verifyAuthOrSudo, this.getAddressById)
        this.router.get('/user/:id', verifyAuthOrSudo, this.getUserAddressesById)
        this.router.get('/default/:id', verifyAuthOrSudo, this.getUserDefaultAddress)
        this.router.post('/', verifyAuthOrSudo, this.createAddress)
        this.router.put('/:id', verifyAuthOrSudo, this.updateAddress)
        this.router.delete('/:id', verifyAuthOrSudo, this.deleteAddress)
    }

    private getAllAddress = expressAsyncHandler(
        async (req: Request, res: Response) => {
            const allAddresses = await Address.find();
            res.status(200);
            res.json({
                result: {
                    data: allAddresses
                }
            })
        }

    )

    private getAddressById = expressAsyncHandler(
        async (req: Request, res: Response) => {
            const ID = req.params?.id;
            if (!ID) {
                res.status(400);
                throw new Error("Address ID required");
            }
            const fetchedAddress = await Address.findById(ID);
            if (!fetchedAddress) {
                res.status(404);
                throw new Error("No Address Found");
            }
            res.status(200).send(
                {
                    results: {
                        data: fetchedAddress
                    }
                }
            )
        }
    )

    private getUserAddressesById = expressAsyncHandler(
        async (req: Request, res: Response) => {
            const ID = req.params?.id;
            if (!ID) {
                res.status(400);
                throw new Error("User ID required");
            }
            const isUserExists = await User.findById(ID);
            if (!isUserExists) {
                res.status(404);
                throw new Error("No User Found");
            }
            const userAddresses = await Address.find({ createdBy: ID });
            if (!userAddresses) {
                res.status(404);
                throw new Error('No User Address Found');
            }
            res.status(200).send(
                {
                    results: {
                        data: userAddresses
                    }
                }
            )
        }
    )

    private getUserDefaultAddress = expressAsyncHandler(
        async (req: Request, res: Response) => {
            const ID = req.params?.id;
            if (!ID) {
                res.status(400);
                throw new Error("User ID required");
            }
            const userAddresses = await Address.find({ createdBy: ID, isDefault: true });
            if (!userAddresses) {
                res.status(404);
                throw new Error('No User Address Found');
            }
            res.status(200).send(
                {
                    results: {
                        data: userAddresses
                    }
                }
            )
        }
    )
    private createAddress = expressAsyncHandler(
        async (req: Request, res: Response) => {
            const { createdBy, isDefault, name, email, phone, doorNo, street, city, state, zip, additionalInstructions, coordinates } = req.body;

            if (!createdBy || !name || !doorNo || !street || !city || !state || !zip || !coordinates) {
                res.status(400);
                throw new Error("Missing required fields");
            }

            const newAddress = new Address({
                createdBy,
                isDefault: isDefault ?? false,
                name,
                contact: {
                    email,
                    phone
                },
                address: {
                    doorNo,
                    street,
                    city,
                    state,
                    zip,
                    location: {
                        coordinates
                    }
                },
                additionalInstructions
            });

            const savedAddress = await newAddress.save();

            if (!savedAddress) {
                res.status(500);
                throw new Error("New Address Creation Failed");
            }

            res.status(201).json({
                address_id: newAddress._id,
                created: true
            });
            return;
        }
    )

    private updateAddress = expressAsyncHandler(
        async (req: Request, res: Response) => {
            const id = req.params?.id;
            if (!id) {
                res.status(400);
                throw new Error("Address ID required");
            }
            const address = await Address.findById(id);
            if (!address) {
                res.status(400);
                throw new Error("No Address Found");
            }

            if (req.body.isDefault !== undefined) address.isDefault = req.body.isDefault;
            if (req.body.name !== undefined) address.name = req.body.name;
            if (req.body.email !== undefined) address.contact.email = req.body.email;
            if (req.body.phone !== undefined) address.contact.phone = req.body.phone;

            if (req.body.doorNo !== undefined) address.address.doorNo = req.body.doorNo;
            if (req.body.street !== undefined) address.address.street = req.body.street;
            if (req.body.city !== undefined) address.address.city = req.body.city;
            if (req.body.state !== undefined) address.address.state = req.body.state;
            if (req.body.zip !== undefined) address.address.zip = req.body.zip;
            if (req.body.coordinates !== undefined) address.address.location.coordinates = req.body.coordinates;

            if (req.body.additionalInstructions !== undefined) {
                address.additionalInstructions = req.body.additionalInstructions;
            }
            if (req.body.additionalInstructions !== undefined) {
                address.additionalInstructions = req.body.additionalInstructions;
            }

            const updatedAddress = await address.save();
            if (!updatedAddress) {
                res.status(500)
                throw new Error('Update Failed');
            }
            res.status(200).send({
                result: {
                    addressId: updatedAddress._id,
                    updated: true
                }
            })
            return;

        }
    )

    private deleteAddress = expressAsyncHandler(
        async (req: Request, res: Response) => {
            const id = req.params?.id;
            if (!id) {
                res.status(400);
                throw new Error("Address ID required");
            }
            const address = await Address.findById(id);

            if (!address) {
                res.status(400);
                throw new Error("No Address Found");
            }

            const deletedAddress = await address?.deleteOne();
            if (!deletedAddress) {
                res.status(500);
                throw new Error('Unable to delete Address');
            }
            res.status(200).json({
                result: {
                    addressId: address._id,
                    deleted: true
                }
            })
        }
    )

}
