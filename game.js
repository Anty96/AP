const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 800;
const SPEED = 480;

// initialize context
kaboom({
	scale: 1,

    fullscreen: true,
    global: true,
})

loadSound("ida", "idasie.m4a")

// load assets
loadSprite("mario", "mario.png");
loadSprite("background", "background3.jpg");
loadSprite("coin", "wojak.png");


const music = play("ida", {
	loop: true,
})

scene("game", ({ coins } = {coins : 0} ) => {

    

    add([
        sprite("background")
    ]);

    // define gravity
    gravity(2400);

    // add a game object to screen
    const player = add([
        // list of components
        sprite("mario"),
        pos(80, 40),
        area(),
        body(),
        scale(1)
    ]);




    // floor
    add([
        rect(width(), FLOOR_HEIGHT),
        outline(4),
        pos(0, height()),
        origin("botleft"),
        area(),
        solid(),
        color(127, 200, 255),
    ]);



    function jump() {
        if (player.isGrounded()) {
            player.jump(JUMP_FORCE);
        }
    }

    // jump when user press space
    onKeyPress("space", jump);
    onClick(jump);


    function spawnCoin(){

    
    add([
        sprite("coin"),
        pos(width(), height() - FLOOR_HEIGHT),
        scale(0.5),
        area(),
        origin("bot"),
        move(LEFT, SPEED),
        "coin",
    ]);

    wait(rand(0.5, 1), spawnCoin);
    }

    spawnCoin();



	player.onCollide("coin", (c) => {
		destroy(c)

		score++
		scoreLabel.text = score
	})

    let score = 0;

    const scoreLabel = add([
        text(score),
        pos(24, 24),
    ]);







    function spawnTree() {

        // add tree obj
        add([
            rect(48, rand(32, 96)),
            area(),
            outline(4),
            pos(width(), height() - FLOOR_HEIGHT),
            origin("botleft"),
            color(255, 180, 255),
            move(LEFT, SPEED),
            "tree",
        ]);

        // wait a random amount of time to spawn next tree
        wait(rand(1, 1.5), spawnTree);

    }

    // start spawning trees
    spawnTree();

    // lose if player collides with any game obj with tag "tree"
    player.onCollide("tree", () => {
        // go to "lose" scene and pass the score
        go("lose", score);
        burp();
        addKaboom(player.pos);




    });

    // keep track of score






});

scene("lose", (score) => {


    add([
        sprite("background")
    ]);

    add([
        sprite("mario"),
        pos(width() / 2, height() / 2 - 80),
        scale(2),
        origin("center"),
    ]);

    // display score
    add([
        text(score),
        pos(width() / 2, height() / 2 + 80),
        scale(2),
        origin("center"),
    ]);

    // go back to game with space is pressed
    onKeyPress("space", () => go("game"));
    onClick(() => go("game"));

});



go("game");