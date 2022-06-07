import studentsController from './controllers/students';
import usersController from './controllers/users';
import moviesController from './controllers/movies';
import { Express } from 'express';

const setupRoutes = (server: Express) => {
  server.get('/coucou', (req, res) => {
    res.status(200).json('hibou');
  });
  // STUDENTS
  // get students
  server.get('/api/students', studentsController.getAllStudents);
  // get students by id
  server.get('/api/students/:idStudent', studentsController.getOneStudent);

  // USERS
  // get users
  server.get('/api/users', usersController.getAllUsers);
  // get user by id
  server.get('/api/users/:idUser', usersController.getOneUser);
  // post user pour ajouter un nouvel utilisateur
  server.post(
    '/api/users',
    usersController.validateUser,
    usersController.emailIsFree,
    usersController.addUser,
    usersController.updateUser
  );
  server.put(
    '/api/users/:idUser',
    usersController.validateUser,
    usersController.userExists,
    usersController.updateUser
  );

  server.delete(
    '/api/users/:idUser',
    usersController.userExists,
    usersController.deleteUser
  );

  // MOVIES
  // get movies
  server.get('/api/movies', moviesController.getAllMovies);
  // get movie by id
  server.get('/api/movies/:idMovie', moviesController.getOneMovie);
  // post movie pour ajouter un nouveau film
  server.post(
    '/api/movies',
    moviesController.validateMovie,
    moviesController.addMovie,
    moviesController.updateMovie
  );
  server.put(
    '/api/movies/:idMovie',
    moviesController.validateMovie,
    moviesController.addMovie,
    moviesController.updateMovie
  );

  server.delete(
    '/api/movies/:idMovie',
    moviesController.movieExists,
    moviesController.deleteMovie
  );
};

export default setupRoutes;
