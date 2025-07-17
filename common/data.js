// データサイエンス基礎第7回のマスタデータ
const LECTURE_DATA = {
  lecture_id: 7,
  title: "データサイエンス基礎第7回",
  keywords: [
    "2×2分割表の指標",
    "リスク差・リスク比・オッズ比", 
    "混同行列とは",
    "回帰分析の目的",
    "単回帰モデルとは",
    "最小二乗法による回帰係数の推定",
    "決定係数の解釈",
    "Rを用いた回帰分析"
  ],
  problems: [
    {
      id: 1,
      title: '2×2分割表の指標の計算（計算問題）',
      description: '以下の2×2分割表から、感度、特異度、精度を計算してください。',
      type: 'calculation',
      difficulty: '標準',
      keywords: ['2×2分割表の指標']
    },
    {
      id: 2,
      title: 'リスク比の定義（選択問題）',
      description: 'リスク比の正しい定義を選択してください。',
      type: 'choice',
      difficulty: '基礎',
      keywords: ['リスク差・リスク比・オッズ比']
    },
    {
      id: 3,
      title: '混同行列の用語（穴埋め問題）',
      description: '混同行列に関する説明文の空欄を埋めてください。',
      type: 'fill',
      difficulty: '基礎',
      keywords: ['混同行列とは']
    },
    {
      id: 4,
      title: '単回帰分析の実行（計算問題）',
      description: '与えられたデータから最小二乗法を用いて回帰係数を求めてください。',
      type: 'calculation',
      difficulty: '応用',
      keywords: ['単回帰モデルとは', '最小二乗法による回帰係数の推定']
    },
    {
      id: 5,
      title: '決定係数の解釈（選択問題）',
      description: '決定係数R²=0.75の意味として最も適切なものを選択してください。',
      type: 'choice',
      difficulty: '標準',
      keywords: ['決定係数の解釈']
    }
  ]
};

// 学生の模擬データ
const STUDENT_DATA = {
  student_id: 'ST001',
  name: '山田太郎',
  overall_understanding: 3.2,
  current_week: 7,
  completed_surveys: 6,
  total_surveys: 7,
  pending_problems: 5,
  latest_score: 78,
  notifications: [
    {
      id: 1,
      type: 'achievement',
      priority: 'high',
      title: '理解度向上',
      message: '第7回の理解度が前回から0.5ポイント向上しました！',
      created_at: '2025-07-09T10:00:00Z'
    },
    {
      id: 2,
      type: 'reminder',
      priority: 'medium',
      title: '問題解答のお知らせ',
      message: '個別問題が5問生成されました。解答をお待ちしています。',
      created_at: '2025-07-09T09:30:00Z'
    },
    {
      id: 3,
      type: 'concern',
      priority: 'low',
      title: '復習のお勧め',
      message: '2×2分割表の指標の理解度を向上させましょう。',
      created_at: '2025-07-09T09:00:00Z'
    }
  ]
};

// ローカルストレージ管理
const LocalStorage = {
  getSurveyResponses: () => JSON.parse(localStorage.getItem('survey_responses') || '{}'),
  setSurveyResponses: (data) => localStorage.setItem('survey_responses', JSON.stringify(data)),
  
  getProblemResults: () => JSON.parse(localStorage.getItem('problem_results') || '{}'),
  setProblemResults: (data) => localStorage.setItem('problem_results', JSON.stringify(data)),
  
  getCurrentUser: () => JSON.parse(localStorage.getItem('current_user') || JSON.stringify(STUDENT_DATA)),
  setCurrentUser: (data) => localStorage.setItem('current_user', JSON.stringify(data))
};

// 問題のタイプ別ラベル
const PROBLEM_TYPE_LABELS = {
  'calculation': '計算問題',
  'choice': '選択問題',
  'fill': '穴埋め問題'
};

