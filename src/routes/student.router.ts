
// External Dependencies

import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import Student from "../models/student";

// Global Config

export const studentRouter = express.Router();

studentRouter.use(express.json())

// GET

studentRouter.get("/", async (_req: Request, res: Response) => {
    try {
       const student = (await collections.student.find({}).toArray()) as Student[];

        res.status(200).send(student);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

studentRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        
        const query = { _id: new ObjectId(id) };
        const student = (await collections.student.findOne(query)) as Student;

        if (student) {
            res.status(200).send(student);
        }
    } catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
});

// POST
studentRouter.post("/", async (req: Request, res: Response) => {
    try {
        const newStudent = req.body as Student;
        const result = await collections.student.insertOne(newStudent);

        result
            ? res.status(201).send(`Successfully created a new game with id ${result.insertedId}`)
            : res.status(500).send("Failed to create a new game.");
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

// PUT

studentRouter.put("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const updatedStudent: Student = req.body as Student;
        const query = { _id: new ObjectId(id) };
      
        const result = await collections.student.updateOne(query, { $set: updatedStudent });

        result
            ? res.status(200).send(`Successfully updated game with id ${id}`)
            : res.status(304).send(`Game with id: ${id} not updated`);
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});

// DELETE

studentRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectId(id) };
        const result = await collections.student.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed game with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove game with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Game with id ${id} does not exist`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});