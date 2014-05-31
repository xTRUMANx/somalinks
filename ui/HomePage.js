/** @jsx React.DOM */

var React = require("react"),
  ReactAsync = require("react-async"),
  superagent = require("superagent"),
  ReactCSSTransitionGroup = require("react/lib/ReactCSSTransitionGroup"),
  moment = require("moment");

var ProgressBar = React.createClass({
  render: function(){
    return (
      <div className="progress progress-striped active">
        <div className="progress-bar" style={{width: '100%'}}>
        </div>
      </div>
    );
  }
});

var Post = React.createClass({
  render: function(){
    var post = this.props.post;

    return (
      <blockquote className={post.isNew ? "newPost" : ""}>
        <a href={post.data.url}>{post.data.title}</a>
        <small>
          {moment(post.createdon).calendar()} from <a href={"http://" + post.data.host}>{post.data.host}</a>
        </small>
      </blockquote>
    );
  }
});

var PostsListing = React.createClass({
  render: function(){
    var postNodes = this.props.posts.map(function(post){
      return (
        <li key={post.id}>
          <Post post={post} />
        </li>
        );
    });

    return (
      <div>
        <ul className="list-unstyled">
          <ReactCSSTransitionGroup transitionName="fade">
              {postNodes}
          </ReactCSSTransitionGroup>
        </ul>
        {this.props.loadMore ? !this.props.loadingMore ?
          <button className="btn btn-primary center-block" onClick={this.props.loadMore} disabled={!this.props.isConnected}>
                {this.props.isConnected ? "Load More" : "Disconnected"}
          </button> :
          <ProgressBar /> : null}
      </div>
    );
  }
});

var PostsGrid = React.createClass({
  render: function(){

    var postNodes = this.props.posts.map(function(post){
      return (
        <div className="masonry-item" key={post.id}>
          <Post post={post} />
        </div>
        );
    });

    return (
      <div className="masonry">
        {postNodes}
      </div>
    );
  }
});

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
