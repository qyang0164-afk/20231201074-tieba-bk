// 个人中心页JavaScript功能

// 全局变量
let currentTab = 'my-posts';
let currentFollowTab = 'followers';
let postsData = [];
let commentsData = [];
let favoritesData = [];
let draftsData = [];
let followersData = [];
let followingData = [];

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeProfilePage();
});

// 初始化个人中心页
function initializeProfilePage() {
    setupEventListeners();
    loadSampleData();
    setupTabNavigation();
    setupFollowTabNavigation();
    renderCurrentTab();
}

// 设置事件监听器
function setupEventListeners() {
    // 帖子筛选监听
    const postFilter = document.getElementById('postFilter');
    if (postFilter) {
        postFilter.addEventListener('change', function() {
            filterPosts(this.value);
        });
    }
}

// 设置标签页导航
function setupTabNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');
    
    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
}

// 设置关注标签页导航
function setupFollowTabNavigation() {
    const followTabs = document.querySelectorAll('.follow-tab');
    
    followTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const followType = this.getAttribute('data-follow');
            switchFollowTab(followType);
        });
    });
}

// 切换标签页
function switchTab(tabId) {
    // 移除所有标签的激活状态
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 隐藏所有内容区域
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 激活当前标签
    const currentTabElement = document.querySelector(`[data-tab="${tabId}"]`);
    if (currentTabElement) {
        currentTabElement.classList.add('active');
    }
    
    // 显示对应内容
    const contentElement = document.getElementById(tabId);
    if (contentElement) {
        contentElement.classList.add('active');
    }
    
    currentTab = tabId;
    
    // 渲染当前标签内容
    renderCurrentTab();
}

