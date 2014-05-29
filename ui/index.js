/** @jsx React.DOM */

var React = require("react"),
  HomePage = require("./HomePage"),
  Router = require("react-router-component"),
  Locations = Router.Locations,
  Location = Router.Location,
  ioClient = require("socket.io-client");

var App = React.createClass({
  getInitialState: function(){
    return {socket: ioClient.connect("/")};
  },
  render: function(){
    return (
      <html>
        <head>
          <title>somalinks</title>
          <link rel="stylesheet" type="text/css" href="/css/bootstrap.min.css" />
        </head>
        <body>
          <h1 className="text-center">somalinks</h1>
          <div className="container">
            <Locations path={this.props.path}>
              <Location path="/" handler={HomePage} apiEndpoints={this.props.apiEndpoints} socket={this.state.socket} />
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
