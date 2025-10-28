// 消息中心页JavaScript功能

// 全局变量
let currentMessageType = 'all';
let currentTimeFilter = 'all';
let currentStatusFilter = 'all';
let currentPage = 1;
let selectedMessageId = null;
let messages = [];

// 示例消息数据
const sampleMessages = [
    {
        id: 1,
        type: 'system',
        sender: '系统通知',
        senderAvatar: '🔔',
        subject: '系统维护通知',
        content: '校园贴吧将于今晚23:00-次日01:00进行系统维护，期间可能无法正常访问，给您带来的不便敬请谅解。',
        time: '2024-01-15 14:30',
        relativeTime: '2小时前',
        isRead: false,
        relatedPost: null
    },
    {
        id: 2,
        type: 'reply',
        sender: '学习小能手',
        senderAvatar: '📚',
        subject: '回复了你的帖子',
        content: '感谢分享高数资料！我补充了一些解题技巧，希望对大家有帮助。',
        time: '2024-01-15 13:45',
        relativeTime: '3小时前',
        isRead: false,
        relatedPost: { id: 1, title: '高数期末复习资料分享' }
    },
    {
        id: 3,
        type: 'like',
        sender: '美食达人',
        senderAvatar: '🍔',
        subject: '点赞了你的评论',
        content: '你的美食推荐很实用，我已经去尝试过了，确实不错！',
        time: '2024-01-15 12:20',
        relativeTime: '4小时前',
        isRead: true,
        relatedPost: { id: 2, title: '校园美食推荐：食堂最好吃的窗口' }
    },
    {
        id: 4,
        type: 'follow',
        sender: '校园百事通',
        senderAvatar: '💡',
        subject: '开始关注你',
        content: '关注了你，期待看到更多精彩内容！',
        time: '2024-01-15 11:10',
        relativeTime: '5小时前',
        isRead: true,
        relatedPost: null
    },
    {
        id: 5,
        type: 'private',
        sender: '匿名用户',
        senderAvatar: '👤',
        subject: '关于社团活动的咨询',
        content: '你好，我想了解下周社团招新活动的具体时间和地点，可以详细介绍一下吗？',
        time: '2024-01-15 10:05',
        relativeTime: '6小时前',
        isRead: false,
        relatedPost: null
    },
    {
        id: 6,
        type: 'system',
        sender: '系统通知',
        senderAvatar: '🔔',
        subject: '新功能上线',
        content: '校园贴吧新增私信功能，现在可以和其他用户进行一对一交流了！',
        time: '2024-01-14 16:20',
        relativeTime: '1天前',
        isRead: true,
        relatedPost: null
    },
    {
        id: 7,
        type: 'reply',
        sender: '技术宅',
        senderAvatar: '💻',
        subject: '回复了你的问题',
        content: '关于编程学习的问题，我建议先从Python基础开始，然后逐步深入学习。',
        time: '2024-01-14 14:15',
        relativeTime: '1天前',
        isRead: true,
        relatedPost: { id: 3, title: '编程学习路线求指导' }
    },
    {
        id: 8,
        type: 'like',
        sender: '运动达人',
        senderAvatar: '🏃',
        subject: '点赞了你的帖子',
        content: '运动建议很实用，我已经开始按照计划锻炼了！',
        time: '2024-01-14 12:30',
        relativeTime: '1天前',
        isRead: true,
        relatedPost: { id: 4, title: '校园运动健身计划分享' }
    }
];

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeMessagesPage();
});

// 初始化消息页面
function initializeMessagesPage() {
    loadMessages();
    setupEventListeners();
    renderMessages();
    updateBadgeCounts();
}

