/* flag-detail.js — 单个国家页的交互 */
(function () {
  'use strict';

  const data = window.__flagData || {};
  const cc = data.cc || '';
  const svg1x1 = data.svg1x1 || '';
  const svg4x3 = data.svg4x3 || '';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---------- 工具 ----------
  function showToast(msg) {
    const t = $('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('is-visible');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('is-visible'), 1600);
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (e) {}
    }
    // fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    return ok;
  }

  function minifySvg(svg) {
    // 去注释 + 折叠空白
    return svg
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/>\s+</g, '><')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  // ---------- 1. Copy inline SVG section ----------
  const ratioTabs = $('#ratio-tabs');
  const formatTabs = $('#format-tabs');
  const codeBlock = $('#code-block');
  const copySvgBtn = $('#copy-svg-btn');
  let curRatio = '1x1';
  let curFormat = 'formatted';

  function renderCode() {
    const raw = curRatio === '1x1' ? svg1x1 : svg4x3;
    if (!raw) {
      codeBlock.innerHTML = '<code>SVG not available for this ratio.</code>';
      return;
    }
    const out = curFormat === 'minified' ? minifySvg(raw) : raw.trim();
    codeBlock.textContent = out;
  }
  if (ratioTabs) {
    ratioTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-ratio]');
      if (!btn) return;
      $$('button', ratioTabs).forEach((b) => b.classList.toggle('is-active', b === btn));
      curRatio = btn.dataset.ratio;
      renderCode();
    });
  }
  if (formatTabs) {
    formatTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-format]');
      if (!btn) return;
      $$('button', formatTabs).forEach((b) => b.classList.toggle('is-active', b === btn));
      curFormat = btn.dataset.format;
      renderCode();
    });
  }
  if (copySvgBtn) {
    copySvgBtn.addEventListener('click', async () => {
      const text = codeBlock.textContent;
      const ok = await copyText(text);
      showToast(ok ? '已复制 SVG 到剪贴板' : '复制失败');
    });
  }

  // ---------- 2. Download section ----------
  const dlRatio = $('#dl-ratio');
  const dlSize = $('#dl-size');
  const dlFmt = $('#dl-fmt');
  const dlSizeCustom = $('#dl-size-custom');
  const downloadBtn = $('#download-btn');
  const downloadLabel = $('#download-btn-label');
  const copyUrlBtn = $('#copy-url-btn');

  let state = { ratio: '1x1', size: 64, fmt: 'png' };

  const PRESET_SIZES = [16, 24, 32, 48, 64, 128, 256, 512];

  function buildApiUrl() {
    if (PRESET_SIZES.indexOf(state.size) !== -1 && state.fmt !== 'svg') {
      return '/i/' + state.ratio + '/' + state.size + '/' + encodeURIComponent(cc) + '.' + state.fmt;
    }
    return '/api/flag.php?ratio=' + state.ratio + '&cc=' + encodeURIComponent(cc) +
           '&w=' + state.size + '&fmt=' + state.fmt;
  }

  function updateDownloadLabel() {
    const ratioLabel = state.ratio === '1x1' ? state.size + '×' + state.size : state.size + '×' + Math.round(state.size * 3 / 4);
    const fmtUpper = state.fmt.toUpperCase();
    const verb = state.fmt === 'svg' ? '下载' : '下载';
    downloadLabel.textContent = verb + ' ' + fmtUpper + ' ' + ratioLabel;
  }

  function selectInGroup(group, value) {
    if (!group) return;
    $$('button', group).forEach((b) => b.classList.toggle('is-active', b.dataset.value === String(value)));
  }

  if (dlRatio) {
    dlRatio.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-value]');
      if (!btn) return;
      state.ratio = btn.dataset.value;
      selectInGroup(dlRatio, state.ratio);
      updateDownloadLabel();
    });
  }
  if (dlSize) {
    dlSize.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-value]');
      if (!btn) return;
      state.size = parseInt(btn.dataset.value, 10);
      selectInGroup(dlSize, state.size);
      if (dlSizeCustom) dlSizeCustom.value = '';
      updateDownloadLabel();
    });
  }
  if (dlSizeCustom) {
    dlSizeCustom.addEventListener('input', () => {
      const v = parseInt(dlSizeCustom.value, 10);
      if (Number.isFinite(v) && v >= 8 && v <= 2048) {
        state.size = v;
        // 取消 chip 选中
        if (dlSize) $$('button', dlSize).forEach((b) => b.classList.remove('is-active'));
        updateDownloadLabel();
      }
    });
  }
  if (dlFmt) {
    dlFmt.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-value]');
      if (!btn) return;
      state.fmt = btn.dataset.value;
      selectInGroup(dlFmt, state.fmt);
      updateDownloadLabel();
    });
  }
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const url = buildApiUrl();
      // 用 <a> 触发下载，文件名友好
      const a = document.createElement('a');
      a.href = url;
      a.download = cc + '_' + state.ratio + '_' + state.size + '.' + state.fmt;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
  if (copyUrlBtn) {
    copyUrlBtn.addEventListener('click', async () => {
      const url = new URL(buildApiUrl(), window.location.origin).toString();
      const ok = await copyText(url);
      showToast(ok ? '已复制 URL' : '复制失败');
    });
  }
  updateDownloadLabel();

  // ---------- 3. Direct CDN URL copy buttons ----------
  $$('button[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const target = document.getElementById(btn.dataset.copy);
      if (!target) return;
      const ok = await copyText(target.textContent);
      showToast(ok ? '已复制 URL' : '复制失败');
    });
  });

  // ---------- 4. Esc 关闭（虽然没 modal，留着防 keyboard trap） ----------
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // 没东西可关
    }
  });
})();
