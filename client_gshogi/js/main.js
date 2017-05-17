window.onload	= function(){
	cvs = document.getElementById("shogi");
	ctx = cvs.getContext( "2d" );
	setQuality( 3 );
	
	init();
}

// 設定
var cvs;
var ctx;

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
var skinName = "skin2";

// 駒の種類の配列
var manType = [];

// 自駒の配列
var myMen = [];

// 将棋盤の状況
var field = [];

// 現在の状態を保存しておく
var stage = 0;
var target = null;

function init(){
	console.log("--init start--");
    
    /* 初期手札の準備 */
    manType.push(new Man('taisho', 'normal', 1));
    manType.push(new Man('chusho', 'normal', 1));
    manType.push(new Man('shosho', 'normal', 1));
    manType.push(new Man('taisa', 'normal', 1));
    manType.push(new Man('chusa', 'normal', 1));
    manType.push(new Man('shosa', 'normal', 1));
    manType.push(new Man('taii', 'normal', 2));
    manType.push(new Man('chui', 'normal', 2));
    manType.push(new Man('shoi', 'normal', 2));
    manType.push(new Man('hikoki', 'air', 2));
    manType.push(new Man('tank', 'tank', 2));
    manType.push(new Man('jirai', 'immobile', 2));
    manType.push(new Man('supai', 'normal', 1));
    manType.push(new Man('kihei', 'normal', 1));
    manType.push(new Man('gunki', 'immobile', 1));
    manType.push(new Man('kohei', 'kohei', 2));
	
	$.when(
		load()
	).done(function(){
		testMen();
		draw();
		cvs.addEventListener('click', onClick, false);
	});
	
	console.log("--init end--");
}

function load(){
	console.log("--load start--");
	var name = [];
	var tmp = [];
	for(man in manType){
		name = manType[man].name;
		tmp = new Image();
		tmp.id = getUniqueStr();
		tmp.src = "img/" + skinName + "/" + name +".png";
		console.log(name + " ( " + tmp.id + " ) loading.");
		manImage[name] = tmp;
	}
	
	console.log("--load end--");
}

function draw(man = null){
	console.log("--draw start--");
    
    fieldDraw();
    
    if(man != null){
    	canMoveFieldDraw(man);
    }
    
    // 駒の表示
    menToField();
    manDraw();
    
    console.log("--draw end--")
}

// 手駒を盤面に配置する
function menToField(){
    // 盤面の配列初期化
	field = [];
    for(i=0;i<FIELD_Y;i++){
    	field[i] = [];
    }
    
	for(man in myMen){
		field[myMen[man]._x][myMen[man]._y] = myMen[man];
	}
}

// 動ける駒の場所を表示
function canMoveFieldDraw(man){
	console.log(man.name + '('+ man.x + ', ' + man.y + ') can move ...');
	for(x=1;x<=FIELD_X;x++){
		for(y=1;y<=FIELD_Y;y++){
			// 司令塔の部分は判定しない．
			if((x==FIELD_NONE_BY_SHIRE && y==1) || (x==FIELD_NONE_BY_SHIRE && y==FIELD_Y)) continue;
			
			// 動ける場合は薄い色を出す．
			// if(!field[x][y] && man.canMove(x, y)){
			if(man.canMove(x, y)){ // デバッグ用に全マス判定
				console.log('('+x+', ' +y+')');
				ctx.beginPath();
				ctx.fillStyle = '#efb888';
				ctx.fillRect(_calcX2canvas(x, y), _calcY2canvas(x, y), MAN_SIZE_W, MAN_SIZE_H);
				ctx.fill();
			}
		}
	}
}

function manDraw(){
	for(x in field){
		for(y in field[x]){
			man = field[x][y];
			putMan(man);
		}
	}
}

/* 駒を座標に配置する */
function putMan(man){
	var image = manImage[man.name];
	ctx.drawImage(manImage[man.name], _calcX2canvas(man.x, man.y), _calcY2canvas(man.x, man.y), MAN_SIZE_W, MAN_SIZE_H);
    manImage[man.name].addEventListener('load', function() {
		console.log(man.name + " put " + "(x:" + man.x + ", y:" + man.y + ")");
		ctx.drawImage(manImage[man.name], _calcX2canvas(man.x, man.y), _calcY2canvas(man.x, man.y), MAN_SIZE_W, MAN_SIZE_H);
    }, false);
}

