import { Request, Response } from "express";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { AuthService } from "../services/auth.service";
import { CustomError, LoginUserDto } from "../../domain";
import { json } from "stream/consumers";
import { error } from "console";




export class AuthController {
   
   //Inyeccion de dependencias 
    constructor(
        public readonly authService:AuthService
    ){

    }
    private handleError=(error:unknown,resFromEndpoint:Response)=>{
        if(error instanceof CustomError){
          return  resFromEndpoint.status(error.statusCode).json({error:error.message})
        }
        return resFromEndpoint.status(500).json({error:'Internal server Error'})
    }
    registerUser =(req:Request,res:Response)=>{
        const [error,registerDto]= RegisterUserDto.create(req.body);
        if(error) res.status(400).json({error})
        
        this.authService.registerUser(registerDto!)
        .then((user)=>res.json(user))
        .catch(err=>this.handleError(err,res));
     
    }   
    loginUser =(req:Request,res:Response)=>{
        const [error,loginDto]=LoginUserDto.login(req.body);
        if(error) res.status(400).json({error});

       this.authService.loginUser(loginDto!)
       .then(login=>res.json(login))
       .catch(error=>this.handleError(error,res));
    }   
    validateEmail =(req:Request,res:Response)=>{
        const {token} = req.params;
         this.authService.validateEmail(token)
         .then(()=>res.json('Email validated'))
         .catch(error=>this.handleError(error,res));
       
    }   
}