import { JwtAdapter, envs } from "../../config";
import { bcryptAdapter } from "../../config/bcrypt.adapter";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { EmailService } from "./email.service";


  


  export class AuthService {
    constructor(
      private readonly emailService:EmailService
    ){}

    public async registerUser(registerUserDto:RegisterUserDto){

        const existUser = await UserModel.findOne({email:registerUserDto.email});
        if(existUser) throw CustomError.badRequest('Email already exist');

        try {
            const user = new UserModel(registerUserDto);
            //encriptar la password
            user.password = bcryptAdapter.hash(registerUserDto.password)


            //jwt <=== para mantener la autenticacion del usuario
            await user.save();
           await  this.sendEmailValidationLink(user.email!);


            const {password,...userEntity} = UserEntity.fromObject(user);
            const token = await JwtAdapter.generateToken({id:userEntity.id})
            if(!token)  throw CustomError.internalServer(`Error while creating JWT`); 
            
            return {
               user: userEntity,
                token:token
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }

    }
    public async loginUser(loginDto:LoginUserDto){
     const existUser = await UserModel.findOne({email:loginDto.email});
         if(!existUser) throw CustomError.badRequest('Password or >Email not exist');
         ///////////////////////
         const {password,...userEntity} = UserEntity.fromObject(existUser);
         ///////////////////////
         const isMatching = bcryptAdapter.compare(loginDto.password,password);
         if(!isMatching ) throw CustomError.badRequest('>Password o Email is not valid');
        ////////////////////
      const token = await JwtAdapter.generateToken({id:userEntity.id,email:userEntity.email})
        if(!token)  throw CustomError.internalServer(`Error while creating JWT`); 
         try {
           
            return {
                user:userEntity,
                token:token
             };
         } catch (error) {
            throw CustomError.internalServer(`${error}`); 
         }
    }
 
    private sendEmailValidationLink = async (email:string) => {
      const token = await JwtAdapter.generateToken({email});
      if(!token) throw CustomError.internalServer('Error getting token');
      const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
      const html = `
      <h1>Validate your email </h1>
      <p>Click on the following link to validate your email</p>
      <a href="${link}"> Validate your email:${email}</a>
      `;
      const options = {
        to:email,
        subject:'Validate your email',
        htmlBody:html
      };
      const isSet = await this.emailService.sendEmail(options);
      if(!isSet) throw CustomError.internalServer('Error sending email');
      return  true;
    };

    public validateEmail=async(token:string)=>{

      const payload = await JwtAdapter.validateToken(token);
      if(!payload) throw CustomError.unauthorized('Invalid token');

      const {email} = payload as {email:string};
      if(!email) throw CustomError.internalServer('Email not in token');

      const user= await UserModel.findOne({email});
      if(!user) throw CustomError.internalServer('Email not exist');

      user.emailValidated = true;
      await user.save();
      return true;
     }
  }