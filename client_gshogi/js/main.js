// 設定
var FIELD_X = 6;
var FIELD_Y = 8;
var FIELD_SIZE = 50;
var FIELD_PADDING_X = 0;
var FIELD_PADDING_Y = 0;

var FIELD_NONE_BY_SHIRE = 4; // 司令塔により削除されているマス

var MAN_SIZE_W = 40;
var MAN_SIZE_H = 45;

// 駒の画像を保持する
var manImage = [];
var skinName = "skin1";

// 駒の種類の配列
var manType = [
	"taisho", "chusho", "shosho",
	"taisa", "chusa", "shosa",
	"taii", "chui", "shoi",
	"hikoki", "tank", "jirai",
	"supai", "kihei", "gunki",
	"kohei",
];

function init(){
	console.log("--init start--");
    var canvas = document.getElementById('shogi');
	
	$.when(
		load()
	).done(function(){
		draw(canvas, testMen());
		canvas.addEventListener('click', onClick, false);
	});
	
	console.log("--init end--");
}

function load(){
	console.log("--load start--");
	var name = [];
	var tmp = [];
	for(man in manType){
		name = manType[man];
		tmp = new Image();
		tmp.id = getUniqueStr();
		tmp.src = "img/" + skinName + "/" + name +".png";
		console.log(name + " ( " + tmp.id + " ) loading.");
		manImage[name] = tmp;
	}
	
	console.log("--load end--");
}

function draw(canvas, men){
	console.log("--draw start--");
    
    if (canvas.getContext){
    	var ctx = canvas.getContext('2d');
    	ctx.scale(2,2);
	    // 盤面の表示
	    fieldDraw(ctx);
	    
	    // 駒の表示
	    manDraw(ctx, men);
    }
    
    console.log("--draw end--")
}

function manDraw(ctx, men){
	for(i in men){
		man = men[i];
		putMan(ctx, man);
	}
}

/* 駒を座標に配置する */
function putMan(ctx, man){
	var image = manImage[man.name];
	console.log(image + " put " + "(x:" + man.x + ", y:" + man.y + ")");
	
    manImage[man.name].addEventListener('load', function() {
		ctx.drawImage(manImage[man.name], _calcX2canvas(man.x, man.y), _calcY2canvas(man.x, man.y), MAN_SIZE_W, MAN_SIZE_H);
    }, false);
}


function onClick(e){
    var rect = e.target.getBoundingClientRect();
    var clickX = e.clientX - rect.left;
    var clickY = e.clientY - rect.top;
    console.log("x: " + _calcX2game(clickX) +", y: " + _calcY2game(clickY));

	$("#result").text("You clicked (x: " + _calcX2game(clickX, clickY) + ",y: " + _calcY2game(clickX, clickY) + ")");
}

/* 駒の座標からcanvasの座標を計算する */
function _calcX2canvas(x, y){
	if((y==1 || y == FIELD_Y) && x==(FIELD_NONE_BY_SHIRE-1)){
		return (x-0.5)*FIELD_SIZE + FIELD_PADDING_X + 5;
	} else {
		return (x-1)*FIELD_SIZE + FIELD_PADDING_X + 5;
	}
}
function _calcY2canvas(x, y){
	return (y-1)*FIELD_SIZE + FIELD_PADDING_Y + 2;
}

/* クリック座標から駒の座標に計算する */
function _calcX2game(x, y){
	var tmpX = Math.ceil(((x-FIELD_PADDING_X) / FIELD_SIZE));
	var tmpY = Math.ceil(((y-FIELD_PADDING_Y) / FIELD_SIZE));
	if((tmpY != 1) && (tmpY != FIELD_Y)) return tmpX;
	
	if(tmpX == FIELD_NONE_BY_SHIRE){
		return FIELD_NONE_BY_SHIRE-1;
	} else {
		return Math.ceil(((x-FIELD_PADDING_X) / FIELD_SIZE));
	}
}
function _calcY2game(x, y){
	return Math.ceil(((y-FIELD_PADDING_Y) / FIELD_SIZE));
}

