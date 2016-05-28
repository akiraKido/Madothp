# Madothpについて
MadothpはHTMLファイルに記述されたマークダウン形式の文章を  
HTMLに変換する為のスクリプトです。`<div>`タグの文章を変換  
することができます。  
  
今のところ、以下の記述が可能です。記述法はQiitaと同様です。

* ヘッダ
* 箇条書き
* ナンバリング
* コードブロック／インラインコード

なお、本スクリプトはhighlightjsに対応しています。Qiitaのように、  
```markdown
    ```javascript:MarkDownParser.js
    ```
```  
と書くことで、コードブロックに題名をつけることが出来ます。


# 使い方
* MarkDownParser.jsとMarkDownParserStyle.cssをダウンロードしてください。
* 使用したいHTMLに以下のコードを追加してください。
```HTML
    <script type="text/javascript" src="MarkDownParser.js"></script>
    <link rel="stylesheet" type="text/css" href="MarkDownParsetStyle.css">
```
* 最後に、以下のコードをHTMLファイルのどこかに記述してください。ParseMarkDownToHTMLの引数には、マークダウンからHTMLにパースしたい`<div>`のidを渡してください。
```HTML
    <script>
        ParseMarkDownToHTML( "markDown" );
    </script>
```  
  
##こんな感じに使えます
```HTML
<div id="markDown">
#ヘッダ

1. ナンバリング
1. ナンバリング

<!-- ネストさせる場合、記号を変えてください -->
+ 箇条書き
+ 箇条書き
    - 箇条書きネスト１
        * 箇条書きネスト2
        * 箇条書きネスト2
    - 箇条書きネスト１
        * 箇条書きネスト2
            @ 箇条書きネスト3
    - 箇条書きネスト1
+ 箇条書き
    @ 箇条書きネスト1

<!-- 題名を入力しない場合、題名にはcodeと出力されます -->	
　```java:textCode
　public static void main(String[] args){
	System.out.println("hello");
　}
　```
</div>
```
