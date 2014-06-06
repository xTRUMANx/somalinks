/** @jsx React.DOM */

var React = require("react"),
  ReactAsync = require("react-async"),
  HomePage = require("./components/HomePage"),
  Router = require("react-router-component"),
  Locations = Router.Locations,
  Location = Router.Location,
  AppStore = require("./stores/AppStore");

var getState = function(){
  return {
    newPosts: AppStore.getNewPosts()
  };
};

var App = React.createClass({displayName: 'App',
  mixins: [ReactAsync.Mixin],
  getInitialStateAsync: function(cb){
    AppStore.getInitialPostsAsync(this.props.apiEndpoints.posts, cb);
  },
  componentWillMount: function(){
    AppStore.addChangeListener(this.onChange);
  },
  componentWillUnmount: function(){
    AppStore.removeChangeListener(this.onChange);
  },
  onChange: function(){
    this.setState(getState());
  },
  render: function(){
    var title = this.state.newPosts.length ? this.state.newPosts.length + " somalinks" : "somalinks";

    return (
      React.DOM.html(null, 
        React.DOM.head(null, 
          React.DOM.title(null, title),
          React.DOM.link( {rel:"stylesheet", type:"text/css", href:"/css/bootstrap.min.css"} ),
          React.DOM.link( {rel:"stylesheet", type:"text/css", href:"/css/site.css"} )
        ),
        React.DOM.body(null, 
          React.DOM.h1( {className:"text-center"}, "somalinks"),
          React.DOM.div( {className:"container"}, 
            Locations( {path:this.props.path}, 
              Location( {path:"/", handler:HomePage} )
            )
          ),
          React.DOM.script( {src:"/js/ga.js"})
        )
      )
    );
  }
});

module.exports = App;

if(typeof window !== "undefined"){
  window.onload = function(){
    React.renderComponent(App(null ), document);
  };

  window.React = React;
}