// 理解度レベル
const UNDERSTANDING_LEVELS = [
  { value: 1, label: '全く理解できなかった', color: 'bg-red-100 text-red-800' },
  { value: 2, label: 'あまり理解できなかった', color: 'bg-orange-100 text-orange-800' },
  { value: 3, label: '普通に理解できた', color: 'bg-yellow-100 text-yellow-800' },
  { value: 4, label: 'よく理解できた', color: 'bg-blue-100 text-blue-800' },
  { value: 5, label: '非常によく理解できた', color: 'bg-green-100 text-green-800' }
];

// 学習進捗状態管理
const LEARNING_PROGRESS = {
  currentWeek: 7,
  
  // 各週の状態管理
  weeklyStatus: {
    6: {
      survey_completed: true,
      problems_completed: true,
      results_available: true
    },
    7: {
      survey_completed: false,
      problems_completed: false,
      results_available: false
    }
  },
  
  // 現在の週の状態を更新
  updateWeekStatus: function(week, type, completed) {
    if (!this.weeklyStatus[week]) {
      this.weeklyStatus[week] = { survey_completed: false, problems_completed: false, results_available: false };
    }
    this.weeklyStatus[week][type] = completed;
    
    // アンケート完了後に問題を有効化
    if (type === 'survey_completed' && completed) {
      // 問題が必要な状態に更新
      this.updateNotifications();
    }
    
    // 問題完了後に結果を有効化
    if (type === 'problems_completed' && completed) {
      this.weeklyStatus[week].results_available = true;
      this.updateNotifications();
    }
    
    // ローカルストレージに保存
    localStorage.setItem('learning_progress', JSON.stringify(this.weeklyStatus));
  },
  
  // 通知状態を更新
  updateNotifications: function() {
    const currentWeekStatus = this.weeklyStatus[this.currentWeek];
    
    console.log('Updating notifications with status:', currentWeekStatus);
    
    // アンケート通知
    const surveyNotification = document.getElementById('survey-notification');
    if (surveyNotification) {
      const showSurvey = !currentWeekStatus.survey_completed;
      surveyNotification.style.display = showSurvey ? 'block' : 'none';
      console.log('Survey notification:', showSurvey);
    }
    
    // 問題通知
    const problemsNotification = document.getElementById('problems-notification');
    if (problemsNotification) {
      const showProblems = (currentWeekStatus.survey_completed && !currentWeekStatus.problems_completed);
      problemsNotification.style.display = showProblems ? 'block' : 'none';
      console.log('Problems notification:', showProblems);
    }
    
    // 結果通知
    const resultsNotification = document.getElementById('results-notification');
    if (resultsNotification) {
      const showResults = (currentWeekStatus.problems_completed && currentWeekStatus.results_available);
      resultsNotification.style.display = showResults ? 'block' : 'none';
      console.log('Results notification:', showResults);
    }
    
    // ダッシュボード通知
    const dashboardNotification = document.getElementById('dashboard-notification');
    if (dashboardNotification) {
      const showDashboard = (currentWeekStatus.problems_completed && currentWeekStatus.results_available);
      dashboardNotification.style.display = showDashboard ? 'block' : 'none';
      console.log('Dashboard notification:', showDashboard);
    }
    
    // プロセス表示状態を更新
    this.updateProcessSteps();
  },
  
  // プロセス表示状態を更新
  updateProcessSteps: function() {
    const currentWeekStatus = this.weeklyStatus[this.currentWeek];
    
    // ステップ要素を取得
    const surveyStep = document.getElementById('survey-step');
    const problemsStep = document.getElementById('problems-step');
    const resultsStep = document.getElementById('results-step');
    
    // 遷移状態要素を取得
    const generatingTransition = document.getElementById('generating-transition');
    const gradingTransition = document.getElementById('grading-transition');
    
    if (!surveyStep || !problemsStep || !resultsStep) return;
    
    // 初期状態：すべてクリア
    [surveyStep, problemsStep, resultsStep].forEach(step => {
      step.className = 'process-step';
    });
    
    // アンケート段階
    if (!currentWeekStatus.survey_completed) {
      surveyStep.classList.add('active');
      problemsStep.classList.add('waiting');
      resultsStep.classList.add('waiting');
      
      // ステータステキスト更新
      const surveyStatus = document.getElementById('survey-status');
      if (surveyStatus) {
        surveyStatus.textContent = '実施中';
        surveyStatus.classList.remove('processing-text');
      }
      
      const problemsStatus = document.getElementById('problems-status');
      if (problemsStatus) {
        problemsStatus.textContent = '待機中';
        problemsStatus.classList.remove('processing-text');
      }
      
      const resultsStatus = document.getElementById('results-status');
      if (resultsStatus) {
        resultsStatus.textContent = '待機中';
        resultsStatus.classList.remove('processing-text');
      }
      
      // 遷移状態非表示
      if (generatingTransition) generatingTransition.style.display = 'none';
      if (gradingTransition) gradingTransition.style.display = 'none';
    }
    // 問題生成中段階
    else if (currentWeekStatus.survey_completed && !currentWeekStatus.problems_completed) {
      surveyStep.classList.add('waiting');
      problemsStep.classList.add('waiting');
      resultsStep.classList.add('waiting');
      
      // ステータステキスト更新
      const surveyStatus = document.getElementById('survey-status');
      if (surveyStatus) {
        surveyStatus.textContent = '完了';
        surveyStatus.classList.remove('processing-text');
      }
      
      const problemsStatus = document.getElementById('problems-status');
      if (problemsStatus) {
        problemsStatus.textContent = '問題生成中';
        problemsStatus.classList.add('processing-text');
      }
      
      const resultsStatus = document.getElementById('results-status');
      if (resultsStatus) {
        resultsStatus.textContent = '待機中';
        resultsStatus.classList.remove('processing-text');
      }
      
      // 問題生成中表示
      if (generatingTransition) generatingTransition.style.display = 'block';
      if (gradingTransition) gradingTransition.style.display = 'none';
    }
    // 採点中段階
    else if (currentWeekStatus.problems_completed && !currentWeekStatus.results_available) {
      surveyStep.classList.add('waiting');
      problemsStep.classList.add('waiting');
      resultsStep.classList.add('waiting');
      
      // ステータステキスト更新
      const surveyStatus = document.getElementById('survey-status');
      if (surveyStatus) {
        surveyStatus.textContent = '完了';
        surveyStatus.classList.remove('processing-text');
      }
      
      const problemsStatus = document.getElementById('problems-status');
      if (problemsStatus) {
        problemsStatus.textContent = '完了';
        problemsStatus.classList.remove('processing-text');
      }
      
      const resultsStatus = document.getElementById('results-status');
      if (resultsStatus) {
        resultsStatus.textContent = '採点中';
        resultsStatus.classList.add('processing-text');
      }
      
      // 採点中表示
      if (generatingTransition) generatingTransition.style.display = 'none';
      if (gradingTransition) gradingTransition.style.display = 'block';
    }
    // 全て完了段階
    else if (currentWeekStatus.results_available) {
      surveyStep.classList.add('waiting');
      problemsStep.classList.add('waiting');
      resultsStep.classList.add('active');
      
      // ステータステキスト更新
      const surveyStatus = document.getElementById('survey-status');
      if (surveyStatus) {
        surveyStatus.textContent = '完了';
        surveyStatus.classList.remove('processing-text');
      }
      
      const problemsStatus = document.getElementById('problems-status');
      if (problemsStatus) {
        problemsStatus.textContent = '完了';
        problemsStatus.classList.remove('processing-text');
      }
      
      const resultsStatus = document.getElementById('results-status');
      if (resultsStatus) {
        resultsStatus.textContent = '確認可能';
        resultsStatus.classList.remove('processing-text');
      }
      
      // 遷移状態非表示
      if (generatingTransition) generatingTransition.style.display = 'none';
      if (gradingTransition) gradingTransition.style.display = 'none';
    }
  },
  
  // 初期化
  initialize: function() {
    // ローカルストレージから読み込み
    const saved = localStorage.getItem('learning_progress');
    if (saved) {
      this.weeklyStatus = JSON.parse(saved);
    }
    
    // 初期状態設定（第7回アンケートが必要な状態）
    if (!this.weeklyStatus[this.currentWeek]) {
      this.weeklyStatus[this.currentWeek] = {
        survey_completed: false,
        problems_completed: false,
        results_available: false
      };
    }
    
    this.updateNotifications();
  }
};

