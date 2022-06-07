import { ResultSetHeader } from 'mysql2';
import connection from '../db-config';
import IMovie from '../interfaces/IMovie';

// on appel tous les films qui sont dans mon tableau de films
// async permet de continuer à naviguer tout en attendant le retour de la requete.
const getAllMovies = async (
  title: string = '',
  director: string = ''
): Promise<IMovie[]> => {
  let sql: string = `SELECT * FROM movies`;
  const sqlValues: string[] = [];
  // si je recherche par le titre uniquement.
  if (title) {
    sql += ' WHERE title LIKE ?';
    sqlValues.push(`%${title}%`);
  }
  // si je cherche le directeur mais qu'avant je cherche je cherche le titre (un si dans un si)
  if (director) {
    if (title) {
      sql += ' AND director LIKE ?';
    } else {
      sql += ' WHERE director LIKE ?';
    }
    sqlValues.push(`%${director}%`);
  }
  const results = await connection.promise().query<IMovie[]>(sql, sqlValues);
  return results[0];
};

// on appelle le film par son id

const getMovieById = async (idMovie: number): Promise<IMovie> => {
  const [results] = await connection
    .promise()
    .query<IMovie[]>('SELECT * FROM movies where id = ?', [idMovie]);
  return results[0];
};

const addMovie = async (movie: IMovie): Promise<number> => {
  const result = await connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO movies (title, director, year, color, duration) VALUES( ?, ?, ?, ?, ?)',
      [movie.title, movie.director, movie.year, movie.color, movie.duration]
    );
  console.log(result[0]);
  return result[0].insertId;
};

const updateMovie = async (
  idMovie: number,
  movie: IMovie
): Promise<boolean> => {
  let sql = 'UPDATE movie SET';
  const sqlValues: Array<string | number | boolean> = [];
  let oneValue = false;

  if (movie.title) {
    sql += ' title = ?';
    sqlValues.push(movie.title);
    oneValue = true;
  }
  if (movie.director) {
    sql += oneValue ? ' director = ?' : 'director = ?';
    sqlValues.push(movie.director);
    oneValue = true;
  }
  if (movie.year) {
    sql += oneValue ? ' year = ?' : 'year = ?';
    sqlValues.push(movie.year);
    oneValue = true;
  }
  if (movie.color) {
    sql += oneValue ? ' color = ?' : 'color = ?';
    sqlValues.push(movie.color);
    oneValue = true;
  }
  sql += ' WHERE id = ?';
  sqlValues.push(idMovie);

  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FORM users WHERE id = ?', [idMovie]);
  return results[0].affectedRows === 1;
};

const deleteMovie = async (idMovie: number): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM movies WHERE id = ?', [idMovie]);
  return results[0].affectedRows === 1;
};

export { getAllMovies, getMovieById, addMovie, updateMovie, deleteMovie };
