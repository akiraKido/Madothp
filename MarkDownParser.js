// Read README.md for updates and instructions.
// アップデート履歴や使い方はREADME.mdを参照ください。

// HTMLをパースする
var ParseMarkDownToHTML = function ( userText ) {
	// パースするテキストのDivをIDを使って抽出する
	var parseText = document.getElementById(userText);
	// パースするテキストの中身を抽出
	var text = parseText.innerHTML;
	// テキストを一行ずつ配列に追加する
	var textArray = text.split("\n");
	// <div>と</div>が1行として読み込まれるので、それを削除
	textArray.shift(); // 配列の先頭を削除
	textArray.pop();   // 配列の最後尾を削除
	
	var fixedText = [];
	// パース
	textArray.some(function(line, i){
		// 行の空白を消す（何故か文中のスペースは消えない）
		line.replace(/^\s+/g, "");
		line.replace(/^\t+/g, "");		
		// ヘッダの判定
		line = parseLine(textArray[i-1], line, textArray[i+1]);	
		
		// 判定結果を反映
		fixedText.push (line);
	});
	// パースしたテキストを反映
	parseText.innerHTML = fixedText.join("<br>");
}

// ネストしたリスト用のBOOLとCnt
var bulletNumCnt = 1;
var bulletStart = false;
var bulletList = ["-", "*", "+", "@"];
var startedBulletList = {};
// <pre>用の対応。コード前提
var isCodeBlockStart = false;
var isLocalCodeStart = false;

// 行のパース
function parseLine( prevText, text, nextText ){
	// 何故か空白行を消しても最初に2文字入るので、substrは全部3文字取得
	var compText = text.substr(3, 1);
	// 数字つきテキストのパース
	if (text.substr(3,2) == "1."){
		// +文字の削除
		text = text.slice(5);
		// 文字をリストにする
		text = "<li>" + text + "</li>";
		// リスト開始の際は<ol>をつける
		if(prevText === undefined){	// undefinedの場合substrできないので分岐
			text = "<ol>" + text;
		} else if(prevText.substr(3,2) != "1."){
			text = "<ol>" + text;			
		}
		// リスト終了の際は</ol>をつける		
		if(nextText === undefined){			
			text += "</ol>";
		} else if(nextText.substr(3,2) != "1."){
			text += "</ol>";
		}
	}
	// 箇条書きのパース
	else if(contains( text.substr(3,1), bulletList )){
		console.log (startedBulletList);		
		console.log(compText);
		// 最初の文字の削除
		text = text.slice(4);
		
		// 列をリストにする
		text = "<li>" + text + "</li>";
		
		if(prevText === undefined){
			text = "<ul>" + text;
			startedBulletList[compText] = bulletNumCnt;			
			bulletNumCnt++;			
		} else if (!( compText in startedBulletList )){
			text = "<ul>" + text;
			startedBulletList[compText] = bulletNumCnt;
			bulletNumCnt++;			
		}
		
		if(nextText === undefined){
			for(var i = 0; i < bulletNumCnt; i++){
				text += "</ul>";
			}
			bulletNumCnt = 0;
		}
		else if ( !contains( nextText.substr(3,1), bulletList ) ){
			for(var i = 0; i < bulletNumCnt; i++){
				text += "</ul>";
			}
			bulletNumCnt = 0;
		}
		else if(( nextText.substr(3,1) in startedBulletList) && nextText.substr(3, 1) != compText){
			var subVal = bulletNumCnt - startedBulletList[nextText.substr(3, 1)];
			bulletNumCnt = startedBulletList[nextText.substr(3, 1)];
			var deleteFlag = false;
			for( key in startedBulletList){
				if(key == nextText.substr(3, 1)) deleteFlag = true;
				if(deleteFlag){
					delete startedBulletList[key];
				}
			}
			for(var i = 0; i < subVal; i++){
				text += "</ul>";
			}
		}
		
	}
	else if(text.substr(3, 3) == "```"){
		if(!isCodeBlockStart){
			var codeDesc = [];
			var codeTypeText = "";			
			var codeDescText = "Code";			
			if(text.substr(6, text.length) != ""){
				codeDesc[0] = text.substr(6, text.length);
				codeTypeText = codeDesc[0];
				if(text.match(/:/)){
					codeDesc = text.split(":");
					codeDescText = codeDesc[1];
				}
			}
			codeDescText.replace(/\s+/g, "");
			text = '<pre><code class="' + codeTypeText + '">' + '<span class="MarkDownParserCodeDecription">' + codeDescText + "</span>";
			isCodeBlockStart = true;
		} else {
			text = "</code></pre>";
			isCodeBlockStart = false;
		}
	}
	else {
		var sharpCount = 0;
		charLength = text.length;
		for( var i = 0; i < text.length; i++){
			var character = text.substr(i,1);
			if(character == "#") sharpCount++;
		}

		if(sharpCount > 0 && sharpCount <= 6){
			text = "<h" + sharpCount + ">" + text.slice(sharpCount+3) + "</h" + sharpCount + ">";
		}
	}
	
	if(!isCodeBlockStart){
		var linkText = "";
		var linkAddress = "";
		for(var i = 1; i <= text.length; i++){
			if(text.substr(i, 1) == "`"){
				if(!isLocalCodeStart){
					text = text.substr(0, i) + '<span class="MarkDownParser">' + text.substr(i+1, text.length);
					isLocalCodeStart = true;
				} else {
					text = text.substr(0, i) + "</span>" + text.substr(i+1, text.length);
					isLocalCodeStart = false;
				}
			}
			if(text.substr(i, 1) == "["){
				linkText = text.substr(text.indexOf("[") + 1, text.lastIndexOf("]") - text.indexOf("[") - 1);
				linkAddress = text.substr(text.indexOf("(") + 1, text.lastIndexOf(")") - text.indexOf("(") - 1);
				if(linkAddress.substr(3,7) != "http://" || linkAddress.substr(3,8) != "https://"){
					linkAddress = "http://" + linkAddress;
				}
				text = text.substr(1, i - 1) + '<a href="' + linkAddress + '">' + linkText + "</a>" + text.substr(text.lastIndexOf(")") + 1, text.length - text.lastIndexOf(")") - 1);
			}			
		}
	}
	
	return text;
}

function contains( value, list ){
	return list.some(function (comparison, i){
		if(value == comparison) return true;
		if(i == list.length) return false;
	});
}

// どうでもいいけどデバッガ

// var DebugLogIdentifier;
// var DebugLogID = function (text){
// 	DebugLogIdentifier = document.getElementById(text);
// }

// function Debug (text){
// 	DebugLogIdentifier.innerText += text + "\n";
// 	DebugLogIdentifier.scrollTop = DebugLogIdentifier.scrollHeight;
// }