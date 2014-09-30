$(document).ready( function() {

    var game = {

        speed: 10,
        x : 25,
        y : 250,
        dx : 2,
        dy : -4,
        ctx : 0,
        WIDTH: 0,
        HEIGHT : 0,
        paddlex: 0,
        paddleh : 10,
        paddlew : 75,
        rightDown : false,
        leftDown : false,
        canvasMinX : 0,
        canvasMaxX : 0,
        intervalId : 0,
        bricks : new Array(),
        NROWS : 5,
        NCOLS : 5,
        BRICKWIDTH: 0,
        BRICKHEIGHT : 30,
        PADDING : 1,
        ballr : 10,
        rowcolors : ["#5bc0de"],
        paddlecolor : "#5bc0de",
        ballcolor : "#FFFFFF",
        backcolor : "transparent",
        
        init: function() {
            game.ctx = $('#screen')[0].getContext("2d");
            game.WIDTH = $("#screen").width();
            game.HEIGHT = $("#screen").height();
            game.paddlex = game.WIDTH / 2;
            game.BRICKWIDTH = (game.WIDTH/game.NCOLS) - 1;
            game.canvasMinX = $("#screen").offset().left;
            game.canvasMaxX = game.canvasMinX + game.WIDTH;
            game.intervalId = setInterval(draw, game.speed);
            return game.intervalId;
        },
        
        circle: function(x,y,r) {
          game.ctx.beginPath();
          game.ctx.arc(x, y, r, 0, Math.PI*2, true);
          game.ctx.closePath();
          game.ctx.fill();  
        },
        
        rect: function(x,y,w,h) {
            game.ctx.beginPath();
            game.ctx.rect(x,y,w,h);
            game.ctx.closePath();
            game.ctx.fill();    
        },
        
        clear: function() {
          game.ctx.clearRect(0, 0, game.WIDTH, game.HEIGHT);
          game.rect(0,0,game.WIDTH,game.HEIGHT);    
        },
        
        onKeyDown: function(evt) {
            if (evt.keyCode == 39) game.rightDown = true;
            else if (evt.keyCode == 37) game.leftDown = true;   
        },  
        
        onKeyUp: function(evt) {
            if (evt.keyCode == 39) game.rightDown = false;
            else if (evt.keyCode == 37) game.leftDown = false;  
        },
        
        onMouseMove: function(evt) {
            if (evt.pageX > game.canvasMinX && evt.pageX < game.canvasMaxX) {
                game.paddlex = Math.max(evt.pageX - game.canvasMinX - (game.paddlew/2), 0);
                game.paddlex = Math.min(game.WIDTH - game.paddlew, game.paddlex);
            }   
        }
    }

    
    function initBricks() {
        game.bricks = new Array(game.NROWS);

        for (i=0; i < game.NROWS; i++) {
            game.bricks[i] = new Array(game.NCOLS);
            for (j=0; j < game.NCOLS; j++) {
                game.bricks[i][j] = 1;
            }
        }   
    }
    
    function drawBricks() {
      for (i=0; i < game.NROWS; i++) {
        game.ctx.fillStyle = game.rowcolors[i];
        for (j=0; j < game.NCOLS; j++) {
          if (game.bricks[i][j] == 1) {
            game.rect((j * (game.BRICKWIDTH + game.PADDING)) + game.PADDING, 
                 (i * (game.BRICKHEIGHT + game.PADDING)) + game.PADDING,
                 game.BRICKWIDTH, game.BRICKHEIGHT);
          }
        }
      }
    }
    
    function draw() {
        game.ctx.fillStyle = game.backcolor;
        game.clear();
        game.ctx.fillStyle = game.ballcolor;
        game.circle(game.x, game.y, game.ballr);

        if (game.rightDown) game.paddlex += 5;
        else if (game.leftDown) game.paddlex -= 5;
        game.ctx.fillStyle = game.paddlecolor;
        game.rect(game.paddlex, game.HEIGHT-game.paddleh, game.paddlew, game.paddleh);

        drawBricks();

        rowheight = game.BRICKHEIGHT + game.PADDING;
        colwidth = game.BRICKWIDTH + game.PADDING;
        row = Math.floor(game.y/rowheight);
        col = Math.floor(game.x/colwidth);
        if (game.y < game.NROWS * rowheight && row >= 0 && col >= 0 && game.bricks[row][col] == 1) {
            game.dy = -game.dy;
            game.bricks[row][col] = 0;
        }

        if (game.x + game.dx + game.ballr > game.WIDTH || game.x + game.dx - game.ballr < 0)
        game.dx = -game.dx;

        if (game.y + game.dy - game.ballr < 0)
        game.dy = -game.dy;
        else if (game.y + game.dy + game.ballr > game.HEIGHT - game.paddleh) {
        if (game.x > game.paddlex && game.x < game.paddlex + game.paddlew) {
          game.dx = 8 * ((game.x-(game.paddlex+game.paddlew/2))/game.paddlew);
          game.dy = -game.dy;
        }
        else if (game.y + game.dy + game.ballr > game.HEIGHT)
          clearInterval(game.intervalId);
        }

        game.x += game.dx;
        game.y += game.dy;  
    }
    
    $(document).keydown(game.onKeyDown);
    $(document).keyup(game.onKeyUp);
    $(document).mousemove(game.onMouseMove);

    game.init();
    initBricks();
});
