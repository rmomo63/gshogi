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
// 敵駒の配列
var enemyMen = [];

// 将棋盤の状況
var field = [];

// 現在の状態を保存しておく
var stage = 0;
var target = null;

// 勝敗表 1:win 2:draw 3:loose
var standings = [];
// taisho, chusho, shosho, taisa, chusa, shosa, taii, chui, shoi, hikoki, tank, jirai, supai, kihei, gunki, kohei
standings['taisho'] = [2,1,1,1,1,1,1,1,1,1,1,2,3,1,1,1];
standings['chusho'] = [3,2,1,1,1,1,1,1,1,1,1,2,1,1,1,1];
standings['shosho'] = [3,3,2,1,1,1,1,1,1,1,1,2,1,1,1,1];
standings['taisa']  = [3,3,3,2,1,1,1,1,1,1,1,2,1,1,1,1];
standings['chusa']  = [3,3,3,3,2,1,1,1,1,1,1,2,1,1,1,1];
standings['shosa']  = [3,3,3,3,3,2,1,1,1,1,1,2,1,1,1,1];
standings['taii']   = [3,3,3,3,3,3,2,1,1,3,3,2,1,1,1,1];
standings['chui']   = [3,3,3,3,3,3,3,2,1,3,3,2,1,1,1,1];
standings['shoi']   = [3,3,3,3,3,3,3,3,2,3,3,2,1,1,1,1];
standings['hikoki'] = [3,3,3,3,3,3,1,1,1,2,1,1,1,1,1,1];
standings['tank']   = [3,3,3,3,3,3,1,1,1,3,2,2,1,1,1,1];
standings['jirai']  = [2,2,2,2,2,2,2,2,2,2,3,2,2,2,2,2];
standings['supai']  = [1,3,3,3,3,3,3,3,3,3,3,2,2,1,1,1]; // check
standings['kihei']  = [3,3,3,3,3,3,3,3,3,3,3,2,3,2,1,1]; // check
standings['kohei']  = [3,3,3,3,3,3,3,3,3,3,3,1,3,3,1,2]; // check