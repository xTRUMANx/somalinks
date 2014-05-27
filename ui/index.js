/** @jsx React.DOM */

var React = require("react"),
  HomePage = require("./HomePage"),
  Router = require("react-router-component"),
  Locations = Router.Locations,
  Location = Router.Location;

var App = React.createClass({
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
              <Location path="/" handler={HomePage} apiEndpoints={this.props.apiEndpoints} />
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
