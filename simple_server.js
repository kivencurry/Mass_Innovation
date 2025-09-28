const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8888;
const HOSTNAME = 'localhost';

// 添加日志函数
function logRequest(req) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url} from ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}`);
}

// 创建服务器
const server = http.createServer((req, res) => {
    // 记录请求
    logRequest(req);
    
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // 处理OPTIONS请求
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }
    
    // 处理GET请求
    if (req.method === 'GET') {
        // 获取请求的文件路径，去除查询参数
        let cleanUrl = req.url.split('?')[0];
        let filePath = '.' + cleanUrl;
        if (filePath === './') {
            filePath = './test_document_guard.html';
        }
        
        console.log(`处理请求URL: ${req.url}`);
        console.log(`清理后的URL: ${cleanUrl}`);
        console.log(`文件路径: ${filePath}`);
        
        // 设置MIME类型
        const extname = String(path.extname(filePath)).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.wav': 'audio/wav',
            '.mp4': 'video/mp4',
            '.woff': 'application/font-woff',
            '.ttf': 'application/font-ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.otf': 'application/font-otf',
            '.wasm': 'application/wasm'
        };
        
        const contentType = mimeTypes[extname] || 'application/octet-stream';
        
        // 读取并提供文件
        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    // 文件未找到
                    console.log(`404 Not Found: ${filePath}`);
                    res.writeHead(404);
                    res.end('404 Not Found');
                } else {
                    // 服务器错误
                    console.log(`500 Internal Server Error: ${error.code} - ${filePath}`);
                    res.writeHead(500);
                    res.end('500 Internal Server Error: ' + error.code);
                }
            } else {
                // 成功提供文件
                console.log(`200 OK: ${filePath}`);
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }
});

// 启动服务器
server.listen(PORT, HOSTNAME, () => {
    console.log(`服务器运行在 http://${HOSTNAME}:${PORT}/`);
    console.log('访问 http://localhost:8888/test_document_guard.html 测试文稿卫士功能');
});