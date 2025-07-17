# DAIB個別最適化学習システム - バックエンド連携仕様書

## 概要
同志社大学DAIBシステムの個別最適化学習機能におけるバックエンド実装仕様とフロントエンド連携定義

## システム構成

### 1. アーキテクチャ概要
```
[フロントエンド (HTML/JS)] 
    ↓ HTTPS/REST API
[Web API (ASP.NET Core)]
    ↓ Azure SDK
[CosmosDB (NoSQL)]
    ↓ Storage SDK  
[Azure Blob Storage (ファイル)]
```

### 2. 技術スタック
- **フロントエンド**: HTML5, CSS3, JavaScript ES6+
- **バックエンド**: ASP.NET Core 6.0+, C#
- **データベース**: Azure CosmosDB (SQL API)
- **ファイルストレージ**: Azure Blob Storage
- **認証**: Azure AD B2C / 大学認証システム
- **AI/ML**: Azure Cognitive Services, OpenAI API

## 3. データベース設計

### 3.1 CosmosDB コンテナ構成

#### Users コンテナ
```json
{
  "id": "user_001",
  "partitionKey": "user",
  "userType": "student|teacher",
  "name": "山田太郎",
  "email": "yamada@mail.doshisha.ac.jp",
  "studentId": "ST001", // 学生の場合
  "department": "データサイエンス学部",
  "createdAt": "2025-07-16T00:00:00Z",
  "lastLoginAt": "2025-07-16T12:00:00Z"
}
```

#### Lectures コンテナ
```json
{
  "id": "lecture_007",
  "partitionKey": "lecture",
  "title": "データサイエンス基礎第7回",
  "subject": "data-science-basic",
  "week": 7,
  "description": "回帰分析と2×2分割表",
  "keywords": [
    "2×2分割表の指標",
    "リスク差・リスク比・オッズ比",
    "混同行列とは",
    "回帰分析の目的",
    "単回帰モデルとは",
    "最小二乗法による回帰係数の推定",
    "決定係数の解釈",
    "Rを用いた回帰分析"
  ],
  "createdAt": "2025-07-16T00:00:00Z"
}
```

#### Files コンテナ
```json
{
  "id": "file_001",
  "partitionKey": "file",
  "fileName": "第7回_データサイエンス基礎.pptx",
  "originalName": "lecture7_datascience.pptx",
  "fileType": "pptx",
  "fileSize": 2048000,
  "blobUrl": "https://storage.blob.core.windows.net/files/file_001.pptx",
  "uploadedBy": "teacher_001",
  "lectureId": "lecture_007",
  "createdAt": "2025-07-16T00:00:00Z",
  "metadata": {
    "extractedText": "...",
    "pageCount": 45
  }
}
```

#### Keywords コンテナ
```json
{
  "id": "keyword_001",
  "partitionKey": "keyword",
  "keyword": "2×2分割表の指標",
  "description": "感度、特異度、精度などの評価指標について詳しく解説",
  "category": "統計分析",
  "lectureId": "lecture_007",
  "extractedFrom": ["file_001", "file_002"],
  "approved": true,
  "approvedBy": "teacher_001",
  "createdAt": "2025-07-16T00:00:00Z",
  "updatedAt": "2025-07-16T00:00:00Z"
}
```

#### Problems コンテナ
```json
{
  "id": "problem_001",
  "partitionKey": "problem",
  "title": "2×2分割表の指標の計算（計算問題）",
  "description": "以下の2×2分割表から、感度、特異度、精度を計算してください。",
  "type": "calculation",
  "difficulty": "standard",
  "keywords": ["2×2分割表の指標"],
  "options": [], // 選択問題の場合
  "correctAnswer": "感度: 89.5%, 特異度: 85.7%, 精度: 87.5%",
  "explanation": "感度 = TP/(TP+FN), 特異度 = TN/(TN+FP), 精度 = (TP+TN)/(TP+TN+FP+FN)",
  "lectureId": "lecture_007",
  "generatedBy": "ai",
  "approved": true,
  "approvedBy": "teacher_001",
  "createdAt": "2025-07-16T00:00:00Z"
}
```

#### SurveyResponses コンテナ
```json
{
  "id": "survey_001",
  "partitionKey": "survey",
  "userId": "user_001",
  "lectureId": "lecture_007",
  "responses": {
    "2×2分割表の指標": 3,
    "リスク差・リスク比・オッズ比": 2,
    "混同行列とは": 4,
    "回帰分析の目的": 5,
    "単回帰モデルとは": 3,
    "最小二乗法による回帰係数の推定": 2,
    "決定係数の解釈": 4,
    "Rを用いた回帰分析": 3
  },
  "averageScore": 3.25,
  "completedAt": "2025-07-16T10:00:00Z"
}
```

