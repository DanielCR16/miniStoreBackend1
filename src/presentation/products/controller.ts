import { Request, Response } from "express";
import { CreateProductDto, CustomError, PaginationDto } from "../../domain";
import { ProductService } from "../services/product.service";

export class ProductController {
    constructor(
        private readonly productService:ProductService,
    ){}

    private handleError =(error:unknown,resFromEndpoint:Response)=>{
        if(error instanceof CustomError){
            return resFromEndpoint.status(error.statusCode).json({error:error.message});
        }
        return resFromEndpoint.status(500).json({error:'Internal server Error'});
    }

    createProduct=(req:Request,res:Response)=>{
        const [ error,createProductDto] = CreateProductDto.create({
            ...req.body,
            user:req.body.user.id
        });
        if(error) return res.status(400).json({error})
       
        this.productService.createProduct(createProductDto!)
        .then(category=>res.status(201).json(category))
        .catch(error=>this.handleError(error,res));
    }
    getProducts=(req:Request,res:Response)=>{
        const {page=1,limit=10}=req.query;
        const [err,paginationDto]=PaginationDto.create(+page,+limit);
        if(err) return res.status(400).json({error:err});

        this.productService.getProducts(paginationDto!)
        .then(categories=>res.json(categories))
        .catch(error=>this.handleError(error,res));


    }
}