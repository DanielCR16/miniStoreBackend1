import { ProductModel } from "../../data";
import { CreateProductDto, CustomError, PaginationDto } from "../../domain";

export class ProductService {
    constructor(){}
    async createProduct(createProductDto:CreateProductDto){
        const productExist = await ProductModel.findOne({name:createProductDto.name})
        if(productExist) throw CustomError.badRequest('Producto already exists');
        try {
            const product = new ProductModel(createProductDto);
            await product.save();
            return product;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);

        }
    }
    async getProducts(paginationDto:PaginationDto){
        const { page,limit}=paginationDto;
        try {
            //! ESTO USA UN LLAMADO A 2 ENDPOINTS
            const [total,products]= await Promise.all([
                ProductModel.countDocuments(),
                ProductModel.find()
                .skip((page-1)*limit)
                .limit(limit)
                .populate('user')
                .populate('category')
            ]);
            return {
                page:page,
                limit:limit,
                total:total,
                next:`/api/products?page=${(page+1)}&limit=${limit}`,
                preview:(page-1>0)?`/api/products?page=${(page-1)}&limit=${limit}`:null,
                
                products:products,
            }
        } catch (error) {
            throw CustomError.internalServer('Internal Server Error');
        }
    }

}