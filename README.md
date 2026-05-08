# MeetFlow AI｜AI会议助手

MeetFlow AI 是一个面向项目协作场景的 AI 会议助手 Demo，支持用户通过会议文本或会议音频生成结构化会议纪要，并导出 JSON、Markdown、Excel 等格式文件。

本项目 V1 重点验证：

```text
会议内容
  ↓
ASR 语音转写 / 文本输入
  ↓
大模型结构化分析
  ↓
会议摘要 / 决策 / TODO / 风险
  ↓
前端可视化展示
  ↓
JSON / Markdown / Excel 导出
```

---

## 1. 项目背景

在产品、项目管理和跨团队协作场景中，会议结束后通常需要人工整理会议纪要，包括会议摘要、关键决策、TODO、责任人、截止时间和风险问题。

传统人工整理存在以下问题：

- 会后整理耗时长；
- TODO 容易遗漏；
- 责任人和截止时间不清晰；
- 会议结论难以追溯；
- 不同记录人输出质量不稳定；
- 音频回放与手工整理之间存在明显效率损耗。

MeetFlow AI 希望通过 **ASR 语音转写 + 大模型结构化分析 + 前端结果展示 + 多格式导出**，降低会议后处理成本，并提升任务闭环效率。

---

## 2. V1 核心功能

### 2.1 输入能力

- 支持粘贴会议文本；
- 支持上传音频文件；
- 支持音频 ASR 转写；
- 支持保留原始转写文本；
- 支持 transcript 原文追溯。

### 2.2 AI 分析能力

- 生成会议概览；
- 生成会议摘要；
- 提取关键决策；
- 提取 TODO 清单；
- 识别风险与待确认问题；
- 通过 Prompt 分阶段抽取，降低结构混乱概率。

### 2.3 前端交互能力

- 支持文本输入分析；
- 支持音频上传分析；
- 支持会议概览展示；
- 支持摘要、决策、TODO、风险的分区展示；
- 支持 transcript 原文展示；
- 支持 JSON / Markdown / Excel 导出按钮；
- 支持 loading 和 error 状态提示。

### 2.4 工程能力

- 使用 Pydantic 校验结构化输出；
- 支持用户编辑后的二次校验；
- 支持统一错误响应；
- 支持 JSON / Markdown / Excel 导出；
- 支持完整会议记录归档；
- 支持文本和音频两种输入链路；
- 前后端分离，后端提供 API，前端通过 HTTP 调用后端服务。

---

## 3. 技术栈

### Backend

- Python 3.10+
- FastAPI
- Pydantic
- OpenAI SDK compatible API
- faster-whisper
- openpyxl
- python-dotenv
- uvicorn
- FFmpeg

### Frontend

- Node.js 20+
- React
- TypeScript
- Vite
- CSS Modules / Global CSS
- Fetch API

### AI / Model

- LLM：支持 OpenAI SDK 兼容接口，例如 Kimi、OpenAI、DeepSeek 等；
- ASR：faster-whisper；
- 音频处理依赖：FFmpeg。

---

## 4. 项目结构

```text
meetflow-ai/
  README.md
  frontend_task_brief.md
  .gitignore

  backend/
    main.py
    requirements.txt
    .env
    .env.example
    app/
      __init__.py
      config.py
      schemas/
        meeting_schema.py
      services/
        analyzer_service.py
        asr_service.py
        error_service.py
        export_service.py
        llm_service.py
        validation_service.py
      prompts/
        overview_summary.txt
        extract_decisions.txt
        extract_action_items.txt
        extract_risks.txt
        merge_result.txt
      data/
        sample_transcript.txt
    uploads/
    outputs/

  frontend/
    package.json
    package-lock.json
    index.html
    tsconfig.json
    vite.config.ts
    src/
      main.tsx
      App.tsx
      api/
        meetflowApi.ts
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
        ResultView.tsx
        ExportButtons.tsx
        LoadingState.tsx
        ErrorMessage.tsx
      styles/
        global.css
      types/
        meeting.ts
```

---

## 5. 环境准备

### 5.1 必要环境

请先确认本机已安装：

