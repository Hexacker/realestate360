import { User, UsersService } from '..';
import connectDB, { disconnectDB } from '../../../config/db/database';

import { useSeeds } from '../../../seeds/init';

describe('User services features tests', () => {
  // initial user data
  let iUser: any;
  const userDTO = {
    firstName: 'test',
    lastName: 'user',
    email: 'test@gmail.com',
    password: 'password',
    profilePicture: 'null',
    isActivated: true,
    roles: ['SUPER_ADMIN'],
  };
  let cnxdb: any;

  beforeAll(async () => {
    // establish connection
    cnxdb = await connectDB();

    // seed initial test data
    await useSeeds();

    // create user
    iUser = await UsersService.createUser(userDTO);
  });

  afterAll(async done => {
    // close the connection to db
    await disconnectDB();
    done();
  });

  it('should be well connected to db', () => {
    expect(cnxdb).not.toBeNull();
  });

  it('user should be created', async () => {
    expect(iUser).not.toBeNull();
  });

  it('get User by id', async () => {
    try {
      const user = await UsersService.getUser(iUser.id);
      expect(user).not.toBeNull();
    } catch (err) {
      expect(err).toBeNull();
    }
  });

  it('get User by email', async () => {
    try {
      const user = await UsersService.findUserByEmail(iUser.email);
      expect(user).not.toBeNull();
    } catch (err) {
      expect(err).toBeNull();
    }
  });

  it('update user', async () => {
    try {
      const user = await UsersService.updateUser(iUser.id, userDTO);
      expect(user).not.toBeNull();
    } catch (err) {
      expect(err).toBeNull();
    }
  });

  it('list all users', async () => {
    try {
      const connectedUser = await User.findOne();
      if (!connectedUser) throw 'Error';
      const users = await User.find({});
      expect(users.length).not.toEqual(0);
    } catch (err) {
      expect(err).toBeNull();
    }
  });

  it('hash password', async () => {
    try {
      const hashpwd = UsersService.hashPassword('password');
      expect(hashpwd).not.toBeNull();
    } catch (err) {
      expect(err).toBeNull();
    }
  });

  it('check password match', async () => {
    try {
      const user = await UsersService.checkIfUnencryptedPasswordIsValid(
        'password',
        iUser.password,
      );
      expect(user).not.toBeNull();
    } catch (err) {
      expect(err).toBeNull();
    }
  });
});
