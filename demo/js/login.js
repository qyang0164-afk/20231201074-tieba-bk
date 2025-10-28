// 登录注册页JavaScript功能

// 全局变量
let currentForm = 'login';

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeAuthPage();
});

// 初始化认证页面
function initializeAuthPage() {
    setupEventListeners();
    setupFormValidation();
    checkRememberMe();
}

// 设置事件监听器
function setupEventListeners() {
    // 登录表单提交
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // 注册表单提交
    const registerForm = document.getElementById('registerFormElement');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // 实时验证
    setupRealTimeValidation();
}

// 设置表单验证
function setupFormValidation() {
    // 登录表单验证
    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');
    
    if (loginUsername) {
        loginUsername.addEventListener('blur', validateLoginUsername);
    }
    
    if (loginPassword) {
        loginPassword.addEventListener('blur', validateLoginPassword);
    }
    
    // 注册表单验证
    const registerUsername = document.getElementById('registerUsername');
    const registerEmail = document.getElementById('registerEmail');
    const registerPassword = document.getElementById('registerPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    
    if (registerUsername) {
        registerUsername.addEventListener('blur', validateRegisterUsername);
        registerUsername.addEventListener('input', validateRegisterUsername);
    }
    
    if (registerEmail) {
        registerEmail.addEventListener('blur', validateRegisterEmail);
        registerEmail.addEventListener('input', validateRegisterEmail);
    }
    
    if (registerPassword) {
        registerPassword.addEventListener('blur', validateRegisterPassword);
        registerPassword.addEventListener('input', validateRegisterPassword);
    }
    
    if (confirmPassword) {
        confirmPassword.addEventListener('blur', validateConfirmPassword);
        confirmPassword.addEventListener('input', validateConfirmPassword);
    }
}

// 设置实时验证
function setupRealTimeValidation() {
    // 密码强度实时显示
    const registerPassword = document.getElementById('registerPassword');
    if (registerPassword) {
        registerPassword.addEventListener('input', showPasswordStrength);
    }
}

// 切换表单显示
function switchToRegister() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm && registerForm) {
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
        currentForm = 'register';
        
        // 重置表单状态
        resetFormValidation();
    }
}

function switchToLogin() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm && registerForm) {
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
        currentForm = 'login';
        
        // 重置表单状态
        resetFormValidation();
    }
}

// 重置表单验证状态
function resetFormValidation() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => {
        msg.textContent = '';
    });
    
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.classList.remove('error', 'form-success');
    });
}

// 切换密码显示
function togglePassword(inputId) {
    const passwordInput = document.getElementById(inputId);
    const toggleButton = passwordInput.nextElementSibling;
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleButton.textContent = '👁️';
    }
}

// 检查记住我状态
function checkRememberMe() {
    const savedUsername = localStorage.getItem('rememberedUsername');
    const rememberMe = document.getElementById('rememberMe');
    const loginUsername = document.getElementById('loginUsername');
    
    if (savedUsername && rememberMe && loginUsername) {
        loginUsername.value = savedUsername;
        rememberMe.checked = true;
    }
}

// 处理登录
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // 验证表单
    if (!validateLoginForm(username, password)) {
        return;
    }
    
    // 显示加载状态
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = '登录中...';
    submitButton.disabled = true;
    submitButton.classList.add('btn-loading');
    
    // 模拟登录请求
    setTimeout(() => {
        // 模拟登录成功
        if (username && password) {
            // 保存登录状态
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', username);
            
            // 记住用户名
            if (rememberMe) {
                localStorage.setItem('rememberedUsername', username);
            } else {
                localStorage.removeItem('rememberedUsername');
            }
            
            showMessage('登录成功！正在跳转...', 'success');
            
            // 跳转到首页
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showMessage('用户名或密码错误', 'error');
            
            // 恢复按钮状态
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            submitButton.classList.remove('btn-loading');
        }
    }, 2000);
}

