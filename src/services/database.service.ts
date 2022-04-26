// External Dependencies

import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

// Global Variables

export const collections: { student?: mongoDB.Collection } = {}

// Initialize Connection

export async function connectToDatabase () {

dotenv.config();
// {path: '../.env'}
const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING);
        
await client.connect();
    
const db: mongoDB.Db = client.db(process.env.DB_NAME);

await db.command({
     "collMod": process.env.COLLECTION_NAME,
     "validator": {
         $jsonSchema: {
             bsonType: "object",
             required: ["firstName", "lastName", "email "],
             additionalProperties: false,
             properties: {
             _id: {},
             firstName: {
                 bsonType: "string",
                 description: "'name' is required and is a string"
             },
             lastName: {
                 bsonType: "string",
                 description: "'price' is required and is a number"
             },
             email: {
                 bsonType: "string",
                 description: "'category' is required and is a string"
             }
             }
         }
      }
 });

const studentCollection: mongoDB.Collection = db.collection(process.env.COLLECTION_NAME);

collections.student = studentCollection;
   
     console.log(`Successfully connected to database: ${db.databaseName} and collection: ${studentCollection.collectionName}`);
}