//===========================================================================================//
// Script Name: AutoColorChart.jsx
// Version: 2.21 beta
// Author: 千石まよひ
// Last Update: 2024/01/05
// License: MIT
// Copyright 2024 SengokuMayoi (Ma Chenxing)
//============================================================================================//
// 为ES3系统带来JSON对象支持，包含 JSON.parse() 和 JSON.stringify() 方法
// ===================================================================

if (typeof JSON !== "object") {
	JSON = {};
}

(function() {
	"use strict";

	var rx_one = /^[\],:{}\s]*$/;
	var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
	var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
	var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
	var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
	var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

	function f(n) {
		// Format integers to have at least two digits.
		return (n < 10) ? "0" + n: n;
	}

	function this_value() {
		return this.valueOf();
	}

	if (typeof Date.prototype.toJSON !== "function") {

		Date.prototype.toJSON = function() {

			return isFinite(this.valueOf()) ? (this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z") : null;
		};

		Boolean.prototype.toJSON = this_value;
		Number.prototype.toJSON = this_value;
		String.prototype.toJSON = this_value;
	}

	var gap;
	var indent;
	var meta;
	var rep;

	function quote(string) {

		// If the string contains no control characters, no quote characters, and no
		// backslash characters, then we can safely slap some quotes around it.
		// Otherwise we must also replace the offending characters with safe escape
		// sequences.
		rx_escapable.lastIndex = 0;
		return rx_escapable.test(string) ? "\"" + string.replace(rx_escapable,
		function(a) {
			var c = meta[a];
			return typeof c === "string" ? c: "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice( - 4);
		}) + "\"": "\"" + string + "\"";
	}

	// This variable is initialized with an empty array every time
	// JSON.stringify() is invoked and checked by the str() function. It's
	// used to keep references to object structures and capture cyclic
	// objects. Every new object is checked for its existence in this
	// array. If it's found it means the JSON object is cyclic and we have
	// to stop execution and throw a TypeError accordingly the ECMA262
	// (see NOTE 1 by the link https://tc39.es/ecma262/#sec-json.stringify).
	var seen;

	// Emulate [].includes(). It's actual for old-fashioned JScript.
	function includes(array, value) {
		var i;
		for (i = 0; i < array.length; i += 1) {
			if (value === array[i]) {
				return true;
			}
		}
		return false;
	}

	function str(key, holder) {

		// Produce a string from holder[key].
		var i; // The loop counter.
		var k; // The member key.
		var v; // The member value.
		var length;
		var mind = gap;
		var partial;
		var value = holder[key];

		// If the value has a toJSON method, call it to obtain a replacement value.
		if (value && typeof value === "object" && typeof value.toJSON === "function") {
			value = value.toJSON(key);
		}

		// If we were called with a replacer function, then call the replacer to
		// obtain a replacement value.
		if (typeof rep === "function") {
			value = rep.call(holder, key, value);
		}

		// What happens next depends on the value's type.
		switch (typeof value) {
		case "string":
			return quote(value);

		case "number":

			// JSON numbers must be finite. Encode non-finite numbers as null.
			return (isFinite(value)) ? String(value) : "null";

		case "boolean":
		case "null":

			// If the value is a boolean or null, convert it to a string. Note:
			// typeof null does not produce "null". The case is included here in
			// the remote chance that this gets fixed someday.
			return String(value);

			// If the type is "object", we might be dealing with an object or an array or
			// null.
		case "object":

			// Due to a specification blunder in ECMAScript, typeof null is "object",
			// so watch out for that case.
			if (!value) {
				return "null";
			}

			// Check the value is not circular object. Otherwise throw TypeError.
			if (includes(seen, value)) {
				throw new TypeError("Converting circular structure to JSON");
			}

			// Keep the value for the further check on circular references.
			seen.push(value);

			// Make an array to hold the partial results of stringifying this object value.
			gap += indent;
			partial = [];

			// Is the value an array?
			if (Object.prototype.toString.apply(value) === "[object Array]") {

				// The value is an array. Stringify every element. Use null as a placeholder
				// for non-JSON values.
				length = value.length;
				for (i = 0; i < length; i += 1) {
					partial[i] = str(i, value) || "null";
				}

				// Join all of the elements together, separated with commas, and wrap them in
				// brackets.
				v = partial.length === 0 ? "[]": gap ? ("[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]") : "[" + partial.join(",") + "]";
				gap = mind;
				return v;
			}

			// If the replacer is an array, use it to select the members to be stringified.
			if (rep && typeof rep === "object") {
				length = rep.length;
				for (i = 0; i < length; i += 1) {
					if (typeof rep[i] === "string") {
						k = rep[i];
						v = str(k, value);
						if (v) {
							partial.push(quote(k) + ((gap) ? ": ": ":") + v);
						}
					}
				}
			} else {

				// Otherwise, iterate through all of the keys in the object.
				for (k in value) {
					if (Object.prototype.hasOwnProperty.call(value, k)) {
						v = str(k, value);
						if (v) {
							partial.push(quote(k) + ((gap) ? ": ": ":") + v);
						}
					}
				}
			}

			// Join all of the member texts together, separated with commas,
			// and wrap them in braces.
			v = partial.length === 0 ? "{}": gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}": "{" + partial.join(",") + "}";
			gap = mind;
			return v;
		}
	}

	// If the JSON object does not yet have a stringify method, give it one.
	if (typeof JSON.stringify !== "function") {
		meta = { // table of character substitutions
			"\b": "\\b",
			"\t": "\\t",
			"\n": "\\n",
			"\f": "\\f",
			"\r": "\\r",
			"\"": "\\\"",
			"\\": "\\\\"
		};
		JSON.stringify = function(value, replacer, space) {

			// The stringify method takes a value and an optional replacer, and an optional
			// space parameter, and returns a JSON text. The replacer can be a function
			// that can replace values, or an array of strings that will select the keys.
			// A default replacer method can be provided. Use of the space parameter can
			// produce text that is more easily readable.
			var i;
			gap = "";
			indent = "";

			// If the space parameter is a number, make an indent string containing that
			// many spaces.
			if (typeof space === "number") {
				for (i = 0; i < space; i += 1) {
					indent += " ";
				}

				// If the space parameter is a string, it will be used as the indent string.
			} else if (typeof space === "string") {
				indent = space;
			}

			// If there is a replacer, it must be a function or an array.
			// Otherwise, throw an error.
			rep = replacer;
			if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
				throw new Error("JSON.stringify");
			}

			// Initialize the reference keeper.
			seen = [];

			// Make a fake root object containing our value under the key of "".
			// Return the result of stringifying the value.
			return str("", {
				"": value
			});
		};
	}

	// If the JSON object does not yet have a parse method, give it one.
	if (typeof JSON.parse !== "function") {
		JSON.parse = function(text, reviver) {

			// The parse method takes a text and an optional reviver function, and returns
			// a JavaScript value if the text is a valid JSON text.
			var j;

			function walk(holder, key) {

				// The walk method is used to recursively walk the resulting structure so
				// that modifications can be made.
				var k;
				var v;
				var value = holder[key];
				if (value && typeof value === "object") {
					for (k in value) {
						if (Object.prototype.hasOwnProperty.call(value, k)) {
							v = walk(value, k);
							if (v !== undefined) {
								value[k] = v;
							} else {
								delete value[k];
							}
						}
					}
				}
				return reviver.call(holder, key, value);
			}

			// Parsing happens in four stages. In the first stage, we replace certain
			// Unicode characters with escape sequences. JavaScript handles many characters
			// incorrectly, either silently deleting them, or treating them as line endings.
			text = String(text);
			rx_dangerous.lastIndex = 0;
			if (rx_dangerous.test(text)) {
				text = text.replace(rx_dangerous,
				function(a) {
					return ("\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice( - 4));
				});
			}

			// In the second stage, we run the text against regular expressions that look
			// for non-JSON patterns. We are especially concerned with "()" and "new"
			// because they can cause invocation, and "=" because it can cause mutation.
			// But just to be safe, we want to reject all unexpected forms.
			// We split the second stage into 4 regexp operations in order to work around
			// crippling inefficiencies in IE's and Safari's regexp engines. First we
			// replace the JSON backslash pairs with "@" (a non-JSON character). Second, we
			// replace all simple value tokens with "]" characters. Third, we delete all
			// open brackets that follow a colon or comma or that begin the text. Finally,
			// we look to see that the remaining characters are only whitespace or "]" or
			// "," or ":" or "{" or "}". If that is so, then the text is safe for eval.
			if (rx_one.test(text.replace(rx_two, "@").replace(rx_three, "]").replace(rx_four, ""))) {

				// In the third stage we use the eval function to compile the text into a
				// JavaScript structure. The "{" operator is subject to a syntactic ambiguity
				// in JavaScript: it can begin a block or an object literal. We wrap the text
				// in parens to eliminate the ambiguity.
				j = eval("(" + text + ")");

				// In the optional fourth stage, we recursively walk the new structure, passing
				// each name/value pair to a reviver function for possible transformation.
				return (typeof reviver === "function") ? walk({
					"": j
				},
				"") : j;
			}

			// If the text is not JSON parseable, then a SyntaxError is thrown.
			throw new SyntaxError("JSON.parse");
		};
	}
} ());

