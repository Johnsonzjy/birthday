// 移除导入语句
// import { config } from './config.js';

// DOM元素
const questionElement = document.getElementById('question');
const answerInput = document.getElementById('answer');
const submitButton = document.getElementById('submitAnswer');
const errorMessage = document.getElementById('errorMessage');

// 初始化函数
function init() {
    // 设置问题 - 使用window.config
    questionElement.textContent = window.config.security.question;
    
    // 添加提交事件监听
    submitButton.addEventListener('click', validateAnswer);
    
    // 添加回车键提交
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            validateAnswer();
        }
    });
    
    // 添加触摸反馈优化
    submitButton.addEventListener('touchstart', () => {
        submitButton.classList.add('scale-95');
    });
    
    submitButton.addEventListener('touchend', () => {
        setTimeout(() => {
            submitButton.classList.remove('scale-95');
        }, 150);
    });
}

// 验证答案
function validateAnswer() {
    const userAnswer = answerInput.value.trim();
    // 使用window.config
    const correctAnswer = window.config.security.answer;
    
    if (userAnswer === correctAnswer) {
        // 添加成功动画
        submitButton.classList.add('bg-green-500');
        submitButton.innerHTML = '<i class="fa fa-check"></i> <span>验证成功！</span>';
        
        // 存储状态并延迟跳转，让用户看到成功反馈
        setTimeout(() => {
            localStorage.setItem('verified', 'true');
            window.location.href = 'wish.html';
        }, 800);
    } else {
        // 显示错误信息
        errorMessage.classList.remove('hidden');
        
        // 添加动画效果
        errorMessage.classList.add('animate-pulse');
        setTimeout(() => {
            errorMessage.classList.remove('animate-pulse');
        }, 1000);
        
        // 清空输入框并聚焦
        answerInput.value = '';
        answerInput.focus();
        
        // 错误反馈动画
        answerInput.classList.add('border-red-500');
        setTimeout(() => {
            answerInput.classList.remove('border-red-500');
        }, 1000);
    }
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);