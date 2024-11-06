import  express from "express";
import morgan from 'morgan';
import colors from "colors";
import cors from "cors";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";

//routes imports
import testRoutes from './routes/testRoutes.js';
import userRoutes from './routes/userRoutes.js';
import connectDB from "./config/db.js";
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

//dot env config
dotenv.config();

//database connections 
connectDB();

//cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

//rest object
const app = express();

//middleware 
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//router 
app.use('/api/v1',testRoutes);
app.use('/api/v1/user',userRoutes);
app.use('/api/v1/product',productRoutes);
app.use('/api/v1/cat',categoryRoutes);
app.use('api/v1/order', orderRoutes);



app.get('/',(req,res) => {
  return res.status(200).send("<h1>Hello </h1>");
});

//port 
const PORT = process.env.PORT || 8081;

//listen 
app.listen(PORT, (req, res) => {
  console.log(`server running on PORT : ${PORT} on ${process.env.NODE_ENV}`.bgMagenta.white);
});