if(process.env.NODE_ENV === 'production') {
  module.exports = {mongoURI: "mongodb://rzavala1989:illmatic774@ds255794.mlab.com:55794/nyr-dev"}
} else {
  module.exports = {mongoURI: "mongodb://localhost/nyr-dev"}
}



// exports.DATABASE_URL =
//   process.env.DATABASE_URL || "mongodb://localhost/nyr-dev";
// exports.TEST_DATABASE_URL =
//   process.env.TEST_DATABASE_URL || "mongodb://localhost/test-nyr-dev";