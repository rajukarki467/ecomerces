import express from 'express';
import { isAuth } from '../middlewares/authMiddleware.js';
import { createProductController, deleteProductController, deleteProductImageController, getAllProductsController, getSingleProductController, updateProductController, updateProductImageController } from '../controllers/productController.js';
import { singleUpload } from '../middlewares/multer.js';

const router =  express.Router();

//routes

//get all products
router.get('/get-all',getAllProductsController);

//get single product
router.get('/:id',getSingleProductController);

//create product 
router.post('/create',isAuth,singleUpload,createProductController);

//update product 
router.put('/:id',isAuth,updateProductController);

//update product  image
router.put('/image/:id',isAuth,singleUpload,updateProductImageController);

//delete product image upload
router.delete('/delete-image/:id',isAuth ,deleteProductImageController);

//delete product image upload
router.delete('/delete/:id',isAuth ,deleteProductController);

export default router;