// 处理注册
function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // 验证表单
    if (!validateRegisterForm(username, email, password, confirmPassword, agreeTerms)) {
        return;
    }
    
    // 显示加载状态
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = '注册中...';
    submitButton.disabled = true;
    submitButton.classList.add('btn-loading');
    
    // 模拟注册请求
    setTimeout(() => {
        // 模拟注册成功
        showMessage('注册成功！正在跳转到登录页面...', 'success');
        
        // 跳转到登录页面
        setTimeout(() => {
            switchToLogin();
            
            // 恢复按钮状态
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            submitButton.classList.remove('btn-loading');
        }, 1500);
    }, 2000);
}

// 验证登录表单
function validateLoginForm(username, password) {
    let isValid = true;
    
    if (!username) {
        showError('loginUsername', '请输入用户名或邮箱');
        isValid = false;
    }
    
    if (!password) {
        showError('loginPassword', '请输入密码');
        isValid = false;
    }
    
    return isValid;
}

// 验证注册表单
function validateRegisterForm(username, email, password, confirmPassword, agreeTerms) {
    let isValid = true;
    
    if (!username) {
        showError('registerUsername', '请输入用户名');
        isValid = false;
    } else if (username.length < 3) {
        showError('registerUsername', '用户名至少需要3个字符');
        isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showError('registerUsername', '用户名只能包含字母、数字和下划线');
        isValid = false;
    }
    
    if (!email) {
        showError('registerEmail', '请输入邮箱地址');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('registerEmail', '请输入有效的邮箱地址');
        isValid = false;
    }
    
    if (!password) {
        showError('registerPassword', '请输入密码');
        isValid = false;
    } else if (password.length < 6) {
        showError('registerPassword', '密码至少需要6个字符');
        isValid = false;
    }
    
    if (!confirmPassword) {
        showError('confirmPassword', '请确认密码');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirmPassword', '两次输入的密码不一致');
        isValid = false;
    }
    
    if (!agreeTerms) {
        showMessage('请同意服务条款和隐私政策', 'error');
        isValid = false;
    }
    
    return isValid;
}

// 验证登录用户名
function validateLoginUsername() {
    const username = this.value.trim();
    const errorElement = document.getElementById('usernameError');
    
    if (!username) {
        showError('loginUsername', '请输入用户名或邮箱');
        return false;
    }
    
    clearError('loginUsername');
    return true;
}

// 验证登录密码
function validateLoginPassword() {
    const password = this.value;
    const errorElement = document.getElementById('passwordError');
    
    if (!password) {
        showError('loginPassword', '请输入密码');
        return false;
    }
    
    clearError('loginPassword');
    return true;
}

// 验证注册用户名
function validateRegisterUsername() {
    const username = this.value.trim();
    const errorElement = document.getElementById('registerUsernameError');
    
    if (!username) {
        showError('registerUsername', '请输入用户名');
        return false;
    }
    
    if (username.length < 3) {
        showError('registerUsername', '用户名至少需要3个字符');
        return false;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showError('registerUsername', '用户名只能包含字母、数字和下划线');
        return false;
    }
    
    // 模拟检查用户名是否可用
    if (username === 'admin' || username === 'test') {
        showError('registerUsername', '该用户名已被使用');
        return false;
    }
    
    clearError('registerUsername');
    showSuccess('registerUsername');
    return true;
}

// 验证注册邮箱
function validateRegisterEmail() {
    const email = this.value.trim();
    const errorElement = document.getElementById('registerEmailError');
    
    if (!email) {
        showError('registerEmail', '请输入邮箱地址');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showError('registerEmail', '请输入有效的邮箱地址');
        return false;
    }
    
    // 模拟检查邮箱是否可用
    if (email === 'test@example.com') {
        showError('registerEmail', '该邮箱已被注册');
        return false;
    }
    
    clearError('registerEmail');
    showSuccess('registerEmail');
    return true;
}

