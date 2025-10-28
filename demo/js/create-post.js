// 发帖页JavaScript功能

// 全局变量
let currentTags = [];
let uploadedFiles = [];
let isDraftSaved = false;

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeCreatePostPage();
});

// 初始化发帖页
function initializeCreatePostPage() {
    setupEventListeners();
    loadDraftIfExists();
    updateCharacterCounts();
}

// 设置事件监听器
function setupEventListeners() {
    // 标题输入监听
    const titleInput = document.getElementById('postTitle');
    titleInput.addEventListener('input', function() {
        updateCharacterCounts();
        validateTitle();
    });

    // 内容输入监听
    const contentInput = document.getElementById('postContent');
    contentInput.addEventListener('input', function() {
        updateCharacterCounts();
        validateContent();
    });

    // 标签输入监听
    const tagInput = document.getElementById('tagInput');
    tagInput.addEventListener('keydown', handleTagInput);

    // 文件上传监听
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });

    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFileDrop(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', function(e) {
        handleFileSelect(e.target.files);
    });

    // 表单提交监听
    const postForm = document.getElementById('postForm');
    postForm.addEventListener('submit', handleFormSubmit);

    // 窗口关闭前检查草稿
    window.addEventListener('beforeunload', function(e) {
        if (hasUnsavedChanges() && !isDraftSaved) {
            e.preventDefault();
            e.returnValue = '您有未保存的草稿，确定要离开吗？';
            return e.returnValue;
        }
    });
}

// 更新字符计数
function updateCharacterCounts() {
    const titleInput = document.getElementById('postTitle');
    const contentInput = document.getElementById('postContent');
    const titleCount = document.getElementById('titleCount');
    const contentCount = document.getElementById('contentCount');

    const titleLength = titleInput.value.length;
    const contentLength = contentInput.value.length;

    titleCount.textContent = titleLength;
    contentCount.textContent = contentLength;

    // 添加警告样式
    titleCount.className = titleLength > 45 ? 'warning' : '';
    contentCount.className = contentLength > 1800 ? 'warning' : '';
}

// 验证标题
function validateTitle() {
    const titleInput = document.getElementById('postTitle');
    const title = titleInput.value.trim();
    
    if (title.length < 2) {
        showValidationError(titleInput, '标题至少需要2个字符');
        return false;
    }
    
    if (title.length > 50) {
        showValidationError(titleInput, '标题不能超过50个字符');
        return false;
    }
    
    clearValidationError(titleInput);
    return true;
}

// 验证内容
function validateContent() {
    const contentInput = document.getElementById('postContent');
    const content = contentInput.value.trim();
    
    if (content.length < 10) {
        showValidationError(contentInput, '内容至少需要10个字符');
        return false;
    }
    
    if (content.length > 2000) {
        showValidationError(contentInput, '内容不能超过2000个字符');
        return false;
    }
    
    clearValidationError(contentInput);
    return true;
}

// 显示验证错误
function showValidationError(input, message) {
    input.style.borderColor = 'var(--error-color)';
    
    // 移除现有的错误提示
    const existingError = input.parentNode.querySelector('.validation-error');
    if (existingError) {
        existingError.remove();
    }
    
    // 添加新的错误提示
    const errorElement = document.createElement('div');
    errorElement.className = 'validation-error';
    errorElement.style.color = 'var(--error-color)';
    errorElement.style.fontSize = '0.9rem';
    errorElement.style.marginTop = '0.5rem';
    errorElement.textContent = message;
    
    input.parentNode.appendChild(errorElement);
}

// 清除验证错误
function clearValidationError(input) {
    input.style.borderColor = 'var(--border-color)';
    
    const existingError = input.parentNode.querySelector('.validation-error');
    if (existingError) {
        existingError.remove();
    }
}

// 处理标签输入
function handleTagInput(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const tagInput = document.getElementById('tagInput');
        const tag = tagInput.value.trim();
        
        if (tag && currentTags.length < 5) {
            addTag(tag);
            tagInput.value = '';
        }
    }
}

// 添加标签
function addTag(tag) {
    if (currentTags.includes(tag)) {
        showMessage('标签已存在', 'warning');
        return;
    }
    
    if (tag.length > 10) {
        showMessage('标签不能超过10个字符', 'warning');
        return;
    }
    
    currentTags.push(tag);
    renderTags();
}

// 添加建议标签
function addSuggestedTag(tag) {
    if (currentTags.length >= 5) {
        showMessage('最多只能添加5个标签', 'warning');
        return;
    }
    
    addTag(tag);
}

