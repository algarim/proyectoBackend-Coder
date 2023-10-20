import mongoose from "mongoose";

const URI = "mongodb+srv://algarim:coderMongoPass@cluster0.b0xclvx.mongodb.net/ecommerce?retryWrites=true&w=majority"

mongoose.connect(URI)
.then( () => console.log("Connected to DB") )
.catch( error => console.log(error) )