// 验证注册密码
function validateRegisterPassword() {
    const password = this.value;
    const errorElement = document.getElementById('registerPasswordError');
    
    if (!password) {
        showError('registerPassword', '请输入密码');
        return false;
    }
    
    if (password.length < 6) {
        showError('registerPassword', '密码至少需要6个字符');
        return false;
    }
    
    clearError('registerPassword');
    showSuccess('registerPassword');
    return true;
}

// 验证确认密码
function validateConfirmPassword() {
    const confirmPassword = this.value;
    const password = document.getElementById('registerPassword').value;
    const errorElement = document.getElementById('confirmPasswordError');
    
    if (!confirmPassword) {
        showError('confirmPassword', '请确认密码');
        return false;
    }
    
    if (password !== confirmPassword) {
        showError('confirmPassword', '两次输入的密码不一致');
        return false;
    }
    
    clearError('confirmPassword');
    showSuccess('confirmPassword');
    return true;
}

// 显示密码强度
function showPasswordStrength() {
    const password = this.value;
    const strengthElement = document.getElementById('registerPasswordError');
    
    if (!strengthElement) return;
    
    let strength = 0;
    let message = '';
    let className = '';
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    switch (strength) {
        case 0:
        case 1:
            message = '密码强度：弱';
            className = 'invalid';
            break;
        case 2:
        case 3:
            message = '密码强度：中等';
            className = '';
            break;
        case 4:
        case 5:
            message = '密码强度：强';
            className = 'valid';
            break;
    }
    
    strengthElement.textContent = message;
    strengthElement.className = `validation-hint ${className}`;
}

// 显示错误信息
function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (input && errorElement) {
        input.classList.add('error');
        input.classList.remove('form-success');
        errorElement.textContent = message;
    }
}

// 清除错误信息
function clearError(fieldId) {
    const input = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (input && errorElement) {
        input.classList.remove('error');
        errorElement.textContent = '';
    }
}

// 显示成功状态
function showSuccess(fieldId) {
    const input = document.getElementById(fieldId);
    
    if (input) {
        input.classList.remove('error');
        input.classList.add('form-success');
    }
}

// 验证邮箱格式
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 显示消息
function showMessage(message, type = 'info') {
    // 创建消息元素
    const messageElement = document.createElement('div');
    messageElement.className = `message message-${type}`;
    messageElement.textContent = message;
    
    // 添加样式
    messageElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
    `;
    
    // 设置背景颜色
    switch (type) {
        case 'success':
            messageElement.style.backgroundColor = '#10b981';
            break;
        case 'error':
            messageElement.style.backgroundColor = '#ef4444';
            break;
        case 'warning':
            messageElement.style.backgroundColor = '#f59e0b';
            break;
        default:
            messageElement.style.backgroundColor = '#3b82f6';
    }
    
    // 添加到页面
    document.body.appendChild(messageElement);
    
    // 自动移除
    setTimeout(() => {
        messageElement.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 300);
    }, 3000);
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 社交登录功能
function socialLogin(platform) {
    showMessage(`正在通过${platform}登录...`, 'info');
    
    // 模拟社交登录
    setTimeout(() => {
        showMessage(`${platform}登录成功！`, 'success');
        
        // 保存登录状态
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', `${platform}用户`);
        
        // 跳转到首页
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 2000);
}

// 为社交登录按钮添加事件
document.addEventListener('DOMContentLoaded', function() {
    const qqButtons = document.querySelectorAll('.btn-qq');
    const wechatButtons = document.querySelectorAll('.btn-wechat');
    
    qqButtons.forEach(button => {
        button.addEventListener('click', function() {
            socialLogin('QQ');
        });
    });
    
    wechatButtons.forEach(button => {
        button.addEventListener('click', function() {
            socialLogin('微信');
        });
    });
});

// 忘记密码功能
function forgotPassword() {
    showMessage('忘记密码功能正在开发中...', 'info');
}

// 为忘记密码链接添加事件
document.addEventListener('DOMContentLoaded', function() {
    const forgotLinks = document.querySelectorAll('.forgot-password');
    
    forgotLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            forgotPassword();
        });
    });
});