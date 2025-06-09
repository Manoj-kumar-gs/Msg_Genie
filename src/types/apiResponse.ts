import { Message } from "@/models/user";

//defining types of api response
export interface ApiResponse{
    success : boolean;
    message : string;
    isAccepting? : boolean;
    messages? : Array<Message>;  
} 