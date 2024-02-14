import json
from PIL import Image, ImageDraw, ImageFont
from skimage.measure import label, regionprops
import numpy as np
import random
import os

# 颜色框的线颜色
box_color_main = (243, 24, 133)
#box_color_main = (255, 0, 255)
#box_color_sec = (0, 0, 255)
# box_color_main = (250, 0, 142)
# box_color_sec = (243, 24, 133)
box_color_sec = (22, 47, 204)
# box_color_sec = (0, 12, 250)

line_width = 3
# 需要提取的颜色
colors_to_extract = [box_color_main, box_color_sec]

input_img = "normal/001_002_02.png"

line_width -= 1
def extract_colors(input_file, output_file, colors):
    # 提取指定颜色的像素点
    image = Image.open(input_file).convert("RGBA")
    width, height = image.size
    new_image = Image.new("RGBA", (width, height), (0, 0, 0, 0))

    for y in range(height):
        for x in range(width):
            current_color = image.getpixel((x, y))
            if current_color[:3] in colors:
                new_image.putpixel((x, y), current_color)
    new_image.save(output_file)


def replace_color(image_path, colors_to_replace, new_color):
    img = Image.open(image_path)
    img = img.convert("RGBA")

    d = img.getdata()

    new_image = []
    for item in d:
        # 如果像素是完全透明的，就跳过它
        if item[3] == 0:
            new_image.append(item)
            continue

        # 如果不透明，并且颜色在要替换的列表里，就替换颜色
        if item[:3] in colors_to_replace:
            new_image.append(new_color + (item[3],))  # 保持原始的 alpha 值
        else:
            new_image.append(item)

    img.putdata(new_image)
    img.save("_output.png")


