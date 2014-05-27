var Q = require("q"),
  PG = require("pg"),
  Config = require("./config");

var connectionString = Config.connectionString;

var DB = {
  getPosts: function(){
    var deferred = Q.defer();

    PG.connect(connectionString, function(err, client, done){
      if(err){
        return deferred.reject(err);
      }

      var sql = "select * from posts order by id desc";

      client.query(sql, function(err, results){
        if(err){
          deferred.reject(err);
        }
        else{
          deferred.resolve(results.rows);
        }
      });
    });

    return deferred.promise;
  }
};

module.exports = DB;
