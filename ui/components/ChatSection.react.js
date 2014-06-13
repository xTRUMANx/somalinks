/** @jsx React.DOM */

var React = require("react"),
  moment = require("moment"),
  AppStore = require("../stores/AppStore");

var ChatSection = React.createClass({
  getInitialState: function(){
    return {
      messages: AppStore.getMessages(),
      isConnected: AppStore.isConnected()
    };
  },
  componentWillMount: function(){
    AppStore.addChangeListener(this.onChange);
  },
  componentWillUnmount: function(){
    AppStore.removeChangeListener(this.onChange);
  },
  onChange: function(){
    this.setState({
      messages: AppStore.getMessages(),
      isConnected: AppStore.isConnected()
    });
  },
  sendMessage: function(){
    var name = this.refs.name.getDOMNode().value;
    var message = this.refs.message.getDOMNode().value;

    AppStore.sendMessage({name: name, text: message, sentOn: new Date()});

    this.refs.message.getDOMNode().value = "";

    return false;
  },
  handleKeyDown: function(e){
    if(e.charCode === 13 && !e.shiftKey){
      this.sendMessage();
    }
  },
  render: function(){
    var messageNodes = this.state.messages.map(function(message){
      return (
        <li>
          <blockquote>
          {message.text.split("\n").map(function(text){return (<p>{text}</p>);})}
            <small>{message.name} said {moment(message.sentOn).fromNow()}</small>
          </blockquote>
        </li>
      );
    });

    return (
      <div>
        <h2>Chat</h2>
        <form className="form-horizontal" onSubmit={this.sendMessage}>
          <div className="form-group">
            <label className="control-label col-sm-3">Name</label>
            <div className="col-sm-9">
              <input className="form-control" type="text" required ref="name" />
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-3">Message</label>
            <div className="col-sm-9">
              <textarea className="form-control" required ref="message" onKeyPress={this.handleKeyDown}></textarea>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-9 col-sm-offset-3">
              <input className="btn btn-primary" type="submit" value="Send" disabled={!this.state.isConnected} />
            </div>
          </div>
        </form>
        <hr />
        <ul className="list-unstyled">
          {messageNodes}
        </ul>
      </div>
    );
  }
});

module.exports = ChatSection;
