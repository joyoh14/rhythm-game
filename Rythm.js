window.addEventListener("load", readyScreen, false);
window.addEventListener("keydown", onkeydown, false);
window.addEventListener("mousedown", onmousedown, false);
window.addEventListener("mouseup", onmouseup, false);
window.addEventListener("keyup", onkeyup, false);
window.addEventListener("resize", onresize,  false);

Img = new Image(); //진행 노트 불러오기 
Img.src = "Img/Note.png";
Img.addEventListener("load", readyScreen, false);

soundMusic = new Audio(); //게임 사운드 불러오기
soundMusic.addEventListener("load", readyScreen, false);


var canvas 
var ctx 
//게임상태 관련 변수
var Game = 0; 
var Game_READY = 0;  
var Game_GAME = 1; 
var Game_OVER = 2; 
var Game_SEL = 3;
//노트 관련 변수
var speed; 
var arrtempMissile_1 = new Array(); 
var arrtempMissile_2 = new Array();
var arrtempMissile_3 = new Array();

var Num_1 = 0; 
var Num_2 = 0;
var Num_3 = 0;
//기타 변수들
var Point = 0;
var backGroundColor = "white";
var lineColor = "black";
var koline = [0, 0, 0];
var judge;
var canvasH; 
var canvasW;
//var noteCount= 0;
var Combo = 0;
var Score_Num = [0,0,0];
var Score = [,,] //판정 점수
var Blur = [0.1, 0.1, 0.1];
var intY =  0;
//키 입력 여부 배열로 변환 예정
var key1=false;
var key2=false;
var key3=false;
//노래정보 관련 변수
var songTrack1;
var songTrack2; 
var songTrack3;
var SongCode = -1;
var Level = 1;
//곡 선택화면 관련 변수
var radius = 100;
var circle = {centerX:0, centerY:0, radius:427, angle:0};
var ball = {x:0, y:0, spee:0.05, size:84};                                          
var GoGoUp = false, GoGoDown = false, GoGoTo = true;

function onresize()
{
    canvas.height = window.innerHeight - 30;
    canvas.width = window.innerWidth; 
    canvasH = canvas.height;
    canvasW = canvas.width;
    judge = (canvasH / 7) * 6;
    speed = canvasH / 141.414141; //판정선 위치 공식 (수정예정)
    if (Game == Game_READY){readyScreen();}
    if (Game == Game_GAME){drawScreen();}
}

function onmousedown(e)
{
    if(Game == Game_READY)
    {
        Game = Game_SEL;
        selection();
    }
    if (Game == Game_SEL)
    {
        SongCode = 1;
        Level = 1;
        selected();
    }
    if (Game == Game_GAME)
    {
        if(e.clientY >= judge && e.clientX < 100)
        {
            key1=true; 
            onGameScore_1();
        }
        if(e.clientY >= judge && 100 < e.clientX && e.clientX < 200)
        {
            key2=true; 
            onGameScore_2();
        }
        if(e.clientY >= judge && 200 < e.clientX)
        {
            key3=true; 
            onGameScore_3();
        }
    }
}
function onmouseup(e)
{
    if(Game == Game_GAME)
    {
        if(e.clientY >= judge && e.clientX < 100)
        {
            key1 = false;
            koline[0]=0;
        }
        if(e.clientY >= judge && 100 < e.clientX && e.clientX < 200)
        {
            key2 = false;
            koline[1]=0;
        }
        if(e.clientY >= judge && 200 < e.clientX)
        {
            key3 = false;
            koline[2]=0;
        }
    }
}

