// 搜索页JavaScript功能

// 全局变量
let currentQuery = '';
let currentSearchType = 'all';
let currentSortBy = 'relevance';
let currentTimeRange = 'all';
let currentPage = 1;
let hasMoreResults = false;
let searchHistory = [];

// 示例数据
const samplePosts = [
    {
        id: 1,
        title: '高数期末复习资料分享',
        content: '整理了近三年的高数期末试题和复习重点，包括选择题、填空题和解答题的详细解析...',
        author: '学习小能手',
        time: '2小时前',
        category: '学习交流',
        likes: 89,
        comments: 34,
        views: 1800,
        tags: ['高数', '期末', '复习资料']
    },
    {
        id: 2,
        title: '校园美食推荐：食堂最好吃的窗口',
        content: '整理了学校各个食堂的特色美食，包括价格、口味评价和推荐指数...',
        author: '美食达人',
        time: '1天前',
        category: '生活服务',
        likes: 128,
        comments: 56,
        views: 2300,
        tags: ['美食', '食堂', '推荐']
    },
    {
        id: 3,
        title: '校园社团招新活动预告',
        content: '下周将举行校园社团联合招新活动，各社团介绍和报名方式...',
        author: '社团管理员',
        time: '3天前',
        category: '社团活动',
        likes: 67,
        comments: 23,
        views: 1200,
        tags: ['社团', '招新', '活动']
    }
];

const sampleUsers = [
    {
        id: 1,
        name: '学习小能手',
        bio: '热爱学习，乐于分享学习资料和经验',
        avatar: '📚',
        posts: 45,
        followers: 120
    },
    {
        id: 2,
        name: '美食达人',
        bio: '探索校园美食，分享美食攻略',
        avatar: '🍔',
        posts: 23,
        followers: 89
    },
    {
        id: 3,
        name: '校园百事通',
        bio: '了解校园最新动态，分享实用信息',
        avatar: '💡',
        posts: 67,
        followers: 156
    }
];

const sampleTags = [
    { name: '高数', count: 45 },
    { name: '美食', count: 78 },
    { name: '社团', count: 34 },
    { name: '学习', count: 123 },
    { name: '生活', count: 67 }
];

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeSearchPage();
});

// 初始化搜索页面
function initializeSearchPage() {
    loadSearchHistory();
    setupEventListeners();
    renderSearchHistory();
}

// 设置事件监听器
function setupEventListeners() {
    // 搜索输入框事件
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchInput);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        searchInput.addEventListener('focus', showSearchSuggestions);
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    // 搜索类型筛选
    const searchTypeRadios = document.querySelectorAll('input[name="searchType"]');
    searchTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            currentSearchType = this.value;
            if (currentQuery) {
                performSearch();
            }
        });
    });
    
    // 排序方式
    const sortBySelect = document.getElementById('sortBy');
    if (sortBySelect) {
        sortBySelect.addEventListener('change', function() {
            currentSortBy = this.value;
            if (currentQuery) {
                performSearch();
            }
        });
    }
    
    // 时间范围
    const timeRangeSelect = document.getElementById('timeRange');
    if (timeRangeSelect) {
        timeRangeSelect.addEventListener('change', function() {
            currentTimeRange = this.value;
            if (currentQuery) {
                performSearch();
            }
        });
    }
    
    // 加载更多
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreResults);
    }
    
    // 清除历史
    const clearHistoryBtn = document.getElementById('clearHistory');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', clearSearchHistory);
    }
    
    // 搜索建议点击
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('suggestion-item') || 
            e.target.classList.contains('topic-tag')) {
            e.preventDefault();
            const query = e.target.getAttribute('data-query') || e.target.textContent;
            document.getElementById('searchInput').value = query;
            performSearch();
        }
    });
    
    // 点击外部关闭搜索建议
    document.addEventListener('click', function(e) {
        const suggestions = document.getElementById('searchSuggestions');
        if (suggestions && !suggestions.contains(e.target) && 
            e.target !== searchInput) {
            suggestions.classList.remove('show');
        }
    });
}

