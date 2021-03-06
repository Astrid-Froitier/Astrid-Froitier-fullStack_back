import { RowDataPacket } from 'mysql2';

export default interface IMovie extends RowDataPacket {
  id: number;
  title: string;
  director: string;
  year: number;
  color: string;
  duration: number;
}
