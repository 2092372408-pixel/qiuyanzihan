const english = document.documentElement.lang === 'en';
const copy = english ? {
  launcher: 'Open portfolio guide', title: 'Portfolio Guide',
  greeting: 'What would you like to explore?',
  welcome: 'Pick a question below, or ask anything about David’s projects, research, and internships.',
  close: 'Close', reset: 'New conversation', topics: 'Topics',
  question: 'Ask a question', placeholder: 'Ask about EduPilot, research, or experience…', send: 'Send',
  wait: 'Looking it up', error: 'Temporarily unavailable. Please try again in a moment.',
  limit: seconds => `Too many requests — please wait ${seconds}s and try again. Your question is still in the box.`,
  sources: 'Jump to', copyLabel: 'Copy answer', copiedLabel: 'Copied',
  contextTips: {
    about: 'Quick tour · Ask me anything',
    education: 'Ask about his AI MPhil & focus',
    work: 'Ask about EduPilot or VLM details',
    publication: 'Ask about his first-author review',
    experience: 'Ask about Midea & COSMX internships',
    honors: 'Click any certificate to zoom in',
    more: 'Ask about his hands-on builds',
    contact: 'Leave a message or ask availability'
  }
} : {
  launcher: '打开简历导览', title: '简历导览',
  greeting: '想了解哪部分经历？',
  welcome: '点选下方问题，或直接输入关于项目、科研与实习的提问。',
  close: '关闭', reset: '开始新对话', topics: '按主题浏览',
  question: '你的问题', placeholder: '问问 EduPilot 架构、科研微调或实习经历…', send: '发送',
  wait: '正在查阅', error: '暂时无法响应，请稍后再试。',
  limit: seconds => `提问较频繁，请等 ${seconds} 秒后再试，问题已为你保留。`,
  sources: '定位', copyLabel: '复制回答', copiedLabel: '已复制',
  contextTips: {
    about: '点我快速导览 · 随时提问',
    education: '了解港中深 AI MPhil 研究方向',
    work: '想看 EduPilot 或微调核心细节？',
    publication: '了解第一作者综述论文要点',
    experience: '聊聊美的 AI 流程与冠宇实习',
    honors: '点击证书可放大查看原图',
    more: '了解材料实验与 3D 打印创作',
    contact: '欢迎在左侧留言或问到岗时间'
  }
};

