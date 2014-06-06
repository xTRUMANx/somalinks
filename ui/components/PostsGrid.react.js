/** @jsx React.DOM */

var React = require("react"),
  Post = require("./Post"),
  AppStore = require("../stores/AppStore");

var PostsGrid = React.createClass({
  getInitialState: function(){
    return {posts: AppStore.getPosts()};
  },
  componentWillMount: function(){
    AppStore.addChangeListener(this.onChange);
  },
  componentWillUnmount: function(){
    AppStore.removeChangeListener(this.onChange);
  },
  onChange: function(){
    this.setState({posts: AppStore.getPosts()});
  },
  render: function(){

    var postNodes = this.state.posts.map(function(post){
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
