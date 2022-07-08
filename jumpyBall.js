 /*
you don't need html code to run this
game on ur local computer.
this script will setup html by it self
and run well perfectly

 if you wanna read this code, read carefully and don't forget to forward any question or bug,error report to Austine Samuel via WhatsApp +2348063202017 for fast fix. 
 Thanks for viewing.*/
  const getQr = e => document.querySelector(e)
  //let user control the ball speed.
  let userBallSpeed = 5;
  let score = 0;
  let gameEnd = false;
  let initUpdate = true
  const howToPlay = `
Click or Tap screen to jump the ball to a specific height position.\n<br><br>
always jump to save the ball from been splited or crashed by enemy and also use the game controls at the top of your screen to control the game:<br> <br>\n\n 1.pouse/play and ball speed .\n<br><br>
2.click top of your screen to make a bigger jump!\n<br><br>
3.click bottom of your screen to make a smaller jump!\n\n<br> <br>

Game Codes and logic by Austine Samuel\n\n<br><br>enjoy!!!
`
  const audio = new Audio();
  const audio1 = new Audio();
  const ringtone = new Audio();
  const ballHit = new Audio();
  const gameOver = new Audio();
  const bg = new Image();
  gameOver.src = "/sounds/TZRM68V-game-over.mp3";
  bg.src = "/images/images (6).jpeg";
  bg.onload = (e) => {
    bg.setAttribute("loaded", "true")
  }
  audio1.src = "sounds/audio1.wav";
  audio.src = 'sounds/audio.wav'
  ringtone.src = '/sounds/modern-rnb-all-your-base-15484.mp3'
  ringtone.onload = () => {
    setTimeout(() => {
      ringtone.volume = 0.2;
      if (!gameEnd) ringtone.play()
    }, 10);
  }
  ballHit.src = "/F4J5TCX-ball-hits-ball.mp3";

  function ballSpeedController() {
    const inputCtn = document.createElement("div");
    inputCtn.innerHTML = `
 <div>
 <input type="range" min="0.5" max="15">
<b id="score" style="color:white">score: 0 </b>
<br><span style="color:white; padding-left:10px;">ball speed : 5 </span>
</div>
<button class="fa fa-play">Play
  </button>

 `
    let style = `
position:fixed;
z-index:9999;
width:100%;
right:0;
margin-left:-10px;
background:rgb(74,131,205);
display:flex;
justify-content:space-around;
align-items:center;
`;

    inputCtn.setAttribute("style", style);
    const meta = document.createElement("meta");
    meta.name = 'viewport'
    meta.content = "width=device-width, initial-scale=1"


    document.body.prepend(inputCtn);
    setTimeout(() => {
      getQr("head").appendChild(meta);
      const title=document.createElement("title");
      title.innerText="Jumpy Ball | version 0.1.0"
      getQr("head").appendChild(title)
      getQr("input").addEventListener("touchmove", (e) => {
        getQr("span").innerText = "ball speed : " + e.target.value
        userBallSpeed = parseFloat(e.target.value);
      });
      
    }, 0);
    document.body.onclick = (e) => {
      getQr("body").requestFullscreen();
      if (!gameEnd) ringtone.play();
    }
  }

  function gameInit() { //main game logic is in this fn
    const enemies = [];
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas)

    const ctx = canvas.getContext("2d");
    canvas.height = innerHeight;
    canvas.width = innerWidth;
    getQr("body").style.padding = 0;
    getQr("body").style.margin = 0;
    const random = (min, max) => Math.random() * (max - min + 1) + min | 0
    let randomColor = () => {
      return (`rgb(${random(50,255)},${random(50,255)},${random(50,255)}`)
    }
    //this script set the canvas for now to run
    function loadImages() {
      for (let i = 0; i <= 7; i++) {
        const img = new Image();
        img.src = "images/enemy" + i + ".png";
        img.onload = () => {
          img.setAttribute("loaded", true)

          enemies.push(img)
        }
      }
    }

    function fillCanvas() {
      if (bg.getAttribute("loaded") != "true") {
        ctx.beginPath();
        ctx.fillStyle = "rgb(1,1,1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.closePath();
      }
      else {
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
      }
    }
    let init1 = true //initialize game
    let clickOpacity = 1;

    function drawClick() {

      ctx.save()
      ctx.beginPath();
      const color = `rgba(255,255,255,${clickOpacity})`;
      ctx.strokeStyle = color;
      ctx.arc(ballPosition.px, ballPosition.py, 15, 0, 2 * Math.PI, true);
      ctx.stroke()
      ctx.closePath();
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(ballPosition.px, ballPosition.py, (12 + (clickOpacity * clickOpacity)), 0, 2 * Math.PI, true);
      ctx.fill();
      ctx.closePath()
      ctx.restore()
      if (clickOpacity > -1) {
        clickOpacity -= 0.03;
      }

    }

    function writeText(x, xw = 100, xh = 100, color, size = "12") {
      ctx.beginPath();
      ctx.font = size + "px arial";
      ctx.fillStyle = color != undefined ? color : "white";
      ctx.fillText(x, xw - size, xh)
      ctx.closePath()
    }
    fillCanvas();
    loadImages()
    setTimeout(() => {
      writeText("Click PLAY button to start the game", 100, canvas.height / 2, "white", 12)
    }, 1000);

    class RoadHoles {
      constructor(len, holes) {
        this.len = len;
        this.holes = holes;
        this.position = { x: canvas.width + 30, y: canvas.height - 50 }
        this.xSpeed = 1;
        this.img = enemies[random(0, enemies.length - 1)];

      }
      draw() {
        ctx.beginPath();
        ctx.fillStyle = gameEnd ? "white" : randomColor()
        if (this.img == undefined) {
          ctx.fillRect(this.position.x, this.position.y - 25, 10, 40);
        }
        else {
          ctx.drawImage(this.img, this.position.x, this.position.y - 25, 30, 40)
          ctx.closePath()
        }
      }
      update() {
        this.position.x -= this.xSpeed;
      }
    }

    class BallAnimation {
      constructor() {
        this.followMouse = false
        this.color = "white"
        this.animate = {
          maxY: 0,
          up: false,
          down: true,
          ballSpeed: 20,
          off: false
        }
      }

      bounce() {
        if (!this.followMouse) return
        if (this.animate.down) {
          ballPosition.y -= this.animate.ballSpeed
          if (ballPosition.y < this.animate.maxY) {
            this.animate.maxY = init1 ? this.animate.maxY + screen.height / 10 : canvas.height;
            this.animate.down = false
            this.animate.ballSpeed -= 0.5
            //ballHit.play()
          }
          else {
            init1 = initUpdate //cancel game initialization

          }
        }
        else {
          ballPosition.y += this.animate.ballSpeed;
          if (ballPosition.y > canvas.height - 70) {
            this.animate.down = true;
            if (this.animate.maxY > canvas.height - 100) this.followMouse = false
            this.animate.ballSpeed -= 0.5
            ballHit.play()
          }
        }

      }

      draw() {
        drawBall(ballPosition.x, ballPosition.y, this.color)
      }
      onTouches() {
        const handleTouches = (e) => {
          ballPosition.py = Math.floor(e.touches[0].clientY)
          ballPosition.px = Math.floor(e.touches[0].clientX)

          if (!gameEnd) ringtone.play()
        }
        const that = this;
        canvas.addEventListener("touchstart", handleTouches);
        canvas.addEventListener("touchmove", handleTouches);
        canvas.addEventListener("touchend", () => {
          that.animate.ballSpeed = userBallSpeed;
          that.followMouse = true
          that.animate.maxY = ballPosition.py;
          clickOpacity = 1;
          if (!gameEnd) audio.play()
        });
        that.followMouse = true;


      }
    }
    const ballAnimation = new BallAnimation()
    const ballPosition = {
      x: 100,
      y: canvas.height - 70,
      py: canvas.height / 4,

      mainY: canvas.height - 70
    }

    function drawBall(x, y, color) {
      if (x > ballPosition.mainY) {
        x = ballPosition.mainY;
      }
      ctx.beginPath();
      ctx.fillStyle = color
      ctx.arc(x, y + 10, 20, 0, 2 * Math.PI, true)
      ctx.fill()
      ctx.closePath()

    }

    let velocity = 1.5
    class RoadMark {
      constructor(color) {
        this.x = canvas.width + 50;
      }
      update() {
        this.x -= velocity;
      }
      draw() {
        ctx.save()
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.lineCap = "round";
        ctx.fillRect(this.x, canvas.height - 30, 30, 3);
        ctx.closePath();
        ctx.restore()
      }
    }


    const roadImg = new Image();
    roadImg.src = "/images/images.png"
    roadImg.onload = () => {
      roadImg.loaded = true

    }

    function road() {
      ctx.beginPath();
      const color = 'white'
      ctx.fillStyle = color
      if (roadImg.loaded) {
        ctx.drawImage(roadImg, 0, canvas.height - 50, canvas.width + 10, 40);
      }
      else {

        ctx.fillRect(0, canvas.height - 50, canvas.width, 40)
        ctx.fillStyle = "rgb(1,1,30)";
        ctx.fillRect(0, canvas.height - 25, canvas.width, 20)
      }
    }
    road();
    const roadHoles = [new RoadHoles(20, 0)]
    const roadMarks = [new RoadMark("black")]
    let frameId = "";
    let pushSpeed = 0;
    let maxToPush = 200;
    let roadMarksGab = 20;
    let holeVelocity = 0.0005

    setTimeout(() => {
      getQr("button").addEventListener("click", (e) => {
        if (typeof swal == "undefined") return
        const el = e.target;
        if (gameEnd || initUpdate) {
          gameEnd = false;
          el.innerText = "PAUSE"
          frameId = requestAnimationFrame(animate)
          initUpdate = false;
        }
        else {
          gameEnd = true;
          el.innerText = "PLAY";
        }
      });
    }, 100);

    function animate() {
      fillCanvas()
      drawClick();
      road()
      ballAnimation.draw()
      ballAnimation.bounce()


      roadMarks.forEach((e, i) => {
        e.update()
        e.draw()
        if (e.x < -200) {
          roadMarks.splice(i, 1);
        }
      })
      if (roadMarksGab <= 0) {
        roadMarksGab = 20;
        roadMarks.push(new RoadMark("black"))
      }
      if (!initUpdate) {
        roadHoles.forEach((e, i) => {
          e.update();
          e.draw();
          velocity += 0.005;
          e.xSpeed += holeVelocity
          if (e.position.x < -10) {
            roadHoles.splice(i, 1);
            score += 10;
            writeText("+10", random(100, canvas.width), random(100, canvas.height));
            getQr("#score").innerText = 'score : ' + score
          }
          //chech collision

          coligCondision = /*check if enemy ,hole,bug meet the ball horizontally*/ (Math.floor(e.position.x) <= Math.floor(ballPosition.x) &&
            Math.floor(e.position.x) > ballPosition.x - 10
            /*end checking Collision for the x co-ordinate*/

            &&
            /*check if ball was jumb higher than the bug,hole,enemy*/
            ballPosition.y > canvas.height - 81
          )





          if (coligCondision) {
            let setCtv = setInterval(() => {
              fillCanvas();
              road()
              drawBall(ballPosition.x, ballPosition.y, `rgb(${random(0,255)},${random(0,255)},${random(0,255)}`)

              roadHoles.map(e => e.draw())
              writeText("x", ballPosition.x + 30, ballPosition.y + 20, randomColor(), 30);
              roadMarks.map(e => e.draw())

              writeText("Game Over", 100, canvas.height / 2, randomColor(), 50)

            }, 500)



            ringtone.pause();
            gameOver.play();
            /*game over*/
            gameEnd = true;
            cancelAnimationFrame(frameId)
            setTimeout(() => {
              clearInterval(setCtv)
              fillCanvas();
              roadMarks.splice(0, roadMarks.length);
              velocity = 1;
              initUpdate = true;
              gameEnd = true;
              roadHoles.splice(0, roadHoles.length)
              //frameId=requestAnimationFrame(animation);
              animate()
            }, 3000);



            setTimeout(() => {
              swal.fire("Game over!<br>your score is : " + score + "<br>your previous score is : " + (localStorage.getItem("score") ? localStorage.getItem("score") : "0"), "<br>click ok to play again,<br> Tip:<br>always jump when enemy comming closer to you!").then(() => {

                localStorage.setItem("score", score)
                score = 0;
              });

            }, 30);


          }
          //end checking collision
          for (let i = 0; i <= 30; i++) {
            writeText(["..", "<<<", "..."][random(0, 2)], random(0, canvas.width), random(0, canvas.height), `rgb(${random(0,255)},${random(0,255)},${random(0,255)})`, random(0, 13));
          }

        });
      }
      else {
        writeText("Click 'PLAY' BUTTON TO START", 30, canvas.height / 2, randomColor(), 25)
      }

      if (gameEnd) return
      if (pushSpeed >= maxToPush) {
        roadHoles.push(new RoadHoles(20, 0))
        //console.log(roadHoles)
        //return cancelAnimationFrame(frameId)
        pushSpeed = 0;
      }

      pushSpeed += (1 + Math.floor(holeVelocity))
      maxToPush -= 0.05;
      roadMarksGab -= (velocity / 3);
      holeVelocity += 0.00005
      frameId = requestAnimationFrame(animate)
    }









    function init() {
      animate()
      ballAnimation.onTouches();
      
    }
    //initiat game code
    let alertM = setInterval(() => {
      if (typeof swal == "undefined") return
      swal.fire("HOW TO PLAY!", howToPlay).then(() => {
        init()
        addApp();
      })
      clearInterval(alertM)
    }, 1000);

  }



  //lib
  const useScript = (scriptSrc = null) => {
    try {
      if (scriptSrc == null) {
        throw "unable to add script file : scriptSrc must contain a valid script URI";
      }
      const script = document.createElement("script")
      script.src = scriptSrc
      document.body.appendChild(script);
      return true;
    }
    catch (err) {
      console.error(err);
      if (err == "") return true;
      else return false;
    }
  }
  onerror = (a, b, c, d) => {
    console.error("Nvm mind this bug , this programmer is inlove so Maybe his computer is jealous that's why it generating errors, Sorry tho!");
    console.log(a, b, c, d)
  }

  function addApp() {
    manifest = document.createElement("link");
    manifest.href = "/manifest.json";
    manifest.rel = "manifest"
    getQr("head").appendChild(manifest)
setTimeout(()=>{
  navigator.serviceWorker.register("/installer.js").then((e)=>{
    console.log("log",e)
  })
})
  }
  onload = () => {
    useScript("https://cdn.jsdelivr.net/npm/sweetalert2@9.3.4/dist/sweetalert2.all.min.js")
    gameInit() //initiat game
    ballSpeedController()
  }
