window.onload	= function(){
	cvs = document.getElementById("shogi");
	ctx = cvs.getContext( "2d" );
	setQuality( 2 );
	
	init();
}

function init(){
	console.log("--init start--");
    
    /* 初期手札の準備 */
    var id = 0;
    manType.push(new Man(id++, 'taisho', 'normal', 1));
    manType.push(new Man(id++, 'chusho', 'normal', 1));
    manType.push(new Man(id++, 'shosho', 'normal', 1));
    manType.push(new Man(id++, 'taisa', 'normal', 1));
    manType.push(new Man(id++, 'chusa', 'normal', 1));
    manType.push(new Man(id++, 'shosa', 'normal', 1));
    manType.push(new Man(id++, 'taii', 'normal', 2));
    manType.push(new Man(id++, 'chui', 'normal', 2));
    manType.push(new Man(id++, 'shoi', 'normal', 2));
    manType.push(new Man(id++, 'hikoki', 'air', 2));
    manType.push(new Man(id++, 'tank', 'tank', 2));
    manType.push(new Man(id++, 'jirai', 'immobile', 2));
    manType.push(new Man(id++, 'supai', 'normal', 1));
    manType.push(new Man(id++, 'kihei', 'normal', 1));
    manType.push(new Man(id++, 'gunki', 'immobile', 1));
    manType.push(new Man(id++, 'kohei', 'kohei', 2));
	
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
    
	for(man in enemyMen){
		field[enemyMen[man]._x][enemyMen[man]._y] = enemyMen[man];
	}
	
	for(man in myMen){
		field[myMen[man]._x][myMen[man]._y] = myMen[man];
	}
}

// 動ける駒の場所を表示
function canMoveFieldDraw(man){
	console.log(man.name + '('+ man.x + ', ' + man.y + ') can move ...');
	var canMoveCnt = 0;
	for(x=1;x<=FIELD_X;x++){
		for(y=1;y<=FIELD_Y;y++){
			// 司令塔の部分は判定しない．
			if((x==FIELD_NONE_BY_SHIRE && y==1) || (x==FIELD_NONE_BY_SHIRE && y==FIELD_Y)) continue;
			
			// 動ける場合は薄い色を出す．
			// if(!field[x][y] && man.canMove(x, y)){
			if(man.canMove(x, y)){ // デバッグ用に全マス判定
				console.log('('+x+', ' +y+')');
				ctx.beginPath();
				ctx.fillStyle = '#efefef';
				ctx.fillRect(_calcX2canvas(x, y), _calcY2canvas(x, y), MAN_SIZE_W, MAN_SIZE_H);
				ctx.fill();
				canMoveCnt++;
			}
		}
	}
	if(canMoveCnt == 0){
		stage = 0;
		target = null;
		$('#inst').text("Cannot move this piece");
	}
}

function manDraw(){
	for(x in field){
		for(y in field[x]){
			man = field[x][y];
			// console.log('x:' + x + ', y:' + y + ' ) user:' + field[x][y].user);
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
		if(field[clickX2game][clickY2game].user){
			stage = 1;
			target = field[clickX2game][clickY2game];
			$('#inst').text("You can move this piece");
			
			draw(target);
			
		} else {
			$('#inst').text("Please click your piece");
		}
	// 移動する駒を選択している状態でマスをクリック
	} else if(stage==1){
		
		// そのマスに動ける場合は
		if(target.canMove(clickX2game, clickY2game)){
			// TODO 動いた先に敵の駒がある場合は対戦処理
			
			// 動いた先に駒がある場合
			if(field[clickX2game][clickY2game] && !field[clickX2game][clickY2game].user){
				var mMan = target;
				var eMan = field[clickX2game][clickY2game];
				console.log('Battle: Attacker(' + mMan.name + ') VS Deffender(' + eMan.name + ')');
				
				// 相手の駒が軍旗の場合は，後ろの駒で判定するように変更
				if(eMan.name == 'gunki' && 
					clickY2game != 1 && field[clickX2game][clickY2game-1] && !field[clickX2game][clickY2game-1].user){
						eMan = field[clickX2game][clickY2game-1];
					
					console.log('gunki ->' + eMan.name);
				}
				
				var battleResult = standings[mMan.name][eMan.id];
				
				console.log('ResultRaw: standings[' + mMan.name + '][' + eMan.id + '] = ' +  battleResult);
				// 勝ったら
				if(battleResult == 1) {
					console.log('Result: Attacker Win');
				// ひきわけ
				} else if(battleResult == 2) {
					console.log('Result: Draw');
				// 負けたら
				} else {
					console.log('Result: Deffender Win');
				}
			// ない場合
			} else {
				target.move(clickX2game, clickY2game);
				$('#inst').text('');
			}
			
		// 動けない場合は
		} else {
			$('#inst').text("Cannot move clicked cell");
		}
		
		// ステージを戻す
		stage = 0;
		target = null;
		$('#inst').append("Please click your piece");
		draw();
	}
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

// ここは多分2人プレイのときはサーバーでやる処理．
// 
function testMen(){
	var men = [];
	var hand = [];
	
	for(m in manType){
		var target = manType[m];
		
		for(i=0; i<target.num; i++)
			hand.push(target);
	}
	
	shuffle(hand);
	
	// 自駒をランダムに配置
	var i=1, j=5;
	for(man in hand){
		switch(hand[man].type){
			case 'normal':
				myMen.push(new normalMan(hand[man].id, hand[man].name, i++, j));
				break;
			case  'air':
				myMen.push(new airMan(hand[man].id, hand[man].name, i++, j));
				break;
			case 'tank':
				myMen.push(new tankMan(hand[man].id, hand[man].name, i++, j));
				break;
			case 'immobile':
				myMen.push(new immobileMan(hand[man].id, hand[man].name, i++, j));
				break;
			case 'kohei':
				myMen.push(new koheiMan(hand[man].id, hand[man].name, i++, j));
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
	
	// 敵駒をランダムに配置する
	shuffle(hand);
	var i=1, j=1;
	for(man in hand){
		enemyMen.push(new enemyMan(hand[man].id, hand[man].name, i++, j));
		
		if(i%FIELD_X == 1){
			i=1; j++;
		}
		if((j==1 || j==FIELD_Y) && i==FIELD_NONE_BY_SHIRE){
			i++;
		}
	}
}


function changeStage(stage){
    
}