| 工具 | 建议版本 | 说明 |
|---|---:|---|
| Python | 3.10+ | 后端服务运行环境 |
| Node.js | 20+ | 前端 Vite/React 运行环境 |
| npm | 随 Node.js 安装 | 前端依赖管理 |
| FFmpeg | 8.x 或可用版本 | 音频转写依赖 |
| Git | 任意稳定版本 | 版本管理 |

检查命令：

```bash
python --version
node -v
npm -v
ffmpeg -version
git --version
```

> 注意：本项目后端建议使用 **Python 3.10 或以上版本**。如果使用过新的 Python 版本导致部分依赖安装异常，建议切换到 Python 3.10 / 3.11 后重建虚拟环境。

---

## 6. 后端启动方式

### 6.1 进入后端目录

```bash
cd backend
```

### 6.2 创建虚拟环境

```bash
python -m venv .venv
```

### 6.3 激活虚拟环境

Windows PowerShell：

```powershell
.\.venv\Scripts\Activate.ps1
```

macOS / Linux：

```bash
source .venv/bin/activate
```

激活成功后，终端前面通常会出现：

```text
(.venv)
```

### 6.4 安装后端依赖

```bash
python -m pip install -r requirements.txt
```

### 6.5 配置后端环境变量

在 `backend/.env` 中配置：

```env
LLM_API_KEY=your_api_key_here
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4o-mini
```

如果使用 Kimi，可以类似配置：

```env
LLM_API_KEY=你的Kimi_API_Key
LLM_BASE_URL=https://api.moonshot.cn/v1
LLM_MODEL=你的模型名
```

`.env.example` 可以保留示例配置，**不要把真实 API Key 提交到 GitHub**。

### 6.6 启动后端服务

在 `backend` 目录下运行：

```bash
uvicorn main:app --reload
```

启动成功后，终端会出现类似信息：

```text
Uvicorn running on http://127.0.0.1:8000
Application startup complete.
```

后端接口文档：

```text
http://127.0.0.1:8000/docs
```

健康检查地址：

```text
http://127.0.0.1:8000/health
```

后端能力说明地址：

```text
http://127.0.0.1:8000/api-info
```

---

## 7. 前端启动方式

### 7.1 新开一个终端

后端服务启动后，不要关闭后端终端。请在 VSCode 中新开一个终端，用于启动前端。

### 7.2 进入前端目录

在项目根目录执行：

```bash
cd frontend
```

如果当前在 `backend` 目录，可以先返回上一级：

```bash
cd ..
cd frontend
```

### 7.3 安装前端依赖

首次运行前端需要安装依赖：

```bash
npm install
```

### 7.4 启动前端开发服务

```bash
npm run dev -- --host 127.0.0.1 --port 5173
```

启动成功后，终端会出现类似信息：

```text
VITE ready
Local: http://127.0.0.1:5173/
```

在浏览器打开：

```text
http://127.0.0.1:5173/
```

即可访问前端页面。

---

## 8. 本地运行顺序

建议按以下顺序启动：

```text
1. 启动后端
   cd backend
   .\.venv\Scripts\Activate.ps1
   uvicorn main:app --reload

2. 新开终端启动前端
   cd frontend
   npm install
   npm run dev -- --host 127.0.0.1 --port 5173

3. 浏览器访问
   http://127.0.0.1:5173/
```

后端地址：

```text
http://127.0.0.1:8000
```

前端地址：

```text
http://127.0.0.1:5173
```

---

## 9. 前后端联调说明

前端通过 `frontend/src/api/meetflowApi.ts` 调用后端接口。

默认后端地址为：

```text
http://127.0.0.1:8000
```

如果后端端口发生变化，需要同步修改前端 API 基础地址。

典型调用链路：

```text
用户在前端粘贴会议文本
  ↓
前端请求 POST /analyze/text
  ↓
后端调用 AnalyzerService
  ↓
LLM 返回结构化会议结果
  ↓
前端展示会议概览、摘要、决策、TODO、风险
  ↓
用户点击导出按钮
  ↓
前端请求 /export/json、/export/markdown 或 /export/excel
  ↓
浏览器下载文件
```

音频链路：

```text
用户在前端上传音频
  ↓
前端请求 POST /analyze/audio
  ↓
后端保存音频文件
  ↓
faster-whisper 执行 ASR 转写
  ↓
转写文本进入 AnalyzerService
  ↓
LLM 生成结构化会议分析结果
  ↓
前端展示结果并支持导出
```

