import { Request, Response } from "express";

export const Log = async (req: Request, res: Response) => {
    console.log("Log");
    res.send("Logged");
};