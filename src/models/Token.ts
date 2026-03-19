import mongoose, { Schema, Document, Types } from "mongoose"

export interface IToken extends Document {
    token: string
    user: Types.ObjectId
    createdAt: Date
}

const tokenSchema: Schema = new Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: Types.ObjectId,
        ref: 'User'
    },
    expiresAt: {
        type: Date,
        default: Date.now,  // sin paréntesis — se ejecuta cada vez que se crea un token
        expires: '30m'      // subido de 10 a 30 minutos
    }
})

const Token = mongoose.model<IToken>('Token', tokenSchema)
export default Token