/**
 * DRP Chain Dashboard — UI Controller
 */

'use strict';

// ── State
const blocks   = [];
const mempool  = [];
const posEvents= [];
let   priceData= null;
let   activeTab= 'deri';
const MAX_BLOCKS  = 20;
const MAX_MEMPOOL = 15;
const MAX_POS     = 12;

// ── DOM refs
const $ = id => document.getElementById(id);

// ── Clock
function updateClock() {
  const now = new Date();
  $('clock').textContent = now.toUTCString().slice(17, 25) + ' UTC';
}
setInterval(updateClock, 1000);
updateClock();

// ── Helpers
function fmt(n, dec = 0) {
  return Number(n).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}
function fmtPrice(n) { return '$' + n.toFixed(4); }
function fmtChange(c) {
  const sign = c >= 0 ? '+' : '';
  return `<span class="${c >= 0 ? 'pos-change' : 'neg-change'}">${sign}${c.toFixed(2)}%</span>`;
}

// ── Init chain status
function initStatus() {
  const s = DRP_API.getChainStatus();
  $('chainId').textContent    = s.chainId;
  $('latestBlock').textContent= fmt(s.blockHeight);
  $('blockHash').textContent  = s.blockHash;
  $('validatorCount').textContent = s.validators;
  $('txsToday').textContent   = fmt(s.txsToday);
  $('txDelta').textContent    = s.txDelta;
  $('bondedRights').textContent = fmt(s.bondedRights);
  $('bondedPct').textContent  = s.bondedPct;
  $('avgBlockTime').textContent = s.avgBlockTime;
}
initStatus();

// ── Block Feed
function addBlock() {
  const b = DRP_API.getNewBlock();
  blocks.unshift(b);
  if (blocks.length > MAX_BLOCKS) blocks.pop();

  $('latestBlock').textContent = fmt(b.height);
  $('blockHash').textContent   = b.hash;
  $('txsToday').textContent    = fmt(DRP_API.getChainStatus().txsToday);
  $('txDelta').textContent     = b.txs;

  const feed = $('blockFeed');
  const el   = document.createElement('div');
  el.className = 'block-item';
  el.innerHTML = `
    <span class="block-num">#${fmt(b.height)}</span>
    <span class="block-hash">${b.hash}</span>
    <span class="block-validator">${b.validator}</span>
    <span class="block-txs">${b.txs} txs</span>
    <span class="block-time">${new Date().toISOString().slice(11,19)}</span>
  `;
  feed.insertBefore(el, feed.firstChild);
  if (feed.children.length > MAX_BLOCKS) feed.removeChild(feed.lastChild);
}
setInterval(addBlock, 6200);
// Seed with a few blocks on load
for (let i = 0; i < 6; i++) addBlock();

// ── Token Prices
function updatePrices() {
  priceData = DRP_API.getTokenPrices();
  $('deriPrice').textContent   = fmtPrice(priceData.deriPrice);
  $('rightsPrice').textContent = fmtPrice(priceData.rightsPrice);
  $('deriChange').innerHTML    = fmtChange(priceData.deriChange);
  $('rightsChange').innerHTML  = fmtChange(priceData.rightsChange);
  drawChart();
}
setInterval(updatePrices, 3000);
updatePrices();

// ── Token Chart (Canvas sparkline)
function drawChart() {
  if (!priceData) return;
  const canvas = $('tokenChart');
  const ctx    = canvas.getContext('2d');
  const data   = activeTab === 'deri' ? priceData.deriHistory : priceData.rightsHistory;
  const W = canvas.width  = canvas.offsetWidth;
  const H = canvas.height = 140;
  ctx.clearRect(0, 0, W, H);

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 0.001;
  const pad = 10;

  // Grid lines
  ctx.strokeStyle = '#0d2a3a';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad + (H - 2*pad) * (i / 4);
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Gradient fill
  const color = activeTab === 'deri' ? '#00ff88' : '#00d4ff';
  const grad  = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, color + '44');
  grad.addColorStop(1, color + '00');

  ctx.beginPath();
  data.forEach((v, i) => {
    const x = (i / (data.length - 1)) * (W - 2*pad) + pad;
    const y = H - pad - ((v - min) / range) * (H - 2*pad);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  // Fill to bottom
  ctx.lineTo(W - pad, H); ctx.lineTo(pad, H); ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  data.forEach((v, i) => {
    const x = (i / (data.length - 1)) * (W - 2*pad) + pad;
    const y = H - pad - ((v - min) / range) * (H - 2*pad);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.stroke();
  ctx.shadowBlur = 0;

  $('chartLow').textContent  = 'L: ' + fmtPrice(min);
  $('chartHigh').textContent = 'H: ' + fmtPrice(max);
}

window.switchTab = function(tab) {
  activeTab = tab;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('tab--active'));
  event.target.classList.add('tab--active');
  drawChart();
};

// ── Node Health
function renderNodes() {
  const nodes  = DRP_API.getNodes();
  const online = nodes.filter(n => n.status === 'online').length;
  $('nodeOnlineCount').textContent = `${online}/${nodes.length}`;
  $('nodeList').innerHTML = nodes.map(n => `
    <div class="node-item">
      <span class="node-dot node-dot--${n.status}"></span>
      <span class="node-name">${n.name}</span>
      <span class="node-lat">${n.lat}</span>
      <span class="node-ping ${n.ping && n.ping < 50 ? 'node-ping--fast' : 'node-ping--slow'}">
        ${n.ping ? n.ping + 'ms' : 'OFF'}
      </span>
    </div>
  `).join('');
}
renderNodes();
setInterval(renderNodes, 10_000);

// ── Mempool
function updateMempool() {
  const tx = DRP_API.getMempoolTx();
  mempool.unshift(tx);
  if (mempool.length > MAX_MEMPOOL) mempool.pop();
  $('mempoolSize').textContent = mempool.length + ' pending';
  $('mempoolList').innerHTML = mempool.map(t => `
    <div class="tx-item tx-item--${t.priority}">
      <span class="tx-hash">${t.hash}</span>
      <span class="tx-type">${t.type}</span>
      <span class="tx-fee">${t.fee}</span>
    </div>
  `).join('');
}
setInterval(updateMempool, 2100);
for (let i = 0; i < 8; i++) updateMempool();

// ── Proof of Status Feed
function updatePosFeed() {
  const e = DRP_API.getPosEvent();
  posEvents.unshift(e);
  if (posEvents.length > MAX_POS) posEvents.pop();
  $('posFeed').innerHTML = posEvents.map(ev => `
    <div class="pos-item">
      <span class="pos-role">${ev.role}</span>
      <span class="pos-score">${ev.score}</span><br>
      <span class="pos-addr">${ev.addr}</span>
      <span class="pos-act"> ${ev.action}</span>
    </div>
  `).join('');
}
setInterval(updatePosFeed, 4500);
for (let i = 0; i < 4; i++) updatePosFeed();

// Responsive chart on resize
window.addEventListener('resize', drawChart);
