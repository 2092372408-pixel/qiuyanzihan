(() => {
const english = document.documentElement.lang === 'en';
const STORAGE_KEY = english ? 'sprout-memory-en-v1' : 'sprout-memory-zh-v1';
const MAX_STORED_TURNS = 8; // 8 full user+assistant turns (16 messages)
const MAX_PAYLOAD_BYTES_PRIMARY = 12000; // Fits cleanly under upgraded 16KB Caddy limit
const MAX_PAYLOAD_BYTES_FALLBACK = 3400; // Seamless fallback if upstream still enforces 4KB
const sproutReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const copy = english ? {
  launcher: 'Chat with Sprout', title: 'Sprout · Portfolio Guide',
  greeting: 'Hi, I’m Sprout',
  welcome: 'David’s portfolio assistant. Pick a question below, or just chat with me about his AI projects, research, and internships.',
  close: 'Close', reset: 'New conversation', topics: 'Topics',
  question: 'Message Sprout', placeholder: 'Ask me about EduPilot, research, or internships…', send: 'Send',
  waitStages: ['Sprout is checking', 'Organizing key details', 'Almost ready'],
  timeoutError: 'That took a bit too long to respond. Your question is still in the box — try sending once more.',
  error: 'Oops, I couldn’t reach the server right now. Your message is still in the box — please try again.',
  limit: seconds => `We’ve been chatting fast! Please wait ${seconds}s and try again — I kept your message in the input box.`,
  sources: 'See on page', copyLabel: 'Copy reply', copiedLabel: 'Copied',
  resetToast: 'Started a fresh conversation',
  contextTips: {
    about: 'Hi, I’m Sprout · Ask me anything',
    education: 'Ask me about David’s AI MPhil',
    work: 'Curious about EduPilot or VLM details?',
    publication: 'Want a quick summary of his paper?',
    experience: 'Ask about his Midea & COSMX work',
    honors: 'Click any certificate to zoom in',
    more: 'Ask about his hardware & lab builds',
    contact: 'Leave a note on the left or ask me'
  }
} : {
  launcher: '找小芽聊聊', title: '小芽 · 简历助手',
  greeting: '嗨，我是小芽',
  welcome: 'David 主页的专属小助手。点下方高频问题，或者像聊天一样直接问我他的项目、科研和实习就行。',
  close: '关闭', reset: '开始新对话', topics: '按主题浏览',
  question: '给小芽发消息', placeholder: '随便问问 EduPilot、科研微调或实习经历…', send: '发送',
  waitStages: ['小芽翻一下简历', '正在整理要点', '内容较多，马上就好'],
  timeoutError: '后台思考时间稍微久了一点，已经超时中断。问题还留在输入框里，再点发送试试就好。',
  error: '刚才暂时没连上后台服务，问题已经帮你保留在输入框里，稍后再试一次即可。',
  limit: seconds => `聊得有点快啦，稍等 ${seconds} 秒再发试试，问题我都帮你留在输入框里了。`,
  sources: '对应章节', copyLabel: '复制回答', copiedLabel: '已复制',
  resetToast: '已清空对话记忆，可以重新开始聊啦',
  contextTips: {
    about: '嗨，我是小芽 · 点我聊聊 David',
    education: '想了解港中深 AI MPhil 方向吗？',
    work: '好奇 EduPilot 或 VLM 微调细节？',
    publication: '想 10 秒听完第一作者论文重点吗？',
    experience: '聊聊美的 AI 流程和冠宇实习？',
    honors: '点击证书可以直接放大看原图哦',
    more: '来看看他的材料实验和 3D 打印',
    contact: '可以直接留言，也可以问我怎么联系他'
  }
};

const topics = [
  {
    id: 'overview', label: ['精选', 'Overview'],
    items: [
      {
        source: ['edupilot', 'experience'],
        question: ['最能体现 AI Agent 开发能力的经历是什么？', 'What best demonstrates David’s Agent engineering skills?'],
        answer: [
          '最值得先看 **EduPilot**！这是 David 独立从零做到落地的教学 Agent 平台，把教材问答、浏览器在线写 Python、服务端自动判题和错题反馈串成了闭环，已经在厦门大学信息学院 2 个教学班实际用起来了。\n\n如果你更关注**企业业务里的 AI 落地**，可以再看看他在**美的**的实习——他基于内部 AI 平台独立搭了图像识别到工单归档的自动化流程，把原本约 20 分钟的人工操作压到了 4 分钟，还给团队做了 110+ 人次的培训。',
          'I’d point you to **EduPilot** first! David owned it end to end — requirements, Agent architecture, and full-stack delivery — connecting textbook Q&A, in-browser Python coding, server-side grading, and feedback. Two classes at Xiamen University’s School of Informatics have already used it.\n\nIf you’re also interested in **enterprise automation**, check out his **Midea** internship: he built an image-recognition-to-work-order workflow that cut a typical 20-minute task down to about 4 minutes, and ran trainings for 110+ attendees.'
        ],
        followups: [
          ['EduPilot 里哪些部分是他自己做的？', 'What did David personally build in EduPilot?'],
          ['32 → 12 具体测的是哪项指标？', 'What exactly does the 32-to-12 result measure?']
        ]
      },
      {
        source: ['education', 'experience'],
        question: ['他现在在读什么，想找哪类实习？', 'What is David studying and what roles is he seeking?'],
        answer: [
          'David 目前在**香港中文大学（深圳）**读人工智能研究型硕士（MPhil，2026.09 — 2028.07），本科毕业于厦门大学，期间辅修了**计算机（后端）**相关课程。\n\n他现在正在找 **AI 应用开发 / Agent 研发实习**，平时最关注怎么把 Agent 做得「可控、可验证」——比如工作流编排、工具边界、`MCP`、`RAG` 和长期记忆。具体到岗时间和可实习时长，直接发邮件或留言问他本人最准。',
          'David is an **AI MPhil** student at **CUHK-Shenzhen** (2026.09 — 2028.07), after completing his undergrad at Xiamen University with **minor coursework in Computer Science (Backend Development)**.\n\nHe’s currently looking for **AI Application or Agent Engineering internships**, focusing on reliable agent workflows, tool boundaries, `MCP`, `RAG`, and long-term memory. Feel free to email or leave him a note for exact start dates and availability.'
        ],
        followups: [
          ['最能体现 AI Agent 开发能力的经历是什么？', 'What best demonstrates David’s Agent engineering skills?'],
          ['怎么联系 David？', 'How can I contact David?']
        ]
      },
      {
        source: ['contact'],
        question: ['怎么联系 David？', 'How can I contact David?'],
        answer: [
          '有两种最直接的方式：\n\n• **发邮件**：`yanzihanqiu@link.cuhk.edu.cn`（回复最快）\n• **站内留言**：直接点下方「联系与留言」跳到页面底部表单，留下你的联系方式和想聊的事，David 后台第一时间就能看到。',
          'Two easy ways to reach him:\n\n• **Email**: `yanzihanqiu@link.cuhk.edu.cn` (fastest)\n• **Leave a message**: Jump to the contact form at the bottom of the page — your note goes straight to David’s private inbox.'
        ],
        followups: [
          ['他现在在读什么，想找哪类实习？', 'What is David studying and what roles is he seeking?'],
          ['最能体现 AI Agent 开发能力的经历是什么？', 'What best demonstrates David’s Agent engineering skills?']
        ]
      }
    ]
  },
  {
    id: 'projects', label: ['项目', 'Projects'],
    items: [
      {
        source: ['edupilot'],
        question: ['EduPilot 里哪些部分是他自己做的？', 'What did David personally build in EduPilot?'],
        answer: [
          '基本上整条主链路都是 David **独立主导并全栈落地**的，重点可以拆成三块：\n\n• **完整学习闭环**：把教材问答、浏览器内 Python 编程、服务端判题和错题复练打通，不是单纯的套壳聊天框。\n• **多角色 Agent 编排**：用 `LangGraph` 按规则路由五类教学角色，角色内部用 `ReAct` 调工具，并通过 `MCP` 接入联网检索和网页读取。\n• **工程可靠性**：普通答疑和正式测验隔离、严格以服务端核验成绩更新掌握度，断连时还能干净取消请求并保留已完成判分。',
          'David owned the entire core stack end to end — requirements, Agent architecture, and full-stack engineering:\n\n• **Closed-loop learning**: Tied textbook Q&A, in-browser Python execution, server-side grading, and mistake review into one workflow.\n• **Multi-role orchestration**: Built 5 teaching roles with `LangGraph` rule routing, per-role `ReAct` tool use, hybrid RAG, and `MCP` web tools.\n• **Engineering guardrails**: Isolated tutoring from graded checks, updated mastery only from server-verified results, and propagated cancellation cleanly across SSE, LLM, and MCP calls.'
        ],
        followups: [
          ['32 → 12 具体测的是哪项指标？', 'What exactly does the 32-to-12 result measure?'],
          ['文献抽取项目中，他负责什么？', 'What did he own in the literature extraction project?']
        ]
      },
      {
        source: ['edupilot'],
        question: ['32 → 12 具体测的是哪项指标？', 'What exactly does the 32-to-12 result measure?'],
        answer: [
          '这里的 **32 → 12** 测的是 **记忆维护相关的模型调用次数**——在固定 60 轮合成对话里，通过优化触发与合并策略，这部分调用减少了 **62.5%**。\n\n小芽顺便补充下口径：这项实验专门评估记忆维护开销，没有把整套系统的总调用量、延迟或真实课堂提分算在里面，David 在简历里特意把测试范围写透明了。',
          'That **32 → 12** measures **model calls specifically for memory maintenance** — in a fixed 60-turn synthetic dialogue, those calls dropped by **62.5%**.\n\nTo keep the metric transparent, it isolates memory-maintenance calls rather than total system latency, overall API cost, or classroom test scores.'
        ],
        followups: [
          ['EduPilot 里哪些部分是他自己做的？', 'What did David personally build in EduPilot?'],
          ['怎么联系 David？', 'How can I contact David?']
        ]
      }
    ]
  },
  {
    id: 'research', label: ['科研', 'Research'],
    items: [
      {
        source: ['literature'],
        question: ['文献抽取项目中，他负责什么？', 'What did he own in the literature extraction project?'],
        answer: [
          '在这个层状正极科研知识抽取项目里，David 独立扛下了 **文本、图像和模型微调** 三大块：\n\n• **文本流水线**：已跑通并稳定处理 **7,000+ 篇文献**，把实验合成步骤、性能与形貌结构化，每条事实都能回溯到原文样本与证据。\n• **视觉微调**：做了组合图自动拆分、人工审核裁图与 PDF 区域补图，再在 NVIDIA A6000 上微调 `Qwen3-VL-8B`，400 个基准样品的识别准确率从 **56.7%** 拉升到了 **87.2%**（+30.5 个百分点）。',
          'In this scientific knowledge extraction project (layered cathode materials), David independently owned three pillars:\n\n• **Text pipeline**: Operational across **7,000+ papers**, turning experimental procedures, properties, and morphology into source-traceable structured records.\n• **Vision & fine-tuning**: Built compound-figure splitting with human-reviewed crops and PDF region recovery, then fine-tuned `Qwen3-VL-8B` on an NVIDIA A6000 — lifting recognition accuracy across 400 benchmark samples from **56.7% to 87.2%** (+30.5 percentage points).'
        ],
        followups: [
          ['他以第一作者发表的研究是什么？', 'What is his first-author research about?'],
          ['最能体现 AI Agent 开发能力的经历是什么？', 'What best demonstrates David’s Agent engineering skills?']
        ]
      },
      {
        source: ['publication'],
        question: ['他以第一作者发表的研究是什么？', 'What is his first-author research about?'],
        answer: [
          '是一篇锂电池状态估计与健康预测（SOH/RUL）方向的 **Transformer 全面综述**，作为**第一作者**已被 IOP Publishing 旗下的 *AI for Science* 接收并上线录用稿。\n\n文中系统梳理了 **164 篇文献**、深度对比了 **25 篇核心研究**，并结合 NASA / CALCE 数据做了 Transformer 与 CNN 的实证误差对照。点下方「论文研究」可以直接跳去打开原文 DOI。',
          'He is **first author** on a comprehensive review of **Transformer architectures for lithium-ion battery state estimation and health prognostics**, accepted in *AI for Science* (IOP Publishing, accepted manuscript online).\n\nIt surveys **164 papers**, deeply compares **25 core studies**, and benchmarks Transformer vs. CNN error on NASA and CALCE datasets.'
        ],
        followups: [
          ['文献抽取项目中，他负责什么？', 'What did he own in the literature extraction project?'],
          ['在美的做的 AI 自动化有什么结果？', 'What changed after his AI automation project at Midea?']
        ]
      }
    ]
  },
  {
    id: 'internships', label: ['实习', 'Internships'],
    items: [
      {
        source: ['experience'],
        question: ['在美的做的 AI 自动化有什么结果？', 'What changed after his AI automation project at Midea?'],
        answer: [
          '在美的楼宇科技研发中心实习期间，David 基于公司内部 AI 平台独立搭了一条**「图像识别 → 信息流转 → 工单创建与归档」**的自动化工作流，节点编排和字段映射都是他自己完成的。\n\n落地效果很实在：典型任务耗时从人工约 **20 分钟**降到 **4 分钟左右**，而且他还面向内部同事做了推广培训，累计覆盖 **110+ 人次**。',
          'At Midea Building Technologies R&D, David independently built an end-to-end internal AI workflow covering **image recognition, information routing, work-order creation, and archiving**.\n\nIt cut a typical manual task from roughly **20 minutes down to ~4 minutes**, and he led internal rollout trainings reaching **110+ attendances**.'
        ],
        followups: [
          ['冠宇实习做了哪些工程验证？', 'What did he validate during his COSMX internship?'],
          ['怎么联系 David？', 'How can I contact David?']
        ]
      },
      {
        source: ['experience'],
        question: ['冠宇实习做了哪些工程验证？', 'What did he validate during his COSMX internship?'],
        answer: [
          '在冠宇电源动力电池研发中心，David 独立搭建了 `COMSOL` 动力电池热仿真模型，并把结果和 `Ansys Fluent` 以及真实实验数据做交叉对照，最终将误差控制在 **±15%** 以内。这段经历很能体现他做严谨工程建模与实验核验的底子。',
          'At COSMX Power Battery R&D, David built a `COMSOL` battery thermal model independently and cross-validated it against both `Ansys Fluent` and experimental test data, holding error within **±15%**.'
        ],
        followups: [
          ['在美的做的 AI 自动化有什么结果？', 'What changed after his AI automation project at Midea?'],
          ['他现在在读什么，想找哪类实习？', 'What is David studying and what roles is he seeking?']
        ]
      }
    ]
  }
];

const allFaqItems = topics.flatMap(t => t.items);

const sectionTitles = {
  edupilot: ['EduPilot', 'EduPilot'],
  literature: ['文献知识抽取', 'Literature extraction'],
  experience: ['实习经历', 'Experience'],
  education: ['教育背景', 'Education'],
  publication: ['论文研究', 'Publication'],
  contact: ['联系与留言', 'Contact']
};

/**
 * Natural local intent matcher for greetings, persona identity, and thanks
 * so Sprout responds warmly and immediately instead of hitting rigid boilerplate.
 */
function matchConversationalIntent(rawQuestion) {
  const q = rawQuestion.trim().toLowerCase();
  const isGreeting = /^(你好|您好|嗨|哈喽|hi|hello|hey|早上好|下午好|晚上好|在吗|在不在)[!！。.,?\s]*$/i.test(q);
  const isIdentity = /(你是谁|你叫什么|介绍一下你自己|小芽是谁|who are you|what('?s| is) your name|introduce yourself)/i.test(q);
  const isThanks = /^(谢谢|多谢|感谢|辛苦了|好的谢谢|thanks|thank you|thx|cheers)[!！。.,\s]*$/i.test(q);

  if (isGreeting || isIdentity) {
    return {
      mode: 'saved',
      answer: english
        ? 'Hi! I’m **Sprout**, David’s personal portfolio assistant. I know his AI Agent projects (**EduPilot**), scientific literature & `Qwen3-VL` research, first-author paper, and internships inside out.\n\nAre you looking into his **technical projects**, **research background**, or **internship availability**?'
        : '嗨！我是**小芽**，David 主页的专属小助手。我对他的 AI Agent 项目（**EduPilot**）、科研文献与 `Qwen3-VL` 微调、第一作者论文，还有美的和冠宇的实习经历都很熟。\n\n你想先了解他的**核心项目**、**科研背景**，还是想看看怎么联系他聊实习？',
      sources: [],
      followups: [
        ['最能体现 AI Agent 开发能力的经历是什么？', 'What best demonstrates David’s Agent engineering skills?'],
        ['他现在在读什么，想找哪类实习？', 'What is David studying and what roles is he seeking?'],
        ['怎么联系 David？', 'How can I contact David?']
      ]
    };
  }

  if (isThanks) {
    return {
      mode: 'saved',
      answer: english
        ? 'Glad to help! If you’d like to chat with David directly about a role or project, you can always email `yanzihanqiu@link.cuhk.edu.cn` or drop a quick note in the contact form below.'
        : '不客气！如果后面还想深入看某个项目细节，随时叫我就行；如果想直接联系 David 聊实习或合作，也可以顺手在页面底部给他留个言。',
      sources: [{ id: 'contact', title: sectionTitles.contact[Number(english)] }],
      followups: [
        ['怎么联系 David？', 'How can I contact David?']
      ]
    };
  }

  const isCodingTools = /(coding\s*工具|coding\s*平台|ai\s*coding|codex|claude\s*code|antigravity|常用.*工具|用什么.*ide|写代码.*工具)/i.test(q);
  if (isCodingTools) {
    return {
      mode: 'saved',
      answer: english
        ? 'David works heavily with **AI-native coding workflows** — his go-to platforms listed on the portfolio are `Codex`, `Claude Code`, and `Antigravity`.\n\nOn the engineering stack side, he builds primarily with `Python`, `JavaScript / Node.js`, `SQLite`, `HTTP / SSE`, `LangGraph`, `MCP`, and hybrid `RAG`.'
        : 'David 平时深度使用 AI Coding 工作流，主页上列出的常用平台是 `Codex`、`Claude Code` 和 `Antigravity`。\n\n开发与 Agent 技术栈则集中在 `Python`、`JavaScript / Node.js`、`SQLite`、`HTTP / SSE`，以及 `LangGraph`、`ReAct`、`Tool Calling`、`MCP`、`RAG` 和长期记忆。',
      sources: [{ id: 'experience', title: sectionTitles.experience[Number(english)] }],
      followups: [
        ['EduPilot 里哪些部分是他自己做的？', 'What did David personally build in EduPilot?'],
        ['他现在在读什么，想找哪类实习？', 'What is David studying and what roles is he seeking?']
      ]
    };
  }

  return null;
}

/**
 * Dynamically generates contextual drill-down follow-up questions based on
 * the visitor's actual question, the answer content, cited sections, and
 * previously asked turns (never repeating already-asked or fixed boilerplate).
 */
function buildDynamicFollowups(question, answer, sources, turns) {
  const langIdx = Number(english);
  const combined = `${question || ''} ${answer || ''}`.toLowerCase();
  const ids = new Set((sources || []).map(s => s.id));
  const asked = new Set((turns || []).map(t => t.question.trim().toLowerCase()));
  if (question) asked.add(question.trim().toLowerCase());

  const candidates = [];
  const push = (zh, en, coveredRegex) => {
    const text = langIdx ? en : zh;
    if (asked.has(text.toLowerCase())) return;
    if (coveredRegex && coveredRegex.test(question || '')) return;
    candidates.push(text);
  };

  // Topic-specific deep drill-down follow-ups
  if (/edupilot|langgraph|mcp|判题|教学|agent|记忆|32/.test(combined) || ids.has('edupilot')) {
    push('EduPilot 的 MCP 工具边界和安全限制怎么做的？', 'How does EduPilot enforce MCP tool boundaries?', /mcp|工具边界|白名单/i);
    push('SSE 断连或中途取消时，状态和判分怎么处理？', 'How does it handle SSE disconnects and state recovery?', /断连|取消|状态恢复/i);
    push('记忆维护调用从 32 降到 12 具体是怎么优化的？', 'How were memory maintenance calls cut from 32 to 12?', /32|12|62\.5/i);
    push('教材检索里 BM25 + 向量 + RRF 具体怎么配合？', 'How do BM25, vector search, and RRF work together?', /bm25|rrf|检索/i);
  }

  if (/文献|qwen3-vl|微调|组合图|正极|7,000|7000|87\.2|56\.7/.test(combined) || ids.has('literature')) {
    push('组合图拆分和 PDF 区域补图具体怎么做？', 'How did compound-figure splitting and PDF recovery work?', /组合图|裁图|补图/i);
    push('7,000+ 篇文献怎么防止样本混淆和幻觉？', 'How do you prevent sample mix-ups across 7,000+ papers?', /样本|注册表|混淆|溯源/i);
    push('文献筛选模型是怎么评估误排风险和 API 成本的？', 'How was the screening model evaluated for cost and recall?', /误排|筛选|费用|成本/i);
  }

  if (/论文|综述|transformer|电池|iop|164|nasa|calce/.test(combined) || ids.has('publication')) {
    push('这篇综述在跨工况泛化和部署约束上有哪些结论？', 'What were the key findings on generalization and deployment?', /泛化|部署/i);
    push('NASA 和 CALCE 对照实验里 Transformer 对比 CNN 结果如何？', 'How did Transformers compare against CNNs on NASA/CALCE?', /nasa|calce|cnn/i);
  }

  if (/美的|冠宇|midea|cosmx|工单|comsol|实习|热仿真/.test(combined) || ids.has('experience')) {
    push('美的这套 20 分钟压到 4 分钟的 AI 流程怎么落地的？', 'How was the Midea 20-to-4 minute AI workflow designed?', /20|4 分钟|工单|节点/i);
    push('在冠宇做热仿真对照实验，误差怎么控在 ±15% 以内？', 'How was thermal model error kept within ±15% at COSMX?', /冠宇|cosmx|15%|comsol/i);
    push('结合这些经历，他最适合哪类 AI / Agent 岗位？', 'What AI or Agent roles best fit his background?', /岗位|适合|方向/i);
  }

  if (/港中深|厦门|交大|教育|辅修|后端|本科|硕士|mphil|coding|codex|claude|antigravity/.test(combined) || ids.has('education')) {
    push('本科辅修计算机后端课程，在他哪些项目里体现最明显？', 'Where does his CS backend coursework show up most clearly?', /辅修|后端/i);
    push('展开讲讲他在 EduPilot 里的全栈和 Agent 架构设计', 'Walk me through his full-stack & Agent architecture in EduPilot', /全栈|架构/i);
    push('他平时常用哪些 AI Coding 工具和工程技术栈？', 'What AI coding tools and engineering stack does he use?', /coding|codex|技术栈/i);
  }

  if (/联系|邮箱|留言|微信|到岗/.test(combined) || ids.has('contact')) {
    push('帮我 30 秒总结一下 David 最核心的亮点', 'Give me a 30-second summary of David’s top highlights', /总结|亮点/i);
    push('展开讲讲他最核心的 Agent 代表作 EduPilot', 'Tell me more about his flagship agent project EduPilot', /edupilot/i);
  }

  // Fallback exploration tailored to topics not yet covered in memoryTurns
  if (candidates.length < 2) {
    const explored = (turns || []).map(t => `${t.question} ${t.answer}`).join(' ').toLowerCase();
    if (!/edupilot/.test(explored)) push('展开讲讲 EduPilot 的核心工程设计', 'Walk through EduPilot’s core engineering design');
    if (!/qwen3-vl|文献/.test(explored)) push('聊聊他在科研文献与视觉模型微调上的成果', 'Tell me about his literature extraction & VLM fine-tuning');
    if (!/美的|midea/.test(explored)) push('他在美的实习做的 AI 自动化有什么实际产出？', 'What impact did his AI automation work at Midea have?');
    push('怎么联系 David 进一步交流？', 'How can I get in touch with David?');
  }

  return candidates.slice(0, 2);
}

/**
 * Humanizes generic backend fallback replies so Sprout always stays in character.
 */
function polishBackendResult(result, question) {
  if (!result || typeof result.answer !== 'string') return result;
  if (result.mode === 'reference' && /我可以回答 David 公开简历里|I can answer questions about David/i.test(result.answer)) {
    return {
      ...result,
      answer: english
        ? 'I mainly cover David’s public portfolio — including **EduPilot**, his **scientific literature & VLM fine-tuning** project, his **first-author paper**, and his **Midea / COSMX internships**. If you’re asking about something outside the page (like exact availability or deeper private details), you can drop him a note at the bottom of the page!'
        : '这个问题超出了主页公开信息范围，我没法替 David 乱猜～不过关于他的 **EduPilot 教学 Agent**、**科研文献与视觉模型微调**、**第一作者论文**，以及**美的 / 冠宇实习**，我都很熟！如果是到岗时间或合作细节，点下面「联系与留言」直接找他本人聊最快。',
      sources: [{ id: 'contact', title: sectionTitles.contact[Number(english)] }]
    };
  }
  return result;
}

function appendInlineFormatted(container, text) {
  const tokenRegex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\n]+\*)/g;
  let lastIndex = 0;
  for (const match of text.matchAll(tokenRegex)) {
    if (match.index > lastIndex) {
      container.append(document.createTextNode(text.slice(lastIndex, match.index)));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      const strong = document.createElement('strong');
      strong.textContent = token.slice(2, -2);
      container.append(strong);
    } else if (token.startsWith('`') && token.endsWith('`')) {
      const code = document.createElement('code');
      code.textContent = token.slice(1, -1);
      container.append(code);
    } else if (token.startsWith('*') && token.endsWith('*')) {
      const em = document.createElement('em');
      em.textContent = token.slice(1, -1);
      container.append(em);
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) {
    container.append(document.createTextNode(text.slice(lastIndex)));
  }
}

function createSvgIcon(symbolId) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'icon small');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `#${symbolId}`);
  svg.append(use);
  return svg;
}

