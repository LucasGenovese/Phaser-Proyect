var SceneGameStart = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function(){
        Phaser.Scene.call(this, {'key': 'SceneGameStart'});
    },
    init: function() {},

    preload: function() {
        this.load.image('intro','assets/intro.png');
    },

    create: function () {
        this.add.image(400,300, 'intro');

        this.cameras.main.fadeOut(3000);            

        this.time.addEvent({
            delay: 4000,
            loop: false,
            callback: () => {
                this.scene.start('SceneGame')
            }
        })

    },
    update: function() {}
});