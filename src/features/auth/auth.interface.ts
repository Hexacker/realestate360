import { IUser } from "../users";

export default interface DataStoredInToken {
  userId: string;
  createdAt: Date;
  expireAt: Date;
}
