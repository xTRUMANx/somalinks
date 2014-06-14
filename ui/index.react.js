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
    newPosts: AppStore.getNewPosts(),
    hasNewMessage: AppStore.hasNewMessage()
  };
};

var App = React.createClass({
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
    var title;

    if(this.state.hasNewMessage){
      title = "! somalinks";
    }
    else {
      title = this.state.newPosts.length ? this.state.newPosts.length + " somalinks" : "somalinks";
    }

    return (
      <html>
        <head>
          <title>{title}</title>
          <link rel="stylesheet" type="text/css" href="/css/bootstrap.min.css" />
          <link rel="stylesheet" type="text/css" href="/css/site.css" />
        </head>
        <body>
          <h1 className="text-center">somalinks</h1>
          <div className="container">
            <Locations path={this.props.path}>
              <Location path="/" handler={HomePage} />
            </Locations>
          </div>
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
