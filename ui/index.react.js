/** @jsx React.DOM */

var React = require("react"),
  ReactAsync = require("react-async"),
  HomePage = require("./components/HomePage"),
  Router = require("react-router-component"),
  Locations = Router.Locations,
  Location = Router.Location,
  ioClient = require("socket.io-client"),
  superagent = require("superagent");

var App = React.createClass({
  mixins: [ReactAsync.Mixin],
  getInitialStateAsync: function(cb){
    superagent.get(this.props.apiEndpoints.posts, function(res){
      if(res.statusCode !== 200){
        return cb(res.text, null);
      }

      var posts = JSON.parse(res.text);

      cb(null, {posts: posts, newPosts: [], loadingMore: false});
    });
  },
  componentWillMount: function(){
    var socket = ioClient.connect("/", {"max reconnection attempts": Infinity});

    socket.on("connect", function(){
      this.setState({isConnected: true});
    }.bind(this));

    socket.on("disconnect", function(){
      this.setState({isConnected: false});
    }.bind(this));

    socket.on("newPosts", function(posts){
      if(!this.state.posts) return;

      var newPosts = posts.concat(this.state.newPosts);

      this.setState({newPosts: newPosts});
    }.bind(this));

    socket.on("morePosts", function(posts){
      var newPosts = this.state.posts.concat(posts);

      this.setState({posts: newPosts, loadingMore: false});
    }.bind(this));

    socket.on("reconnect", function(){
      var lastPostId = this.state.newPosts.length ? this.state.newPosts[0].id : this.state.posts[0].id;

      socket.emit("newPostsSince", lastPostId);
    }.bind(this));

    socket.on("reconnecting", function(){
      socket.socket.reconnectionDelay = socket.socket.reconnectionDelay > 15000 ? 15000 : socket.socket.reconnectionDelay;
    }.bind(this));

    this.setState({socket: socket});
  },
  addNewPosts: function(){
    this.state.posts.forEach(function(post){ post.isNew = false; });
    this.state.newPosts.forEach(function(post){ post.isNew = true; });

    var newPosts = this.state.newPosts.concat(this.state.posts);

    this.setState({posts: newPosts, newPosts: []});
  },
  loadMore: function(){
    if(!this.state.posts.length) return;

    this.setState({loadingMore: true});

    var id = this.state.posts[this.state.posts.length - 1].id;

    this.state.socket.emit("morePosts", id);
  },
  render: function(){
    var title = this.state.newPosts.length ? this.state.newPosts.length + " somalinks" : "somalinks";

    return (
      <html>
        <head>
          <title>{title}</title>
          <link rel="stylesheet" type="text/css" href="/css/bootstrap.min.css" />
          <link rel="stylesheet" type="text/css" href="/css/site.css" />
        </head>
        <body>
          <h1 className="text-center">somalinks</h1>
          <div className="container">
            <Locations path={this.props.path}>
              <Location path="/" handler={HomePage} apiEndpoints={this.props.apiEndpoints} socket={this.state.socket}
                isConnected={this.state.isConnected} addNewPosts={this.addNewPosts}
                loadMore={this.loadMore} loadingMore={this.state.loadingMore}
                posts={this.state.posts} newPosts={this.state.newPosts} />
            </Locations>
          </div>
          <script src="/js/bundle.min.js"></script>
          <script src="/js/ga.js"></script>
        </body>
      </html>
    );
  }
});

module.exports = App;

if(typeof window !== "undefined"){
  window.onload = function(){
    React.renderComponent(<App />, document);
  };

  window.React = React;
}
