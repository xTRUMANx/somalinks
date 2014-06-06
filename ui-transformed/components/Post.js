/** @jsx React.DOM */

var React = require("react"),
  moment = require("moment"),
  AppStore = require("../stores/AppStore");


var Post = React.createClass({displayName: 'Post',
  handleClick: function(){
    AppStore.logPostClick(this.props.post.id);
  },
  render: function(){
    var post = this.props.post;

    return (
      React.DOM.blockquote( {className:post.isNew ? "newPost" : ""}, 
        React.DOM.a( {href:post.data.url, target:"_blank", onClick:this.handleClick}, post.data.title),
        React.DOM.small(null, 
          moment.utc(post.createdon).zone(-180).calendar(), " Somali time from ", React.DOM.a( {href:"http://" + post.data.host}, post.data.siteName || post.data.host)
        )
      )
      );
  }
});

module.exports = Post;
