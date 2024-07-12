import App from "./app";
import RegionController from "./resources/Regions/region-controller";
import StoreController from "./resources/Store/store-controller";
import SudouserController from "./resources/Sudouser/sudouser-controller";
import { Controller } from "./utils/interfaces/controller-interface";
import {config} from "dotenv";

config(); 

const controllers :Controller[] =[new SudouserController() , new RegionController() , new StoreController()]; 
const app = new App(controllers , Number(process.env.PORT));
app.listen();
