// 工具服务配置文件
// 此文件用于管理所有工具的后端服务配置信息
const toolServicesConfig = {
    // 文稿卫士工具配置
    '文稿卫士': {
        serviceUrl: 'http://localhost:3000/api/document-guard',
        frontendUrl: './document_guard.html',
        method: 'POST',
        allowedFileTypes: ['.txt', '.doc', '.docx', '.pdf'],
        description: '用于检测文档中的错别字、语法错误并提供优化建议'
    },
    
    // 公文规范官工具配置
    '公文规范官': {
        serviceUrl: 'http://localhost:3000/api/official-document',
        frontendUrl: './official_document.html',
        method: 'POST',
        allowedFileTypes: ['.doc', '.docx'],
        description: '用于检查公文格式规范，确保符合官方标准'
    },
    
    // 事务小秘书工具配置
    '事务小秘书': {
        serviceUrl: 'http://localhost:3000/api/affairs-secretary',
        frontendUrl: './affairs_secretary.html',
        method: 'POST',
        allowedFileTypes: [],
        description: '用于管理日常事务，提供日程安排和提醒功能'
    },
    
    // 双语翻译官工具配置
    '双语翻译官': {
        serviceUrl: 'http://localhost:3000/api/translator',
        frontendUrl: './translator.html',
        method: 'POST',
        allowedFileTypes: ['.txt', '.doc', '.docx'],
        description: '用于中英文双语翻译，支持文档翻译'
    }
};

// 导出配置以便其他模块使用
if (typeof module !== 'undefined') {
    module.exports = toolServicesConfig;
}