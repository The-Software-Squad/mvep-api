import { Router } from "express";
import { createRegion, deleteRegionById, getAllRegions, getRegionById, updateRegionById } from "../controllers/region-controller";
import protectRegion from "../middleware/region-middleware";
import sudoUserAuthMiddleware from "../middleware/sudouserauth-middleware";
const regionRouter =  Router();

regionRouter.get("/",sudoUserAuthMiddleware,protectRegion,getAllRegions);
regionRouter.post("/",sudoUserAuthMiddleware,protectRegion,createRegion);
regionRouter.get("/:id",sudoUserAuthMiddleware,protectRegion,getRegionById);
regionRouter.put("/:id",sudoUserAuthMiddleware,protectRegion,updateRegionById);
regionRouter.delete("/:id",sudoUserAuthMiddleware,protectRegion,deleteRegionById);

export default regionRouter;