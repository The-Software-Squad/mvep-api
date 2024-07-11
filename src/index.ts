import App from "./app";
import RegionController from "./resources/Regions/region-controller";
import SudouserController from "./resources/Sudouser/sudouser-controller";
import UserController from "./resources/User/user-controller";
import { Controller } from "./utils/interfaces/controller-interface";
import {config} from "dotenv";

config(); 

const controllers :Controller[] =[new SudouserController() , new RegionController(),new UserController]; 
const app = new App(controllers , Number(process.env.PORT));
app.listen();
