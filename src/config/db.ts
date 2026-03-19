import mongoose from 'mongoose'
import colors from 'colors'
import { exit } from 'node:process';

export const connectDB = async () => {
    try {
        const {connection} = await mongoose.connect(process.env.DATA_BASE)
        const url = `${connection.host}:${connection.port}`
        console.log(colors.magenta.bold(`MongoDB Conectado en: ${url}`))
    } catch (error) {
        // console.log(error.message)
        console.log( colors.red.bold('Error al conectar a MongoDB') )
        console.log(error)
        exit(1)
    }
}