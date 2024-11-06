import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true ,'name is required']
  },
  email:{
    type: String,
   required: [true ,'email is required'] ,
   unique:[true ,'email already taken']
  },
password:{
  type: String,
  required: [true ,'password is required'],
  minLength:[8,'password must be at least 8 characters']
},
address:{
  type: String,
  required: [true ,'address is required']
},
city:{
  type: String,
  required: [true ,'city name is required']
},
country:{
  type: String,
  required: [true ,'country name is required']
},
phone:{
  type: String,
  required: [true ,'phone is required'],
},
profilePic:{
  public_id: {
    type: String,
  },
  url:{
    type: String,
  },
},
answer:{
type: String,
required:[true ,'answer is required']
},
role:{
  type: String,
  default:'user'
}
},{timestamps:true});


//fuctions 
//hash function

userSchema.pre('save', async function(nextCD){
  //handling the update case
  if(!this.isModified('password')) return next();
this.password = await bcrypt.hash(this.password,10);
});

//compare functions

userSchema.methods.comparePassword = async function(plainPassword){
return await bcrypt.compare(plainPassword , this.password);
};



// Method to generate a JWT
userSchema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const userModel = mongoose.model('Users',userSchema);
export default userModel;