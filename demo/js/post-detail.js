// 帖子详情页专用JavaScript

// 帖子数据
let currentPost = {
    id: '1',
    title: '校园文化艺术节即将开幕，欢迎大家踊跃参与！',
    content: `亲爱的同学们：

一年一度的校园文化艺术节即将在下周五（12月15日）盛大开幕！本次艺术节将为大家带来丰富多彩的文化活动，包括：

• 音乐表演：校园乐队专场演出、合唱比赛
• 舞蹈展示：民族舞、现代舞、街舞表演
• 戏剧演出：话剧社原创剧目《青春之歌》
• 美术展览：学生艺术作品展
• 互动体验：传统文化体验区、手工艺制作

活动时间：12月15日 下午2:00-6:00
活动地点：学校大礼堂及周边广场

欢迎大家踊跃参与，共同营造浓厚的校园文化氛围！

艺术节组委会
2024年12月10日`,
    author: '张三',
    time: '2小时前',
    likes: 45,
    comments: 23,
    views: 156,
    favorites: 12,
    tags: ['校园新闻', '活动', '官方通知'],
    isLiked: false,
    isFavorited: false,
    isFollowing: false
};

// 评论数据
let comments = [
    {
        id: '1',
        author: '李四',
        avatar: 'images/avatar2.jpg',
        time: '1小时前',
        content: '太期待了！去年艺术节就特别精彩，今年一定要参加！',
        likes: 8,
        isLiked: false
    },
    {
        id: '2',
        author: '王五',
        avatar: 'images/avatar3.jpg',
        time: '45分钟前',
        content: '请问需要提前报名吗？还是直接去参加就可以？',
        likes: 5,
        isLiked: false
    },
    {
        id: '3',
        author: '赵六',
        avatar: 'images/avatar4.jpg',
        time: '30分钟前',
        content: '我们乐队会参加演出，欢迎大家来支持！🎸',
        likes: 15,
        isLiked: false
    }
];

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    initializePostDetail();
    setupPostDetailEvents();
    renderPostData();
    renderComments();
});

// 初始化帖子详情页
function initializePostDetail() {
    console.log('初始化帖子详情页...');
    
    // 从URL获取帖子ID
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    if (postId) {
        // 根据ID加载对应帖子数据
        loadPostData(postId);
    }
    
    // 更新页面标题
    updatePostTitle();
}

// 设置事件监听器
function setupPostDetailEvents() {
    // 点赞按钮
    const likeBtn = document.querySelector('.like-btn');
    if (likeBtn) {
        likeBtn.addEventListener('click', toggleLike);
    }
    
    // 收藏按钮
    const favoriteBtn = document.querySelector('.favorite-btn');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', toggleFavorite);
    }
    
    // 评论按钮
    const commentBtn = document.querySelector('.comment-btn');
    if (commentBtn) {
        commentBtn.addEventListener('click', scrollToComments);
    }
    
    // 关注作者按钮
    const followBtn = document.querySelector('.btn-secondary');
    if (followBtn && followBtn.textContent.includes('关注')) {
        followBtn.addEventListener('click', followAuthor);
    }
    
    // 分享按钮
    const shareBtn = document.querySelector('.btn-secondary:nth-child(2)');
    if (shareBtn && shareBtn.textContent.includes('分享')) {
        shareBtn.addEventListener('click', sharePost);
    }
}

// 加载帖子数据
function loadPostData(postId) {
    // 模拟API调用
    console.log(`加载帖子数据: ${postId}`);
    
    // 这里可以添加实际的API调用逻辑
    // 暂时使用模拟数据
    currentPost.id = postId;
}

// 渲染帖子数据
function renderPostData() {
    // 更新帖子标题
    const postTitle = document.querySelector('.post-title');
    if (postTitle) {
        postTitle.textContent = currentPost.title;
    }
    
    // 更新帖子内容
    const postBody = document.querySelector('.post-body');
    if (postBody) {
        // 将文本内容转换为HTML格式
        const formattedContent = formatPostContent(currentPost.content);
        postBody.innerHTML = formattedContent;
    }
    
    // 更新统计信息
    updatePostStats();
    
    // 更新标签
    renderPostTags();
}

// 格式化帖子内容
function formatPostContent(content) {
    // 将换行符转换为段落
    const paragraphs = content.split('\n\n');
    let html = '';
    
    paragraphs.forEach(paragraph => {
        if (paragraph.trim()) {
            // 处理列表项
            if (paragraph.includes('•')) {
                const lines = paragraph.split('\n');
                html += '<ul>';
                lines.forEach(line => {
                    if (line.includes('•')) {
                        const item = line.replace('•', '').trim();
                        html += `<li>${formatText(item)}</li>`;
                    }
                });
                html += '</ul>';
            } else {
                // 普通段落
                html += `<p>${formatText(paragraph)}</p>`;
            }
        }
    });
    
    return html;
}