// 切换关注标签页
function switchFollowTab(followType) {
    // 移除所有关注标签的激活状态
    document.querySelectorAll('.follow-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 激活当前关注标签
    const currentFollowTabElement = document.querySelector(`[data-follow="${followType}"]`);
    if (currentFollowTabElement) {
        currentFollowTabElement.classList.add('active');
    }
    
    currentFollowTab = followType;
    
    // 渲染关注列表
    renderFollowList();
}

// 渲染当前标签内容
function renderCurrentTab() {
    switch (currentTab) {
        case 'my-posts':
            renderPostsList();
            break;
        case 'my-comments':
            renderCommentsList();
            break;
        case 'favorites':
            renderFavoritesList();
            break;
        case 'drafts':
            renderDraftsList();
            break;
        case 'followers':
            renderFollowList();
            break;
    }
}

// 加载示例数据
function loadSampleData() {
    // 帖子数据
    postsData = [
        {
            id: 1,
            title: '校园美食推荐：食堂最好吃的窗口',
            time: '2小时前',
            category: '生活服务',
            preview: '整理了学校各个食堂的特色美食，包括价格、口味评价和推荐指数...',
            likes: 128,
            comments: 56,
            views: 2300
        },
        {
            id: 2,
            title: '高数期末复习资料分享',
            time: '1天前',
            category: '学习交流',
            preview: '整理了近三年的高数期末试题和复习重点，希望对大家有帮助...',
            likes: 89,
            comments: 34,
            views: 1800
        },
        {
            id: 3,
            title: '校园社团招新活动预告',
            time: '3天前',
            category: '社团活动',
            preview: '下周将举行校园社团联合招新活动，各社团介绍和报名方式...',
            likes: 67,
            comments: 23,
            views: 1200
        }
    ];

    // 评论数据
    commentsData = [
        {
            id: 1,
            postTitle: '校园美食推荐：食堂最好吃的窗口',
            time: '1小时前',
            content: '感谢分享！三食堂的麻辣香锅确实不错，价格也实惠。'
        },
        {
            id: 2,
            postTitle: '高数期末复习资料分享',
            time: '5小时前',
            content: '资料很全面，请问有答案吗？'
        }
    ];

    // 收藏数据
    favoritesData = [
        {
            id: 1,
            title: '校园周边租房攻略',
            time: '2天前',
            preview: '详细介绍了学校周边的租房信息，包括价格、交通、环境等...'
        }
    ];

    // 草稿数据
    draftsData = [
        {
            id: 1,
            title: '校园摄影作品分享',
            time: '昨天 15:30',
            preview: '整理了最近拍摄的校园风景照片，包括图书馆、操场、樱花大道...'
        }
    ];

    // 粉丝数据
    followersData = [
        {
            id: 1,
            name: '学习小能手',
            bio: '热爱学习，乐于分享',
            avatar: 'https://via.placeholder.com/40x40'
        }
    ];

    // 关注数据
    followingData = [
        {
            id: 1,
            name: '校园达人',
            bio: '分享校园新鲜事',
            avatar: 'https://via.placeholder.com/40x40'
        }
    ];
}

// 渲染帖子列表
function renderPostsList() {
    const postsList = document.querySelector('#my-posts .posts-list');
    if (!postsList) return;

    postsList.innerHTML = '';

    if (postsData.length === 0) {
        postsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <h3>暂无帖子</h3>
                <p>您还没有发布过任何帖子</p>
                <button class="btn btn-primary" onclick="window.location.href='create-post.html'">去发帖</button>
            </div>
        `;
        return;
    }

    postsData.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post-item';
        postElement.innerHTML = `
            <div class="post-header">
                <h3 class="post-title">${post.title}</h3>
                <div class="post-meta">
                    <span class="post-time">${post.time}</span>
                    <span class="post-category">${post.category}</span>
                </div>
            </div>
            <div class="post-preview">${post.preview}</div>
            <div class="post-stats">
                <span class="stat">👍 ${post.likes}</span>
                <span class="stat">💬 ${post.comments}</span>
                <span class="stat">👁️ ${post.views}</span>
            </div>
            <div class="post-actions">
                <button class="btn btn-sm btn-secondary" onclick="editPost(${post.id})">编辑</button>
                <button class="btn btn-sm btn-danger" onclick="deletePost(${post.id})">删除</button>
            </div>
        `;
        postsList.appendChild(postElement);
    });
}

// 渲染评论列表
function renderCommentsList() {
    const commentsList = document.querySelector('#my-comments .comments-list');
    if (!commentsList) return;

    commentsList.innerHTML = '';

    if (commentsData.length === 0) {
        commentsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">💬</div>
                <h3>暂无评论</h3>
                <p>您还没有发表过任何评论</p>
            </div>
        `;
        return;
    }

    commentsData.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment-item';
        commentElement.innerHTML = `
            <div class="comment-header">
                <span class="comment-post">${comment.postTitle}</span>
                <span class="comment-time">${comment.time}</span>
            </div>
            <div class="comment-content">${comment.content}</div>
            <div class="comment-actions">
                <button class="btn btn-sm btn-secondary" onclick="viewPost(${comment.id})">查看帖子</button>
                <button class="btn btn-sm btn-danger" onclick="deleteComment(${comment.id})">删除</button>
            </div>
        `;
        commentsList.appendChild(commentElement);
    });
}

// 渲染收藏列表
function renderFavoritesList() {
    const favoritesList = document.querySelector('#favorites .favorites-list');
    if (!favoritesList) return;

    favoritesList.innerHTML = '';

    if (favoritesData.length === 0) {
        favoritesList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⭐</div>
                <h3>暂无收藏</h3>
                <p>您还没有收藏过任何帖子</p>
            </div>
        `;
        return;
    }

    favoritesData.forEach(favorite => {
        const favoriteElement = document.createElement('div');
        favoriteElement.className = 'favorite-item';
        favoriteElement.innerHTML = `
            <div class="favorite-header">
                <h3 class="favorite-title">${favorite.title}</h3>
                <span class="favorite-time">收藏于 ${favorite.time}</span>
            </div>
            <div class="favorite-preview">${favorite.preview}</div>
            <div class="favorite-actions">
                <button class="btn btn-sm btn-primary" onclick="viewPost(${favorite.id})">查看</button>
                <button class="btn btn-sm btn-danger" onclick="removeFavorite(${favorite.id})">取消收藏</button>
            </div>
        `;
        favoritesList.appendChild(favoriteElement);
    });
}

// 渲染草稿列表
function renderDraftsList() {
    const draftsList = document.querySelector('#drafts .drafts-list');
    if (!draftsList) return;

    draftsList.innerHTML = '';

    if (draftsData.length === 0) {
        draftsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📄</div>
                <h3>暂无草稿</h3>
                <p>您还没有保存任何草稿</p>
            </div>
        `;
        return;
    }

    draftsData.forEach(draft => {
        const draftElement = document.createElement('div');
        draftElement.className = 'draft-item';
        draftElement.innerHTML = `
            <div class="draft-header">
                <h3 class="draft-title">${draft.title}</h3>
                <span class="draft-time">保存于 ${draft.time}</span>
            </div>
            <div class="draft-preview">${draft.preview}</div>
            <div class="draft-actions">
                <button class="btn btn-sm btn-primary" onclick="continueEditing(${draft.id})">继续编辑</button>
                <button class="btn btn-sm btn-danger" onclick="deleteDraft(${draft.id})">删除</button>
            </div>
        `;
        draftsList.appendChild(draftElement);
    });
}