#### ProblemResults コンテナ
```json
{
  "id": "result_001",
  "partitionKey": "result",
  "userId": "user_001",
  "problemId": "problem_001",
  "lectureId": "lecture_007",
  "userAnswer": "感度: 90%, 特異度: 85%, 精度: 87%",
  "isCorrect": true,
  "score": 85,
  "feedback": "計算は正確です。小数点の処理に注意しましょう。",
  "timeSpent": 240, // 秒
  "submittedAt": "2025-07-16T11:00:00Z"
}
```

## 4. REST API仕様

### 4.1 認証・ユーザー管理

#### ユーザー認証
```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": "yamada@mail.doshisha.ac.jp",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_001",
    "name": "山田太郎",
    "userType": "student",
    "email": "yamada@mail.doshisha.ac.jp"
  },
  "expiresAt": "2025-07-17T00:00:00Z"
}
```

#### ユーザー情報取得
```
GET /api/users/me
Authorization: Bearer {token}

Response:
{
  "id": "user_001",
  "name": "山田太郎",
  "userType": "student",
  "email": "yamada@mail.doshisha.ac.jp",
  "studentId": "ST001",
  "department": "データサイエンス学部"
}
```

### 4.2 講義・学習管理

#### 講義一覧取得
```
GET /api/lectures
Authorization: Bearer {token}

Response:
{
  "lectures": [
    {
      "id": "lecture_007",
      "title": "データサイエンス基礎第7回",
      "subject": "data-science-basic",
      "week": 7,
      "keywords": ["2×2分割表の指標", "リスク差・リスク比・オッズ比"]
    }
  ]
}
```

#### アンケート回答送信
```
POST /api/surveys
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "lectureId": "lecture_007",
  "responses": {
    "2×2分割表の指標": 3,
    "リスク差・リスク比・オッズ比": 2,
    "混同行列とは": 4
  }
}

Response:
{
  "id": "survey_001",
  "averageScore": 3.0,
  "completedAt": "2025-07-16T10:00:00Z",
  "generatedProblemsCount": 5
}
```

#### 個別問題取得
```
GET /api/problems/personalized
Authorization: Bearer {token}
Query: lectureId=lecture_007

Response:
{
  "problems": [
    {
      "id": "problem_001",
      "title": "2×2分割表の指標の計算",
      "description": "以下の2×2分割表から...",
      "type": "calculation",
      "difficulty": "standard"
    }
  ],
  "totalCount": 5,
  "estimatedTime": 20
}
```

#### 問題回答送信
```
POST /api/problems/{problemId}/submit
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "answer": "感度: 89.5%, 特異度: 85.7%, 精度: 87.5%",
  "timeSpent": 240
}

Response:
{
  "id": "result_001",
  "isCorrect": true,
  "score": 95,
  "feedback": "素晴らしい！正確な計算です。",
  "correctAnswer": "感度: 89.5%, 特異度: 85.7%, 精度: 87.5%",
  "explanation": "感度 = TP/(TP+FN)..."
}
```

### 4.3 教員機能

#### ファイルアップロード
```
POST /api/files/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request:
- file: (binary)
- lectureId: lecture_007
- description: 第7回講義資料

Response:
{
  "id": "file_001",
  "fileName": "第7回_データサイエンス基礎.pptx",
  "fileSize": 2048000,
  "uploadedAt": "2025-07-16T14:00:00Z",
  "processingStatus": "queued"
}
```

#### キーワード自動抽出
```
POST /api/keywords/extract
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "fileIds": ["file_001", "file_002"],
  "lectureId": "lecture_007"
}

Response:
{
  "jobId": "extract_001",
  "status": "processing",
  "estimatedTime": 300,
  "message": "キーワード抽出を開始しました"
}
```

#### キーワード抽出結果取得
```
GET /api/keywords/extract/{jobId}
Authorization: Bearer {token}

Response:
{
  "jobId": "extract_001",
  "status": "completed",
  "keywords": [
    {
      "keyword": "2×2分割表の指標",
      "confidence": 0.95,
      "occurrences": 15,
      "suggestedDescription": "感度、特異度、精度などの評価指標"
    }
  ]
}
```

#### 問題自動生成
```
POST /api/problems/generate
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "lectureId": "lecture_007",
  "keywords": ["2×2分割表の指標", "リスク差・リスク比・オッズ比"],
  "type": "calculation",
  "difficulty": "standard",
  "count": 5
}

Response:
{
  "jobId": "generate_001",
  "status": "processing",
  "estimatedTime": 120,
  "message": "問題生成を開始しました"
}
```

