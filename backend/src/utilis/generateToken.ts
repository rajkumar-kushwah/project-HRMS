import Jwt from "jsonwebtoken";

export const generateToken = (userId: number )=> {
    return Jwt.sign(
        {id: userId},
        process.env.JWT_SECRET as string,
        {expiresIn: '7d'}
    );
};