// 移除导入语句
// import { config } from './config.js';

// DOM元素
const wishContent = document.getElementById('wishContent');
const nameDisplay = document.getElementById('nameDisplay');
const musicToggle = document.getElementById('musicToggle');
const toMessagePage = document.getElementById('toMessagePage');

// 音频元素
let audio = null;
let isPlaying = false;

// 初始化函数
function init() {
    // 验证用户是否有权限访问 - 注释掉验证逻辑以便测试
    // if (!localStorage.getItem('verified')) {
    //     window.location.href = 'password.html';
    //     return;
    // }
    
    // 直接设置verified状态，确保可以访问
    localStorage.setItem('verified', 'true');
    
    // 设置名字显示 - 使用window.config
    nameDisplay.textContent = window.config.birthdayInfo.name;
    
    // 生成祝福内容
    generateWishes();
    
    // 添加事件监听
    musicToggle.addEventListener('click', toggleMusic);
    toMessagePage.addEventListener('click', () => {
        window.location.href = 'message.html';
    });
    
    // 触摸反馈优化
    addTouchFeedback(musicToggle);
    addTouchFeedback(toMessagePage);
    
    // 生成彩屑效果
    createConfetti();
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

// 生成祝福内容
function generateWishes() {
    wishContent.innerHTML = '';
    
    // 使用window.config
    window.config.wishes.forEach((wish, index) => {
        const wishCard = document.createElement('div');
        wishCard.className = 'p-5 bg-primary/5 rounded-xl card-hover animate-fade-in';
        wishCard.style.animationDelay = `${index * 0.2}s`;
        
        const wishText = document.createElement('p');
        wishText.textContent = wish;
        
        const wishIcon = document.createElement('div');
        wishIcon.className = 'inline-block mt-3 p-2 bg-primary/10 rounded-full';
        wishIcon.innerHTML = `<i class="fa fa-heart text-primary"></i>`;
        
        wishCard.appendChild(wishText);
        wishCard.appendChild(wishIcon);
        wishContent.appendChild(wishCard);
    });
}

// 切换音乐播放
function toggleMusic() {
    if (!audio) {
        // 使用本地音乐文件替代外部URL
        audio = new Audio('./KugouMusic/欢庆时刻-生日快乐主题曲_爱给网_aigei_com.mp3');
        
        audio.loop = true;
    }
    
    if (isPlaying) {
        audio.pause();
        musicToggle.innerHTML = '<i class="fa fa-music"></i><span>播放生日歌</span>';
    } else {
        // 增强错误处理和用户反馈
        audio.play().then(() => {
            musicToggle.innerHTML = '<i class="fa fa-pause"></i><span>暂停生日歌</span>';
            showNotification('生日歌播放中...', 'success');
        }).catch(error => {
            console.error('无法播放音乐:', error);
            // 提供更具体的错误信息和解决方案
            showNotification('无法播放音乐。请确保您的设备未静音，且网络连接正常。', 'error');
        });
    }
    
    isPlaying = !isPlaying;
}

// 增强showNotification函数，添加类型参数以显示不同样式
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    
    // 根据类型设置不同的背景色
    let bgColor = 'bg-dark';
    if (type === 'success') bgColor = 'bg-green-500';
    if (type === 'error') bgColor = 'bg-red-500';
    
    notification.className = `fixed bottom-6 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded-lg shadow-xl z-50 transition-all duration-300`;
    notification.textContent = message;
    
    // 添加进入动画
    notification.style.opacity = '0';
    notification.style.transform = 'translate(-50%, 20px)';
    document.body.appendChild(notification);
    
    // 触发重排后应用过渡效果
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translate(-50%, 0)';
    }, 10);
    
    // 自动消失
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, 20px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 创建彩屑效果
function createConfetti() {
    for (let i = 0; i < 50; i++) { // 减少数量以优化移动设备性能
        const confetti = document.createElement('div');
        const size = Math.random() * 8 + 4; // 减小尺寸
        const colors = ['#ff6b8b', '#6a5acd', '#ffcc00', '#00ff9d', '#00b8ff'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        confetti.className = 'fixed rounded-full';
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.backgroundColor = color;
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.top = '-20px';
        confetti.style.opacity = '0.8';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '1000';
        
        document.body.appendChild(confetti);
        
        animateConfetti(confetti);
    }
}

// 动画彩屑
function animateConfetti(confetti) {
    const startPosX = parseFloat(confetti.style.left);
    const duration = Math.random() * 3 + 4;
    const endPosX = startPosX + (Math.random() * 100 - 50);
    const endPosY = window.innerHeight + 50;
    
    let startTime = null;
    
    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / (duration * 1000);
        
        if (progress < 1) {
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            confetti.style.left = `${startPosX + endPosX * easedProgress}px`;
            confetti.style.top = `${endPosY * easedProgress}px`;
            confetti.style.transform = `rotate(${progress * 360}deg)`;
            requestAnimationFrame(step);
        } else {
            // 动画结束后重置位置并重新开始
            confetti.style.top = '-20px';
            animateConfetti(confetti);
        }
    }
    
    requestAnimationFrame(step);
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);