// 渲染关注列表
function renderFollowList() {
    const followersList = document.querySelector('#followers .followers-list');
    if (!followersList) return;

    followersList.innerHTML = '';

    const data = currentFollowTab === 'followers' ? followersData : followingData;
    const emptyIcon = currentFollowTab === 'followers' ? '👥' : '👤';
    const emptyTitle = currentFollowTab === 'followers' ? '暂无粉丝' : '暂无关注';
    const emptyMessage = currentFollowTab === 'followers' ? '您还没有粉丝' : '您还没有关注任何人';

    if (data.length === 0) {
        followersList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">${emptyIcon}</div>
                <h3>${emptyTitle}</h3>
                <p>${emptyMessage}</p>
            </div>
        `;
        return;
    }

    data.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = 'follower-item';
        userElement.innerHTML = `
            <div class="follower-info">
                <img src="${user.avatar}" alt="用户头像" class="follower-avatar">
                <div class="follower-details">
                    <h4 class="follower-name">${user.name}</h4>
                    <p class="follower-bio">${user.bio}</p>
                </div>
            </div>
            <div class="follower-actions">
                <button class="btn btn-sm btn-secondary" onclick="sendMessage(${user.id})">私信</button>
                <button class="btn btn-sm btn-primary" onclick="followUser(${user.id})">${currentFollowTab === 'followers' ? '回关' : '取消关注'}</button>
            </div>
        `;
        followersList.appendChild(userElement);
    });
}

// 筛选帖子
function filterPosts(filterType) {
    let filteredPosts = [...postsData];

    switch (filterType) {
        case 'recent':
            // 按时间排序（这里简单模拟）
            filteredPosts.sort((a, b) => {
                const timeA = getTimeValue(a.time);
                const timeB = getTimeValue(b.time);
                return timeB - timeA;
            });
            break;
        case 'popular':
            // 按热度排序
            filteredPosts.sort((a, b) => b.likes - a.likes);
            break;
        case 'draft':
            // 显示草稿（这里简单模拟）
            filteredPosts = filteredPosts.filter(post => post.time.includes('保存'));
            break;
    }

    // 重新渲染帖子列表
    const postsList = document.querySelector('#my-posts .posts-list');
    if (postsList) {
        postsList.innerHTML = '';
        filteredPosts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post-item';
            postElement.innerHTML = `
                <div class="post-header">
                    <h3 class="post-title">${post.title}</h3>
                    <div class="post-meta">
                        <span class="post-time">${post.time}</span>
                        <span class="post-category">${post.category}</span>
                    </div>
                </div>
                <div class="post-preview">${post.preview}</div>
                <div class="post-stats">
                    <span class="stat">👍 ${post.likes}</span>
                    <span class="stat">💬 ${post.comments}</span>
                    <span class="stat">👁️ ${post.views}</span>
                </div>
                <div class="post-actions">
                    <button class="btn btn-sm btn-secondary" onclick="editPost(${post.id})">编辑</button>
                    <button class="btn btn-sm btn-danger" onclick="deletePost(${post.id})">删除</button>
                </div>
            `;
            postsList.appendChild(postElement);
        });
    }
}

// 获取时间值（用于排序）
function getTimeValue(timeString) {
    if (timeString.includes('小时')) {
        return parseInt(timeString) * 60 * 60 * 1000;
    } else if (timeString.includes('天')) {
        return parseInt(timeString) * 24 * 60 * 60 * 1000;
    }
    return 0;
}

// 编辑帖子
function editPost(postId) {
    showMessage('正在跳转到编辑页面...', 'info');
    // 在实际应用中，这里会跳转到编辑页面
    setTimeout(() => {
        window.location.href = `create-post.html?edit=${postId}`;
    }, 1000);
}

// 删除帖子
function deletePost(postId) {
    if (confirm('确定要删除这个帖子吗？此操作不可恢复。')) {
        showMessage('正在删除帖子...', 'info');
        
        // 模拟删除操作
        setTimeout(() => {
            postsData = postsData.filter(post => post.id !== postId);
            renderPostsList();
            showMessage('帖子删除成功', 'success');
        }, 1000);
    }
}

// 查看帖子
function viewPost(postId) {
    showMessage('正在跳转到帖子页面...', 'info');
    setTimeout(() => {
        window.location.href = `post-detail.html?id=${postId}`;
    }, 1000);
}

// 删除评论
function deleteComment(commentId) {
    if (confirm('确定要删除这个评论吗？')) {
        showMessage('正在删除评论...', 'info');
        
        // 模拟删除操作
        setTimeout(() => {
            commentsData = commentsData.filter(comment => comment.id !== commentId);
            renderCommentsList();
            showMessage('评论删除成功', 'success');
        }, 1000);
    }
}

// 取消收藏
function removeFavorite(favoriteId) {
    if (confirm('确定要取消收藏吗？')) {
        showMessage('正在取消收藏...', 'info');
        
        // 模拟取消收藏操作
        setTimeout(() => {
            favoritesData = favoritesData.filter(favorite => favorite.id !== favoriteId);
            renderFavoritesList();
            showMessage('已取消收藏', 'success');
        }, 1000);
    }
}

// 继续编辑草稿
function continueEditing(draftId) {
    showMessage('正在加载草稿...', 'info');
    setTimeout(() => {
        window.location.href = `create-post.html?draft=${draftId}`;
    }, 1000);
}

// 删除草稿
function deleteDraft(draftId) {
    if (confirm('确定要删除这个草稿吗？此操作不可恢复。')) {
        showMessage('正在删除草稿...', 'info');
        
        // 模拟删除操作
        setTimeout(() => {
            draftsData = draftsData.filter(draft => draft.id !== draftId);
            renderDraftsList();
            showMessage('草稿删除成功', 'success');
        }, 1000);
    }
}

// 发送私信
function sendMessage(userId) {
    showMessage('正在打开私信对话框...', 'info');
    // 在实际应用中，这里会打开私信对话框
}

// 关注/取消关注用户
function followUser(userId) {
    const isFollowing = currentFollowTab === 'following';
    const action = isFollowing ? '取消关注' : '关注';
    
    if (confirm(`确定要${action}这个用户吗？`)) {
        showMessage(`正在${action}用户...`, 'info');
        
        // 模拟关注/取消关注操作
        setTimeout(() => {
            if (isFollowing) {
                followingData = followingData.filter(user => user.id !== userId);
            } else {
                // 模拟添加关注
                const userToFollow = followersData.find(user => user.id === userId);
                if (userToFollow) {
                    followingData.push({...userToFollow});
                }
            }
            renderFollowList();
            showMessage(`${action}成功`, 'success');
        }, 1000);
    }
}

// 编辑头像
function editAvatar() {
    showMessage('正在打开头像编辑功能...', 'info');
    // 在实际应用中，这里会打开头像编辑对话框
}

// 编辑资料
function editProfile() {
    showMessage('正在跳转到资料编辑页面...', 'info');
    setTimeout(() => {
        window.location.href = 'settings.html?tab=profile';
    }, 1000);
}

// 打开设置
function openSettings() {
    showMessage('正在跳转到设置页面...', 'info');
    setTimeout(() => {
        window.location.href = 'settings.html';
    }, 1000);
}

// 加载更多帖子
function loadMorePosts() {
    showMessage('正在加载更多帖子...', 'info');
    
    // 模拟加载更多数据
    setTimeout(() => {
        const newPosts = [
            {
                id: postsData.length + 1,
                title: '新增测试帖子',
                time: '刚刚',
                category: '测试',
                preview: '这是模拟加载的更多帖子内容...',
                likes: 0,
                comments: 0,
                views: 1
            }
        ];
        
        postsData = [...postsData, ...newPosts];
        renderPostsList();
        showMessage('加载完成', 'success');
    }, 1500);
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