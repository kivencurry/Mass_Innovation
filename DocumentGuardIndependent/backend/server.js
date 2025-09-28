const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const mammoth = require('mammoth');
const pdf = require('pdf-parse');

const app = express();
const PORT = 3000;

// 允许跨域请求
app.use(cors());
app.use(express.json());

// 配置静态文件服务，提供前端页面
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// 配置文件上传存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// 解析TXT文件
async function parseTxtFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          content: data,
          format: 'plaintext',
          textContent: data
        });
      }
    });
  });
}

// 解析Word文档
async function parseWordFile(filePath) {
  const buffer = fs.readFileSync(filePath);
  try {
    // 使用convertToHtml方法以保留格式信息
    const result = await mammoth.convertToHtml({
      buffer: buffer
    });
    
    // 提取纯文本内容用于错误检测
    const textOnly = result.value.replace(/<[^>]+>/g, '');
    
    return {
      content: result.value,
      format: 'html',
      textContent: textOnly
    };
  } catch (error) {
    throw new Error('解析Word文档失败: ' + error.message);
  }
}

// 解析PDF文件
async function parsePDFFile(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  try {
    const data = await pdf(dataBuffer);
    return {
      content: data.text,
      format: 'plaintext',
      textContent: data.text
    };
  } catch (error) {
    throw new Error('解析PDF文档失败: ' + error.message);
  }
}

// 检测文档中的错误 - 通过调用外部Python脚本来实现
function detectDocumentErrors(text) {
    // 注意：这个函数现在是一个异步函数的占位符
    // 实际的调用逻辑在fileUploadHandler中实现
    // 这里保留函数声明是为了兼容现有代码结构
    return [];
}

// 通过Python脚本检测文档中的错误
function detectDocumentErrorsWithPython(text) {
    const { execSync } = require('child_process');
    const path = require('path');
    
    try {
        // 构建Python脚本路径
        const scriptPath = path.join(__dirname, 'typo_detector.py');
        
        // 执行Python脚本并传递文本内容
        // 使用base64编码来避免命令行参数中的特殊字符问题
        const encodedText = Buffer.from(text, 'utf8').toString('base64');
        
        // 在Windows环境下，确保正确处理中文编码
        // 使用cmd.exe并设置编码环境变量
        const command = `cmd.exe /c "set PYTHONIOENCODING=utf-8 && python \"${scriptPath}\" --text \"${encodedText}\""`;
        
        // 同步执行命令，指定编码为utf8
        const output = execSync(command, { encoding: 'utf8' });
        
        // 清理输出中的BOM标记和换行符
        const cleanOutput = output.replace(/^\uFEFF/, '').trim();
        
        // 解析Python脚本的输出
        return JSON.parse(cleanOutput);
    } catch (error) {
        console.error('调用Python脚本检测错误失败:', error);
        // 如果Python脚本调用失败，返回空数组
        return [];
    }
}

// 文件上传和解析API
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '没有文件上传' });
  }

  try {
    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    let contentData;

    // 根据文件类型选择不同的解析方法
    if (fileExtension === '.txt') {
      contentData = await parseTxtFile(filePath);
    } else if (fileExtension === '.docx' || fileExtension === '.doc') {
      contentData = await parseWordFile(filePath);
    } else if (fileExtension === '.pdf') {
      contentData = await parsePDFFile(filePath);
    } else {
      // 删除上传的文件
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: '不支持的文件类型' });
    }

    // 删除上传的文件，我们只需要内容
    fs.unlinkSync(filePath);
    
    // 检测文档中的错误 - 使用Python脚本
    const errors = detectDocumentErrorsWithPython(contentData.textContent);

    // 返回解析后的内容和错误检测结果
    res.json({
      success: true,
      fileName: req.file.originalname,
      ...contentData,
      errors: errors
    });
  } catch (error) {
    console.error('处理文件时出错:', error);
    res.status(500).json({ error: error.message });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`后端服务器运行在 http://localhost:${PORT}`);
});