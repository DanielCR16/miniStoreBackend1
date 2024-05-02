import mongoose, { Schema } from 'mongoose';

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        require:[true,'Name is required'],
        unique:true,
    },
    available:{
        type:String,
        default:false,
    },
  
    user:{
        type:Schema.Types.ObjectId,
        ref:'user',
        require:true
    }
    
});
categorySchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform:function(doc,ret,options){
      delete ret._id;

    }
  });

export const CategoryModel = mongoose.model('Category',categorySchema);