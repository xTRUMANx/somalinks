/** @jsx React.DOM */

var React = require("react"),
  ReactCSSTransitionGroup = require("react/lib/ReactCSSTransitionGroup"),
  Post = require("./Post"),
  ProgressBar = require("./ProgressBar"),
  AppStore = require("../stores/AppStore");


var PostsListing = React.createClass({displayName: 'PostsListing',
  getInitialState: function(){
    return {loadingMore: AppStore.isLoadingMore(), posts: AppStore.getPosts()};
  },
  componentWillMount: function(){
    AppStore.addChangeListener(this.onChange);
  },
  componentWillUnmount: function(){
    AppStore.removeChangeListener(this.onChange);
  },
  onChange: function(){
    this.setState({loadingMore: AppStore.isLoadingMore(), posts: AppStore.getPosts()});
  },
  loadMore: function(){
    AppStore.loadMore();
  },
  isConnected: function(){
    return AppStore.isConnected();
  },
  render: function(){
    var postNodes = this.state.posts.map(function(post){
      return (
        React.DOM.li( {key:post.id}, 
          Post( {post:post} )
        )
        );
    });

    return (
      React.DOM.div(null, 
        React.DOM.ul( {className:"list-unstyled"}, 
          ReactCSSTransitionGroup( {transitionName:"fade"}, 
              postNodes
          )
        ),
        !this.state.loadingMore ?
          React.DOM.button( {className:"btn btn-primary center-block", onClick:this.loadMore, disabled:!this.isConnected()}, 
                this.isConnected() ? "Load More" : "Disconnected"
          ) :
          ProgressBar(null )
      )
      );
  }
});

module.exports = PostsListing;
