/* flags-grid.js —— /flags/ 网格页的搜索 + 大洲过滤 */
(function () {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  const search = $('#flags-search');
  const chips = $$('#continent-chips .chip');
  const cards = $$('.flag-grid-card');
  const count = $('#flags-count');
  const empty = $('#flags-empty');

  let curContinent = 'all';
  let curQuery = '';

  function normalize(s) { return (s || '').toString().toLowerCase().trim(); }

  function applyFilter() {
    const q = normalize(curQuery);
    let visible = 0;
    cards.forEach((card) => {
      const cont = card.dataset.continent || '';
      const name = normalize(card.dataset.name);
      const nameZh = normalize(card.dataset.nameZh);
      const capital = normalize(card.dataset.capital);
      const cc = normalize(card.dataset.cc);

      const contOk = curContinent === 'all' || cont === curContinent;
      const queryOk = !q || name.includes(q) || nameZh.includes(q) || capital.includes(q) || cc.includes(q);

      const show = contOk && queryOk;
      card.classList.toggle('is-hidden', !show);
      if (show) visible++;
    });
    if (count) {
      count.textContent = 'Showing ' + visible + ' / ' + cards.length + ' flags';
    }
    if (empty) {
      empty.classList.toggle('is-visible', visible === 0);
    }
  }

  // 搜索
  if (search) {
    let t = null;
    search.addEventListener('input', () => {
      curQuery = search.value;
      clearTimeout(t);
      t = setTimeout(applyFilter, 80);
    });
  }

  // 大洲 chip
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.toggle('is-active', c === chip));
      curContinent = chip.dataset.continent;
      applyFilter();
    });
  });

  // 初始显示计数
  applyFilter();
})();
