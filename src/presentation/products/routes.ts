import { Router } from "express";
import { ProductController } from "./controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { ProductService } from "../services/product.service";

export class ProductsRoutes {
    static get routes():Router {
        const router = Router();
        const service= new ProductService();
        const controller = new ProductController(service);

        router.get('/',controller.getProducts);
        router.post('/',[AuthMiddleware.validateJWT],controller.createProduct);
       return router; 
    }
}