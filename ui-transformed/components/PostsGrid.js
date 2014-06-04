/** @jsx React.DOM */

var React = require("react"),
  Post = require("./Post");

var PostsGrid = React.createClass({displayName: 'PostsGrid',
  render: function(){

    var postNodes = this.props.posts.map(function(post){
      return (
        React.DOM.div( {className:"masonry-item", key:post.id}, 
          Post( {post:post} )
        )
        );
    });

    return (
      React.DOM.div( {className:"masonry"}, 
        postNodes
      )
      );
  }
});

module.exports = PostsGrid;