// DAIB用のナビゲーション状態管理
const DAIB_STATE = {
  currentMode: 'learning', // 'chat' or 'learning'
  currentMenuMode: 'review', // 'learning' or 'review'
  currentLearningPage: 'dashboard', // 'dashboard', 'survey', 'problems', 'results'
  currentSubject: 'data-science', // 'data-science' or 'data-overview'
  
  setMode: function(mode) {
    this.currentMode = mode;
    this.updateUI();
  },
  
  setLearningPage: function(page) {
    this.currentLearningPage = page;
    this.updateUI();
  },
  
  setMenuMode: function(mode) {
    this.currentMenuMode = mode;
    this.updateMenuUI();
  },
  
  updateUI: function() {
    // チャットエリアの表示/非表示
    const chatArea = document.getElementById('chat-area');
    const learningArea = document.getElementById('learning-area');
    
    if (this.currentMode === 'chat') {
      if (chatArea) chatArea.style.display = 'block';
      if (learningArea) learningArea.style.display = 'none';
    } else {
      if (chatArea) chatArea.style.display = 'none';
      if (learningArea) learningArea.style.display = 'block';
    }
    
    // 授業選択プルダウンの表示/非表示
    this.updateSubjectSelector();
    
    // ナビゲーションのアクティブ状態更新
    this.updateNavigation();
    
    // 通知状態を更新
    LEARNING_PROGRESS.updateNotifications();
  },
  
  updateSubjectSelector: function() {
    const subjectSelector = document.getElementById('subject-selector');
    if (subjectSelector) {
      // 学習振り返りメニューかつダッシュボード以外のページで表示
      const showSelector = this.currentMenuMode === 'review' && 
                          this.currentMode === 'learning' && 
                          ['survey', 'problems', 'results'].includes(this.currentLearningPage);
      subjectSelector.style.display = showSelector ? 'block' : 'none';
      
      // 現在の選択を反映
      const subjectSelect = document.getElementById('subject-select');
      if (subjectSelect) {
        subjectSelect.value = this.currentSubject;
      }
    }
  },
  
  updateMenuUI: function() {
    // メニュートグルボタンの状態更新
    document.querySelectorAll('.menu-toggle-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    const activeToggle = document.getElementById(
      this.currentMenuMode === 'learning' ? 'daib-learning-toggle' : 'learning-review-toggle'
    );
    if (activeToggle) {
      activeToggle.classList.add('active');
    }
    
    // メニューコンテンツの表示切り替え
    document.querySelectorAll('.menu-content').forEach(content => {
      content.classList.remove('active');
    });
    
    const activeMenu = document.getElementById(
      this.currentMenuMode === 'learning' ? 'daib-learning-menu' : 'learning-review-menu'
    );
    if (activeMenu) {
      activeMenu.classList.add('active');
    }
    
    // 通知状態を更新
    LEARNING_PROGRESS.updateNotifications();
  },
  
  updateNavigation: function() {
    // すべてのナビゲーション項目からアクティブクラスを削除
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // 現在のページに対応する項目をアクティブに
    if (this.currentMode === 'learning') {
      const currentNavItem = document.querySelector(`[data-page="${this.currentLearningPage}"]`);
      if (currentNavItem) {
        currentNavItem.classList.add('active');
      }
    }
  }
};

