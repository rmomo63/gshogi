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