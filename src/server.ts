import config from 'config';
import connectDB from './config/db/database';
import app from './app';
import { useSeeds } from './seeds/init';

const serverConfig: any = config.get('server');
const dbConfig: any = config.get('db');
connectDB()
  .then(async () => {
    console.log(`🎯 Connected To Database ${dbConfig.name}`);
    console.log(
      process.env.USE_SEEDS === 'false'
        ? "⛔️ Seeds won't be launched"
        : '🚀 Launching seeds...',
    );
    if (process.env.USE_SEEDS !== 'false') {
      await useSeeds();
    }
  })
  .catch(err => {
    console.log('💀 Error Connecting To Database', err);
  });

app.listen(process.env.PORT || serverConfig.port, () => {
  console.info(`🔥 Listening on port ${serverConfig.port}`);
});
