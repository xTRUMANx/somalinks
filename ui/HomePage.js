/** @jsx React.DOM */

var React = require("react"),
  ReactAsync = require("react-async"),
  superagent = require("superagent");

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
      <blockquote>
        <a href={this.props.post.data.url}>{this.props.post.data.title}</a>
        <small>
          <a href={domainWithProtocol}>{domainSansProtocol}</a>
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

      cb(null, {posts: posts});
    });
  },
  componentWillMount: function(){
    var socket = this.props.socket;

    socket.on("newPosts", function(posts){
      if(!this.state.posts) return;

      var newPosts = posts.concat(this.state.posts);

      this.setState({posts: newPosts});
    }.bind(this));

    socket.on("reconnect", function(){
      socket.emit("newPostsSince", this.state.posts[0].id);
    }.bind(this));
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
        <ul className="list-unstyled">
          {postNodes}
        </ul>
      </div>
      );
  }
});

module.exports = HomePage;
