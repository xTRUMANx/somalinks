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
  extractDomain: function(url){
    var protocol = url.substr(0, url.indexOf("://") + 3);

    var urlSansProtocol = url.indexOf("://") > -1 ? url.substr(url.indexOf("://") + 3) : url;

    var domain = urlSansProtocol.indexOf("/") == -1 ? urlSansProtocol : urlSansProtocol.substr(0, urlSansProtocol.indexOf("/"));

    return {
      domainSansProtocol: domain,
      domainWithProtocol: protocol + domain
    };
  },
  render: function(){
    var domainWithProtocol = this.extractDomain(this.props.post.data.url).domainWithProtocol,
      domainSansProtocol = this.extractDomain(this.props.post.data.url).domainSansProtocol;

    return (
      <blockquote className={this.props.post.isNew ? "newPost" : ""}>
        <a href={this.props.post.data.url}>{this.props.post.data.title}</a>
        <small>
          {moment(this.props.post.createdon).fromNow()} from <a href={domainWithProtocol}>{domainSansProtocol}</a>
        </small>
      </blockquote>
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
      if(!this.state.posts) return;

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
  render: function(){
    var postNodes = this.state.posts.map(function(post){
      return (
        <li key={post.id}>
          <Post post={post} />
        </li>
      );
    });

    return (
      <div>
        <a className={"text-center clickable " + (this.state.newPosts.length ? "show" : "invisible")}
          onClick={this.addNewPosts}>
          {this.state.newPosts.length} new posts
        </a>
        <p className={"text-center " + (this.props.isConnected ? "invisible" : "show")}>
          Disconnected
        </p>
        <ul className="list-unstyled">
          <ReactCSSTransitionGroup transitionName="fade">
            {postNodes}
          </ReactCSSTransitionGroup>
        </ul>
        {!this.state.loadingMore ?
          <button className="btn btn-primary center-block" onClick={this.loadMore} disabled={!this.props.isConnected}>
            {this.props.isConnected ? "Load More" : "Disconnected"}
          </button> :
          <ProgressBar />}
      </div>
      );
  }
});

module.exports = HomePage;
