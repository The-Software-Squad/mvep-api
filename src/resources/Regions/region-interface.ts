import mongoose from "mongoose";

export interface ICoordinate {
     lat :number;
     lng:number

}

export interface IRegion extends mongoose.Document {
  name: string;
  description: string;
  createdBy: mongoose.Types.ObjectId;
  polygon: ICoordinate[];
}
