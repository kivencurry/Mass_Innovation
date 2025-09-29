/*
 * DocumentGuard 滚动修复模块
 * 实现点击错别字、语法错误等按钮时滚动到对应错误区域的功能
 */

(function() {
    console.log('DocumentGuard 滚动修复模块：开始加载...');
    
    // 初始化函数
    function initScrollFix() {
        console.log('DocumentGuard 滚动修复模块：初始化开始');
        
        // 等待DOM加载完成后绑定事件
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                bindScrollEvents();
                setupAdoptButtons();
            });
        } else {
            setTimeout(() => {
                bindScrollEvents();
                setupAdoptButtons();
            }, 100);
        }
        
        // 定期检查按钮是否已出现（处理动态加载情况）
        const checkInterval = setInterval(() => {
            if (document.getElementById('typo-errors-btn') && document.getElementById('grammar-errors-btn')) {
                clearInterval(checkInterval);
                bindScrollEvents();
                setupAdoptButtons();
                console.log('DocumentGuard 滚动修复模块：检测到按钮已加载，绑定事件完成');
            }
        }, 500);
        
        // 监听错误结果更新事件
        document.addEventListener('errorResultsUpdated', function() {
            console.log('DocumentGuard 滚动修复模块：检测到错误结果已更新，重新绑定事件');
            bindScrollEvents();
            setupAdoptButtons();
        });
        
        console.log('DocumentGuard 滚动修复模块：初始化完成');
    }
    
    // 绑定滚动事件
    function bindScrollEvents() {
        console.log('DocumentGuard 滚动修复模块：开始绑定滚动事件');
        
        // 错别字按钮
        const typoBtn = document.getElementById('typo-errors-btn');
        if (typoBtn) {
            // 先移除旧的事件监听器，避免重复绑定
            const newTypoBtn = typoBtn.cloneNode(true);
            typoBtn.parentNode.replaceChild(newTypoBtn, typoBtn);
            newTypoBtn.addEventListener('click', function(e) {
                console.log('DocumentGuard 滚动修复模块：点击了错别字按钮');
                scrollToErrorSection('错别字');
            });
        }
        
        // 语法错误按钮
        const grammarBtn = document.getElementById('grammar-errors-btn');
        if (grammarBtn) {
            // 先移除旧的事件监听器，避免重复绑定
            const newGrammarBtn = grammarBtn.cloneNode(true);
            grammarBtn.parentNode.replaceChild(newGrammarBtn, grammarBtn);
            newGrammarBtn.addEventListener('click', function(e) {
                console.log('DocumentGuard 滚动修复模块：点击了语法错误按钮');
                scrollToErrorSection('语法错误');
            });
        }
        
        // 优化建议按钮
        const suggestionBtn = document.getElementById('suggestion-btn');
        if (suggestionBtn) {
            console.log('DocumentGuard 滚动修复模块：找到优化建议按钮', suggestionBtn);
            // 先移除旧的事件监听器，避免重复绑定
            const newSuggestionBtn = suggestionBtn.cloneNode(true);
            suggestionBtn.parentNode.replaceChild(newSuggestionBtn, suggestionBtn);
            newSuggestionBtn.addEventListener('click', function(e) {
                console.log('DocumentGuard 滚动修复模块：点击了优化建议按钮');
                scrollToErrorSection('优化建议');
            });
        } else {
            console.warn('DocumentGuard 滚动修复模块：未找到优化建议按钮');
        }
        
        // 全部错误按钮
        const allErrorsBtn = document.getElementById('all-errors-btn');
        if (allErrorsBtn) {
            // 先移除旧的事件监听器，避免重复绑定
            const newAllErrorsBtn = allErrorsBtn.cloneNode(true);
            allErrorsBtn.parentNode.replaceChild(newAllErrorsBtn, allErrorsBtn);
            newAllErrorsBtn.addEventListener('click', function(e) {
                console.log('DocumentGuard 滚动修复模块：点击了全部错误按钮');
                scrollToTopOfResults();
            });
        }
        
        console.log('DocumentGuard 滚动修复模块：滚动事件绑定完成');
    }
    
    // 滚动到指定错误类型的区域
    function scrollToErrorSection(errorType) {
        console.log('DocumentGuard 滚动修复模块：尝试滚动到', errorType, '区域');
        
        // 获取错误结果容器
        const errorResults = document.getElementById('error-results');
        if (!errorResults) {
            console.warn('DocumentGuard 滚动修复模块：未找到错误结果容器');
            return;
        }
        
        console.log('DocumentGuard 滚动修复模块：错误结果容器：', errorResults);
        
        // 获取真正的可滚动容器（采用增强的方法确保找到正确的容器）
        let scrollContainer = null;
        
        // 方法1: 直接查找右侧面板的滚动区域（增强版）
        scrollContainer = document.querySelector('.flex-1.overflow-y-auto.p-3');
        console.log('DocumentGuard 滚动修复模块：使用方法1查找可滚动容器：', scrollContainer);
        
        // 方法2: 查找带padding的滚动区域（适配优化建议区域的结构）
        if (!scrollContainer) {
            scrollContainer = document.querySelector('.flex-1.overflow-y-auto.p-4');
            console.log('DocumentGuard 滚动修复模块：使用方法2查找可滚动容器：', scrollContainer);
        }
        
        // 方法3: 查找所有可能的滚动容器（增加容错性）
        if (!scrollContainer) {
            scrollContainer = document.querySelector('.flex-1.overflow-y-auto');
            console.log('DocumentGuard 滚动修复模块：使用方法3查找可滚动容器：', scrollContainer);
        }
        
        // 方法4: 使用closest方法
        if (!scrollContainer) {
            scrollContainer = errorResults.closest('.overflow-y-auto');
            console.log('DocumentGuard 滚动修复模块：使用方法4查找可滚动容器：', scrollContainer);
        }
        
        // 方法5: 查找其他可能的滚动容器
        if (!scrollContainer) {
            scrollContainer = document.querySelector('.overflow-y-auto');
            console.log('DocumentGuard 滚动修复模块：使用方法5查找可滚动容器：', scrollContainer);
        }
        
        // 方法6: 作为最后的备选，使用body元素
        if (!scrollContainer) {
            scrollContainer = document.body;
            console.log('DocumentGuard 滚动修复模块：使用body作为备选滚动容器');
        }
        
        console.log('DocumentGuard 滚动修复模块：最终使用的可滚动容器：', scrollContainer);
        
        // 查找对应错误类型的标题区域 - 增强版选择器策略
        let sections = [];
        
        // 策略1: 针对优化建议的特殊处理
        if (errorType === '优化建议') {
            console.log('DocumentGuard 滚动修复模块：开始使用优化建议特殊处理策略');
            
            // 直接查找优化建议的特殊样式类
            const suggestionSections = errorResults.querySelectorAll('.bg-blue-50.border-l-4.border-blue-500');
            if (suggestionSections.length > 0) {
                sections = Array.from(suggestionSections);
                console.log('DocumentGuard 滚动修复模块：使用策略1找到优化建议区域:', sections.length);
            } else {
                console.log('DocumentGuard 滚动修复模块：策略1未找到优化建议区域');
            }
            
            // 如果策略1失败，尝试查找优化建议的标题区域
            if (sections.length === 0) {
                console.log('DocumentGuard 滚动修复模块：尝试策略1.1查找优化建议区域');
                const allHeaders = errorResults.querySelectorAll('div.flex.items-center');
                console.log('DocumentGuard 滚动修复模块：找到标题元素数量:', allHeaders.length);
                allHeaders.forEach((header, index) => {
                    const titleElement = header.querySelector('span.font-medium');
                    console.log(`DocumentGuard 滚动修复模块：检查第${index+1}个标题元素:`, titleElement?.textContent);
                    if (titleElement && titleElement.textContent.includes('优化建议')) {
                        console.log('DocumentGuard 滚动修复模块：找到包含优化建议的标题元素');
                        // 找到包含优化建议标题的父容器
                        const section = header.closest('div.border-l-4');
                        if (section) {
                            sections.push(section);
                            console.log('DocumentGuard 滚动修复模块：使用策略1.1找到优化建议区域');
                        } else {
                            console.log('DocumentGuard 滚动修复模块：未找到父容器div.border-l-4');
                        }
                    }
                });
            }
            
            // 如果策略1.1也失败，尝试更宽松的查找方式
            if (sections.length === 0) {
                console.log('DocumentGuard 滚动修复模块：尝试策略1.2查找优化建议区域');
                // 查找所有包含优化建议文本的元素
                const allTextElements = errorResults.querySelectorAll('*');
                allTextElements.forEach(element => {
                    if (element.textContent.includes('优化建议')) {
                        console.log('DocumentGuard 滚动修复模块：找到包含优化建议文本的元素:', element.tagName, element.className);
                        // 查找最近的父级容器
                        let parent = element.closest('div.border-l-4, div.mt-4, div[class*="border-l-"]');
                        if (parent) {
                            sections.push(parent);
                            console.log('DocumentGuard 滚动修复模块：使用策略1.2找到优化建议区域');
                        } else {
                            console.log('DocumentGuard 滚动修复模块：未找到合适的父级容器');
                        }
                    }
                });
            }
        }
        
        // 策略2: 使用通用的border-l-4选择器
        if (sections.length === 0) {
            sections = Array.from(errorResults.querySelectorAll('div[class*="border-l-4"]'));
            console.log('DocumentGuard 滚动修复模块：使用策略2找到的错误类型区域数量：', sections.length);
        }
        
        // 策略2.1: 针对优化建议的额外策略 - 查找所有可能的标题区域
        if (sections.length === 0 && errorType === '优化建议') {
            console.log('DocumentGuard 滚动修复模块：尝试策略2.1查找优化建议区域');
            // 查找所有包含优化建议文本的标题元素
            const suggestionHeaders = errorResults.querySelectorAll('div.flex.items-center span.font-medium');
            console.log('DocumentGuard 滚动修复模块：找到标题元素数量:', suggestionHeaders.length);
            suggestionHeaders.forEach((header, index) => {
                console.log(`DocumentGuard 滚动修复模块：检查第${index+1}个标题元素:`, header.textContent);
                if (header.textContent.includes('优化建议')) {
                    console.log('DocumentGuard 滚动修复模块：找到包含优化建议的标题元素');
                    // 找到包含该标题的父级容器
                    const parentContainer = header.closest('div.mt-4');
                    if (parentContainer) {
                        sections.push(parentContainer);
                        console.log('DocumentGuard 滚动修复模块：使用策略2.1找到优化建议区域');
                    } else {
                        console.log('DocumentGuard 滚动修复模块：未找到父容器div.mt-4');
                        // 尝试其他可能的父级容器
                        const otherParent = header.closest('div');
                        if (otherParent) {
                            sections.push(otherParent);
                            console.log('DocumentGuard 滚动修复模块：使用策略2.1备用方法找到优化建议区域');
                        }
                    }
                }
            });
        }
        
        // 策略3: 使用更宽松的选择器
        if (sections.length === 0) {
            sections = Array.from(errorResults.querySelectorAll('div[class*="border-l-"]'));
            console.log('DocumentGuard 滚动修复模块：使用策略3找到的错误类型区域数量：', sections.length);
        }
        
        // 策略4: 针对优化建议的额外策略 - 查找所有包含优化建议文本的元素
        if (sections.length === 0 && errorType === '优化建议') {
            console.log('DocumentGuard 滚动修复模块：尝试策略4查找优化建议区域');
            // 查找所有包含优化建议文本的元素
            const allElements = errorResults.querySelectorAll('*');
            allElements.forEach(element => {
                if (element.textContent.includes('优化建议')) {
                    console.log('DocumentGuard 滚动修复模块：找到包含优化建议文本的元素:', element.tagName, element.className);
                    // 查找最近的父级容器
                    let parent = element.closest('div.border-l-4, div.mt-4, div[class*="border-l-"]');
                    if (parent) {
                        sections.push(parent);
                        console.log('DocumentGuard 滚动修复模块：使用策略4找到优化建议区域');
                    } else {
                        console.log('DocumentGuard 滚动修复模块：未找到合适的父级容器');
                    }
                }
            });
        }
        
        // 为了调试，显示所有找到的区域
        sections.forEach((section, index) => {
            const title = section.querySelector('span.font-medium')?.textContent || section.textContent.trim().substring(0, 50);
            console.log(`DocumentGuard 滚动修复模块：区域${index+1}标题：`, title);
        });
        
        let targetSection = null;
        
        // 改进的区域查找逻辑，使用更灵活的匹配方式
        sections.forEach((section, index) => {
            console.log(`DocumentGuard 滚动修复模块：检查第${index+1}个区域:`, section);
            
            // 查找所有可能包含标题的元素
            const titleElements = section.querySelectorAll('span.font-medium, div.flex.items-center span');
            let foundMatch = false;
            
            // 遍历所有可能的标题元素
            titleElements.forEach(titleElement => {
                const titleText = titleElement.textContent.trim();
                console.log('DocumentGuard 滚动修复模块：检查标题：', titleText);
                
                // 使用更宽松的匹配方式，不严格要求格式
                const isMatch = titleText.includes(errorType);
                console.log(`DocumentGuard 滚动修复模块：标题"${titleText}" 是否包含 "${errorType}":`, isMatch);
                
                if (isMatch) {
                    targetSection = section;
                    foundMatch = true;
                    console.log('DocumentGuard 滚动修复模块：找到匹配的区域');
                }
            });
            
            // 如果在特定的标题元素中没找到，检查整个section的文本
            if (!foundMatch && section.textContent.includes(errorType)) {
                targetSection = section;
                foundMatch = true;
                console.log('DocumentGuard 滚动修复模块：通过section整体文本找到匹配的区域');
            }
            
            // 针对优化建议的特殊处理 - 检查是否有优化建议相关的CSS类
            if (!foundMatch && errorType === '优化建议') {
                if (section.classList.contains('bg-blue-50') || 
                    section.classList.contains('border-blue-500') ||
                    section.querySelector('.text-blue-500')) {
                    targetSection = section;
                    foundMatch = true;
                    console.log('DocumentGuard 滚动修复模块：通过优化建议的CSS类找到匹配的区域');
                }
            }
            
            // 针对优化建议的额外特殊处理 - 检查是否有优化建议相关的背景色
            if (!foundMatch && errorType === '优化建议') {
                const computedStyle = window.getComputedStyle(section);
                if (computedStyle.backgroundColor.includes('239, 246, 255') || // bg-blue-50的RGB值
                    computedStyle.borderLeftColor.includes('59, 130, 246')) { // border-blue-500的RGB值
                    targetSection = section;
                    foundMatch = true;
                    console.log('DocumentGuard 滚动修复模块：通过优化建议的计算样式找到匹配的区域');
                }
            }
        });
        
        // 如果没找到，尝试直接通过ID定位（如果有）
        if (!targetSection) {
            const sectionId = errorType.toLowerCase().replace(/\s+/g, '-');
            targetSection = document.getElementById(sectionId + '-section');
            if (targetSection) {
                console.log('DocumentGuard 滚动修复模块：通过ID找到匹配的区域');
            }
        }
        
        if (targetSection) {
            console.log('DocumentGuard 滚动修复模块：找到目标区域，执行滚动');
            
            // 确保元素可见
            targetSection.style.display = 'block';
            
            // 强制重排以确保元素位置正确
            targetSection.offsetHeight;
            
            // 滚动到目标区域 - 增强的滚动逻辑（特别针对优化建议）
            setTimeout(() => {
                try {
                    // 特别处理优化建议区域 - 确保能正确滚动到视图中
            if (errorType === '优化建议') {
                console.log('DocumentGuard 滚动修复模块：特别处理优化建议区域滚动');
                
                // 确保元素可见
                targetSection.style.display = 'block';
                
                // 强制重排以确保元素位置正确
                targetSection.offsetHeight;
                
                // 先尝试直接滚动到元素
                try {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    console.log('DocumentGuard 滚动修复模块：使用scrollIntoView滚动到优化建议区域');
                } catch (e) {
                    console.error('DocumentGuard 滚动修复模块：scrollIntoView滚动失败', e);
                }
                
                // 添加高亮动画效果
                highlightErrorArea(targetSection);
                
                // 再次滚动确保位置正确
                setTimeout(() => {
                    try {
                        // 确保元素可见
                        targetSection.style.display = 'block';
                        
                        // 强制重排以确保元素位置正确
                        targetSection.offsetHeight;
                        
                        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        console.log('DocumentGuard 滚动修复模块：二次滚动确保优化建议区域位置');
                    } catch (e) {
                        console.error('DocumentGuard 滚动修复模块：二次滚动失败', e);
                        
                        // 使用备用方法
                        try {
                            const containerRect = scrollContainer.getBoundingClientRect();
                            const targetRect = targetSection.getBoundingClientRect();
                            
                            if (scrollContainer !== document.body) {
                                let scrollOffset = targetRect.top - containerRect.top + scrollContainer.scrollTop - 20;
                                const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
                                const safeScrollOffset = Math.min(Math.max(0, scrollOffset), maxScroll);
                                
                                scrollContainer.scrollTo({
                                    top: safeScrollOffset,
                                    behavior: 'smooth'
                                });
                                console.log('DocumentGuard 滚动修复模块：使用备用滚动方法滚动到优化建议区域');
                            } else {
                                window.scrollTo({
                                    top: targetRect.top - 50,
                                    behavior: 'smooth'
                                });
                                console.log('DocumentGuard 滚动修复模块：使用window.scrollTo滚动到优化建议区域');
                            }
                        } catch (e2) {
                            console.error('DocumentGuard 滚动修复模块：备用滚动方法也失败', e2);
                        }
                    }
                }, 300);
                
                return;
            }
                    
                    // 计算目标位置相对于滚动容器的偏移量
                    const containerRect = scrollContainer.getBoundingClientRect();
                    const targetRect = targetSection.getBoundingClientRect();
                    
                    // 优先使用区域内滚动
                    if (scrollContainer !== document.body) {
                        // 计算滚动偏移量
                        let scrollOffset = targetRect.top - containerRect.top + scrollContainer.scrollTop - 20; // 20px的上边距
                        
                        console.log('DocumentGuard 滚动修复模块：滚动容器位置：', containerRect.top);
                        console.log('DocumentGuard 滚动修复模块：目标位置：', targetRect.top);
                        console.log('DocumentGuard 滚动修复模块：当前滚动位置：', scrollContainer.scrollTop);
                        console.log('DocumentGuard 滚动修复模块：计算的滚动偏移量：', scrollOffset);
                        
                        // 确保滚动值在有效范围内
                        const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
                        const safeScrollOffset = Math.min(Math.max(0, scrollOffset), maxScroll);
                        
                        // 使用更可靠的滚动方式
                        try {
                            scrollContainer.scrollTop = safeScrollOffset;
                            console.log('DocumentGuard 滚动修复模块：使用直接设置scrollTop方式滚动');
                        } catch (e) {
                            console.error('DocumentGuard 滚动修复模块：直接滚动失败，使用平滑滚动:', e);
                            scrollContainer.scrollTo({
                                top: safeScrollOffset,
                                behavior: 'smooth'
                            });
                        }
                    } else {
                        // 如果是body容器，使用页面滚动
                        window.scrollTo({
                            top: targetRect.top - 50, // 预留一些顶部空间
                            behavior: 'smooth'
                        });
                        console.log('DocumentGuard 滚动修复模块：使用window.scrollTo滚动到页面位置');
                    }
                    
                    // 添加高亮动画效果
                    highlightErrorArea(targetSection);
                } catch (error) {
                    console.error('DocumentGuard 滚动修复模块：滚动时发生错误:', error);
                    // 备用方案：使用简单直接的滚动方法
                    try {
                        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        console.log('DocumentGuard 滚动修复模块：使用备用滚动方法 - scrollIntoView');
                    } catch (e) {
                        console.error('DocumentGuard 滚动修复模块：备用滚动方法也失败，尝试强制滚动', e);
                        // 终极备用方案：强制滚动
                        window.scrollTo({
                            top: targetSection.offsetTop - 50,
                            behavior: 'smooth'
                        });
                    }
                }
            }, 50);
        } else {
            console.warn('DocumentGuard 滚动修复模块：未找到对应错误类型的区域');
            // 尝试滚动到错误结果容器顶部
            errorResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    // 滚动到结果列表顶部
    function scrollToTopOfResults() {
        const errorResults = document.getElementById('error-results');
        if (errorResults) {
            // 获取真正的可滚动容器（采用多种方法确保找到正确的容器）
            let scrollContainer = null;
            
            // 方法1: 直接查找右侧面板的滚动区域
            scrollContainer = document.querySelector('.flex-1.overflow-y-auto.p-3');
            if (!scrollContainer) {
                // 方法2: 如果没找到，尝试查找带padding的滚动区域
                scrollContainer = document.querySelector('.flex-1.overflow-y-auto');
            }
            
            // 方法3: 如果仍然没找到，使用closest方法
            if (!scrollContainer) {
                scrollContainer = errorResults.closest('.overflow-y-auto');
            }
            
            // 方法4: 作为最后的备选，使用body元素
            if (!scrollContainer) {
                scrollContainer = document.body;
            }
            
            if (scrollContainer) {
                // 使用滚动容器的scrollTop属性进行区域内滚动到顶部
                if (scrollContainer === document.body) {
                    window.scrollTo({top: 0, behavior: 'smooth'});
                } else {
                    scrollContainer.scrollTo({top: 0, behavior: 'smooth'});
                }
                console.log('DocumentGuard 滚动修复模块：滚动到结果列表顶部');
            } else {
                console.warn('DocumentGuard 滚动修复模块：未找到可滚动的容器');
                // 备用方案：直接滚动到错误结果容器
                errorResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }
    
    // 高亮显示指定区域
    function highlightErrorArea(element) {
        if (!element) return;
        
        console.log('DocumentGuard 滚动修复模块：对元素添加高亮效果:', element);
        
        // 保存原始样式
        const originalBg = element.style.backgroundColor;
        const originalTransition = element.style.transition;
        const originalOutline = element.style.outline;
        
        // 添加高亮效果
        element.style.backgroundColor = '#fff3cd';
        element.style.boxShadow = '0 0 0 2px rgba(255, 193, 7, 0.3)';
        element.style.outline = '2px solid #f59e0b';
        element.style.transition = 'background-color 0.3s ease, box-shadow 0.3s ease, outline 0.3s ease';
        element.style.zIndex = '10';
        
        // 为优化建议区域添加特殊处理
        if (element.classList.contains('bg-blue-50')) {
            console.log('DocumentGuard 滚动修复模块：为优化建议区域添加高亮');
            element.style.backgroundColor = '#dbeafe';
            element.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.3)';
            element.style.outline = '2px solid #3b82f6';
        } else {
            console.log('DocumentGuard 滚动修复模块：为其他类型错误区域添加高亮');
        }
        
        // 2秒后恢复原始样式
        setTimeout(() => {
            element.style.backgroundColor = originalBg;
            element.style.boxShadow = '';
            element.style.outline = originalOutline;
            element.style.transition = originalTransition;
            element.style.zIndex = '';
        }, 2000);
        
        console.log('DocumentGuard 滚动修复模块：高亮显示完成');
    }
    
    // 保持向后兼容性的滚动到错误文本区域函数
    function scrollToErrorArea(originalText, correctedText) {
        console.log('DocumentGuard 滚动修复模块：使用兼容模式滚动到错误文本区域');
        
        // 直接调用增强版滚动函数
        scrollToTargetText(correctedText || originalText);
    }
    
    // 设置采纳按钮的滚动功能
    function setupAdoptButtons() {
        console.log('DocumentGuard 滚动修复模块：设置采纳按钮的滚动功能');
        
        // 查找所有采纳建议按钮
        const adoptButtons = document.querySelectorAll('.adopt-suggestion-btn');
        console.log('DocumentGuard 滚动修复模块：找到采纳按钮数量:', adoptButtons.length);
        
        // 为每个按钮添加点击事件
        adoptButtons.forEach(btn => {
            // 先移除旧的监听器避免重复绑定
            const newBtn = btn.cloneNode(true);
            if (btn.parentNode) {
                btn.parentNode.replaceChild(newBtn, btn);
            }
            
            newBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // 获取原始文本和纠正文本
                const encodedOriginalText = this.getAttribute('data-original');
                const encodedCorrectedText = this.getAttribute('data-corrected');
                
                // 解码HTML实体
                function htmlDecode(str) {
                    if (!str) return '';
                    const doc = new DOMParser().parseFromString(str, 'text/html');
                    return doc.documentElement.textContent;
                }
                
                const originalText = htmlDecode(encodedOriginalText);
                const correctedText = htmlDecode(encodedCorrectedText);
                
                // 检查当前是否已采纳状态
                const isAdopted = this.getAttribute('data-adopted') === 'true';
                
                // 切换文本 - 如果已采纳，则回退到原始文本
                const targetText = isAdopted ? originalText : correctedText;
                
                console.log('DocumentGuard 滚动修复模块：点击采纳按钮，尝试滚动到:', targetText);
                
                // 延迟滚动，确保文本替换已完成
                setTimeout(() => {
                    // 尝试多种方法滚动到目标区域
                    scrollToTargetText(targetText);
                }, 100);
            });
        });
    }
    
    // 增强版的文本滚动函数，使用多种方法确保滚动成功
    function scrollToTargetText(targetText) {
        console.log('DocumentGuard 滚动修复模块：使用增强版滚动函数滚动到文本:', targetText);
        
        // 获取文档内容区域 - 使用多种选择器确保找到正确的区域
        let contentArea = document.getElementById('document-content');
        if (!contentArea) {
            contentArea = document.querySelector('.document-content');
        }
        if (!contentArea) {
            contentArea = document.querySelector('.editor-content');
        }
        
        if (!contentArea) {
            console.warn('DocumentGuard 滚动修复模块：未找到文档内容区域');
            return;
        }
        
        console.log('DocumentGuard 滚动修复模块：使用的文档内容区域:', contentArea);
        console.log('DocumentGuard 滚动修复模块：文档内容预览:', contentArea.textContent.substring(0, 100) + '...');
        
        // 方法1: 使用递归搜索文本节点
        let targetElement = searchTextNodeInElement(contentArea, targetText);
        
        // 如果方法1失败，尝试方法2: 直接查找包含文本的最接近的可见元素
        if (!targetElement) {
            console.log('DocumentGuard 滚动修复模块：方法1未找到目标元素，尝试方法2');
            targetElement = findClosestVisibleElementWithText(contentArea, targetText);
        }
        
        // 如果方法2也失败，尝试方法3: 使用更宽松的匹配方式
        if (!targetElement) {
            console.log('DocumentGuard 滚动修复模块：方法2未找到目标元素，尝试方法3');
            targetElement = findElementWithApproximateText(contentArea, targetText);
        }
        
        if (targetElement) {
            console.log('DocumentGuard 滚动修复模块：找到目标元素，执行滚动');
            
            // 确保元素可见
            targetElement.style.display = 'block';
            
            // 强制重排以确保元素位置正确
            targetElement.offsetHeight;
            
            // 执行多次滚动尝试，确保成功
            let scrollAttempts = 0;
            const maxAttempts = 3;
            
            const tryScroll = () => {
                if (scrollAttempts >= maxAttempts) return;
                
                try {
                    // 计算安全滚动偏移量
                    const rect = targetElement.getBoundingClientRect();
                    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
                    const isInViewport = rect.top >= 0 && rect.bottom <= viewportHeight;
                    
                    if (!isInViewport) {
                        console.log('DocumentGuard 滚动修复模块：目标元素不在视口中，执行滚动尝试', scrollAttempts + 1);
                        
                        // 尝试多种滚动方法
                        try {
                            // 方法1: 使用标准的scrollIntoView
                            targetElement.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'center',
                                inline: 'nearest'
                            });
                            
                            // 添加高亮效果
                            highlightErrorArea(targetElement);
                        } catch (e) {
                            console.error('DocumentGuard 滚动修复模块：滚动方法1失败:', e);
                            
                            // 方法2: 使用window.scrollTo
                            try {
                                window.scrollTo({
                                    top: rect.top + window.pageYOffset - viewportHeight / 3, // 滚动到视口的1/3处
                                    behavior: 'smooth'
                                });
                            } catch (e2) {
                                console.error('DocumentGuard 滚动修复模块：滚动方法2也失败:', e2);
                            }
                        }
                    } else {
                        console.log('DocumentGuard 滚动修复模块：目标元素已在视口中');
                        // 添加高亮效果
                        highlightErrorArea(targetElement);
                        return;
                    }
                } catch (error) {
                    console.error('DocumentGuard 滚动修复模块：滚动过程中发生错误:', error);
                }
                
                scrollAttempts++;
                setTimeout(tryScroll, 200 * Math.pow(2, scrollAttempts)); // 指数退避
            };
            
            // 开始滚动尝试
            tryScroll();
        } else {
            console.warn('DocumentGuard 滚动修复模块：未找到对应文本的区域');
            
            // 备用方案：滚动到文档内容区域顶部
            try {
                contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
                console.log('DocumentGuard 滚动修复模块：使用备用方案滚动到文档内容区域顶部');
            } catch (e) {
                console.error('DocumentGuard 滚动修复模块：备用滚动方案也失败:', e);
            }
        }
    }
    
    // 递归搜索包含指定文本的文本节点
    function searchTextNodeInElement(element, textToFind) {
        if (!element || !textToFind) return null;
        
        // 检查元素的文本内容
        if (element.textContent && element.textContent.includes(textToFind)) {
            // 如果元素直接包含文本，检查其是否为可见元素
            if (isElementVisible(element)) {
                return element;
            }
        }
        
        // 递归检查子元素
        const children = element.childNodes;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.nodeType === Node.ELEMENT_NODE) {
                const found = searchTextNodeInElement(child, textToFind);
                if (found) return found;
            }
        }
        
        return null;
    }
    
    // 查找包含指定文本的最近可见元素
    function findClosestVisibleElementWithText(element, textToFind) {
        if (!element || !textToFind) return null;
        
        // 获取所有包含文本的元素
        const elements = element.querySelectorAll('*');
        
        for (let i = 0; i < elements.length; i++) {
            const el = elements[i];
            if (el.textContent && el.textContent.includes(textToFind) && isElementVisible(el)) {
                return el;
            }
        }
        
        return null;
    }
    
    // 使用更宽松的匹配方式查找包含文本的元素
    function findElementWithApproximateText(element, textToFind) {
        if (!element || !textToFind) return null;
        
        // 获取所有可能包含文本的元素
        const elements = element.querySelectorAll('p, div, span, li, td, th');
        
        // 计算文本相似度的简单函数
        function textSimilarity(text1, text2) {
            const longer = text1.length > text2.length ? text1 : text2;
            const shorter = text1.length > text2.length ? text2 : text1;
            
            if (longer.length === 0) return 1.0;
            
            // 计算编辑距离的简化版本
            let matches = 0;
            for (let i = 0; i < shorter.length; i++) {
                if (longer.includes(shorter[i])) {
                    matches++;
                }
            }
            
            return matches / longer.length;
        }
        
        let bestMatch = null;
        let bestScore = 0;
        
        for (let i = 0; i < elements.length; i++) {
            const el = elements[i];
            const content = el.textContent || '';
            
            if (content.length > 0) {
                const score = textSimilarity(content, textToFind);
                if (score > bestScore && score > 0.5 && isElementVisible(el)) {
                    bestScore = score;
                    bestMatch = el;
                }
            }
        }
        
        return bestMatch;
    }
    
    // 检查元素是否可见
    function isElementVisible(element) {
        if (!element) return false;
        
        // 检查元素的display和visibility样式
        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
            return false;
        }
        
        // 检查元素的尺寸
        const rect = element.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) {
            return false;
        }
        
        return true;
    }
    
    // 添加到document_guard.html中的函数，用于通知错误结果已更新
    window.notifyErrorResultsUpdated = function() {
        console.log('DocumentGuard 滚动修复模块：接收到错误结果更新通知');
        const event = new Event('errorResultsUpdated');
        document.dispatchEvent(event);
    };
    
    // 初始化模块
    initScrollFix();
    
    console.log('DocumentGuard 滚动修复模块：加载完成');
})();