// JSON 定义结束
// ============

var scriptName = "Auto Color Chart";
var version = "2.21 beta";

// UI 开始
// ==========
var panelGlobal = this;
var palette = (function() {
	var myPanel = (panelGlobal instanceof Panel) ? panelGlobal: new Window("palette", scriptName + " v" + version, undefined, {
		resizeable: true,
		closeButton: true
	});
{
	// EXTRACTTAB
	// ==========
	var extractTab = myPanel.add("tabbedpanel", undefined, undefined, {
		name: "extractTab"
	});
	extractTab.alignChildren = "fill";
	extractTab.preferredSize.width = 336.797;
	extractTab.margins = 0;

	// EXTRACTTABTEXT
	// ==============
	var extractTabText = extractTab.add("tab", undefined, undefined, {
		name: "extractTabText"
	});
	extractTabText.text = "从颜色组";
	extractTabText.orientation = "column";
	extractTabText.alignChildren = ["center", "top"];
	extractTabText.spacing = 10;
	extractTabText.margins = 10;

	var ColorNameGroup = extractTabText.add("group", undefined, {
		name: "ColorNameGroup"
	});
	ColorNameGroup.orientation = "row";
	ColorNameGroup.alignChildren = ["left", "top"];
	ColorNameGroup.spacing = 10;
	ColorNameGroup.margins = 0;
	ColorNameGroup.alignment = ["left", "top"];

	var colorChartImageTxt = ColorNameGroup.add("statictext", undefined, undefined, {
		name: "colorChartImageTxt"
	});
	colorChartImageTxt.text = "色见本名称";
	colorChartImageTxt.preferredSize.width = 100;
	colorChartImageTxt.alignment = ["left", "top"];

	var Color1Disp = ColorNameGroup.add("button", undefined, undefined, {
		name: "Color1Disp"
	});
	Color1Disp.size = [15, 15];

	var Color2Disp = ColorNameGroup.add("button", undefined, undefined, {
		name: "Color2Disp"
	});
	Color2Disp.size = [15, 15];

	var Color3Disp = ColorNameGroup.add("button", undefined, undefined, {
		name: "Color3Disp"
	});
	Color3Disp.size = [15, 15];

	
	var Color4Disp = ColorNameGroup.add("button", undefined, undefined, {
		name: "Color4Disp"
	});
	Color4Disp.size = [15, 15];

	var Color5Disp = ColorNameGroup.add("button", undefined, undefined, {
		name: "Color5Disp"
	});
	Color5Disp.size = [15, 15];

	var Color6Disp = ColorNameGroup.add("button", undefined, undefined, {
		name: "Color6Disp"
	});
	Color6Disp.size = [15, 15];

	var Color7Disp = ColorNameGroup.add("button", undefined, undefined, {
		name: "Color7Disp"
	});
	Color7Disp.size = [15, 15];

	var Color8Disp = ColorNameGroup.add("button", undefined, undefined, {
		name: "Color8Disp"
	});
	Color8Disp.size = [15, 15];

	var Color9Disp = ColorNameGroup.add("button", undefined, undefined, {
		name: "Color9Disp"
	});
	Color9Disp.size = [15, 15];

	var Color10Disp = ColorNameGroup.add("button", undefined, undefined, {
		name: "Color10Disp"
	});
	Color10Disp.size = [15, 15];

	// EXTRACTGRUOP
	// ============
	var extractGruop = extractTabText.add("group", undefined, {
		name: "extractGruop"
	});
	extractGruop.orientation = "row";
	extractGruop.alignChildren = ["left", "center"];
	extractGruop.spacing = 10;
	extractGruop.margins = 0;

	var colorSlect_array = [];
	var colorSlect = extractGruop.add("listbox", undefined, undefined, {
		name: "colorSlect",
		items: colorSlect_array,
		multiselect: false,
		numberOfColumns: 2,
		columnTitles: ['序号', '颜色'],
		showHeaders: true
	});
	colorSlect.preferredSize.width = 200;
	colorSlect.preferredSize.height = 200;

	// BTNGROUP
	// ========
	var btnGroup = extractGruop.add("group", undefined, {
		name: "btnGroup"
	});
	btnGroup.orientation = "column";
	btnGroup.alignChildren = ["center", "top"];
	btnGroup.spacing = 10;
	btnGroup.margins = 0;
	btnGroup.alignment = ["left", "top"];

	var extractGruopAllBtn = btnGroup.add("button", undefined, undefined, {
		name: "extractAllBtn"
	});
	extractGruopAllBtn.text = "提取组全部";
	extractGruopAllBtn.preferredSize.width = 101;
	extractGruopAllBtn.preferredSize.height = 40;
	extractGruopAllBtn.enabled = false;


	var colorPickerBtn = btnGroup.add("button", undefined, undefined, {
		name: "BtcolorPickerBtnn0"
	});
	colorPickerBtn.text = "颜色拾取器";
	colorPickerBtn.preferredSize.width = 101;
	colorPickerBtn.preferredSize.height = 27;
	colorPickerBtn.enabled = false;

	var pickedColorDisp = btnGroup.add("button", undefined, undefined, {
		name: "Btn1"
	});
	pickedColorDisp.preferredSize.width = 101;
	pickedColorDisp.preferredSize.height = 5;
	//pickedColor.enabled = false;
	
	var Btn2 = btnGroup.add("button", undefined, undefined, {
		name: "Btn2"
	});
	Btn2.preferredSize.width = 101;
	Btn2.preferredSize.height = 21;
	Btn2.enabled = false;
	Btn2.visible = false;


	var openCategroyBtn = btnGroup.add("button", undefined, undefined, {
		name: "openCategroyBtn"
	});
	openCategroyBtn.text = "打开类型面板";
	openCategroyBtn.preferredSize.width = 101;
	openCategroyBtn.enabled = false;


	var openFileBtn = btnGroup.add("button", undefined, undefined, {
		name: "openFileBtn"
	});
	openFileBtn.text = "打开色见数据";
	openFileBtn.preferredSize.width = 101;

	/*
	// COLORPICKERTAB
	// ===========
	var colorPickerTab = extractTab.add("tab", undefined, undefined, {
		name: "colorPickerTab"
	});
	colorPickerTab.text = "吸色";
	colorPickerTab.orientation = "column";
	colorPickerTab.alignChildren = ["center", "center"];
	colorPickerTab.spacing = 10;
	colorPickerTab.margins = 10;
	var colorPickerBtn = colorPickerTab.add("button", undefined, undefined, {
		name: "colorPickerBtn"
	});
	colorPickerBtn.text = "颜色拾取器";
	colorPickerBtn.preferredSize.width = 105;
	colorPickerBtn.preferredSize.height = 40;
	var msgText = colorPickerTab.add("edittext", undefined, undefined, {
		name: "msgText"
	});
	msgText.preferredSize.width = 110;
	msgText.text = "R:     G:     B:    ";

	
	// CONFIGTAB
	// =========
	var configTab = extractTab.add("tab", undefined, undefined, {
		name: "configTab"
	});
	configTab.text = "配置";
	configTab.orientation = "row";
	configTab.alignChildren = ["left", "top"];
	configTab.spacing = 10;
	configTab.margins = 10;
*/
}
	//全局变量
	//===========
	var colorChartJson = {};
	var myWindow;
	const myBlack = [0, 0, 0];

	// 旧版JSON映射表
	const keyMappings = {
		"hi": "高光",
		"normal": "正常",
		"shadow": "阴影",
		"2nd_shadow": "2号影",
		"hi_in_shadow": "影中高光",
		"hi_in_2nd_shadow": "2号影中高光",
		"shadow_s_hi": "阴影的高光",
		"2nd_shadow_s_hi": "2号影的高光",
		"2nd_shadow_hi": "2号影的高光",
		"normal_tp": "TP线"
	};

	var userSelection = {
		extractColorMode: "仅从选中的组"
	};

	const colorDisplays = [Color1Disp, Color2Disp, Color3Disp, 
						Color4Disp, Color5Disp, Color6Disp,
						Color7Disp, Color8Disp, Color9Disp,
						Color10Disp];
	
	// 获取配置文件夹（暂未使用）
	// =======================
	function getConfigFolder() {
		var userDataFolder = Folder.userData;
		var aescriptsFolder = Folder(userDataFolder.toString() + "/AutoColorChart/Config");
		if (!aescriptsFolder.exists) {
			var checkFolder = aescriptsFolder.create();
			if (!checkFolder) {
				alert("未能创建配置文件！",scriptName);
				aescriptsFolder = Folder.temp;
			}
		}
		return aescriptsFolder.toString();
	}

	var configFolder = getConfigFolder()
	var config = {};

	// 更新配置（暂未使用）
	// =======================
	function updateConfig() {
		var configFolder = getConfigFolder()
		var file = File(configFolder + "/config.json");
		// 检查文件是否存在且不为空
		if (file.exists && file.length > 0) {
			// 打开文件以读取模式
			if (file.open("r")) {
				// 读取文件内容
				var content = file.read();
				// 将文件内容解析为一个对象
				var parsedConfig = JSON.parse(content);

				// 关闭文件
				file.close();

				// 更新config对象的值
				config["colors"] = parsedConfig["colors"];
				config["override_colors"] = parsedConfig["override_colors"];
				config["distance"] = parsedConfig["distance"];
				config["image_path"] = parsedConfig["image_path"];
				config["save_path"] = parsedConfig["save_path"];

			} else {
				alert("无法打开文件：" + file.fsName, scriptName);
			}
		}

	}
		

	// 颜色显示器按钮
	// ============
	function setColorDisp(disp, color, visible) {
		function customDraw() {
			with(this) {
				graphics.drawOSControl();
				graphics.rectPath(0, 0, size[0], size[1]);
				graphics.fillPath(fillBrush);
			}
		}
		disp.fillBrush = disp.graphics.newBrush(disp.graphics.BrushType.SOLID_COLOR, color);
		disp.onDraw = customDraw;
		disp.enabled = false;
		disp.enabled = true;
		disp.enabled = visible;
		disp.visible = visible;
	}

	// 初始化颜色显示器
	// ===============
	function initColorDisp(allDisp){
		for (var i = 0; i < colorDisplays.length; i++) {
			setColorDisp(colorDisplays[i], myBlack, false);
		}
		if (allDisp) setColorDisp(pickedColorDisp, myBlack, false);
	}

	initColorDisp(1);

	// 函数
	// =========
	// 调用AE颜色拾取器
	// ===============
	function colorPicker(startValue) {
		// 活动合成
		if (!app.project.activeItem || !(app.project.activeItem instanceof CompItem)) {
			alert("请选择一个合成!", scriptName);
			return [];
		}

		// 临时图层
		var tempLayer = app.project.activeItem.layers.addShape();
		var newColorControl = tempLayer("ADBE Effect Parade").addProperty("ADBE Color Control");
		var theColorProp = newColorControl("ADBE Color Control-0001");

		// s初始值
		if (startValue && startValue.length == 3) {
			theColorProp.setValue(startValue);
		}

		// 执行
		var editValueID = 2240 // or app.findMenuCommandId("Edit Value...");
		theColorProp.selected = true;
		app.executeCommand(editValueID);

		// 获取结果
		var result = theColorProp.value;

		// 删除临时层
		if (tempLayer) {
			tempLayer.remove();
		}
		return result;
	}

	// RGB转HEX
	// =================
	function rgbToHex(rgb) {
		var hex = [];
		for (var i = 0; i < 3; i++) {
			var val = Math.round(rgb[i] * 255);
			var hexVal = val.toString(16);
			if (hexVal.length < 2) {
				hexVal = "0" + hexVal;
			}
			hex.push(hexVal.toUpperCase());
		}
		return hex.join("");
	}

	// 查找JSON中指定颜色
	// =================
	function findColorInJson(parsedJson, color) {
		var myColorStr = JSON.stringify(color);
	
		for (var imageKey in parsedJson) {
			var colorGroups = parsedJson[imageKey];
			
			for (var groupKey in colorGroups) {
				var colors = colorGroups[groupKey];
				
				for (var colorKey in colors) {
					var colorArray = colors[colorKey];
	
					if (JSON.stringify(colorArray) === myColorStr) {
						return groupKey;
					}
				}
			}
		}
	
		return null;
	}

	// 字符串颜色数组
	// =============
	function parseColorStr(colorStr) {
		var colorArray = colorStr.slice(1, -1).split(',');
		for (var i = 0; i < colorArray.length; i++) {
			colorArray[i] = +colorArray[i] / 255;
		}
		return colorArray;
	}

	// 创建按颜色类型去色窗口
	// ====================
	function createButtonsFromJson(jsonData) {
		var myWindow = new Window("palette", "按类型取颜色", undefined);
	
		for (var imageName in jsonData) {
			var imageGroup = myWindow.add("group", undefined, imageName);
			imageGroup.orientation = "column";
			imageGroup.alignChildren = ["left", "center"]
			imageGroup.add("statictext", undefined, "提取色见 " + imageName + " 中的颜色");
			 // 添加单选按钮组
			var radioGroup = imageGroup.add("group", undefined);
			radioGroup.orientation = "row";
			radioGroup.add("statictext", undefined, "提取模式：");
			var allColorsRadio = radioGroup.add("radiobutton", undefined, "色见全部");
			var singleColorRadio = radioGroup.add("radiobutton", undefined, "仅从选中的组");
			singleColorRadio.value = true; // 默认选择"仅从选中的组"
		 
			allColorsRadio.onClick = function() { userSelection.extractColorMode = "色见全部"; }
			singleColorRadio.onClick = function() { userSelection.extractColorMode = "仅从选中的组"; }
		 
	
			var addedKeys = {}; // 用于跟踪已添加的键
			var buttonRow; // 当前行
			var buttonCount = 0; // 当前行的按钮计数
	
			for (var numberKey in jsonData[imageName]) {
				for (var itemKey in jsonData[imageName][numberKey]) {
					if (!addedKeys[itemKey]) {
						// 每3个按钮开始一个新的行
						if (buttonCount % 3 === 0) {
							buttonRow = imageGroup.add("group", undefined, {orientation: "row"});
							
						}
						var buttonText = keyMappings[itemKey] || itemKey;  // 如果没有找到映射，则使用原始键值
						var btn = buttonRow.add("button", undefined, buttonText);
						btn.preferredSize.width = 80;
						btn.preferredSize.height = 25;
						btn.onClick = function(key) { 
							return function() { 
								if(userSelection.extractColorMode === "仅从选中的组") extractOneColor(key);
								else if(userSelection.extractColorMode === "色见全部") extractAllColor(key);
								
						};
						}(itemKey);
						addedKeys[itemKey] = true;
						buttonCount++;
					}
				}
			}
		}
		
		myWindow.center();
		myWindow.show();
		return myWindow;

	}
	
	// 提取选择组中单一指定颜色
	// ===============
	function extractOneColor(colorType) {
		if(!app.project.activeItem) {alert("请打开一个合成", scriptName); return;}
		var selectedLayers = app.project.activeItem.selectedLayers;
		var newLayer;
		if (selectedLayers.length > 0) {
			var selectedItems = colorSlect.selection;
			if (!selectedItems) {
				alert("请在列表中选择一项.", scriptName);
				return;
			}

			if (! (selectedItems instanceof Array)) {
				selectedItems = [selectedItems];
			}

			for (var i = 0; i < selectedLayers.length; i++) {
				var originalLayer = selectedLayers[i];
				newLayer = originalLayer.duplicate();
				var colorEffect = newLayer.property("Effects").addProperty("Color Keep");

				for (var j = 0; j < selectedItems.length; j++) {
					var selectedColorText = selectedItems[j].subItems[0].text;
					var colorParts = selectedColorText.split(";");

					var color;

					for (var k = 0; k < colorParts.length; k++) {
						var parts = colorParts[k].split(":");
						if (parts[0] === colorType) {
							color = parts[1];
							try {
								colorEffect.property(1).setValue(1);
								colorEffect.property(2).setValue(parseColorStr(color));
							} catch(e) {
								alert("提取颜色时出错: " + e, scriptName);
							}
						}
					}

				}
			}
		} else {
			alert("请至少选择一个图层！", scriptName);
		}
		return newLayer
	}
	
	// 提取色见全部指定颜色
	// ===============
	function extractAllColor(colorType) {
		var selectedLayers = app.project.activeItem.selectedLayers;
		var newLayer;
		if (selectedLayers.length > 0) {
			try {
				var resultArray = [];
				for (var key in colorChartJson) {
					var innerObj = colorChartJson[key];
					for (var innerKey in innerObj) {
						if (innerObj[innerKey].hasOwnProperty(colorType)) {
							var colorArray = innerObj[innerKey][colorType];
							for (var i = 0; i < colorArray.length; i++) {
								colorArray[i] = colorArray[i] / 255;
							}
							resultArray.push(colorArray);
						}
					}
				}
			

				for (var j = 0; j < selectedLayers.length; j++) {
					var originalLayer = selectedLayers[j];
					newLayer = originalLayer.duplicate();
					var colorEffect = newLayer.property("Effects").addProperty("Color Keep");
					for (var i = 0; i < resultArray.length; i++) {
						colorEffect.property(1).setValue(resultArray.length);
						colorEffect.property(i + 2).setValue(resultArray[i]);
					}
				}

			} catch(e) {
				alert(e);
			}
		} else alert("请至少选择一个图层！", scriptName); 
		return newLayer;
	}

	// 解析 XML 返回 JSON
	// =================
	function parseXMLtoJSON(xmlData) {
    var jsonData = {};
    var imageList = xmlData.image;
    for (var i = 0; i < imageList.length(); i++) {
        var image = imageList[i];
        var imageName = image.@name.toString();
        jsonData[imageName] = {};

        var groupList = image.group;
        for (var j = 0; j < groupList.length(); j++) {
            var group = groupList[j];
            var groupId = group.@id.toString();
            jsonData[imageName][groupId] = {};

            var colorList = group.color;
            for (var k = 0; k < colorList.length(); k++) {
                var color = colorList[k];
                var colorType = color.@colorType.toString();
                jsonData[imageName][groupId][colorType] = [
                    parseInt(color.@r.toString()),
                    parseInt(color.@g.toString()),
                    parseInt(color.@b.toString())
                ];
            }
        }
    }
    return jsonData;
	}

	// 颜色拾取器单击事件
	// =================
	colorPickerBtn.onClick = function() {
		
		var myColor = colorPicker([1, 0, 0]);
		// var color1 = "R: " + Math.round(myColor[0] * 255).toString() + " G: " + Math.round(myColor[1] * 255).toString() + " B: " + Math.round(myColor[2] * 255).toString() + "\n";
		// msgText.text = String(color1);
		var myColorN = [Math.round(myColor[0] * 255), Math.round(myColor[1] * 255), Math.round(myColor[2] * 255)];
		setColorDisp(pickedColorDisp, myColor, true);

		try {
			var groupNumber = findColorInJson(colorChartJson, myColorN);
			if (groupNumber != null) {
				colorSlect.selection = null;
				colorSlect.selection = colorSlect.find(groupNumber.toString());
				
			} else {
				alert("未找到指定颜色，请检查色见数据内容。", scriptName);
			}

		} catch(e) {
			alert(e, scriptName);
		}
	}

	// 列表选择事件
	// ===========
	colorSlect.onChange = function() {
		function parseColor(color) {
			var colorArray = color.slice(1, -1).split(',');
			for (var i = 0; i < colorArray.length; i++) {
				colorArray[i] = +colorArray[i] / 255;
			}
			return colorArray;
		}
	
		var selectedItems = colorSlect.selection;
		if (!selectedItems) return;
		if (!(selectedItems instanceof Array)) {
			selectedItems = [selectedItems];
		}
	
		var selectedColorText = selectedItems[0].subItems[0].text;
		var colorParts = selectedColorText.split(";");
	
		// 重置所有颜色显示器
		initColorDisp(0);
	
		// 设置新的颜色
		for (var i = 0; i < colorParts.length && i < colorDisplays.length; i++) {
			var parts = colorParts[i].split(":");
			var color = parseColor(parts[1]);
			setColorDisp(colorDisplays[i], color, true);
		}
	}
	
	// 打开按钮单击事件
	// ===============
	openFileBtn.onClick = function() {
		if(typeof myWindow == 'object') myWindow.close()
		var file = File.openDialog("请打开色见数据文件", "JSON Files:*.json;XML Files:*.xml");
		if (file !== null) {
			var fileNameArray = file.name.toLowerCase().split('.');
			var fileExtension = fileNameArray[fileNameArray.length - 1];

			file.open('r');
			var content = file.read();
			file.close();

			if (fileExtension === 'json') {
				// 解析 JSON 文件
				colorChartJson = JSON.parse(content);
				// 启用相应的按钮
				openCategroyBtn.enabled = true;
				colorPickerBtn.enabled = true;
				extractGruopAllBtn.enabled = true;
			} else if (fileExtension === 'xml') {
				// 解析 XML 文件
				var xmlData = new XML(content);
				colorChartJson = parseXMLtoJSON(xmlData);
				// 启用相应的按钮
				openCategroyBtn.enabled = true;
				colorPickerBtn.enabled = true;
				extractGruopAllBtn.enabled = true;
			} else {
				alert('无效的文件类型。请选择 JSON 或 XML 文件。', scriptName);
			}
		}
		myWindow = createButtonsFromJson(colorChartJson);
		// 更新 colorChartImageTxt.text
		for (var key in colorChartJson) {
			colorChartImageTxt.text = key;
			imputImage = key;
			break; // 只取第一个 key 图片名称
		}

		// 更新 listbox
		colorSlect.removeAll(); // 清除原有列表
		for (var key in colorChartJson) {
			var colorInfo = colorChartJson[key];
			for (var group in colorInfo) {
				var colors = colorInfo[group];
				var colorStr = "";
				for (var colorName in colors) {
					var colorItem = colors[colorName];
					//colorName = colorName.charAt(0).toUpperCase() + colorName.slice(1);  // 将首字母大写
					colorStr += colorName + ':[' + colorItem.toString() + '];';
				}
				var item = colorSlect.add('item', group);
				item.subItems[0].text = colorStr; // 'Color' 列
			}
		}
	};
	
	openCategroyBtn.onClick = function(){
		createButtonsFromJson(colorChartJson);
	}

	// 提取全部组按钮单击事件
	// =====================
	extractGruopAllBtn.onClick = function() {
		var selectedLayers = app.project.activeItem.selectedLayers;
		if (selectedLayers.length > 0) {
			for (var i = 0; i < selectedLayers.length; i++) {
				var originalLayer = selectedLayers[i];
				var selectedItems = colorSlect.selection;
	
				if (!selectedItems) {
					alert("请在列表中选择一项。", scriptName);
					return;
				}
	
				if (!(selectedItems instanceof Array)) {
					selectedItems = [selectedItems];
				}
	
				var newLayer = originalLayer.duplicate();
				var colorEffect = newLayer.property("Effects").addProperty("Color Keep");
	
				for (var j = 0; j < selectedItems.length; j++) {
					var selectedItem = selectedItems[j];
					if (!selectedItem || !selectedItem.subItems || selectedItem.subItems.length === 0) {
						continue; // 跳过无效的选项
					}
	
					var selectedColorText = selectedItem.subItems[0].text;
					var colorParts = selectedColorText.split(";");
	
					try {
						colorEffect.property(1).setValue(colorParts.length - 1);
	
						for (var k = 0; k < colorParts.length; k++) {
							var parts = colorParts[k].split(":");
							if (parts.length < 2) {
								continue; // 跳过无效的颜色部分
							}
							var colorArray = parts[1].slice(1, -1).split(',');
	
							for (var l = 0; l < colorArray.length; l++) {
								colorArray[l] = +colorArray[l] / 255;
							}
							colorEffect.property(k + 2).setValue(colorArray);
						}
	
					} catch(e) {
						alert(e);
					}
				}
			}
		} else {
			alert("请选择至少一个图层!", scriptName);
		}
	}
	
	// UI 结束
	// ==========
	myPanel.layout.layout(true);
	myPanel.layout.resize();
	myPanel.onResizing = myPanel.onResize = function() {
		this.layout.resize()
	}
	if (myPanel instanceof Window) myPanel.show();
	return myPanel;
} ())
