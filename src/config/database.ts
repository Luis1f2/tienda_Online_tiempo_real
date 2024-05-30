import mongoose from 'mongoose';
import dotenv from 'dotenv'


dotenv.config();

const connectDB = async ()=>{

    try{
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`Mongod conectado exitosamente ${conn.connection.host}`);
    }catch( error ){
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        } else {
            console.error('algo esta mal revisalo por favor a lo mejor no lo encendiste :v', error);
        }
        process.exit(1);
    };
};

export default connectDB;