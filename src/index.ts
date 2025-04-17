import  express from "express";
import mongoose from "mongoose"
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "./config"
import { ContentModeal, UserModel } from "./db";
import cors from "cors"
import { userMiddleware } from "./middleware";


const app = express(); 
app.use(express.json())
app.use (cors())


const PORT = 3000;



// declaration file = file provide types to typeless libraries such as express 
 
async function main() {
    
    await mongoose.connect()
    .then (()=>console.log("connnected to mongodb"))
    .catch((err)=> console.log("failed to connect to mongoDB"))
}

app.post ('/api/v1/signUp' , async (req  , res  )=>{
      const username = req.body.username;
      const password = req.body.password;

      try {
        await UserModel.create({username , password});
        res.json ({message: "user signed Up"})
      } catch (error) {
        res.status(409).json({message: "User already exists"})
      }
})

app.post('/api/v1/signin' , async (req , res)=>{
     const username = req.body.username;
     const password = req.body.password;

     try {
       const existingUser = await UserModel.findOne({username , password})
        
        if(existingUser){

            const token = jwt.sign({id: existingUser._id}, JWT_SECRET)
            res.json({token})
        }
        else {
            res.status(403).json({message : "Incorrect Credentials"})
        }
     } catch (error) {
        res.status(409).json({messsage : "User Not Signed In"})
     }
})

app.post('/api/v1/content' , userMiddleware, async (req , res )=>{
     const {link , title, userId} = req.body

     await ContentModeal.create ({
        title ,
        link , 
        userId : req.userId, 
        tags: []
     })
     res.json({messagge: "Content Added"})
})

main()

app.listen (PORT, ()=>{
    console.log(`Server is runnning at ${PORT}`)
})



