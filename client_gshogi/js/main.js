window.onload	= function(){
	cvs = document.getElementById("shogi");
	ctx = cvs.getContext( "2d" );
	setQuality( 2 );
	
	init();
}

function init(){
    /* 初期手札の準備 */
    var id = 0;
    manType.push(new Man(SHOGI.TAISHO, 'normal', 1));
    manType.push(new Man(SHOGI.CHUSHO, 'normal', 1));
    manType.push(new Man(SHOGI.SHOSHO, 'normal', 1));
    manType.push(new Man(SHOGI.TAISA, 'normal', 1));
    manType.push(new Man(SHOGI.CHUSA, 'normal', 1));
    manType.push(new Man(SHOGI.SHOSA, 'normal', 1));
    manType.push(new Man(SHOGI.TAII, 'normal', 2));
    manType.push(new Man(SHOGI.CHUI, 'normal', 2));
    manType.push(new Man(SHOGI.SHOI, 'normal', 2));
    manType.push(new Man(SHOGI.HIKOKI, 'air', 2));
    manType.push(new Man(SHOGI.TANK, 'tank', 2));
    manType.push(new Man(SHOGI.JIRAI, 'immobile', 2));
    manType.push(new Man(SHOGI.SUPAI, 'normal', 1));
    manType.push(new Man(SHOGI.KIHEI, 'tank', 1));
    manType.push(new Man(SHOGI.GUNKI, 'immobile', 1));
    manType.push(new Man(SHOGI.KOHEI, 'kohei', 2));
	
	$.when(
		load()
	).done(function(){
		testMen();
		draw();
		cvs.addEventListener('click', onClick, false);
	});
}

function load(){
	var name;
	var tmp;
	for(man in manType){
		name = manType[man].id;
		tmp = new Image();
		tmp.id = getUniqueStr();
		tmp.src = "img/" + skinName + "/" + SHOGI_EN[name] +".png";
		manImage[SHOGI_EN[name]] = tmp;
	}
	
	// デバッグのため敵の駒も
	if(DEBUG_ENEMY_MAN){
		for(man in manType){
			name = manType[man].id;
			tmp = new Image();
			tmp.id = getUniqueStr();
			tmp.src = "img/enemy/" + SHOGI_EN[name] +".png";
			manImage[SHOGI_EN[name]+'E'] = tmp;
		}
	} else {
		tmp = new Image();
		tmp.id = getUniqueStr();
		tmp.src = "img/" + skinName + "/enemy.png";
		manImage['enemy'] = tmp;
	}
}

function draw(man = null){
    fieldDraw();
    
    if(man != null){
    	canMoveFieldDraw(man);
    }
    
    // 駒の表示
    menToField();
    manDraw();
}

// 手駒を盤面に配置する
function menToField(){
    // 盤面の配列初期化
	field = [];
    for(i=0;i<FIELD_Y;i++){
    	field[i] = [];
    }
    
	for(man in enemyMen){
		if(enemyMen[man].live) field[enemyMen[man]._x][enemyMen[man]._y] = enemyMen[man];
	}
	
	for(man in myMen){
		if(myMen[man].live) field[myMen[man]._x][myMen[man]._y] = myMen[man];
	}
}

