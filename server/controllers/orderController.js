import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";

//create order 
export const createOrderController = async (req ,res) => {
  try{
    const {shippingInfo,orderItems,paymentMethod,paymentInfo,itemPrice,tax,shippingCharges,totalAmount} = req.body;
    const user = req.user.id; 
    //validation 
    if(!shippingInfo || !orderItems || !itemPrice || !tax || !shippingCharges || !totalAmount || !user) {
      return res.status(404).send({
        success: false,
        message: 'Error in validation of order API',
      });
    }

    //create order 
    await orderModel.create( {shippingInfo,orderItems,paymentMethod,user,paymentInfo,itemPrice,tax,shippingCharges,totalAmount} );
    


    //stock update
    for(let i = 0; i < orderItems; i++){
      //find product 
      const product = await productModel.findById(orderItems[i].product);
      product.stock -= orderItems[i].quantity;
      await product.save();
    }
    res.status(200).send({
      success:true,
      message:"Order Place Successfully"
    })
  }catch(error){
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in creating order API',
      error,
    })
  }
};

//get all orders - my orders
export const getMyOrderController = async(req, res) =>{
  try{
    //find order 
    const orders = await orderModel.find({user:req.user._id});
    //validation 
    if(!orders){
      return res.status(404).send({
        success: false,
        message: 'Order Not Found'
      });
    }

    res.status(200).send({
      success: true,
      message: 'Yopur order data',
      totalOrder: orders.length,
      orders,

    });
  }catch(error){
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in creating order API',
      error,
    })
  }
};

//get single order info
export const getSingleOrderController = async(req, res) =>{
  try{
    //find order 
    const order = await orderModel.findById(req.params.id);
    //validation 
    if(!order){
      return res.status(404).send({
        success: false,
        message: 'Order Not Found'
      });
    }

    res.status(200).send({
      success: true,
      message: 'Your order data',
      order,
    });
  }catch(error){
    console.log(error);
    //cast error to error
    if(error.name === "CastError"){
      return res.status(500).send({
        success: false,
        message: 'Invalid Id',
        error,
      });
    }
    res.status(500).send({
      success: false,
      message: 'Error in creating order API',
      error,
    })
  }
};

//============admin get order================================

//get all order models
export const getAllOrderController = async(req,res) => {
  try{
    const  orders = await orderModel.find({});
    res.status(200).send({ 
      success:true,
      message:'All Orders  Data',
      totalOrders :orders.length,
      orders,
    });
  }catch(error){
      console.log(error);
      res.status(500).send({
        success: false,
        message: 'Error in creating order API',
        error,
      })
    }
};

//Change order Status
export const changeOrderStatusController = async(req,res) => {
  try{
    //find order
    const order = await orderModel.findById(req.params.id);
    console.log(order);
    //validations
    if(!order){
      return res.status(404).send({
        success: false,
        message: 'Order Not found',
      });
    }

    if(order.orderStatus === 'processing') order.orderStatus = 'shipped';
    else if(order.orderStatus === 'shipped'){
       order.orderStatus = 'delivered'; 
       order.deliverdAt = Date.now();
      }
      else{
        return res.status(500).send({
          success:false,
          message:"Order already deliverd"
        });
      }
      await order.save();
      res.status(200).send({
        success:true,
        message:"order status Updated"
      })
  }catch(error){
    console.log(error);
    //cast error to error
    if(error.name === "CastError"){
      return res.status(500).send({
        success: false,
        message: 'Invalid Id',
        error,
      });
    }
    res.status(500).send({
      success: false,
      message: 'Error in creating order API',
      error,
    })
  }
};