// 移除标签
function removeTag(tag) {
    currentTags = currentTags.filter(t => t !== tag);
    renderTags();
}

// 渲染标签列表
function renderTags() {
    const tagsList = document.getElementById('tagsList');
    tagsList.innerHTML = '';
    
    currentTags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.className = 'tag-item';
        tagElement.innerHTML = `
            ${tag}
            <button type="button" class="tag-remove" onclick="removeTag('${tag}')">×</button>
        `;
        tagsList.appendChild(tagElement);
    });
}

// 处理文件拖放
function handleFileDrop(files) {
    handleFileSelect(files);
}

// 处理文件选择
function handleFileSelect(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // 检查文件大小（10MB限制）
        if (file.size > 10 * 1024 * 1024) {
            showMessage(`文件"${file.name}"超过10MB限制`, 'error');
            continue;
        }
        
        // 检查文件类型
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 
                             'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        
        if (!allowedTypes.includes(file.type)) {
            showMessage(`不支持的文件类型: ${file.name}`, 'error');
            continue;
        }
        
        // 添加文件
        uploadedFiles.push({
            file: file,
            id: Date.now() + i,
            name: file.name,
            size: formatFileSize(file.size),
            type: file.type
        });
    }
    
    renderFileList();
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 渲染文件列表
function renderFileList() {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';
    
    uploadedFiles.forEach(file => {
        const fileElement = document.createElement('div');
        fileElement.className = 'file-item';
        fileElement.innerHTML = `
            <div class="file-info">
                <span class="file-icon">${getFileIcon(file.type)}</span>
                <div class="file-details">
                    <h4>${file.name}</h4>
                    <p>${file.size} • ${file.type.split('/')[0]}</p>
                </div>
            </div>
            <div class="file-actions">
                <button type="button" class="file-action-btn preview" onclick="previewFile(${file.id})" title="预览">👁️</button>
                <button type="button" class="file-action-btn remove" onclick="removeFile(${file.id})" title="删除">🗑️</button>
            </div>
        `;
        fileList.appendChild(fileElement);
    });
}

// 获取文件图标
function getFileIcon(fileType) {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType === 'application/pdf') return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType === 'text/plain') return '📄';
    return '📎';
}

// 移除文件
function removeFile(fileId) {
    uploadedFiles = uploadedFiles.filter(file => file.id !== fileId);
    renderFileList();
}

// 预览文件
function previewFile(fileId) {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file) return;
    
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // 在实际应用中，这里可以打开图片预览模态框
            showMessage(`预览图片: ${file.name}`, 'info');
        };
        reader.readAsDataURL(file.file);
    } else {
        showMessage(`暂不支持预览 ${file.type.split('/')[1]} 文件`, 'info');
    }
}

// 文本格式化功能
function formatText(format) {
    const contentInput = document.getElementById('postContent');
    const start = contentInput.selectionStart;
    const end = contentInput.selectionEnd;
    const selectedText = contentInput.value.substring(start, end);
    
    let formattedText = '';
    
    switch (format) {
        case 'bold':
            formattedText = `**${selectedText}**`;
            break;
        case 'italic':
            formattedText = `*${selectedText}*`;
            break;
        case 'underline':
            formattedText = `__${selectedText}__`;
            break;
    }
    
    contentInput.setRangeText(formattedText, start, end, 'select');
    contentInput.focus();
}

// 插入链接
function insertLink() {
    const url = prompt('请输入链接地址:');
    if (url) {
        const text = prompt('请输入链接文本（可选）:', url);
        const linkText = text || url;
        
        const contentInput = document.getElementById('postContent');
        const start = contentInput.selectionStart;
        
        contentInput.setRangeText(`[${linkText}](${url})`, start, start, 'end');
        contentInput.focus();
    }
}

// 插入图片
function insertImage() {
    const url = prompt('请输入图片地址:');
    if (url) {
        const alt = prompt('请输入图片描述（可选）:', '');
        
        const contentInput = document.getElementById('postContent');
        const start = contentInput.selectionStart;
        
        contentInput.setRangeText(`![${alt}](${url})`, start, start, 'end');
        contentInput.focus();
    }
}

// 插入代码
function insertCode() {
    const language = prompt('请输入编程语言（可选）:', '');
    const code = prompt('请输入代码:');
    
    if (code) {
        const contentInput = document.getElementById('postContent');
        const start = contentInput.selectionStart;
        
        if (language) {
            contentInput.setRangeText(`\`\`\`${language}\n${code}\n\`\`\``, start, start, 'end');
        } else {
            contentInput.setRangeText(`\`${code}\``, start, start, 'end');
        }
        contentInput.focus();
    }
}