async function copyPlainText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
}

function buildCompactPrevious(turns, maxChars = 760) {
  const lines = [];
  for (const t of turns) {
    const clean = String(t.answer || '').replace(/\*\*|`/g, '').replace(/\s+/g, ' ').slice(0, 120);
    lines.push((english ? 'Visitor: ' : '访客: ') + t.question.slice(0, 80));
    lines.push((english ? 'Sprout: ' : '小芽: ') + clean);
  }
  return lines.join('\n').slice(-maxChars);
}

function buildStructuredHistory(turns, userLimit = 180, assistantLimit = 260) {
  const history = [];
  for (const t of turns) {
    history.push({ role: 'user', content: t.question.slice(0, userLimit) });
    history.push({ role: 'assistant', content: String(t.answer || '').replace(/\*\*|`/g, '').replace(/\s+/g, ' ').slice(0, assistantLimit) });
  }
  return history;
}

/**
 * Packs up to MAX_STORED_TURNS (8 full turns = 16 messages) within a strict UTF-8 byte budget.
 * Uses 12KB budget for upgraded 16KB Caddy, and can step down cleanly to 3.4KB on HTTP 413 fallback.
 */
function buildAskPayload(question, turns, byteBudget = MAX_PAYLOAD_BYTES_PRIMARY) {
  const encoder = new TextEncoder();
  const lang = english ? 'en' : 'zh';
  const compact = byteBudget <= 4000;
  let sliceCount = Math.min(turns.length, compact ? 4 : MAX_STORED_TURNS);
  while (sliceCount >= 0) {
    const sub = sliceCount > 0 ? turns.slice(-sliceCount) : [];
    const payload = {
      question,
      previous: buildCompactPrevious(sub, compact ? 320 : 900),
      history: buildStructuredHistory(sub, compact ? 65 : 180, compact ? 95 : 260),
      lang
    };
    if (encoder.encode(JSON.stringify(payload)).length <= byteBudget) return payload;
    sliceCount--;
  }
  return { question: question.slice(0, 300), previous: '', history: [], lang };
}

