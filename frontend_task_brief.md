# MeetFlow AI 前端任务说明｜frontend_task_brief

## 1. 任务背景

MeetFlow AI 是一个面向项目协作场景的 AI 会议助手。后端已经完成 V1 MVP，支持会议文本分析、音频上传转写、结构化会议纪要生成、结果校验、文件导出和完整会议记录归档。

现在需要基于现有 FastAPI 后端实现一个最小可运行的前端 Demo。

前端目标不是做复杂平台，而是完成一条可演示的产品主链路：

```text
用户输入会议文本 / 上传会议音频
  ↓
调用后端接口分析
  ↓
展示会议摘要、关键决策、TODO、风险和原始转写文本
  ↓
用户可导出 JSON / Markdown / Excel
```

---

## 2. 重要限制

请严格遵守以下限制：

1. 不要修改 `backend/` 目录中的任何代码；
2. 不要改变现有 FastAPI 接口契约；
3. 前端只通过 HTTP 调用后端接口；
4. 后端默认运行地址为：`http://127.0.0.1:8000`；
5. 不做用户登录；
6. 不做数据库；
7. 不做复杂权限系统；
8. 不做实时录音；
9. 不做飞书同步；
10. 先实现可运行 Demo，再考虑 UI 美化。

---

## 3. 推荐技术栈

前端使用：

- Vite
- React
- TypeScript
- CSS Modules 或普通 CSS

可以使用轻量 UI 样式，但不要引入过重的组件库。

推荐创建目录：

```text
meetflow-ai/
  frontend/
  backend/
  README.md
  frontend_task_brief.md
```

---

## 4. 后端接口清单

后端服务启动方式：

```bash
cd backend
uvicorn main:app --reload
```

后端接口文档：

```text
http://127.0.0.1:8000/docs
```

后端能力说明接口：

```text
GET http://127.0.0.1:8000/api-info
```

当前可用接口：

| 接口 | 方法 | 说明 |
|---|---|---|
| `/health` | GET | 健康检查 |
| `/api-info` | GET | 后端接口能力清单 |
| `/analyze/text` | POST | 输入会议文本，返回结构化会议结果 |
| `/upload/audio` | POST | 上传音频，仅做 ASR 转写 |
| `/analyze/audio` | POST | 上传音频，完成 ASR 转写和会议分析 |
| `/validate/meeting-result` | POST | 对用户编辑后的会议结果进行二次校验 |
| `/export/json` | POST | 导出 JSON 文件 |
| `/export/markdown` | POST | 导出 Markdown 文件 |
| `/export/excel` | POST | 导出 Excel 文件 |
| `/export/meeting-record` | POST | 保存完整会议记录到独立目录 |

---

## 5. 前端必须实现的功能

### 5.1 输入区域

前端首页需要提供两种输入方式：

#### 方式一：粘贴会议文本

用户在文本框中粘贴会议文本，点击“分析文本会议”。

调用接口：

```text
POST /analyze/text
```

请求体：

```json
{
  "transcript": "会议文本内容"
}
```

#### 方式二：上传会议音频

用户上传音频文件，点击“分析音频会议”。

调用接口：

```text
POST /analyze/audio
```

请求类型：

```text
multipart/form-data
```

字段：

```text
file
```

支持格式：

```text
mp3 / wav / m4a / flac
```

---

### 5.2 结果展示区域

分析成功后，前端需要展示以下内容：

1. 会议概览；
2. 会议摘要；
3. 关键决策；
4. TODO 清单；
5. 风险与待确认问题；
6. 原始转写文本。

---

### 5.3 导出区域

分析成功后，提供三个导出按钮：

| 按钮 | 调用接口 |
|---|---|
| 导出 JSON | `POST /export/json` |
| 导出 Markdown | `POST /export/markdown` |
| 导出 Excel | `POST /export/excel` |

导出请求体直接传当前分析结果即可。

如果当前结果来自 `/analyze/audio`，可以直接传完整返回值；后端会自动提取其中的 `meeting_result`。

---

### 5.4 状态提示

前端需要支持：

1. Loading 状态；
2. 错误提示；
3. 空结果提示；
4. 后端未启动提示；
5. 音频分析耗时较长提示。

---

## 6. 数据结构说明

前端主要处理 `MeetingResult`。

```ts
export interface MeetingOverview {
  meeting_title: string;
  meeting_type: string;
  meeting_date: string;
  duration: string;
  participants: string[];
  main_topics: string[];
}

export interface Decision {
  decision: string;
  owner: string;
  evidence_time: string;
  evidence_segment_ids: string[];
  confidence: "high" | "medium" | "low";
}

export interface ActionItem {
  task: string;
  owner: string;
  deadline: string;
  priority: "high" | "medium" | "low";
  status: "not_started" | "in_progress" | "done" | "unknown";
  source: string;
  evidence_time: string;
  evidence_segment_ids: string[];
}

export interface RiskItem {
  risk: string;
  impact: string;
  suggested_followup: string;
  owner: string;
  severity: "high" | "medium" | "low";
  evidence_time: string;
  evidence_segment_ids: string[];
}

export interface TranscriptSegment {
  id: string;
  start: string;
  end: string;
  speaker: string;
  text: string;
  confidence: number | null;
}

export interface MeetingResult {
  meeting_overview: MeetingOverview;
  summary: string;
  decisions: Decision[];
  action_items: ActionItem[];
  risks: RiskItem[];
  transcript_text: string;
  transcript_segments: TranscriptSegment[];
}

export interface AudioAnalyzeResponse {
  filename: string;
  saved_path: string;
  transcript_segments: TranscriptSegment[];
  transcript_text: string;
  meeting_result: MeetingResult;
}
```

