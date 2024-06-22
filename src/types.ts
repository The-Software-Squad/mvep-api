export interface CreateSudoUserDto{
    name :string;
    email:string;
    password:string;
    phone_number : string;
    role : 1 | 2 | 3 | 4;
    capbilities  :string[];
}