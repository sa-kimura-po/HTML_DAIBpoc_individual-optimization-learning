// 共通ユーティリティ関数

// ローカルストレージ操作
const StorageUtils = {
    // データを安全に取得
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('LocalStorage get error:', error);
            return defaultValue;
        }
    },

    // データを安全に保存
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('LocalStorage set error:', error);
            return false;
        }
    },

    // データを削除
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('LocalStorage remove error:', error);
            return false;
        }
    },

    // すべてのデータをクリア
    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('LocalStorage clear error:', error);
            return false;
        }
    }
};

// 日付・時間ユーティリティ
const DateUtils = {
    // 日本語フォーマット
    formatJapanese: (date) => {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
    },

    // 短い日本語フォーマット
    formatShort: (date) => {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    // 時間込みフォーマット
    formatDateTime: (date) => {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        return date.toLocaleString('ja-JP', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // 相対時間（〜前）
    formatRelative: (date) => {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) return 'たった今';
        if (minutes < 60) return `${minutes}分前`;
        if (hours < 24) return `${hours}時間前`;
        if (days < 7) return `${days}日前`;
        return DateUtils.formatShort(date);
    },

    // 今日の日付取得
    today: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    },

    // 週の開始日取得
    startOfWeek: (date = new Date()) => {
        const start = new Date(date);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1); // 月曜始まり
        start.setDate(diff);
        start.setHours(0, 0, 0, 0);
        return start;
    }
};

// 数値ユーティリティ
const NumberUtils = {
    // 数値を日本語フォーマット
    format: (number, digits = 0) => {
        return number.toLocaleString('ja-JP', {
            minimumFractionDigits: digits,
            maximumFractionDigits: digits
        });
    },

    // パーセンテージフォーマット
    formatPercent: (number, digits = 1) => {
        return (number * 100).toFixed(digits) + '%';
    },

    // 理解度の5段階評価を%に変換
    understandingToPercent: (level) => {
        return ((level / 5) * 100).toFixed(1);
    },

    // %を5段階評価に変換
    percentToUnderstanding: (percent) => {
        return ((percent / 100) * 5).toFixed(1);
    },

    // 安全な除算（0除算対策）
    safeDivide: (numerator, denominator, defaultValue = 0) => {
        return denominator === 0 ? defaultValue : numerator / denominator;
    },

    // 範囲内にクランプ
    clamp: (value, min, max) => {
        return Math.min(Math.max(value, min), max);
    }
};

// 文字列ユーティリティ
const StringUtils = {
    // HTMLエスケープ
    escapeHtml: (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // 改行をBRタグに変換
    nl2br: (text) => {
        return text.replace(/\n/g, '<br>');
    },

    // 文字数制限
    truncate: (text, length, suffix = '...') => {
        if (text.length <= length) return text;
        return text.substring(0, length) + suffix;
    },

    // ひらがなをカタカナに変換
    hiraganaToKatakana: (text) => {
        return text.replace(/[\u3041-\u3096]/g, (match) => {
            return String.fromCharCode(match.charCodeAt(0) + 0x60);
        });
    },

    // カタカナをひらがなに変換
    katakanaToHiragana: (text) => {
        return text.replace(/[\u30a1-\u30f6]/g, (match) => {
            return String.fromCharCode(match.charCodeAt(0) - 0x60);
        });
    },

    // ランダム文字列生成
    randomString: (length = 8) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
};

// 配列ユーティリティ
const ArrayUtils = {
    // 配列をシャッフル
    shuffle: (array) => {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    },

    // 配列をチャンクに分割
    chunk: (array, size) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    },

    // 重複を削除
    unique: (array) => {
        return [...new Set(array)];
    },

    // オブジェクト配列から特定のプロパティで重複削除
    uniqueBy: (array, key) => {
        const seen = new Set();
        return array.filter(item => {
            const value = item[key];
            if (seen.has(value)) {
                return false;
            }
            seen.add(value);
            return true;
        });
    },

    // 配列をグルーピング
    groupBy: (array, key) => {
        return array.reduce((groups, item) => {
            const group = item[key];
            groups[group] = groups[group] || [];
            groups[group].push(item);
            return groups;
        }, {});
    },

    // 統計計算
    statistics: (array) => {
        if (array.length === 0) return { min: 0, max: 0, avg: 0, sum: 0 };
        
        const numbers = array.filter(n => typeof n === 'number').sort((a, b) => a - b);
        const sum = numbers.reduce((a, b) => a + b, 0);
        
        return {
            min: numbers[0] || 0,
            max: numbers[numbers.length - 1] || 0,
            avg: sum / numbers.length || 0,
            sum: sum,
            median: numbers.length % 2 === 0 
                ? (numbers[numbers.length / 2 - 1] + numbers[numbers.length / 2]) / 2
                : numbers[Math.floor(numbers.length / 2)]
        };
    }
};

// DOM操作ユーティリティ
const DOMUtils = {
    // 要素が見えているかチェック
    isVisible: (element) => {
        return element.offsetWidth > 0 && element.offsetHeight > 0;
    },

    // スムーススクロール
    scrollTo: (element, offset = 0) => {
        const targetPosition = element.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    },

    // 要素を見つけるまで待機
    waitForElement: (selector, timeout = 5000) => {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    },

    // クラスの切り替え
    toggleClass: (element, className, force) => {
        if (force !== undefined) {
            element.classList.toggle(className, force);
        } else {
            element.classList.toggle(className);
        }
    },

    // 複数要素に対する操作
    forEach: (selector, callback) => {
        document.querySelectorAll(selector).forEach(callback);
    }
};

