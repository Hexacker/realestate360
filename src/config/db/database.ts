import mongoose, { Mongoose } from 'mongoose';
import config from 'config';
import { DBConfig } from '../../shared/interfaces/config.interface';

const dbConfig: DBConfig = config.get('db');
const connectDB = (): Promise<Mongoose> => {
  // mongoose.set('debug', true);
  if (process.env.NODE_ENV !== 'production') {
    return mongoose.connect(`mongodb://${dbConfig.host}/${dbConfig.name}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  }
  return mongoose.connect(
    'PUT HERE YOUR MONGODB URI',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
  );
};

export const clearData = async (): Promise<void> => {
  // clear data after each connection in test db of JEST context
  // eslint-disable-next-line no-unused-expressions
  process.env.CONTEXT === 'JEST' /* Drop the DB */ &&
    mongoose.connection.db.dropDatabase();
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.connection.close();
};

export default connectDB;