// 保存草稿
function saveDraft() {
    const draft = {
        title: document.getElementById('postTitle').value,
        content: document.getElementById('postContent').value,
        category: document.getElementById('postCategory').value,
        tags: currentTags,
        settings: {
            allowComments: document.getElementById('allowComments').checked,
            anonymousPost: document.getElementById('anonymousPost').checked,
            stickyPost: document.getElementById('stickyPost').checked
        },
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('postDraft', JSON.stringify(draft));
    isDraftSaved = true;
    showMessage('草稿已保存', 'success');
}

// 加载草稿
function loadDraftIfExists() {
    const draft = localStorage.getItem('postDraft');
    if (draft) {
        const confirmLoad = confirm('检测到未发布的草稿，是否加载？');
        if (confirmLoad) {
            const draftData = JSON.parse(draft);
            
            document.getElementById('postTitle').value = draftData.title || '';
            document.getElementById('postContent').value = draftData.content || '';
            document.getElementById('postCategory').value = draftData.category || '';
            
            currentTags = draftData.tags || [];
            renderTags();
            
            if (draftData.settings) {
                document.getElementById('allowComments').checked = draftData.settings.allowComments || false;
                document.getElementById('anonymousPost').checked = draftData.settings.anonymousPost || false;
                document.getElementById('stickyPost').checked = draftData.settings.stickyPost || false;
            }
            
            updateCharacterCounts();
            showMessage('草稿已加载', 'info');
        }
    }
}

// 预览帖子
function previewPost() {
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const category = document.getElementById('postCategory').value;
    
    if (!title || !content) {
        showMessage('请先填写标题和内容', 'warning');
        return;
    }
    
    const previewContainer = document.getElementById('previewContainer');
    const previewContent = document.getElementById('previewContent');
    
    previewContent.innerHTML = `
        <div class="preview-title">${title}</div>
        <div class="preview-meta">
            <span>分类: ${getCategoryName(category)}</span>
            <span>标签: ${currentTags.join(', ') || '无'}</span>
            <span>时间: ${new Date().toLocaleString()}</span>
        </div>
        <div class="preview-body">${renderMarkdown(content)}</div>
    `;
    
    previewContainer.style.display = 'block';
    previewContainer.scrollIntoView({ behavior: 'smooth' });
}

// 隐藏预览
function hidePreview() {
    document.getElementById('previewContainer').style.display = 'none';
}

// 获取分类名称
function getCategoryName(categoryValue) {
    const categorySelect = document.getElementById('postCategory');
    const selectedOption = categorySelect.options[categorySelect.selectedIndex];
    return selectedOption.text || '未分类';
}

// 渲染Markdown内容（简化版）
function renderMarkdown(text) {
    // 在实际应用中，可以使用完整的Markdown解析器
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/__(.*?)__/g, '<u>$1</u>')
        .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
        .replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%">')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/```(\w+)?\n([\s\S]*?)\n```/g, '<pre><code class="language-$1">$2</code></pre>')
        .replace(/\n/g, '<br>');
}

// 处理表单提交
function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateTitle() || !validateContent()) {
        showMessage('请检查表单填写是否正确', 'error');
        return;
    }
    
    const category = document.getElementById('postCategory').value;
    if (!category) {
        showMessage('请选择帖子分类', 'error');
        return;
    }
    
    // 模拟提交过程
    showMessage('正在发布帖子...', 'info');
    
    // 在实际应用中，这里会发送AJAX请求到服务器
    setTimeout(() => {
        // 清除草稿
        localStorage.removeItem('postDraft');
        isDraftSaved = false;
        
        showMessage('帖子发布成功！', 'success');
        
        // 跳转到帖子详情页
        setTimeout(() => {
            window.location.href = 'post-detail.html';
        }, 1500);
    }, 2000);
}

// 检查是否有未保存的更改
function hasUnsavedChanges() {
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    return title.length > 0 || content.length > 0 || currentTags.length > 0;
}

// 显示消息
function showMessage(message, type = 'info') {
    // 使用main.js中的showMessage函数
    if (typeof window.showMessage === 'function') {
        window.showMessage(message, type);
    } else {
        // 备用消息显示
        alert(`${type.toUpperCase()}: ${message}`);
    }
}