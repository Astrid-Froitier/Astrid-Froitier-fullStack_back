import connection from '../db-config';
import IUser from '../interfaces/IUser';
import { ResultSetHeader } from 'mysql2';
import { Request, Response, NextFunction } from 'express';
import { ErrorHandler } from '../helpers/errors';

// on vérifie que le mail est unique.
const emailIsFree = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.body as IUser;
  // on verifie que le mail n'est pas attribué
  const userExists: IUser = await getUserByEmail(user.email);
  // si oui => erreur
  if (userExists) {
    next(new ErrorHandler(409, 'This email already exist'));
  } else {
    next();
  }
};

// on appel tous les users de notre tableau de users
const getAllUsers = async (
  firstname: string = '',
  lastname: string = ''
): Promise<IUser[]> => {
  let sql = `SELECT * FROM users`;
  const sqlValues: string[] = [];

  // si je recherche par le prénom uniquement.
  if (firstname) {
    sql += ' WHERE firstname LIKE ?';
    sqlValues.push(`%${firstname}%`);
  }

  // si je cherche le nom mais qu'avant je cherche je cherche le prénom (un si dans un si).
  if (lastname) {
    if (firstname) {
      sql += ` AND lastname LIKE ?`;
    } else {
      sql += ` WHERE lastname LIKE ?`;
    }
    sqlValues.push(`%${lastname}%`);
  }
  const results = await connection.promise().query<IUser[]>(sql, sqlValues);
  return results[0];
};

// on appel un user par son identifiant.
const getUserById = async (idUser: number): Promise<IUser> => {
  const [results] = await connection
    .promise()
    .query<IUser[]>('SELECT * FROM users WHERE id = ?', [idUser]);
  return results[0];
};

const addUser = async (user: IUser): Promise<number> => {
  const result = await connection
    .promise()
    // ResultSetHeader contient les infos de la requete (insertId, affectedRows...)
    .query<ResultSetHeader>(
      'INSERT INTO users (firstname, lastname, email, city, language) VALUES ( ?, ?, ?, ?, ?)',
      [user.firstname, user.lastname, user.email, user.city, user.language]
    );
  console.log(result[0]);
  return result[0].insertId;
};

// on récupère le user grace à son email.
const getUserByEmail = async (email: string): Promise<IUser> => {
  const [results] = await connection
    .promise()
    .query<IUser[]>(
      'SELECT id, email, firstname, lastname FROM user WHERE email = ?',
      [email]
    );
  return results[0];
};

const updateUser = async (idUser: number, user: IUser): Promise<boolean> => {
  let sql = 'UPDATE user SET';
  const sqlValues: Array<string | number | boolean> = [];
  let oneValue = false;

  if (user.firstname) {
    sql += 'firstname = ?';
    sqlValues.push(user.firstname);
    oneValue = true;
  }
  if (user.lastname) {
    sql += oneValue ? ', lastname = ?' : ' lastname = ?';
    sqlValues.push(user.lastname);
    oneValue = true;
  }
  if (user.email) {
    sql += oneValue ? ', email = ?' : ' email =  ?';
    sqlValues.push(user.email);
    oneValue = true;
  }
  if (user.city) {
    sql += oneValue ? ', city = ?' : ' city = ?';
    sqlValues.push(user.city);
    oneValue = true;
  }
  if (user.language) {
    sql += oneValue ? ', language = ?' : ' language = ?';
    sqlValues.push(user.language);
    oneValue = true;
  }
  sql += ' WHERE id = ?';
  sqlValues.push(idUser);

  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM users WHERE id = ?', [idUser]);
  return results[0].affectedRows === 1;
};

const deleteUser = async (idUser: number): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM users WHERE id = ?', [idUser]);
  return results[0].affectedRows === 1;
};

export {
  emailIsFree,
  getAllUsers,
  getUserById,
  addUser,
  getUserByEmail,
  updateUser,
  deleteUser,
};
