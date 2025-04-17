import mongoose, {Schema , model}  from "mongoose";
import { string } from "zod";

mongoose.connect()

const UserSchema = new Schema ({
    username: {type: String , require: true , unique : true },
    password : {type: String , require: true}
})

export const UserModel = model ('User' , UserSchema)

const ContentSchema = new Schema ({
     title : String , 
     Link : String, 
     tags : [{type : mongoose.Types.ObjectId, ref : "tag"}],
     userId: [{
        type : mongoose.Types.ObjectId,
        ref : "User",
        require : true
     }]
})

export const ContentModeal = model ('Content' , ContentSchema)