/** @jsx React.DOM */

var React = require("react");

var ProgressBar = React.createClass({
  render: function(){
    return (
      <div className="progress progress-striped active">
        <div className="progress-bar" style={{width: '100%'}}>
        </div>
      </div>
      );
  }
});

module.exports = ProgressBar;
