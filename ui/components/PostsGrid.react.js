/** @jsx React.DOM */

var React = require("react"),
  Post = require("./Post");

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

module.exports = PostsGrid;
