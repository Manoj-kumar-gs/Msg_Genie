import mongoose from "mongoose";
// import * as mongoose from "mongoose";


type ConnectionObject = { 
    isConnected?: number    
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<unknown> {
    if (connection.isConnected) {
        console.log("already connected to mongodb")
        return
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '')
        connection.isConnected = db.connections[0].readyState;
        
    } catch (error) {
        console.error("error connecting to mongodb", error)
        process.exit(1)
    }
}
 
export default dbConnect;  