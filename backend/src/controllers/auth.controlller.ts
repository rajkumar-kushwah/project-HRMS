
import { prisma } from "../config/db.ts";
import bcrypt from "bcrypt";



// signup controller
export const signup = async (req: any, res: any) => {
    const { name, email, password } = req.body;
    try {
        const users = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (users) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        // 2. check user count   super admin can create user
        const userCount = await prisma.user.count();

        let role;

        if (userCount === 0) {
            role = await prisma.role.findFirst({
                where: { name: "SUPER_ADMIN" }
            });
        } else {
            role = await prisma.role.findFirst({
                where: { name: "EMPLOYEE" }   // default role
            });
        }

        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                roles: {
                    connect: { id: role.id }
                }
            }
        });
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// signin controller 
export const signin = async (req: any, res: any) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }
        
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                roles: {
                    include: {
                        permissions: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }


        // console.log("user", JSON.stringify(user.roles, null, 2));

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });

        console.log(JSON.stringify(user.roles, null, 2));
        // Store the user ID in the session


        (req.session as any).userId = user.id;


        const permission = [
            ...new Set(
                user.roles.flatMap((role: any) =>
                    role.permissions.map((p: any) => p.name)
                )
            )
        ];

        return res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                roles: user.roles.map((role: any) => role.name),
                permission
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// logout controller
export const logout = async (req: any, res: any) => {
    try {

        if (!(req.session as any).userId) {
            return res.status(401).json({ message: "Not authorized" });
        }

        req.session.destroy((err: any) => {
            if (err) {
                return res.status(500).json({ message: 'Logout failed' });
            }

            res.clearCookie('connect.sid');
            return res.status(200).json({ message: 'Logout successful' });
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// delete user
export const deleteUser = async (req: any, res: any) => {
    try {
        const userId = req.session.userId;
        const user = await prisma.user.delete({
            where: { id: userId },
        })
        res.status(200).json({ message: 'User deleted successfully', user: user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// update user
export const UpdateUser = async (req: any, res: any) => {
    try {
        const id = Number(req.params.id);
        const { name, email, password } = req.body;
        const UpdateUser = await prisma.user.update({
            where: { id },
            data: { name, email, password },
        })
        res.status(200).json({ message: 'User updated successfully', user: UpdateUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }

};

