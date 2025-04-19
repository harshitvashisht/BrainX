import  express from "express";
import mongoose from "mongoose"
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "./config"
import {ContentModel, LinkModel, UserModel } from "./db";
import cors from "cors"
import { userMiddleware } from "./middleware";
import { random } from "./utils";


const app = express(); 
app.use(express.json())
app.use (cors())


const PORT = 3000;



// declaration file = file provide types to typeless libraries such as express 
 
async function main() {
    
    await mongoose.connect("")
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

     await ContentModel.create ({
        title ,
        link , 
        userId : req.userId, 
        tags: []
     })
     res.json({messagge: "Content Added"})
})
app.get('/api/v1/content' , userMiddleware , async(req , res , next )=>{
   
    const userId = req.userId ; 
    
    const content = await ContentModel.find({userId: userId}).populate("userId","username")
    res.json(content);
})

app.delete('/api/v1/content' , userMiddleware , async(req , res , next )=>{
    const ObjectId = req.body.ObjectId;

    await ContentModel.deleteMany({
        ObjectId,
        userId: req.userId
    })
    res.json({message : "Content Deleted"})
    
})

app.post ('/api/v1/brain/share' , userMiddleware , async (req , res ,next)=>{
       const share = req.body.share
       
       if(share){
        const exitingLink = await LinkModel.findOne({
            userId:req.userId
        })
        if (exitingLink){
           res.json({
                hash: exitingLink.hash
            });
            return 
        }
    const hash = random(10)
       await  LinkModel.create({
            userId: req.userId,
            hash: hash
        });
        res.json({
            hash
        });
       }else{
       await LinkModel.deleteOne({userId: req.userId})
       }
       res.json({
        message: "Updated Sharable link"
       })
})
app.get('/api/v1/brain/:shareLink',userMiddleware,async (req,res,next)=>{
    const hash = req.params.shareLink;

   const link =  await LinkModel.findOne({
        hash
    })
    if(!link){
        res.status(411).json({
            message: "Sorry Incorrect Input"
        })
        return;
    }
    const content = await ContentModel.find({userId:link.userId})
    const user = await UserModel.findOne({
        _id: link.userId
    })
    if(!user){
        res.status(411).json({
            message: "Fatal Error"
        })
        return;
    }
    res.json ({
        username : user?.username,
        content: content
    })
})
main()

app.listen (PORT, ()=>{
    console.log(`Server is runnning at ${PORT}`)
})



