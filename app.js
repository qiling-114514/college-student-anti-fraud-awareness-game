(function () {
  'use strict';

  var SAVE_KEY = 'ancient-war-card-save-v1';
  var START_VALUE = 50;
  var MAX_VALUE = 100;
  var LOG_LIMIT = 50;

  var STAT_KEYS = ['military', 'food', 'people', 'treasury'];

  var STAT_NAMES = {
    military: '兵力',
    food: '粮草',
    people: '民心',
    treasury: '国库'
  };

  var CARDS = [
    { id: 1, title: '征兵告示', desc: '边境吃紧，主簿请命张贴征兵告示，扩充行伍。',
      left: { label: '强征入伍', effects: { military: 12, people: -8, food: -4 } },
      right: { label: '缓征兵役', effects: { military: -6, people: 5 } } },

    { id: 2, title: '粮草告急', desc: '前线军粮仅够十日，将军火速请命调拨。',
      left: { label: '开仓调粮', effects: { food: -8, military: 6, treasury: -4 } },
      right: { label: '就地征粮', effects: { food: 8, people: -10 } } },

    { id: 3, title: '边境烽火', desc: '边关狼烟骤起，斥候来报敌骑大举来犯。',
      left: { label: '出兵迎敌', effects: { military: -10, treasury: -6, people: 4 } },
      right: { label: '固守不出', effects: { military: 4, food: -6, people: -6 } } },

    { id: 4, title: '瘟疫蔓延', desc: '城中疫病横行，医官告急，百姓惶恐不安。',
      left: { label: '拨银赈疫', effects: { treasury: -12, people: 10, military: -2 } },
      right: { label: '封锁城门', effects: { people: -12, military: 4, treasury: 2 } } },

    { id: 5, title: '国库空虚', desc: '户部上奏，国库几近见底，用度难以为继。',
      left: { label: '增加赋税', effects: { treasury: 15, people: -12 } },
      right: { label: '缩减开支', effects: { treasury: 6, military: -6 } } },

    { id: 6, title: '赏赐功臣', desc: '大将凯旋而归，群臣奏请厚赏以振军心。',
      left: { label: '重金封赏', effects: { treasury: -12, military: 8, people: 3 } },
      right: { label: '口惠不实', effects: { military: -8, people: -5, treasury: 4 } } },

    { id: 7, title: '流民叛乱', desc: '连年饥荒，流民聚众揭竿，逼近城郊。',
      left: { label: '派兵镇压', effects: { military: -8, people: -10, food: 2 } },
      right: { label: '开仓赈济', effects: { food: -12, people: 12, treasury: -4 } } },

    { id: 8, title: '邻国来使', desc: '邻邦遣使朝见，愿与我国修盟结好。',
      left: { label: '结盟修好', effects: { treasury: -6, people: 6, military: 4 } },
      right: { label: '拒之门外', effects: { military: -5, people: -5 } } },

    { id: 9, title: '围城攻坚', desc: '我军围城日久，师老兵疲，进退两难。',
      left: { label: '强攻破城', effects: { military: -12, treasury: 10, food: -4 } },
      right: { label: '久困待降', effects: { food: -8, military: 2, people: -4 } } },

    { id: 10, title: '休养生息', desc: '连年征战，百姓亟需休养生息、恢复元气。',
      left: { label: '减税安民', effects: { people: 10, treasury: -8, food: 4 } },
      right: { label: '继续备战', effects: { military: 8, people: -8, food: -4 } } },

    { id: 11, title: '加征税赋', desc: '用度不足，朝中有臣请议加征商税。',
      left: { label: '加征商税', effects: { treasury: 10, people: -8 } },
      right: { label: '暂不加税', effects: { people: 6, treasury: -4 } } },

    { id: 12, title: '减税惠民', desc: '有司请减田赋以苏民困、安天下。',
      left: { label: '减免田赋', effects: { people: 10, treasury: -10, food: 3 } },
      right: { label: '维持旧制', effects: { treasury: 4, people: -6 } } },

    { id: 13, title: '修建长城', desc: '北疆游牧屡屡犯境，请筑边墙以御敌。',
      left: { label: '大兴土木', effects: { military: 10, treasury: -12, people: -6 } },
      right: { label: '暂缓工程', effects: { treasury: 6, military: -4 } } },

    { id: 14, title: '疏通河道', desc: '河道淤塞，水患频仍，有司请征夫疏浚。',
      left: { label: '征夫疏浚', effects: { food: 10, people: -6, treasury: -6 } },
      right: { label: '听之任之', effects: { food: -10, people: -8 } } },

    { id: 15, title: '校场阅兵', desc: '将军请行大阅，以壮军威、慑四方。',
      left: { label: '盛大阅兵', effects: { military: 8, treasury: -10, people: 2 } },
      right: { label: '节省军费', effects: { treasury: 6, military: -4 } } },

    { id: 16, title: '刺客行刺', desc: '深夜有刺客潜入宫闱，幸被禁卫拦下。',
      left: { label: '严查禁卫', effects: { military: 4, people: -6, treasury: -4 } },
      right: { label: '加强护卫', effects: { military: 6, treasury: -6 } } },

    { id: 17, title: '和亲之议', desc: '外邦遣使，请以公主和亲，永结盟好。',
      left: { label: '遣女和亲', effects: { military: 8, people: -6, treasury: -4 } },
      right: { label: '断然拒绝', effects: { military: -6, people: 4 } } },

    { id: 18, title: '商队入境', desc: '西域商队请求通关，愿以货物互通有无。',
      left: { label: '开放互市', effects: { treasury: 12, food: 4, people: 2 } },
      right: { label: '闭关自守', effects: { treasury: -4, people: -4 } } },

    { id: 19, title: '旱涝天灾', desc: '天降大灾，田禾尽毁，饥民遍野。',
      left: { label: '开仓救民', effects: { food: -12, people: 10 } },
      right: { label: '听天由命', effects: { food: -8, people: -12 } } },

    { id: 20, title: '五谷丰登', desc: '风调雨顺，仓廪将满，举国同庆。',
      left: { label: '储粮备战', effects: { food: 12, military: 2 } },
      right: { label: '犒赏军民', effects: { food: -6, people: 8, military: 4 } } },

    { id: 21, title: '铸造新钱', desc: '户部请铸新币，以平抑物价、充盈府库。',
      left: { label: '开炉铸钱', effects: { treasury: 10, people: -4 } },
      right: { label: '暂不铸钱', effects: { treasury: -4 } } },

    { id: 22, title: '私铸泛滥', desc: '市面私铸劣钱横行，物价飞涨。',
      left: { label: '严惩私铸', effects: { treasury: 8, people: -6 } },
      right: { label: '睁一只眼', effects: { people: 2, treasury: -8 } } },

    { id: 23, title: '士兵逃亡', desc: '军中逃卒日增，士气低落，将领忧心。',
      left: { label: '严惩逃兵', effects: { military: 4, people: -8 } },
      right: { label: '抚恤军士', effects: { military: 8, treasury: -10 } } },

    { id: 24, title: '名将来投', desc: '有一名将慕名来归，愿为大王效命。',
      left: { label: '破格重用', effects: { military: 14, treasury: -8 } },
      right: { label: '婉言谢绝', effects: { military: -4 } } },

    { id: 25, title: '巫蛊之祸', desc: '宫中出现巫蛊诅咒之物，人心惶惶。',
      left: { label: '彻查株连', effects: { people: -12, military: -4 } },
      right: { label: '息事宁人', effects: { people: 4, treasury: -4 } } },

    { id: 26, title: '举荐贤才', desc: '郡国推举贤良入朝，群臣请大王纳贤。',
      left: { label: '广纳贤才', effects: { people: 6, military: 4, treasury: -6 } },
      right: { label: '置之不理', effects: { people: -6 } } },

    { id: 27, title: '修建宫殿', desc: '有司请修离宫别苑，以彰显王威。',
      left: { label: '大兴宫室', effects: { treasury: -14, people: -8 } },
      right: { label: '罢修宫室', effects: { people: 6, treasury: 4 } } },

    { id: 28, title: '削减后宫', desc: '后宫开支巨大，有臣请裁撤冗员。',
      left: { label: '裁撤冗员', effects: { treasury: 10, people: 2 } },
      right: { label: '维持现状', effects: { treasury: -6, people: -2 } } },

    { id: 29, title: '御史弹劾', desc: '御史弹劾重臣贪墨，满朝哗然。',
      left: { label: '依法查办', effects: { people: 8, treasury: 4, military: -4 } },
      right: { label: '压下不表', effects: { people: -8, treasury: -4 } } },

    { id: 30, title: '城墙修缮', desc: '旧城年久失修，有崩塌之险，请拨银修葺。',
      left: { label: '拨银修城', effects: { military: 8, treasury: -10 } },
      right: { label: '暂缓修缮', effects: { military: -4, treasury: 4 } } },

    { id: 31, title: '江湖侠客', desc: '一侠客请命，愿孤身刺杀敌酋。',
      left: { label: '遣其前往', effects: { military: 6, treasury: -6 } },
      right: { label: '不置可否', effects: { military: -2 } } },

    { id: 32, title: '山贼横行', desc: '商路被山贼劫掠，行旅断绝，怨声载道。',
      left: { label: '派兵清剿', effects: { military: -6, treasury: 8, people: 4 } },
      right: { label: '视而不见', effects: { treasury: -8, people: -6 } } },

    { id: 33, title: '盐铁之议', desc: '有臣请行盐铁专卖，以充国用。',
      left: { label: '盐铁官营', effects: { treasury: 12, people: -8 } },
      right: { label: '听民自营', effects: { people: 6, treasury: -8 } } },

    { id: 34, title: '匈奴犯边', desc: '匈奴铁骑大举南下，边关连连告急。',
      left: { label: '倾力抵抗', effects: { military: -10, people: 6, treasury: -8 } },
      right: { label: '纳贡求和', effects: { treasury: -10, military: -4, people: -4 } } },

    { id: 35, title: '盟约缔结', desc: '多国遣使，邀约共结同盟，共御强敌。',
      left: { label: '缔结盟约', effects: { military: 8, treasury: -6, people: 2 } },
      right: { label: '保持中立', effects: { military: -4, treasury: 2 } } },

    { id: 36, title: '内奸泄密', desc: '军机外泄，疑有内奸通敌，须速查。',
      left: { label: '严查奸细', effects: { military: 6, people: -8 } },
      right: { label: '加强保密', effects: { military: 2, treasury: -4 } } },

    { id: 37, title: '军粮被劫', desc: '运粮队半途遇袭，粮草尽失，军心浮动。',
      left: { label: '重兵押运', effects: { military: -6, food: 6, treasury: -4 } },
      right: { label: '就地补征', effects: { food: 4, people: -8 } } },

    { id: 38, title: '祭祀天地', desc: '太常请行郊祀大典，以祈国泰民安。',
      left: { label: '隆重祭祀', effects: { treasury: -10, people: 6 } },
      right: { label: '一切从简', effects: { treasury: 4, people: -4 } } },

    { id: 39, title: '皇子争储', desc: '诸皇子争位，朝局暗涌，大臣观望。',
      left: { label: '早立储君', effects: { people: 6, military: 2 } },
      right: { label: '暂不立储', effects: { people: -6, military: -2 } } },

    { id: 40, title: '移民垦荒', desc: '有司请迁民垦荒，以实边地、广积粮。',
      left: { label: '移民实边', effects: { food: 8, military: 6, people: -6 } },
      right: { label: '安居本土', effects: { people: 6, food: -4 } } },

    { id: 41, title: '兴修水利', desc: '请开渠引水，灌溉农田，以解旱情。',
      left: { label: '兴修水利', effects: { food: 12, treasury: -10, people: -4 } },
      right: { label: '缓修水利', effects: { food: -4, treasury: 4 } } },

    { id: 42, title: '边关互市', desc: '请开边市，以通有无，惠及边民。',
      left: { label: '开放边市', effects: { treasury: 10, food: 4, military: -2 } },
      right: { label: '禁止边市', effects: { military: 4, treasury: -6 } } },

    { id: 43, title: '悬赏缉盗', desc: '大盗横行，扰民劫财，有司请悬赏缉拿。',
      left: { label: '重金悬赏', effects: { treasury: -8, people: 8, military: 2 } },
      right: { label: '置之不理', effects: { people: -6 } } },

    { id: 44, title: '大赦天下', desc: '逢节有臣请大赦，以彰仁德、安民心。',
      left: { label: '大赦天下', effects: { people: 10, military: -4 } },
      right: { label: '严刑不赦', effects: { military: 4, people: -6 } } },

    { id: 45, title: '开科取士', desc: '请开科取士，广纳天下贤才入仕。',
      left: { label: '开科取士', effects: { people: 8, military: 2, treasury: -6 } },
      right: { label: '沿用旧制', effects: { people: -4 } } },

    { id: 46, title: '铸甲造械', desc: '军械甲胄陈旧，将领请扩充军备。',
      left: { label: '扩充军备', effects: { military: 12, treasury: -12, food: -2 } },
      right: { label: '维持现状', effects: { military: -4, treasury: 4 } } }
  ];

  var state = freshState();

  function freshState() {
    return {
      military: START_VALUE,
      food: START_VALUE,
      people: START_VALUE,
      treasury: START_VALUE,
      turn: 1,
      currentCard: null,
      lastCardId: null,
      deck: newDeck(),
      ended: false,
      failStat: null,
      failReason: '',
      log: []
    };
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function newDeck() {
    var ids = CARDS.map(function (c) { return c.id; });
    return shuffle(ids);
  }

  function drawCard() {
    if (state.deck.length === 0) {
      state.deck = newDeck();
      var last = state.deck.length - 1;
      if (state.deck.length > 1 && state.deck[last] === state.lastCardId) {
        var swap = Math.floor(Math.random() * (state.deck.length - 1));
        var tmp = state.deck[last];
        state.deck[last] = state.deck[swap];
        state.deck[swap] = tmp;
      }
    }
    var id = state.deck.pop();
    state.lastCardId = id;
    state.currentCard = CARDS.filter(function (c) { return c.id === id; })[0] || null;
  }

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  function formatDelta(effects) {
    var parts = [];
    STAT_KEYS.forEach(function (k) {
      var v = effects[k];
      if (v) {
        var cls = v > 0 ? 'up' : 'down';
        var sign = v > 0 ? '+' : '';
        parts.push(STAT_NAMES[k] + '<span class="' + cls + '">' + sign + v + '</span>');
      }
    });
    return parts.join('、');
  }

  function buildFailReason(key) {
    var name = STAT_NAMES[key];
    var v = state[key];
    if (v <= 0) { return name + '已耗尽（当前 ' + v + '）'; }
    return name + '过于充盈（当前 ' + v + '，超过上限 100）';
  }

  var cardEl = document.getElementById('card');
  var cardTitleEl = document.getElementById('cardTitle');
  var cardDescEl = document.getElementById('cardDesc');
  var labelLeftEl = document.getElementById('labelLeft');
  var labelRightEl = document.getElementById('labelRight');
  var turnNumEl = document.getElementById('turnNum');
  var eventLogEl = document.getElementById('eventLog');
  var leftBtn = document.getElementById('leftBtn');
  var rightBtn = document.getElementById('rightBtn');
  var restartBtn = document.getElementById('restartBtn');
  var restartBtn2 = document.getElementById('restartBtn2');
  var overlayEl = document.getElementById('overlay');
  var failTextEl = document.getElementById('failText');
  var turnResultEl = document.getElementById('turnResult');

  var valueEls = {};
  var fillEls = {};
  STAT_KEYS.forEach(function (k) {
    valueEls[k] = document.getElementById('val-' + k);
    fillEls[k] = document.getElementById('fill-' + k);
  });

  function renderStats() {
    STAT_KEYS.forEach(function (k) {
      var v = state[k];
      valueEls[k].textContent = v;
      fillEls[k].style.width = clamp(v, 0, MAX_VALUE) + '%';
    });
  }

  function renderTurn() {
    turnNumEl.textContent = state.turn;
  }

  function renderCard() {
    var c = state.currentCard;
    if (!c) {
      cardTitleEl.textContent = '—';
      cardDescEl.textContent = '—';
      labelLeftEl.textContent = '左选择';
      labelRightEl.textContent = '右选择';
      leftBtn.textContent = '◀ 左选';
      rightBtn.textContent = '右选 ▶';
      return;
    }
    cardTitleEl.textContent = c.title;
    cardDescEl.textContent = c.desc;
    labelLeftEl.textContent = c.left.label;
    labelRightEl.textContent = c.right.label;
    leftBtn.textContent = '◀ ' + c.left.label;
    rightBtn.textContent = c.right.label + ' ▶';
  }

  function renderLog() {
    if (state.log.length === 0) {
      eventLogEl.innerHTML = '<div class="log-item">尚无异动，江山初定。</div>';
      return;
    }
    eventLogEl.innerHTML = state.log.map(function (e) {
      return '<div class="log-item">' +
        '<span class="log-turn">第' + e.turn + '回合</span>' +
        '<span class="log-title">' + escapeHtml(e.title) + '</span>' +
        '<span class="log-choice">「' + escapeHtml(e.label) + '」</span>' +
        '<span class="log-delta">' + e.delta + '</span>' +
        '</div>';
    }).join('');
    eventLogEl.scrollTop = 0;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function render() {
    renderStats();
    renderTurn();
    renderCard();
    renderLog();
    leftBtn.disabled = state.ended;
    rightBtn.disabled = state.ended;
  }

  function save() {
    var data = {
      military: state.military,
      food: state.food,
      people: state.people,
      treasury: state.treasury,
      turn: state.turn,
      currentCardId: state.currentCard ? state.currentCard.id : null,
      lastCardId: state.lastCardId,
      deck: state.deck,
      ended: state.ended,
      failStat: state.failStat,
      failReason: state.failReason,
      log: state.log.slice(0, LOG_LIMIT)
    };
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (e) { /* 隐私模式或 file:// 下存档不可用时忽略 */ }
  }

  function load() {
    var raw;
    try {
      raw = localStorage.getItem(SAVE_KEY);
    } catch (e) { return false; }
    if (!raw) { return false; }
    try {
      var d = JSON.parse(raw);
      if (typeof d.military !== 'number' ||
          typeof d.food !== 'number' ||
          typeof d.people !== 'number' ||
          typeof d.treasury !== 'number') {
        return false;
      }
      state.military = d.military;
      state.food = d.food;
      state.people = d.people;
      state.treasury = d.treasury;
      state.turn = (typeof d.turn === 'number' && d.turn > 0) ? d.turn : 1;
      state.deck = Array.isArray(d.deck) ? d.deck : [];
      state.lastCardId = (d.lastCardId != null) ? d.lastCardId : null;
      state.ended = !!d.ended;
      state.failStat = d.failStat || null;
      state.failReason = d.failReason || '';
      state.log = Array.isArray(d.log) ? d.log : [];
      if (d.currentCardId != null) {
        state.currentCard = CARDS.filter(function (c) { return c.id === d.currentCardId; })[0] || null;
      } else {
        state.currentCard = null;
      }
      return true;
    } catch (e) { return false; }
  }

  function clearSave() {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* 忽略 */ }
  }

  var busy = false;

  function makeChoice(side) {
    if (busy || state.ended || !state.currentCard) { return; }
    busy = true;

    var card = state.currentCard;
    var choice = side === 'left' ? card.left : card.right;
    var dir = side === 'left' ? -1 : 1;

    cardEl.style.transition = 'transform 0.26s ease, opacity 0.26s ease';
    cardEl.style.transform = 'translateX(' + (dir * 120) + '%) rotate(' + (dir * 20) + 'deg)';
    cardEl.style.opacity = '0';

    setTimeout(function () {
      STAT_KEYS.forEach(function (k) {
        var v = choice.effects[k];
        if (v) { state[k] += v; }
      });

      state.log.unshift({
        turn: state.turn,
        title: card.title,
        label: choice.label,
        side: side,
        delta: formatDelta(choice.effects)
      });
      if (state.log.length > LOG_LIMIT) { state.log.pop(); }

      var failStat = null;
      for (var i = 0; i < STAT_KEYS.length; i++) {
        var k = STAT_KEYS[i];
        if (state[k] <= 0 || state[k] > MAX_VALUE) { failStat = k; break; }
      }

      if (failStat) {
        state.ended = true;
        state.failStat = failStat;
        state.failReason = buildFailReason(failStat);
        save();
        render();
        cardEl.style.transition = 'none';
        cardEl.style.transform = '';
        cardEl.style.opacity = '1';
        busy = false;
        showFailModal();
        return;
      }

      state.turn += 1;
      drawCard();
      save();

      renderStats();
      renderTurn();
      renderLog();
      renderCard();

      cardEl.style.transition = 'none';
      cardEl.style.transform = 'translateX(' + (-dir * 120) + '%) rotate(' + (-dir * 20) + 'deg)';
      cardEl.style.opacity = '0';
      void cardEl.offsetWidth;
      cardEl.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      cardEl.style.transform = 'translateX(0) rotate(0deg)';
      cardEl.style.opacity = '1';
      busy = false;
    }, 260);
  }

  function showFailModal() {
    failTextEl.textContent = '失败原因：' + state.failReason;
    turnResultEl.textContent = '你共治理了 ' + state.turn + ' 个回合';
    overlayEl.classList.remove('hidden');
    overlayEl.setAttribute('aria-hidden', 'false');
  }

  function hideFailModal() {
    overlayEl.classList.add('hidden');
    overlayEl.setAttribute('aria-hidden', 'true');
  }

  function restart() {
    busy = false;
    clearSave();
    state = freshState();
    drawCard();
    save();
    cardEl.style.transition = 'none';
    cardEl.style.transform = '';
    cardEl.style.opacity = '1';
    hideFailModal();
    render();
  }

  var drag = null;

  function swipeThreshold() {
    return Math.min(90, window.innerWidth * 0.16);
  }

  function onDragStart(clientX, clientY) {
    if (busy || state.ended) { return; }
    drag = { startX: clientX, startY: clientY, x: clientX, y: clientY, horizontal: null };
    cardEl.classList.add('dragging');
  }

  function onDragMove(clientX, clientY) {
    if (!drag) { return; }
    var dx = clientX - drag.startX;
    var dy = clientY - drag.startY;
    if (drag.horizontal === null) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        drag.horizontal = Math.abs(dx) > Math.abs(dy);
      }
    }
    drag.x = clientX;
    drag.y = clientY;
    if (drag.horizontal === true) {
      var rot = dx / 18;
      cardEl.style.transform = 'translateX(' + dx + 'px) rotate(' + rot + 'deg)';
    } else {
      cardEl.style.transform = '';
    }
  }

  function onDragEnd() {
    if (!drag) { return; }
    var dx = drag.x - drag.startX;
    var horizontal = drag.horizontal;
    cardEl.classList.remove('dragging');
    drag = null;

    if (horizontal !== true) {
      cardEl.style.transform = '';
      return;
    }
    var th = swipeThreshold();
    if (dx <= -th) { makeChoice('left'); }
    else if (dx >= th) { makeChoice('right'); }
    else { cardEl.style.transform = ''; }
  }

  function bindSwipe() {
    cardEl.addEventListener('touchstart', function (e) {
      if (e.touches.length === 1) {
        onDragStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    cardEl.addEventListener('touchmove', function (e) {
      if (!drag) { return; }
      if (drag.horizontal === true && e.cancelable) { e.preventDefault(); }
      if (e.touches.length === 1) {
        onDragMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });

    cardEl.addEventListener('touchend', onDragEnd, { passive: true });
    cardEl.addEventListener('touchcancel', onDragEnd, { passive: true });

    cardEl.addEventListener('mousedown', function (e) {
      if (e.button === 0) { onDragStart(e.clientX, e.clientY); }
    });
    window.addEventListener('mousemove', function (e) {
      if (drag) { onDragMove(e.clientX, e.clientY); }
    });
    window.addEventListener('mouseup', onDragEnd);
  }

  function bindEvents() {
    leftBtn.addEventListener('click', function () { makeChoice('left'); });
    rightBtn.addEventListener('click', function () { makeChoice('right'); });
    restartBtn.addEventListener('click', restart);
    restartBtn2.addEventListener('click', restart);

    window.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { makeChoice('left'); }
      else if (e.key === 'ArrowRight') { makeChoice('right'); }
      else if (e.key === 'r' || e.key === 'R') { restart(); }
    });

    bindSwipe();
  }

  function init() {
    var loaded = load();
    if (!loaded) {
      state = freshState();
      drawCard();
      save();
    } else if (!state.currentCard && !state.ended) {
      drawCard();
      save();
    }
    render();
    if (state.ended) { showFailModal(); }
    bindEvents();
  }

  init();
})();
