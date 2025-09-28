/*
 * DocumentGuard 高亮修复模块
 * 解决点击采纳后文本替换导致无法再标黄的问题
 */

(function() {
    console.log('DocumentGuard 高亮修复模块：开始加载...');
    
    // 存储文本替换历史，用于映射替换后的文本与原始文本
    const replacementHistory = new Map();
    // 存储高亮状态
    let activeHighlightedElements = new Set();
    
    // 初始化函数
    function initHighlightFix() {
        console.log('DocumentGuard 高亮修复模块：初始化开始');
        
        // 增强document-content的点击处理
        enhanceContentClickHandling();
        
        // 监听DOM变化，捕获新增的错误卡片
        observeDocumentChanges();
        
        // 尝试覆盖现有的文本替换函数
        overrideTextReplacementFunctions();
        
        console.log('DocumentGuard 高亮修复模块：初始化完成');
    }
    
    // 增强内容区域的点击处理
    function enhanceContentClickHandling() {
        const documentContent = document.getElementById('document-content');
        if (!documentContent) {
            console.warn('DocumentGuard 高亮修复模块：未找到document-content元素');
            // 延迟重试
            setTimeout(enhanceContentClickHandling, 500);
            return;
        }
        
        // 添加点击事件监听器，使用捕获模式确保优先处理
        documentContent.addEventListener('click', function(e) {
            // 避免与其他点击事件冲突
            if (e.target.closest('.adopt-suggestion-btn')) return;
            
            // 获取点击的段落或文本块
            const clickedElement = findTextContainer(e.target);
            if (!clickedElement) return;
            
            // 检查点击的段落是否包含替换后的文本
            const text = clickedElement.textContent;
            const matchedReplacements = findMatchedReplacements(text);
            
            if (matchedReplacements.length > 0) {
                console.log('DocumentGuard 高亮修复模块：检测到点击包含替换文本的段落');
                
                // 移除所有现有高亮
                clearAllHighlights();
                
                // 高亮包含替换文本的段落
                highlightElement(clickedElement);
                
                // 尝试找到对应的错误卡片并高亮
                matchedReplacements.forEach(({ originalText, correctedText }) => {
                    highlightErrorCard(originalText, correctedText);
                });
            }
        }, true);
    }
    
    // 查找文本容器元素（p、div等）
    function findTextContainer(element) {
        let current = element;
        while (current && current !== document.body) {
            // 检查是否是文本容器元素
            if (['P', 'DIV', 'SPAN', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI'].includes(current.tagName) && 
                current.textContent.trim().length > 0) {
                return current;
            }
            current = current.parentElement;
        }
        return null;
    }
    
    // 在文本中查找匹配的替换记录
    function findMatchedReplacements(text) {
        const results = [];
        replacementHistory.forEach((originalText, correctedText) => {
            if (text.includes(correctedText)) {
                results.push({ originalText, correctedText });
            }
        });
        return results;
    }
    
    // 高亮元素
    function highlightElement(element) {
        if (!element) return;
        
        // 保存原始样式，以便后续恢复
        if (!element._originalStyle) {
            element._originalStyle = {
                backgroundColor: element.style.backgroundColor,
                padding: element.style.padding,
                borderRadius: element.style.borderRadius
            };
        }
        
        // 应用高亮样式（黄色背景）
        element.style.backgroundColor = '#fffbeb'; // 浅黄色背景
        element.style.padding = '4px 8px';
        element.style.borderRadius = '4px';
        
        // 添加到活动高亮元素集合
        activeHighlightedElements.add(element);
        
        // 添加动画效果
        element.classList.add('transition-all', 'duration-200');
    }
    
    // 高亮对应的错误卡片
    function highlightErrorCard(originalText, correctedText) {
        // 查找包含匹配原始文本的错误卡片
        const errorCards = document.querySelectorAll('.error-content-card');
        errorCards.forEach(card => {
            const cardText = card.textContent;
            // 匹配原始文本或编码后的原始文本
            if (cardText.includes(originalText) || cardText.includes(encodeURIComponent(originalText))) {
                if (!card._originalBgColor) {
                    card._originalBgColor = card.style.backgroundColor;
                }
                
                // 应用高亮样式
                card.style.backgroundColor = '#fef3c7'; // 深黄色背景
                
                // 添加到活动高亮元素
                activeHighlightedElements.add(card);
                
                // 添加动画效果
                card.classList.add('transition-all', 'duration-200');
                
                // 滚动到错误卡片
                setTimeout(() => {
                    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
        });
    }
    
    // 清除所有高亮
    function clearAllHighlights() {
        activeHighlightedElements.forEach(element => {
            // 恢复原始样式
            if (element._originalStyle) {
                element.style.backgroundColor = element._originalStyle.backgroundColor;
                element.style.padding = element._originalStyle.padding;
                element.style.borderRadius = element._originalStyle.borderRadius;
            } else if (element._originalBgColor) {
                element.style.backgroundColor = element._originalBgColor;
            }
        });
        
        // 清空集合
        activeHighlightedElements.clear();
    }
    
    // 监听DOM变化
    function observeDocumentChanges() {
        const documentContent = document.getElementById('document-content');
        if (!documentContent) {
            setTimeout(observeDocumentChanges, 500);
            return;
        }
        
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                // 检查是否有新的文本节点被添加
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
                            // 这里可以添加逻辑来检测新添加的文本是否包含替换后的文本
                        }
                    });
                }
            });
        });
        
        observer.observe(documentContent, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }
    
    // 覆盖现有的文本替换函数，记录替换历史
    function overrideTextReplacementFunctions() {
        // 保存原始替换函数引用
        const originalForceReplaceText = window.forceReplaceText;
        
        // 创建新的替换函数，增加历史记录功能
        window.enhancedReplaceText = function(sourceText, targetText, isAdopted) {
            console.log('DocumentGuard 高亮修复模块：记录文本替换历史:', sourceText, '->', targetText);
            
            // 记录替换历史（使用Map，键为替换后的文本，值为原始文本）
            if (isAdopted) {
                // 采纳状态：原始文本 -> 纠正文本
                replacementHistory.set(targetText, sourceText);
            } else {
                // 回退状态：纠正文本 -> 原始文本
                replacementHistory.delete(sourceText);
            }
            
            // 调用原始替换函数执行实际替换
            if (typeof originalForceReplaceText === 'function') {
                return originalForceReplaceText(sourceText, targetText);
            } else {
                // 如果没有原始替换函数，执行默认替换
                return defaultReplaceText(sourceText, targetText);
            }
        };
        
        // 默认文本替换函数
        function defaultReplaceText(sourceText, targetText) {
            const documentContent = document.getElementById('document-content');
            if (!documentContent) return false;
            
            try {
                let html = documentContent.innerHTML;
                if (html.includes(sourceText)) {
                    html = html.replace(sourceText, targetText);
                    documentContent.innerHTML = html;
                    return true;
                }
                return false;
            } catch (e) {
                console.error('DocumentGuard 高亮修复模块：默认替换失败:', e);
                return false;
            }
        }
        
        // 尝试增强现有按钮的点击处理
        setTimeout(() => {
            enhanceExistingAdoptButtons();
        }, 1000);
    }
    
    // 增强现有的采纳按钮
    function enhanceExistingAdoptButtons() {
        const buttons = document.querySelectorAll('.adopt-suggestion-btn');
        console.log('DocumentGuard 高亮修复模块：找到', buttons.length, '个采纳按钮，尝试增强');
        
        buttons.forEach(btn => {
            if (btn.classList.contains('highlight-fix-enhanced')) return;
            btn.classList.add('highlight-fix-enhanced');
            
            // 克隆按钮以移除现有事件监听器
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            // 添加增强版点击事件
            newBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const encodedOriginalText = this.getAttribute('data-original');
                const encodedCorrectedText = this.getAttribute('data-corrected');
                
                // HTML解码
                function htmlDecode(str) {
                    if (!str) return '';
                    const doc = new DOMParser().parseFromString(str, 'text/html');
                    return doc.documentElement.textContent;
                }
                
                const originalText = htmlDecode(encodedOriginalText);
                const correctedText = htmlDecode(encodedCorrectedText);
                const isAdopted = this.getAttribute('data-adopted') === 'true';
                
                const sourceText = isAdopted ? correctedText : originalText;
                const targetText = isAdopted ? originalText : correctedText;
                
                // 使用增强版替换函数
                const success = window.enhancedReplaceText(sourceText, targetText, !isAdopted);
                
                if (success) {
                    // 更新按钮状态
                    const newAdoptedState = !isAdopted;
                    this.setAttribute('data-adopted', newAdoptedState);
                    
                    // 更新按钮文本和样式
                    if (newAdoptedState) {
                        this.textContent = '回退';
                        this.classList.remove('bg-green-50', 'text-green-700', 'border-green-200', 'hover:bg-green-100');
                        this.classList.add('bg-amber-50', 'text-amber-700', 'border-amber-200', 'hover:bg-amber-100');
                    } else {
                        this.textContent = '采纳';
                        this.classList.remove('bg-amber-50', 'text-amber-700', 'border-amber-200', 'hover:bg-amber-100');
                        this.classList.add('bg-green-50', 'text-green-700', 'border-green-200', 'hover:bg-green-100');
                    }
                    
                    // 触发input事件
                    setTimeout(() => {
                        const contentDiv = document.getElementById('document-content');
                        if (contentDiv) {
                            const event = new Event('input', { bubbles: true });
                            contentDiv.dispatchEvent(event);
                        }
                    }, 100);
                }
            }, true);
        });
    }
    
    // 暴露API供外部调用
    window.documentGuardHighlightFix = {
        init: initHighlightFix,
        clearHighlights: clearAllHighlights,
        getReplacementHistory: () => new Map(replacementHistory)
    };
    
    // 启动初始化
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initHighlightFix);
        } else {
            setTimeout(initHighlightFix, 100);
        }
    }
    
    console.log('DocumentGuard 高亮修复模块：加载完成，等待初始化');
})();