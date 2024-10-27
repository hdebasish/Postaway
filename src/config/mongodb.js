import { error } from "console";
import { MongoClient } from "mongodb";

// const URL = "mongodb://127.0.0.1:27017/postaway2"

let client;

export const mongodbConnection = ()=> {
    MongoClient.connect(process.env.DB_URL).then((clientInstance)=>{
        client = clientInstance;
        console.log("Connected to MongoDB")
    }).catch(error=>{
        console.log(`Error connecting to the database ${error}`)
    });
}

export const getDB = () => {
    return client.db();
}