function drawScreen() 
{
    ctx.fillStyle = backGroundColor;
    ctx.strokeStyle = lineColor;
    ctx.fillRect(0, 0, canvas.width, canvasH);
    ctx.lineWidth = 1;
    ctx.drawLine(100, 0, 100, canvasH);
    ctx.drawLine(200, 0, 200, canvasH);
    ctx.drawLine(300, 0, 300, canvasH);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "Green";
    ctx.drawLine(0, judge, 100, judge);
    ctx.strokeStyle = "Blue";
    ctx.drawLine(100, judge, 200, judge);
    ctx.strokeStyle = "Red";
    ctx.drawLine(200, judge, 300, judge);
    ctx.fillStyle = "black";

    if (key1){
        var brush = ctx.createLinearGradient(2,canvasH / 7 * 3, 2, canvasH / 7 * 9);
        brush.addColorStop(0, backGroundColor);
        brush.addColorStop(1, "Green");
        ctx.fillStyle = brush;
        ctx.fillRect(1,judge-2,98,koline[0]);
        ctx.fillStyle = "black"
        if (koline[0] > Math.floor(-(canvasH / 7 * 3))){koline[0]-=canvasH / 60;}
    }
    if (key2){
        var brush = ctx.createLinearGradient(102,canvasH / 7 *3, 102,canvasH / 7 * 9);
        brush.addColorStop(0, backGroundColor);
        brush.addColorStop(1, "Blue");
        ctx.fillStyle = brush;
        ctx.fillRect(101,judge-2,98,koline[1]);
        if (koline[1] > Math.floor(-(canvasH / 7 * 3))){koline[1]-=canvasH / 60;}
    }
    if (key3){
        var brush = ctx.createLinearGradient(202,canvasH / 7 * 3, 202, canvasH / 7 * 9);
        brush.addColorStop(0, backGroundColor);
        brush.addColorStop(1, "Red");
        ctx.fillStyle = brush;
        ctx.fillRect(201,judge-2,98,koline[2]);
        if (koline[2] > Math.floor(-(canvasH / 7 *3))){koline[2]-=canvasH / 60;}
    }

    for (var i in arrtempMissile_1){ctx.drawImage(Img, 0, 0, 188, 28, arrtempMissile_1[i].x, arrtempMissile_1[i].y, 100, 20);}
    for (var i in arrtempMissile_2){ctx.drawImage(Img, 0, 28, 188, 28, arrtempMissile_2[i].x, arrtempMissile_2[i].y, 100, 20);}
    for (var i in arrtempMissile_3){ctx.drawImage(Img, 0, 56, 188, 28, arrtempMissile_3[i].x, arrtempMissile_3[i].y, 100, 20);}
    for (var i=0; i<3; i++){
        if(Score_Num[i]){
            if (Score[i] == "Miss"){ctx.fillStyle="Red";}
            else{ctx.fillStyle = lineColor;}
            ctx.lineWidth = "3";
            ctx.font="bold 28px Arial";
            ctx.globalAlpha=Blur[i];

            if (Blur[i] <= 1){
                Blur[i]+=0.01;
                ctx.fillText(Score[i], i*100+15, judge -10 - (Blur[i]*10));
                if (Combo < 20)
                {
                    ctx.fillText(Combo+ " combo", 90, 100);
                }
                else if(Combo >= 20)
                {
                    ctx.fillText("Max COMBO!!", 70, 100);
                }
            }
            if (Blur[i] > 1){
                Blur[i] = 0;
                Score_Num[i] = false;
            }
        }
    }
    ctx.lineWidth = 1;
    ctx.globalAlpha=1;
    ctx.fillStyle = backGroundColor;
    ctx.fillRect(-2, canvasH - (canvasH / 100 * 2), 302, canvasH);
    ctx.strokeStyle = lineColor;
    ctx.strokeRect(-2, canvasH - (canvasH / 100 * 2), 302, canvasH / 100 * 2);
    ctx.fillStyle = lineColor;
    ctx.fillRect(-2, canvasH - (canvasH / 100 * 2), Point/100 *3, canvasH / 100 * 2);
    if (soundMusic.currentTime < 10){
        ctx.font =" bold 40px Arial";
        ctx.fillStyle = lineColor;
        ctx.fillText("A",35, canvasH / 7 * 6 + canvasH / 70 * 6);
        ctx.fillText("S", 135, canvasH / 7 * 6 + canvasH / 70 * 6);
        ctx.fillText("D",235, canvasH / 7 * 6 + canvasH / 70 * 6);
    }
    /*if (Combo % 5 == 0 && Combo !=0)
    {
        ctx.fillText("BEST!!", 90, 200);
    }*/
}

function drop()
{
    for (var i in arrtempMissile_1){arrtempMissile_1[i].y += speed;}
    for (var i in arrtempMissile_1)
    {
        if (arrtempMissile_1[i].y > canvasH)
        {
            Score[0] = "Miss";
            Combo = 0;
            Score_Num[0] = true;
            arrtempMissile_1.shift();
        }
    }drawScreen();
    
    for(var i in arrtempMissile_2){arrtempMissile_2[i].y += speed;}
    for(var i in arrtempMissile_2)
    {
        if (arrtempMissile_2[i].y > canvasH)
        {
            Score[1] = "Miss";
            Combo = 0;
            Score_Num[1] = true;
            arrtempMissile_2.shift();
        }
    }drawScreen();
    
    for(var i in arrtempMissile_3){arrtempMissile_3[i].y += speed;}
    for(var i in arrtempMissile_3)
    {
        if (arrtempMissile_3[i].y > canvasH)
        {
            Score[2] = "Miss";
            Combo = 0;
            Score_Num[2] = true;
            arrtempMissile_3.shift();
        }
    }drawScreen();
}

