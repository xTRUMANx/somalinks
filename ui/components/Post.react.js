/** @jsx React.DOM */

var React = require("react"),
  moment = require("moment"),
  AppStore = require("../stores/AppStore");


var Post = React.createClass({
  handleClick: function(){
    AppStore.logPostClick(this.props.post.id);
  },
  render: function(){
    var post = this.props.post;

    return (
      <blockquote className={post.isNew ? "newPost" : ""}>
        <a href={post.data.url} target="_blank" onClick={this.handleClick}>{post.data.title}</a>
        <small>
          {moment.utc(post.createdon).zone(-180).calendar()} Somali time from <a href={"http://" + post.data.host}>{post.data.siteName || post.data.host}</a>
        </small>
      </blockquote>
      );
  }
});

module.exports = Post;
