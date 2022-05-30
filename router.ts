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

  // MOVIES
  // get movies
  server.get('/api/movies', moviesController.getAllMovies);
  // get movie by id
  server.get('/api/movies/:idMovie', moviesController.getOneMovie);
};

export default setupRoutes;
