// リンクを解析してダウンロード for Node.js
// ---モジュールの取り込み ---
var client = require('cheerio-httpcli');
var request = require('request');
var URL = require('url');
var fs = require('fs');
var path = require('path');

// --- 共通の設定 ---
// 階層の指定
var LINK_LEVEL = 1;
// 基準となるページURL
var TARGET_URL = "http://www.goo-net.com/usedcar/spread/goo/19/700630033930151009001.html/";
var list = {};
//
// メイン処理
downloadRec(TARGET_URL, 0);

// 指定のurlを最大レベルlevelまでダウンロード
function downloadRec(url, level) {
  
  console.log("①");
  // 最大レベルチェック
  if (level >= LINK_LEVEL) return;
  // 既出のサイトは無視する
  if (list[url]) return;
  list[url] = true;

  // 基準ページ以外なら無視する
  var us = TARGET_URL.split("/");
  
  // 末尾の要素を削除
  us.pop();
  console.log("[us] : " + us);
  var base = us.join("/");
  console.log("[base] : " + base);
  if (url.indexOf(base) < 0) return;

  // HTMLを取得する
  client.fetch(url, {}, function(err, $, res) {

    // 車の画像を取得
    $(".album").children(".cur").children("img").each(function(idx) {
      console.log("ループの中");
      // 画像のパスを得る
      var src = $(this).attr('src');
      if (!src) return;
      // 絶対パスを相対パスに変更
      src = URL.resolve(url, src);

      // '#' 以降を無視する(a.html#aa と a.html#bb は同じもの)
      href = href.replace(/\#.+$/, ""); // 末尾の#を消す
      downloadRec(href, level + 1);
    });

    // ページを保存(ファイル名を決定する)
    // 最後の１文字がスラッシュの場合
    if (url.substr(url.length-1, 1) == '/') {
      url += "index.html"; // インデックスを自動追加

    }
    //var savepath = url.split("/").slice(2).join("/");
    var savepath = "output";
    checkSaveDir(savepath);
    //console.log(savepath);
    console.log($.html());
    fs.writeFileSync(savepath, $.html());
  });
}

// 保存先のディレクトリが存在するか確認
function checkSaveDir(fname) {
  /*
  console.log("[fname] : " + fname);
  // ディレクトリ部分だけ取り出す
  var dir = path.dirname(fname);
  console.log("[dir] : " + dir);
  // ディレクトリを再帰的に作成する
  var dirlist = dir.split("/");
  var p = "";
  for (var i in dirlist) {
    p += dirlist[i] + "/";
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p);
    }
  }
  */
  console.log("[fname] : " + fname);
  console.log("existsSyncを実行");
  if (!fs.existsSync(fname)) {
    console.log("existsSync：true");
    fs.mkdirSync(fname);
    console.log("mkdirSync実行後");
  }
}

