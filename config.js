var apiRootUrl = "http://localhost:3000/api";

var apiEndpoints = {
  posts: apiRootUrl + "/posts"
};

var config = {
  connectionString: "postgres://mustafa:mustafacrudgen@localhost/somalinks",
  apiEndPoints: apiEndpoints
};

module.exports = config;
