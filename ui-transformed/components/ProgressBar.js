/** @jsx React.DOM */

var React = require("react");

var ProgressBar = React.createClass({displayName: 'ProgressBar',
  render: function(){
    return (
      React.DOM.div( {className:"progress progress-striped active"}, 
        React.DOM.div( {className:"progress-bar", style:{width: '100%'}}
        )
      )
      );
  }
});

module.exports = ProgressBar;