const topics = [
  {
    id: 'overview', label: ['精选', 'Overview'],
    items: [
      { source: ['edupilot', 'experience'], question: ['最能体现 AI Agent 开发能力的经历是什么？', 'What best demonstrates David’s Agent engineering skills?'],
        answer: ['首选看 **EduPilot**。David 独立主导需求、Agent 架构和全栈实现，把教材答疑、在线 Python 编程、服务端判题和反馈接成完整学习流程。项目已用于厦门大学信息学院 2 个教学班。\n\n如果关注企业流程自动化，可以再看**美的实习**。David 搭建了从图像识别到工单归档的流程，典型任务耗时由约 20 分钟降至约 4 分钟。', 'Start with **EduPilot**. David independently led requirements, Agent architecture and full-stack delivery, linking textbook Q&A, browser-based Python, server-side judging and feedback. Two Xiamen University School of Informatics classes used the project.\n\nFor business automation, his **Midea** workflow connected image recognition to work-order archiving and reduced a typical task from about 20 minutes to about 4.'] },
      { source: ['contact'], question: ['怎么联系 David？', 'How can I contact David?'],
        answer: ['你可以发邮件到 `yanzihanqiu@link.cuhk.edu.cn`，也可以直接在页面底部的「联系我」表单给 David 留言，他会尽快回复。', 'Email David at `yanzihanqiu@link.cuhk.edu.cn`, or leave him a message directly through the contact form at the bottom of the page.'] },
      { source: ['education', 'experience'], question: ['他在读什么，想找哪类实习？', 'What is David studying and what roles is he seeking?'],
        answer: ['David 在**香港中文大学（深圳）**攻读人工智能 MPhil，预计 2028 年 7 月毕业。目前寻找 **AI 应用 / Agent 研发实习**，重点方向包括工具调用、检索增强（RAG）、长期记忆和工作流编排。到岗时间与可实习时长可通过主页邮件或留言确认。', 'David is pursuing an **AI MPhil** at **CUHK-Shenzhen** and expects to graduate in July 2028. He is seeking internships in **AI applications or Agent engineering**, with interests in tool calling, RAG, long-term memory and workflows. Contact him via email or the message form to confirm availability.'] }
    ]
  },
  {
    id: 'projects', label: ['项目', 'Projects'],
    items: [
      { source: ['edupilot'], question: ['EduPilot 里哪些部分是他自己做的？', 'What did David personally build in EduPilot?'],
        answer: ['David 独立主导了 **EduPilot** 的需求、Agent 架构和全栈实现：\n\n• **学习流程**：把教材问答、浏览器内 Python 编程、服务端判题和错题反馈打通。\n• **Agent 编排**：用 `LangGraph` 路由五类教学角色，接入混合教材检索与 `MCP` 工具。\n• **可信学习记录**：以服务端核验结果更新错题与知识点状态。', 'David independently led **EduPilot**’s requirements, Agent architecture and full-stack implementation:\n\n• **Learning workflow**: connected textbook Q&A, browser-based Python, server-side judging and mistake review.\n• **Agent orchestration**: routed five teaching roles with `LangGraph` and integrated hybrid retrieval and `MCP` tools.\n• **Learning records**: updated mistakes and mastery using verified server-side results.'] },
      { source: ['edupilot'], question: ['32 → 12 具体测的是哪项指标？', 'What exactly does the 32-to-12 result measure?'],
        answer: ['**32 → 12** 指记忆维护模型调用次数。在固定 60 轮合成对话中，这项调用减少了 **62.5%**。该实验统计范围仅为记忆维护模型调用，未报告全部模型调用量、费用、延迟、回答质量或真实课堂效果的变化。', '**32 → 12** measures model calls for memory maintenance. In one fixed synthetic 60-turn dialogue, those calls fell by **62.5%**. The test covers only memory-maintenance calls and does not report changes in total model calls, cost, latency, answer quality or classroom outcomes.'] }
    ]
  },
  {
    id: 'research', label: ['科研', 'Research'],
    items: [
      { source: ['literature'], question: ['文献抽取项目中，他负责什么？', 'What did he own in the literature extraction project?'],
        answer: ['David 独立负责三部分：文本抽取流水线、组合图拆分及 `Qwen3-VL-8B` 微调。\n\n• **文本侧**：把合成步骤、性能和形貌整理成结构化记录，已完成 7,000+ 篇文献提取并保留文献、样本和证据的对应关系。\n• **图像侧**：把组合图拆成子图，结合人工审核裁图和 PDF 区域补图微调模型，400 个基准样品识别准确率从 **56.7%** 提升至 **87.2%**。', 'David independently owned the text extraction pipeline, compound-figure splitting and `Qwen3-VL-8B` fine-tuning:\n\n• **Text pipeline**: processed 7,000+ papers into structured synthesis, performance and morphology records with source-sample provenance.\n• **Vision pipeline**: split compound figures with human-reviewed crops and PDF region recovery, raising accuracy on 400 benchmark samples from **56.7%** to **87.2%**.'] },
      { source: ['publication'], question: ['他以第一作者发表的研究是什么？', 'What is his first-author research about?'],
        answer: ['主页列出的第一作者论文是电池健康状态预测综述，已被 *AI for Science*（IOP Publishing）接收且录用稿已上线。论文系统回顾 **164 篇文献**，并深入比较 **25 篇核心研究**，覆盖 Transformer 架构、跨工况泛化、评估方法和部署约束。', 'His first-author paper is an accepted review of lithium-ion battery state estimation and health prognostics in *AI for Science* (IOP Publishing), with the accepted manuscript online. It reviewed **164 papers** and compared **25 core studies** on Transformer architectures, cross-condition generalization, evaluation and deployment.'] }
    ]
  },
  {
    id: 'internships', label: ['实习', 'Internships'],
    items: [
      { source: ['experience'], question: ['在美的做的 AI 自动化有什么结果？', 'What changed after his AI automation project at Midea?'],
        answer: ['David 独立搭建了从图像识别、信息流转到工单创建与归档的流程，负责节点编排、字段映射和培训。典型任务由人工约 **20 分钟**缩短至约 **4 分钟**，培训累计覆盖 **110+ 人次**。', 'David independently built a workflow covering image recognition, information routing, work-order creation and archiving. He handled workflow nodes, field mapping and training. A typical task went from roughly **20 minutes** to **4 minutes**, and training reached **110+ attendances**.'] },
      { source: ['experience'], question: ['冠宇实习做了哪些工程验证？', 'What did he validate during his COSMX internship?'],
        answer: ['David 独立搭建 `COMSOL` 动力电池热模型，并与 `Ansys Fluent` 和实验数据对照，误差控制在 **±15%**。这项经历体现的是热仿真建模与实验对照能力。', 'David independently built a `COMSOL` thermal model for power batteries and cross-checked it against `Ansys Fluent` and experimental data, keeping error within **±15%**.'] }
    ]
  }
];

