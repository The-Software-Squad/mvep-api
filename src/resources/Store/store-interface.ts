import mongoose from "mongoose";

export interface IAddress {
	 street :string;
     city:string;
     state : string;
     postel_code : string;
     location :{
       type :string;
       coordinate : [number, number];
     }

}

export interface IContact{
	  phone : string;
	  email : string;
	  website ?:  string
}

export interface IStore{
	 name:string;
	 description : string;
	 logo : string;
	 banner : string;
	 region_id : mongoose.Types.ObjectId;
	 status : "active" | "inactive" | "deleted" | "pending" | "suspended";
	 address : IAddress;
	 contact : IContact;
}
