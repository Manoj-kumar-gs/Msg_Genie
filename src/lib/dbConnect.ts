import mongoose from "mongoose";
// import * as mongoose from "mongoose";


type ConnectionObject = {    //object ruturning when the connection is made
    isConnected?: number      //rutuening object to be a number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<any> {
    if (connection.isConnected) {
        console.log("already connected to mongodb")
        return
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '')
        console.log("connected to mongodb", db)
        connection.isConnected = db.connections[0].readyState; //readyState is the state of the connection
        console.log("connection object", db.connections)
    } catch (error) {
        console.error("error connecting to mongodb", error)
        process.exit(1) //exit the process with error code 1
    }
}
 
export default dbConnect;