function InGameUpdate (time)
{
    if (songTrack1[Num_1]-0.05 <= soundMusic.currentTime.toFixed(2) && soundMusic.currentTime.toFixed(2) <= songTrack1[Num_1] +0.05)
    {        
        arrtempMissile_1.push({x:0, y:intY});
        Num_1++;
    }
    
    if (songTrack2[Num_2]-0.05 <= soundMusic.currentTime.toFixed(2) && soundMusic.currentTime.toFixed(2) <= songTrack2[Num_2] +0.05)
    {
        arrtempMissile_2.push({x:100, y:intY});
        Num_2++;
    }
    
    if (songTrack3[Num_3]-0.05 <= soundMusic.currentTime.toFixed(2) && soundMusic.currentTime.toFixed(2) <= songTrack3[Num_3] +0.05)
    {
        arrtempMissile_3.push({x:200, y:intY});
        Num_3++;
    }
    
    if (Math.floor(soundMusic.currentTime) == 15 && SongCode ==1)
    {
        backGroundColor = "black";
        lineColor = "white";
    }
    if (Math.floor(soundMusic.currentTime) == 30 && SongCode == 1)
    {
        backGroundColor = "white";
        lineColor = "black";
    }
    if (Math.floor(soundMusic.currentTime) == 46 && SongCode == 2)
    {
        onGameOver();
    }
    if (Math.floor(soundMusic.currentTime) == 60 && SongCode == 1)
    {
        onGameOver();
    }

    drop();
    if (Game == Game_GAME){requestAnimationFrame(InGameUpdate);}
    else {overScreen();}
}


function onkeydown(e) // 키코드 관리
{
    if (e.keyCode == 13 && Game == Game_READY)
    {
        Game = Game_SEL;
        selection();
    }
    if(Game == Game_SEL)
    {
        if(e.keyCode == 38){
            GoGo=true;
            GoGoUp = true;
            GoGoTo = false;
        }
        if(e.keyCode == 40){
            GoGo=true;
            GoGoDown = true;
            GoGoTo = false;
        }
        if(e.keyCode == 13 && circle.angle <= -0.64 && circle.radius == 280)
        {
            Level = 2;
            selected();
        }
        if(e.keyCode == 13 && circle.angle >= 0.64 && circle.radius == 280)
        {
            Level = 1;
            selected();
        }
        if(e.keyCode == 13 && circle.angle <= -0.64 && circle.radius == 427)
        {
            SongCode = 1;
            circle.radius = 280;
            ball.size = 64;
        }
        if(e.keyCode == 13 && circle.angle >= 0.64 && circle.radius == 427)
        {
            SongCode = 2;
            circle.radius = 280;
            ball.size = 64;
        }
    }
    if (Game == Game_GAME) //판정 
    {
        if (e.keyCode == 65){
            key1=true; 
            onGameScore_1();
        }
        if(e.keyCode == 83){
            key2=true;
            onGameScore_2();
        }
        if(e.keyCode == 68){
            key3=true;
            onGameScore_3();
        }
        if (e.keyCode == 32)
        {
            soundMusic.pause();
            drawScreen();
        }
        if (e.keyCode == 66)
        {
            Game = Game_OVER;
            onGameOver();
        }
        drawScreen();
    }
    if (Game == Game_OVER)
    {
        if (e.keyCode == 13)
        {
            Game = Game_READY;
            onGameReady();
        }
    }
}

function onkeyup(e) 
{
    if (e.keyCode == 65){
        key1=false;
        koline[0]=0;
    }
    if (e.keyCode == 83){
        key2=false;
        koline[1]=0;
    }
    if (e.keyCode == 68){
        key3=false;
        koline[2]=0;
    }
    if(e.keyCode == 38){GoGoDown=false}
    if(e.keyCode == 40){GoGoUp=false}
}

