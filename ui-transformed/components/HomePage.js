/** @jsx React.DOM */

var React = require("react"),
  AppStore = require("../stores/AppStore");

var PostsListing = require("./PostsListing"),
  PostsGrid = require("./PostsGrid");

var HomePage = React.createClass({displayName: 'HomePage',
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
      React.DOM.div(null, 
        React.DOM.div( {className:"row"}, 
          React.DOM.div( {className:"col-sm-4"}, 
            React.DOM.a( {className:"clickable " + (this.state.newPosts.length ? "show" : "invisible"),
              onClick:this.addNewPosts}, 
              this.state.newPosts.length, " new posts"
            )
          ),
          React.DOM.div( {className:"col-sm-4"}, 
            React.DOM.p( {className:"text-center " + (this.isConnected() ? "invisible" : "show")}, 
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
          PostsGrid(null ) :
          PostsListing(null )
        
      )
      );
  }
});

module.exports = HomePage;
