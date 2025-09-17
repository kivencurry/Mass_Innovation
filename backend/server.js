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

// 检测文档中的错误
function detectDocumentErrors(text) {
    const errors = [];
    
    // 简单的错别字检测（实际应用中可能需要更复杂的词库）
    const typos = [
        { original: '按装', corrected: '安装', type: '错别字' },
        { original: '既使', corrected: '即使', type: '错别字' },
        { original: '穿流不息', corrected: '川流不息', type: '错别字' }
    ];
    
    // 简单的语法错误检测
    const grammarErrors = [
        { original: '香蕉，和橙子', corrected: '香蕉和橙子', type: '语法错误' },
        { original: '不仅学习好，但是', corrected: '不仅学习好，而且', type: '语法错误' }
    ];
    
    // 简单的优化建议
    const suggestions = [
        { original: '进行了详细的分析，我们', corrected: '通过对项目进行详细分析，我们', type: '优化建议' },
        { original: '具有一定的竞争力', corrected: '具备较强竞争力', type: '优化建议' }
    ];
    
    // 检测错别字
    typos.forEach(typo => {
        const regex = new RegExp(typo.original, 'g');
        let match;
        while ((match = regex.exec(text)) !== null) {
            // 提取错误上下文
            const contextStart = Math.max(0, match.index - 10);
            const contextEnd = Math.min(text.length, match.index + typo.original.length + 10);
            const context = text.substring(contextStart, contextEnd);
            
            errors.push({
                type: typo.type,
                original: typo.original,
                corrected: typo.corrected,
                context: context,
                position: match.index
            });
        }
    });
    
    // 检测语法错误
    grammarErrors.forEach(error => {
        const regex = new RegExp(error.original, 'g');
        let match;
        while ((match = regex.exec(text)) !== null) {
            // 提取错误上下文
            const contextStart = Math.max(0, match.index - 10);
            const contextEnd = Math.min(text.length, match.index + match[0].length + 10);
            const context = text.substring(contextStart, contextEnd);
            
            errors.push({
                type: error.type,
                original: error.original,
                corrected: error.corrected,
                context: context,
                position: match.index
            });
        }
    });
    
    // 检测优化建议
    suggestions.forEach(suggestion => {
        const regex = new RegExp(suggestion.original, 'g');
        let match;
        while ((match = regex.exec(text)) !== null) {
            // 提取错误上下文
            const contextStart = Math.max(0, match.index - 10);
            const contextEnd = Math.min(text.length, match.index + match[0].length + 10);
            const context = text.substring(contextStart, contextEnd);
            
            errors.push({
                type: suggestion.type,
                original: suggestion.original,
                corrected: suggestion.corrected,
                context: context,
                position: match.index
            });
        }
    });
    
    return errors;
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
    
    // 检测文档中的错误
    const errors = detectDocumentErrors(contentData.textContent);

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