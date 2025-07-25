# HTML版 個別最適化学習システム プロジェクト構成

**作成日**: 2025年7月8日  
**目的**: ゼロ環境依存での簡単デモ実行

## 📁 フォルダ構成

```
HTML_individual_optimization_learning_poc_keyword_20250708/
├── README.md                    # 実行ガイド
├── PROJECT_STRUCTURE.md         # この文書
├── teacher/                     # 教員画面（Cさん担当）
│   ├── dashboard.html           # 教員ダッシュボード（5つのタブ、相関分析機能含む）
│   ├── heatmap.html            # 学生管理（ヒートマップ）
│   ├── keywords.html           # キーワード管理
│   └── common/
│       ├── teacher-nav.js      # 教員画面共通ナビゲーション
│       └── teacher-style.css   # 教員画面スタイル
├── student/                     # 学生画面（Dさん担当）
│   ├── dashboard.html           # 学生ダッシュボード（他学生比較分析機能含む）
│   ├── survey.html             # 理解度アンケート
│   ├── problems.html           # 問題画面
│   ├── results.html            # 採点結果画面
│   └── comparison-analysis.html # 比較分析コンポーネント（新規追加）
│   └── common/
│       ├── student-nav.js      # 学生画面共通ナビゲーション
│       └── student-style.css   # 学生画面スタイル
├── common/                      # 共通ファイル
│   ├── auth.html               # ログイン画面
│   ├── global.css              # 全画面共通スタイル
│   ├── data.js                 # データサイエンス第7回データ
│   └── utils.js                # 共通ユーティリティ関数
└── assets/                      # 静的ファイル
    ├── images/                 # 画像ファイル
    └── fonts/                  # フォントファイル（必要に応じて）
```

## 👥 担当者別作業分担

### Cさん（教員画面担当）
**作業フォルダ**: `teacher/` 配下
**作成ファイル**:
- `teacher/dashboard.html` - 教員ダッシュボード（5つのタブ、トレンドグラフ、相関分析機能、個別問題生成機能）
- `teacher/heatmap.html` - 学生管理（ヒートマップ）
- `teacher/keywords.html` - キーワード管理
- `teacher/common/teacher-nav.js` - 教員ナビゲーション  
- `teacher/common/teacher-style.css` - 教員スタイル

**🆕 最新更新内容（2025年7月25日）**:
- ✅ **個別問題生成機能**: AI問題管理・教員独自問題作成・CSV一括管理・難易度設定を追加
- ✅ **レスポンシブデザイン**: 全タブの画面幅対応を完了（ヒートマップ、学生管理テーブル、第7回講義分析）
- ✅ **Chart.js最適化**: 重複描画防止・メモリリーク修正・固定データ化を実装

### Dさん（学生画面担当）
**作業フォルダ**: `student/` 配下
**作成ファイル**:
- `student/dashboard.html` - 学生ダッシュボード（他学生比較分析機能含む）
- `student/survey.html` - 理解度アンケート
- `student/problems.html` - 問題画面（穴埋め・選択・計算）
- `student/results.html` - 採点結果画面
- `student/comparison-analysis.html` - 比較分析コンポーネント（新規追加）  
- `student/common/student-nav.js` - 学生ナビゲーション
- `student/common/student-style.css` - 学生スタイル

**🆕 最新更新内容（2025年7月25日）**:
- ✅ **他学生との比較分析機能**: アンケート・問題結果の匿名比較可視化を追加
- ✅ **Chart.js統合**: 理解度比較・分布分析・正答率比較・解答時間比較グラフを実装
- ✅ **客観的学習支援**: 自己評価の客観性向上と学習洞察提供機能を追加

## 🔄 データ連携仕様

### 共通データ（data.js）
```javascript
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
  problems: [...] // 穴埋め・選択・計算問題
}
```

### ローカルストレージ管理
- `survey_responses` - アンケート回答
- `problem_results` - 問題結果
- `current_user` - ログインユーザー情報

## 🎯 修正要件対応

### 教員画面修正
1. **ダッシュボード**: 第7回講義の内容に特化
2. **ヒートマップ → 学生管理**: 名称変更、学年・学部軸対応
3. **授業回切り替え**: 第7回中心の表示

### 学生画面修正  
1. **ログイン404エラー**: 解決
2. **アンケート名称**: キーワード → 理解度に統一
3. **問題形式**: 穴埋め・選択・計算の3種類
4. **ブルームレベル**: 削除
5. **採点結果ページ**: 新規作成
6. **進捗タブ**: 削除

## 🚀 実行方法

1. フォルダをダブルクリック
2. `common/auth.html` をブラウザで開く
3. ログイン → 各画面へ遷移

**完全ゼロ環境依存での動作を実現**