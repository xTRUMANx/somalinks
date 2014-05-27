var express = require("express"),
  logger = require("morgan"),
  ReactAsync = require("react-async"),
  UI = require("./ui-transformed"),
  url = require("url"),
  path = require("path"),
  favicon = require("serve-favicon"),
  API = require("./api"),
  Config = require("./config");

var app = express();

app.use(logger("dev"));
app.use(favicon(path.join(__dirname, "public/favicon.ico")));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", API);

app.use(function(req, res, next){
  var path = url.parse(req.path).pathname;

  var props = {path: path, apiEndpoints: Config.apiEndPoints};

  var uiInstance = UI(props);

  ReactAsync.renderComponentToStringWithAsyncState(
    uiInstance,
    function(err, markup){
      if(err){
        next(err);

        return;
      }

      res.send("<!doctype html>\n" + markup);
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
