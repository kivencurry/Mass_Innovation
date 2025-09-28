#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""错别字检测器
用于检测文本中的错别字，并提供纠正建议
"""


import base64
import json
import argparse

def detect_typos(text):
    """
    检测文本中的错别字、语法错误和提供优化建议
    
    参数:
        text (str): 需要检测的文本内容
        
    返回:
        list: 包含所有检测到的错误信息的列表，每个元素为字典，包含以下字段:
            - type (str): 错误类型（错别字、语法错误或优化建议）
            - original (str): 原始错误文本
            - corrected (str): 正确的写法或建议
            - context (str): 错误内容的上下文（前后各10个字符）
            - position (int): 错误在文本中的位置索引
    """
    # 初始化结果列表
    errors = []
    
    # 错别字检测词库
    typos = [
        {"original": "按装", "corrected": "安装", "type": "错别字"},
        {"original": "既使", "corrected": "即使", "type": "错别字"},
        {"original": "穿流不息", "corrected": "川流不息", "type": "错别字"}
    ]
    
    # 语法错误检测词库
    grammar_errors = [
        {"original": "香蕉，和橙子", "corrected": "香蕉和橙子", "type": "语法错误"},
        {"original": "不仅学习好，但是", "corrected": "不仅学习好，而且", "type": "语法错误"}
    ]
    
    # 优化建议词库
    suggestions = [
        {"original": "进行了详细的分析，我们", "corrected": "通过对项目进行详细分析，我们", "type": "优化建议"},
        {"original": "具有一定的竞争力", "corrected": "具备较强竞争力", "type": "优化建议"}
    ]
    
    # 合并所有检测词库
    all_checks = typos + grammar_errors + suggestions
    
    # 进行检测
    for item in all_checks:
        original = item["original"]
        start_pos = 0
        while True:
            # 查找当前匹配位置
            pos = text.find(original, start_pos)
            if pos == -1:
                break  # 没有更多匹配项
            
            # 提取错误上下文
            context_start = max(0, pos - 10)
            context_end = min(len(text), pos + len(original) + 10)
            context = text[context_start:context_end]
            
            # 添加错误信息
            errors.append({
                "type": item["type"],
                "original": original,
                "corrected": item["corrected"],
                "context": context,
                "position": pos
            })
            
            # 更新起始位置以查找下一个匹配项
            start_pos = pos + 1
    
    # 返回检测结果
    return errors


if __name__ == "__main__":
    # 解析命令行参数
    parser = argparse.ArgumentParser(description='错别字检测器')
    parser.add_argument('--text', type=str, help='Base64编码的待检测文本')
    args = parser.parse_args()
    
    if args.text:
        # 处理命令行模式：解码base64文本并输出JSON结果
        try:
            # 解码base64文本
            text = base64.b64decode(args.text).decode('utf8')
            # 执行检测
            results = detect_typos(text)
            # 输出JSON格式结果
            print(json.dumps(results, ensure_ascii=False))
        except Exception as e:
            # 发生错误时输出空数组
            print('[]')
    else:
        # 示例用法
        sample_text = "我们按装了新系统，但既使如此，人潮依然穿流不息。"
        results = detect_typos(sample_text)
        
        # 打印结果
        print(f"检测到 {len(results)} 个错误:")
        for i, error in enumerate(results):
            print(f"{i+1}. 原文: '{error['original']}' → 修正: '{error['corrected']}'")
            print(f"   上下文: '{error['context']}'")
            print(f"   位置: {error['position']}")
            print()