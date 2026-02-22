"use strict";

// 初期設定
let canvas, g;
let characterPosX, characterPosY, characterimage, characterR;
let sunPosX, sunPosY, sunimage;
// キャラクターのシードと重力
let speed, acceleration;
// 敵キャラ
let enemyPosX, enemyPosY, enemyimage, enemySeed, enemyR, enemyram;
let townPosX, townPosY, townimage, townSeed, towns;
// 背景
let kumoPosX, kumoPosY, kumoimage, kumoSeed, kumos;


let text = document.getElementById("text");
let btn = document.getElementById("btn");


let isJumping;
let startButton;
let endButton;

let score;
let scene;

let gameCount = 0;
let frameIndex, frameCount, frameWidth, frameHeight;

// シーンの定義
const Scenes = {
    GameStart: "GameStart",
    GameMain: "GameMain",
    GameOver: "GameOver",
};



// 読み込み時の初期設定
onload = function kaisi() {
    // 描画コンテキストの取得
    canvas = document.getElementById("gamecanvas");
    // gに関する処理を2ｄ使用に
    g = canvas.getContext("2d");
    // 初期値実行
    init()
    scene = Scenes.GameStart;
    // 入力処理の指定
    // document.onkeydown = keydown;
    document.addEventListener("keydown", keydown);
    document.addEventListener("touchstart", keydown);

    // ゲームループの設定 60FPS
    setInterval(gameloop, 16);
};


// ゲームを行う際の初期値の設定
function init() {
    speed = 0;
    score = 0;
    acceleration = 0;
    enemyram = [630, 600, 830, 830, 830];

    // キャラクター 200px

    characterimage = new Image();
    characterimage.src = "img/spritesheet.png";
    characterimage.onload = () => {
        frameIndex = 0;
        frameCount = 2;
        frameWidth = 823;
        frameHeight = 789;

        characterPosX = 400;
        characterPosY = 800;
        characterR = 90;
    };

    enemyPosX = 1800;
    enemyPosY = 800 + 30; //ピクセル差を合わせるために下げる
    enemyR = 60;
    enemyimage = new Image();
    enemyimage.src = "img/onion.png";
    enemyimage.width = 100;
    enemySeed = 10;

    // 太陽
    sunPosX = 1500;
    sunPosY = 100;
    sunimage = new Image();
    sunimage.src = "img/sun.png";

    // // 雲

    kumos = [
        new kumo(100, 300, "img/cloud.png"),
        new kumo(700, 200, "img/cloud.png"),
        new kumo(1300, 300, "img/cloud.png"),
        new kumo(1900, 200, "img/cloud.png")
    ];

    // town
    towns = [
        new town(0, 700, "img/town.png"),
        new town(1990, 700, "img/town.png"),
        new town(3980, 700, "img/town.png")
    ];



    //制御処理を一度所機状態へ
    isJumping = false;
    startButton = false;
    endButton = false;
}

class kumo {
    constructor(kumoPosX, kumoPosY, kumoimage) {
        this.x = kumoPosX;
        this.y = kumoPosY;
        this.image = new Image();
        this.image.src = kumoimage;
    }

    update(enemySeed) {
        this.x -= enemySeed * 0.05;
        if (this.x <= -300) {
            this.x = 2000;
        }
    }

    draw() {
        g.drawImage(
            this.image,
            this.x - 600 / 2,
            this.y - 600 / 2,
            600,
            600
        );
    }
}

class town {
    constructor(townPosX, townPosY, townimage) {
        this.x = townPosX;
        this.y = townPosY;
        this.image = new Image();
        this.image.src = townimage;
    }
    update(enemySeed) {
        this.x -= enemySeed * 0.1;
        if (this.x <= -2000) {
            this.x = 3970;
        }
    }

    draw() {
        g.drawImage(
            this.image,
            this.x - 1600 / 2,
            this.y - 550 / 2,
            2000,
            600
        );
    }
}


