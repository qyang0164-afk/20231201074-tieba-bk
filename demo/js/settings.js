// 设置页面JavaScript
class SettingsPage {
    constructor() {
        this.currentTab = 'account';
        this.settingsData = this.loadSettings();
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadCurrentTab();
        this.initPasswordStrength();
        this.initThemeOptions();
    }

    // 绑定事件
    bindEvents() {
        // 标签页切换
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });

        // 账户设置
        document.getElementById('saveAccount').addEventListener('click', () => {
            this.saveAccountSettings();
        });

        document.getElementById('resetAccount').addEventListener('click', () => {
            this.resetAccountSettings();
        });

        // 头像操作
        document.getElementById('changeAvatar').addEventListener('click', () => {
            this.changeAvatar();
        });

        document.getElementById('removeAvatar').addEventListener('click', () => {
            this.removeAvatar();
        });

        // 隐私设置
        document.getElementById('savePrivacy').addEventListener('click', () => {
            this.savePrivacySettings();
        });

        document.getElementById('downloadData').addEventListener('click', () => {
            this.downloadData();
        });

        document.getElementById('deleteData').addEventListener('click', () => {
            this.deleteData();
        });

        // 通知设置
        document.getElementById('saveNotifications').addEventListener('click', () => {
            this.saveNotificationSettings();
        });

        // 外观设置
        document.getElementById('saveAppearance').addEventListener('click', () => {
            this.saveAppearanceSettings();
        });

        // 安全设置
        document.getElementById('changePassword').addEventListener('click', () => {
            this.changePassword();
        });

        document.getElementById('logoutAll').addEventListener('click', () => {
            this.logoutAllDevices();
        });

        // 关于页面
        document.getElementById('checkUpdate').addEventListener('click', () => {
            this.checkUpdate();
        });

        document.getElementById('rateApp').addEventListener('click', () => {
            this.rateApp();
        });

        document.getElementById('shareApp').addEventListener('click', () => {
            this.shareApp();
        });

        document.getElementById('viewLicense').addEventListener('click', () => {
            this.viewLicense();
        });

        // 密码强度检测
        const passwordInputs = ['newPassword', 'confirmPassword'];
        passwordInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => {
                    this.updatePasswordStrength();
                });
            }
        });
    }

    // 切换标签页
    switchTab(tab) {
        if (this.currentTab === tab) return;

        // 移除当前激活状态
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelectorAll('.settings-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // 添加新激活状态
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        document.getElementById(tab).classList.add('active');

        this.currentTab = tab;
        this.saveCurrentTab();
    }

    // 加载当前标签页
    loadCurrentTab() {
        const savedTab = localStorage.getItem('currentSettingsTab') || 'account';
        this.switchTab(savedTab);
    }

    // 保存当前标签页
    saveCurrentTab() {
        localStorage.setItem('currentSettingsTab', this.currentTab);
    }

    // 加载设置数据
    loadSettings() {
        const defaultSettings = {
            account: {
                username: '校园小助手',
                email: 'user@campus.com',
                bio: '热爱学习，乐于分享校园生活经验',
                language: 'zh-CN',
                timezone: 'Asia/Shanghai',
                emailNotifications: true,
                newsletter: true
            },
            privacy: {
                profileVisibility: 'public',
                postVisibility: 'public',
                allowMessages: true,
                allowFollow: true,
                showOnlineStatus: true,
                showActivity: true
            },
            notifications: {
                pushEnabled: true,
                pushReplies: true,
                pushLikes: true,
                pushFollows: true,
                pushSystem: true,
                emailReplies: true,
                emailDigest: true,
                emailNews: true,
                dndEnabled: false,
                dndStart: '22:00',
                dndEnd: '07:00'
            },
            appearance: {
                theme: 'light',
                fontSize: 'medium',
                fontFamily: 'system',
                compactMode: false,
                sidebarCollapsed: true,
                animationsEnabled: true
            },
            security: {
                twoFactorAuth: false,
                loginAlerts: true,
                rememberMe: true
            }
        };

        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
            return { ...defaultSettings, ...JSON.parse(savedSettings) };
        }
        return defaultSettings;
    }

    // 保存设置数据
    saveSettings() {
        localStorage.setItem('userSettings', JSON.stringify(this.settingsData));
    }

    // 账户设置相关方法
    saveAccountSettings() {
        const accountData = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            bio: document.getElementById('bio').value,
            language: document.getElementById('language').value,
            timezone: document.getElementById('timezone').value,
            emailNotifications: document.getElementById('emailNotifications').checked,
            newsletter: document.getElementById('newsletter').checked
        };

        this.settingsData.account = accountData;
        this.saveSettings();
        this.showMessage('账户设置已保存', 'success');
    }

    resetAccountSettings() {
        document.getElementById('username').value = '校园小助手';
        document.getElementById('email').value = 'user@campus.com';
        document.getElementById('bio').value = '热爱学习，乐于分享校园生活经验';
        document.getElementById('language').value = 'zh-CN';
        document.getElementById('timezone').value = 'Asia/Shanghai';
        document.getElementById('emailNotifications').checked = true;
        document.getElementById('newsletter').checked = true;
        
        this.showMessage('账户设置已重置', 'info');
    }

    changeAvatar() {
        // 模拟头像上传
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    // 在实际应用中，这里会上传到服务器
                    this.showMessage('头像上传成功', 'success');
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    removeAvatar() {
        if (confirm('确定要移除当前头像吗？')) {
            // 重置为默认头像
            this.showMessage('头像已移除', 'success');
        }
    }

    // 隐私设置相关方法
    savePrivacySettings() {
        const privacyData = {
            profileVisibility: document.getElementById('profileVisibility').value,
            postVisibility: document.getElementById('postVisibility').value,
            allowMessages: document.getElementById('allowMessages').checked,
            allowFollow: document.getElementById('allowFollow').checked,
            showOnlineStatus: document.getElementById('showOnlineStatus').checked,
            showActivity: document.getElementById('showActivity').checked
        };

        this.settingsData.privacy = privacyData;
        this.saveSettings();
        this.showMessage('隐私设置已保存', 'success');
    }

    downloadData() {
        // 模拟数据下载
        const data = {
            userInfo: this.settingsData.account,
            posts: [], // 在实际应用中，这里会包含用户的所有帖子数据
            comments: [], // 评论数据
            messages: [] // 私信数据
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'user_data.json';
        a.click();
        URL.revokeObjectURL(url);
        
        this.showMessage('数据下载已开始', 'success');
    }

    deleteData() {
        if (confirm('确定要删除账户数据吗？此操作不可撤销！')) {
            // 在实际应用中，这里会调用API删除用户数据
            localStorage.removeItem('userSettings');
            this.showMessage('账户数据已删除', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    }

    // 通知设置相关方法
    saveNotificationSettings() {
        const notificationData = {
            pushEnabled: document.getElementById('pushEnabled').checked,
            pushReplies: document.getElementById('pushReplies').checked,
            pushLikes: document.getElementById('pushLikes').checked,
            pushFollows: document.getElementById('pushFollows').checked,
            pushSystem: document.getElementById('pushSystem').checked,
            emailReplies: document.getElementById('emailReplies').checked,
            emailDigest: document.getElementById('emailDigest').checked,
            emailNews: document.getElementById('emailNews').checked,
            dndEnabled: document.getElementById('dndEnabled').checked,
            dndStart: document.getElementById('dndStart').value,
            dndEnd: document.getElementById('dndEnd').value
        };

        this.settingsData.notifications = notificationData;
        this.saveSettings();
        this.showMessage('通知设置已保存', 'success');
    }

    // 外观设置相关方法
    initThemeOptions() {
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.theme-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                option.classList.add('active');
                
                const theme = option.dataset.theme;
                this.applyTheme(theme);
            });
        });
    }

    applyTheme(theme) {
        // 在实际应用中，这里会应用主题样式
        document.documentElement.setAttribute('data-theme', theme);
        this.settingsData.appearance.theme = theme;
        this.saveSettings();
    }

    saveAppearanceSettings() {
        const appearanceData = {
            theme: document.querySelector('.theme-option.active')?.dataset.theme || 'light',
            fontSize: document.getElementById('fontSize').value,
            fontFamily: document.getElementById('fontFamily').value,
            compactMode: document.getElementById('compactMode').checked,
            sidebarCollapsed: document.getElementById('sidebarCollapsed').checked,
            animationsEnabled: document.getElementById('animationsEnabled').checked
        };

        this.settingsData.appearance = appearanceData;
        this.saveSettings();
        this.applyAppearanceSettings(appearanceData);
        this.showMessage('外观设置已保存', 'success');
    }

    applyAppearanceSettings(settings) {
        // 应用字体大小
        document.documentElement.style.fontSize = this.getFontSizeValue(settings.fontSize);
        
        // 应用字体家族
        document.documentElement.style.fontFamily = this.getFontFamilyValue(settings.fontFamily);
        
        // 应用紧凑模式
        if (settings.compactMode) {
            document.body.classList.add('compact-mode');
        } else {
            document.body.classList.remove('compact-mode');
        }
        
        // 应用动画设置
        if (!settings.animationsEnabled) {
            document.body.classList.add('no-animations');
        } else {
            document.body.classList.remove('no-animations');
        }
    }

    getFontSizeValue(size) {
        const sizes = {
            'small': '14px',
            'medium': '16px',
            'large': '18px',
            'xlarge': '20px'
        };
        return sizes[size] || '16px';
    }

    getFontFamilyValue(family) {
        const families = {
            'system': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            'sans-serif': 'Arial, sans-serif',
            'serif': 'Georgia, serif',
            'monospace': 'Monaco, Consolas, monospace'
        };
        return families[family] || families.system;
    }

    // 安全设置相关方法
    initPasswordStrength() {
        this.updatePasswordStrength();
    }

    updatePasswordStrength() {
        const password = document.getElementById('newPassword').value;
        const strength = this.calculatePasswordStrength(password);
        
        const strengthBar = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');
        
        if (strengthBar && strengthText) {
            strengthBar.setAttribute('data-strength', strength);
            
            const texts = ['密码强度：弱', '密码强度：一般', '密码强度：中等', '密码强度：强'];
            strengthText.textContent = texts[strength - 1] || '密码强度：弱';
        }
    }

    calculatePasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;
        
        return Math.min(strength, 4);
    }

    changePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (!currentPassword) {
            this.showMessage('请输入当前密码', 'error');
            return;
        }
        
        if (!newPassword) {
            this.showMessage('请输入新密码', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            this.showMessage('两次输入的密码不一致', 'error');
            return;
        }
        
        if (this.calculatePasswordStrength(newPassword) < 2) {
            this.showMessage('密码强度不足，请使用更复杂的密码', 'error');
            return;
        }
        
        // 在实际应用中，这里会调用API更改密码
        this.showMessage('密码更改成功', 'success');
        
        // 清空密码字段
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        this.updatePasswordStrength();
    }

    logoutAllDevices() {
        if (confirm('确定要退出所有设备吗？当前设备也会被退出。')) {
            // 在实际应用中，这里会调用API退出所有设备
            localStorage.removeItem('userSettings');
            this.showMessage('已退出所有设备', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    }

    // 关于页面相关方法
    checkUpdate() {
        // 模拟检查更新
        this.showMessage('已是最新版本', 'info');
    }

    rateApp() {
        // 模拟应用评分
        window.open('https://example.com/rate', '_blank');
    }

    shareApp() {
        // 模拟分享应用
        if (navigator.share) {
            navigator.share({
                title: '校园贴吧',
                text: '发现这个超棒的校园社交应用！',
                url: 'https://campus-tieba.com'
            });
        } else {
            // 备用分享方式
            const shareUrl = 'https://campus-tieba.com';
            navigator.clipboard.writeText(shareUrl);
            this.showMessage('分享链接已复制到剪贴板', 'success');
        }
    }

    viewLicense() {
        // 显示许可协议
        window.open('https://opensource.org/licenses/MIT', '_blank');
    }

    // 通用工具方法
    showMessage(message, type = 'info') {
        // 创建消息提示
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        
        // 添加样式
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        // 设置背景色
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8',
            warning: '#ffc107'
        };
        messageDiv.style.background = colors[type] || colors.info;
        
        document.body.appendChild(messageDiv);
        
        // 3秒后自动消失
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    }
}

// 添加消息动画样式
const messageStyles = document.createElement('style');
messageStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .compact-mode * {
        line-height: 1.2 !important;
        margin: 2px 0 !important;
        padding: 4px 8px !important;
    }
    
    .no-animations * {
        animation: none !important;
        transition: none !important;
    }
`;
document.head.appendChild(messageStyles);

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new SettingsPage();
});