import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as Movie from '../models/movie';
import IMovie from '../interfaces/IMovie';
import { userInfo } from 'os';
import Joi from 'joi';
import { ErrorHandler } from '../helpers/errors';

const validateMovie = (req: Request, res: Response, next: NextFunction) => {
  let required: Joi.PresenceMode = 'optional';
  if ((req.method = 'POST')) {
    required = 'required';
  }
  const errors = Joi.object({
    title: Joi.string().max(255).presence(required),
    director: Joi.string().max(255).presence(required),
    year: Joi.string().max(255).presence(required),
    color: Joi.number().min(0).max(1).presence(required),
    duration: Joi.number().min(0).presence(required),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

// appeler tous les films
const getAllMovies = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const title: string = req.query.title as string;
    // const director: string = req.query.director as string;

    // destructuration des deux lignes supérieurs. nous importons IMovie(interface) dans lequel les données on été typées.
    const { title, director } = req.query as IMovie;
    const movies = await Movie.getAllMovies(title, director);
    return res.status(200).json(movies);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

const getOneMovie = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idMovie } = req.params;
    const movie = await Movie.getMovieById(Number(idMovie));
    movie ? res.status(200).json(movie) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// verifie si le film existe ou pas.
const movieExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idMovie } = req.params;
  try {
    const movie = await Movie.getMovieById(Number(idMovie));
    if (!movieExists) {
      next(new ErrorHandler(404, `This movie doesnt't exists`));
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

const addMovie = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const movie = req.body as IMovie;
    movie.id = await Movie.addMovie(movie);
    res.status(201).json(movie);
  } catch (err) {
    next(err);
  }
};

// mise à jour du film
const updateMovie = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // on récupère l'id du film
    const { idMovie } = req.params;
    const movieUpdated = await Movie.updateMovie(
      Number(idMovie),
      req.body as IMovie
    );
    if (movieUpdated) {
      const movie = await Movie.getMovieById(Number(idMovie));
      res.status(200).send(movie);
    } else {
      throw new ErrorHandler(500, 'Movie cannot be updated');
    }
  } catch (err) {
    next(err);
  }
};
// pour supprimer un film de la base de données
const deleteMovie = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //  on récupère l'id du film
    const { idMovie } = req.params;
    const movie = await Movie.getMovieById(Number(idMovie));
    const movieDeleted = await Movie.deleteMovie(Number(idMovie));
    // si le film est bien supprimé il nous retour le status
    if (movieDeleted) {
      res.status(200).send(movie);
      // sinon on recoit un message d'erreur
    } else {
      throw new ErrorHandler(500, 'This movie cannot be deleted');
    }
  } catch (err) {
    next(err);
  }
};

export default {
  validateMovie,
  getAllMovies,
  getOneMovie,
  movieExists,
  addMovie,
  updateMovie,
  deleteMovie,
};
