import { Router } from "express";
import { Controller } from "../../utils/interfaces/controller-interface";
import expressAsyncHandler from "express-async-handler";
import {Request, Response} from "express-serve-static-core";
import Store from "./store-model";

export default class StoreController implements Controller{
   
   path: string = "store";
   router: Router = Router();
   
   constructor(){
      this.initializeRoutes();
   } 
    
   private initializeRoutes(){
   	   this.router.get("/" , this.getAllStores);
         this.router.get("/:id" , this.getStoreById);
   } 
   
   private getAllStores = expressAsyncHandler(async(req: Request , res:Response)=>{ 
     const allStores = await Store.find({});
     if(!allStores){
       throw new Error("Failed to fetch the stores");
     }
      res.json({
        data : allStores
     })
    return;
   });

   private getStoreById = expressAsyncHandler(async(req:Request<{id:string},{},{}> , res:Response)=>{  
        const storeById = await Store.findById(req.params.id);
        if(!storeById){
          throw new Error("failed to fetch the store");
        }
       res.json({data: storeById});
       return;
   });


}
