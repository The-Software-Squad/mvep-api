import express,{ Application } from "express";
import logger from "./utils/logger";
import { Controller } from "./utils/interfaces/controller-interface";
import { errorMiddleWare } from "./middleware/error-middleware";
import { connectDB } from "./services/database-service";
import cors from "cors";
import cookieParser from "cookie-parser";

export default class App{
    public app : Application;
    public port : number;
    
    constructor(controllers:Controller[] , port:number){
    	this.app = express();
        this.port = port;
        this.initilizeDatabase();
        this.initlizeMiddleware();
        this.initilizeControllers(controllers);
        this.initilizeErrorhandling();
    }
    
    private initlizeMiddleware() : void{
        this.app.use(express.json())
        this.app.use(cookieParser())
        this.app.use(cors());

    }

    private initilizeControllers(controllers:Controller[]):void{
           controllers.forEach((controller:Controller)=>{
                this.app.use("/api/"+controller.path , controller.router);
           });
    }

    private initilizeDatabase():void{
        connectDB();
    }

    private initilizeErrorhandling():void{
       this.app.use(errorMiddleWare);
    }

    public listen():void{
       this.app.listen(this.port , ()=>{
        logger.info(`start the server http://localhost:${this.port}`)
       });
    }

}
