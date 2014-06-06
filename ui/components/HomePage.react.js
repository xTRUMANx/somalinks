/** @jsx React.DOM */

var React = require("react"),
  AppStore = require("../stores/AppStore");

var PostsListing = require("./PostsListing"),
  PostsGrid = require("./PostsGrid");

var HomePage = React.createClass({
  getInitialState: function(){
    return {showGrid: false, newPosts: AppStore.getNewPosts()};
  },
  componentWillMount: function(){
    AppStore.addChangeListener(this.onChange);
  },
  componentWillUnmount: function(){
    AppStore.removeChangeListener(this.onChange);
  },
  onChange: function(){
    this.setState({newPosts: AppStore.getNewPosts()});
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
            <p className={"text-center " + (this.isConnected() ? "invisible" : "show")}>
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
          <PostsGrid /> :
          <PostsListing />
        }
      </div>
      );
  }
});

module.exports = HomePage;
