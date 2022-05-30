import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as Movie from '../models/movie';

// appeler tous les films
const getAllMovies = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const movies = await Movie.getAllMovies();
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

export default {
  getAllMovies,
  getOneMovie,
};