function onGameScore_1()
{
    for (var i=0; i< arrtempMissile_1.length; i++)
    {
        if (judge - 20 > arrtempMissile_1[i].y && arrtempMissile_1[i].y > judge -40)
        {
            arrtempMissile_1.shift();
            Score[0] = "SAVE";
            Combo++;
            Score_Num[0] = true;
            Point+=150;
        }
        else if (judge + 20 > arrtempMissile_1[i].y && arrtempMissile_1[i].y > judge - 20)
        {
            arrtempMissile_1.shift();
            Score_Num[0] = true;
            Score[0] = "NICE";
            Combo++;
            Point+=210;
        }
        else if (judge + 40  > arrtempMissile_1[i].y && arrtempMissile_1[i].y > judge + 20)
        {
            arrtempMissile_1.shift();
            Score_Num[0] = true;
            Score[0] = "GOOD";
            Combo++;
            Point+=100;
        }
    }drawScreen();
}

function onGameScore_2()
{
    for (var i=0; i< arrtempMissile_2.length; i++)
    {
        if (judge - 20 > arrtempMissile_2[i].y && arrtempMissile_2[i].y > judge - 30)
        {
            arrtempMissile_2.shift();
            Score[1] = "SAVE";
            Combo++;
            Score_Num[1] = true;
            Point+=150;
        }
        else if (judge + 20 > arrtempMissile_2[i].y && arrtempMissile_2[i].y > judge - 20)
        {
            arrtempMissile_2.shift();
            Score_Num[1] = true;
            Score[1] = "NICE";
            Combo++;
            Point+=210;
        }
        else if (judge + 30  > arrtempMissile_2[i].y && arrtempMissile_2[i].y > judge + 20)
        {
            arrtempMissile_2.shift();
            Score_Num[1] = true;
            Combo++;
            Score[1] = "GOOD";
            Point+=100;
        }
    }drawScreen();
}

function onGameScore_3()
{
    for (var i=0; i< arrtempMissile_3.length; i++)
    {
        if (judge - 20 > arrtempMissile_3[i].y && arrtempMissile_3[i].y > judge -40)
        {
            arrtempMissile_3.shift();
            Score[2] = "SAVE";
            Combo++;
            Score_Num[2] = true;
            Point+=150;
        }
        else if (judge + 20 > arrtempMissile_3[i].y && arrtempMissile_3[i].y > judge - 20)
        {
            arrtempMissile_3.shift();
            Score_Num[2] = true;
            Score[2] = "NICE";
            Combo++;
            Point+=210;
        }
        else if (judge + 40  > arrtempMissile_3[i].y && arrtempMissile_3[i].y > judge + 20)
        {
            arrtempMissile_3.shift();
            Score_Num[2] = true;
            Score[2] = "GOOD";
            Combo++;
            Point+=100;
        }
    }drawScreen();
}

