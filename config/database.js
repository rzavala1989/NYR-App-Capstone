if(process.env.NODE_ENV === 'production') {
  module.exports = require("./database_prod")
} else {
  module.exports = require("./database_dev")
}



// exports.DATABASE_URL =
//   process.env.DATABASE_URL || "mongodb://localhost/nyr-dev";
// exports.TEST_DATABASE_URL =
//   process.env.TEST_DATABASE_URL || "mongodb://localhost/test-nyr-dev";