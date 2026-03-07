import express from "express";
import { prisma } from "../config/db.ts";
import bcrypt from "bcrypt";


const authController = express.Router();
export default authController;

// signup controller

export const signup = authController.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const users = await prisma.user.findUnique({
            where: {
                name: name,
                email: email
            }
        })
        if (users) {
           return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
})

// login controller 

export const login = authController.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password ' });
        }

        // const token = generateToken(user.id); 

        // Store the user ID in the session

        (req.session as any).userId = user.id;


        return res.status(200).json({
            message: 'Login successful',
            // token,
            user: {
                id: user.id,
                email: user.email,

            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
});

// logout controller

export const logout = authController.post('/logout', async (req, res) => {
    try {
       req.session.destroy((err) => {
        if(err){
            return res.status(500).json({ message: 'Logout failed' });
        }

        res.clearCookie('connect.sid');
        return res.status(200).json({ message: 'Logout successful' });
       });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'logout failed' });
    }
})


export const deleteUser = authController.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleteUser = await prisma.user.delete({
            where: {
                id: Number(id)
            }
        })
        res.status(200).json({ message: 'User deleted successfully', user: deleteUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
})







// import express from "express";
// import { prisma } from "../config/db.ts";
// import bcrypt from "bcrypt";
// import { generateToken } from "../utilis/generateToken.ts";


// const authController = express.Router();
// export default authController;


// export const signup = authController.post('/signup', async (req, res) => {
//     const { name, email, password } = req.body;
//     try {
//         const users = await prisma.user.findUnique({
//             where: {
//                 name: name,
//                 email: email
//             }
//         })
//         if (users) {
//            return res.status(400).json({ message: 'User already exists' });
//         }
//         const hashedPassword = await bcrypt.hash(password, 10);

//         const newUser = await prisma.user.create({
//             data: {
//                 name,
//                 email,
//                 password: hashedPassword
//             }
//         });
//         res.status(201).json({ message: 'User created successfully', user: newUser });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Something went wrong' });
//     }
// })

// export const login = authController.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const user = await prisma.user.findUnique({
//             where: { email }
//         });

//         if (!user) {
//             return res.status(401).json({ message: 'User not found' });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(401).json({ message: 'Invalid password ' });
//         }

//         const token = generateToken(user.id); 

       


//         return res.status(200).json({
//             message: 'Login successful',
//             token,
//             user: {
//                 id: user.id,
//                 email: user.email,

//             }
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Something went wrong' });
//     }
// });


// export const logout = authController.post('/logout', async (req, res) => {
//     // token based logout
// try {
//     res.clearCookie('token');
//     res.status(200).json({ message: 'Logout successful' });
// } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Logout failed' });
// }
     
// })