/** @jsx React.DOM */

var React = require("react"),
  ReactAsync = require("react-async"),
  superagent = require("superagent");

var Post = React.createClass({
  extractDomain: function(url){
    var urlSansProtocol = url.indexOf("://") > -1 ? url.substr(url.indexOf("://") + 3) : url;

    return urlSansProtocol.indexOf("/") == -1 ? urlSansProtocol : urlSansProtocol.substr(0, urlSansProtocol.indexOf("/"));
  },
  render: function(){
    return (
      <div>
        <h2>
          <a href={this.props.post.data.url}>{this.props.post.data.title}</a>
        </h2>
        <em>{this.extractDomain(this.props.post.data.url)}</em>
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

      cb(null, {posts: posts});
    });
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
