/** @jsx React.DOM */

var React = require("react");

var PostsListing = require("./PostsListing"),
  PostsGrid = require("./PostsGrid");

var HomePage = React.createClass({displayName: 'HomePage',
  getInitialState: function(){
    return {showGrid: false};
  },
  toggleView: function(){
    this.setState({showGrid: !this.state.showGrid});
  },
  render: function(){
    return (
      React.DOM.div(null, 
        React.DOM.div( {className:"row"}, 
          React.DOM.div( {className:"col-sm-4"}, 
            React.DOM.a( {className:"clickable " + (this.props.newPosts.length ? "show" : "invisible"),
              onClick:this.props.addNewPosts}, 
              this.props.newPosts.length, " new posts"
            )
          ),
          React.DOM.div( {className:"col-sm-4"}, 
            React.DOM.p( {className:"text-center " + (this.props.isConnected ? "invisible" : "show")}, 
            "Disconnected"
            )
          ),
          React.DOM.div( {className:"col-sm-4"}, 
            React.DOM.button( {className:"pull-right btn btn-primary", onClick:this.toggleView}, 
              React.DOM.span( {className:this.state.showGrid ? "glyphicon glyphicon-list" : "glyphicon glyphicon-th-large"})
            )
          )
        ),
        this.state.showGrid ?
          PostsGrid( {posts:this.props.posts, isConnected:this.props.isConnected} ) :
          PostsListing( {posts:this.props.posts, loadingMore:this.props.loadingMore, loadMore:this.props.loadMore, isConnected:this.props.isConnected} )
        
      )
      );
  }
});

module.exports = HomePage;