// 处理搜索输入
function handleSearchInput() {
    const query = this.value.trim();
    
    if (query.length > 0) {
        showSearchSuggestions();
    } else {
        hideSearchSuggestions();
    }
}

// 显示搜索建议
function showSearchSuggestions() {
    const suggestions = document.getElementById('searchSuggestions');
    if (suggestions) {
        suggestions.classList.add('show');
    }
}

// 隐藏搜索建议
function hideSearchSuggestions() {
    const suggestions = document.getElementById('searchSuggestions');
    if (suggestions) {
        suggestions.classList.remove('show');
    }
}

// 执行搜索
function performSearch() {
    const query = document.getElementById('searchInput').value.trim();
    
    if (!query) {
        showMessage('请输入搜索关键词', 'warning');
        return;
    }
    
    // 更新当前查询
    currentQuery = query;
    currentPage = 1;
    
    // 添加到搜索历史
    addToSearchHistory(query);
    
    // 显示加载状态
    showLoadingState();
    
    // 显示筛选器
    const filters = document.getElementById('searchFilters');
    if (filters) {
        filters.classList.add('show');
    }
    
    // 模拟搜索延迟
    setTimeout(() => {
        // 执行搜索逻辑
        const results = searchData(query, currentSearchType, currentSortBy, currentTimeRange);
        
        // 渲染结果
        renderSearchResults(results);
        
        // 更新结果统计
        updateResultsCount(results);
        
        // 隐藏加载状态
        hideLoadingState();
    }, 800);
}

// 搜索数据
function searchData(query, type, sortBy, timeRange) {
    let results = {
        posts: [],
        users: [],
        tags: []
    };
    
    const queryLower = query.toLowerCase();
    
    // 搜索帖子
    if (type === 'all' || type === 'posts') {
        results.posts = samplePosts.filter(post => 
            post.title.toLowerCase().includes(queryLower) ||
            post.content.toLowerCase().includes(queryLower) ||
            post.tags.some(tag => tag.toLowerCase().includes(queryLower))
        );
    }
    
    // 搜索用户
    if (type === 'all' || type === 'users') {
        results.users = sampleUsers.filter(user => 
            user.name.toLowerCase().includes(queryLower) ||
            user.bio.toLowerCase().includes(queryLower)
        );
    }
    
    // 搜索标签
    if (type === 'all' || type === 'tags') {
        results.tags = sampleTags.filter(tag => 
            tag.name.toLowerCase().includes(queryLower)
        );
    }
    
    // 排序结果
    results = sortResults(results, sortBy);
    
    // 过滤时间范围（这里简单模拟）
    results = filterByTimeRange(results, timeRange);
    
    return results;
}

// 排序结果
function sortResults(results, sortBy) {
    const sortedResults = { ...results };
    
    switch (sortBy) {
        case 'time':
            sortedResults.posts.sort((a, b) => {
                // 简单的时间排序（实际中应该使用时间戳）
                return b.id - a.id;
            });
            break;
        case 'popularity':
            sortedResults.posts.sort((a, b) => b.likes - a.likes);
            sortedResults.users.sort((a, b) => b.followers - a.followers);
            sortedResults.tags.sort((a, b) => b.count - a.count);
            break;
        case 'relevance':
        default:
            // 默认按相关性排序（这里简单实现）
            break;
    }
    
    return sortedResults;
}

// 按时间范围过滤
function filterByTimeRange(results, timeRange) {
    if (timeRange === 'all') {
        return results;
    }
    
    // 这里简单模拟时间过滤
    const filteredResults = { ...results };
    
    // 实际应用中应该根据真实的时间戳进行过滤
    if (timeRange === 'day') {
        filteredResults.posts = filteredResults.posts.filter(post => post.id <= 3);
    } else if (timeRange === 'week') {
        filteredResults.posts = filteredResults.posts.filter(post => post.id <= 5);
    }
    
    return filteredResults;
}

