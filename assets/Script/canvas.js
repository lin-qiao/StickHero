cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
      var main = cc.find("Canvas/main").getComponent(require("main"));
      this.node.once('touchstart',main.longerAction,main);
      this.node.once('touchend',main.removeAction,main);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