// 動ける駒の場所を表示
function canMoveFieldDraw(man){
	// console.log(man.name + '('+ man.x + ', ' + man.y + ') can move ...');
	var canMoveCnt = 0;
	for(x=1;x<=FIELD_X;x++){
		for(y=1;y<=FIELD_Y;y++){
			// 司令塔の部分は判定しない．
			if((x==FIELD_NONE_BY_SHIRE && y==1) || (x==FIELD_NONE_BY_SHIRE && y==FIELD_Y)) continue;
			
			// 動ける場合は薄い色を出す．
			// if(!field[x][y] && man.canMove(x, y)){
			if(man.canMove(x, y)){ // デバッグ用に全マス判定
				// console.log('('+x+', ' +y+')');
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
			putMan(man);
		}
	}
}

/* 駒を座標に配置する */
function putMan(man){
	var image;
	if(DEBUG_ENEMY_MAN){
		image = (man.user) ? manImage[man.name] : manImage[man.name + 'E'];
	} else {
		image = (man.user) ? manImage[man.name] : manImage['enemy'];
	}
	
	ctx.drawImage(image, _calcX2canvas(man.x, man.y), _calcY2canvas(man.x, man.y), MAN_SIZE_W, MAN_SIZE_H);
    image.addEventListener('load', function() {
		ctx.drawImage(image, _calcX2canvas(man.x, man.y), _calcY2canvas(man.x, man.y), MAN_SIZE_W, MAN_SIZE_H);
    }, false);
}

function onClick(e){
    var rect = e.target.getBoundingClientRect();
    var clickX = e.clientX - rect.left;
    var clickY = e.clientY - rect.top;
    
    var clickX2game = _calcX2game(clickX, clickY);
    var clickY2game = _calcY2game(clickX, clickY);
    
	$("#result").text("You clicked (x: " + _calcX2game(clickX, clickY) + ",y: " + _calcY2game(clickX, clickY) + ")");

	// 何もしていない場合で駒を選択した場合
	if(stage==0 && field[clickX2game][clickY2game]){
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
			
			// 動いた先に駒がある場合
			if(field[clickX2game][clickY2game] && !field[clickX2game][clickY2game].user){
				var mMan = target;
				var eMan = field[clickX2game][clickY2game];
				var tMan = null;
				console.log('Battle: Attacker(' + mMan.name + ') VS Deffender(' + eMan.name + ')');
				
				// 相手の駒が軍旗の場合は，後ろの駒で判定
				if(eMan.name == SHOGI.GUNKI && clickY2game != 1 &&
					field[clickX2game][clickY2game-1] && !field[clickX2game][clickY2game-1].user){
					
					tMan = field[clickX2game][clickY2game-1];
					console.log('gunki ->' + tMan.name);
				// 司令塔の場合
				} else if (clickY2game == 2 && clickX2game == FIELD_NONE_BY_SHIRE && !field[clickX2game-1][clickY2game-1].user){
					
					tMan = field[FIELD_NONE_BY_SHIRE-1][1];
					console.log('gunki ->' + tMan.name);
					
				} else {
					tMan = eMan;
				}
				
				console.log('ResultRaw: standings[' + mMan.id + '][' + tMan.id + '] = ');
				var battleResult = standings[mMan.id][tMan.id];
				// 勝ったら
				if(battleResult == 1) {
					console.log('Result: Attacker Win');
					
					mMan.move(clickX2game, clickY2game); // 自陣を移動
					eMan.death(); // 相手を殺す
				// ひきわけ
				} else if(battleResult == 2) {
					console.log('Result: Draw');
					
					mMan.death();
					eMan.death();
				// 負けたら
				} else {
					console.log('Result: Deffender Win');
					
					mMan.death();
				}
			// ない場合
			} else {
				target.move(clickX2game, clickY2game);
				$('#inst').text('');
			}
			
		// 動けない場合は
		} else {
			$('#inst').html("Cannot move clicked cell<br>");
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
				myMen.push(new normalMan(hand[man].id, i++, j));
				break;
			case  'air':
				myMen.push(new airMan(hand[man].id, i++, j));
				break;
			case 'tank':
				myMen.push(new tankMan(hand[man].id, i++, j));
				break;
			case 'immobile':
				myMen.push(new immobileMan(hand[man].id, i++, j));
				break;
			case 'kohei':
				myMen.push(new koheiMan(hand[man].id, i++, j));
				break;
			default:
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
	// var i=1, j=1;
	// for(man in hand){
	// 	enemyMen.push(new enemyMan(hand[man].id, i++, j));
		
	// 	if(i%FIELD_X == 1){
	// 		i=1; j++;
	// 	}
	// 	if((j==1 || j==FIELD_Y) && i==FIELD_NONE_BY_SHIRE){
	// 		i++;
	// 	}
	// }
	
	enemyMen.push(new enemyMan(SHOGI.GUNKI, 4, 2));
	enemyMen.push(new enemyMan(SHOGI.KOHEI, 3, 1));
}


function changeStage(stage){
    
}