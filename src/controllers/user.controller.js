import {ApiError} from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudnary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
  // res.status(201).json({
  //     message:"chai piye"
  // });

  const { fullname, email, username, password } = req.body;

  console.log("email", email);

  // if(fullname ===""){
  //     throw new ApiError(400 ,"fullname is required")
  // }
  //ek ek kar k v if statement laga sakte hai

  if (
    [fullname, email, username, password].some((field) => {
      field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fileds are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username } , { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path
  }

  if (!avatarLocalPath){
    throw new ApiError(400, "Avatar is required");
  }

 const avatar=  await uploadOnCloudinary(avatarLocalPath)
 const coverImage=  await uploadOnCloudinary(coverImageLocalPath)
  if (!avatar) {
    throw new ApiError(400 , "Avatar is required");

  }

  const user = await User.create({
    fullname,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),

  })
  
  const createdUser =await User.findById(user._id).select("-password -refreshToken")

  if(!createdUser) {
    throw new ApiError(500, "Wrong in registring user")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser ,"user Registered successfully")
  )
});
export { registerUser };
