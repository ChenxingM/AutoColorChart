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

*旧JSONデータ例*
```JSON
{
    "001_01_huai_normal.png": {
        "1": {
            "hi": [
                255,
                165,
                0
            ],
            "normal": [
                0,
                255,
                165
            ],
            "shadow": [
                255,
                165,
                0
            ],
            "2nd_shadow": [
                255,
                165,
                0
            ]
        },
        "2": {
            "hi": [
                0,
                255,
                165
            ],
            "normal": [
                0,
                255,
                165
            ],
            "shadow": [
                0,
                255,
                0
            ],
            "2nd_shadow": [
                255,
                165,
                0
            ]
        }
    }
}
```

*旧XMLデータ例*
```XML
<?xml version="1.0" ?>
<colorChartData programVersion="2.21" dataVersion="1.0">
    <image name="001_01_huai_normal.png" width="4300" height="2000" gruopNum="23">
        <group id="1" boxNum="4" validBoxNum="4" orientation="vertical" tag="">
            <color boxID="1" colorType="hi" r="81" g="85" b="93">
                <area>644</area>
                <position x="1854.0" y="301.5"/>
            </color>
            <color boxID="2" colorType="normal" r="65" g="68" b="70">
                <area>2196</area>
                <position x="1837.5" y="333.0"/>
            </color>
            <color boxID="3" colorType="shadow" r="46" g="46" b="51">
                <area>2196</area>
                <position x="1837.5" y="371.0"/>
            </color>
            <color boxID="4" colorType="2nd_shadow" r="33" g="33" b="37">
                <area>2196</area>
                <position x="1837.5" y="409.0"/>
            </color>
        </group>
        <group id="2" boxNum="4" validBoxNum="4" orientation="vertical" tag="">
            <color boxID="1" colorType="hi" r="93" g="125" b="126">
                <area>644</area>
                <position x="2010.0" y="301.5"/>
            </color>
            <color boxID="2" colorType="normal" r="89" g="109" b="111">
                <area>2196</area>
                <position x="1993.5" y="333.0"/>
            </color>
            <color boxID="3" colorType="shadow" r="68" g="70" b="88">
                <area>2196</area>
                <position x="1993.5" y="371.0"/>
            </color>
            <color boxID="4" colorType="2nd_shadow" r="51" g="52" b="66">
                <area>2196</area>
                <position x="1993.5" y="409.0"/>
            </color>
        </group>
    </image>
</colorChartData>

```

### 次のバージョンアップでは、新たなJSONとXMLフォーマットを使用予定です。
### AEスクリプトもその際、新JSON、XMLと従来のJSON、XML両方に対応済みです。
### 新JSONはより多くのデータが含まれて、使い道が幅広くなります。
*注意　状況次第では、今後JSONデータを破棄する可能性があり、全面的にXMLデータに移行するかもしれません。*

