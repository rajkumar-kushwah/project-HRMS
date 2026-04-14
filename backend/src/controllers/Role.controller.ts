import { type Request, type Response } from "express";
import { prisma } from "../config/db.ts";



//  create role and permission assign

export const createRole = async (req: Request, res: Response) => {
    try {
        const { name, description, permissions } = req.body;

        if (!name || !description || !permissions) {
            return res.status(400).json({ message: 'Role name and permissions is required' });
        }

        const role = await prisma.role.create({
            data: {
                name,
                description,
                permissions: {
                    connect: permissions.map((id: number) => ({
                        id: Number(id)
                    }))
                }
            },
            include: {
                permissions: true
            }
        });

        res.status(201).json({ message: 'Role created successfully', data: role });


    } catch (error) {
        const err = error as { code?: string };
        if (err.code === 'P2002') {
            return res.status(400).json({ message: 'Role name already exists' });
        }
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};

//  get roles and permissions assign

export const getRole = async (req: Request, res: Response) => {
    try {
        const roles = await prisma.role.findMany({
            include: {
                permissions: true
            }
        });

        res.status(200).json({ message: 'Roles fetched successfully', data: roles });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

//  update role and permission assign

export const updateRole = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { name, description, permissions } = req.body;

        if (!name || !description || !permissions) {
            return res.status(400).json({ message: 'Role name and permissions is required' });
        }

        const role = await prisma.role.update({
            where: { id },
            data: {
                name,
                description,
                permissions: {
                    set: permissions.map((id: number) => ({
                        id: Number(id)
                    }))
                }
            },
            include: {
                permissions: true
            }
        })

        res.status(200).json({ message: 'Role updated successfully', data: role });

    } catch (error) {

        const err = error as { code?: string };
        if (err.code === 'P2002') {
            return res.status(400).json({ message: 'Role name already exists' });
        }

        if (err.code === 'P2025') {
            return res.status(400).json({ message: 'Role not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
}

// delete role and permission assign deleted

export const deleteRole = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!id) {
            return res.status(400).json({ message: 'Role id is required' });
        }
        const role = await prisma.role.findUnique({
            where: { id },
            include: {
                permissions: true
            }
        })

        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }

        if (role.name === 'SUPER_ADMIN') {
            return res.status(403).json({ message: 'Super admin role cannot be deleted' });
        }

        await prisma.role.delete({
            where: { id },
        })

        res.status(200).json({ message: 'Role deleted successfully' });

    } catch (error) {
        const err = error as { code?: string };
        if (err.code === 'P2025') {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
}