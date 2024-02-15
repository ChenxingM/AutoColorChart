[日本語](README.md)|[简体中文](README.zh.md)
# 色見本認識 および 撮影処理における色抽出ツール
# Auto Color Chart 2

## *ユーザーガイドブック作成中、今しばらくお待ちください。*

## 概要
- 本プロジェクトは、作画アニメーションから色見本画像を**色見本で指定したパーツ（肌、髪など）ごとをクループに、色の種類（Hi、ノーマル）も含めた色見本データに変換**し、撮影時に色を容易に抽出できるようにする**デスクトップアプリケーション**と併せて使用する**AEスクリプト**です。
- 色見本内のカラーボックスを**自動的に識別**し、色タイプ（ハイライト、ノーマル、影、２号影など）も判定できるよう設計されており、ポスプロ段階での色抽出の効率を大幅に向上させます。
- 単一または一括処理モードをサポートしており、大量の色見本も素早くデータ化できます。色見本内の重複色が検出でき、色見本画像にマークすることも可能です。
- **Adobe After Effects**用のスクリプトを通じてAE内で色見本の色をパーツごとに(肌、髪、服など)、もしくはタイプごとに(Hi、ノーマルなど)の抽出を実現しています。
- Cygamesさんは、色見本の識別ツールを既に開発してはいますが、公開されている情報では、限られたボックスしか認識できないそうです。公式サイトでは、「調整する際はカラーボックスに合わせたテンプレートを用意する必要がある」と書いてあります。本ソフトは、独自のアルゴリズムで、幅広いボックスを認識でき、更にプリセットシステムの導入により、ほぼ全ての色見本を認識できます。様々な工程で使用できるでしょう。

**現在の制作工程を全く改変せず、即使用できるツールとなります。**

