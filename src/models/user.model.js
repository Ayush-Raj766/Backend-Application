import mongoose, { Schema } from "mongoose";
import  jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    avatar: {
        type: String, //cloudinary
        required: true,
    },
    coverImage: {
        type: String,

    },
    watchhistory: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Video'
        }

    ],
    password: {
        type: String,
        required: [true,"password is required"],
        minlength: 8,
        // select: false,
    },
    refreshToken:{
        type: String,
    }

},{timestamps: true})

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next()
    this.password =await bcrypt.hash(this.password,10)
    next()
})
userSchema.method.isPasswordCorrect= async function(password) {
    return await bcrypt.compare(password,this.password)
}
userSchema.method.generateAccessToken= async function(){
    jwt.sign({
        _id:this._id,
        username:this.username,
        email:this.email,
        fullname:this.fullname,
        // avtar:this.avtar,
        // coverImage:this.coverImage,
    },
     process.env.ACCESS_TOKEN_SECRET,
     {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
     }
)
}

userSchema.method.generateRefreshToken= async function(){
    jwt.sign({
        _id:this._id,
    },
     process.env.REFRESH_TOKEN_SECRET,
     {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
     }
)
}

export const User = mongoose.model('User', userSchema)