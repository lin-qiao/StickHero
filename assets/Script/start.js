cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
      this.node.on('touchstart',function(){
        cc.director.loadScene("mainScene");
      })

    },
});