// フォームユーティリティ
const FormUtils = {
    // フォームデータを取得
    getData: (form) => {
        const formData = new FormData(form);
        const data = {};
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        return data;
    },

    // フォームにデータを設定
    setData: (form, data) => {
        Object.keys(data).forEach(key => {
            const element = form.querySelector(`[name="${key}"]`);
            if (element) {
                element.value = data[key];
            }
        });
    },

    // フォームをリセット
    reset: (form) => {
        form.reset();
        // カスタムリセット処理があれば追加
    },

    // バリデーション
    validate: (form, rules) => {
        const errors = {};
        const data = FormUtils.getData(form);

        Object.keys(rules).forEach(field => {
            const rule = rules[field];
            const value = data[field];

            if (rule.required && (!value || value.trim() === '')) {
                errors[field] = rule.required;
            } else if (rule.pattern && value && !rule.pattern.test(value)) {
                errors[field] = rule.message || '形式が正しくありません';
            } else if (rule.minLength && value && value.length < rule.minLength) {
                errors[field] = `${rule.minLength}文字以上で入力してください`;
            } else if (rule.maxLength && value && value.length > rule.maxLength) {
                errors[field] = `${rule.maxLength}文字以内で入力してください`;
            }
        });

        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors
        };
    }
};

// 通知ユーティリティ
const NotificationUtils = {
    // 通知表示
    show: (message, type = 'info', duration = 3000) => {
        // 既存の通知を削除
        const existing = document.getElementById('notification');
        if (existing) {
            existing.remove();
        }

        const colors = {
            info: 'bg-blue-500',
            success: 'bg-green-500',
            warning: 'bg-yellow-500',
            error: 'bg-red-500'
        };

        const notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300 translate-x-full`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // アニメーションで表示
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        // 自動で消去
        if (duration > 0) {
            setTimeout(() => {
                notification.classList.add('translate-x-full');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }, duration);
        }

        return notification;
    },

    // 確認ダイアログ
    confirm: (message, onConfirm, onCancel) => {
        if (window.confirm(message)) {
            if (onConfirm) onConfirm();
            return true;
        } else {
            if (onCancel) onCancel();
            return false;
        }
    }
};

// CSV出力ユーティリティ
const CSVUtils = {
    // 配列をCSVに変換
    arrayToCSV: (data, headers = null) => {
        if (data.length === 0) return '';

        let csv = '';
        
        // ヘッダー行
        if (headers) {
            csv += headers.map(header => `"${header}"`).join(',') + '\n';
        } else if (typeof data[0] === 'object') {
            csv += Object.keys(data[0]).map(key => `"${key}"`).join(',') + '\n';
        }

        // データ行
        data.forEach(row => {
            if (Array.isArray(row)) {
                csv += row.map(cell => `"${cell}"`).join(',') + '\n';
            } else if (typeof row === 'object') {
                csv += Object.values(row).map(cell => `"${cell}"`).join(',') + '\n';
            }
        });

        return csv;
    },

    // CSVダウンロード
    download: (data, filename = 'data.csv', headers = null) => {
        const csv = CSVUtils.arrayToCSV(data, headers);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

// デバッグユーティリティ
const DebugUtils = {
    // 開発環境判定
    isDev: () => {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.protocol === 'file:';
    },

    // ログ出力（開発環境のみ）
    log: (...args) => {
        if (DebugUtils.isDev()) {
            console.log('[DEBUG]', ...args);
        }
    },

    // エラーログ
    error: (...args) => {
        console.error('[ERROR]', ...args);
    },

    // 警告ログ
    warn: (...args) => {
        console.warn('[WARN]', ...args);
    },

    // パフォーマンス測定
    time: (label) => {
        if (DebugUtils.isDev()) {
            console.time(label);
        }
    },

    timeEnd: (label) => {
        if (DebugUtils.isDev()) {
            console.timeEnd(label);
        }
    }
};

// 理解度関連ユーティリティ
const UnderstandingUtils = {
    // 理解度レベルから色を取得
    getColor: (level) => {
        if (level >= 4.0) return 'bg-green-500';
        if (level >= 3.5) return 'bg-blue-500';
        if (level >= 2.5) return 'bg-yellow-500';
        return 'bg-red-500';
    },

    // 理解度レベルからラベルを取得
    getLabel: (level) => {
        if (level >= 4.5) return '優秀';
        if (level >= 3.5) return '良好';
        if (level >= 2.5) return '普通';
        return '要改善';
    },

    // ヒートマップセル用の色
    getHeatmapColor: (value) => {
        if (value >= 4.5) return 'bg-green-600 text-white';
        if (value >= 4.0) return 'bg-green-500 text-white';
        if (value >= 3.5) return 'bg-green-400 text-white';
        if (value >= 3.0) return 'bg-yellow-400 text-gray-800';
        if (value >= 2.5) return 'bg-orange-500 text-white';
        if (value >= 2.0) return 'bg-red-500 text-white';
        return 'bg-red-600 text-white';
    }
};

// グローバルに公開
window.Utils = {
    Storage: StorageUtils,
    Date: DateUtils,
    Number: NumberUtils,
    String: StringUtils,
    Array: ArrayUtils,
    DOM: DOMUtils,
    Form: FormUtils,
    Notification: NotificationUtils,
    CSV: CSVUtils,
    Debug: DebugUtils,
    Understanding: UnderstandingUtils
};