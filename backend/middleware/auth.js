import jwt from "jsonwebtoken";

export const verifyToken = (req,res,next) =>{
    try{
        const token = req.header("Authorization")?.replace("Bearer ","") || req.cookies?.token;
        if(!token){
            return res.status(401).json({message:"No token, authorization denied"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id:decoded._id || decoded.id,
            name:decoded.name,
            email: decoded.email,
            role: decoded.role,
        };
        next();
    }catch(error){
        console.error("JWT Error:", error.message);
        return res.status(401).json({message:"Invalid or expired token"})
    }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
