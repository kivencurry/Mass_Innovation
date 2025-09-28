// 工具配置加载器
// 从txt文件加载工具配置

// 全局变量存储工具配置
window.toolConfig = {};

// 从txt文件加载配置
async function loadToolConfig() {
    try {
        // 读取txt配置文件
        const response = await fetch('toolConfig.txt');
        if (!response.ok) {
            throw new Error(`无法加载配置文件: ${response.status}`);
        }
        
        const text = await response.text();
        const lines = text.split('\n');
        
        // 解析每一行配置
        lines.forEach(line => {
            // 忽略注释行和空行
            if (line.trim() === '' || line.trim().startsWith('#')) {
                return;
            }
            
            // 解析配置行
            const parts = line.split(',');
            if (parts.length >= 6) {
                const toolName = parts[0].trim();
                const serviceUrl = parts[1].trim();
                const frontendUrl = parts[2].trim();
                const method = parts[3].trim();
                const allowedFileTypes = parts[4].trim().split('|').filter(type => type !== '');
                const description = parts[5].trim();
                
                // 存储配置
                window.toolConfig[toolName] = {
                    serviceUrl,
                    frontendUrl,
                    method,
                    allowedFileTypes,
                    description
                };
            }
        });
        
        console.log('工具配置加载成功:', window.toolConfig);
        return window.toolConfig;
    } catch (error) {
        console.error('加载工具配置失败:', error);
        // 返回一个默认的空配置对象
        return {};
    }
}

// 初始化配置加载
function initToolConfig() {
    // 立即开始加载配置
    loadToolConfig().then(() => {
        // 配置加载完成后的回调
        console.log('工具配置初始化完成');
    });
}

// 在DOM加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToolConfig);
} else {
    // 如果DOM已经加载完成，直接初始化
    initToolConfig();
}