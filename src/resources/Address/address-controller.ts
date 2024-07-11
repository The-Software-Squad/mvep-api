import { Router } from "express";
import { Controller } from "../../utils/interfaces/controller-interface";
import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express-serve-static-core";
import Address from "./address-model";
import { verifySuperAdmin } from "../../middleware/permissions-middleware";




export default class UserAddressController implements Controller {
    router: Router = Router();
    path: string = "address";

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/', verifySuperAdmin, this.getAllAddress)
        this.router.get('/:id', verifySuperAdmin, this.getAddressById)
        this.router.get('/user/:id', verifySuperAdmin, this.getUserAddressesById)
        this.router.get('/default/:id', verifySuperAdmin, this.getUserDefaultAddress)
        this.router.post('/',verifySuperAdmin,this.createAddress)
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

}
