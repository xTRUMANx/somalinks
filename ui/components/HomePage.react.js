/** @jsx React.DOM */

var React = require("react"),
  ReactAsync = require("react-async"),
  superagent = require("superagent");

var PostsListing = require("./PostsListing"),
  PostsGrid = require("./PostsGrid");

var HomePage = React.createClass({
  mixins: [ReactAsync.Mixin],
  getInitialStateAsync: function(cb){
    superagent.get(this.props.apiEndpoints.posts, function(res){
      if(res.statusCode !== 200){
        return cb(res.text, null);
      }

      var posts = JSON.parse(res.text);

      cb(null, {posts: posts, newPosts: []});
    });
  },
  componentWillMount: function(){
    var socket = this.props.socket;

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

    this.props.socket.emit("morePosts", id);
  },
  toggleView: function(){
    this.setState({showGrid: !this.state.showGrid});
  },
  render: function(){
    return (
      <div>
        <div className="row">
          <div className="col-sm-4">
            <a className={"clickable " + (this.state.newPosts.length ? "show" : "invisible")}
              onClick={this.addNewPosts}>
              {this.state.newPosts.length} new posts
            </a>
          </div>
          <div className="col-sm-4">
            <p className={"text-center " + (this.props.isConnected ? "invisible" : "show")}>
            Disconnected
            </p>
          </div>
          <div className="col-sm-4">
            <button className="pull-right btn btn-primary" onClick={this.toggleView}>
              <span className={this.state.showGrid ? "glyphicon glyphicon-list" : "glyphicon glyphicon-th-large"}></span>
            </button>
          </div>
        </div>
        {this.state.showGrid ?
          <PostsGrid posts={this.state.posts} isConnected={this.props.isConnected} /> :
          <PostsListing posts={this.state.posts} loadingMore={this.state.loadingMore} loadMore={this.loadMore} isConnected={this.props.isConnected} />
        }
      </div>
      );
  }
});

module.exports = HomePage;
