import connection from '../db-config';
import IMovie from '../interfaces/IMovie';

// on appel tous les films qui sont dans mon tableau de films
// async permet de continuer à naviguer tout en attendant le retour de la requete.
const getAllMovies = async (): Promise<IMovie[]> => {
  let sql = `SELECT * FROM movies`;
  const results = await connection.promise().query<IMovie[]>(sql);
  return results[0];
};

// on appelle le film par son id

const getMovieById = async (idMovie: number): Promise<IMovie> => {
  const [results] = await connection
    .promise()
    .query<IMovie[]>('SELECT * FROM movies where id = ?', [idMovie]);
  return results[0];
};

export { getAllMovies, getMovieById };
