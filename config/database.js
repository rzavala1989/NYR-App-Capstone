if(process.env.NODE_ENV === 'production') {
    module.exports = {mongoURI: "mongodb://rzavala1989:illmatic774@ds255794.mlab.com:55794/nyr-dev"}
} else {
    module.exports = {mongoURI: "mongodb://localhost/nyr-dev"}
}