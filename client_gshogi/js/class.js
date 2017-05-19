// 駒の情報を格納
var Man = function(id, type, num){
	this.type = type;
	this.num = num;
	this.id = id;
}

class myMan{
	constructor(id, x, y){
		this._x = x;
		this._y = y;
		this._id = id;
		this._live = 1;
	}
	get x(){ return this._x; }
	get y(){ return this._y; }
	get id(){ return this._id; }
	get name(){ return SHOGI_EN[this._id]; }
	get live(){ return this._live; }
	get user(){ return 1; }
	
	death(){ this._live = 0; }
	
	move(_x, _y){
		this._x = _x;
		this._y = _y;
	}
}

// 駒クラス
class normalMan extends myMan{
	
	canMove(_x, _y){
		// 自分の駒があるところは移動不可能
		if(field[_x][_y] && field[_x][_y].user) return false;
		
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
class airMan extends myMan{
	canMove(_x, _y){
		// 自分の駒があるところは移動不可能
		if(field[_x][_y] && field[_x][_y].user) return false;
		
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
class tankMan extends myMan{
	canMove(_x, _y){
		// 自分の駒があるところは移動不可能
		if(field[_x][_y] && field[_x][_y].user) return false;
		
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
class koheiMan extends myMan{
	canMove(_x, _y){
		// 自分の駒があるところは移動不可能
		if(field[_x][_y] && field[_x][_y].user) return false;
		
		var flg = false;
		for(i=this._x+1, flg = false;i<=_x;i++){
			if(field[i][_y] && field[i][_y].user) return false;
			if(flg || field[i][_y]){
				flg = true;
				for(j=this._x+1; j < i; j++) if(field[j][_y]) return false;
			}
		}
		for(i=this._x-1, flg = false;i>=_x;i--){
			if(field[i][_y] && field[i][_y].user) return false;
			if(flg || field[i][_y]){
				flg = true;
				for(j=this._x-1; j > i; j--) if(field[j][_y]) return false;
			}
		}
		for(i=this._y+1, flg = false;i<=_y;i++){
			if(field[_x][i] && field[_x][i].user) return false;
			if(flg || field[_x][i]){
				flg = true;
				for(j=this._y+1; j < i; j++) if(field[_x][j]) return false;
			}
		}
		for(i=this._y-1, flg = false;i>=_y;i--){
			if(field[_x][i] && field[_x][i].user) return false;
			if(flg || field[_x][i]){
				flg = true;
				for(j=this._y-1; j > i; j--) if(field[_x][j]) return false;
			}
		}
		
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
class immobileMan extends myMan{
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

class enemyMan{
	constructor(id, x, y){
	    this._id = id;
		this._x = x;
		this._y = y;
		this._live = 1;
	}
	get x(){ return this._x; }
	get y(){ return this._y; }
	get live(){ return this._live; }
	get id(){ return this._id; }
	get name(){ return SHOGI_EN[this._id]; }
	get user(){ return 0; }
	
	death(){ this._live = 0; }
}

// 手クラス
var Hand = function(man, coor){
	
};