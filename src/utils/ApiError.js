class ApiError extends Error {
     constructor(
         message="Something went wrong",
         statusCode ,
         errors =[],
         stacks = ""
     ) {
         super(message);
         this.data =null;
         this.message = message;
         this.success = false;
         this.statusCode = statusCode || 500;
         this.errors = errors;
         
         if (stacks) {
            this.stacks = stacks
         }
         else {
            Error.captureStackTrace(this,this.constructor)
         }
     }

}

export {ApiError};
