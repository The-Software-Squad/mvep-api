import mongoose from "mongoose";
import { IAddress, IContact, IStore } from "./store-interface";

const AddressSchema = new mongoose.Schema<IAddress>({
   street:{
       type : String,
       required:true
    },
   city:{
       type:String,
       required:true
     },
    state:{ 
       type : String, 
       required:true
       },
    postel_code: { 
      type : String, 
      required:true
    },
    location : {
      type: {
             type : String,
             coordinate:[Number],
             required:true
           }
      },
});

const ContactSchema = new mongoose.Schema<IContact>({
   phone : {
     type : String,
     required : true
   },
   email : {
      type: String,
      required:true
   },
   website : {
     type:String,
     default : ""
   }
})


const storeSchema = new mongoose.Schema<IStore>(
 {
   name : {
      type :String,
      required:true
   },
   description : {
      type:String,
      required:true
   },
   logo:{
     type : String,
     required:true
   },
   banner: {
     type : String,
     required:true
   },
   region_id : {
     type : mongoose.SchemaTypes.ObjectId,
     ref : "regions",
     required:true
   },
   status : {
     type:String,
     enum : ["active" , "inactive" , "deleted" , "pending" , "suspended"]
   },
   address:AddressSchema,
   contact : ContactSchema
 }
);


const Store = mongoose.model<IStore>("store", storeSchema);
export default Store;
