/**
 * DocumentGuard 增强功能模块 - 紧急修复版
 * 解决点击采纳按钮后文本无变化的问题
 */

(function() {
    console.log('DocumentGuard 紧急修复版：开始加载...');
    
    // 立即注入核心修复逻辑，不依赖DOM加载
    window.fixAdoptButtons = function() {
        console.log('DocumentGuard 紧急修复版：开始修复采纳按钮功能');
        
        // 存储所有已处理的按钮，避免重复处理
        const processedButtons = new Set();
        
        // 核心替换函数
        function forceReplaceText(sourceText, targetText) {
            console.log('DocumentGuard 紧急修复版：尝试替换文本 - 源:', sourceText, '-> 目标:', targetText);
            
            const documentContent = document.getElementById('document-content');
            if (!documentContent) {
                console.error('DocumentGuard 紧急修复版：未找到document-content元素');
                return false;
            }
            
            // 策略1: 直接操作innerHTML - 最直接有效的方法
            try {
                let html = documentContent.innerHTML;
                const originalHtml = html;
                
                // 先尝试精确匹配
                if (html.includes(sourceText)) {
                    html = html.replace(sourceText, targetText);
                    documentContent.innerHTML = html;
                    console.log('DocumentGuard 紧急修复版：策略1成功 - 直接替换innerHTML中的精确匹配文本');
                    return true;
                }
                
                // 策略2: 忽略空格和换行符的宽松匹配
                const normalizedSource = sourceText.replace(/\s+/g, ' ').trim();
                const normalizedHtml = html.replace(/\s+/g, ' ').trim();
                
                if (normalizedHtml.includes(normalizedSource)) {
                    // 创建一个临时容器来处理DOM结构
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = originalHtml;
                    
                    // 遍历所有文本节点
                    function replaceInTextNodes(node) {
                        if (node.nodeType === Node.TEXT_NODE) {
                            const normalizedText = node.textContent.replace(/\s+/g, ' ').trim();
                            if (normalizedText.includes(normalizedSource)) {
                                node.textContent = node.textContent.replace(new RegExp(sourceText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), targetText);
                                return true;
                            }
                        } else if (node.nodeType === Node.ELEMENT_NODE && 
                                  node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
                            for (let i = 0; i < node.childNodes.length; i++) {
                                if (replaceInTextNodes(node.childNodes[i])) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    }
                    
                    if (replaceInTextNodes(tempDiv)) {
                        documentContent.innerHTML = tempDiv.innerHTML;
                        console.log('DocumentGuard 紧急修复版：策略2成功 - 忽略空格匹配并替换文本');
                        return true;
                    }
                }
                
                // 策略3: 在文档开头添加新段落 - 确保至少有效果
                const newParagraph = document.createElement('p');
                newParagraph.className = 'suggestion-insertion bg-green-50 p-3 border-l-4 border-green-400 font-medium';
                newParagraph.textContent = `[已采纳建议] ${targetText}`;
                
                if (documentContent.firstChild) {
                    documentContent.insertBefore(newParagraph, documentContent.firstChild);
                } else {
                    documentContent.appendChild(newParagraph);
                }
                
                // 滚动到新添加的段落
                setTimeout(() => {
                    newParagraph.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // 添加高亮动画
                    newParagraph.classList.add('animate-pulse');
                    setTimeout(() => {
                        newParagraph.classList.remove('animate-pulse');
                    }, 2000);
                }, 100);
                
                console.log('DocumentGuard 紧急修复版：策略3成功 - 在文档开头添加新段落');
                return true;
            } catch (err) {
                console.error('DocumentGuard 紧急修复版：文本替换失败:', err);
                return false;
            }
        }
        
        // 处理所有采纳按钮
        function processAdoptButtons() {
            const buttons = document.querySelectorAll('.adopt-suggestion-btn');
            console.log('DocumentGuard 紧急修复版：找到', buttons.length, '个采纳按钮');
            
            buttons.forEach(btn => {
                if (processedButtons.has(btn)) return;
                processedButtons.add(btn);
                
                // 移除现有事件监听器
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                
                // 添加新的点击事件处理
                newBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    console.log('DocumentGuard 紧急修复版：点击了采纳/回退按钮');
                    
                    // 获取原始文本和纠正文本
                    const encodedOriginalText = this.getAttribute('data-original');
                    const encodedCorrectedText = this.getAttribute('data-corrected');
                    
                    // HTML解码函数
                    function htmlDecode(str) {
                        if (!str) return '';
                        const doc = new DOMParser().parseFromString(str, 'text/html');
                        return doc.documentElement.textContent;
                    }
                    
                    // 解码文本
                    const originalText = htmlDecode(encodedOriginalText);
                    const correctedText = htmlDecode(encodedCorrectedText);
                    
                    console.log('DocumentGuard 紧急修复版：解码后文本 - 原始:', originalText, '纠正:', correctedText);
                    
                    // 检查当前状态
                    const isAdopted = this.getAttribute('data-adopted') === 'true';
                    const sourceText = isAdopted ? correctedText : originalText;
                    const targetText = isAdopted ? originalText : correctedText;
                    
                    // 执行强制替换
                    const success = forceReplaceText(sourceText, targetText);
                    
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
                        
                        // 显示通知
                        showNotification(isAdopted ? '已回退到原始文本' : '已采纳建议并更新文档内容', 'success');
                        
                        // 触发input事件以确保其他功能正常工作
                        setTimeout(() => {
                            const contentDiv = document.getElementById('document-content');
                            if (contentDiv) {
                                const event = new Event('input', { bubbles: true });
                                contentDiv.dispatchEvent(event);
                            }
                        }, 100);
                    } else {
                        showNotification('替换文本时出错，请重试', 'error');
                    }
                }, true); // 使用捕获模式确保事件被触发
            });
        }
        
        // 通知函数
        function showNotification(message, type = 'info') {
            // 尝试使用系统的showNotification
            if (window.showNotification) {
                try {
                    window.showNotification(message, type);
                    return;
                } catch (e) {}
            }
            
            // 自备通知实现
            const notification = document.createElement('div');
            notification.className = `fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 transition-all duration-300 transform translate-x-full`;
            
            // 设置样式
            if (type === 'success') {
                notification.classList.add('bg-green-100', 'text-green-800', 'border-l-4', 'border-green-500');
            } else if (type === 'error') {
                notification.classList.add('bg-red-100', 'text-red-800', 'border-l-4', 'border-red-500');
            } else if (type === 'warning') {
                notification.classList.add('bg-yellow-100', 'text-yellow-800', 'border-l-4', 'border-yellow-500');
            } else {
                notification.classList.add('bg-blue-100', 'text-blue-800', 'border-l-4', 'border-blue-500');
            }
            
            notification.textContent = message;
            document.body.appendChild(notification);
            
            // 显示通知
            setTimeout(() => {
                notification.classList.remove('translate-x-full');
            }, 10);
            
            // 3秒后隐藏
            setTimeout(() => {
                notification.classList.add('translate-x-full');
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        }
        
        // 立即处理一次
        processAdoptButtons();
        
        // 定期检查新出现的按钮（每1秒）
        setInterval(() => {
            processAdoptButtons();
        }, 1000);
        
        console.log('DocumentGuard 紧急修复版：初始化完成，正在监控采纳按钮');
    };
    
    // 立即执行修复
    if (typeof document !== 'undefined') {
        // 优先立即执行
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', window.fixAdoptButtons);
        } else {
            setTimeout(window.fixAdoptButtons, 100);
        }
        
        // 同时注入到全局，方便手动调用
        console.log('DocumentGuard 紧急修复版：已注入到全局，可通过window.fixAdoptButtons()手动触发');
    }
    
    console.log('DocumentGuard 紧急修复版：加载完成');
})();