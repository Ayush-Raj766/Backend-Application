import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME ,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET ,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const uploadResult = await cloudinary.uploader
       .upload(
           localFilePath , {
               resource_type: "auto",
           }
       )
       .catch((error) => {
           console.log(error ,"error in upload");
       });
    
    // console.log("file ho gya upload" ,uploadResult.url);
    fs.unlinkSync(localFilePath);
    return uploadResult
    } catch (error) {
        fs.unlinkSync(localFilePath) 
        //remove kar de raha hai locllu stored temp file ko agr upload nahi hua to
        return null
    }
    
}

export {uploadOnCloudinary}