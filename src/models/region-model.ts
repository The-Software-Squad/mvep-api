import mongoose from "mongoose";

interface ICoordinate {
     lat :number;
     lng:number

}

interface IRegion extends mongoose.Document {
  name: string;
  description: string;
  createdBy: mongoose.Types.ObjectId;
  polygon: ICoordinate[];
}

const regionSchema = new mongoose.Schema<IRegion>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "sudouser",
  },
  polygon: {
    type: [{
        lat:Number,
        lng:Number,
    }],
    required: true,
  },
} , {timestamps: true});

export default mongoose.model<IRegion>("regions", regionSchema);
