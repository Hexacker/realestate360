import mongoose from 'mongoose';
// import {v4 as uuidv4} from 'uuid';
import IUser from './user.interface';

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    unique: false,
    required: true,
  },
  lastName: {
    type: String,
    unique: false,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    unique: false,
    required: true,
  },
  profilePicture: {
    type: Buffer,
    required: false,
  },
  isActivated: {
    type: Boolean,
    unique: false,
    default: true,
  },
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    nullable: true,
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

UserSchema.set('timestamps', true).toString();
UserSchema.set('toJSON', {
  transform: (doc: IUser, ret: IUser) => {
    const user = { ...ret };
    delete user.password;
    return user;
  },
});

// UserSchema.pre('save', next => {
//   console.log('%c⧭ pre save mdw', 'color: #006dcc');
//   next();
// });

// UserSchema.post('save', doc => {
//   console.log('%c⧭ post save mdw user ===> ', 'color: #006dcc', doc);
// });
const UserModel = mongoose.model<IUser & mongoose.Document>(
  'User',
  UserSchema,
  'users',
);

export default UserModel;
