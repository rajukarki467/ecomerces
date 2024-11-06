import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";


//create category 
export const  createCategory =async (req,res) =>{
  try{
    const {category} = req.body;

    //validation 
    if(!category){
      return res.status(404).send({
        success: false,
        message: 'Category not found'
      });
    }
    await categoryModel.create({category});
    res.status(201).send({
      success: true,
      message: `${category} category create Successfully!!`,
    });

  }catch(error){
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'error in create CAT API'
    });
  }
};

//get all category 
export const getAllCategoryControllers = async (req,res) => {
  try{
    const categories = await  categoryModel.find({});
    res.status(200).send({
      success:true,
      message:'Categories Fetch Successfully',
      totalcat: categories.length,
      categories,
    });

    }catch(error){
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'error in get all  CAT API'
    });
  }
};

//deete category controller

export const deleteCategoryController = async (req,res) => {
try{
  //find category controller
  const category = await categoryModel.findById(req.params.id);
  //validation 
  if(!category){
    return res.status(404).send({
      success: false,
      message: 'Category not found'
    });
  }
  //find product with this category id 
  const products = await productModel.find({category:category._id});
  //update product category 
  for(let i =0;i<products.length;i++){
    const product = products[i];
    product.category = undefined;
    await product.save();
  }
  //delete
  await category.deleteOne();
  res.status(200).send({
    success:true,
    message:'Category Delete Successfully',
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

// update all category
export const updateCategoryController = async(req, res) => {
  try{
    //find category controller
    const category = await categoryModel.findById(req.params.id);
    //validation 
    if(!category){
      return res.status(404).send({
        success: false,
        message: 'Category not found'
      });
    }
    const {updatedCategory} = req.body;
    //find product with this category id 
    const products = await productModel.find({category:category._id});
    //update product category 
    for(let i =0;i<products.length;i++){
      const product = products[i];
      product.category = updatedCategory;
      await product.save();
    }

    if(updatedCategory) category.category = updatedCategory;
    //update category
    await category.save();
    res.status(200).send({
      success:true,
      message:'Category Update Successfully',
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
      message: 'Error in update Products API',
      error,
    });
  }
};