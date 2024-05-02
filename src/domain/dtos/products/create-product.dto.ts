import { Validators } from "../../../config";

export class CreateProductDto {
    private constructor(
        public readonly name:string,
        public readonly available:boolean,
        public readonly price:number,
        public readonly descripcion:string,
        public readonly user:string, //ID
        public readonly category:string,//ID
    ){

    }

    static create(props:{[key:string]:any}):[string?,CreateProductDto?]
{
    const {
        name,
        available,
        price,
        descripcion,
        user,
        category,} =props;
        if(!name) return ['Missing name'];
        if(!user) return ['Missing user'];
        if(!Validators.isMondoID(user)) return ['Invalid user ID'];
        if(!category) return ['Missing category'];
        if(!Validators.isMondoID(category)) return ['Invalid category ID'];

        return [undefined,new CreateProductDto(name,
            !!available,
            price,
            descripcion,
            user,category)];
    }
}