// 格式化文本（加粗等）
function formatText(text) {
    // 简单的文本格式化
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **粗体**
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // *斜体*
        .replace(/`(.*?)`/g, '<code>$1</code>'); // `代码`
}

// 更新帖子统计信息
function updatePostStats() {
    const likeBtn = document.querySelector('.like-btn');
    const favoriteBtn = document.querySelector('.favorite-btn');
    const commentBtn = document.querySelector('.comment-btn');
    
    if (likeBtn) {
        const count = likeBtn.querySelector('.count');
        if (count) {
            count.textContent = currentPost.likes;
        }
        
        // 更新点赞状态
        if (currentPost.isLiked) {
            likeBtn.classList.add('active');
        } else {
            likeBtn.classList.remove('active');
        }
    }
    
    if (favoriteBtn) {
        const count = favoriteBtn.querySelector('.count');
        if (count) {
            count.textContent = currentPost.favorites;
        }
        
        // 更新收藏状态
        if (currentPost.isFavorited) {
            favoriteBtn.classList.add('active');
        } else {
            favoriteBtn.classList.remove('active');
        }
    }
    
    if (commentBtn) {
        const count = commentBtn.querySelector('.count');
        if (count) {
            count.textContent = currentPost.comments;
        }
    }
}

// 渲染帖子标签
function renderPostTags() {
    const tagsContainer = document.querySelector('.post-tags');
    if (!tagsContainer) return;
    
    tagsContainer.innerHTML = '';
    
    currentPost.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
    });
}

// 渲染评论
function renderComments() {
    const commentsList = document.querySelector('.comments-list');
    if (!commentsList) return;
    
    commentsList.innerHTML = '';
    
    comments.forEach(comment => {
        const commentElement = createCommentElement(comment);
        commentsList.appendChild(commentElement);
    });
    
    // 更新评论数量
    updateCommentsCount();
}

// 创建评论元素
function createCommentElement(comment) {
    const div = document.createElement('div');
    div.className = 'comment-item';
    div.innerHTML = `
        <div class="comment-meta">
            <img src="${comment.avatar}" alt="用户头像" class="comment-avatar">
            <div class="comment-info">
                <span class="comment-author">${comment.author}</span>
                <span class="comment-time">${comment.time}</span>
            </div>
        </div>
        <div class="comment-content">
            <p>${comment.content}</p>
        </div>
        <div class="comment-actions">
            <button class="action-btn" onclick="likeComment('${comment.id}')">
                <span class="icon">👍</span> ${comment.likes}
            </button>
            <button class="action-btn" onclick="replyComment('${comment.id}')">
                <span class="icon">↩️</span> 回复
            </button>
        </div>
    `;
    
    return div;
}

// 更新评论数量
function updateCommentsCount() {
    const commentsHeader = document.querySelector('.comments-header h2');
    if (commentsHeader) {
        commentsHeader.textContent = `评论 (${comments.length})`;
    }
    
    // 更新帖子评论数
    currentPost.comments = comments.length;
    updatePostStats();
}

// 点赞/取消点赞帖子
function toggleLike() {
    if (!currentUser) {
        showToast('请先登录后再点赞', 'warning');
        return;
    }
    
    currentPost.isLiked = !currentPost.isLiked;
    
    if (currentPost.isLiked) {
        currentPost.likes++;
        showToast('点赞成功！', 'success');
    } else {
        currentPost.likes--;
        showToast('已取消点赞', 'info');
    }
    
    updatePostStats();
}

// 收藏/取消收藏帖子
function toggleFavorite() {
    if (!currentUser) {
        showToast('请先登录后再收藏', 'warning');
        return;
    }
    
    currentPost.isFavorited = !currentPost.isFavorited;
    
    if (currentPost.isFavorited) {
        currentPost.favorites++;
        showToast('收藏成功！', 'success');
    } else {
        currentPost.favorites--;
        showToast('已取消收藏', 'info');
    }
    
    updatePostStats();
}

