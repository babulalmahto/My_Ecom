import jwt from 'jsonwebtoken';
import usersModel from '../model/usersModel.js';


export let isRequire = async (req, res, next) => {
    try {
        console.log("***********");
        let decode = await jwt.verify(req.headers.authorization, process.env.SECRET_KEY)

        req.user = decode
        console.log('hello I am decode', decode)
        if (!decode) {
            res.status(200).send({ message: "Unauthorized User" })
        }
        next()
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "User is not Authorized" })

    }
}

export let isAdmin=async(req,res,next)=>{
    try {
      let userData=await usersModel.findById({_id:req.user._id});
      console.log('************')
      if(userData.role===true){
         next()  
      }
    } catch (error) {
     res.status(200).send({message:"User is not Authorized"})
     
    }
 }