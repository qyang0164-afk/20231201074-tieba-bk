// 校园贴吧系统主JavaScript文件

// 全局变量
let currentUser = null;
let posts = [];

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadSampleData();
});

// 初始化应用
function initializeApp() {
    console.log('校园贴吧系统初始化...');
    
    // 检查用户登录状态
    checkLoginStatus();
    
    // 设置页面标题
    updatePageTitle();
    
    // 初始化组件
    initComponents();
}

// 设置事件监听器
function setupEventListeners() {
    // 搜索功能
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
    
    // 导航菜单点击
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('href');
            navigateToPage(targetPage);
        });
    });
    
    // 帖子点击事件
    document.addEventListener('click', function(e) {
        if (e.target.closest('.post-title a')) {
            e.preventDefault();
            const postId = e.target.closest('.post-item').dataset.postId;
            viewPostDetail(postId);
        }
    });
}

// 检查登录状态
function checkLoginStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserInterface();
    }
}

// 更新用户界面
function updateUserInterface() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;
    
    if (currentUser) {
        // 用户已登录
        navMenu.innerHTML = `
            <a href="index.html" class="nav-link active">首页</a>
            <a href="post-detail.html" class="nav-link">帖子</a>
            <a href="create-post.html" class="nav-link">发帖</a>
            <a href="profile.html" class="nav-link">我的</a>
            <a href="#" class="nav-link" onclick="logout()">退出</a>
        `;
    } else {
        // 用户未登录
        navMenu.innerHTML = `
            <a href="index.html" class="nav-link active">首页</a>
            <a href="post-detail.html" class="nav-link">帖子</a>
            <a href="create-post.html" class="nav-link">发帖</a>
            <a href="profile.html" class="nav-link">我的</a>
            <a href="login.html" class="nav-link">登录</a>
        `;
    }
}

// 处理搜索
function handleSearch() {
    const searchInput = document.querySelector('.search-input');
    const query = searchInput.value.trim();
    
    if (query) {
        // 跳转到搜索页面或显示搜索结果
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    } else {
        showToast('请输入搜索关键词', 'warning');
    }
}

// 页面导航
function navigateToPage(page) {
    if (page === 'create-post.html' && !currentUser) {
        showToast('请先登录后再发帖', 'warning');
        window.location.href = 'login.html';
        return;
    }
    
    window.location.href = page;
}

// 查看帖子详情
function viewPostDetail(postId) {
    window.location.href = `post-detail.html?id=${postId}`;
}

// 加载示例数据
function loadSampleData() {
    // 模拟帖子数据
    posts = [
        {
            id: '1',
            title: '校园文化艺术节即将开幕，欢迎大家踊跃参与！',
            content: '本次文化艺术节将包含音乐、舞蹈、戏剧等多种表演形式，还有丰富的互动环节。活动时间：下周五下午2点，地点：学校大礼堂。',
            author: '张三',
            time: '2小时前',
            likes: 45,
            comments: 23,
            views: 156,
            tags: ['校园新闻', '活动']
        },
        {
            id: '2',
            title: '高数期末复习资料分享',
            content: '整理了本学期高数的重点知识点和历年真题，需要的同学可以下载。资料包括：1. 知识点总结 2. 典型例题 3. 历年真题',
            author: '李四',
            time: '5小时前',
            likes: 89,
            comments: 34,
            views: 289,
            tags: ['学习交流', '资料分享']
        },
        {
            id: '3',
            title: '求购二手笔记本电脑',
            content: '想买一台性能不错的二手笔记本，预算3000左右，有出的同学请联系我。要求：1. 近两年产品 2. 性能良好 3. 外观无严重损坏',
            author: '王五',
            time: '1天前',
            likes: 12,
            comments: 8,
            views: 67,
            tags: ['二手交易', '求购']
        }
    ];
    
    // 渲染帖子列表
    renderPostList();
}

// 渲染帖子列表
function renderPostList() {
    const postList = document.querySelector('.post-list');
    if (!postList) return;
    
    const postItems = postList.querySelectorAll('.post-item');
    postItems.forEach((item, index) => {
        if (posts[index]) {
            item.dataset.postId = posts[index].id;
        }
    });
}

// 显示提示消息
function showToast(message, type = 'info') {
    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // 添加样式
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 16px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        min-width: 300px;
        border-left: 4px solid #1890ff;
        animation: slideIn 0.3s ease-out;
    `;
    
    // 根据类型设置颜色
    const colors = {
        info: '#1890ff',
        success: '#52c41a',
        warning: '#faad14',
        error: '#f5222d'
    };
    
    toast.style.borderLeftColor = colors[type] || colors.info;
    
    document.body.appendChild(toast);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 3000);
}

// 用户登录
function login(username, password) {
    // 模拟登录验证
    if (username && password) {
        currentUser = {
            id: '1',
            username: username,
            avatar: 'images/avatar-default.jpg',
            joinTime: '2024-01-01'
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUserInterface();
        showToast('登录成功！', 'success');
        return true;
    }
    return false;
}

// 用户退出
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserInterface();
    showToast('已退出登录', 'info');
    
    // 跳转到首页
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// 更新页面标题
function updatePageTitle() {
    const path = window.location.pathname;
    const pageTitles = {
        'index.html': '校园贴吧 - 首页',
        'post-detail.html': '校园贴吧 - 帖子详情',
        'create-post.html': '校园贴吧 - 发帖',
        'profile.html': '校园贴吧 - 个人中心',
        'login.html': '校园贴吧 - 登录',
        'search.html': '校园贴吧 - 搜索',
        'messages.html': '校园贴吧 - 消息中心',
        'settings.html': '校园贴吧 - 设置'
    };
    
    const fileName = path.split('/').pop();
    if (pageTitles[fileName]) {
        document.title = pageTitles[fileName];
    }
}

// 初始化组件
function initComponents() {
    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .toast-close {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: #666;
            padding: 0;
            margin-left: 10px;
        }
        
        .toast-close:hover {
            color: #333;
        }
    `;
    document.head.appendChild(style);
}

// 工具函数：格式化时间
function formatTime(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    
    if (diff < minute) {
        return '刚刚';
    } else if (diff < hour) {
        return Math.floor(diff / minute) + '分钟前';
    } else if (diff < day) {
        return Math.floor(diff / hour) + '小时前';
    } else {
        return Math.floor(diff / day) + '天前';
    }
}

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 导出全局函数
window.login = login;
window.logout = logout;
window.showToast = showToast;