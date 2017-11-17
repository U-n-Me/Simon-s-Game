/*
  Use functions to get your work done. setInterval and setTimeout are 
  used to get all sync effects.
*/

var moves, sTimeOut, chqTime;

var APPDATA = {
  'myList': [],
  'playerList': [],
  'audios': [],
  'score': 0,
  'strict': false,
  'on': false,
  'start': false,
  'loseAudio': null,
  'level': [1000, 1500, 2200, 3000, 4200, 6000, 7500],
  'divs': 3,
  'startGame': function(){
    this.stopGame();
    increaseCounter();
  },
  'stopGame': function(){
    this['myList'] = [];
    this['userList'] = [];
    this['score'] = 0;
    clearInterval(moves);
    clearTimeout(sTimeOut);
    clearTimeout(chqTime);
    $('.btn').css('pointer-events', 'none');
  }
};


/*
  On start press, startGame is called. Which clears out everything 
  and calls increaseCounter function, which in effect just increases
  the score value. A random move is generated and showMoves function
  is called.
*/

function increaseCounter(){
  if(APPDATA['score'] == 20){
    showMsg('Huraah, somebody won!', 2000);
    APPDATA.startGame();
  }
  else{
    APPDATA['score']++;
    var score = APPDATA['score'];
    if(score < 10)
      score = '0'+score;
    $('#screen').html(score);
    var move = Math.floor(Math.random() * 4);
    APPDATA['myList'].push(move);
    showMoves();
  }
}


/*
  showMoves uses setInterval to show seq of presses. After all 
  presses are shown it allows player to give it's moves.
*/

function showMoves(){
  if(!APPDATA['on'])
    return;
  var i = 0;
  moves = setInterval(function(){
    onBtnClick(APPDATA['myList'][i],false, 800);
    i++;
    if(i == APPDATA.myList.length){
      clearInterval(moves);
      sTimeOut = setTimeout(function(){playerInput();}, 600);
    }
  }, 1000);  
}

/*
  playerInput func allows players to click for a certain time interval
  i.e variable 'time'. This 'time' is a function of user score. As score
  increases time increases to get all inputs from player.
  After this time checkResult func is called.
*/

function playerInput(){
  if(!APPDATA['on'])
    return;
  APPDATA['playerList'] = [];
  $('.btn').css('pointer-events', 'auto');
  // level dependent time
  var time = APPDATA['level'][Math.floor(APPDATA['score'] / APPDATA['divs'])] * 4; 
  chqTime = setTimeout(function(){checkResult()}, time);
}

/*
  checkResult disallows user from clicking the buttons and matches the user's
  (player's) input to show sequence. If there is a mismatch appropriate action
  is taken.
  If seq matches, then we call increaseCounter to repeat the whole thing.
*/

function checkResult(){ 
  if(!APPDATA['on'])
    return;
  $('.btn').css('pointer-events', 'none');
  var matched = true;
  if(APPDATA['playerList'].length !== APPDATA['myList'].length)
    matched = false;
  else{
    for(var i = 0; i < APPDATA['myList'].length; i++)
      if(APPDATA['playerList'][i] != APPDATA['myList'][i]){
        matched = false;
        break;
      }
  }
  if(!matched){
    if(APPDATA['strict']){
      showMsg('Lost!!', 1000);
      chqTime = setTimeout(function(){APPDATA.startGame();}, 1000);
    }
    else{
      showMsg('Wrong!!', 500);
      chqTime = setTimeout(function(){showMoves();}, 500);
    }      
  }
  else
   increaseCounter();
}

function showMsg(msg, time){
  $('.msg').css({display: 'block'});
  $('.msg').html(msg);
  APPDATA.loseAudio.play();
  chqTime = setTimeout(function(){$('.msg').css('display', 'none');}, time);
}

/*
  Function takes 3 params, first is id of button being pressed.
  second is a flag to denote whether this function is being 
  called by pressing the button or by internal functions. Third is 
  time taken to show the effect with default value of 500ms.
*/
function onBtnClick(id, player, time = 500){
  $('#'+id).css('opacity', 1);
  if(player){
    APPDATA['playerList'].push(id);
  }
  APPDATA['audios'][id].play();
  chqTime = setTimeout(function(){ $('#'+id).css('opacity', 0.8);},time);
}

$(document).ready(function(){
  APPDATA['audios'].push(new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'));
  APPDATA['audios'].push(new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'));
  APPDATA['audios'].push(new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'));
  APPDATA['audios'].push(new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'));
  APPDATA['loseAudio'] = APPDATA['audios'][3];
  
  // User isn't allowed to press these btns.
  $('.btn').css('pointer-events', 'none');
});


$('.on').click(function(){
  if(APPDATA['on']){
    $('#screen').html('');
    $('#start').html('start');
    $('.strict-led').css('background','#3d090c');
    $('.on').html('on');
    APPDATA['strict'] = false;
    APPDATA['start'] = false;
  }else{
    $('#screen').html('--');
    $('.on').html('off');
  }
  APPDATA['on'] = !APPDATA['on'];
  APPDATA.stopGame();
});



$('#start').click(function(){
  if(APPDATA['on']){
      APPDATA.startGame();
  }
});



$('.strict').click(function(){
  if(APPDATA['on']){
    if(!APPDATA.strict){
      $('.strict-led').css('background','#f44141');
    }
    else{
      $('.strict-led').css('background','#3d090c');
    }
    APPDATA.strict = !APPDATA.strict;
}
});