const sectionTitles = {
  edupilot: ['EduPilot', 'EduPilot'],
  literature: ['文献知识抽取', 'Literature extraction'],
  experience: ['实习经历', 'Experience'],
  education: ['教育背景', 'Education'],
  publication: ['论文研究', 'Publication'],
  contact: ['联系与留言', 'Contact']
};

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
  const recent = [];
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  let pending = false;

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
    status.textContent = copy.wait;
    const dots = document.createElement('span');
    dots.className = 'typing-dots';
    dots.setAttribute('aria-hidden', 'true');
    dots.append(document.createElement('span'), document.createElement('span'), document.createElement('span'));
    status.append(dots);
    body.append(status);

    row.append(avatar, body);
    messages.append(row);
    messages.scrollTop = messages.scrollHeight;
    return { row, body };
  }

  function showAnswer(body, result) {
    body.replaceChildren();
    let list;
    let listTag = null;
    const rawAnswer = String(result.answer || '').trim();
    for (const line of rawAnswer.split(/\n+/)) {
      const bullet = line.match(/^[•●*-] +(.+)$/);
      const ordered = line.match(/^\d+[.)] +(.+)$/);
      if (bullet || ordered) {
        const nextTag = ordered ? 'ol' : 'ul';
        if (!list || listTag !== nextTag) {
          list = document.createElement(nextTag);
          listTag = nextTag;
          body.append(list);
        }
        const item = document.createElement('li');
        appendInlineFormatted(item, (bullet || ordered)[1]);
        list.append(item);
      } else {
        list = null;
        listTag = null;
        const paragraph = document.createElement('p');
        appendInlineFormatted(paragraph, line);
        body.append(paragraph);
      }
    }

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
  }

  async function ask(question, entry) {
    if (pending || !question) return;
    pending = true;
    button.disabled = true;
    reset.disabled = true;
    input.value = '';
    syncSendState();
    start.hidden = true;
    addVisitorMessage(question);
    const { row, body } = addGuideContainer();
    let requestTimer;
    try {
      let result;
      if (entry) {
        result = {
          mode: 'saved', answer: entry.answer[language],
          sources: entry.source.map(id => ({ id, title: sectionTitles[id][language] }))
        };
      } else {
        const controller = new AbortController();
        requestTimer = setTimeout(() => controller.abort(), 13000);
        const response = await fetch(api + 'ask', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question, previous: recent.join('\n').slice(-400), lang: english ? 'en' : 'zh' }),
          signal: controller.signal
        });
        if (response.status === 429) {
          const wait = Number(response.headers.get('Retry-After')) || 120;
          if (!input.value) input.value = question;
          body.textContent = copy.limit(wait);
          return;
        }
        if (!response.ok) throw new Error('Request failed');
        result = await response.json();
      }
      if (result.mode === 'saved' || result.mode === 'model') {
        recent.push(question);
        if (recent.length > 3) recent.shift();
      }
      showAnswer(body, result);
    } catch {
      if (!input.value) input.value = question;
      body.textContent = copy.error;
    } finally {
      clearTimeout(requestTimer);
      row.classList.remove('is-pending');
      pending = false;
      button.disabled = false;
      reset.disabled = false;
      syncSendState();
      if (!panel.hidden) {
        const top = row.getBoundingClientRect().top - messages.getBoundingClientRect().top;
        messages.scrollTop += top - 16;
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
    recent.length = 0;
    input.value = '';
    syncSendState();
    messages.querySelectorAll('.assistant-message').forEach(message => message.remove());
    showTopic(topics[0]);
    if (!isTouchDevice) input.focus({ preventScroll: true });
  });

  showTopic(topics[0]);
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
