[日本語](README.md)|[简体中文](README.zh.md)
# 色见本识别程序 及配套AE脚本
# Auto Color Chart 2

## 概要
- 本项目是一个桌面应用程序和与其配合使用的AE脚本，旨在将二维动画中的色见本图像转换为**按照色按部件分类（头发，皮肤等），并包含颜色种类（高光，正常等）的色见数据**，以便于摄影时按部件提取颜色。
- 可**自动识别**色见的颜色框，并能判断颜色类型（高光、标准、阴影、二号阴影等），大大提高了后期制作阶段的颜色提取效率。
- 支持单个或批量处理模式，可以快速处理大量的色见。能够检测色见内的重复颜色，并在色见图像上进行标记。
- 通过**Adobe After Effects**脚本，在AE内按部位（如皮肤、头发、衣服等）或按类型（高光、标准等）提取色见本的颜色。
- Cygames已经开发了色见本识别工具，但仅能识别公主链接游戏内动画的色见，并需要准备色见模版。本软件通过独特的算法，能识别更广泛的色见的颜色框，并通过引入预设（用户自定义框）系统，几乎可以识别所有色见本。可应用于各种流程。

**无需改变现有的制作流程，即可立即使用。**

![Auto Color Chart 2 主窗口](https://github.com/ChenxingM/AutoColorChart/blob/main/screenshoots/mian.png "Auto Color Chart 2 主窗口")
*Auto Color Chart 2主窗口*
*演示中使用的色见本已得到公开许可*

## 特点
- **颜色框的自动识别**：利用图像处理技术自动识别色见本内的颜色及其类型，并进行分组。
- **阈值识别分离颜色框**：不仅普通颜色框，即使是高光、阴影与标准颜色框分离，也能正确识别。
- **色见本预览**：可以通过鼠标放大、缩小、拖动来检查色见本。
- **忽略色功能**：颜色框应无色，但实际上可能是背景的假色，输入假色至忽略色中，识别时会自动剔除。
- **自定义颜色框管理**：支持特殊的颜色框进行用户自定义和管理，几乎支持所有色见本。
- **设置文件编辑及调试信息窗口**：提供配置文件的编辑功能和调试信息窗口，便于开发者进行故障排除和优化。
- **支持单个或批量处理**：软件支持单个图片或批量模式处理，提高工作效率。
- **重复颜色检测**：能够检测色见本中相同颜色，并进行标记，便于检查。
- **提供AE脚本**：提供Adobe After Effects脚本，根据色见本的颜色在AE中提取指定颜色（全部部位色或单一颜色）。
  - AE脚本开源，遵循MIT开源许可协议，可以配合ffx等，实现自动摄影。
- **色见本数据的便利性**：色见数据保存为JSON或XML文件，用户可以轻松访问和编辑。
  - XML文件包含了从色见本中读取的所有信息，色见本数据的用途更加广泛。

![JSON数据示例](https://github.com/ChenxingM/AutoColorChart/blob/main/screenshoots/json.png "JSON数据示例")

![XML数据示例](https://github.com/ChenxingM/AutoColorChart/blob/main/screenshoots/xml.png "XML数据示例")

## 技术栈
### 本项目主要使用Python开发，包含以下库及技术：
- **图像处理**：Pillow
- **图像分析**：scikit-image
- **界面设计**：Tkinter, ttkthemes
- **数据处理及设置**：JSON, XML
### AE脚本使用JavaScript编写。
- 支持JSON和XML色见本数据
- 使用AE内置的颜色选择工具
- 选中颜色组，吸色后均会显示对应颜色，便于查看
- 取色插件为件OLM Color Keep
- **注意：AE脚本遵循MIT许可证。**

![AE脚本主窗口](https://github.com/ChenxingM/AutoColorChart/blob/main/screenshoots/aescriptmain.png "AE脚本主窗口")

![AE脚本窗口2](https://github.com/ChenxingM/AutoColorChart/blob/main/screenshoots/aescripttypepanel.png "AE脚本窗口2")

## 适用场景
该软件和脚本适用于拥有动画制作中常用色见本的流程

## 特性截图

![颜色框识别](https://github.com/ChenxingM/AutoColorChart/blob/main/screenshoots/usrboxreg.png "颜色框识别")

![颜色框管理](https://github.com/ChenxingM/AutoColorChart/blob/main/screenshoots/usrboxmgn.png "颜色框管理")

![颜色框多样性](https://github.com/ChenxingM/AutoColorChart/blob/main/supportedBoxes/03_00.PNG "颜色框多样性")

![颜色选择器](https://github.com/ChenxingM/AutoColorChart/blob/main/screenshoots/colorpicker.gif "颜色选择器")

## 发布
请从Release下载。
- AutoColorChart_2.22.exe (简体中文)
- AutoColorChart_2.22_JP.exe (日语)
- AutoColorChartBeta_CN.jsx (简体中文AE脚本)
- AutoColorChartBeta_JP.jsx (日语AE脚本)
- AutoColorChar2_UserGuide.pdf (制作中)

## 软件环境（作者验证过的）
- **软件本体**：Windows 10
- **AE脚本**：Adobe After Effect 2023 使用JavaScript调试器
- **虽未验证，只要不是特别老的版本，其他AE和Windows版本应该也能运行。**
- **Mac版已进行一定测试，但由于大多数摄影插件不支持，不推荐使用，也不发布。如有需求，视情况可能发布Apple Silicon版本。**
- **AE脚本在Mac上也能运行。**

## 其他
- Auto Color Chart 1.0的源代码已发布！
- CY技术大会文章链接 【Cygames Tech Conference フォローアップ】『プリンセスコネクト！Re:Dive』アニメ撮影におけるテクニカルアーティストの役割～最高のアニメRPGを作るための自動化制作事例～　https://tech.cygames.co.jp/archives/3516/