---

## 10. 当前接口清单

| 接口 | 方法 | 说明 |
|---|---|---|
| `/health` | GET | 健康检查 |
| `/api-info` | GET | 查看后端接口能力清单 |
| `/analyze/text` | POST | 输入会议文本，生成结构化会议结果 |
| `/upload/audio` | POST | 上传音频，仅做 ASR 转写 |
| `/analyze/audio` | POST | 上传音频，完成 ASR 转写和会议分析 |
| `/validate/meeting-result` | POST | 对用户编辑后的会议结果进行二次校验 |
| `/export/json` | POST | 导出 JSON 文件 |
| `/export/markdown` | POST | 导出 Markdown 文件 |
| `/export/excel` | POST | 导出 Excel 文件 |
| `/export/meeting-record` | POST | 导出完整会议记录到独立目录 |

---

## 11. 文本分析接口示例

接口：

```text
POST /analyze/text
```

请求体：

```json
{
  "transcript": "[00:00:03-00:00:12] Speaker 1：我们今天同步一下项目进展。\n\n[00:00:13-00:00:30] Speaker 2：我今天下班前整理问题清单。"
}
```

返回结构：

```json
{
  "meeting_overview": {
    "meeting_title": "string",
    "meeting_type": "string",
    "meeting_date": "string",
    "duration": "string",
    "participants": ["string"],
    "main_topics": ["string"]
  },
  "summary": "string",
  "decisions": [],
  "action_items": [],
  "risks": [],
  "transcript_text": "string",
  "transcript_segments": []
}
```

---

## 12. 音频上传与转写接口示例

接口：

```text
POST /upload/audio
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

返回结构：

```json
{
  "filename": "test.m4a",
  "saved_path": "string",
  "transcript_segments": [
    {
      "id": "seg_001",
      "start": "00:00:00",
      "end": "00:00:05",
      "speaker": "unknown",
      "text": "string",
      "confidence": null
    }
  ],
  "transcript_text": "string"
}
```

---

## 13. 音频分析接口示例

接口：

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

返回结构：

```json
{
  "filename": "test.m4a",
  "saved_path": "string",
  "transcript_segments": [],
  "transcript_text": "string",
  "meeting_result": {
    "meeting_overview": {},
    "summary": "",
    "decisions": [],
    "action_items": [],
    "risks": [],
    "transcript_text": "",
    "transcript_segments": []
  }
}
```

---

## 14. MeetingResult 数据结构

```json
{
  "meeting_overview": {
    "meeting_title": "string",
    "meeting_type": "string",
    "meeting_date": "string",
    "duration": "string",
    "participants": ["string"],
    "main_topics": ["string"]
  },
  "summary": "string",
  "decisions": [
    {
      "decision": "string",
      "owner": "string",
      "evidence_time": "string",
      "evidence_segment_ids": ["string"],
      "confidence": "high | medium | low"
    }
  ],
  "action_items": [
    {
      "task": "string",
      "owner": "string",
      "deadline": "string",
      "priority": "high | medium | low",
      "status": "not_started | in_progress | done | unknown",
      "source": "string",
      "evidence_time": "string",
      "evidence_segment_ids": ["string"]
    }
  ],
  "risks": [
    {
      "risk": "string",
      "impact": "string",
      "suggested_followup": "string",
      "owner": "string",
      "severity": "high | medium | low",
      "evidence_time": "string",
      "evidence_segment_ids": ["string"]
    }
  ],
  "transcript_text": "string",
  "transcript_segments": [
    {
      "id": "string",
      "start": "string",
      "end": "string",
      "speaker": "string",
      "text": "string",
      "confidence": "number | null"
    }
  ]
}
```

---

## 15. 结果校验接口

接口：

```text
POST /validate/meeting-result
```

用途：

```text
AI 生成会议初稿
  ↓
用户编辑 TODO / owner / deadline / priority
  ↓
提交后端二次校验
  ↓