// 渲染搜索结果
function renderSearchResults(results) {
    const initial = document.getElementById('searchInitial');
    const resultsList = document.getElementById('resultsList');
    const noResults = document.getElementById('noResults');
    
    if (initial) initial.style.display = 'none';
    if (resultsList) resultsList.style.display = 'block';
    
    // 检查是否有结果
    const totalResults = results.posts.length + results.users.length + results.tags.length;
    
    if (totalResults === 0) {
        if (noResults) noResults.style.display = 'block';
        if (resultsList) resultsList.style.display = 'none';
        return;
    }
    
    if (noResults) noResults.style.display = 'none';
    
    // 渲染帖子结果
    renderPostsResults(results.posts);
    
    // 渲染用户结果
    renderUsersResults(results.users);
    
    // 渲染标签结果
    renderTagsResults(results.tags);
    
    // 更新加载更多按钮
    updateLoadMoreButton();
}

// 渲染帖子结果
function renderPostsResults(posts) {
    const postsList = document.getElementById('postsList');
    if (!postsList) return;
    
    if (posts.length === 0) {
        postsList.innerHTML = '<p class="no-items">暂无相关帖子</p>';
        document.getElementById('postsResults').style.display = 'none';
        return;
    }
    
    document.getElementById('postsResults').style.display = 'block';
    
    postsList.innerHTML = posts.map(post => `
        <div class="post-result-item" onclick="viewPost(${post.id})">
            <div class="post-result-header">
                <h3 class="post-result-title">${highlightText(post.title, currentQuery)}</h3>
                <div class="post-result-meta">
                    <span>${post.author}</span>
                    <span>${post.time}</span>
                    <span>${post.category}</span>
                </div>
            </div>
            <div class="post-result-preview">
                ${highlightText(truncateText(post.content, 150), currentQuery)}
            </div>
            <div class="post-result-stats">
                <span>👍 ${post.likes}</span>
                <span>💬 ${post.comments}</span>
                <span>👁️ ${post.views}</span>
            </div>
        </div>
    `).join('');
}

// 渲染用户结果
function renderUsersResults(users) {
    const usersList = document.getElementById('usersList');
    if (!usersList) return;
    
    if (users.length === 0) {
        usersList.innerHTML = '<p class="no-items">暂无相关用户</p>';
        document.getElementById('usersResults').style.display = 'none';
        return;
    }
    
    document.getElementById('usersResults').style.display = 'block';
    
    usersList.innerHTML = users.map(user => `
        <div class="user-result-item" onclick="viewUser(${user.id})">
            <div class="user-result-avatar">${user.avatar}</div>
            <h4 class="user-result-name">${highlightText(user.name, currentQuery)}</h4>
            <p class="user-result-bio">${highlightText(user.bio, currentQuery)}</p>
            <div class="user-result-stats">
                <span>帖子 ${user.posts}</span>
                <span>粉丝 ${user.followers}</span>
            </div>
        </div>
    `).join('');
}

// 渲染标签结果
function renderTagsResults(tags) {
    const tagsList = document.getElementById('tagsList');
    if (!tagsList) return;
    
    if (tags.length === 0) {
        tagsList.innerHTML = '<p class="no-items">暂无相关标签</p>';
        document.getElementById('tagsResults').style.display = 'none';
        return;
    }
    
    document.getElementById('tagsResults').style.display = 'block';
    
    tagsList.innerHTML = tags.map(tag => `
        <div class="tag-result-item" onclick="searchTag('${tag.name}')">
            ${highlightText(tag.name, currentQuery)}
            <span class="tag-result-count">${tag.count}</span>
        </div>
    `).join('');
}

