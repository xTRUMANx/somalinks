/** @jsx React.DOM */

var React = require("react"),
  ReactAsync = require("react-async"),
  superagent = require("superagent"),
  ReactCSSTransitionGroup = require("react/lib/ReactCSSTransitionGroup"),
  moment = require("moment");

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

var Post = React.createClass({displayName: 'Post',
  render: function(){
    var post = this.props.post;

    return (
      React.DOM.blockquote( {className:post.isNew ? "newPost" : ""}, 
        React.DOM.a( {href:post.data.url}, post.data.title),
        React.DOM.small(null, 
          moment.utc(post.createdon).zone(-180).calendar(), " Somali time from ", React.DOM.a( {href:"http://" + post.data.host}, post.data.host)
        )
      )
    );
  }
});

var PostsListing = React.createClass({displayName: 'PostsListing',
  render: function(){
    var postNodes = this.props.posts.map(function(post){
      return (
        React.DOM.li( {key:post.id}, 
          Post( {post:post} )
        )
        );
    });

    return (
      React.DOM.div(null, 
        React.DOM.ul( {className:"list-unstyled"}, 
          ReactCSSTransitionGroup( {transitionName:"fade"}, 
              postNodes
          )
        ),
        this.props.loadMore ? !this.props.loadingMore ?
          React.DOM.button( {className:"btn btn-primary center-block", onClick:this.props.loadMore, disabled:!this.props.isConnected}, 
                this.props.isConnected ? "Load More" : "Disconnected"
          ) :
          ProgressBar(null ) : null
      )
    );
  }
});

var PostsGrid = React.createClass({displayName: 'PostsGrid',
  render: function(){

    var postNodes = this.props.posts.map(function(post){
      return (
        React.DOM.div( {className:"masonry-item", key:post.id}, 
          Post( {post:post} )
        )
        );
    });

    return (
      React.DOM.div( {className:"masonry"}, 
        postNodes
      )
    );
  }
});

var HomePage = React.createClass({displayName: 'HomePage',
  mixins: [ReactAsync.Mixin],
  getInitialStateAsync: function(cb){
    superagent.get(this.props.apiEndpoints.posts, function(res){
      if(res.statusCode !== 200){
        return cb(res.text, null);
      }

      var posts = JSON.parse(res.text);

      cb(null, {posts: posts, newPosts: []});
    });
  },
  componentWillMount: function(){
    var socket = this.props.socket;

    socket.on("newPosts", function(posts){
      if(!this.state.posts) return;

      var newPosts = posts.concat(this.state.newPosts);

      this.setState({newPosts: newPosts});
    }.bind(this));

    socket.on("morePosts", function(posts){
      var newPosts = this.state.posts.concat(posts);

      this.setState({posts: newPosts, loadingMore: false});
    }.bind(this));

    socket.on("reconnect", function(){
      var lastPostId = this.state.newPosts.length ? this.state.newPosts[0].id : this.state.posts[0].id;

      socket.emit("newPostsSince", lastPostId);
    }.bind(this));

    socket.on("reconnecting", function(){
      socket.socket.reconnectionDelay = socket.socket.reconnectionDelay > 15000 ? 15000 : socket.socket.reconnectionDelay;
    }.bind(this));
  },
  addNewPosts: function(){
    this.state.posts.forEach(function(post){ post.isNew = false; });
    this.state.newPosts.forEach(function(post){ post.isNew = true; });

    var newPosts = this.state.newPosts.concat(this.state.posts);

    this.setState({posts: newPosts, newPosts: []});
  },
  loadMore: function(){
    if(!this.state.posts.length) return;

    this.setState({loadingMore: true});

    var id = this.state.posts[this.state.posts.length - 1].id;

    this.props.socket.emit("morePosts", id);
  },
  toggleView: function(){
    this.setState({showGrid: !this.state.showGrid});
  },
  render: function(){
    return (
      React.DOM.div(null, 
        React.DOM.div( {className:"row"}, 
          React.DOM.div( {className:"col-sm-4"}, 
            React.DOM.a( {className:"clickable " + (this.state.newPosts.length ? "show" : "invisible"),
              onClick:this.addNewPosts}, 
              this.state.newPosts.length, " new posts"
            )
          ),
          React.DOM.div( {className:"col-sm-4"}, 
            React.DOM.p( {className:"text-center " + (this.props.isConnected ? "invisible" : "show")}, 
            "Disconnected"
            )
          ),
          React.DOM.div( {className:"col-sm-4"}, 
            React.DOM.button( {className:"pull-right btn btn-primary", onClick:this.toggleView}, 
              React.DOM.span( {className:this.state.showGrid ? "glyphicon glyphicon-list" : "glyphicon glyphicon-th-large"})
            )
          )
        ),
        this.state.showGrid ?
          PostsGrid( {posts:this.state.posts, isConnected:this.props.isConnected} ) :
          PostsListing( {posts:this.state.posts, loadingMore:this.state.loadingMore, loadMore:this.loadMore, isConnected:this.props.isConnected} )
        
      )
      );
  }
});

module.exports = HomePage;