function onGameStrat()
{
    Game = Game_GAME;
    InGameUpdate();
}
function onGameOver()
{
    soundMusic.pause();
    Game = Game_OVER;
}
function overScreen()
{
    var classType = "None"
    ctx.clearRect(0, 0, canvasW, canvasH);
    
    if (Point < 3000)
    {
        classType = "F";
    }
    else if(Point <= 4500 && Point > 3000)
    {
        classType = "E";
    }
    else if(Point <= 6000&& Point > 4500)
    {
        classType = "D";
    }
    else if(Point <= 8000 && Point > 6000)
    {
        classType = "C";
    }
    else if(Point <= 9000 && Point > 8000)
    {
        classType = "B";
    }
    else if(Point <= 9900 && Point > 9000)
    {
        classType = "A";
    }
    else if(Point >= (Num_1 + Num_2 + Num_3)*200)
    {
        classType = "S";
        ctx.font = "30px Arial"
        ctx.fillStyle = "Gold";
        ctx.fillText("THE MAX POINT", canvasW -280, canvasH -50);
        ctx.fillText("THE MAX COMBO", canvasW -280, canvasH -100);
        var brush = ctx.createLinearGradient(0, 0, canvasW, canvasH);
        brush.addColorStop(0, "Red");
        brush.addColorStop(0.2, "Orange");
        brush.addColorStop(0.4, "Yellow");
        brush.addColorStop(0.6, "Green");
        brush.addColorStop(0.8, "Blue");
        brush.addColorStop(1, "Purple");
        ctx.fillStyle = brush;
        if(Level == 2){ctx.fillText("HARD MODE!", canvasW -280, canvasH - 150);}
    }
    ctx.font = "500px Arial";
    ctx.fillText(classType, canvasW / 2 - 150, canvasH / 2 + 30);
    ctx.font = "30px Arial";
    if (classType != "S"){ctx.fillText(Point, canvasW -200, canvasH -50)}
}
function readyScreen()
{
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.height = window.innerHeight - 1;
    canvas.width = window.innerWidth;
    canvasH = canvas.height;
    canvasW = canvas.width;
    let image = new Image();
    image.src = 'img/background.jpg'
    ctx.drawImage(image, 0, 0, canvasH, canvasH)
    judge = (canvasH / 7) * 6; //판정선 위치 공식 (수정예정)
    
    ctx.lineWidth = 0.3;
    circle.centerY = canvasH / 2;
    // intY =  0;
    
    ctx.globalAlpha= 0.5;
}
function selection(time)
{
    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.lineWidth = 2;
    ctx.font = "30px Arial"
    for(var i=1; i<10; i++)
    {
        ctx.strokeCircle(0, canvasH/2, i*i*i);
    }

    ball.x = circle.centerX + Math.cos(circle.angle) * circle.radius;
    ball.y = circle.centerY + Math.sin(circle.angle) * circle.radius;
    if(GoGoTo == true)
    {
        ctx.fillText('<- or ->', 375, canvasH / 2-20);
        ctx.fillText("Up or Down", 348, canvasH / 2 + 20);
    }
    if(GoGoDown == true && circle.angle <= 0.64)
    {
       circle.angle+=ball.spee;
    }
    if(GoGoUp == true && circle.angle >= -0.64)
    {
        circle.angle-=ball.spee;
    }
    if(circle.angle > 0.64 && GoGoUp == false  && circle.radius == 280)
    {
        ctx.fillText("  Easy", ball.x-50, ball.y+10);
    }
    if(circle.angle < -0.64 && GoGoDown == false && circle.radius == 280)
    {
        ctx.fillText("  Hard", ball.x-50, ball.y+10);
    }
    if(circle.angle > 0.64 && GoGoUp == false  && circle.radius == 427)
    {
        ctx.fillText(" bonus ", ball.x-50, ball.y+10);
    }
    if(circle.angle < -0.64 && GoGoDown == false && circle.radius == 427)
    {
        ctx.fillText("  Main", ball.x-50, ball.y+10);
    }
    ctx.strokeCircle(ball.x, ball.y, ball.size);
    if(Game == Game_SEL){requestAnimationFrame(selection);}
}

function onGameReady()
{
    Combo = 0;
    koline = [0, 0, 0];
    Point = 0;
    Num_1 = 0, Num_2 = 0, Num_3 = 0;
    Score_Num = [0,0,0];
    intY = 0;
    arrtempMissile_1 = new Array(); 
    arrtempMissile_2 = new Array();
    arrtempMissile_3 = new Array();
    readyScreen();

}
function selected()
{
    speed = canvasH / 141.414141 * Level;
    soundMusic.defaultPlaybackRate = Level;
    if(SongCode == 1)
    {   
        soundMusic.src = "Sound/Sound.mp3" 
        songTrack1 = [1.97, 3.82, 5.77, 7.66, 9.49, 13.18, 15.09, 17, 20.69 , 22.55, 24.42, 28.19, 28.49, 31.98, 32.25, 35.69, 35.89, 39.64, 44.10, 50.92, 54.69]; 
        songTrack2 = [6.50, 8.38, 10.18, 11.36, 13.18, 15.09, 17, 18.85, 26.29, 35.69, 39.37, 44.10, 46.91, 47.20, 50.65, 54.41, 54.69];          
        songTrack3 = [13.18, 15.09, 18.85, 20.69, 24.42, 31.98, 32.25, 35.69, 35.89, 39.64, 44.10, 54.41];          
        soundMusic.play();
        onGameStrat();
    }
    else if(SongCode == 2)
    {
        soundMusic.src = "Sound/Sound2.mp3"
        songTrack1 = [0.40, 3.89, 5.10, 6.86, 8.59, 11.41, 14.41, 16.82, 20.24, 22.54, 24.88, 26.08, 28.26, 29.48, 33.05, 34.05, 35.37];
        songTrack2 = [1.55, 6.29, 6.86, 9.77, 10.84, 12.06, 14.88, 15.54, 17.93, 19.05, 21.38, 23.23, 26.08, 29.48, 33.30, 33.80, 35.37];
        songTrack3 = [2.72, 3.89, 6.86, 10.84, 12.06, 13.27, 16.82, 20.24, 23.69, 24.88, 26.08, 27.20, 30.64, 33.55, 35.37, 36.57];
        soundMusic.play();
        onGameStrat();
    }
}