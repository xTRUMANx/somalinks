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

      var sql = "select * from posts order by id desc limit 25";

      client.query(sql, function(err, results){
        done();

        if(err){
          deferred.reject(err);
        }
        else{
          deferred.resolve(results.rows);
        }
      });
    });

    return deferred.promise;
  },
  getLastPostId: function(){
    var deferred = Q.defer();

    PG.connect(connectionString, function(err, client, done){
      if(err){
        return deferred.reject(err);
      }

      var sql = "select id from posts order by id desc limit 1";

      client.query(sql, function(err, results){
        done();

        if(err){
          deferred.reject(err);
        }
        else{
          var id = 0;

          if(results.rowCount){
            id = results.rows[0].id;
          }

          deferred.resolve(id);
        }
      });
    });

    return deferred.promise;
  },
  latestPostsSinceLastPost: function(fromId, toId){
    var deferred = Q.defer();

    PG.connect(connectionString, function(err, client, done){
      if(err){
        return deferred.reject(err);
      }

      var sql, sqlArgs;

      if(fromId === toId) {
        var sql = "select * from posts where id > $1 order by id desc limit 25";
        sqlArgs = [fromId];
      }
      else{
        var sql = "select * from posts where id > $1 and id <= $2 order by id desc limit 25";
        sqlArgs = [fromId, toId];
      }

      client.query(sql, sqlArgs, function(err, results){
        done();

        if(err){
          deferred.reject(err);
        }
        else{
          deferred.resolve(results.rows);
        }
      });
    });

    return deferred.promise;
  },
  latestPostsAfterLastPost: function(id){
    var deferred = Q.defer();

    PG.connect(connectionString, function(err, client, done){
      if(err){
        return deferred.reject(err);
      }

      var sql = "select * from posts where id < $1 order by id desc limit 25;";

      client.query(sql, [id], function(err, results){
        done();

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
