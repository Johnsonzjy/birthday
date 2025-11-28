// 移除import语句
// import { config } from './config.js';

// 其余代码保持不变，直接使用全局config变量

// DOM元素
// 移除对不存在元素的引用
const myMessageContent = document.getElementById('myMessageContent');
const messageList = document.getElementById('messageList');
const emptyState = document.getElementById('emptyState');
const backToWishPage = document.getElementById('backToWishPage');

// 初始化函数
function init() {
    // 验证用户是否有权限访问
    if (!localStorage.getItem('verified')) {
        window.location.href = 'password.html';
        return;
    }
    
    // 设置我的留言内容 - 修复键名和使用window.config
    myMessageContent.textContent = window.config.personalMessage;
    
    // 加载留言
    loadMessages();
    
    // 只保留返回按钮的事件监听
    backToWishPage.addEventListener('click', () => {
        window.location.href = 'wish.html';
    });
    
    // 只给返回按钮添加触摸反馈
    addTouchFeedback(backToWishPage);
}

// 添加触摸反馈
function addTouchFeedback(element) {
    element.addEventListener('touchstart', () => {
        element.classList.add('scale-95');
    });
    
    element.addEventListener('touchend', () => {
        setTimeout(() => {
            element.classList.remove('scale-95');
        }, 150);
    });
}

// 获取留言数据
function getMessages() {
    const messages = localStorage.getItem('birthdayMessages');
    return messages ? JSON.parse(messages) : [];
}

// 保存留言数据
function saveMessages(messages) {
    localStorage.setItem('birthdayMessages', JSON.stringify(messages));
}

// 添加留言
function addMessage() {
    const author = messageAuthor.value.trim();
    const content = messageContent.value.trim();
    
    if (!author || !content) {
        showNotification('请填写完整的信息', 'error');
        return;
    }
    
    const messages = getMessages();
    const newMessage = {
        id: Date.now(),
        author: author,
        content: content,
        date: new Date().toLocaleString()
    };
    
    messages.unshift(newMessage);
    saveMessages(messages);
    
    // 清空输入框
    messageAuthor.value = '';
    messageContent.value = '';
    messageAuthor.focus();
    
    // 重新加载留言
    loadMessages();
    
    // 显示成功提示
    showNotification('祝福已发送！', 'success');
}

// 加载留言
function loadMessages() {
    const messages = getMessages();
    
    // 显示或隐藏空状态
    if (messages.length === 0) {
        emptyState.classList.remove('hidden');
        messageList.innerHTML = '';
    } else {
        emptyState.classList.add('hidden');
        renderMessages(messages);
    }
}

// 渲染留言
function renderMessages(messages) {
    messageList.innerHTML = '';
    
    messages.forEach((message) => {
        const messageCard = document.createElement('div');
        messageCard.className = 'bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 card-hover animate-fade-in';
        messageCard.style.animationDelay = '0.1s';
        
        messageCard.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <h3 class="font-bold text-primary">${message.author}</h3>
                <span class="text-sm text-gray-500">${message.date}</span>
            </div>
            <p class="text-gray-700 leading-relaxed">我想说的话：${message.content}</p>
        `;
        
        messageList.appendChild(messageCard);
    });
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    
    // 设置样式和内容
    let bgColor = 'bg-blue-500';
    let icon = 'fa-info-circle';
    
    if (type === 'success') {
        bgColor = 'bg-green-500';
        icon = 'fa-check-circle';
    } else if (type === 'error') {
        bgColor = 'bg-red-500';
        icon = 'fa-exclamation-circle';
    }
    
    notification.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-xl fixed bottom-6 left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-in-out z-50 flex items-center gap-3`;
    notification.innerHTML = `<i class="fa ${icon} text-xl"></i><span>${message}</span>`;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.classList.add('opacity-0');
        
        // 移除元素
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 2500);
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);