#### 学習分析ダッシュボード
```
GET /api/analytics/dashboard
Authorization: Bearer {token}
Query: lectureId=lecture_007

Response:
{
  "summary": {
    "totalStudents": 42,
    "responseRate": 0.905,
    "averageUnderstanding": 73.2,
    "improvementRate": 5.3
  },
  "keywordAnalysis": [
    {
      "keyword": "2×2分割表の指標",
      "averageScore": 2.8,
      "studentCount": 38,
      "difficulty": "challenging"
    }
  ],
  "studentProgress": [
    {
      "studentId": "ST001",
      "name": "山田太郎",
      "understanding": 78,
      "problemsCompleted": 5,
      "status": "completed"
    }
  ]
}
```

## 5. AI/ML連携

### 5.1 キーワード抽出サービス
```csharp
public class KeywordExtractionService
{
    public async Task<List<ExtractedKeyword>> ExtractKeywordsAsync(
        List<string> fileContents, 
        string subject)
    {
        // Azure Cognitive Services Text Analytics API使用
        // または OpenAI API使用
    }
}
```

### 5.2 問題生成サービス
```csharp
public class ProblemGenerationService
{
    public async Task<List<GeneratedProblem>> GenerateProblemsAsync(
        List<string> keywords,
        ProblemType type,
        DifficultyLevel difficulty,
        int count)
    {
        // OpenAI GPT API使用
    }
}
```

### 5.3 学習分析サービス
```csharp
public class LearningAnalyticsService
{
    public async Task<StudentAnalysis> AnalyzeStudentProgressAsync(
        string studentId,
        string lectureId)
    {
        // 学習パターン分析
        // 推奨学習コンテンツ生成
    }
}
```

## 6. セキュリティ実装

### 6.1 認証・認可
```csharp
[Authorize(Roles = "Teacher")]
[ApiController]
[Route("api/[controller]")]
public class TeacherController : ControllerBase
{
    // 教員専用機能
}

[Authorize(Roles = "Student")]
[ApiController] 
[Route("api/[controller]")]
public class StudentController : ControllerBase
{
    // 学生専用機能
}
```

### 6.2 データ暗号化
```csharp
public class EncryptionService
{
    public string EncryptSensitiveData(string data)
    {
        // Azure Key Vault使用
        // 個人情報の暗号化
    }
}
```

### 6.3 ファイルセキュリティ
```csharp
public class FileValidationService
{
    public bool ValidateFile(IFormFile file)
    {
        // ファイルタイプ検証
        // ウイルススキャン
        // サイズ制限チェック
    }
}
```

## 7. パフォーマンス最適化

### 7.1 キャッシュ戦略
```csharp
[ResponseCache(Duration = 300)] // 5分キャッシュ
public async Task<IActionResult> GetLectures()
{
    // 講義一覧のキャッシュ
}
```

### 7.2 非同期処理
```csharp
public class BackgroundJobService
{
    public async Task QueueKeywordExtraction(string fileId)
    {
        // Azure Service Bus使用
        // バックグラウンド処理キュー
    }
}
```

### 7.3 データベース最適化
```csharp
public class CosmosDbRepository
{
    public async Task<List<T>> QueryWithPagination<T>(
        string query, 
        int pageSize, 
        string continuationToken)
    {
        // ページネーション実装
        // 効率的なクエリ実行
    }
}
```

## 8. 監視・ログ

### 8.1 Application Insights
```csharp
public class TelemetryService
{
    public void TrackUserAction(string action, Dictionary<string, string> properties)
    {
        // ユーザー行動追跡
        // パフォーマンス監視
    }
}
```

### 8.2 ログ設定
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ApplicationInsights": {
    "InstrumentationKey": "your-key-here"
  }
}
```

## 9. 展開・運用

### 9.1 Azure App Service設定
```yaml
# azure-pipelines.yml
trigger:
- main

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: DotNetCoreCLI@2
  inputs:
    command: 'build'
    projects: '**/*.csproj'
    
- task: AzureWebApp@1
  inputs:
    azureSubscription: 'Azure subscription'
    appType: 'webApp'
    appName: 'daib-learning-system'
```

### 9.2 環境設定
```json
{
  "ConnectionStrings": {
    "CosmosDb": "AccountEndpoint=https://...",
    "BlobStorage": "DefaultEndpointsProtocol=https..."
  },
  "OpenAI": {
    "ApiKey": "sk-...",
    "Model": "gpt-4"
  },
  "Azure": {
    "TenantId": "your-tenant-id",
    "ClientId": "your-client-id"
  }
}
```

## 10. 将来拡張

### 10.1 マイクロサービス化
- 認証サービス
- ファイル処理サービス  
- AI/ML サービス
- 分析サービス

### 10.2 リアルタイム機能
- SignalR による即座の通知
- 学習進捗のリアルタイム更新
- 協働学習機能

### 10.3 モバイル対応
- React Native アプリ
- 同一API使用
- プッシュ通知対応