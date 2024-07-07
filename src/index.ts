import App from "./app";
import SudouserController from "./resources/Sudouser/sudouser-controller";
import { Controller } from "./utils/interfaces/controller-interface";
import {config} from "dotenv";
config();
const controllers :Controller[] =[new SudouserController()]; 
const app = new App(controllers , Number(process.env.PORT));
app.listen();
