import userModel from '../models/userModel.js';
import { getDataUri } from '../utils/features.js';
import cloudinary from 'cloudinary';


export const registerController = async(req,res) => {
try{
  const {name,email,password,address,city,country,phone} = req.body

  //validation 
  if(!name || !email || !password || !address || !city || !country || !phone ){
    return res.status(500).send({
      success: false,
      message:"please Provide All Fields",
    });
  }
  //check existing user
  const exisitingUSer = await userModel.findOne({email})
  //validation 
  if(exisitingUSer){
    return res.status(500).send({
      success: false,
      message:"email already taken ",
    });
  }
  const user = await userModel.create({
    name,
    email,
    password,
    address,
    city,
    country,
    phone,
  });
  res.status(201).send({
    success:true,
    message:"Registeration Sucess , please login",
    user,
  });
}catch(error) {
  res.status(500).send({
    success: false,
    message: 'Error is Register API',
    error,
  });
}
};

//login 
export const loginController = async(req, res) => {
  try{
    const {email ,password} = req.body;
    //validation 
    if(!email || !password){
      return res.status(500).send({
        success:false,
        message:"Please add Email or Password"
      });
    }
    //check user
    const user = await userModel.findOne({email});
    //user validation 
    if(!user){
      return res.status(404).send({
        success:false,
        message:"User Not Found "
      });
    }
    //check password
    const isMatch = await user.comparePassword(password);

    //validation 
    if(!isMatch){
      return res.status(500).send({
        success:false,
        message:"invalid credentials"
      });
    }
    //token
    const token =  user.generateToken();

    res.status(200).cookie("token",token,{
      expires:new Date(Date.now() + 15*24*60*60*1000),
      secure: process.env.NODE_ENV !== "development" ? true : false,
      httponly: process.env.NODE_ENV === "development" ? true : false,
      sameSite: process.env.NODE_ENV === "development" ? true : false,
    })
    .send({
      success:true,
      message:"Login Successfully",
      token,
      user,
    });

  }catch(error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message:"Error in Login API",
      error
    });
  }
};


//GET user profile 
export const getUserProfileController = async (req, res) =>{
  try{
    const user = await userModel.findById(req.user._id);
    user.password = undefined;
    res.status(200).send({
      success:true,
      message:"User Profile Fetch Successfully",
      user,
    });
  }catch(error) {
    console.log(error);
    res.status(500).send({
      success:false,
      message:"Error in profile api ",
      error
    });
  }
};

//LOGOUT 
export const logoutController = async (req, res) =>{
  try{
    res.status(200).cookie("token" ,"" ,{
      expires:new Date(Date.now() + 15*24*60*60*1000),
          secure: process.env.NODE_ENV !== "development" ? true : false,
          httponly: process.env.NODE_ENV === "development" ? true : false,
          sameSite: process.env.NODE_ENV === "development" ? true : false,
    }).send({
    success:true,
    message:"logout successfully",
    });
  }catch(error) {
    res.status(500).send({
      success:false,
      message:"Error in Logout API",
      error
    });
  }
};

//update user profile
export const updateProfileController = async (req, res) =>{
try{
  const user = await userModel.findById(req.user._id);
  const {name,email,address,city,country,phone} = req.body;

  //validation and update
  if (name) user.name = name;
  if (email) user.email = email;
  if (address) user.address = address;
  if (city) user.city = city;
  if (country) user.country = country;
  if (phone) user.phone = phone;

  //await user
  await user.save();
  res.status(200).send({
    success:true,
    message:"User Profile Updated"
  });

}catch(error) {
  console.log(error);
  res.status(500).send({
    success:false,
    message:"Error in update profile  API",
    error,
  })
}
};

//update user password
export const updatePasswordController = async (req, res) => {
  try{
    const user = await userModel.findById(req.user._id);
    const { oldPassword ,newPassword} = req.body;

    //validation 
    if(!oldPassword || !newPassword){
      return res.status(500).send({
        success:false,
        message:"please provide old or new password"
      });
    }

    // old password check 
    const isMatch = await user.comparePassword(oldPassword)

    //validations 
    if(!isMatch){
      return res.status(500).send({
        success:false,
        message:"invalid old password",
      });
    }
    user.password = newPassword;
    await user.save();

    res.status(200).send({
      success:true,
      message:"Sucessfully updated Password!",
    });

  }catch(error) {
    console.log(error);
    res.status(500).send({
      success:false,
      message:"Error in update password API",
      error,
    })
  }
};

//Update user profile photo
export const updateProfilePicController = async(req,res) =>{
  try{
    const user = await userModel.findById(req.user._id);
    console.log(user);
    //get file from user
    const file = getDataUri(req.file);
    //delete previous image
    // await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
   //update 
   const cdb = await cloudinary.v2.uploader.upload(file.content);
   user.profilePic = {
    public_id : cdb.public_id,
    url:cdb.secure_url,
   },
   //save func

   await user.save();

   res.status(200).send({
    success:true,
    message:"profile picture updated!",
   });
  }catch(error) {
    console.log(error);
    res.status(500).send({
      success:false,
      message:"Error in update Profile Picture API",
      error,
    });
  }
};