![主窗口](https://github.com/ChenxingM/AutoColorChart/blob/main/screenshoots/mian.png "Auto Color Chart 2 メインウィンド")
*Auto Color Chart 2 メインウィンド*
*デモンストレーションで使用された色見本ファイルの公開許可を得ています*
## 特徴
- **カラーボックスの自動識別**: 画像処理技術を利用して色見本内の色とそのタイプを自動的に識別し、グループ分けします。
- **閾値による分離ボックスの認識**: 通常ボックスはもちろん、ハイライトやハイライトと影中ハイライトがノーマルなどと離れていても、正しく認識できます。
- **色見本プレビュー**: マウスで拡大、縮小、ドラッグし、色見本を確認できます。
- **無視色機能**: カラーボックスに無色のはずですが、実際に背景の仮色である場合、仮色を無視色に入力すれば、識別時に自動的カットします。
- **カスタムカラーボックス管理**: 作品によっては、特殊のカラーボックスのユーザーによるカスタマイズと管理をサポートし、ほぼ全ての色見本に対応できます。
- **設定ファイルの編集およびデバッグ情報ウィンドウ**: デベロッパー向けに設定ファイルの編集も可能、トラブルシューティングと最適化のためのデバッグ情報ウィンドウを提供します。
- **単一または一括処理のサポート**: ソフトウェアは、個々の画像または一括モードでの処理をサポートし、作業効率を向上させます。
- **重複色の検出**: 色見本にある同じ色の箇所を検知し、マークします。色見本の誤りや色の把握に最適です。
- **AEスクリプトの提供**: AE内で色見本の色を基に、セルの指定色（パーツ色全部、もしくは単一色）を抽出するためのAdobe After Effectsスクリプトを提供します。
  - AEスクリプトはオープンソースしており、ffxなどと連携し、自動化撮影(キャラ自動処理など)が実現可能
- **色見本データの便利さ**: JSONまたはXMLファイルによる色見本データが保存され、ユーザーが簡単にアクセス、編集できます。
  - XMLファイルに色見本から読み取ることができる情報が全て乗っているので、色見本データの使い道が幅広くなるでしょう。

![JSON](https://github.com/ChenxingM/AutoColorChart/blob/main/screenshoots/json.png "JSON")
*JSONデータ例*

![xml](https://github.com/ChenxingM/AutoColorChart/blob/main/screenshoots/xml.png "xml")
*XMLデータ例*


## 技術スタック
### 本プロジェクトは主にPythonで開発され、以下のライブラリおよび技術を含んでいます：
- **画像処理**: Pillow
- **画像分析**: scikit-image
- **インターフェース設計**: Tkinter, ttkthemes
- **データ処理および設定**: JSON, XML
### AEスクリプトはJavaScriptを使用しています。
- JSONとXML色見本データ両方対応可能
- AE内蔵のカラーピッカーツールを使用
- 選択中またはカラーピッカーで選択したカラーを表示でき、どんな色か一目で確認できます
- 汎用かつフリーなプラグイン、OLM Color Keepによる一度最大99色が抽出可能
- **注意：AEスクリプトのみは　MITライセンスに準じます。**

![AE脚本窗口](https://github.com/ChenxingM/AutoColorChart/blob/main/screenshoots/aescriptmain.png "AE Scriptメインウィンド")
*AEスクリプトマインウィンド*

![AE脚本窗口2](https://github.com/ChenxingM/AutoColorChart/blob/main/screenshoots/aescripttypepanel.png "AE Scriptメインウィンド2")
*タイプパネル：読み込んだ色見本データから、色のタイプをまとめ、自由にほしい色を抽出できます。色見本にすべてのタイプから、若しくは選択中のグループから　を選択できます。色見本読み込むにつれ表示します。閉じてもマインウィンドから呼び出し可能*


## 適用シーン
このソフトウェアとスクリプトは、アニメ制作における一般的な色見本が使われる現場

## 特性スクリーンショット

![ボックス識別](https://github.com/ChenxingM/AutoColorChart/blob/main/screenshoots/usrboxreg.png "ボックス識別")
*デフォルトでサポートされていないボックスなど、作品によって特殊なボックスを切り取り、プリセットとして保存できます。*

![ボックス管理作品](https://github.com/ChenxingM/AutoColorChart/blob/main/screenshoots/usrboxmgn.png "ボックス管理")
*プリセットのユーザーボックスを簡単に変更、削除できる管理画面。作品別にカテゴリーで容易に検索できます。*

![ボックス多様性](https://github.com/ChenxingM/AutoColorChart/blob/main/supportedBoxes/03_00.PNG "ボックス多様性")
*通常のカラーボックスはもちろん、閾値の設定で、分離したボックスも正しく認識できます。*

![カラーピッカー](https://github.com/ChenxingM/AutoColorChart/blob/main/screenshoots/colorpicker.gif "カラーピッカー")
*AEスクリプトUIでは、番号確認するのも面倒、ならカラーピッカーワンクリック！*

## 配布物

- AutoColorChart_2.2DevBeta_CN.exe (簡体字中国語版)
- AutoColorChart_2.2DevBeta_JP.exe (日本語版)
- AutoColorChartBeta_CN.jsx (簡体字中国語版)
- AutoColorChartBeta_JP.jsx (日本語版)
- AutoColorChar2_UserGuide.pdf (作成中)

## 動作環境（作者検証済）
- **ソフト本体**：Windows 10
- **AEスクリプト**：Adobe After Effect 2023 JavaScriptデバッガーを使用
- **未検証ですが、特に古いでなければ、他のAEとWindowsバーションで動作するはずです。**
- **Mac版は一応テストしてはいるが、大多数の撮影プラグインは未対応のため、お勧めしないし、リリースもしません。需要あれば状況に応じてリリースする可能性あり(Apple Silicon verのみ)**
- **AEスクリプトもまMacでは動作します。**
  
## その他
- Auto Color Chart 1.0のソースコードを公開してます！
- 【Cygames Tech Conference フォローアップ】『プリンセスコネクト！Re:Dive』アニメ撮影におけるテクニカルアーティストの役割～最高のアニメRPGを作るための自動化制作事例～　https://tech.cygames.co.jp/archives/3516/
