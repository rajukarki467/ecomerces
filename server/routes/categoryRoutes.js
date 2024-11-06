import express from 'express';
import { isAuth } from '../middlewares/authMiddleware.js';
import { createCategory, deleteCategoryController, getAllCategoryControllers, updateCategoryController } from '../controllers/categoryController.js';


const router =  express.Router();

//routes

//create category
router.post('/create',isAuth,createCategory);

//get all category
router.get('/get-all',getAllCategoryControllers);

//delete category
router.delete('/delete/:id',isAuth,deleteCategoryController);

//update all category
router.put('/update/:id',isAuth,updateCategoryController);

export default router;