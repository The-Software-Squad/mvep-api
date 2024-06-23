import { default_admin_caps, default_creator_caps, default_super_admin_caps } from "../constants/capabilities";

export default function getDefaultCapabilitiesByRole(role : number):string[]{
      let capabilities:string[] = [];
       switch(role){
          case 1:{
             capabilities = [...default_super_admin_caps];
             break;
          }
          case 2 : {
            capabilities = [...default_admin_caps];
            break;
          } 
          case 3 : {
            capabilities = [...default_creator_caps]
             break;
          }
          case 4 :{
            capabilities = [...default_admin_caps];
            break;
          }
          default :{
             capabilities = []
          }
       }
       return capabilities;
}