import { Request, Response } from "express"
import { CreateCategoryDto, CustomError, PaginationDto } from "../../domain"
import { error } from "console";
import { CategoryService } from "../services/category.service";

export class CategoryController {
    //ID ( inyeccion de dependencios o tambien llamado)
    //DI (dependenci inyection)
    constructor(private readonly categoryService:CategoryService){

    }

    private handleError =(error:unknown,resFromEndpoint:Response)=>{
        if(error instanceof CustomError){
            return resFromEndpoint.status(error.statusCode).json({error:error.message});
        }
        return resFromEndpoint.status(500).json({error:'Internal server Error'});
    }
        createCategory=(req:Request,res:Response)=>{
            const [err,createCategoryDto] = CreateCategoryDto.create(req.body);
            if(err) return res.status(400).json({err});
            
            this.categoryService.createCategory(createCategoryDto!,req.body.user)
            .then((category)=>res.status(201).json(category))
            .catch(err=>this.handleError(error,res));
        }
        getCategories=async(req:Request,res:Response)=>{
            const {page=1,limit=10}=req.query;
            const [err,paginationDto] = PaginationDto.create(+page,+limit);
            if(err) return res.status(400).json({error:err});


           this.categoryService.getCategories(paginationDto!)
           .then(categories=>res.json(categories))
           .catch(error=>this.handleError(error,res));
        }
}