// 滚动到评论区
function scrollToComments() {
    const commentsSection = document.querySelector('.comments-section');
    if (commentsSection) {
        commentsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 关注作者
function followAuthor() {
    if (!currentUser) {
        showToast('请先登录后再关注', 'warning');
        return;
    }
    
    currentPost.isFollowing = !currentPost.isFollowing;
    
    const followBtn = document.querySelector('.btn-secondary');
    if (followBtn) {
        if (currentPost.isFollowing) {
            followBtn.innerHTML = '<span class="icon">👤</span> 已关注';
            showToast('关注成功！', 'success');
        } else {
            followBtn.innerHTML = '<span class="icon">👤</span> 关注';
            showToast('已取消关注', 'info');
        }
    }
}

// 分享帖子
function sharePost() {
    if (navigator.share) {
        // 使用Web Share API
        navigator.share({
            title: currentPost.title,
            text: currentPost.content.substring(0, 100) + '...',
            url: window.location.href
        })
        .then(() => showToast('分享成功！', 'success'))
        .catch(() => showToast('分享取消', 'info'));
    } else {
        // 备用分享方式
        const shareUrl = window.location.href;
        navigator.clipboard.writeText(shareUrl)
            .then(() => showToast('链接已复制到剪贴板', 'success'))
            .catch(() => {
                // 如果复制失败，显示链接
                prompt('复制以下链接分享给朋友：', shareUrl);
            });
    }
}

// 显示评论表单
function showCommentForm() {
    if (!currentUser) {
        showToast('请先登录后再评论', 'warning');
        window.location.href = 'login.html';
        return;
    }
    
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.style.display = 'block';
        commentForm.scrollIntoView({ behavior: 'smooth' });
        
        // 聚焦到评论框
        const textarea = commentForm.querySelector('textarea');
        if (textarea) {
            textarea.focus();
        }
    }
}

// 隐藏评论表单
function hideCommentForm() {
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.style.display = 'none';
        
        // 清空内容
        const textarea = commentForm.querySelector('textarea');
        if (textarea) {
            textarea.value = '';
        }
    }
}

// 提交评论
function submitComment() {
    const commentForm = document.getElementById('commentForm');
    if (!commentForm) return;
    
    const textarea = commentForm.querySelector('textarea');
    const content = textarea.value.trim();
    
    if (!content) {
        showToast('请输入评论内容', 'warning');
        return;
    }
    
    if (content.length > 500) {
        showToast('评论内容不能超过500字', 'warning');
        return;
    }
    
    // 创建新评论
    const newComment = {
        id: Date.now().toString(),
        author: currentUser.username,
        avatar: currentUser.avatar,
        time: '刚刚',
        content: content,
        likes: 0,
        isLiked: false
    };
    
    // 添加到评论列表开头
    comments.unshift(newComment);
    
    // 重新渲染评论
    renderComments();
    
    // 隐藏表单
    hideCommentForm();
    
    showToast('评论发布成功！', 'success');
}

// 点赞评论
function likeComment(commentId) {
    if (!currentUser) {
        showToast('请先登录后再点赞', 'warning');
        return;
    }
    
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
        comment.isLiked = !comment.isLiked;
        
        if (comment.isLiked) {
            comment.likes++;
        } else {
            comment.likes--;
        }
        
        // 重新渲染评论
        renderComments();
    }
}

// 回复评论
function replyComment(commentId) {
    if (!currentUser) {
        showToast('请先登录后再回复', 'warning');
        return;
    }
    
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
        showCommentForm();
        
        const textarea = document.querySelector('#commentForm textarea');
        if (textarea) {
            textarea.value = `回复 @${comment.author}: `;
            textarea.focus();
        }
    }
}

// 加载更多评论
function loadMoreComments() {
    // 模拟加载更多评论
    const newComments = [
        {
            id: '4',
            author: '钱七',
            avatar: 'images/avatar5.jpg',
            time: '25分钟前',
            content: '有志愿者招募吗？想参与活动组织工作',
            likes: 3,
            isLiked: false
        },
        {
            id: '5',
            author: '孙八',
            avatar: 'images/avatar6.jpg',
            time: '20分钟前',
            content: '期待美术展览，去年有很多优秀的作品',
            likes: 7,
            isLiked: false
        }
    ];
    
    comments.push(...newComments);
    renderComments();
    
    showToast('加载了2条新评论', 'info');
}

// 更新页面标题
function updatePostTitle() {
    document.title = `${currentPost.title} - 校园贴吧`;
}

// 导出全局函数
window.toggleLike = toggleLike;
window.toggleFavorite = toggleFavorite;
window.scrollToComments = scrollToComments;
window.followAuthor = followAuthor;
window.sharePost = sharePost;
window.showCommentForm = showCommentForm;
window.hideCommentForm = hideCommentForm;
window.submitComment = submitComment;
window.likeComment = likeComment;
window.replyComment = replyComment;
window.loadMoreComments = loadMoreComments;