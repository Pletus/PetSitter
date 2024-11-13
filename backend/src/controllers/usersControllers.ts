import { Request, Response } from "express";
import { pool } from "../connect";
import { asyncHandler } from "../middleware/asyncHandler";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, phone } = req.body;
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(200).json(userExists.rows[0]);
    }

    const result = await pool.query(
      "INSERT INTO users (name, email, phone) VALUES ($1, $2, $3) RETURNING *",
      [name, email, phone]
    );
    return res.status(201).json(result.rows[0]);
  })