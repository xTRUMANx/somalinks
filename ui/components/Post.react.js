/** @jsx React.DOM */

var React = require("react"),
  moment = require("moment");

var Post = React.createClass({
  render: function(){
    var post = this.props.post;

    return (
      <blockquote className={post.isNew ? "newPost" : ""}>
        <a href={post.data.url}>{post.data.title}</a>
        <small>
          {moment.utc(post.createdon).zone(-180).calendar()} Somali time from <a href={"http://" + post.data.host}>{post.data.host}</a>
        </small>
      </blockquote>
      );
  }
});

module.exports = Post;