// 高亮匹配文本
function highlightText(text, query) {
    if (!query) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

// 截断文本
function truncateText(text, length) {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

// 更新结果统计
function updateResultsCount(results) {
    const totalResults = results.posts.length + results.users.length + results.tags.length;
    const resultsCount = document.getElementById('resultsCount');
    const resultsTitle = document.getElementById('resultsTitle');
    
    if (resultsCount) {
        resultsCount.textContent = `${totalResults} 个结果`;
    }
    
    if (resultsTitle) {
        resultsTitle.textContent = `搜索 "${currentQuery}" 的结果`;
    }
}

// 显示加载状态
function showLoadingState() {
    const resultsList = document.getElementById('resultsList');
    if (resultsList) {
        resultsList.innerHTML = `
            <div class="search-loading">
                <div class="loading-spinner"></div>
                <p>正在搜索...</p>
            </div>
        `;
        resultsList.style.display = 'block';
    }
}

// 隐藏加载状态
function hideLoadingState() {
    // 加载状态会在renderSearchResults中被替换
}

// 更新加载更多按钮
function updateLoadMoreButton() {
    const loadMore = document.getElementById('loadMore');
    if (loadMore) {
        // 简单模拟是否有更多结果
        hasMoreResults = currentPage < 3; // 假设最多3页
        loadMore.style.display = hasMoreResults ? 'block' : 'none';
    }
}

// 加载更多结果
function loadMoreResults() {
    currentPage++;
    
    // 模拟加载更多数据
    setTimeout(() => {
        // 在实际应用中，这里会请求下一页数据
        showMessage(`已加载第 ${currentPage} 页结果`, 'info');
        updateLoadMoreButton();
    }, 1000);
}

// 查看帖子
function viewPost(postId) {
    showMessage('正在跳转到帖子页面...', 'info');
    setTimeout(() => {
        window.location.href = `post-detail.html?id=${postId}`;
    }, 1000);
}

// 查看用户
function viewUser(userId) {
    showMessage('正在跳转到用户主页...', 'info');
    setTimeout(() => {
        window.location.href = `profile.html?user=${userId}`;
    }, 1000);
}

// 搜索标签
function searchTag(tagName) {
    document.getElementById('searchInput').value = tagName;
    performSearch();
}

// 清除搜索
function clearSearch() {
    document.getElementById('searchInput').value = '';
    const initial = document.getElementById('searchInitial');
    const resultsList = document.getElementById('resultsList');
    const filters = document.getElementById('searchFilters');
    
    if (initial) initial.style.display = 'block';
    if (resultsList) resultsList.style.display = 'none';
    if (filters) filters.classList.remove('show');
    
    currentQuery = '';
    currentPage = 1;
}

// 搜索历史相关功能
function loadSearchHistory() {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
        searchHistory = JSON.parse(savedHistory);
    }
}

function saveSearchHistory() {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

function addToSearchHistory(query) {
    // 移除重复项
    searchHistory = searchHistory.filter(item => item !== query);
    
    // 添加到开头
    searchHistory.unshift(query);
    
    // 限制历史记录数量
    if (searchHistory.length > 10) {
        searchHistory = searchHistory.slice(0, 10);
    }
    
    saveSearchHistory();
    renderSearchHistory();
}

function renderSearchHistory() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    if (searchHistory.length === 0) {
        historyList.innerHTML = '<p class="no-history">暂无搜索历史</p>';
        return;
    }
    
    historyList.innerHTML = searchHistory.map(query => `
        <div class="history-item" onclick="searchFromHistory('${query}')">
            ${query}
        </div>
    `).join('');
}

function searchFromHistory(query) {
    document.getElementById('searchInput').value = query;
    performSearch();
}

function clearSearchHistory() {
    if (confirm('确定要清除所有搜索历史吗？')) {
        searchHistory = [];
        saveSearchHistory();
        renderSearchHistory();
        showMessage('搜索历史已清除', 'success');
    }
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
    .no-items {
        text-align: center;
        color: var(--text-secondary);
        padding: 20px;
        font-style: italic;
    }
    
    .no-history {
        text-align: center;
        color: var(--text-secondary);
        font-style: italic;
    }
`;
document.head.appendChild(style);