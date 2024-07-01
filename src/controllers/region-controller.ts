import { Request, Response } from "express-serve-static-core";
import expressAsyncHandler from "express-async-handler";
import region from "../models/region-model";
import SudoUser from "../models/sudouser-model";
import { CreateRegionDto, UpdateRegionDto } from "../types";

export const getAllRegions = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const regions = await region.find({});
    if (!regions) {
      res.status(400);
      throw new Error("unable to fetch to regions");
    }
    res.json({
      data: {
        regions: regions,
      },
    });
  }
);

export const getRegionById = expressAsyncHandler(
  async (req: Request<{ id: string }, {}, {}>, res: Response) => {
    const loggedInSudoUser = await SudoUser.findById(req.loggedInSudoUserId);
    if (!loggedInSudoUser) {
      res.status(400);
      throw new Error("unable to fetch the SudoUser");
    }

    if (loggedInSudoUser.role !== 1) {
      res.status(400);
      throw new Error("unauthorized to perform the operation");
    }
    const regionById = await region.findById(req.params.id);
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

export const createRegion = expressAsyncHandler(
  async (req: Request<{} , {} , CreateRegionDto>, res: Response) => {
    const {name , description , polygon} = req.body;
    const loggedInSudoUserId = req.loggedInSudoUserId;
    const newRegion = await region.create({
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

export const updateRegionById = expressAsyncHandler(
  async (req: Request<{id:string} , {} , UpdateRegionDto>, res: Response) => {
    const upadatedRegion = await region.findByIdAndUpdate(req.params.id , req.body);
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

export const deleteRegionById = expressAsyncHandler(
  async (req: Request<{id:string}>, res: Response) => {
      const deletedRegion = await region.findByIdAndDelete(req.params.id)
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