def find_box_mark_colors(input_file, output_file, original_file, target_color):
    # 查找标记颜色框的位置和颜色
    image = Image.open(input_file).convert("RGBA")
    width, height = image.size
    new_image = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    original_image0 = Image.open(original_file).convert("RGBA")
    original_image = Image.open(original_file).convert("RGB")
    height, width, _ = np.array(image).shape
    foreground = np.all(np.array(image)[:, :, :3] != target_color, axis=-1)

    labels = label(foreground)
    draw = ImageDraw.Draw(image)
    drawN = ImageDraw.Draw(new_image)
    # fontT = "PingFang.ttc"
    # font = ImageFont.truetype(fontT, 15)

    rectangles = []
    center_colors = []
    for region in regionprops(labels):
        center = region.centroid
        color_center = original_image0.getpixel((int(center[1]), int(center[0])))
        if color_center != (255, 255, 255, 255) and color_center != (0, 0, 0, 0):
            draw.ellipse((center[1] + 35, center[0] - 10, center[1] + 50, center[0] + 5), fill=color_center)
            center_colors.append(color_center)
        # 寻找四个方向上的边界坐标
        directions = [(0, -1), (0, 1), (-1, 0), (1, 0)]  # 上、下、左、右
        boundary_coordinates = []

        for dx, dy in directions:
            x, y = int(center[1]), int(center[0])
            while 0 <= x < width and 0 <= y < height:
                current_color = image.getpixel((x, y))
                if current_color[:3] == target_color:
                    boundary_coordinates.append((x, y))
                    break
                x += dx
                y += dy


        # 寻找通过边界坐标的矩形
        min_x = min(coord[0] for coord in boundary_coordinates)
        max_x = max(coord[0] for coord in boundary_coordinates)
        min_y = min(coord[1] for coord in boundary_coordinates)
        max_y = max(coord[1] for coord in boundary_coordinates)

        # 绘制并填充矩形的随机颜色
        # draw.rectangle([(min_x, min_y), (max_x, max_y)], outline="blue", fill=random_color1)

        # 存储矩形的详细信息
        rectangles.append(((min_x, min_y), (max_x, max_y), center, color_center))

        box_names = []
        color_match = {}

        # 重新绘制矩形和中心点，如果中心点位于矩形内部
        for rectangle in rectangles:
            (min_x, min_y), (max_x, max_y), center, color_center = rectangle

            # 如果中心点位于矩形内部
            if min_x <= center[1] <= max_x and min_y <= center[0] <= max_y:

                # 标记中心点
                draw.point((center[1], center[0]), fill="red")

                # 标记矩形顶点
                vertices = [(min_x - 1, min_y - 1), (max_x + 1, min_y - 1), (min_x - 1, max_y + 1),
                            (max_x + 1, max_y + 1)]
                for vertex in vertices:
                    random_color3 = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
                    draw.point(vertex, fill=random_color3)

                # 矩形的坐标
                top_left, top_right, bottom_left, bottom_right = (min_x - line_width, min_y - line_width), (max_x + line_width, min_y - line_width), (
                    min_x - line_width, max_y + line_width), (max_x + line_width, max_y + line_width)

                top_left = (top_left[0], top_left[1] - 1)
                top_right = (top_right[0], top_right[1] - 1)
                bottom_left = (bottom_left[0], bottom_left[1] + 1)
                bottom_right = (bottom_right[0], bottom_right[1] + 1)

                if (original_image.getpixel((top_left[0], top_left[1])) != box_color_main and original_image.getpixel(
                        (top_right[0], top_right[1])) == box_color_main and original_image.getpixel(
                    (bottom_left[0], bottom_left[1])) == box_color_main and original_image.getpixel(
                    (bottom_right[0], bottom_right[1])) == box_color_main):
                    box_name = "normal"

                elif original_image.getpixel((top_left[0], top_left[1])) != box_color_main and original_image.getpixel(
                        (top_right[0], top_right[1])) != box_color_main and original_image.getpixel(
                    (bottom_left[0], bottom_left[1])) != box_color_main and original_image.getpixel(
                    (bottom_right[0], bottom_right[1])) == box_color_main:
                    box_name = "hi"

                elif original_image.getpixel((top_left[0], top_left[1])) == box_color_main and original_image.getpixel(
                        (top_right[0], top_right[1])) == box_color_main and original_image.getpixel(
                    (bottom_left[0], bottom_left[1])) == box_color_main and original_image.getpixel(
                    (bottom_right[0], bottom_right[1])) == box_color_main:
                    box_name = "shadow"

                elif original_image.getpixel((top_left[0], top_left[1])) == box_color_main and original_image.getpixel(
                        (top_right[0], top_right[1])) == box_color_main and original_image.getpixel(
                    (bottom_left[0], bottom_left[1])) != box_color_main and original_image.getpixel(
                    (bottom_right[0], bottom_right[1])) != box_color_main:
                    box_name = "2nd_shadow"

                elif (original_image.getpixel((top_left[0], top_left[1])) != box_color_sec and original_image.getpixel(
                        (top_right[0], top_right[1])) == box_color_sec and original_image.getpixel(
                    (bottom_left[0], bottom_left[1])) == box_color_sec and original_image.getpixel(
                    (bottom_right[0], bottom_right[1])) == box_color_sec):
                    box_name = "normal"

                elif original_image.getpixel((top_left[0], top_left[1])) == box_color_sec and original_image.getpixel(
                        (top_right[0], top_right[1])) == box_color_sec and original_image.getpixel(
                    (bottom_left[0], bottom_left[1])) == box_color_sec and original_image.getpixel(
                    (bottom_right[0], bottom_right[1])) == box_color_sec:
                    box_name = "shadow"

                elif original_image.getpixel((top_left[0], top_left[1])) == box_color_sec and original_image.getpixel(
                        (top_right[0], top_right[1])) == box_color_sec and original_image.getpixel(
                    (bottom_left[0], bottom_left[1])) != box_color_sec and original_image.getpixel(
                    (bottom_right[0], bottom_right[1])) != box_color_sec:
                    box_name = "2nd_shadow"

                elif original_image.getpixel((top_left[0], top_left[1])) != box_color_sec and original_image.getpixel(
                        (top_right[0], top_right[1])) != box_color_sec and original_image.getpixel(
                    (bottom_left[0], bottom_left[1])) != box_color_sec and original_image.getpixel(
                    (bottom_right[0], bottom_right[1])) == box_color_sec:
                    box_name = "hi"

                else:
                    box_name = "unknown"

                if color_center != (255, 255, 255, 255):
                    draw.text((center[1] + 52, center[0] - 10), box_name, fill="black")
                    draw.text((center[1] + 50, center[0]), str(color_center), fill=color_center)

                    box_names.append(box_name)
                    color_match[center] = (box_name, color_center)
                # print(color_match)

    # 检查框是否相邻并分组
    def is_adjacent(rectangle, rectangle_list, x_threshold):
        ((min_x1, min_y1), (max_x1, max_y1), center1, color_center1) = rectangle
        for rectangle2 in rectangle_list:
            ((min_x2, min_y2), (max_x2, max_y2), center2, color_center2) = rectangle2
            # 计算x坐标的差值
            x_min_diff = abs(min_x1 - min_x2)
            x_max_diff = abs(max_x1 - max_x2)
            x1_diff = abs(min_x1 - max_x2)
            x2_diff = abs(max_x1 - min_x2)
            if (abs((max_y1 + line_width) - (min_y2 - line_width)) == line_width or abs(
                    (max_y2 + line_width) - (min_y1 - line_width)) == line_width) and x_min_diff <= x_threshold and x_max_diff < x_threshold:
                return True
            elif (abs((min_y1 + line_width) - (min_y2 - line_width)) < 10 or abs((min_y2 + line_width) - (min_y1 - line_width)) < 10) and (x1_diff < 10 or x2_diff < 10):

                return True
        return False

    # (min_x, min_y)：左上角的顶点，也就是x坐标和y坐标都最小的点。
    # (max_x, min_y)：右上角的顶点，也就是x坐标最大，y坐标最小的点。
    # (min_x, max_y)：左下角的顶点，也就是x坐标最小，y坐标最大的点。
    # (max_x, max_y)：右下角的顶点，也就是x坐标和y坐标都最大的点。

    def group_adjacent(rectangles):
        groups = []
        while rectangles:  # 循环直到所有矩形都被分组
            rectangle = rectangles.pop(0)  # 取出第一个矩形
            found_group = False
            for group in groups:
                if is_adjacent(rectangle, group, 40):
                    group.append(rectangle)
                    found_group = True
                    break
            if not found_group:
                groups.append([rectangle])  # 以该矩形开始一个新的分组
        return groups

    box_groups = group_adjacent(rectangles)
    group = {}

    for i, box_group in enumerate(box_groups):
        group_color = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
        for rectangle in box_group:
            ((min_x, min_y), (max_x, max_y), center, color_center) = rectangle
            drawN.rectangle([(min_x, min_y), (max_x, max_y)], outline=group_color, fill=group_color)
            # 在矩形中心添加分组编号
            group_number = str(i)
            if i != 0:
                draw.text((min_x, min_y), group_number, fill='black')
                group[center] = (group_number, color_center)

    # 保存图像
    image.save(output_file)
    # new_image.save("colorRange.png")
    os.remove("_output.png")

    return group, color_match


