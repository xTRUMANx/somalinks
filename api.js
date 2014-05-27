var Router = require("express").Router();
var DB = require("./db");

Router.get("/posts", function(req, res){
  DB.
    getPosts().
    then(function(posts){
      res.json(posts);
    }).
    fail(function(err){
      res.status(500);
      res.send(err);
    }).
    done();
});

module.exports = Router;
