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