/* マス目を描画する */
function fieldDraw(ctx){
    for(i=0; i<= FIELD_X; i++){
        ctx.beginPath();
    	if(i != (FIELD_NONE_BY_SHIRE-1)){
	        ctx.moveTo(FIELD_PADDING_X+FIELD_SIZE*i,FIELD_PADDING_Y);
	        ctx.lineTo(FIELD_PADDING_X+FIELD_SIZE*i,FIELD_SIZE*FIELD_Y+FIELD_PADDING_Y);
    	} else {
    		// 司令塔部分
	        ctx.moveTo(FIELD_PADDING_X+FIELD_SIZE*i,FIELD_PADDING_Y+FIELD_SIZE);
	        ctx.lineTo(FIELD_PADDING_X+FIELD_SIZE*i,FIELD_SIZE*(FIELD_Y - 1)+FIELD_PADDING_Y);
    	}
        ctx.closePath();
        ctx.stroke();
    }
	for(j=0; j<= FIELD_Y; j++){
        ctx.beginPath();
        ctx.moveTo(FIELD_PADDING_X,FIELD_PADDING_Y+FIELD_SIZE*j);
        ctx.lineTo(FIELD_PADDING_X+FIELD_SIZE*FIELD_X,FIELD_PADDING_Y+FIELD_SIZE*j);
        ctx.closePath();
        ctx.stroke();
	}
	
	/* 壁の描画 */
	ctx.beginPath();
	ctx.moveTo(FIELD_PADDING_X, FIELD_PADDING_Y+FIELD_SIZE*4-2);
    ctx.lineTo(FIELD_PADDING_X+FIELD_SIZE*1, FIELD_PADDING_Y+FIELD_SIZE*4-2);
    ctx.closePath();
    ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(FIELD_PADDING_X, FIELD_PADDING_Y+FIELD_SIZE*4+2);
    ctx.lineTo(FIELD_PADDING_X+FIELD_SIZE*1, FIELD_PADDING_Y+FIELD_SIZE*4+2);
    ctx.closePath();
    ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(FIELD_PADDING_X+FIELD_SIZE*2, FIELD_PADDING_Y+FIELD_SIZE*4-2);
    ctx.lineTo(FIELD_PADDING_X+FIELD_SIZE*4, FIELD_PADDING_Y+FIELD_SIZE*4-2);
    ctx.closePath();
    ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(FIELD_PADDING_X+FIELD_SIZE*2, FIELD_PADDING_Y+FIELD_SIZE*4+2);
    ctx.lineTo(FIELD_PADDING_X+FIELD_SIZE*4, FIELD_PADDING_Y+FIELD_SIZE*4+2);
    ctx.closePath();
    ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(FIELD_PADDING_X+FIELD_SIZE*5, FIELD_PADDING_Y+FIELD_SIZE*4-2);
    ctx.lineTo(FIELD_PADDING_X+FIELD_SIZE*6, FIELD_PADDING_Y+FIELD_SIZE*4-2);
    ctx.closePath();
    ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(FIELD_PADDING_X+FIELD_SIZE*5, FIELD_PADDING_Y+FIELD_SIZE*4+2);
    ctx.lineTo(FIELD_PADDING_X+FIELD_SIZE*6, FIELD_PADDING_Y+FIELD_SIZE*4+2);
    ctx.closePath();
    ctx.stroke();
	
}

function testMen(){
	var men = [];
	// var manType = [
	// 	"taisho", "chusho", "shosho",
	// 	"taisa", "chusa", "shosa",
	// 	"taii", "chui", "shoi",
	// 	"hikoki", "tank", "jirai",
	// 	"supai", "kihei", "gunki",
	// 	"kohei",
	// ];
	
	var hand = [];
	hand.push(manType[0]);
	hand.push(manType[1]);
	hand.push(manType[2]);
	hand.push(manType[3]);
	hand.push(manType[4]);
	hand.push(manType[5]);
	hand.push(manType[6]);
	hand.push(manType[6]);
	hand.push(manType[7]);
	hand.push(manType[7]);
	hand.push(manType[8]);
	hand.push(manType[8]);
	hand.push(manType[9]);
	hand.push(manType[9]);
	hand.push(manType[10]);
	hand.push(manType[10]);
	hand.push(manType[11]);
	hand.push(manType[11]);
	hand.push(manType[12]);
	hand.push(manType[13]);
	hand.push(manType[14]);
	hand.push(manType[15]);
	hand.push(manType[15]);
	
	shuffle(hand);
	
	var i=1, j=5;
	for(man in hand){
		// TODO 特殊な動きをするときは違うクラスにするように変更
		men.push(new normalMan(hand[man], i++, j));
		
		if(i%FIELD_X == 1){
			i=1; j++;
		}
		if(j==FIELD_Y && i==FIELD_NONE_BY_SHIRE){
			i++;
		}
	}
	
	return men;
}

// 基礎関数

// イメージごとにユニークなidを生成
function getUniqueStr(myStrong){
	var strong = 1000;
	if (myStrong) strong = myStrong;
	return new Date().getTime().toString(16)  + Math.floor(strong*Math.random()).toString(16)
}

// 配列をシャッフルする
function shuffle(array) {
  var n = array.length, t, i;

  while (n) {
    i = Math.floor(Math.random() * n--);
    t = array[n];
    array[n] = array[i];
    array[i] = t;
  }

  return array;
}

// 駒の情報を格納
var Man = function(name, type, num){
	this.name = name;
	this.type = type;
	this.num = num;
}

// 駒クラス
var normalMan = function(name, x, y){
	this.x = x;
	this.y = y;
	this.name = name;
	
	function canMove(_x, _y){
		
		// 壁を超える際は絶対値が1でもfalse
		if(!(x==2 || x==5)) {
			if(y==4 && _y==5) return false;
			if(y==5 && _y==4) return false;
		}
		
		// 司令塔の部分は1じゃなくても動ける可能性あり
		// if((x=)){
			
		// }
		
		if(Math.abs(x - _x) + Math.abs(y - _y) == 1) return true;
		else return false;
	}
	
	function canPut(_x, _y){
		return true;
	}
};
var airMan = function(name, x, y){
	this.x = x;
	this.y = y;
	this.name = name;
	
	function canPut(_x, _y){
		return true;
	}
}
var tankMan = function(name, x, y){
	this.x = x;
	this.y = y;
	this.name = name;
	
	function canPut(_x, _y){
		return true;
	}
}
var koheiMan = function(name, x, y){
	this.x = x;
	this.y = y;
	this.name = name;
	
	function canPut(_x, _y){
		return true;
	}
}
var immobileMan = function(name, x, y){
	this.x = x;
	this.y = y;
	this.name = name;
	
	function canPut(_x, _y){
	}
}

// 手クラス
var Hand = function(man, coor){
	
};

// 盤クラス
var field = function(){
	
};

