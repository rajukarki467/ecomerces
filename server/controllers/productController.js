// GET all  product 

import productModel from "../models/productModel.js";
import { getDataUri } from '../utils/features.js';
import cloudinary from 'cloudinary';



export const  getAllProductsController = async ( req ,res ) => {
  const {keyword ,category} = req.query;
  try {
    const products = await productModel.find({
      name:{
        $regex: keyword ? keyword :'',
        $options : "i",
      },
      // category: category ? category : '',
    });
    res.status(200).send({
      success:true,
      message:'all product fetch successfully',
      totalProduct:products.length,
      products,
    });

  }catch(error){
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in Get All Products API',
      error
    });
  }
};


//get top producct 
export const getTopProductsController = async ( req ,res) => {
  try{
    const product = await productModel.find({}).sort({rating:-1}).limit(3);
    res.status(200).send({
      success:true,
      message:' fetch top product successfully',
      totalProduct : product.length,
      product,
    });

  }catch(error){
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in Get top Products API',
      error
    });
  }
};

// GET single Product 
export const getSingleProductController = async ( req ,res) =>{
  try{
  //get  product id 
  const product = await productModel.findById(req.params.id);
  //validation 
  if(!product){
    return res.status(404).send({
      success:false,
      message: 'Product not found'
    })
  }
  res.status(200).send({
    success:true,
    message: 'Product found',
    product,
  })
  }catch(error){
    console.log(error);

    //cast error || object id
    if(error.name === 'CastError'){
      return res.status(500).send({
        success:false,
        message:'Invalid id'
      })
    }
    res.status(500).send({
      success: false,
      message: 'Error in Get single Products API',
      error,
    });
  }
};

//create product 
export const createProductController = async (req, res) =>{
  try{
    const {name,description,price,category,stock} = req.body;

    //validation
    if(!name || !description || !price || !stock){
      return res.status(500).send({
        success:false,
        message:'Please Provide All fields'
      });
    }
    if(!req.file){
      return res.status(500).send({
        success:false,
        message:'Please Provide product images '
      });
    }

    const file = getDataUri(req.file);
 
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url:cdb.secure_url
    };
    await productModel.create({
      name,description,price,category,stock,images:[image]
    });
    res.status(201).send({
      success:true,
      message:'Product create Successfully!!'

    });
  }catch(error){
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in Create Products API',
      error,
    });
  }
};

//update product
export const updateProductController = async(req ,res) => {
  try{
    //find product
    const product = await productModel.findById(req.params.id);
    //validation 
    if(!product){
      return res.status(404).send({
        success: false,
        message: 'Product not found',
        error,
      });
    }
    const {name,description,price,stock,category}= req.body;
    //validate and update
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price= price;
    if (stock) product.stock= stock;
    if (category) product.category = category;


    await product.save();
    res.status(200).send({
      success:true,
      message:"product update successfully!"
    })


  }catch(error){
    console.log(error);
    //cast error || object id
    if(error.name === 'CastError'){
      return res.status(500).send({
        success:false,
        message:'Invalid id'
      })
    }
    res.status(500).send({
      success: false,
      message: 'Error in Update Products API',
      error,
    });
  }
};

//update product image
export const updateProductImageController = async (req,res) => {
  try{
    //find product
    const product = await productModel.findById(req.params.id);
    //validation 
    if(!product){
      return res.status(404).send({
        success: false,
        message: 'Product not found',
        error,
      });
    }
    //check file
    if(!req.file){
      return res.status(500).send({
        success:false,
        message:'product image not found '
      });
    }
  const file = getDataUri(req.file);
  const cdb = await cloudinary.v2.uploader.upload(file.content);
  const image = {
    public_id:cdb.public_id,
    url:cdb.secure_url
  };
 //save product
 product.images.push(image);
 await product.save();
 res.status(200).send({
  success:true,
  message:"product image updated"
 });

  }catch(error){
    console.log(error);
    //cast error || object id
    if(error.name === 'CastError'){
      return res.status(500).send({
        success:false,
        message:'Invalid id',
      });
    }
    res.status(500).send({
      success: false,
      message: 'Error in Update Products API',
      error,
    });
  }
};

//delete product image 
export const deleteProductImageController = async (req , res) =>{
  try{
    //find product 
    const product = await productModel.findById(req.params.id);

  
    //validation 
    if(!product){
      return res.status(404).send({
        success: false,
        message: 'Product not found',
        error,
      });
    }

    //image id find 
    const id = req.query.id;
    //validation
    if(!id){
      return res.status(404).send({
        success: false,
        message: 'Product image not found',
        error,
      });
    }

   let isExist = -1;
    product.images.forEach((item, index) => {
      if(item._id.toString() === id.toString()) isExist= index;
    });
    if(isExist < 0){
      return res.status(404).send({
        success:false,
        message:'image not found'
      });
    }
    //delete product image
    await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);
    product.images.splice(isExist,1);
    await product.save();
    return res.status(200).send({
      success:true,
      message:'Successfully delete product image',
    });
 }catch(error){
    console.log(error);
    //cast error || object id
    if(error.name === 'CastError'){
      return res.status(500).send({
        success:false,
        message:'Invalid id',
      });
    }
    res.status(500).send({
      success: false,
      message: 'Error in delete Products  image API',
      error,
    });
  }
};


//delete product 

export const deleteProductController = async(req ,res) => {
  try{
    //find product 
    const product = await productModel.findById(req.params.id);
  //validation 
  if(!product){
    return res.status(404).send({
      success: false,
      message: 'Product image not found',
    });
  }
  //find and delete image cloudinary
  for(let i = 0; i < product.images.length;i++){
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }
  await product.deleteOne();
  res.status(200).send({
    success:true,
    message:' product delete Successfully ',
  });

  }catch(error){
    console.log(error);
    //cast error || object id
    if(error.name === 'CastError'){
      return res.status(500).send({
        success:false,
        message:'Invalid id',
      });
    }
    res.status(500).send({
      success: false,
      message: 'Error in delete Products  image API',
      error,
    });
  }
};

//product review
export const productReviewController = async(req,res) => {
  try{

    const {comment ,rating} = req.body;
    //find product review
    const product = await productModel.findById(req.params.id);
    //check review 
    const alreadyReview = product.reviews.find((r) => {
      r.user.toString() === req._id.toString()});
     if(alreadyReview){
      return res.status(400).send({
        success:false,
        message:'Product alredy Reviewed',
      });
     } 
     //reviews
     const review = {
      name :req.user.name,
      rating: Number(rating),
      comment,
      user:req.user._id,
     }
//passing review objects to review array
     product.reviews.push(review);
     product.numReviews = product.reviews.length;
     product.rating = product.reviews.reduce((acc ,item) => item.rating +acc ,0) /product.reviews.length;
     //save
     await product.save();
     res.status(200).send({
      success:true,
      message:"review Added",
     });

  }catch(error){
    console.log(error);
    //cast error || object id
    if(error.name === 'CastError'){
      return res.status(500).send({
        success:false,
        message:'Invalid id',
      });
    }
    res.status(500).send({
      success: false,
      message: 'Error in review and comment   image API',
      error,
    });
  }
};