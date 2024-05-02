import { Request, Response } from "express";
import { CustomError } from "../../domain";
import { FileUploadService } from "../services/file-upload.service";
import { UploadedFile } from "express-fileupload";
import { error } from "console";

export class FileUploadController{
    constructor(
        private readonly fileUlploadService:FileUploadService
    ){}
    private handleError =(error:unknown,resFromEndpoint:Response)=>{
        if(error instanceof CustomError){
            return resFromEndpoint.status(error.statusCode).json({error:error.message});
        }
        return resFromEndpoint.status(500).json({error:'Internal server Error'});
    } 
    uploadFile = (req:Request,res:Response)=>{

        const type = req.params.type;
  
     
        const file  = req.body.files.at(0) as UploadedFile;
        this.fileUlploadService.uploadSingle(file,`uploads/${type}`)
        .then(uploaded=> res.json(uploaded))
        .catch(err=>this.handleError(err,res))
    
    }
    uploadMultipleFile = (req:Request,res:Response)=>{
        const urlType = req.params.type;
        const files = req.body.files as UploadedFile[];
        
        this.fileUlploadService.uploadMultiple(files,`uploads/${urlType}`)
        .then(uploaded=> res.json(uploaded))
        .catch(err=>this.handleError(err,res))
    }
}