// ==UserScript==
// @name         WWZ ZCOOL Portfolio Exporter
// @namespace    https://wwz.im/
// @version      1.0.1
// @description  Export images from your own ZCOOL works listed on wwz.im, one work at a time.
// @match        https://wwz.im/works*
// @match        https://www.zcool.com.cn/work/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_closeTab
// ==/UserScript==

(() => {
  'use strict';
  const KEY = 'wwz-zcool-export-state';
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const safe = value => String(value || 'work').replace(/[\\/:*?"<>|]+/g, '_').replace(/\s+/g, ' ').trim().slice(0, 90);
  const fileExt = url => {
    try {
      const ext = new URL(url).pathname.match(/\.(jpe?g|png|webp|gif|avif)$/i)?.[1]?.toLowerCase();
      return ext === 'jpeg' ? 'jpg' : (ext || 'jpg');
    } catch { return 'jpg'; }
  };
  const download = (url, name) => new Promise(resolve => {
    GM_download({ url, name, saveAs: false, onload: () => resolve(true), onerror: () => resolve(false), ontimeout: () => resolve(false) });
  });
  const getState = () => GM_getValue(KEY, null);
  const setState = state => GM_setValue(KEY, state);
  const addPanel = (text, action, color = '#222') => {
    const button = document.createElement('button');
    button.textContent = text;
    Object.assign(button.style, { position:'fixed', right:'22px', bottom:'22px', zIndex:2147483647, padding:'12px 18px', border:0, borderRadius:'999px', background:color, color:'#fff', font:'600 14px system-ui', boxShadow:'0 4px 18px #0003', cursor:'pointer' });
    button.addEventListener('click', action);
    document.body.append(button);
    return button;
  };

  async function startFromPortfolio() {
    if (getState()?.running) { alert('导出任务正在运行。'); return; }
    if (!window.WWZ_WORKS_READY) { alert('作品数据尚未加载，请稍后重试。'); return; }
    const works = await window.WWZ_WORKS_READY;
    const queue = (Array.isArray(works) ? works : []).filter(w => w.url && /^https?:\/\//i.test(w.url));
    if (!queue.length) { alert('没有找到可导出的作品链接。'); return; }
    if (!confirm('将按顺序打开 ' + queue.length + ' 个站酷作品页，并下载页面中可访问的作品图片。请先登录站酷，并允许浏览器进行多文件下载。继续？')) return;
    await setState({ running:true, queue, total:queue.length, done:0, failures:[], startedAt:Date.now() });
    openNext();
  }

  function openNext() {
    const state = getState();
    if (!state?.running) return;
    if (!state.queue.length) {
      setState({ ...state, running:false, finished:true });
      alert('导出流程结束。完成作品：' + state.done + '/' + state.total + '；失败或无图：' + state.failures.length + '。下载文件位于浏览器默认下载目录的 WWZ-Works 文件夹。');
      return;
    }
    GM_openInTab(state.queue[0].url, { active:true, insert:true, setParent:true });
  }

  async function processWorkPage() {
    const state = getState();
    if (!state?.running) return;
    const title = document.querySelector('h1')?.textContent?.trim() || document.title || 'work';
    for (let y=0; y<document.body.scrollHeight; y+=900) {
      window.scrollTo(0,y);
      await sleep(450);
    }
    await sleep(1800);
    const nodes = [...document.querySelectorAll('.photoInformationContent .photoImage, img.photoImage')];
    const urls = [...new Set(nodes.map(img => img.currentSrc || img.src || img.getAttribute('data-src')).filter(Boolean).map(url => url.split('?')[0]).filter(url => /^https?:\/\//i.test(url)))];
    const workNo = String(state.done + 1).padStart(3,'0');
    let success = 0;
    for (let i=0; i<urls.length; i++) {
      const url = urls[i];
      const name = 'WWZ-Works/' + workNo + '-' + safe(title) + '/' + String(i+1).padStart(2,'0') + '.' + fileExt(url);
      if (await download(url, name)) success++;
      await sleep(900);
    }
    const nextState = { ...state, queue:state.queue.slice(1), done:state.done+1,
      failures: urls.length && success === urls.length ? state.failures : [...state.failures, { title, url:location.href, found:urls.length, downloaded:success }] };
    await setState(nextState);
    GM_closeTab();
    await sleep(1200);
    openNext();
  }

  if (location.hostname === 'wwz.im') {
    const button = addPanel('导出站酷作品图片', startFromPortfolio);
    const state = getState();
    if (state?.running) button.textContent = '继续导出站酷图片';
    addPanel('停止导出', async () => {
      const current = getState();
      if (current) await setState({ ...current, running:false, stopped:true });
      alert('已停止。已下载的文件会保留。');
    }, '#666');
  } else if (location.pathname.startsWith('/work/')) {
    processWorkPage().catch(async error => {
      const state = getState();
      if (state?.running) {
        await setState({ ...state, running:false, error:String(error) });
        alert('导出中断：' + error.message + '。请检查登录状态后重新开始。');
      }
    });
  }
})();
