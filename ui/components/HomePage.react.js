/** @jsx React.DOM */

var React = require("react"),
  AppStore = require("../stores/AppStore");

var PostsListing = require("./PostsListing"),
  PostsGrid = require("./PostsGrid"),
  ChatSection = require("./ChatSection");

var UsersCount = React.createClass({
  render: function(){
    return (
      <div>
        {this.props.count}
        <span className="glyphicon glyphicon-user"></span>
      </div>
    );
  }
});

var HomePage = React.createClass({
  getInitialState: function(){
    return {showGrid: false, newPosts: AppStore.getNewPosts(), connectionsCount: AppStore.getConnectionsCount() };
  },
  componentWillMount: function(){
    AppStore.addChangeListener(this.onChange);
  },
  componentWillUnmount: function(){
    AppStore.removeChangeListener(this.onChange);
  },
  onChange: function(){
    this.setState({
      newPosts: AppStore.getNewPosts(),
      connectionsCount: AppStore.getConnectionsCount()
    });
  },
  toggleView: function(){
    this.setState({showGrid: !this.state.showGrid});
  },
  addNewPosts: function(){
    AppStore.addNewPosts();
  },
  isConnected: function(){
    return AppStore.isConnected();
  },
  render: function(){
    return (
      <div>
        <div className="row">
          <div className="col-sm-4">
            <a className={"clickable " + (this.state.newPosts.length ? "show" : "invisible")}
              onClick={this.addNewPosts}>
              {this.state.newPosts.length} new posts
            </a>
          </div>
          <div className="col-sm-4">
            <p className="text-center">
              {this.isConnected() ? <UsersCount count={this.state.connectionsCount} /> : "Disconnected" }
            </p>
          </div>
          <div className="col-sm-4">
            <button className="pull-right btn btn-primary" onClick={this.toggleView}>
              <span className={this.state.showGrid ? "glyphicon glyphicon-list" : "glyphicon glyphicon-th-large"}></span>
            </button>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-sm-8">
            <h2>News</h2>
            {this.state.showGrid ? <PostsGrid /> : <PostsListing />}
          </div>
          <div className="col-sm-4">
            <ChatSection />
          </div>
        </div>
      </div>
      );
  }
});

module.exports = HomePage;
