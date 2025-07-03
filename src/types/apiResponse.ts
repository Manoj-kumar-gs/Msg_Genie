import { Message } from "@/models/user";

//defining types of api response
export interface ApiResponse{
    success : boolean;
    message : string;
    isAcceptingMessages? : boolean;
    messages? : Array<Message>;  
}