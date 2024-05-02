import { NextFunction, Request, Response } from "express";

export class TypeMiddleware {
 static validTypes(validTypes:string[]){

    return (req:Request,res:Response,next:NextFunction)=>{
        const urlType = req.url.split('/').at(2)??'';

        if(!validTypes.includes(urlType)) {
         return res.status(400).json({error:`Invalid type ${urlType},valid ones ${validTypes}`});
     }
     next();
    }
 }  
}