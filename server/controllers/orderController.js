

//create order 
export const createOrderController = async(req ,res) => {
  try{
    const {} = req.body;

  }catch(error){
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in creating order API',
      error,
    })
  }
};