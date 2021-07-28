// TODO: use profile schema
// const { MongoClient } = require('mongodb');
require('module-alias/register');
const Agenda = require('agenda');
const users = require('../../db/users');

module.exports = {
  async run() {
    const agenda = new Agenda({ db: { address: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agenda' } });

    await agenda.start();

    // clear all agenda jobs
    if(process.env.NODE_ENV === 'development') {
      const numRemoved = await agenda.purge();
      console.log(`removed ${numRemoved} jobs`);
    }
    
    agenda.define("delete old users", async (job) => {
      await User.remove({ lastLogIn: { $lt: twoDaysAgo } });
    });

    agenda.define('console log', async (job) => {
      console.log('update users statistics');
      const userlist = await users.getAll();
      userlist.forEach(async user => {
        console.info(user);
        // TODO: update user statistics
        let userpoint = await users.getUserPoint(user.id);
        console.info('point: ', userpoint);
        // await users.updateUserPoint(user.id, userpoint+1);
        userpoint += 1;

        user.stats.userpoint += 1;

      })
    })

    console.info('JOB START');
    
    await agenda.every("10 seconds", 'console log');
  }
};