// 设置事件监听器
function setupEventListeners() {
    // 消息类型菜单
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            switchMessageType(type);
        });
    });
    
    // 筛选器
    const timeFilter = document.getElementById('timeFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (timeFilter) {
        timeFilter.addEventListener('change', function() {
            currentTimeFilter = this.value;
            renderMessages();
        });
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            currentStatusFilter = this.value;
            renderMessages();
        });
    }
    
    // 操作按钮
    const markAllReadBtn = document.getElementById('markAllRead');
    const newMessageBtn = document.getElementById('newMessage');
    const loadMoreBtn = document.getElementById('loadMore');
    const backToListBtn = document.getElementById('backToList');
    
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', markAllAsRead);
    }
    
    if (newMessageBtn) {
        newMessageBtn.addEventListener('click', showNewMessageModal);
    }
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreMessages);
    }
    
    if (backToListBtn) {
        backToListBtn.addEventListener('click', hideMessageDetail);
    }
    
    // 模态框相关
    const closeModalBtn = document.getElementById('closeModal');
    const cancelMessageBtn = document.getElementById('cancelMessage');
    const sendMessageBtn = document.getElementById('sendMessage');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', hideNewMessageModal);
    }
    
    if (cancelMessageBtn) {
        cancelMessageBtn.addEventListener('click', hideNewMessageModal);
    }
    
    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', sendNewMessage);
    }
    
    // 点击模态框外部关闭
    const modal = document.getElementById('newMessageModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideNewMessageModal();
            }
        });
    }
    
    // 键盘事件
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideNewMessageModal();
            hideMessageDetail();
        }
    });
}

// 加载消息数据
function loadMessages() {
    // 在实际应用中，这里会从服务器获取数据
    messages = [...sampleMessages];
}

// 切换消息类型
function switchMessageType(type) {
    currentMessageType = type;
    currentPage = 1;
    
    // 更新菜单激活状态
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-type') === type) {
            item.classList.add('active');
        }
    });
    
    // 更新列表标题
    const listTitle = document.getElementById('listTitle');
    if (listTitle) {
        const typeNames = {
            'all': '全部消息',
            'system': '系统通知',
            'reply': '回复消息',
            'like': '点赞消息',
            'follow': '关注消息',
            'private': '私信'
        };
        listTitle.textContent = typeNames[type] || '消息';
    }
    
    renderMessages();
}

