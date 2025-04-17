import { Request , Response , NextFunction } from "express";
import { JWT_SECRET  } from "./config";
import jwt from "jsonwebtoken"

export const userMiddleware = async (req: Request , res: Response , next :NextFunction)=>{
    const header = req.headers["authorization"]

    const verification = jwt.verify(header as string , JWT_SECRET)

    if(verification){
        //@ts-ignore
        req.userId = verification.id; 
        next();
    } else {
        res.status (401). json({message : "Unauthorized User"})
    }

}