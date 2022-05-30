import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as User from '../models/user';

const getAllUsers = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.getAllUsers();
    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

const getOneUser = (async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idUser } = req.params;
    const user = await User.getUserById(Number(idUser));
    user ? res.status(200).json(user) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

export default {
  getAllUsers,
  getOneUser,
};