// 渲染消息列表
function renderMessages() {
    const container = document.getElementById('messagesContainer');
    if (!container) return;
    
    // 过滤消息
    const filteredMessages = filterMessages();
    
    if (filteredMessages.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">💬</div>
                <div class="empty-text">暂无消息</div>
                <div class="empty-subtext">这里将显示您的所有消息通知</div>
            </div>
        `;
        return;
    }
    
    // 渲染消息项
    container.innerHTML = filteredMessages.map(message => `
        <div class="message-item ${message.isRead ? '' : 'unread'}" 
             onclick="selectMessage(${message.id})">
            <div class="message-avatar">${message.senderAvatar}</div>
            <div class="message-content">
                <div class="message-header">
                    <div class="message-sender">${message.sender}</div>
                    <div class="message-time">${message.relativeTime}</div>
                </div>
                <div class="message-preview">
                    <strong>${message.subject}</strong> - ${message.content}
                </div>
                <div class="message-meta">
                    <span class="message-type">${getTypeText(message.type)}</span>
                    ${message.relatedPost ? 
                        `<span class="related-post">相关帖子: ${message.relatedPost.title}</span>` : 
                        ''
                    }
                </div>
            </div>
            <div class="message-actions">
                <button class="action-btn" onclick="event.stopPropagation(); markAsRead(${message.id})" 
                        title="标记为已读">✓</button>
                <button class="action-btn" onclick="event.stopPropagation(); deleteMessage(${message.id})" 
                        title="删除">🗑️</button>
            </div>
        </div>
    `).join('');
    
    updateLoadMoreButton();
}

// 过滤消息
function filterMessages() {
    let filtered = messages;
    
    // 按类型过滤
    if (currentMessageType !== 'all') {
        filtered = filtered.filter(msg => msg.type === currentMessageType);
    }
    
    // 按状态过滤
    if (currentStatusFilter === 'unread') {
        filtered = filtered.filter(msg => !msg.isRead);
    } else if (currentStatusFilter === 'read') {
        filtered = filtered.filter(msg => msg.isRead);
    }
    
    // 按时间过滤（简化实现）
    if (currentTimeFilter !== 'all') {
        const now = new Date();
        filtered = filtered.filter(msg => {
            const msgTime = new Date(msg.time);
            const diff = now - msgTime;
            
            switch (currentTimeFilter) {
                case 'today':
                    return diff < 24 * 60 * 60 * 1000;
                case 'week':
                    return diff < 7 * 24 * 60 * 60 * 1000;
                case 'month':
                    return diff < 30 * 24 * 60 * 60 * 1000;
                default:
                    return true;
            }
        });
    }
    
    return filtered;
}

// 获取类型文本
function getTypeText(type) {
    const typeMap = {
        'system': '系统通知',
        'reply': '回复',
        'like': '点赞',
        'follow': '关注',
        'private': '私信'
    };
    return typeMap[type] || type;
}

// 选择消息
function selectMessage(messageId) {
    const message = messages.find(msg => msg.id === messageId);
    if (!message) return;
    
    selectedMessageId = messageId;
    
    // 标记为已读
    if (!message.isRead) {
        markAsRead(messageId);
    }
    
    // 显示消息详情
    showMessageDetail(message);
}

// 显示消息详情
function showMessageDetail(message) {
    const detailContainer = document.getElementById('messageDetail');
    const previewContainer = document.getElementById('messagePreview');
    
    if (!detailContainer || !previewContainer) return;
    
    // 在移动端显示详情
    if (window.innerWidth <= 1024) {
        detailContainer.classList.add('active');
    }
    
    previewContainer.innerHTML = `
        <div class="message-full">
            <div class="message-full-header">
                <div class="message-full-sender">
                    <div class="sender-avatar">${message.senderAvatar}</div>
                    <div class="sender-info">
                        <h4>${message.sender}</h4>
                        <p>${getTypeText(message.type)}</p>
                    </div>
                </div>
                <div class="message-full-time">
                    ${message.time}
                </div>
            </div>
            
            <div class="message-full-subject">
                ${message.subject}
            </div>
            
            <div class="message-full-body">
                ${message.content}
            </div>
            
            ${message.relatedPost ? `
                <div class="related-post-link">
                    <a href="post-detail.html?id=${message.relatedPost.id}" class="btn btn-outline">
                        查看相关帖子: ${message.relatedPost.title}
                    </a>
                </div>
            ` : ''}
            
            <div class="message-full-actions">
                <button class="btn btn-secondary" onclick="replyToMessage(${message.id})">
                    💬 回复
                </button>
                <button class="btn btn-outline" onclick="deleteMessage(${message.id})">
                    🗑️ 删除
                </button>
            </div>
        </div>
    `;
    
    // 更新详情标题
    const detailTitle = document.getElementById('detailTitle');
    if (detailTitle) {
        detailTitle.textContent = message.subject;
    }
}

// 隐藏消息详情
function hideMessageDetail() {
    const detailContainer = document.getElementById('messageDetail');
    if (detailContainer) {
        detailContainer.classList.remove('active');
    }
}

// 标记为已读
function markAsRead(messageId) {
    const message = messages.find(msg => msg.id === messageId);
    if (message && !message.isRead) {
        message.isRead = true;
        renderMessages();
        updateBadgeCounts();
        showMessage('消息已标记为已读', 'success');
    }
}

// 标记全部为已读
function markAllAsRead() {
    if (confirm('确定要将所有消息标记为已读吗？')) {
        messages.forEach(message => {
            message.isRead = true;
        });
        renderMessages();
        updateBadgeCounts();
        showMessage('所有消息已标记为已读', 'success');
    }
}

// 删除消息
function deleteMessage(messageId) {
    if (confirm('确定要删除这条消息吗？')) {
        messages = messages.filter(msg => msg.id !== messageId);
        
        if (selectedMessageId === messageId) {
            hideMessageDetail();
            selectedMessageId = null;
        }
        
        renderMessages();
        updateBadgeCounts();
        showMessage('消息已删除', 'success');
    }
}

// 回复消息
function replyToMessage(messageId) {
    const message = messages.find(msg => msg.id === messageId);
    if (message) {
        showNewMessageModal();
        
        // 预填充收件人
        setTimeout(() => {
            const recipientInput = document.getElementById('recipient');
            if (recipientInput && message.sender !== '系统通知') {
                recipientInput.value = message.sender;
            }
            
            // 预填充主题
            const subjectInput = document.getElementById('messageSubject');
            if (subjectInput) {
                subjectInput.value = `回复: ${message.subject}`;
            }
        }, 100);
    }
}

// 显示新消息模态框
function showNewMessageModal() {
    const modal = document.getElementById('newMessageModal');
    if (modal) {
        modal.classList.add('show');
        
        // 清空表单
        const form = document.getElementById('newMessageForm');
        if (form) {
            form.reset();
        }
        
        // 聚焦到收件人输入框
        setTimeout(() => {
            const recipientInput = document.getElementById('recipient');
            if (recipientInput) {
                recipientInput.focus();
            }
        }, 100);
    }
}

// 隐藏新消息模态框
function hideNewMessageModal() {
    const modal = document.getElementById('newMessageModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// 发送新消息
function sendNewMessage() {
    const recipient = document.getElementById('recipient')?.value.trim();
    const subject = document.getElementById('messageSubject')?.value.trim();
    const content = document.getElementById('messageContent')?.value.trim();
    
    if (!recipient) {
        showMessage('请输入收件人', 'warning');
        return;
    }
    
    if (!content) {
        showMessage('请输入消息内容', 'warning');
        return;
    }
    
    // 模拟发送消息
    showMessage('消息发送中...', 'info');
    
    setTimeout(() => {
        hideNewMessageModal();
        showMessage('消息发送成功', 'success');
        
        // 在实际应用中，这里会调用API发送消息
    }, 1000);
}

// 加载更多消息
function loadMoreMessages() {
    currentPage++;
    
    // 模拟加载更多数据
    showMessage(`正在加载第 ${currentPage} 页消息...`, 'info');
    
    setTimeout(() => {
        // 在实际应用中，这里会请求下一页数据
        showMessage(`已加载第 ${currentPage} 页消息`, 'success');
        updateLoadMoreButton();
    }, 1000);
}

// 更新加载更多按钮
function updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('loadMore');
    if (loadMoreBtn) {
        // 简单模拟是否有更多消息
        const hasMore = currentPage < 3; // 假设最多3页
        loadMoreBtn.style.display = hasMore ? 'block' : 'none';
    }
}

// 更新徽章计数
function updateBadgeCounts() {
    const typeCounts = {
        'all': messages.length,
        'system': messages.filter(msg => msg.type === 'system').length,
        'reply': messages.filter(msg => msg.type === 'reply').length,
        'like': messages.filter(msg => msg.type === 'like').length,
        'follow': messages.filter(msg => msg.type === 'follow').length,
        'private': messages.filter(msg => msg.type === 'private').length
    };
    
    const unreadCounts = {
        'all': messages.filter(msg => !msg.isRead).length,
        'system': messages.filter(msg => msg.type === 'system' && !msg.isRead).length,
        'reply': messages.filter(msg => msg.type === 'reply' && !msg.isRead).length,
        'like': messages.filter(msg => msg.type === 'like' && !msg.isRead).length,
        'follow': messages.filter(msg => msg.type === 'follow' && !msg.isRead).length,
        'private': messages.filter(msg => msg.type === 'private' && !msg.isRead).length
    };
    
    // 更新菜单徽章
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        const type = item.getAttribute('data-type');
        const badge = item.querySelector('.menu-badge');
        
        if (badge && typeCounts[type] !== undefined) {
            badge.textContent = unreadCounts[type] || 0;
            
            // 如果没有未读消息，隐藏徽章
            if (unreadCounts[type] === 0) {
                badge.style.display = 'none';
            } else {
                badge.style.display = 'inline-block';
            }
        }
    });
}

// 显示消息
function showMessage(message, type = 'info') {
    // 使用统一的消息显示函数
    if (typeof window.showMessage === 'function') {
        window.showMessage(message, type);
    } else {
        // 备用消息显示
        alert(`${type.toUpperCase()}: ${message}`);
    }
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    .related-post-link {
        margin-top: 20px;
        padding-top: 16px;
        border-top: 1px solid var(--border-light);
    }
    
    .related-post {
        background: var(--bg-tertiary);
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.75rem;
        color: var(--text-secondary);
    }
    
    .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: var(--text-tertiary);
    }
    
    .empty-icon {
        font-size: 4rem;
        margin-bottom: 20px;
        opacity: 0.5;
    }
    
    .empty-text {
        font-size: 1.1rem;
        margin-bottom: 10px;
    }
    
    .empty-subtext {
        font-size: 0.9rem;
        opacity: 0.8;
    }
`;
document.head.appendChild(style);