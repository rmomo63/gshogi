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
		// 駒があるところは移動不可能
		// TODO 相手の駒は取れるようにする．
		if(field[_x][_y]) return false;
		
		// 壁を超える際は絶対値が1でもfalse
		if(!(this._x==2 || this._x==5)) {
			if(this._y==4 && _y==5) return false;
			if(this._y==5 && _y==4) return false;
		}
		
		// 自分の司令塔にいる場合
		if(this._x==(FIELD_NONE_BY_SHIRE-1) && (this._y==FIELD_Y)){
			if(this._y == _y && _x==FIELD_NONE_BY_SHIRE+1) return true;
			if((_y==FIELD_Y-1) && _x==FIELD_NONE_BY_SHIRE) return true;
		}
		// 相手の司令塔にいる場合
		if(this._x==(FIELD_NONE_BY_SHIRE-1) && (this._y==1)){
			if(this._y == _y && _x==FIELD_NONE_BY_SHIRE+1) return true;
			if((_y==2) && _x==FIELD_NONE_BY_SHIRE) return true;
		}
		
		// 自分の司令塔にはいるとき
		if((_x == FIELD_NONE_BY_SHIRE-1) && (_y == FIELD_Y)){
			if(this._x == FIELD_NONE_BY_SHIRE && this._y == FIELD_Y-1) return true;
			if(this._x == FIELD_NONE_BY_SHIRE+1 && this._y == FIELD_Y) return true;
		}
		// 相手の司令塔に入るとき
		if((_x == FIELD_NONE_BY_SHIRE-1) && (_y == 1)){
			if(this._x == FIELD_NONE_BY_SHIRE && this._y == 2) return true;
			if(this._x == FIELD_NONE_BY_SHIRE+1 && this._y == 1) return true;
		}
		
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
		// 駒があるところは移動不可能
		// TODO 相手の駒は取れるようにする．
		if(field[_x][_y]) return false;
		
		if(this._x==_x) return true;
		
		// 自分の司令塔にいる場合
		if(this._x==(FIELD_NONE_BY_SHIRE-1) && (this._y==FIELD_Y)){
			if(this._y == _y && _x==FIELD_NONE_BY_SHIRE+1) return true;
			if(_x==FIELD_NONE_BY_SHIRE) return true;
		}
		// 相手の司令塔にいる場合
		if(this._x==(FIELD_NONE_BY_SHIRE-1) && (this._y==1)){
			if(this._y == _y && _x==FIELD_NONE_BY_SHIRE+1) return true;
			if(_x==FIELD_NONE_BY_SHIRE) return true;
		}
		
		// 自分の司令塔にはいるとき
		if((_x == FIELD_NONE_BY_SHIRE-1) && (_y == FIELD_Y)){
			if(this._x == FIELD_NONE_BY_SHIRE) return true;
			if(this._x == FIELD_NONE_BY_SHIRE+1 && this._y == FIELD_Y) return true;
		}
		// 相手の司令塔に入るとき
		if((_x == FIELD_NONE_BY_SHIRE-1) && (_y == 1)){
			if(this._x == FIELD_NONE_BY_SHIRE) return true;
			if(this._x == FIELD_NONE_BY_SHIRE+1 && this._y == 1) return true;
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
		// 駒があるところは移動不可能
		// TODO 相手の駒は取れるようにする．
		if(field[_x][_y]) return false;
		
		// 壁を超える際は絶対値が1でもfalse
		if(!(this._x==2 || this._x==5)) {
			if(this._y==4 && _y==5) return false;
			if(this._y==6 && _y==4) return false;
			if(this._y==5 && _y==3) return false;
			if(this._y==5 && _y==4) return false;
		}
		
		// 自分の司令塔にいる場合
		if(this._x==(FIELD_NONE_BY_SHIRE-1) && (this._y==FIELD_Y)){
			if(this._y == _y && _x==FIELD_NONE_BY_SHIRE+1) return true;
			if((_y==FIELD_Y-1) && _x==FIELD_NONE_BY_SHIRE) return true;
		}
		// 相手の司令塔にいる場合
		if(this._x==(FIELD_NONE_BY_SHIRE-1) && (this._y==1)){
			if(this._y == _y && _x==FIELD_NONE_BY_SHIRE+1) return true;
			if((_y==2) && _x==FIELD_NONE_BY_SHIRE) return true;
		}
		
		// 自分の司令塔にはいるとき
		if((_x == FIELD_NONE_BY_SHIRE-1) && (_y == FIELD_Y)){
			if(this._x == FIELD_NONE_BY_SHIRE && this._y == FIELD_Y-1) return true;
			if(this._x == FIELD_NONE_BY_SHIRE+1 && this._y == FIELD_Y) return true;
		}
		// 相手の司令塔に入るとき
		if((_x == FIELD_NONE_BY_SHIRE-1) && (_y == 1)){
			if(this._x == FIELD_NONE_BY_SHIRE && field[FIELD_NONE_BY_SHIRE][2]) return false;
			if(this._x == FIELD_NONE_BY_SHIRE && this._y <= 3) return true;
			if(this._x == FIELD_NONE_BY_SHIRE+1 && this._y == 1) return true;
		}
		
		// 周囲1マス
		if(Math.abs(this._x - _x) + Math.abs(this._y - _y) == 1) return true;
		
		// 前方2マス
		if((_x == this._x) && (this._y - _y == 2) && !field[_x][_y+1]) return true;
		
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
		// 駒があるところは移動不可能
		// TODO 相手の駒は取れるようにする．
		if(field[_x][_y]) return false;
		
		for(i=this._x+1;i<=_x;i++) if(field[i][_y]) return false;
		for(i=this._x-1;i>=_x;i--) if(field[i][_y]) return false;
		for(i=this._y+1;i<=_y;i++) if(field[_x][i]) return false;
		for(i=this._y-1;i>=_y;i--) if(field[_x][i]) return false;
		
		// 壁を超える際は絶対値が1でもfalse
		if(!(this._x==2 || this._x==5)) {
			if(this._y<=4 && _y>=5) return false;
			if(this._y>=5 && _y<=4) return false;
		}
		
		// 自分の司令塔にいる場合
		if(this._x==(FIELD_NONE_BY_SHIRE-1) && (this._y==FIELD_Y)){
			if(this._y == _y && _x==FIELD_NONE_BY_SHIRE+1) return true;
			if(_x==FIELD_NONE_BY_SHIRE) return true;
		}
		// 相手の司令塔にいる場合
		if(this._x==(FIELD_NONE_BY_SHIRE-1) && (this._y==1)){
			if(this._y == _y && _x==FIELD_NONE_BY_SHIRE+1) return true;
			if(_x==FIELD_NONE_BY_SHIRE) return true;
		}
		
		// 自分の司令塔にはいるとき
		if((_x == FIELD_NONE_BY_SHIRE-1) && (_y == FIELD_Y)){
			if(this._x == FIELD_NONE_BY_SHIRE) return true;
			if(this._x == FIELD_NONE_BY_SHIRE+1 && this._y == FIELD_Y) return true;
		}
		// 相手の司令塔に入るとき
		if((_x == FIELD_NONE_BY_SHIRE-1) && (_y == 1)){
			for(i=this._y-1;i>=_y;i--) if(this._x == FIELD_NONE_BY_SHIRE && field[FIELD_NONE_BY_SHIRE][i]) return false;
			if(this._x == FIELD_NONE_BY_SHIRE) return true;
			if(this._x == FIELD_NONE_BY_SHIRE+1 && this._y == 1) return true;
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