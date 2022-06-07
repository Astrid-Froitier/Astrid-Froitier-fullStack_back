import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as User from '../models/user';
import IUser from '../interfaces/IUser';
import Joi, { optional } from 'joi';
import { nextTick } from 'process';
import { ErrorHandler, handleError } from '../helpers/errors';
import { userInfo } from 'os';

const emailIsFree = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body as IUser;
  const userExists = await User.getUserByEmail(email);
  if (userExists) {
    next(new ErrorHandler(400, 'This email already exist'));
  } else {
    next();
  }
};
const validateUser = (req: Request, res: Response, next: NextFunction) => {
  let required: Joi.PresenceMode = 'optional';
  if ((req.method = 'POST')) {
    required = 'required';
  }
  const errors = Joi.object({
    firstname: Joi.string().max(255).presence(required),
    lastname: Joi.string().max(255).presence(required),
    email: Joi.string().email().max(255).presence(required),
    city: Joi.string().max(255).optional(),
    language: Joi.string().max(255).optional(),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

const getAllUsers = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const firstname: string = req.query.firstname as string;
    // const lastname: string = req.query.lastname as string;

    // destructuration des deux lignes supérieurs. nous importons IMovie(interface) dans lequel les données on été typées.
    const { firstname, lastname } = req.query as IUser;
    const users = await User.getAllUsers(firstname, lastname);
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

// vérifie si le user existe ou pas
const userExists = (async (req: Request, res: Response, next: NextFunction) => {
  // on récupère l'id du user
  const { idUser } = req.params;
  try {
    const user = await User.getUserById(Number(idUser));
    if (!userExists) {
      next(new ErrorHandler(404, `This user doesn't exist`));
    } else {
      // req.record = userExists;
      next();
    }
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

const addUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.body as IUser;
    user.id = await User.addUser(user);
    // il prend l'objet qu'il transforme en constante user et ensuite il rajoute au user l'id qui correspont à l'insert ID de la requete (resultat de la fonction du model)
    // on rajoute l'id au reste des informations contenu dans le model/ interface.
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idUser } = req.params;
    const userUpdated = await User.updateUser(
      Number(idUser),
      req.body as IUser
    );
    if (userUpdated) {
      const user = await User.getUserById(Number(idUser));
      res.status(200).send(user);
    } else {
      throw new ErrorHandler(500, `User cannot be updated`);
    }
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //  récupère l'id de user
    const { idUser } = req.params;
    //  véfifie si user exite ou pas
    const user = await User.getUserById(Number(idUser));
    const userDeleted = await User.deleteUser(Number(idUser));
    if (userDeleted) {
      res.status(200).send(user);
    } else {
      throw new ErrorHandler(500, 'This user cannot be deleted');
    }
  } catch (err) {
    next(err);
  }
};

export default {
  emailIsFree,
  validateUser,
  getAllUsers,
  getOneUser,
  userExists,
  addUser,
  updateUser,
  deleteUser,
};