if (location.hostname === 'qiuyanzihan.space' || location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  const api = '/api/portfolio/';
  if (location.hostname === 'qiuyanzihan.space' && navigator.doNotTrack !== '1' && !navigator.globalPrivacyControl) {
    try {
      const storageKey = 'portfolio-visitor';
      const visitor = localStorage.getItem(storageKey) ?? crypto.randomUUID();
      localStorage.setItem(storageKey, visitor);
      const referrer = document.referrer ? new URL(document.referrer).origin : '';
      void fetch(api + 'visit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true,
        body: JSON.stringify({ path: english ? '/en.html' : '/', referrer, visitor })
      }).catch(() => {});
    } catch {
      // Visits from browsers with unavailable storage are omitted.
    }
  }

  const assistant = document.querySelector('#portfolio-assistant');
  const guideCard = assistant.querySelector('.assistant-guide-card');
  const guideDismiss = assistant.querySelector('.guide-card-dismiss');
  const guideOpen = assistant.querySelector('.guide-open-btn');
  const contextTip = assistant.querySelector('.assistant-context-tip');
  const launcher = assistant.querySelector('.assistant-launch');
  const panel = assistant.querySelector('.assistant-panel');
  const heading = panel.querySelector('h2');
  const greeting = panel.querySelector('.assistant-greeting');
  const closeButton = panel.querySelector('.assistant-close');
  const welcome = panel.querySelector('.assistant-welcome');
  const start = panel.querySelector('.assistant-start');
  const topicBar = panel.querySelector('.assistant-topics');
  const reset = panel.querySelector('.assistant-reset');
  const suggestions = panel.querySelector('.assistant-suggestions');
  const messages = panel.querySelector('.assistant-messages');
  const form = panel.querySelector('form');
  const label = form.querySelector('label');
  const input = form.querySelector('input');
  const button = form.querySelector('button');
  const language = Number(english);
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  let pending = false;
  let activeController = null;

  // Short-term conversation memory (persisted per browser tab session)
  let memoryTurns = [];
  function loadMemory() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        memoryTurns = parsed.filter(t => t && typeof t.question === 'string' && typeof t.answer === 'string').slice(-MAX_STORED_TURNS);
      }
    } catch {
      memoryTurns = [];
    }
  }
  function saveMemory() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(memoryTurns.slice(-MAX_STORED_TURNS)));
    } catch {
      // Ignore quota/privacy storage errors.
    }
  }

  launcher.setAttribute('aria-label', copy.launcher);
  heading.textContent = copy.title;
  if (greeting) greeting.textContent = copy.greeting;
  closeButton.setAttribute('aria-label', copy.close);
  welcome.textContent = copy.welcome;
  topicBar.setAttribute('aria-label', copy.topics);
  reset.setAttribute('aria-label', copy.reset);
  reset.title = copy.reset;
  label.textContent = copy.question;
  input.placeholder = copy.placeholder;
  button.setAttribute('aria-label', copy.send);
  assistant.hidden = false;

  function updateContextTip(sectionId) {
    if (!contextTip) return;
    contextTip.textContent = copy.contextTips[sectionId] || copy.contextTips.about;
  }
  updateContextTip(document.documentElement.dataset.activeSection || 'about');
  window.addEventListener('portfolio:section', (event) => updateContextTip(event.detail));

  function syncSendState() {
    button.classList.toggle('is-ready', Boolean(input.value.trim()) && !pending);
  }
  input.addEventListener('input', syncSendState);
  syncSendState();

  let guideSeen = false;
  try {
    guideSeen = sessionStorage.getItem('portfolio-guide-seen') === '1';
  } catch {
    guideSeen = false;
  }

  function dismissGuide(remember = true) {
    if (!guideCard) return;
    guideCard.classList.remove('is-visible');
    setTimeout(() => { if (!guideCard.classList.contains('is-visible')) guideCard.hidden = true; }, 220);
    if (remember) {
      guideSeen = true;
      try { sessionStorage.setItem('portfolio-guide-seen', '1'); } catch {}
    }
  }

  if (guideCard && !guideSeen && !isTouchDevice) {
    setTimeout(() => {
      if (guideSeen || !panel.hidden || window.scrollY > 360) return;
      guideCard.hidden = false;
      requestAnimationFrame(() => guideCard.classList.add('is-visible'));
    }, 800);
  }

  guideDismiss?.addEventListener('click', () => dismissGuide(true));
  guideOpen?.addEventListener('click', () => {
    dismissGuide(true);
    openPanel(true);
  });
  assistant.querySelectorAll('.guide-jump-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.jump;
      dismissGuide(true);
      if (target && window.spotlightPortfolioTarget) window.spotlightPortfolioTarget(target);
      else if (target) location.hash = target;
    });
  });

  window.addEventListener('scroll', () => {
    if (guideCard && !guideCard.hidden && window.scrollY > 420) dismissGuide(true);
  }, { passive: true });

  function openPanel(open) {
    if (open) {
      dismissGuide(true);
      panel.hidden = false;
      requestAnimationFrame(() => panel.classList.add('is-open'));
    } else {
      panel.classList.remove('is-open');
      setTimeout(() => {
        if (!panel.classList.contains('is-open')) {
          panel.hidden = true;
        }
      }, 200);
    }
    launcher.setAttribute('aria-expanded', String(open));
    if (open) {
      if (isTouchDevice) closeButton.focus({ preventScroll: true });
      else input.focus({ preventScroll: true });
    } else {
      launcher.focus({ preventScroll: true });
    }
  }

  function clearActiveFollowups() {
    messages.querySelectorAll('.assistant-followups').forEach(el => el.remove());
  }

  function addVisitorMessage(text) {
    const message = document.createElement('div');
    message.className = 'assistant-message visitor';
    message.textContent = text;
    messages.append(message);
    messages.scrollTop = messages.scrollHeight;
    return message;
  }

  function addGuideContainer() {
    const row = document.createElement('div');
    row.className = 'assistant-message guide is-pending';

    const avatar = document.createElement('img');
    avatar.className = 'guide-avatar';
    avatar.src = 'images/assistant-sprout.webp';
    avatar.alt = '';
    avatar.width = 22;
    avatar.height = 22;

    const body = document.createElement('div');
    body.className = 'guide-body';
    const status = document.createElement('span');
    status.className = 'guide-thinking';
    const statusText = document.createElement('span');
    statusText.className = 'guide-thinking-text';
    statusText.textContent = copy.waitStages[0];
    const dots = document.createElement('span');
    dots.className = 'typing-dots';
    dots.setAttribute('aria-hidden', 'true');
    dots.append(document.createElement('span'), document.createElement('span'), document.createElement('span'));
    status.append(statusText, dots);
    body.append(status);

    row.append(avatar, body);
    messages.append(row);
    messages.scrollTop = messages.scrollHeight;
    return { row, body, statusText };
  }

  function renderFollowups(container, followupPairs) {
    if (!followupPairs || !followupPairs.length) return;
    const wrap = document.createElement('div');
    wrap.className = 'assistant-followups';
    for (const pair of followupPairs) {
      const qText = Array.isArray(pair) ? pair[language] : pair;
      if (!qText) continue;
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'followup-chip';
      chip.textContent = qText;
      chip.addEventListener('click', () => {
        const matchedFaq = allFaqItems.find(item => item.question[language] === qText);
        void ask(qText, matchedFaq);
      });
      wrap.append(chip);
    }
    if (wrap.children.length) container.append(wrap);
  }

  function renderMarkdownBlocks(target, rawText, showCursor = false) {
    target.replaceChildren();
    let list = null;
    let listTag = null;
    let lastTextEl = null;
    const cleaned = String(rawText || '').trim();
    if (!cleaned) return;
    for (const line of cleaned.split(/\n+/)) {
      const bullet = line.match(/^[•●*-] +(.+)$/);
      const ordered = line.match(/^\d+[.)] +(.+)$/);
      if (bullet || ordered) {
        const nextTag = ordered ? 'ol' : 'ul';
        if (!list || listTag !== nextTag) {
          list = document.createElement(nextTag);
          listTag = nextTag;
          target.append(list);
        }
        const item = document.createElement('li');
        appendInlineFormatted(item, (bullet || ordered)[1]);
        list.append(item);
        lastTextEl = item;
      } else {
        list = null;
        listTag = null;
        const paragraph = document.createElement('p');
        appendInlineFormatted(paragraph, line);
        target.append(paragraph);
        lastTextEl = paragraph;
      }
    }
    if (showCursor && lastTextEl) {
      const cursor = document.createElement('span');
      cursor.className = 'streaming-cursor';
      cursor.setAttribute('aria-hidden', 'true');
      lastTextEl.append(cursor);
    }
  }

  function keepBottomVisible() {
    if (panel.hidden) return;
    const distanceFromBottom = messages.scrollHeight - messages.scrollTop - messages.clientHeight;
    if (distanceFromBottom < 120) {
      messages.scrollTop = messages.scrollHeight;
    }
  }

  async function animateTextStream(body, fullText, signal) {
    if (sproutReducedMotion || !fullText) {
      renderMarkdownBlocks(body, fullText, false);
      return;
    }
    const chars = [...fullText];
    const step = chars.length > 220 ? 5 : chars.length > 100 ? 3 : 2;
    let cursor = 0;
    while (cursor < chars.length) {
      if (signal?.aborted) return;
      cursor = Math.min(chars.length, cursor + step);
      renderMarkdownBlocks(body, chars.slice(0, cursor).join(''), cursor < chars.length);
      keepBottomVisible();
      await new Promise(resolve => setTimeout(resolve, 16));
    }
  }

  async function consumeSseResponse(response, body, onFirstToken, signal) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let accumulated = '';
    let finalMeta = null;
    let firstSeen = false;
    let rafId = 0;

    const scheduleRender = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        renderMarkdownBlocks(body, accumulated, true);
        keepBottomVisible();
      });
    };

    try {
      while (true) {
        if (signal?.aborted) break;
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split(/\r?\n\r?\n/);
        buffer = events.pop() || '';
        for (const rawEvent of events) {
          const dataLines = rawEvent
            .split(/\r?\n/)
            .filter(line => line.startsWith('data:'))
            .map(line => line.slice(5).trim());
          if (!dataLines.length) continue;
          const payloadStr = dataLines.join('\n');
          if (payloadStr === '[DONE]') continue;
          let parsed;
          try {
            parsed = JSON.parse(payloadStr);
          } catch {
            continue;
          }
          const piece = parsed.delta ?? parsed.token ?? parsed.choices?.[0]?.delta?.content ?? '';
          if (piece) {
            if (!firstSeen) {
              firstSeen = true;
              onFirstToken?.();
            }
            accumulated += piece;
            scheduleRender();
          }
          if (parsed.done || parsed.mode || Array.isArray(parsed.sources) || Array.isArray(parsed.followups) || (typeof parsed.answer === 'string' && !piece)) {
            finalMeta = {
              mode: parsed.mode || finalMeta?.mode || 'model',
              answer: typeof parsed.answer === 'string' && parsed.answer ? parsed.answer : accumulated,
              sources: Array.isArray(parsed.sources) ? parsed.sources : (finalMeta?.sources || []),
              followups: Array.isArray(parsed.followups) ? parsed.followups : (finalMeta?.followups || null)
            };
          }
        }
      }
    } finally {
      if (rafId) cancelAnimationFrame(rafId);
      reader.releaseLock();
    }

    return {
      mode: finalMeta?.mode || 'model',
      answer: (finalMeta?.answer || accumulated).trim(),
      sources: finalMeta?.sources || [],
      followups: finalMeta?.followups || null
    };
  }

  function showAnswer(body, result, question, showFollowups = true) {
    const rawAnswer = String(result.answer || '').trim();
    renderMarkdownBlocks(body, rawAnswer, false);

    const footer = document.createElement('div');
    footer.className = 'assistant-message-footer';

    const citations = document.createElement('div');
    citations.className = 'assistant-citations';
    const validSources = (result.sources || []).filter(source => /^[a-z]+$/.test(source.id) && document.getElementById(source.id));
    if (validSources.length) {
      const prefix = document.createElement('span');
      prefix.className = 'citations-label';
      prefix.textContent = copy.sources;
      citations.append(prefix);
      for (const source of validSources) {
        const link = document.createElement('a');
        link.href = '#' + source.id;
        link.textContent = source.title + ' ↗';
        link.addEventListener('click', (event) => {
          event.preventDefault();
          openPanel(false);
          if (window.spotlightPortfolioTarget) window.spotlightPortfolioTarget('#' + source.id);
          else location.hash = source.id;
        });
        citations.append(link);
      }
    }

    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'assistant-copy';
    copyBtn.setAttribute('aria-label', copy.copyLabel);
    copyBtn.title = copy.copyLabel;
    copyBtn.append(createSvgIcon('icon-copy'));
    copyBtn.addEventListener('click', async () => {
      try {
        const plain = rawAnswer.replace(/\*\*(.*?)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1').replace(/\*([^*\n]+)\*/g, '$1');
        await copyPlainText(plain);
        copyBtn.replaceChildren(createSvgIcon('icon-check'));
        copyBtn.classList.add('is-copied');
        copyBtn.title = copy.copiedLabel;
        setTimeout(() => {
          copyBtn.replaceChildren(createSvgIcon('icon-copy'));
          copyBtn.classList.remove('is-copied');
          copyBtn.title = copy.copyLabel;
        }, 1600);
      } catch {
        // Ignore clipboard errors.
      }
    });

    footer.append(citations, copyBtn);
    body.append(footer);

    if (showFollowups) {
      clearActiveFollowups();
      const dynamicList = Array.isArray(result.followups) && result.followups.length
        ? result.followups
        : buildDynamicFollowups(question, rawAnswer, validSources, memoryTurns);
      renderFollowups(body, dynamicList);
    }
  }

  async function ask(question, entry) {
    if (pending || !question) return;
    pending = true;
    button.disabled = true;
    reset.disabled = true;
    input.value = '';
    syncSendState();
    start.hidden = true;
    clearActiveFollowups();
    addVisitorMessage(question);
    const { row, body, statusText } = addGuideContainer();
    const controller = new AbortController();
    activeController = controller;
    let requestTimer;
    const stageTimers = [];
    const clearStageTimers = () => { while (stageTimers.length) clearTimeout(stageTimers.pop()); };
    try {
      let result;
      let alreadyStreamed = false;
      const localIntent = !entry ? matchConversationalIntent(question) : null;
      if (entry || localIntent) {
        if (!sproutReducedMotion) await new Promise(resolve => setTimeout(resolve, 140));
        result = entry ? {
          mode: 'saved',
          answer: entry.answer[language],
          sources: entry.source.map(id => ({ id, title: sectionTitles[id][language] }))
        } : localIntent;
        row.classList.remove('is-pending');
        await animateTextStream(body, result.answer, controller.signal);
        alreadyStreamed = true;
      } else {
        stageTimers.push(setTimeout(() => { if (statusText) statusText.textContent = copy.waitStages[1]; }, 2400));
        stageTimers.push(setTimeout(() => { if (statusText) statusText.textContent = copy.waitStages[2]; }, 6500));

        requestTimer = setTimeout(() => controller.abort(), 30000);
        const sendAsk = (budget) => fetch(api + 'ask', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream, application/json'
          },
          body: JSON.stringify({ ...buildAskPayload(question, memoryTurns, budget), stream: true }),
          signal: controller.signal
        });
        let response = await sendAsk(MAX_PAYLOAD_BYTES_PRIMARY);
        if (response.status === 413) {
          response = await sendAsk(MAX_PAYLOAD_BYTES_FALLBACK);
        }
        if (response.status === 429) {
          const wait = Number(response.headers.get('Retry-After')) || 120;
          if (!input.value) input.value = question;
          body.textContent = copy.limit(wait);
          return;
        }
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const contentType = response.headers.get('Content-Type') || '';
        if (contentType.includes('text/event-stream') && response.body) {
          const streamed = await consumeSseResponse(response, body, () => {
            clearStageTimers();
            row.classList.remove('is-pending');
          }, controller.signal);
          result = polishBackendResult(streamed, question);
          alreadyStreamed = true;
        } else {
          clearStageTimers();
          result = polishBackendResult(await response.json(), question);
          row.classList.remove('is-pending');
          if (result && typeof result.answer === 'string') {
            await animateTextStream(body, result.answer, controller.signal);
            alreadyStreamed = true;
          }
        }
      }

      if (controller.signal.aborted) return;
      if (result && typeof result.answer === 'string') {
        memoryTurns.push({
          question,
          answer: result.answer,
          sources: result.sources || [],
          followups: result.followups || null
        });
        if (memoryTurns.length > MAX_STORED_TURNS) memoryTurns.shift();
        saveMemory();
      }
      showAnswer(body, result, question, true);
      if (alreadyStreamed) keepBottomVisible();
    } catch (err) {
      if (controller.signal.aborted && activeController !== controller) return;
      if (!input.value) input.value = question;
      body.textContent = err && err.name === 'AbortError' ? copy.timeoutError : copy.error;
    } finally {
      clearTimeout(requestTimer);
      clearStageTimers();
      if (activeController === controller) activeController = null;
      row.classList.remove('is-pending');
      pending = false;
      button.disabled = false;
      reset.disabled = false;
      syncSendState();
      if (!panel.hidden && !controller.signal.aborted) {
        const top = row.getBoundingClientRect().top - messages.getBoundingClientRect().top;
        if (top < 0 || row.offsetHeight < messages.clientHeight) {
          messages.scrollTop = messages.scrollHeight;
        }
      }
    }
  }

  function showTopic(topic) {
    for (const tab of topicBar.children) tab.setAttribute('aria-pressed', String(tab.dataset.topic === topic.id));
    suggestions.replaceChildren();
    for (const entry of topic.items) {
      const suggestion = document.createElement('button');
      suggestion.type = 'button';
      const labelSpan = document.createElement('span');
      labelSpan.className = 'suggestion-text';
      labelSpan.textContent = entry.question[language];
      const arrow = document.createElement('span');
      arrow.className = 'suggestion-arrow';
      arrow.textContent = '→';
      arrow.setAttribute('aria-hidden', 'true');
      suggestion.append(labelSpan, arrow);
      suggestion.addEventListener('click', () => {
        if (!isTouchDevice) input.focus({ preventScroll: true });
        void ask(entry.question[language], entry);
      });
      suggestions.append(suggestion);
    }
    start.hidden = false;
    messages.scrollTo({ top: 0, behavior: 'smooth' });
  }

  for (const topic of topics) {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.dataset.topic = topic.id;
    tab.textContent = topic.label[language];
    tab.addEventListener('click', () => { if (!pending) showTopic(topic); });
    topicBar.append(tab);
  }

  reset.addEventListener('click', () => {
    if (activeController) {
      const c = activeController;
      activeController = null;
      c.abort();
    }
    memoryTurns = [];
    saveMemory();
    input.value = '';
    syncSendState();
    messages.querySelectorAll('.assistant-message').forEach(message => message.remove());
    showTopic(topics[0]);
    if (window.showPortfolioToast) window.showPortfolioToast(copy.resetToast);
    if (!isTouchDevice) input.focus({ preventScroll: true });
  });

  // Initialize topics & restore ongoing session memory if visitor already chatted
  showTopic(topics[0]);
  loadMemory();
  if (memoryTurns.length) {
    start.hidden = true;
    memoryTurns.forEach((turn, idx) => {
      addVisitorMessage(turn.question);
      const { row, body } = addGuideContainer();
      row.classList.remove('is-pending');
      showAnswer(body, turn, turn.question, idx === memoryTurns.length - 1);
    });
  }

  launcher.addEventListener('click', () => openPanel(panel.hidden));
  closeButton.addEventListener('click', () => openPanel(false));

  document.addEventListener('pointerdown', event => {
    if (!panel.hidden && !assistant.contains(event.target)) openPanel(false);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) openPanel(false);
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      openPanel(panel.hidden);
    }
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    void ask(input.value.trim());
  });

  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    const submitButton = contactForm.querySelector('button');
    const status = contactForm.querySelector('.contact-status');
    const strings = english ? {
      sending: 'Sending…', sent: 'Your message has been received.',
      invalid: 'Enter your contact details and a short message.',
      limited: 'Too many messages were sent from this connection. Please try later or email David.',
      error: 'Could not send your message. It is still in the form. Please try again or send an email.'
    } : {
      sending: '正在发送…', sent: '留言已收到，感谢联系！',
      invalid: '请填写你的联系方式和留言内容。',
      limited: '当前网络发送的留言较多，请稍后再试，或直接发邮件。',
      error: '留言未能发送，内容已保留。请重试，或直接发邮件。'
    };
    let request;
    function showContactStatus(message, tone) {
      status.textContent = message;
      status.dataset.tone = tone;
      status.hidden = false;
    }
    contactForm.hidden = false;
    contactForm.addEventListener('submit', async event => {
      event.preventDefault();
      if (submitButton.disabled) return;
      const fields = new FormData(contactForm);
      const payload = Object.fromEntries(['name', 'contact', 'message', 'website'].map(name => [name, String(fields.get(name) ?? '').trim()]));
      if (!payload.contact || !payload.message) {
        showContactStatus(strings.invalid, 'error');
        return;
      }
      const signature = JSON.stringify(payload);
      if (request?.signature !== signature) request = { signature, id: crypto.randomUUID() };
      submitButton.disabled = true;
      showContactStatus(strings.sending, 'pending');
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000);
      try {
        const response = await fetch(api + 'contact', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: request.id }), signal: controller.signal
        });
        if (response.ok) {
          showContactStatus(strings.sent, 'success');
          contactForm.reset();
          request = undefined;
        } else {
          const label = response.status === 429 ? strings.limited : response.status === 400 ? strings.invalid : strings.error;
          showContactStatus(label, 'error');
        }
      } catch {
        showContactStatus(strings.error, 'error');
      } finally {
        clearTimeout(timer);
        submitButton.disabled = false;
      }
    });
  }
}

const languageLink = document.querySelector('.language-link');
languageLink?.addEventListener('click', () => {
  const next = new URL(languageLink.href);
  next.hash = location.hash;
  languageLink.href = next;
});
})();
