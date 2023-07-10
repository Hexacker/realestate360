import config from 'config';
import mongoose from 'mongoose';
import connectDB from '../config/db/database';
import seedRoles from './roles.seed';
import seedUsers from './users.seed';
import seedCompanies from './companies.seed';
import seedBankAccounts from './bankAccounts.seed';
import seedPaymentPlan from './paymentPLan.seed';
import seedCountries from './countries.seed';
import seedClients from './clients.seed';
import seedProjectCategories from './projectCategories.seed';
import seedProjects from './projects.seed';
import seedProductGroups from './productGroups.seed';
import seedProducts from './products.seed';
import seedQuotes from './quotes.seed';
import seedSales from './sales.seed';
import seedPayments from './payment.seed';
import seedUpdates from './updates.seed';

const dbConfig: any = config.get('db');

const dropDatabase = async (): Promise<void> => {
  await mongoose.connection.db.dropDatabase();
};

const seedData = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      seedCountries().then(() => {
        seedRoles().then(() => {
          seedCompanies().then(() => {
            seedUsers().then(() => {
              seedCompanies().then(() => {
                seedBankAccounts().then(() => {
                  seedPaymentPlan().then(() => {
                    seedClients().then(() => {
                      seedProjectCategories().then(() => {
                        seedProjects().then(() => {
                          seedProductGroups().then(() => {
                            seedProducts().then(() => {
                              seedQuotes().then(() => {
                                seedSales().then(() => {
                                  seedPayments().then(() => {
                                    seedUpdates().then(() => {
                                      console.log('Data Seeded ');
                                      // process.exit(0);
                                      resolve();
                                    });
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    } catch (err) {
      reject(err);
    }
  });
};

export const useSeeds = async (): Promise<void> => {
  await dropDatabase();
  await seedData();
};

const start = async (): Promise<void> => {
  if (process.argv.filter(a => a.includes('seeds/init.ts')).length)
    connectDB()
      .then(async () => {
        console.log(`🎯 Connected To Database ${dbConfig.name}`);
      })
      .then(async () => {
        console.log('✅ Database Dropped ');
        console.log('🚀 Data Seeding... ');
        await useSeeds();
      })
      .catch(err => {
        console.log('💀 Error Connecting To Database', err);
        process.exit(0);
      });
};
start();
