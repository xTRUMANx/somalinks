/** @jsx React.DOM */

var React = require("react"),
  HomePage = require("./components/HomePage"),
  Router = require("react-router-component"),
  Locations = Router.Locations,
  Location = Router.Location,
  ioClient = require("socket.io-client");

var App = React.createClass({displayName: 'App',
  getInitialState: function(){
    var socket = ioClient.connect("/", {"max reconnection attempts": Infinity});

    socket.on("connect", function(){
      this.setState({isConnected: true});
    }.bind(this));

    socket.on("disconnect", function(){
      this.setState({isConnected: false});
    }.bind(this));

    return {socket: socket};
  },
  render: function(){
    return (
      React.DOM.html(null, 
        React.DOM.head(null, 
          React.DOM.title(null, "somalinks"),
          React.DOM.link( {rel:"stylesheet", type:"text/css", href:"/css/bootstrap.min.css"} ),
          React.DOM.link( {rel:"stylesheet", type:"text/css", href:"/css/site.css"} )
        ),
        React.DOM.body(null, 
          React.DOM.h1( {className:"text-center"}, "somalinks"),
          React.DOM.div( {className:"container"}, 
            Locations( {path:this.props.path}, 
              Location( {path:"/", handler:HomePage, apiEndpoints:this.props.apiEndpoints, socket:this.state.socket,
                isConnected:this.state.isConnected} )
            )
          ),
          React.DOM.script( {src:"/js/bundle.min.js"}),
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
