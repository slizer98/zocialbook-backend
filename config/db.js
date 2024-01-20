import mongoose from "mongoose";
import colors from "colors";

export const db = async() => {
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            writeConcern: {
                w: 'majority',
                j: true,
                wtimeout: 1000
            }
        })
        const url = `${db.connection.host}:${db.connection.port}`
        console.log(colors.cyan(`MongoDB connected correctly: ${colors.yellow(url)}`))
    } catch (error) {
        console.log(`Error: ${error.message}`) 
        process.exit(1)
    }
}