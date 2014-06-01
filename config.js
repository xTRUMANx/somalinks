var util = require("util");

var port = process.env.PORT || 3000;

var apiRootUrl = util.format("http://localhost:%s/api", port);

var apiEndpoints = {
  posts: apiRootUrl + "/posts"
};

var config = {
  connectionString: process.env.DATABASE_URL || "postgres://mustafa:mustafacrudgen@localhost/somalinks",
  apiEndPoints: apiEndpoints,
  newLinkCheckIntervalSeconds: 30000
};

module.exports = config;
