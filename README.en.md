[日本語](README.md) | [简体中文](README.zh.md) | [English](README.en.md)

# Auto Color Chart 2

## Overview
- This project is a desktop application and an accompanying AE script designed to convert color charts in 2D animations into **color data categorized by parts (hair, skin, etc.) and color types (highlight, normal, etc.)**, facilitating color extraction by parts during the shooting process.
- It can **automatically recognize** color boxes in the color charts and determine color types (highlight, standard, shadow, secondary shadow, etc.), greatly improving the efficiency of color extraction in the post-production stage.
- Supports single or batch processing mode, allowing for quick handling of a large number of color charts. It can detect duplicate colors within the color chart and mark them on the image.
- Through the **Adobe After Effects** script, you can extract colors from color charts by parts (such as skin, hair, clothes, etc.) or by types (highlight, standard, etc.) within AE.
- Cygames, Inc. has developed a color chart recognition tool, but it can only recognize color charts within the Princess Connect! game animations and requires a color chart template. This software, with its unique algorithm, can recognize a wider range of color chart color boxes and, through the introduction of a preset (user-defined box) system, can recognize almost all color charts. It can be applied to various workflows.

**Can be used immediately without changing the existing workflow.**

![Auto Color Chart 2 Main Window](https://github.com/ChenxingM/AutoColorChart/blob/main/screenshoots/mian_cn.png "Auto Color Chart 2 Main Window")
*Auto Color Chart 2 Main Window*
*The color chart used in the demo has been publicly licensed*

## Features
- **Automatic recognition of color boxes**: Uses image processing technology to automatically recognize the colors and their types within the color chart and group them.
- **Threshold recognition to separate color boxes**: Not only ordinary color boxes, but also correctly recognizes separated highlight, shadow, and standard color boxes.
- **Color chart preview**: Allows you to zoom in, zoom out, and drag to inspect the color chart with the mouse.
- **Ignore color function**: The color box should be colorless, but it may actually be a fake color of the background. Input the fake color into the ignore color, and it will be automatically excluded during recognition.
- **Custom color box management**: Supports special color boxes for user customization and management, supporting almost all color charts.
- **Settings file editing and debug information window**: Provides configuration file editing and debug information window for developers to troubleshoot and optimize.
- **Supports single or batch processing**: The software supports single image or batch mode processing, improving work efficiency.
- **Duplicate color detection**: Can detect the same color in the color chart and mark it for inspection.
- **Provides AE script**: Provides Adobe After Effects script to extract specified colors in AE according to the colors in the color chart (all part colors or single color).
  - The AE script is open-source and follows the MIT open-source license, and can be used with ffx, etc., for automatic shooting.
- **Convenience of color chart data**: The color chart data is saved as JSON or XML files, allowing users to easily access and edit.
  - The XML file contains all the information read from the color chart, making the color chart data more versatile.

*Old JSON Example*
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

*Old XML Example*
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

### In future updates, a new JSON and XML data format will be adopted. The new JSON contains more information, facilitating future development and expansion.
### The AE script has been updated to support both the old and new JSON and XML formats.
*Note: Depending on the situation, JSON data may be abandoned in favor of XML in the future.*

*New JSON Example*
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

*New XML Example*
```XML
<colorChartData programVersion="2.23" dataVersion="1.1">
    <image name="image.png" path="C:\\this\\is\\a\\sample\\path\\image.png" width="4000" height="2000" gruopNum="20">
        <group id="1" boxNum="5" validBoxNum="5" orientation="vertical" tag="">
            <groupBoxInfo boxCordLU="1000,50" boxCordRD="1100,200" centerCord="1050.0,125.0"/>
            <color boxID="1" colorType="hi" area="1000" position="1020.5,60.0" RGB="255,0,0"/>
            <color boxID="2" colorType="normal" area="2000" position="1010.5,100.5" RGB="0,255,0"/>
            <color boxID="3" colorType="shadow_s_hi" area="300" position="1040.5,120.0" RGB="0,0,255"/>
            <color boxID="4" colorType="shadow" area="2000" position="1010.5,140.5" RGB="255,255,0"/>
            <color boxID="5" colorType="2nd_shadow" area="2000" position="1010.5,180.5" RGB="0,255,255"/>
        </group>
    </image>
</colorChartData>
```

## Tech Stacks
### This project is mainly developed using Python and includes the following libraries and technologies:
- **Image Processing**: Pillow
- **Image Analysis**: scikit-image
- **UI Design**: Tkinter, ttkthemes
- **Data Processing and Settings**: JSON, XML (may abandon JSON data in favor of XML in the future)
### The AE script is written in JavaScript.
- Supports JSON and XML color chart data
- Uses AE's built-in color selection tool (eye-dropper toll)
- Displays corresponding colors when selecting color groups and sampling colors for easy viewing
- Color picking plugin: OLM Color Keep
- **Note: The AE script follows the MIT license.**

![AE Script Main Window](https://github.com/ChenxingM/AutoColorChart/blob/main/screenshoots/aescriptmain.png "AE Script Main Window")

![AE Script Window 2](https://github.com/ChenxingM/AutoColorChart/blob/main/screenshoots/aescripttypepanel.png "AE Script Window 2")

## Use Cases
This software and script are suitable for workflows that commonly use color charts in animation production.

## Features Screenshots

![Color Box Recognition](https://github.com/ChenxingM/AutoColorChart/blob/main/screenshoots/usrboxreg.png "Color Box Recognition")

![Color Box Management](https://github.com/ChenxingM/AutoColorChart/blob/main/screenshoots/usrboxmgn.png "Color Box Management")

![Color Box Diversity](https://github.com/ChenxingM/AutoColorChart/blob/main/supportedBoxes/03_00.PNG "Color Box Diversity")

![Color Picker](https://github.com/ChenxingM/AutoColorChart/blob/main/screenshoots/colorpicker.gif "Color Picker")

## Releases
Please download from the Release section.
- AutoColorChart_2.22.exe (Simplified Chinese)
- AutoColorChart_2.22_JP.exe (Japanese)
- AutoColorChartBeta_CN.jsx (Simplified Chinese AE Script)
- AutoColorChartBeta_JP.jsx (Japanese AE Script)
- AutoColorChar2_UserGuide.pdf (In Production)

## Verified Software Environment
- **Software Body**: Windows 10
- **AE Script**: Adobe After Effect 2023 using JavaScript debugger
- **Other AE and Windows versions should work as long as they are not too old.**
- **Mac version has been tested to some extent, but most photography plugins are not supported, so it is not recommended or released. If needed, an Apple Silicon version may be released.**
- **AE script also runs on Mac.**

## Contributions

Feel free to commit issuses and pull requests in order to make this project better.

## Other
- The source code for Auto Color Chart 1.0 has been released!
- Cygames Technical Conference article link: [【Cygames Tech Conference フォローアップ】『プリンセスコネクト！Re:Dive』アニメ撮影におけるテクニカルアーティストの役割～最高のアニメRPGを作るための自動化制作事例～](https://tech.cygames.co.jp/archives/3516/)