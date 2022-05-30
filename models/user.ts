import connection from '../db-config';
import IUser from '../interfaces/IUser';

// on appel tous les users de notre tableau de users
const getAllUsers = async (): Promise<IUser[]> => {
  console.log('get');

  let sql = `SELECT * FROM users`;
  const results = await connection.promise().query<IUser[]>(sql);
  return results[0];
};

// on appel un user par son identifiant.
const getUserById = async (idUser: number): Promise<IUser> => {
  const [results] = await connection
    .promise()
    .query<IUser[]>('SELECT * FROM users WHERE id = ?', [idUser]);
  return results[0];
};

export { getAllUsers, getUserById };
