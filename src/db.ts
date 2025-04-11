import mongoose, {Schema , model}  from "mongoose";
import { string } from "zod";

mongoose.connect("mongodb+srv://ProjectXuser:Harshit123@brainx.81epndf.mongodb.net/?retryWrites=true&w=majority&appName=BrainX")

const UserSchema = new Schema ({
    username: {type: String , require: true , unique : true },
    password : {type: String , require: true}
})

export const UserModel = model ('User' , UserSchema)