---

## 7. 页面结构建议

建议做成一个单页应用。

### 页面布局

```text
顶部 Header
  - 产品名：MeetFlow AI
  - 后端状态提示

主内容区
  左侧：输入区
    - 文本输入
    - 音频上传
    - 分析按钮
    - 清空按钮

  右侧：结果区
    - 会议概览
    - 会议摘要
    - 关键决策表格
    - TODO 表格
    - 风险表格
    - 原始转写文本

底部 / 结果区顶部
  - 导出 JSON
  - 导出 Markdown
  - 导出 Excel
```

---

## 8. 推荐组件拆分

建议组件结构：

```text
frontend/
  src/
    App.tsx
    main.tsx
    api/
      meetflowApi.ts
    types/
      meeting.ts
    components/
      Header.tsx
      TextInputPanel.tsx
      AudioUploadPanel.tsx
      MeetingOverviewCard.tsx
      SummaryCard.tsx
      DecisionsTable.tsx
      ActionItemsTable.tsx
      RisksTable.tsx
      TranscriptPanel.tsx
      ExportButtons.tsx
      ErrorMessage.tsx
      LoadingState.tsx
    styles/
      global.css
```

---

## 9. API 调用要求

### 9.1 后端地址

默认：

```ts
const API_BASE_URL = "http://127.0.0.1:8000";
```

可以后续改成 `.env`：

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

---

### 9.2 文本分析

```text
POST /analyze/text
Content-Type: application/json

{
  "transcript": "..."
}
```

返回：

```ts
MeetingResult
```

---

### 9.3 音频分析

```text
POST /analyze/audio
Content-Type: multipart/form-data
file: File
```

返回：

```ts
AudioAnalyzeResponse
```

前端展示时应使用：

```ts
response.meeting_result
```

但导出时可以直接传完整 response。

---

### 9.4 导出文件

导出接口返回文件流，前端需要创建 blob 下载。

示例逻辑：

```ts
const response = await fetch(`${API_BASE_URL}/export/excel`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(currentResult),
});

const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "meeting_result.xlsx";
a.click();
window.URL.revokeObjectURL(url);
```

---

## 10. 错误处理

后端统一错误格式：

```json
{
  "detail": {
    "error_code": "TEXT_TOO_SHORT",
    "message": "会议文本过短，无法生成有效会议纪要。",
    "detail": "Transcript length is less than 30 characters."
  }
}
```

前端应优先展示：

```ts
error.detail.message
```

如果没有该字段，再展示通用错误：

```text
请求失败，请稍后重试。
```

常见错误码：

| error_code | 前端提示 |
|---|---|
| `TEXT_TOO_SHORT` | 会议文本过短，请补充更多内容 |
| `INVALID_AUDIO_FORMAT` | 音频格式不支持 |
| `AUDIO_FILE_TOO_LARGE` | 音频文件过大 |
| `EMPTY_TRANSCRIPT` | 未识别到有效语音内容 |
| `ASR_FAILED` | 音频转写失败 |
| `LLM_ANALYSIS_FAILED` | 会议分析失败 |
| `VALIDATION_FAILED` | 会议结果结构校验失败 |
| `EXPORT_FAILED` | 文件导出失败 |

---

## 11. UI 风格要求

风格关键词：

```text
简洁
清晰
偏产品 Demo
不要过度花哨
信息密度适中
表格可读
按钮状态明确
```

建议颜色：

- 背景：浅灰或白色；
- 主色：蓝色或深灰；
- 卡片：白底、轻阴影、圆角；
- 表格：清晰边框和表头；
- 错误提示：红色弱提示；
- 成功状态：绿色弱提示。

---

## 12. 最小验收标准

前端完成后，必须满足：

1. 可以启动前端项目；
2. 可以显示后端连接状态；
3. 可以粘贴会议文本并调用 `/analyze/text`；
4. 可以上传音频并调用 `/analyze/audio`；
5. 可以展示会议概览；
6. 可以展示会议摘要；
7. 可以展示关键决策表格；
8. 可以展示 TODO 表格；
9. 可以展示风险表格；
10. 可以展示原始转写文本；
11. 可以导出 JSON；
12. 可以导出 Markdown；
13. 可以导出 Excel；
14. 错误时能展示后端返回的 message；
15. 不修改后端代码。

---

## 13. 建议开发顺序

请按以下顺序开发：

```text
Step 1：创建 Vite + React + TypeScript 项目
Step 2：定义 meeting.ts 类型
Step 3：封装 meetflowApi.ts
Step 4：实现文本输入分析
Step 5：实现结果展示
Step 6：实现导出按钮
Step 7：实现音频上传分析
Step 8：补充 loading 和 error 状态
Step 9：整理 UI 样式
Step 10：补充启动说明
```

---

## 14. 不要做的事情

不要做：

1. 不要修改后端；
2. 不要新增数据库；
3. 不要做登录；
4. 不要做复杂路由；
5. 不要做实时录音；
6. 不要接飞书；
7. 不要重写后端接口；
8. 不要引入过重依赖；
9. 不要把 Demo 做成复杂平台。

---

## 15. 交付内容

完成后请说明：

1. 新增了哪些文件；
2. 如何安装前端依赖；
3. 如何启动前端；
4. 如何启动后端；
5. 如何完成一次文本会议分析；
6. 如何完成一次音频会议分析；
7. 如何导出文件；
8. 当前仍有哪些限制；
9. 后续可以如何优化。