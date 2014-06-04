/** @jsx React.DOM */

var React = require("react"),
  ReactCSSTransitionGroup = require("react/lib/ReactCSSTransitionGroup"),
  Post = require("./Post"),
  ProgressBar = require("./ProgressBar");

var PostsListing = React.createClass({displayName: 'PostsListing',
  render: function(){
    var postNodes = this.props.posts.map(function(post){
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
        this.props.loadMore ? !this.props.loadingMore ?
          React.DOM.button( {className:"btn btn-primary center-block", onClick:this.props.loadMore, disabled:!this.props.isConnected}, 
                this.props.isConnected ? "Load More" : "Disconnected"
          ) :
          ProgressBar(null ) : null
      )
      );
  }
});

module.exports = PostsListing;