// ボタンを押した際におこる変化
function keydown(e) {

    if (!isJumping && e.key == "Shift") {
        speed = -30;
        acceleration = 1.4;
        isJumping = true; // ジャンプ中に設定
    }


}

// ゲーム内で繰り返し行う処理(60フレーム毎)
function gameloop() {
    update();
    draw();
}

// 更新処理
function update() {

    if (scene == Scenes.GameStart) {


        if (!startButton) {
            let button = document.createElement("button");

            button.className = "start";
            button.textContent = "スタート";

            let setumei = document.createElement("div");
            let setumei_h3 = document.createElement("h3");
            let setumei_honbun = document.createElement("p");
            setumei.className = "setumeibun";
            setumei_h3.textContent = "ルール説明";
            setumei_honbun.textContent = "トマト君は長谷川の家の飼い猫です。にゃんこの苦手な玉ねぎがやってきたらシフトでジャンプ！\nできるだけ遠くへ出かけてみよう！"
            setumei_honbun.style.whiteSpace = 'pre-wrap';
            button.addEventListener("click", () => {
                setumei.remove()
                button.remove();
                scene = Scenes.GameMain;
            });
            btn.appendChild(button);
            startButton = true;


            setumei.appendChild(setumei_h3);
            setumei.appendChild(setumei_honbun);
            text.appendChild(setumei);
        }

    }

    else if (scene == Scenes.GameMain) {
        // ジャンプに関する処理
        speed = speed + acceleration;
        characterPosY = characterPosY + speed;

        // 落下制御
        characterPosX = 400;
        if (characterPosY > 800) {
            characterPosY = 800;
            speed = 0;
            acceleration = 0;
            // ジャンプ関数の制御
            isJumping = false;
        }
        let framespeed = Math.floor(15 - score * 0.003)
        if (gameCount % framespeed === 0) {
            frameIndex = (frameIndex + 1) % frameCount;
        }


        // 敵の処理
        enemyPosX -= enemySeed + (score * 0.005);
        if (enemyPosX <= -100) {
            enemyPosX = 1800;
            enemyPosY = enemyram[Math.floor(Math.random() * enemyram.length)];

            score += 100;
        }

        // 雲
        for (let j of kumos) {
            j.update(enemySeed)
        }

        for (let m of towns) {
            m.update(enemySeed)
        }

        // 当たり判定
        var diffX = characterPosX - enemyPosX;
        var diffY = characterPosY - enemyPosY;
        var distance = Math.sqrt(diffY * diffY + diffX * diffX);
        if (distance < characterR + enemyR) {
            scene = Scenes.GameOver;

        }
        document.getElementById("text").innerHTML = "SCORE: " + score;
        gameCount++;
    }


    else if (scene == Scenes.GameOver) {
        if (!endButton) {
            let button = document.createElement("button");

            button.className = "end";
            button.textContent = "メイン画面へ";
            button.addEventListener("click", () => {
                init()
                scene = Scenes.GameStart;
                document.getElementById("text").innerHTML = "";
                button.remove();
            });
            btn.appendChild(button);
            endButton = true;
        }

    }
}

// 描画処理
function draw() {



    // 背景描写
    g.fillStyle = "#71a1d1";
    g.fillRect(0, 0, 1600, 1000);
    // キャラクター
    // ここでｇを使用することによって（描画、横、縦）の数値の設定を行なっている

    for (let n of towns) {
        n.draw();
    }

    let sx = frameIndex * frameWidth;
    g.drawImage(
        characterimage,
        sx,
        0,
        frameWidth,
        frameHeight,
        characterPosX - 200 / 2,
        characterPosY - 200 / 2,
        200,
        200,
    );

    for (let k of kumos) {
        k.draw();
    }




    g.drawImage(
        enemyimage,
        enemyPosX - 140 / 2,
        enemyPosY - 140 / 2,
        140,
        140
    );

    g.drawImage(
        sunimage,
        sunPosX - 200 / 2,
        sunPosY - 200 / 2,
        200,
        200
    )



}