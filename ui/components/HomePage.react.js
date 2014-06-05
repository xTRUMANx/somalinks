/** @jsx React.DOM */

var React = require("react");

var PostsListing = require("./PostsListing"),
  PostsGrid = require("./PostsGrid");

var HomePage = React.createClass({
  getInitialState: function(){
    return {showGrid: false};
  },
  toggleView: function(){
    this.setState({showGrid: !this.state.showGrid});
  },
  render: function(){
    return (
      <div>
        <div className="row">
          <div className="col-sm-4">
            <a className={"clickable " + (this.props.newPosts.length ? "show" : "invisible")}
              onClick={this.props.addNewPosts}>
              {this.props.newPosts.length} new posts
            </a>
          </div>
          <div className="col-sm-4">
            <p className={"text-center " + (this.props.isConnected ? "invisible" : "show")}>
            Disconnected
            </p>
          </div>
          <div className="col-sm-4">
            <button className="pull-right btn btn-primary" onClick={this.toggleView}>
              <span className={this.state.showGrid ? "glyphicon glyphicon-list" : "glyphicon glyphicon-th-large"}></span>
            </button>
          </div>
        </div>
        {this.state.showGrid ?
          <PostsGrid posts={this.props.posts} isConnected={this.props.isConnected} /> :
          <PostsListing posts={this.props.posts} loadingMore={this.props.loadingMore} loadMore={this.props.loadMore} isConnected={this.props.isConnected} />
        }
      </div>
      );
  }
});

module.exports = HomePage;
