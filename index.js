var express = require("express"),
  logger = require("morgan"),
  ReactAsync = require("react-async"),
  UI = require("./ui-transformed"),
  url = require("url"),
  path = require("path"),
  favicon = require("serve-favicon"),
  API = require("./api"),
  Config = require("./config"),
  DB = require("./db"),
  compress = require("compression");

var app = express();

app.use(logger("dev"));
app.use(compress());
app.use(favicon(path.join(__dirname, "public/favicon.ico")));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", API);

app.use(function(req, res, next){
  var path = url.parse(req.path).pathname;

  var props = {path: path, apiEndpoints: Config.apiEndPoints};

  var uiInstance = UI(props);

  ReactAsync.renderComponentToStringWithAsyncState(
    uiInstance,
    function(err, markup, data){
      if(err){
        next(err);

        return;
      }

      var bundleFile = "bundle.min.js";

      if(app.get("env") === "development") {
        bundleFile = "bundle.js";
      }

      res.send(ReactAsync.injectIntoMarkup("<!doctype html>\n" + markup, data, ["/js/" + bundleFile]));
    }
  );
});

app.use(function(err, req, res, next){
  res.status(500);

  console.log(err.stack);

  if(app.get('env') === "development"){
    res.send(err.stack);
  }
  else {
    res.send("Sorry, something went wrong. Try again later");
  }
});

app.set("port", process.env.PORT || 3000);

var server = app.listen(app.get("port"), function(){
  console.log("Express server is listening on port " + server.address().port);
});

var IO = require("socket.io").listen(server);

IO.sockets.on("connection", function(socket){
  socket.on("newPostsSince", function(id){
    console.log("newPostsSince", id);
    emitLatestPosts(function(eventName, data){
      console.log("emitting new posts", data.map(function(post){return post.id}));
      socket.emit(eventName, data);
    }, id);
  });

  socket.on("morePosts", function(id){
    console.log("morePosts", id)
    DB.
      latestPostsAfterLastPost(id).
      then(function(posts){
        socket.emit("morePosts", posts);
      }).
      fail(function(err){
        console.log(err);
      }).
      finally(function(){
        console.log("Sent latests posts after Post#", id);
      }).
      done();
  });
});

var lastPostId = 0;

DB.
  getLastPostId().
  then(function(id){
    lastPostId = id;

    setInterval(broadcastLatestPosts, Config.newLinkCheckIntervalSeconds);
  }).
  done();

function broadcastLatestPosts(){
  emitLatestPosts(function (eventName, data) {
    IO.sockets.emit(eventName, data);
  });
}

function emitLatestPosts(emitter, id) {
  console.log("Getting latest posts since Post #", lastPostId);

  DB.
    latestPostsSinceLastPost(id || lastPostId, lastPostId).
    then(function(posts){
      if(posts.length){
        console.log(posts.length, " new posts");

        if(!id) {
          lastPostId = posts[0].id;
        }

        emitter("newPosts", posts);
      }
    }).
    fail(function(err){
      console.log(err);
    }).
    finally(function(){
      console.log("Finished checking for latest posts");
    }).
    done();
}