// 授業データ定義
const SUBJECT_DATA = {
  'data-science': {
    name: 'データサイエンス基礎',
    currentWeek: 7,
    keywords: [
      "2×2分割表の指標",
      "リスク差・リスク比・オッズ比", 
      "混同行列とは",
      "回帰分析の目的",
      "単回帰モデルとは",
      "最小二乗法による回帰係数の推定",
      "決定係数の解釈",
      "Rを用いた回帰分析"
    ],
    problems: [
      {
        id: 1,
        title: '2×2分割表の指標の計算（計算問題）',
        description: '以下の2×2分割表から、感度、特異度、精度を計算してください。',
        type: 'calculation',
        difficulty: '標準',
        keywords: ['2×2分割表の指標']
      },
      {
        id: 2,
        title: 'リスク比の定義（選択問題）',
        description: 'リスク比の正しい定義を選択してください。',
        type: 'choice',
        difficulty: '基礎',
        keywords: ['リスク差・リスク比・オッズ比']
      },
      {
        id: 3,
        title: '混同行列の用語（穴埋め問題）',
        description: '混同行列に関する説明文の空欄を埋めてください。',
        type: 'fill',
        difficulty: '基礎',
        keywords: ['混同行列とは']
      },
      {
        id: 4,
        title: '単回帰分析の実行（計算問題）',
        description: '与えられたデータから最小二乗法を用いて回帰係数を求めてください。',
        type: 'calculation',
        difficulty: '応用',
        keywords: ['単回帰モデルとは', '最小二乗法による回帰係数の推定']
      },
      {
        id: 5,
        title: '決定係数の解釈（選択問題）',
        description: '決定係数R²=0.75の意味として最も適切なものを選択してください。',
        type: 'choice',
        difficulty: '標準',
        keywords: ['決定係数の解釈']
      }
    ]
  },
  'data-overview': {
    name: 'データサイエンス概論',
    currentWeek: 7,
    keywords: [
      "データ可視化の基本",
      "統計的推測",
      "機械学習の概要",
      "ビッグデータの活用",
      "データマイニング手法",
      "予測モデル構築",
      "データ前処理技術"
    ],
    problems: [
      {
        id: 1,
        title: 'データ可視化手法（選択問題）',
        description: '適切なグラフの種類を選択してください。',
        type: 'choice',
        difficulty: '基礎',
        keywords: ['データ可視化の基本']
      },
      {
        id: 2,
        title: '統計的仮説検定（計算問題）',
        description: 'p値を計算し、仮説の採択・棄却を判断してください。',
        type: 'calculation',
        difficulty: '標準',
        keywords: ['統計的推測']
      },
      {
        id: 3,
        title: '機械学習アルゴリズム（穴埋め問題）',
        description: '機械学習の分類に関する説明文の空欄を埋めてください。',
        type: 'fill',
        difficulty: '基礎',
        keywords: ['機械学習の概要']
      }
    ]
  }
};

// グローバル関数
function toggleMenuMode(mode) {
  DAIB_STATE.setMenuMode(mode);
  if (mode === 'review') {
    DAIB_STATE.setMode('learning');
    DAIB_STATE.setLearningPage('dashboard');
  }
}

function changeSubject() {
  const subjectSelect = document.getElementById('subject-select');
  if (subjectSelect) {
    DAIB_STATE.currentSubject = subjectSelect.value;
    
    // 現在のページを再初期化
    if (DAIB_STATE.currentLearningPage === 'survey') {
      initializeSurvey();
    } else if (DAIB_STATE.currentLearningPage === 'problems') {
      initializeProblems();
    } else if (DAIB_STATE.currentLearningPage === 'results') {
      initializeResults();
    }
  }
}

// 現在選択中の授業データを取得
function getCurrentSubjectData() {
  return SUBJECT_DATA[DAIB_STATE.currentSubject] || SUBJECT_DATA['data-science'];
}