/** @jsx React.DOM */

var React = require("react"),
  HomePage = require("./HomePage"),
  Router = require("react-router-component"),
  Locations = Router.Locations,
  Location = Router.Location,
  ioClient = require("socket.io-client");

var App = React.createClass({
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
      <html>
        <head>
          <title>somalinks</title>
          <link rel="stylesheet" type="text/css" href="/css/bootstrap.min.css" />
          <link rel="stylesheet" type="text/css" href="/css/site.css" />
        </head>
        <body>
          <h1 className="text-center">somalinks</h1>
          <div className="container">
            <Locations path={this.props.path}>
              <Location path="/" handler={HomePage} apiEndpoints={this.props.apiEndpoints} socket={this.state.socket} isConnected={this.state.isConnected} />
            </Locations>
          </div>
          <script src="/js/bundle.js"></script>
        </body>
      </html>
    );
  }
});

module.exports = App;

if(typeof window !== "undefined"){
  window.onload = function(){
    React.renderComponent(<App />, document);
  };

  window.React = React;
}