function onClick(e){
    var rect = e.target.getBoundingClientRect();
    var clickX = e.clientX - rect.left;
    var clickY = e.clientY - rect.top;
    
    var clickX2game = _calcX2game(clickX, clickY);
    var clickY2game = _calcY2game(clickX, clickY);
    
	$("#result").text("You clicked (x: " + _calcX2game(clickX, clickY) + ",y: " + _calcY2game(clickX, clickY) + ")");

	// 何もしていない場合は
	if(stage==0){
		if(field[clickX2game][clickY2game]){
			draw(field[clickX2game][clickY2game]);
			
			stage = 1;
			target = field[clickX2game][clickY2game];
			$('#inst').text("You can move this piece");
		} else {
			$('#inst').text("Please click your piece");
		}
	} else if(stage==1){
		if(target.canMove(clickX2game, clickY2game)){
			target.move(clickX2game, clickY2game);
		} else {
			$('#inst').text("Cannot move clicked cell");
		}
		stage = 0;
		target = null;
		draw();
	}
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
function fieldDraw(){
	
	// 盤の色
	ctx.beginPath();
	ctx.fillStyle = '#ad692e';
	ctx.fillRect(0, 0, FIELD_SIZE*FIELD_X, FIELD_SIZE*FIELD_Y);
	ctx.fill();
	
	ctx.strokeStyle = '#493a04';
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
	ctx.moveTo(FIELD_PADDING_X, FIELD_PADDING_Y+FIELD_SIZE*4-1);
    ctx.lineTo(FIELD_PADDING_X+FIELD_SIZE*1, FIELD_PADDING_Y+FIELD_SIZE*4-1);
    ctx.closePath();
    ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(FIELD_PADDING_X, FIELD_PADDING_Y+FIELD_SIZE*4+1);
    ctx.lineTo(FIELD_PADDING_X+FIELD_SIZE*1, FIELD_PADDING_Y+FIELD_SIZE*4+1);
    ctx.closePath();
    ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(FIELD_PADDING_X+FIELD_SIZE*2, FIELD_PADDING_Y+FIELD_SIZE*4-1);
    ctx.lineTo(FIELD_PADDING_X+FIELD_SIZE*4, FIELD_PADDING_Y+FIELD_SIZE*4-1);
    ctx.closePath();
    ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(FIELD_PADDING_X+FIELD_SIZE*2, FIELD_PADDING_Y+FIELD_SIZE*4+1);
    ctx.lineTo(FIELD_PADDING_X+FIELD_SIZE*4, FIELD_PADDING_Y+FIELD_SIZE*4+1);
    ctx.closePath();
    ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(FIELD_PADDING_X+FIELD_SIZE*5, FIELD_PADDING_Y+FIELD_SIZE*4-1);
    ctx.lineTo(FIELD_PADDING_X+FIELD_SIZE*6, FIELD_PADDING_Y+FIELD_SIZE*4-1);
    ctx.closePath();
    ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(FIELD_PADDING_X+FIELD_SIZE*5, FIELD_PADDING_Y+FIELD_SIZE*4+1);
    ctx.lineTo(FIELD_PADDING_X+FIELD_SIZE*6, FIELD_PADDING_Y+FIELD_SIZE*4+1);
    ctx.closePath();
    ctx.stroke();
	
}

function testMen(){
	var men = [];
	var hand = [];
	
	for(m in manType){
		var target = manType[m];
		
		for(i=0; i<target.num; i++)
			hand.push(target);
	}
	
	shuffle(hand);
	
	var i=1, j=5;
	for(man in hand){
		switch(hand[man].type){
			case 'normal':
				myMen.push(new normalMan(hand[man].name, i++, j));
				break;
			case  'air':
				myMen.push(new airMan(hand[man].name, i++, j));
				break;
			case 'tank':
				myMen.push(new tankMan(hand[man].name, i++, j));
				break;
			case 'immobile':
				myMen.push(new immobileMan(hand[man].name, i++, j));
				break;
			case 'kohei':
				myMen.push(new koheiMan(hand[man].name, i++, j));
				break;
			default:
				console.log('ERROR');
				break;
		}
		
		if(i%FIELD_X == 1){
			i=1; j++;
		}
		if((j==1 || j==FIELD_Y) && i==FIELD_NONE_BY_SHIRE){
			i++;
		}
	}
}

// 基礎関数

// イメージごとにユニークなidを生成
function getUniqueStr(myStrong){
	var strong = 1000;
	if (myStrong) strong = myStrong;
	return new Date().getTime().toString(16) + Math.floor(strong*Math.random()).toString(16);
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

function setQuality(value){
	cvs.setAttribute("width", 300 * value);
	cvs.setAttribute("height",400 * value);
	ctx.scale( value, value );
}

// 駒の情報を格納
var Man = function(name, type, num){
	this.name = name;
	this.type = type;
	this.num = num;
}

// 駒クラス
class normalMan{
	constructor(name, x, y){
		this._x = x;
		this._y = y;
		this._name = name;
	}
	get x(){ return this._x; }
	get y(){ return this._y; }
	get name(){ return this._name; }
	
	move(_x, _y){
		this._x = _x;
		this._y = _y;
	}
	
	canMove(_x, _y){
		
		// 壁を超える際は絶対値が1でもfalse
		if(!(this._x==2 || this._x==5)) {
			if(this._y==4 && _y==5) return false;
			if(this._y==5 && _y==4) return false;
		}
		
		// 司令塔の部分は1じゃなくても動ける可能性あり
		// if((x=)){
			
		// }
		
		if(Math.abs(this._x - _x) + Math.abs(this._y - _y) == 1) return true;
		else return false;
	}
	
	canPut(_x, _y){
		return true;
	}
};
class airMan{
	
	constructor(name, x, y){
		this._x = x;
		this._y = y;
		this._name = name;
	}
	get x(){ return this._x; }
	get y(){ return this._y; }
	get name(){ return this._name; }
	
	move(_x, _y){
		this._x = _x;
		this._y = _y;
	}
	
	canMove(_x, _y){
		if(this._x==_x) return true;
		
		// 司令塔にいる場合
		if(this._x==3 && this._y==8){
			if(this._x==4 && this._y!=1) return true;
		}
		
		//司令塔に入るとき
		if(this._x==3 || this._x==4){
			if((_y==1 || _y==8) && (_x==3)){
				return true;
			}
		}
		
		// 横方向
		if(Math.abs(this._x - _x) + Math.abs(this._y - _y) == 1) return true;
		
		return false;
	}
	
	canPut(_x, _y){
		return true;
	}
}
class tankMan{
	constructor(name, x, y){
		this._x = x;
		this._y = y;
		this._name = name;
	}
	get x(){ return this._x; }
	get y(){ return this._y; }
	get name(){ return this._name; }
	
	move(_x, _y){
		this._x = _x;
		this._y = _y;
	}
	
	canMove(_x, _y){
		// 壁を超える際は絶対値が1でもfalse
		if(!(this._x==2 || this._x==5)) {
			if(this._y==4 && _y==5) return false;
			if(this._y==5 && _y==4) return false;
		}
		
		// 周囲1マス
		if(Math.abs(this._x - _x) + Math.abs(this._y - _y) == 1) return true;
		
		// 前方2マス
		if((_x == this._x) && (this._y - _y == 2)) return true;
		
		return false;
	}
	
	canPut(_x, _y){
		return true;
	}
}
class koheiMan{
	constructor(name, x, y){
		this._x = x;
		this._y = y;
		this._name = name;
	}
	get x(){ return this._x; }
	get y(){ return this._y; }
	get name(){ return this._name; }
	
	move(_x, _y){
		this._x = _x;
		this._y = _y;
	}
	
	canMove(_x, _y){
		// 壁を超える際は絶対値が1でもfalse
		if(!(this._x==2 || this._x==5)) {
			if(this._y<=4 && _y>=5) return false;
			if(this._y>=5 && _y<=4) return false;
		}
		
		if(this._x==_x || this._y==_y) return true;
		
		return false;
	}
	
	canPut(_x, _y){
		return true;
	}
}
class immobileMan{
	constructor(name, x, y){
		this._x = x;
		this._y = y;
		this._name = name;
	}
	get x(){ return this._x; }
	get y(){ return this._y; }
	get name(){ return this._name; }
	
	move(_x, _y){
		this._x = _x;
		this._y = _y;
	}
	
	canMove(_x, _y){
		return false;
	}
	
	canPut(_x, _y){
		if(this._y==5){
			if(this._x==2 || this._x==5) return false;
		}
		return true;
	}
}

// 手クラス
var Hand = function(man, coor){
	
};

// 盤クラス
var field = function(){
	
};
