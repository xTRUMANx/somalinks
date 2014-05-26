/** @jsx React.DOM */

var React = require("react");
var Router = require("react-router-component");

var Locations = Router.Locations;
var Location = Router.Location;

var HomePage = React.createClass({
  render: function(){
    return (
      <h1 className="text-center">somalinks</h1>
    );
  }
});

var App = React.createClass({
  render: function(){
    return (
      <html>
        <head>
          <title>somalinks</title>
          <link rel="stylesheet" type="text/css" href="/css/bootstrap.min.css" />
        </head>
        <body>
          <Locations path={this.props.path}>
            <Location path="/" handler={HomePage} />
          </Locations>
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
