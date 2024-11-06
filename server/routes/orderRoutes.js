import express from 'express';
import { isAdmin, isAuth } from '../middlewares/authMiddleware.js';
import { changeOrderStatusController, createOrderController, getAllOrderController, getMyOrderController, getSingleOrderController } from '../controllers/orderController.js';



const router =  express.Router();

//routes

//create order
router.post('/create',isAuth,createOrderController);

//get all orsers
router.get('/my-orders',isAuth,getMyOrderController);

//get all orsers
router.get('/my-orders/:id',isAuth,getSingleOrderController);



//=================ADMIN==========================================
//get all orders
router.get('/admin/get-all-orders' ,isAuth,isAdmin,getAllOrderController);

//change order status
router.put('/admin/order/:id',isAuth,isAdmin,changeOrderStatusController);


export default router;