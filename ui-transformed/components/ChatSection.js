/** @jsx React.DOM */

var React = require("react"),
  moment = require("moment"),
  AppStore = require("../stores/AppStore");

var ChatSection = React.createClass({displayName: 'ChatSection',
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
        React.DOM.li(null, 
          React.DOM.blockquote(null, 
          message.text.split("\n").map(function(text){return (React.DOM.p(null, text));}),
            React.DOM.small(null, message.name, " said ", moment(message.sentOn).fromNow())
          )
        )
      );
    });

    return (
      React.DOM.div(null, 
        React.DOM.h2(null, "Chat"),
        React.DOM.form( {className:"form-horizontal", onSubmit:this.sendMessage}, 
          React.DOM.div( {className:"form-group"}, 
            React.DOM.label( {className:"control-label col-sm-3"}, "Name"),
            React.DOM.div( {className:"col-sm-9"}, 
              React.DOM.input( {className:"form-control", type:"text", required:true, ref:"name"} )
            )
          ),
          React.DOM.div( {className:"form-group"}, 
            React.DOM.label( {className:"control-label col-sm-3"}, "Message"),
            React.DOM.div( {className:"col-sm-9"}, 
              React.DOM.textarea( {className:"form-control", required:true, ref:"message", onKeyPress:this.handleKeyDown})
            )
          ),
          React.DOM.div( {className:"form-group"}, 
            React.DOM.div( {className:"col-sm-9 col-sm-offset-3"}, 
              React.DOM.input( {className:"btn btn-primary", type:"submit", value:"Send", disabled:!this.state.isConnected} )
            )
          )
        ),
        React.DOM.hr(null ),
        React.DOM.ul( {className:"list-unstyled"}, 
          messageNodes
        )
      )
    );
  }
});

module.exports = ChatSection;
