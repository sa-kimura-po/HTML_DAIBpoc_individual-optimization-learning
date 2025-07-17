// 教員画面共通ナビゲーション機能
document.addEventListener('DOMContentLoaded', function() {
    addTeacherNavigation();
    setupNavigationEvents();
});

// 教員ナビゲーション追加
function addTeacherNavigation() {
    // 既存のナビゲーションがある場合は何もしない
    if (document.getElementById('teacher-nav')) return;

    const navHTML = `
        <nav id="teacher-nav" class="bg-blue-900 text-white p-4 fixed top-0 left-0 right-0 z-50 shadow-lg">
            <div class="max-w-7xl mx-auto flex items-center justify-between">
                <div class="flex items-center space-x-6">
                    <div class="flex items-center space-x-2">
                        <span class="text-2xl">🎓</span>
                        <span class="text-xl font-bold">教員ポータル</span>
                    </div>
                    <div class="hidden md:flex items-center space-x-4">
                        <a href="dashboard.html" class="nav-link px-3 py-2 rounded hover:bg-blue-800 transition">
                            📊 ダッシュボード
                        </a>
                        <a href="heatmap.html" class="nav-link px-3 py-2 rounded hover:bg-blue-800 transition">
                            🎯 学生管理
                        </a>
                        <a href="keywords.html" class="nav-link px-3 py-2 rounded hover:bg-blue-800 transition">
                            🔖 キーワード管理
                        </a>
                    </div>
                </div>
                
                <div class="flex items-center space-x-4">
                    <div class="hidden md:flex items-center space-x-2 text-sm">
                        <span>📚</span>
                        <span>データサイエンス基礎第7回</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="text-sm" id="teacher-name">教員</span>
                        <button onclick="showUserMenu()" class="p-2 rounded hover:bg-blue-800 transition">
                            👤
                        </button>
                    </div>
                    <button onclick="logout()" class="px-3 py-2 bg-red-600 rounded hover:bg-red-700 transition text-sm">
                        ログアウト
                    </button>
                </div>
            </div>
            
            <!-- モバイルメニュー -->
            <div id="mobile-menu" class="md:hidden mt-4 border-t border-blue-800 pt-4" style="display: none;">
                <a href="dashboard.html" class="block px-3 py-2 rounded hover:bg-blue-800 transition mb-1">
                    📊 ダッシュボード
                </a>
                <a href="heatmap.html" class="block px-3 py-2 rounded hover:bg-blue-800 transition mb-1">
                    🎯 学生管理
                </a>
                <a href="keywords.html" class="block px-3 py-2 rounded hover:bg-blue-800 transition mb-1">
                    🔖 キーワード管理
                </a>
            </div>
        </nav>

        <!-- ユーザーメニュー -->
        <div id="user-menu" class="fixed top-16 right-4 bg-white rounded-lg shadow-lg border border-gray-200 z-40" style="display: none;">
            <div class="p-4 border-b border-gray-200">
                <div class="text-sm text-gray-600">ログイン中</div>
                <div class="font-semibold text-gray-800" id="user-menu-name">教員</div>
                <div class="text-xs text-gray-500">データサイエンス基礎担当</div>
            </div>
            <div class="p-2">
                <button onclick="showSettings()" class="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm">
                    ⚙️ 設定
                </button>
                <button onclick="showHelp()" class="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm">
                    ❓ ヘルプ
                </button>
                <button onclick="logout()" class="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded text-sm">
                    🚪 ログアウト
                </button>
            </div>
        </div>
    `;

    // ナビゲーションをbodyの先頭に挿入
    document.body.insertAdjacentHTML('afterbegin', navHTML);
    
    // メインコンテンツにpadding-topを追加
    document.body.style.paddingTop = '80px';
    
    // 現在のページをハイライト
    highlightCurrentPage();
}

// ナビゲーションイベント設定
function setupNavigationEvents() {
    // モバイルメニュートグル
    document.addEventListener('click', function(e) {
        const mobileMenuToggle = e.target.closest('#mobile-menu-toggle');
        if (mobileMenuToggle) {
            toggleMobileMenu();
        }
        
        // ユーザーメニュー外クリックで閉じる
        if (!e.target.closest('#user-menu') && !e.target.closest('[onclick="showUserMenu()"]')) {
            closeUserMenu();
        }
    });

    // ウィンドウリサイズ時の処理
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            closeMobileMenu();
        }
    });
    
    // ログインユーザー名を取得・表示
    loadUserInfo();
}

// 現在のページをハイライト
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('bg-blue-800');
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'dashboard.html')) {
            link.classList.add('bg-blue-800');
        }
    });
}

// モバイルメニュー表示切替
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu.style.display === 'none') {
        mobileMenu.style.display = 'block';
    } else {
        mobileMenu.style.display = 'none';
    }
}

// モバイルメニューを閉じる
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.style.display = 'none';
    }
}

// ユーザーメニュー表示
function showUserMenu() {
    const userMenu = document.getElementById('user-menu');
    if (userMenu.style.display === 'none') {
        userMenu.style.display = 'block';
    } else {
        userMenu.style.display = 'none';
    }
}

// ユーザーメニューを閉じる
function closeUserMenu() {
    const userMenu = document.getElementById('user-menu');
    if (userMenu) {
        userMenu.style.display = 'none';
    }
}

// ユーザー情報読み込み
function loadUserInfo() {
    // ローカルストレージまたはセッションからユーザー情報を取得
    const userInfo = JSON.parse(localStorage.getItem('teacher_user') || '{"name": "データサイエンス教員", "role": "teacher"}');
    
    const teacherNameElements = document.querySelectorAll('#teacher-name, #user-menu-name');
    teacherNameElements.forEach(element => {
        if (element) {
            element.textContent = userInfo.name;
        }
    });
}

// 設定画面表示
function showSettings() {
    closeUserMenu();
    alert('設定画面\n（実装予定）\n\n- 表示設定\n- 通知設定\n- データエクスポート設定');
}

// ヘルプ表示
function showHelp() {
    closeUserMenu();
    alert('ヘルプ\n\n📊 ダッシュボード: 講義全体の統計と分析\n🎯 学生管理: 学生の理解度をヒートマップで表示\n🔖 キーワード管理: 講義キーワードの編集・管理\n\n詳細なマニュアルは別途ご確認ください。');
}

// ログアウト
function logout() {
    if (confirm('ログアウトしますか？')) {
        // ローカルストレージをクリア
        localStorage.removeItem('teacher_user');
        localStorage.removeItem('auth_token');
        
        // ログイン画面に遷移
        window.location.href = '../common/auth.html';
    }
}

// 通知表示関数
function showNotification(message, type = 'info') {
    // 既存の通知を削除
    const existingNotification = document.getElementById('notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const colors = {
        info: 'bg-blue-500',
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
        error: 'bg-red-500'
    };

    const notification = document.createElement('div');
    notification.id = 'notification';
    notification.className = `fixed top-20 right-4 ${colors[type]} text-white px-4 py-2 rounded-lg shadow-lg z-50 transform transition-transform duration-300 translate-x-full`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // アニメーションで表示
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);

    // 3秒後に自動で消去
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ページ間のデータ共有用ユーティリティ
window.teacherNav = {
    showNotification,
    loadUserInfo,
    logout,
    showSettings,
    showHelp
};

// グローバル関数として export
window.showUserMenu = showUserMenu;
window.showSettings = showSettings;
window.showHelp = showHelp;
window.logout = logout;