*新JSONデータ例*
```JSON
{
    "colorChartData": {
        "programVersion": 2.23,
        "dataVersion": 1.1,
        "markedImgPath": "C:\\this\\is\\a\\sample\\path\\image_marked_colors.png",
        "image": {
            "name": "image.png",
            "path": "C:\\this\\is\\a\\sample\\path\\image.png",
            "width": 4000,
            "height": 2000,
            "gruopNum": 20,
            "group": [
                {
                    "id": 1,
                    "boxNum": 5,
                    "validBoxNum": 5,
                    "orientation": "vertical",
                    "tag": "",
                    "groupBoxInfo": {
                        "boxCordLU": [1000, 50],
                        "boxCordRD": [1100, 200],
                        "centerCord": [1050.0, 125.0]
                    },
                    "color": [
                        {
                            "boxID": 1,
                            "colorType": "hi",
                            "area": 1000,
                            "position": [1020.5, 60.0],
                            "RGB": [255, 0, 0]
                        },
                        {
                            "boxID": 2,
                            "colorType": "normal",
                            "area": 2000,
                            "position": [1010.5, 100.5],
                            "RGB": [0, 255, 0]
                        },
                        {
                            "boxID": 3,
                            "colorType": "shadow_s_hi",
                            "area": 300,
                            "position": [1040.5, 120.0],
                            "RGB": [0, 0, 255]
                        },
                        {
                            "boxID": 4,
                            "colorType": "shadow",
                            "area": 2000,
                            "position": [1010.5, 140.5],
                            "RGB": [255, 255, 0]
                        },
                        {
                            "boxID": 5,
                            "colorType": "2nd_shadow",
                            "area": 2000,
                            "position": [1010.5, 180.5],
                            "RGB": [0, 255, 255]
                        }
                    ]
                }
            ]
        }
    }
}


```
*新XMLデータ例*
```XML
<?xml version="1.0" ?>
<colorChartData programVersion="2.23" dataVersion="1.1">
    <markedImgPath>C:/this/is/a/sample/path/image_marked_colors.png</markedImgPath>
    <image name="image.png" path="C:/this/is/a/sample/path/image.png" width="3600" height="1800" gruopNum="34">
        <group id="1" boxNum="5" validBoxNum="5" orientation="vertical" tag="">
            <groupBoxInfo minc="1000" minr="50" maxc="1100" maxr="200" centerX="1050.0" centerY="125.0"/>
            <color boxID="1" colorType="hi" r="255" g="0" b="0">
                <area>1000</area>
                <position x="1020.5" y="60.0"/>
            </color>
            <color boxID="2" colorType="normal" r="0" g="255" b="0">
                <area>2000</area>
                <position x="1010.5" y="100.5"/>
            </color>
            <color boxID="3" colorType="shadow_s_hi" r="0" g="0" b="255">
                <area>300</area>
                <position x="1040.5" y="120.0"/>
            </color>
            <color boxID="4" colorType="shadow" r="255" g="255" b="0">
                <area>2000</area>
                <position x="1010.5" y="140.5"/>
            </color>
            <color boxID="5" colorType="2nd_shadow" r="0" g="255" b="255">
                <area>2000</area>
                <position x="1010.5" y="180.5"/>
            </color>
        </group>
        <group id="2" boxNum="5" validBoxNum="5" orientation="vertical" tag="">
            <groupBoxInfo minc="2000" minr="100" maxc="2100" maxr="250" centerX="2050.0" centerY="175.0"/>
            <color boxID="1" colorType="hi" r="255" g="0" b="0">
                <area>1000</area>
                <position x="2020.5" y="110.0"/>
            </color>
            <color boxID="2" colorType="normal" r="0" g="255" b="0">
                <area>2000</area>
                <position x="2010.5" y="150.5"/>
            </color>
            <color boxID="3" colorType="shadow_s_hi" r="0" g="0" b="255">
                <area>300</area>
                <position x="2040.5" y="170.0"/>
            </color>
            <color boxID="4" colorType="shadow" r="255" g="255" b="0">
                <area>2000</area>
                <position x="2010.5" y="190.5"/>
            </color>
            <color boxID="5" colorType="2nd_shadow" r="0" g="255" b="255">
                <area>2000</area>
                <position x="2010.5" y="230.5"/>
            </color>
        </group>
    </image>
</colorChartData>

```


## 技術スタック
### 本プロジェクトは主にPythonで開発され、以下のライブラリおよび技術を含んでいます：
- **画像処理**: Pillow
- **画像分析**: scikit-image
- **インターフェース設計**: Tkinter, ttkthemes
- **データ処理および設定**: JSON, XML (状況次第では、JSONデータは今後破棄する可能性があります。)
### AEスクリプトはJavaScriptを使用しています。
- JSONとXML色見本データ両方対応可能
- AE内蔵のカラーピッカーツールを使用
- 選択中またはカラーピッカーで選択したカラーを表示でき、どんな色か一目で確認できます
- 汎用かつフリーなプラグイン、OLM Color Keepによる一度最大99色が抽出可能
- **注意：AEスクリプトのみは　MITライセンスに準じます。**

![AE脚本窗口](https://github.com/ChenxingM/AutoColorChart/blob/main/screenshoots/aescriptmain.png "AE Scriptメインウィンド")
*AEスクリプトのメインウィンド*

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

- AutoColorChart_2.22.exe (簡体字中国語版)
- AutoColorChart_2.22_JP.exe (日本語版)
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
