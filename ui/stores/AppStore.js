var EventEmitter = require("events").EventEmitter,
  merge = require("react/lib/merge"),
  superagent = require("superagent"),
  ioClient = require("socket.io-client");

var CHANGE_EVENT = "change",
  posts = [],
  newPosts = [],
  socketIOConnectionState = false,
  loadingMore = false;

if(typeof window !== "undefined") {
  var asyncState = window.__reactAsyncStatePacket[Object.keys(window.__reactAsyncStatePacket)[0]];

  posts = asyncState.posts;
}

var socket = ioClient.connect("/", {"max reconnection attempts": Infinity});

var AppStore = merge(EventEmitter.prototype, {
  getInitialPostsAsync: function(postsApiEndpoints, cb){
    superagent.get(postsApiEndpoints, function(res){
      if(res.statusCode !== 200){
        return cb(res.text, null);
      }

      posts = JSON.parse(res.text);

      cb(null, {
        posts: posts,
        newPosts: [],
        loadingMore: false,
        isConnected: socketIOConnectionState
      });
    });
  },
  getPosts: function(){
    return posts;
  },
  getNewPosts: function(){
    return newPosts;
  },
  isLoadingMore: function(){
    return loadingMore;
  },
  isConnected: function(){
    return socketIOConnectionState;
  },
  addNewPosts: function(){
    posts.forEach(function(post){ post.isNew = false; });
    newPosts.forEach(function(post){ post.isNew = true; });

    posts = newPosts.concat(posts);

    newPosts = [];

    this.emitChange();
  },
  loadMore: function(){
    if(!posts.length) return;

    loadingMore = true;

    var id = posts[posts.length - 1].id;

    socket.emit("morePosts", id);

    this.emitChange();
  },
  logPostClick: function(postId){
    socket.emit("logPostClick", postId);
  },
  emitChange: function(){
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function(cb){
    this.on(CHANGE_EVENT, cb);
  },
  removeChangeListener: function(cb){
    this.removeListener(CHANGE_EVENT, cb);
  }
});

socket.on("connect", function(){
  socketIOConnectionState = true;

  AppStore.emitChange();
});

socket.on("disconnect", function(){
  socketIOConnectionState = false;

  AppStore.emitChange();
});

socket.on("newPosts", function(posts){
  if(!posts) return;

  newPosts = posts.concat(newPosts);

  AppStore.emitChange();
});

socket.on("morePosts", function(morePosts){
  posts = posts.concat(morePosts);
  loadingMore = false;

  AppStore.emitChange();
});

socket.on("reconnect", function(){
  var lastPostId = newPosts.length ? newPosts[0].id : posts[0].id;

  socket.emit("newPostsSince", lastPostId);
});

socket.on("reconnecting", function(){
  socket.socket.reconnectionDelay = socket.socket.reconnectionDelay > 15000 ? 15000 : socket.socket.reconnectionDelay;
});

module.exports = AppStore;
