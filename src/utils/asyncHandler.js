// const asyncHandler =(requestHandler)=>{
//     (req ,res , nxt)=>{
//          Promise.resolve(requestHandler(req,res)).catch((err)=>nxt(err))
//     }
// }



const asyncHandler =(fn)=>async(req , res ,nxt)=>{

    try {
        await fn(req , res ,nxt)
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            msg: error.message})
    }
}



export { asyncHandler}
