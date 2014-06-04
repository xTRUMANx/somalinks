/** @jsx React.DOM */

var React = require("react"),
  ReactCSSTransitionGroup = require("react/lib/ReactCSSTransitionGroup"),
  Post = require("./Post"),
  ProgressBar = require("./ProgressBar");

var PostsListing = React.createClass({
  render: function(){
    var postNodes = this.props.posts.map(function(post){
      return (
        <li key={post.id}>
          <Post post={post} />
        </li>
        );
    });

    return (
      <div>
        <ul className="list-unstyled">
          <ReactCSSTransitionGroup transitionName="fade">
              {postNodes}
          </ReactCSSTransitionGroup>
        </ul>
        {this.props.loadMore ? !this.props.loadingMore ?
          <button className="btn btn-primary center-block" onClick={this.props.loadMore} disabled={!this.props.isConnected}>
                {this.props.isConnected ? "Load More" : "Disconnected"}
          </button> :
          <ProgressBar /> : null}
      </div>
      );
  }
});

module.exports = PostsListing;
