import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const isAuth = async(req , res , next) => {
  const { token }  = req.cookies;
  // console.log(req.cookies);
  // console.log(token);

  //validation 
  if(!token){
    return res.status(401).send({
      success:false,
      message:"Unauthorized User",
    });
  }
  const decodeDate = JWT.verify(token ,process.env.JWT_SECRET);
  req.user = await userModel.findById(decodeDate._id);
  next();
};