extract_colors(input_img, "_output.png", colors_to_extract)
replace_color("_output.png", [box_color_sec, box_color_main], (243, 24, 133))

group, color_match = find_box_mark_colors("_output.png", "output_marked.png", input_img, (243, 24, 133))
# print(group)
common_keys = set(group.keys()) & set(color_match.keys())
for key in common_keys:
    color_match[key] = (color_match[key], group[key][0])

_json_color_chart = {}
for key, value in color_match.items():
    group = value[0][0]
    color = value[0][1]
    label = value[1]

    if label not in _json_color_chart:
        _json_color_chart[label] = {}

    _json_color_chart[label][group] = color

# 如果一个组中只有两个元素，且其中包含 'normal' 和'2nd_shadow'，将'2nd_shadow'替换为 'shadow'
for group, colors in _json_color_chart.items():
    if len(colors) == 1 and 'unknown' in colors:
        colors['normal'] = colors.pop('unknown')
    if len(colors) == 2 and 'unknown' in colors and '2nd_shadow' in colors:
        colors['normal'] = colors.pop('unknown')
        colors['shadow'] = colors.pop('2nd_shadow')
    if len(colors) == 3 and 'hi' in colors and 'normal' in colors and '2nd_shadow' in colors:
        colors['shadow'] = colors.pop('2nd_shadow')
    if len(colors) == 3 and 'unknown' in colors and 'normal' in colors and '2nd_shadow' in colors:
        colors['hi'] = colors.pop('unknown')
        colors['normal'] = colors.pop('normal')
        colors['2nd_shadow'] = colors.pop('shadow')
    if len(colors) == 3 and 'unknown' in colors and 'shadow' in colors and '2nd_shadow' in colors:
        colors['normal'] = colors.pop('unknown')
        colors['shadow'] = colors.pop('shadow')
        colors['2nd_shadow'] = colors.pop('2nd_shadow')

    if len(colors) == 4 and 'hi' in colors and 'normal' in colors and 'shadow' in colors and 'unknown' in colors:
        colors['2nd_shadow'] = colors.pop('unknown')
    if len(colors) == 4 and 'unknown' in colors and 'normal' in colors and 'shadow' in colors and '2nd_shadow' in colors:
        colors['hi'] = colors.pop('unknown')
        colors['normal'] = colors.pop('normal')
        colors['shadow'] = colors.pop('shadow')
        colors['2nd_shadow'] = colors.pop('2nd_shadow')
    if len(colors) == 4 and 'unknown' in colors and 'normal' in colors and 'shadow' in colors and '2nd_shadow' in colors:
        colors['hi'] = colors.pop('unknown')
        colors['normal'] = colors.pop('normal')
        colors['shadow'] = colors.pop('shadow')
        colors['2nd_shadow'] = colors.pop('2nd_shadow')

json_color_chart = {}
img_str = os.path.basename(input_img)
json_color_chart[str(img_str)] = _json_color_chart

new_json_color_chart = {}
for image_name, color_data in json_color_chart.items():
    new_color_data = {}
    for key, value in color_data.items():
        if not isinstance(key, tuple):
            new_color_data[key] = value
    new_json_color_chart[image_name] = new_color_data

# print(new_json_color_chart)

""""
with open('encrypted_data.cta', 'w') as file:
    file.write(encrypted_data)
"""
fileName = 'data/color_chart_'
file_name = fileName + str(img_str)
json_file_name = file_name + '.json'
with open(json_file_name, 'w', encoding='utf-8') as f:
    json.dump(new_json_color_chart, f, ensure_ascii=True)

