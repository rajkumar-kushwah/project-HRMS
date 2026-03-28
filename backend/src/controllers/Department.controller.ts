import {type Request, type Response } from "express";
import { prisma } from "../config/db.ts";



// create department
export const createDepartment = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        const department = await prisma.department.create({
            data: {name},
        })

        res.status(201).json({ message: 'Department created successfully', department: department });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

// get and search (teble filter)
export const getDepartments = async (req: Request, res: Response) =>{
    try {
        const { search } = req.query;

        const departments = await prisma.department.findMany({
            where: search ? {
                name: {
                    contains: String(search),
                    mode: 'insensitive',
                },
            } 
            : {},
        });
        res.status(200).json({ message: 'Departments fetched successfully', departments: departments });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

// update department
export const updateDepartment = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { name } = req.body;

        const department = await prisma.department.update({
            where: { id }, 
            data: { name },
        })

        res.status(200).json({ message: 'Department updated successfully', department: department });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error }); 
    }
}


// delete department 
export const deleteDepartment = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        
        await prisma.department.delete({
            where: { id },
        })

        res.status(200).json({ message: 'Department deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}


