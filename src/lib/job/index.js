const run = () => {
  // run only if USE_JOB env is true
  if (process.env.USE_JOB) {
    require('./stats');
  }

};

module.exports = {
  run
};