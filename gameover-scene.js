var SceneGameOver = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function () {
        Phaser.Scene.call(this, {'key': 'SceneGameOver'});
    },
    init: function(data){
        this.highscore = data.highscore;
    },

    preload: function () {
        this.load.image('outro','assets/outro.png');
    },

    create: function () {

        this.add.image(400, 300, 'outro');

        var text1 = this.add.text(
            210, // x 
            200, // y
            'Game Over',
            {
                fontSize: '900 50px', fill: '#ffa500'
            }
        );

        var text2 = this.add.text(
            210,
            250,
            'High score: ' + this.highscore,
            {
                fontSize: '900 50px', fill: '#ffa500'
            }
        );
    },
    update: function () {}
})