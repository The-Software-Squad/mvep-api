import { Router } from "express";
import { Controller } from "../../utils/interfaces/controller-interface";
import { Request,Response } from "express-serve-static-core";
import { sudouserProtectMiddleWare } from "../Sudouser/sudouser-middleware";
import { protectRegionMiddleware } from "./region-middleware";
import expressAsyncHandler from "express-async-handler";
import Region from "./region-model";
import { CreateRegionDto, UpdateRegionDto } from "../../types";

export default class RegionController implements Controller{
    path = "region";
    router: Router = Router();
    
    constructor(){
        this.initializeRoutes();
    } 

    private initializeRoutes(){
    	  this.router.get("/" , sudouserProtectMiddleWare , protectRegionMiddleware , this.getAllRegions);
          this.router.post("/" ,sudouserProtectMiddleWare ,protectRegionMiddleware, this.createRegion);
          this.router.get("/:id" , sudouserProtectMiddleWare,protectRegionMiddleware,this.getRegionById);
          this.router.put("/:id" , sudouserProtectMiddleWare,protectRegionMiddleware,this.updateRegionById);
          this.router.delete("/:id" , sudouserProtectMiddleWare,protectRegionMiddleware,this.deleteRegionById);
    }

   private getAllRegions = expressAsyncHandler(
      async (req: Request, res: Response) => {
         const regions = await Region.find({});
         if (!regions) {
           res.status(400);
           throw new Error("unable to fetch to regions");
         }
         res.json({data: {
         regions: regions,
        },
    });
  }
);
    
  private getRegionById = expressAsyncHandler(
    async (req: Request<{ id: string }, {}, {}>, res: Response) => { 
    const regionById = await Region.findById(req.params.id);
    if (!regionById) {
      res.status(400);
      throw new Error("unable to fetch the region");
    }
    res.json({
      data: {
        region: regionById,
      },
    });
  }
);

  private createRegion = expressAsyncHandler(
  async (req: Request<{} , {} , CreateRegionDto>, res: Response) => {
    const {name , description , polygon} = req.body;
    const loggedInSudoUserId = req.loggedInSudoUserId;
    const newRegion = await Region.create({
         name: name,
         description : description,
         polygon : [...polygon],
         createdBy : loggedInSudoUserId
    });
    if(!newRegion){
         res.status(400);
         throw new Error("failed to create the new region");
    }
    res.status(200);
    res.json({
        data : {
             region : newRegion
        }
    })
  }
);

  private updateRegionById = expressAsyncHandler(
  async (req: Request<{id:string} , {} , UpdateRegionDto>, res: Response) => {
    const upadatedRegion = await Region.findByIdAndUpdate(req.params.id , req.body);
    if(!upadatedRegion){
       res.status(400);
       throw new Error("update failed while updating the region");
    }
     res.json({
       data: {
         region:upadatedRegion,
         update :true,
      }
     })
    
  }
);

 private deleteRegionById = expressAsyncHandler(
  async (req: Request<{id:string}>, res: Response) => {
      const deletedRegion = await Region.findByIdAndDelete(req.params.id)
    if (!deletedRegion) {
      res.status(400);
      throw new Error("Deletion Failed");
    }
    res.status(200);
    res.json({
      data: {
        deletedRegion,
      },
    });
  }
);

} 
