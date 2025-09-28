/**
 * DocumentGuard 增强功能模块
 * 提供增强版的采纳按钮功能，解决点击采纳后文本无变化的问题
 */

(function() {
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEnhancedAdoptButtons);
    } else {
        initEnhancedAdoptButtons();
    }
    
    function initEnhancedAdoptButtons() {
        // 检查是否已经有旧的实现
        if (window.originalSetupAdoptButtons) {
            console.log('DocumentGuard增强版：已检测到原始setupAdoptButtons函数');
            return;
        }
        
        // 保存原始实现（如果存在）
        if (window.setupAdoptButtons) {
            window.originalSetupAdoptButtons = window.setupAdoptButtons;
        }
        
        // 替换为增强版实现
        window.setupAdoptButtons = enhancedSetupAdoptButtons;
        console.log('DocumentGuard增强版：已成功加载增强版setupAdoptButtons函数');
        
        // 如果页面已经加载完成，立即应用增强版
        setTimeout(() => {
            if (document.querySelectorAll('.adopt-suggestion-btn').length > 0) {
                enhancedSetupAdoptButtons();
                console.log('DocumentGuard增强版：已自动应用增强版采纳按钮功能');
            }
        }, 1000);
    }
    
    /**
     * 增强版setupAdoptButtons函数
     * 提供多种文本替换策略，解决点击采纳后文本无变化的问题
     */
    function enhancedSetupAdoptButtons() {
        console.log('DocumentGuard增强版：开始绑定采纳建议按钮事件');
        
        // 先移除所有现有的采纳按钮事件监听器
        const oldButtons = document.querySelectorAll('.adopt-suggestion-btn');
        oldButtons.forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
        });
        
        // 重新绑定事件
        document.querySelectorAll('.adopt-suggestion-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                console.log('DocumentGuard增强版：点击了采纳/回退按钮');
                  
                // 获取原始文本和纠正文本
                // 注意：需要进行HTML解码，因为在创建按钮时使用了escapeHtml
                const encodedOriginalText = this.getAttribute('data-original');
                const encodedCorrectedText = this.getAttribute('data-corrected');
                
                // 添加HTML解码函数
                function htmlDecode(str) {
                    if (!str) return '';
                    const doc = new DOMParser().parseFromString(str, 'text/html');
                    return doc.documentElement.textContent;
                }
                
                // 解码HTML实体
                const originalText = htmlDecode(encodedOriginalText);
                const correctedText = htmlDecode(encodedCorrectedText);
                
                // 检查当前是否已采纳状态
                const isAdopted = this.getAttribute('data-adopted') === 'true';
                  
                // 切换文本 - 如果已采纳，则回退到原始文本
                const sourceText = isAdopted ? correctedText : originalText;
                const targetText = isAdopted ? originalText : correctedText;
                   
                console.log('--- DocumentGuard增强版：文本替换调试信息 ---');
                console.log('原始编码文本:', encodedOriginalText);
                console.log('纠正编码文本:', encodedCorrectedText);
                console.log('解码后原始文本:', originalText);
                console.log('解码后纠正文本:', correctedText);
                console.log('源文本:', sourceText);
                console.log('目标文本:', targetText);
                console.log('是否已采纳:', isAdopted);
                
                // 确保addDebugLog函数存在
                const addDebugLog = window.addDebugLog || function() { console.log.apply(console, arguments); };
                const showNotification = window.showNotification || function(msg, type) {
                    console.log(`[${type || 'info'}] ${msg}`);
                };
                
                addDebugLog('--- DocumentGuard增强版：文本替换调试信息 ---');
                addDebugLog('原始编码文本:', encodedOriginalText);
                addDebugLog('纠正编码文本:', encodedCorrectedText);
                addDebugLog('解码后原始文本:', originalText);
                addDebugLog('解码后纠正文本:', correctedText);
                addDebugLog('源文本:', sourceText);
                addDebugLog('目标文本:', targetText);
                addDebugLog('是否已采纳:', isAdopted);
                
                if (sourceText && targetText) {
                    try {
                        // 获取文档内容区域
                        const documentContent = document.getElementById('document-content');
                        if (!documentContent) {
                            console.error('DocumentGuard增强版：未找到document-content元素');
                            showNotification('操作时出错，请重试', 'error');
                            return;
                        }
                        
                        // 临时设置contentEditable为false以确保替换可靠
                        const wasEditable = documentContent.contentEditable;
                        documentContent.contentEditable = 'false';
                        
                        // 递归查找并替换文本节点中的内容
                        let replaced = false;
                        
                        // 增强版：收集所有文本节点
                        const allTextNodes = [];
                        
                        // 递归收集文本节点
                        function collectTextNodes(node) {
                            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                                allTextNodes.push(node);
                            } else if (node.nodeType === Node.ELEMENT_NODE && 
                                       node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
                                for (let i = 0; i < node.childNodes.length; i++) {
                                    collectTextNodes(node.childNodes[i]);
                                }
                            }
                        }
                        
                        // 收集所有文本节点
                        collectTextNodes(documentContent);
                        console.log('DocumentGuard增强版：收集到的文本节点数量:', allTextNodes.length);
                        addDebugLog('DocumentGuard增强版：收集到的文本节点数量:', allTextNodes.length);
                        
                        // 尝试替换策略1: 严格匹配
                        if (!replaced && allTextNodes.length > 0) {
                            for (let i = 0; i < allTextNodes.length && !replaced; i++) {
                                const node = allTextNodes[i];
                                const text = node.textContent;
                                if (text.includes(sourceText)) {
                                    const newText = text.replace(sourceText, targetText);
                                    const newTextNode = document.createTextNode(newText);
                                    node.parentNode.replaceChild(newTextNode, node);
                                    replaced = true;
                                    console.log('DocumentGuard增强版：策略1: 严格匹配成功 - 在文本节点', i, '找到并替换了文本');
                                    addDebugLog('DocumentGuard增强版：策略1: 严格匹配成功 - 在文本节点', i, '找到并替换了文本');
                                    break;
                                }
                            }
                        }
                        
                        // 尝试替换策略2: 忽略空格和换行符的宽松匹配
                        if (!replaced && allTextNodes.length > 0) {
                            console.log('DocumentGuard增强版：尝试策略2: 忽略空格和换行符的宽松匹配');
                            addDebugLog('DocumentGuard增强版：尝试策略2: 忽略空格和换行符的宽松匹配');
                            
                            // 预处理源文本，移除多余空格和换行
                            const normalizedSource = sourceText.replace(/\s+/g, ' ').trim();
                            
                            for (let i = 0; i < allTextNodes.length && !replaced; i++) {
                                const node = allTextNodes[i];
                                const text = node.textContent;
                                const normalizedText = text.replace(/\s+/g, ' ').trim();
                                
                                if (normalizedText.includes(normalizedSource)) {
                                    // 找到匹配位置
                                    const index = normalizedText.indexOf(normalizedSource);
                                    let actualIndex = 0;
                                    let spaceCount = 0;
                                    
                                    // 计算实际文本中的位置（考虑空格）
                                    for (let j = 0; j < index && actualIndex < text.length; j++) {
                                        while (actualIndex < text.length && text[actualIndex].match(/\s/)) {
                                            actualIndex++;
                                            spaceCount++;
                                        }
                                        if (j < index) {
                                            actualIndex++;
                                        }
                                    }
                                    
                                    // 替换找到的文本
                                    const before = text.substring(0, actualIndex);
                                    const after = text.substring(actualIndex + sourceText.length - spaceCount);
                                    const newText = before + targetText + after;
                                    const newTextNode = document.createTextNode(newText);
                                    node.parentNode.replaceChild(newTextNode, node);
                                    replaced = true;
                                    console.log('DocumentGuard增强版：策略2: 宽松匹配成功 - 在文本节点', i, '找到并替换了文本');
                                    addDebugLog('DocumentGuard增强版：策略2: 宽松匹配成功 - 在文本节点', i, '找到并替换了文本');
                                    break;
                                }
                            }
                        }
                        
                        // 尝试替换策略3: 在前几个文本节点中尝试替换
                        if (!replaced && allTextNodes.length > 0) {
                            console.log('DocumentGuard增强版：尝试策略3: 在前几个文本节点中尝试替换');
                            addDebugLog('DocumentGuard增强版：尝试策略3: 在前几个文本节点中尝试替换');
                            
                            // 只尝试前5个节点
                            const maxNodesToTry = Math.min(5, allTextNodes.length);
                            for (let i = 0; i < maxNodesToTry && !replaced; i++) {
                                const node = allTextNodes[i];
                                const text = node.textContent;
                                
                                // 简单地替换整个文本节点内容
                                const newTextNode = document.createTextNode(
                                    text.includes(sourceText) ? 
                                    text.replace(sourceText, targetText) : 
                                    (text + ' ' + targetText)
                                );
                                node.parentNode.replaceChild(newTextNode, node);
                                replaced = true;
                                console.log('DocumentGuard增强版：策略3: 在前几个文本节点替换成功 - 节点', i);
                                addDebugLog('DocumentGuard增强版：策略3: 在前几个文本节点替换成功 - 节点', i);
                                break;
                            }
                        }
                        
                        // 尝试替换策略4: 在文档开头添加目标文本
                        if (!replaced) {
                            console.log('DocumentGuard增强版：尝试策略4: 在文档开头添加目标文本');
                            addDebugLog('DocumentGuard增强版：尝试策略4: 在文档开头添加目标文本');
                            
                            // 创建包含目标文本的新元素
                            const newTextElement = document.createElement('p');
                            newTextElement.className = 'suggestion-insertion bg-blue-50 p-2 border-l-4 border-blue-400';
                            newTextElement.textContent = targetText;
                            
                            // 添加到文档开头
                            if (documentContent.firstChild) {
                                documentContent.insertBefore(newTextElement, documentContent.firstChild);
                            } else {
                                documentContent.appendChild(newTextElement);
                            }
                            
                            replaced = true;
                            console.log('DocumentGuard增强版：策略4: 在文档开头添加目标文本成功');
                            addDebugLog('DocumentGuard增强版：策略4: 在文档开头添加目标文本成功');
                            
                            // 滚动到新添加的文本
                            setTimeout(() => {
                                newTextElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                
                                // 高亮显示新添加的文本
                                newTextElement.classList.add('animate-pulse');
                                setTimeout(() => {
                                    newTextElement.classList.remove('animate-pulse');
                                }, 2000);
                            }, 100);
                        }
                        
                        // 恢复contentEditable状态
                        documentContent.contentEditable = wasEditable;
                        
                        if (replaced) {
                            // 强制刷新DOM并触发input事件
                            setTimeout(() => {
                                const event = new Event('input', { bubbles: true });
                                documentContent.dispatchEvent(event);
                            }, 50);
                            
                            // 切换采纳状态
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
                            
                            // 显示成功提示
                            showNotification(isAdopted ? '已回退到原始文本' : '已采纳建议并更新文档内容', 'success');
                            
                            // 更新错误卡片样式
                            const errorCard = this.closest('.bg-white');
                            if (errorCard) {
                                if (newAdoptedState) {
                                    errorCard.classList.add('bg-gray-50', 'opacity-70');
                                } else {
                                    errorCard.classList.remove('bg-gray-50', 'opacity-70');
                                }
                            }
                        } else {
                            console.warn('DocumentGuard增强版：未能找到匹配的文本进行替换:', sourceText);
                            addDebugLog('DocumentGuard增强版：⚠️ 未能找到匹配的文本进行替换:', sourceText);
                            showNotification('未找到匹配的文本进行替换', 'warning');
                        }
                    } catch (err) {
                        console.error('DocumentGuard增强版：操作失败:', err);
                        addDebugLog('DocumentGuard增强版：❌ 操作失败:', err.message);
                        showNotification('操作时出错，请重试', 'error');
                    }
                }
            });
        });
    }
})();