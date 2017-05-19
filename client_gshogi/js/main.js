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
    
    // 駒がクリックされている場合は動けるマスを表示する
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
    var clickMan = field[clickX2game][clickY2game];
	// 何もしていない場合で駒を選択した場合
	if(stage==0 && clickMan){
		// 自分の駒の場合は動ける範囲を描画
		if(clickMan.user){
			stage = 1;
			target = clickMan;
			
			draw(target);
		// 相手の駒の場合はラベルを付ける処理
		} else {
			var labelSelectUl = $('<ul>');
			labelSelectUl.attr('id', clickMan.id);
			
			for(i in SHOGI){
				var labelLi = $('<li>');
				labelLi.attr('id', i);
				labelLi.text(SHOGI_JA)
			}
			
			console.log(labelSelectUl);
		}
	// 移動する駒を選択している状態でマスをクリック
	} else if(stage==1){
		
		// そのマスに動ける場合は
		if(target.canMove(clickX2game, clickY2game)){
			var fromX = target.x; var fromY = target.y;
			var moveX = clickX2game; var moveY = clickY2game;
			var result = '移動';
			
			// 動いた先に駒がある場合
			if(clickMan && !clickMan.user){
				var mMan = target;
				var eMan = clickMan;
				var tMan = null;
				
				// 相手の駒が軍旗の場合は，後ろの駒で判定
				if(eMan.name == SHOGI.GUNKI && clickY2game != 1 &&
					field[clickX2game][clickY2game-1] && !field[clickX2game][clickY2game-1].user){
					
					tMan = field[clickX2game][clickY2game-1];
				// 司令塔の場合
				} else if (clickY2game == 2 && clickX2game == FIELD_NONE_BY_SHIRE && !field[clickX2game-1][clickY2game-1].user){
					tMan = field[FIELD_NONE_BY_SHIRE-1][1];
				} else {
					tMan = eMan;
				}
				
				var battleResult = standings[mMan.id][tMan.id];
				// 勝ったら
				if(battleResult == 1) {
					mMan.move(clickX2game, clickY2game); // 自陣を移動
					eMan.death(); // 相手を殺す
					result = 'vs 敵駒(' + eMan.JPname + ') : 勝ち';
				// ひきわけ
				} else if(battleResult == 2) {
					mMan.death();
					eMan.death();
					result = 'vs 敵駒(' + eMan.JPname + ') : 引分';
				// 負けたら
				} else {
					mMan.death();
					result = 'vs 敵駒(??) : 負け';
				}
			// ない場合
			} else {
				target.move(clickX2game, clickY2game);
			}
			
			var hand = new Hand(target, fromX, fromY, moveX, moveY, result);
			
			hands.push(hand);
			drawHistory(hand);
			
		// 動けない場合は
		} else {
		}
		
		// ステージを戻す
		stage = 0;
		target = null;
		
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

function drawHistory(hand){
	var _li = $('<li>');
	_li.html('[' + hand.time + '] (' + hand._x + ', ' + hand._y + ') -> (' + hand.moveX + ', ' + hand.moveY + ') ' + '<span>' + hand.man.JPname + '</span>' + ' ' + hand.result);
	$('#history').prepend(_li);
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
				myMen.push(new normalMan(hand[man].id, getUniqueStr(), i++, j));
				break;
			case  'air':
				myMen.push(new airMan(hand[man].id, getUniqueStr(), i++, j));
				break;
			case 'tank':
				myMen.push(new tankMan(hand[man].id, getUniqueStr(), i++, j));
				break;
			case 'immobile':
				myMen.push(new immobileMan(hand[man].id, getUniqueStr(), i++, j));
				break;
			case 'kohei':
				myMen.push(new koheiMan(hand[man].id, getUniqueStr(), i++, j));
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
	var i=1, j=1;
	for(man in hand){
		enemyMen.push(new enemyMan(hand[man].id, getUniqueStr(), i++, j));
		
		if(i%FIELD_X == 1){
			i=1; j++;
		}
		if((j==1 || j==FIELD_Y) && i==FIELD_NONE_BY_SHIRE){
			i++;
		}
	}
}