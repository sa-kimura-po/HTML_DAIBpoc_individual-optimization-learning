// 学生画面共通ナビゲーション機能

// ページ間ナビゲーション関数
function navigateToPage(page) {
    window.location.href = page;
}

// ログアウト機能
function logout() {
    if (confirm('ログアウトしますか？')) {
        // ローカルストレージをクリア
        localStorage.removeItem('current_user');
        localStorage.removeItem('survey_responses');
        localStorage.removeItem('problem_results');
        
        // ログイン画面に遷移
        window.location.href = '../common/auth.html';
    }
}

// 現在のページをアクティブ状態にする
function setActiveNavItem() {
    const currentPage = window.location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && href.includes(currentPage)) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// パンくずリスト生成
function generateBreadcrumb() {
    const currentPage = window.location.pathname.split('/').pop();
    const breadcrumbMap = {
        'dashboard.html': '学生ダッシュボード',
        'survey.html': '理解度アンケート',
        'problems.html': '個別問題',
        'results.html': '採点結果'
    };
    
    const breadcrumbContainer = document.getElementById('breadcrumb');
    if (breadcrumbContainer && breadcrumbMap[currentPage]) {
        breadcrumbContainer.innerHTML = `
            <nav class="flex items-center space-x-2 text-sm text-gray-500">
                <a href="dashboard.html" class="hover:text-blue-600">ホーム</a>
                <i class="fas fa-chevron-right text-xs"></i>
                <span class="text-gray-800">${breadcrumbMap[currentPage]}</span>
            </nav>
        `;
    }
}

// 学習進捗の更新
function updateProgress() {
    const surveyData = LocalStorage.getSurveyResponses();
    const problemResults = LocalStorage.getProblemResults();
    
    // アンケート提出状況
    const surveyCompleted = surveyData && Object.keys(surveyData).length > 0;
    
    // 問題解答状況
    const problemsCompleted = problemResults ? Object.keys(problemResults).length : 0;
    const totalProblems = LECTURE_DATA ? LECTURE_DATA.problems.length : 5;
    
    // 進捗率計算
    let progressRate = 0;
    if (surveyCompleted) progressRate += 30; // アンケート30%
    progressRate += (problemsCompleted / totalProblems) * 70; // 問題70%
    
    // 進捗バーの更新
    const progressBar = document.getElementById('learning-progress');
    if (progressBar) {
        progressBar.style.width = Math.min(progressRate, 100) + '%';
        progressBar.setAttribute('aria-valuenow', Math.min(progressRate, 100));
    }
    
    // 進捗テキストの更新
    const progressText = document.getElementById('progress-text');
    if (progressText) {
        progressText.textContent = `学習進捗: ${Math.round(progressRate)}%`;
    }
    
    return {
        surveyCompleted,
        problemsCompleted,
        totalProblems,
        progressRate: Math.round(progressRate)
    };
}

// 通知数の更新
function updateNotificationCount() {
    const student = LocalStorage.getCurrentUser();
    const unreadCount = student.notifications ? student.notifications.length : 0;
    
    const notificationBadge = document.getElementById('notification-count');
    if (notificationBadge) {
        if (unreadCount > 0) {
            notificationBadge.textContent = unreadCount > 9 ? '9+' : unreadCount;
            notificationBadge.classList.remove('hidden');
        } else {
            notificationBadge.classList.add('hidden');
        }
    }
}

// モバイルメニューの切り替え
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}

// キーボードショートカット
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Alt + 1: ダッシュボード
        if (e.altKey && e.key === '1') {
            e.preventDefault();
            window.location.href = 'dashboard.html';
        }
        // Alt + 2: アンケート
        else if (e.altKey && e.key === '2') {
            e.preventDefault();
            window.location.href = 'survey.html';
        }
        // Alt + 3: 問題
        else if (e.altKey && e.key === '3') {
            e.preventDefault();
            window.location.href = 'problems.html';
        }
        // Alt + 4: 結果
        else if (e.altKey && e.key === '4') {
            e.preventDefault();
            window.location.href = 'results.html';
        }
        // Esc: モバイルメニューを閉じる
        else if (e.key === 'Escape') {
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        }
    });
}

// 学習状況の保存
function saveLearningSession() {
    const sessionData = {
        last_visit: new Date().toISOString(),
        current_page: window.location.pathname.split('/').pop(),
        session_id: Math.random().toString(36).substr(2, 9)
    };
    
    localStorage.setItem('learning_session', JSON.stringify(sessionData));
}

// 自動保存機能
function setupAutoSave() {
    // 5分ごとに学習状況を保存
    setInterval(saveLearningSession, 5 * 60 * 1000);
    
    // ページを離れる前に保存
    window.addEventListener('beforeunload', saveLearningSession);
}

// ページロード時の初期化
function initializeStudentNav() {
    // 共通機能の初期化
    setActiveNavItem();
    generateBreadcrumb();
    updateProgress();
    updateNotificationCount();
    setupKeyboardShortcuts();
    setupAutoSave();
    
    // 学習セッションの開始
    saveLearningSession();
    
    console.log('学生ナビゲーション初期化完了');
}

// ユーティリティ関数
const StudentNavUtils = {
    // 時間フォーマット
    formatTime: function(seconds) {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    
    // 成功メッセージ表示
    showSuccessMessage: function(message) {
        this.showToast(message, 'success');
    },
    
    // エラーメッセージ表示
    showErrorMessage: function(message) {
        this.showToast(message, 'error');
    },
    
    // トースト通知
    showToast: function(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 max-w-sm p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        toast.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${
                    type === 'success' ? 'fa-check-circle' :
                    type === 'error' ? 'fa-exclamation-circle' :
                    'fa-info-circle'
                } mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // 3秒後に自動削除
        setTimeout(() => {
            toast.remove();
        }, 3000);
    },
    
    // 確認ダイアログ
    confirm: function(message, callback) {
        if (confirm(message)) {
            callback();
        }
    },
    
    // ローディング表示
    showLoading: function(target) {
        const loadingSpinner = document.createElement('div');
        loadingSpinner.className = 'loading-overlay absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center';
        loadingSpinner.innerHTML = '<i class="fas fa-spinner fa-spin text-blue-600 text-2xl"></i>';
        
        if (typeof target === 'string') {
            target = document.getElementById(target);
        }
        
        if (target) {
            target.style.position = 'relative';
            target.appendChild(loadingSpinner);
        }
    },
    
    // ローディング非表示
    hideLoading: function(target) {
        if (typeof target === 'string') {
            target = document.getElementById(target);
        }
        
        if (target) {
            const loadingOverlay = target.querySelector('.loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.remove();
            }
        }
    }
};

// グローバルに公開
window.StudentNavUtils = StudentNavUtils;

// DOM読み込み完了後に初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeStudentNav);
} else {
    initializeStudentNav();
}