返回合法、可导出的最终版 MeetingResult
```

请求体可以是纯 `MeetingResult`，也可以是包含 `meeting_result` 字段的对象。

成功返回：

```json
{
  "valid": true,
  "meeting_result": {
    "meeting_overview": {},
    "summary": "",
    "decisions": [],
    "action_items": [],
    "risks": [],
    "transcript_text": "",
    "transcript_segments": []
  }
}
```

---

## 16. 导出能力

### 16.1 单文件导出

当前支持：

- `/export/json`
- `/export/markdown`
- `/export/excel`

这三个接口均支持直接传入 `MeetingResult`，也支持传入 `/analyze/audio` 的完整返回。

### 16.2 完整会议记录导出

接口：

```text
POST /export/meeting-record
```

导出结果示例：

```text
outputs/
  meeting_20260507_213012_a1b2c3/
    meeting_result.json
    meeting_minutes.md
    meeting_result.xlsx
    transcript.txt
```

---

## 17. 错误响应格式

统一错误格式：

```json
{
  "detail": {
    "error_code": "TEXT_TOO_SHORT",
    "message": "会议文本过短，无法生成有效会议纪要。",
    "detail": "Transcript length is less than 30 characters."
  }
}
```

常见错误码：

| error_code | 说明 |
|---|---|
| `TEXT_TOO_SHORT` | 会议文本过短 |
| `INVALID_AUDIO_FORMAT` | 音频格式不支持 |
| `AUDIO_FILE_TOO_LARGE` | 音频文件过大 |
| `EMPTY_TRANSCRIPT` | 未识别到有效语音内容 |
| `ASR_FAILED` | 音频转写失败 |
| `LLM_ANALYSIS_FAILED` | 大模型分析失败 |
| `VALIDATION_FAILED` | 会议结果结构校验失败 |
| `EXPORT_FAILED` | 文件导出失败 |

---

## 18. Prompt 工作流

V1 后端采用分阶段 Prompt 工作流，而不是一次性让模型生成所有内容：

```text
会议转写文本
  ↓
Prompt 1：会议概览与摘要
  ↓
Prompt 2：关键决策提取
  ↓
Prompt 3：TODO 抽取
  ↓
Prompt 4：风险与阻塞识别
  ↓
结果合并
  ↓
Pydantic 校验
```

这样做的目的：

- 降低模型输出结构混乱的概率；
- 避免决策、TODO、风险混淆；
- 方便单独调试 Prompt；
- 提高 JSON 输出稳定性；
- 方便后续扩展评估指标。

---

## 19. V1 不做的功能

V1 暂不包含：

- 用户登录；
- 数据库存储；
- 多会议历史管理页面；
- 实时录音转写；
- 说话人真实身份识别；
- 飞书多维表格同步；
- 腾讯会议 / 飞书会议自动接入；
- 前端复杂权限系统；
- 纯文本自动切分 transcript_segments。

对于直接粘贴文本的场景，V1 会保留：

```json
{
  "transcript_text": "用户粘贴的全文",
  "transcript_segments": []
}
```

---

## 20. 后续规划

### V2

- 用户编辑 TODO、责任人、截止时间；
- 飞书多维表格同步；
- 任务状态追踪；
- 多会议历史记录；
- 更完整的结果编辑体验；
- 更完善的前端交互与结果管理。

### V3

- 实时录音和实时转写；
- 说话人识别；
- 历史会议 RAG 查询；
- 根据多次会议生成项目进展报告；
- 接入飞书会议、腾讯会议、Zoom 等平台。

---

## 21. 项目亮点

1. 不直接信任大模型输出，而是通过 Pydantic 进行结构化校验；
2. 支持文本和音频两种输入方式；
3. 支持会议摘要、决策、TODO、风险多维度结构化抽取；
4. 支持 transcript 原文追溯；
5. 支持用户编辑后的二次校验；
6. 支持 JSON、Markdown、Excel 多种格式导出；
7. 支持完整会议记录归档能力；
8. 后端接口具备统一错误响应，便于前端处理；
9. 前后端分离，具备完整 Demo 展示能力；
10. V1 明确控制产品边界，先验证会后处理核心链路，不盲目做实时转写和平台集成。

---

## 22. Git 提交建议

如果修改了 README 或代码，可以按以下流程提交：

```bash
git status
git add README.md
git commit -m "docs: update README with frontend setup"
git push origin main
```

如果修改范围较大，也可以使用：

```bash
git add .
git commit -m "docs: improve project setup guide"
git push origin main
```
