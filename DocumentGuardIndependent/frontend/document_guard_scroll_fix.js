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
            document.addEventListener('DOMContentLoaded', bindScrollEvents);
        } else {
            setTimeout(bindScrollEvents, 100);
        }
        
        // 定期检查按钮是否已出现（处理动态加载情况）
        const checkInterval = setInterval(() => {
            if (document.getElementById('typo-errors-btn') && document.getElementById('grammar-errors-btn')) {
                clearInterval(checkInterval);
                bindScrollEvents();
            }
        }, 500);
        
        console.log('DocumentGuard 滚动修复模块：初始化完成');
    }
    
    // 绑定滚动事件
    function bindScrollEvents() {
        console.log('DocumentGuard 滚动修复模块：开始绑定滚动事件');
        
        // 错别字按钮
        const typoBtn = document.getElementById('typo-errors-btn');
        if (typoBtn) {
            typoBtn.addEventListener('click', function(e) {
                console.log('DocumentGuard 滚动修复模块：点击了错别字按钮');
                scrollToErrorSection('错别字');
            });
        }
        
        // 语法错误按钮
        const grammarBtn = document.getElementById('grammar-errors-btn');
        if (grammarBtn) {
            grammarBtn.addEventListener('click', function(e) {
                console.log('DocumentGuard 滚动修复模块：点击了语法错误按钮');
                scrollToErrorSection('语法错误');
            });
        }
        
        // 优化建议按钮
        const suggestionBtn = document.getElementById('suggestion-btn');
        if (suggestionBtn) {
            suggestionBtn.addEventListener('click', function(e) {
                console.log('DocumentGuard 滚动修复模块：点击了优化建议按钮');
                scrollToErrorSection('优化建议');
            });
        }
        
        // 全部错误按钮
        const allErrorsBtn = document.getElementById('all-errors-btn');
        if (allErrorsBtn) {
            allErrorsBtn.addEventListener('click', function(e) {
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
        
        // 获取真正的可滚动容器（错误结果容器的父容器）
        const scrollContainer = errorResults.closest('.overflow-y-auto');
        if (!scrollContainer) {
            console.warn('DocumentGuard 滚动修复模块：未找到可滚动的容器');
            return;
        }
        
        console.log('DocumentGuard 滚动修复模块：可滚动容器：', scrollContainer);
        
        // 查找对应错误类型的标题区域
        const sections = errorResults.querySelectorAll('div.bg-red-50, div.bg-blue-50');
        console.log('DocumentGuard 滚动修复模块：找到的错误类型区域数量：', sections.length);
        
        let targetSection = null;
        
        sections.forEach(section => {
            const titleText = section.querySelector('span.font-medium')?.textContent;
            console.log('DocumentGuard 滚动修复模块：检查标题：', titleText);
            
            if (titleText) {
                // 输出详细的匹配信息用于调试
                console.log(`DocumentGuard 滚动修复模块：标题"${titleText}" 是否包含 "${errorType}":`, titleText.includes(errorType));
                
                // 使用正则表达式，确保能够匹配"语法错误（X个）"这种格式
                const regex = new RegExp(`^${errorType}\\s*\\(\\d+个\\)`);
                console.log('DocumentGuard 滚动修复模块：正则表达式：', regex);
                console.log(`DocumentGuard 滚动修复模块：标题"${titleText}" 是否匹配正则：`, regex.test(titleText));
                
                if (titleText.includes(errorType) || regex.test(titleText)) {
                    targetSection = section;
                    console.log('DocumentGuard 滚动修复模块：找到匹配的区域');
                }
            }
        });
        
        if (targetSection) {
            console.log('DocumentGuard 滚动修复模块：找到目标区域，执行滚动');
            
            // 确保元素可见
            targetSection.style.display = 'block';
            
            // 滚动到目标区域 - 使用区域内滚动而不是整页滚动
            setTimeout(() => {
                // 计算目标位置相对于滚动容器的偏移量
                const containerRect = scrollContainer.getBoundingClientRect();
                const targetRect = targetSection.getBoundingClientRect();
                const scrollOffset = targetRect.top - containerRect.top + scrollContainer.scrollTop - 10; // 10px的上边距
                
                console.log('DocumentGuard 滚动修复模块：滚动容器位置：', containerRect.top);
                console.log('DocumentGuard 滚动修复模块：目标位置：', targetRect.top);
                console.log('DocumentGuard 滚动修复模块：当前滚动位置：', scrollContainer.scrollTop);
                console.log('DocumentGuard 滚动修复模块：计算的滚动偏移量：', scrollOffset);
                
                // 使用滚动容器的scrollTop属性进行区域内滚动
                scrollContainer.scrollTo({
                    top: scrollOffset,
                    behavior: 'smooth'
                });
                
                // 添加高亮动画效果
                highlightSection(targetSection);
            }, 100);
        } else {
            console.warn('DocumentGuard 滚动修复模块：未找到对应错误类型的区域');
        }
    }
    
    // 滚动到结果列表顶部
    function scrollToTopOfResults() {
        const errorResults = document.getElementById('error-results');
        if (errorResults) {
            // 获取真正的可滚动容器
            const scrollContainer = errorResults.closest('.overflow-y-auto');
            if (scrollContainer) {
                // 使用滚动容器的scrollTop属性进行区域内滚动到顶部
                scrollContainer.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                console.warn('DocumentGuard 滚动修复模块：未找到可滚动的容器');
            }
        }
    }
    
    // 高亮显示指定区域
    function highlightSection(section) {
        // 保存原始样式
        if (!section._originalBgColor) {
            section._originalBgColor = section.style.backgroundColor;
        }
        
        // 应用高亮样式
        section.style.backgroundColor = '#fef3c7'; // 浅黄色背景
        section.style.transition = 'background-color 0.3s ease';
        
        // 2秒后恢复原始样式
        setTimeout(() => {
            if (section._originalBgColor) {
                section.style.backgroundColor = section._originalBgColor;
            } else {
                section.style.backgroundColor = '';
            }
        }, 2000);
    }
    
    // 初始化模块
    initScrollFix();
    
    console.log('DocumentGuard 滚动修复模块：加载完成');
})();