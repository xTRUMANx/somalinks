/** @jsx React.DOM */

var React = require("react"),
  moment = require("moment");

var Post = React.createClass({displayName: 'Post',
  render: function(){
    var post = this.props.post;

    return (
      React.DOM.blockquote( {className:post.isNew ? "newPost" : ""}, 
        React.DOM.a( {href:post.data.url}, post.data.title),
        React.DOM.small(null, 
          moment.utc(post.createdon).zone(-180).calendar(), " Somali time from ", React.DOM.a( {href:"http://" + post.data.host}, post.data.host)
        )
      )
      );
  }
});

module.exports = Post;
