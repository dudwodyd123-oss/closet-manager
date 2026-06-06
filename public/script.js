if (!localStorage.getItem('closet_clothes')) {
  const now = Date.now();
  const dAgo = d => new Date(now - d * 86400000).toISOString();
  const sampleClothes = [
    { id: 1,  name: '흰 기본 티셔츠',    category: '상의',    tags: ['반팔','데일리','캐주얼','여름용'],        memo: '', image: null, wearCount: 12, lastWorn: dAgo(2),  createdAt: dAgo(60) },
    { id: 2,  name: '네이비 긴팔 티셔츠', category: '상의',    tags: ['긴팔','데일리','캐주얼','봄/가을용'],     memo: '', image: null, wearCount: 7,  lastWorn: dAgo(5),  createdAt: dAgo(90) },
    { id: 3,  name: '린넨 셔츠',          category: '상의',    tags: ['얇은','반팔','캐주얼','여름용'],          memo: '', image: null, wearCount: 4,  lastWorn: dAgo(10), createdAt: dAgo(30) },
    { id: 4,  name: '울 니트',            category: '상의',    tags: ['긴팔','두꺼운','겨울용'],                 memo: '', image: null, wearCount: 3,  lastWorn: dAgo(30), createdAt: dAgo(120) },
    { id: 5,  name: '청바지',             category: '하의',    tags: ['데일리','캐주얼'],                        memo: '', image: null, wearCount: 20, lastWorn: dAgo(1),  createdAt: dAgo(180) },
    { id: 6,  name: '베이지 슬랙스',      category: '하의',    tags: ['데일리','포멀','봄/가을용'],              memo: '', image: null, wearCount: 8,  lastWorn: dAgo(7),  createdAt: dAgo(50) },
    { id: 7,  name: '반바지',             category: '하의',    tags: ['반팔','캐주얼','여름용','얇은'],          memo: '', image: null, wearCount: 6,  lastWorn: dAgo(14), createdAt: dAgo(40) },
    { id: 8,  name: '후드 집업',          category: '겉옷',    tags: ['두꺼운','캐주얼','봄/가을용'],            memo: '', image: null, wearCount: 5,  lastWorn: dAgo(8),  createdAt: dAgo(100) },
    { id: 9,  name: '트렌치코트',         category: '겉옷',    tags: ['얇은','포멀','봄/가을용'],                memo: '', image: null, wearCount: 2,  lastWorn: dAgo(20), createdAt: dAgo(70) },
    { id: 10, name: '패딩',               category: '겉옷',    tags: ['두꺼운','겨울용'],                        memo: '', image: null, wearCount: 0,  lastWorn: null,     createdAt: dAgo(150) },
    { id: 11, name: '우비',               category: '겉옷',    tags: ['방수','얇은'],                            memo: '', image: null, wearCount: 1,  lastWorn: dAgo(45), createdAt: dAgo(200) },
    { id: 12, name: '흰 스니커즈',        category: '신발',    tags: ['데일리','캐주얼'],                        memo: '', image: null, wearCount: 18, lastWorn: dAgo(1),  createdAt: dAgo(365) },
    { id: 13, name: '로퍼',               category: '신발',    tags: ['포멀','데일리'],                          memo: '', image: null, wearCount: 6,  lastWorn: dAgo(9),  createdAt: dAgo(80) },
    { id: 14, name: '샌들',               category: '신발',    tags: ['여름용','캐주얼'],                        memo: '', image: null, wearCount: 0,  lastWorn: null,     createdAt: dAgo(20) },
    { id: 15, name: '볼캡',               category: '악세사리', tags: ['캐주얼','데일리','여름용'],               memo: '', image: null, wearCount: 9,  lastWorn: dAgo(3),  createdAt: dAgo(200) },
    { id: 16, name: '우산',               category: '악세사리', tags: ['방수','우산'],                           memo: '', image: null, wearCount: 3,  lastWorn: dAgo(15), createdAt: dAgo(300) },
  ];
  localStorage.setItem('closet_clothes', JSON.stringify(sampleClothes));
}

const API_KEY = '367209827091689d3216d2aa03b8d56e717205e6a7ee49cb27dea0b8391998a5';


// ─────────────────────────────────────────
//  주요 도시 nx/ny 좌표 테이블
// ─────────────────────────────────────────
const CITY_COORDS = {
  '서울': { nx: 60, ny: 127 },
  '부산': { nx: 98, ny: 76 },
  '대구': { nx: 89, ny: 90 },
  '인천': { nx: 55, ny: 124 },
  '광주': { nx: 58, ny: 74 },
  '대전': { nx: 67, ny: 100 },
  '울산': { nx: 102, ny: 84 },
  '세종': { nx: 66, ny: 103 },
  '수원': { nx: 60, ny: 121 },
  '춘천': { nx: 73, ny: 134 },
  '강릉': { nx: 92, ny: 131 },
  '청주': { nx: 69, ny: 107 },
  '전주': { nx: 63, ny: 89 },
  '여수': { nx: 73, ny: 66 },
  '창원': { nx: 90, ny: 77 },
  '제주': { nx: 52, ny: 38 },
  '경주': { nx: 97, ny: 87 },
  '포항': { nx: 102, ny: 94 },
  '천안': { nx: 63, ny: 110 },
  '안동': { nx: 91, ny: 106 },
  '순천': { nx: 72, ny: 70 },
  '목포': { nx: 50, ny: 67 },
};

// ─────────────────────────────────────────
//  LocalStorage 헬퍼
// ─────────────────────────────────────────
function loadClothes()  { return JSON.parse(localStorage.getItem('closet_clothes')  || '[]'); }
function saveClothes(d) { localStorage.setItem('closet_clothes', JSON.stringify(d)); }
function loadOutfits()  { return JSON.parse(localStorage.getItem('closet_outfits')  || '[]'); }
function saveOutfits(d) { localStorage.setItem('closet_outfits', JSON.stringify(d)); }
function loadFavs()     { return JSON.parse(localStorage.getItem('closet_favs')     || '[]'); }
function saveFavs(d)    { localStorage.setItem('closet_favs', JSON.stringify(d)); }

// ─────────────────────────────────────────
//  날씨 state
// ─────────────────────────────────────────
let weatherState = { temp: null, pty: 0, sky: 1, loaded: false };

// 슬롯별 인덱스
const slotIndex = { '악세사리': 0, '상의': 0, '겉옷': 0, '하의': 0, '신발': 0 };
let slotCandidates = { '악세사리': [], '상의': [], '겉옷': [], '하의': [], '신발': [] };

// 코디 저장 모드 ('outfit' | 'fav')
let pendingOutfitMode = null;

// ─────────────────────────────────────────
//  날짜/시각 헬퍼 (기상청 포맷)
// ─────────────────────────────────────────
function getBaseDateTime() {
  const now = new Date();
  const y   = now.getFullYear();
  const m   = String(now.getMonth() + 1).padStart(2, '0');
  const d   = String(now.getDate()).padStart(2, '0');
  const h   = now.getHours();
  const min = now.getMinutes();

  // 초단기실황: 매시각 10분 이후 호출 가능 (정시 단위)
  let baseH = h;
  if (min < 10) baseH = h - 1;
  if (baseH < 0) baseH = 23;

  const baseDate = `${y}${m}${d}`;
  const baseTime = String(baseH).padStart(2, '0') + '00';
  return { baseDate, baseTime };
}

function getUltraSrtFcstTime() {
  const now = new Date();
  const h   = now.getHours();
  const min = now.getMinutes();
  // 초단기예보: 매 30분 발표, 45분 이후 호출
  let baseH = h;
  let baseM = 30;
  if (min < 45) {
    // 이전 발표 시간
    if (min < 30) { baseH = h - 1; baseM = 30; }
    else           { baseM = 0; }
    if (baseH < 0) baseH = 23;
  }
  const now2 = new Date();
  const y = now2.getFullYear();
  const m = String(now2.getMonth() + 1).padStart(2, '0');
  const d = String(now2.getDate()).padStart(2, '0');
  const baseDate = `${y}${m}${d}`;
  const baseTime = String(baseH).padStart(2, '0') + String(baseM).padStart(2, '0');
  return { baseDate, baseTime };
}

// ─────────────────────────────────────────
//  날씨 API 호출
// ─────────────────────────────────────────
async function fetchWeather(cityName) {
  const coords = findCoords(cityName);
  if (!coords) {
    showWeatherError(`"${cityName}" 지역을 찾을 수 없습니다. 주요 도시명(예: 부산, 서울)으로 입력해 주세요.`);
    return;
  }
  const { nx, ny } = coords;

  showWeatherLoading();

  try {
    // 1) 초단기실황 → 기온(T1H), 강수형태(PTY)
    const { baseDate: d1, baseTime: t1 } = getBaseDateTime();
    const ncstUrl = `/weather?endpoint=getUltraSrtNcst&serviceKey=${API_KEY}&numOfRows=50&pageNo=1&dataType=JSON&base_date=${d1}&base_time=${t1}&nx=${nx}&ny=${ny}`;

    const r1 = await fetch(ncstUrl, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
    const j1 = await r1.json();

    let temp = null, pty = 0;
    const items1 = j1?.response?.body?.items?.item || [];
    items1.forEach(item => {
      if (item.category === 'T1H') temp = parseFloat(item.obsrValue);
      if (item.category === 'PTY') pty  = parseInt(item.obsrValue);
    });

    // 2) 초단기예보 → 하늘상태(SKY)
    const { baseDate: d2, baseTime: t2 } = getUltraSrtFcstTime();
    const fcstUrl = `/weather?endpoint=getUltraSrtFcst&serviceKey=${API_KEY}&numOfRows=60&pageNo=1&dataType=JSON&base_date=${d2}&base_time=${t2}&nx=${nx}&ny=${ny}`;
    const r2 = await fetch(fcstUrl, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
    const j2 = await r2.json();

    let sky = 1;
    const items2 = j2?.response?.body?.items?.item || [];
    // 첫 번째 시간대 SKY값
    const skyItem = items2.find(i => i.category === 'SKY');
    if (skyItem) sky = parseInt(skyItem.fcstValue);

    weatherState = { temp, pty, sky, loaded: true };
    renderWeather(cityName);
    buildRecommendation();

  } catch (err) {
    console.error(err);
    showWeatherError('날씨 정보를 불러오지 못했습니다. API 키와 CORS 프록시를 확인해 주세요.');
  }
}

function findCoords(name) {
  // 정확히 일치
  if (CITY_COORDS[name]) return CITY_COORDS[name];
  // 부분 일치
  const key = Object.keys(CITY_COORDS).find(k => name.includes(k) || k.includes(name));
  return key ? CITY_COORDS[key] : null;
}

function showWeatherLoading() {
  document.getElementById('weatherDisplay').classList.add('hidden');
  document.getElementById('weatherError').classList.add('hidden');
  document.getElementById('weatherTip').textContent = '날씨 정보를 불러오는 중...';
}

function showWeatherError(msg) {
  const el = document.getElementById('weatherError');
  el.textContent = msg;
  el.classList.remove('hidden');
  document.getElementById('weatherDisplay').classList.add('hidden');
  document.getElementById('weatherTip').textContent = '';
}

function getSkyIcon(sky, pty) {
  if (pty === 1 || pty === 4) return '🌧️';
  if (pty === 2) return '🌨️';
  if (pty === 3) return '❄️';
  if (pty === 5 || pty === 6) return '🌦️';
  if (sky === 1) return '☀️';
  if (sky === 3) return '⛅';
  return '☁️';
}
function getSkyDesc(sky, pty) {
  if (pty === 1 || pty === 4) return '비';
  if (pty === 2) return '비/눈';
  if (pty === 3) return '눈';
  if (pty === 5 || pty === 6) return '빗방울';
  if (sky === 1) return '맑음';
  if (sky === 3) return '구름많음';
  return '흐림';
}

function renderWeather(city) {
  const { temp, pty, sky } = weatherState;
  document.getElementById('weatherIcon').textContent = getSkyIcon(sky, pty);
  document.getElementById('weatherTemp').textContent = temp !== null ? `${temp}°C` : '--°C';
  document.getElementById('weatherDesc').textContent = getSkyDesc(sky, pty);
  document.getElementById('weatherDisplay').classList.remove('hidden');
  document.getElementById('weatherError').classList.add('hidden');
  document.getElementById('weatherTip').textContent = `${city} 현재 날씨 기준으로 오늘의 코디를 추천해 드려요 ✨`;
}

// ─────────────────────────────────────────
//  추천 로직
// ─────────────────────────────────────────
function getRecommendTags(temp, pty, sky) {
  const tags = [];
  if (temp === null) return tags;

  if (temp >= 28) {
    tags.push('반팔', '얇은', '여름용');
  } else if (temp >= 23) {
    tags.push('얇은', '데일리', '캐주얼', '반팔');
  } else if (temp >= 18) {
    tags.push('데일리', '캐주얼', '봄/가을용', '얇은');
  } else if (temp >= 12) {
    tags.push('긴팔', '봄/가을용', '두꺼운', '캐주얼');
  } else {
    tags.push('긴팔', '두꺼운', '겨울용');
  }

  if (pty >= 1) tags.push('방수', '겉옷');

  return tags;
}

function scoreClothe(cloth, recTags) {
  return cloth.tags.filter(t => recTags.includes(t)).length;
}

function buildRecommendation() {
  const clothes = loadClothes();
  const { temp, pty, sky } = weatherState;
  const recTags = getRecommendTags(temp, pty, sky);

  const CATS = ['악세사리', '상의', '겉옷', '하의', '신발'];

  CATS.forEach(cat => {
    const pool = clothes.filter(c => c.category === cat);
    const scored = pool
      .map(c => ({ ...c, score: scoreClothe(c, recTags) }))
      .filter(c => c.score > 0);          // ← 태그 매칭된 옷만
    scored.sort((a, b) => b.score - a.score);
    slotCandidates[cat] = scored;
    slotIndex[cat] = 0;
    renderSlot(cat);
  });

  // 추천 태그 행 업데이트
  const tagRow = document.getElementById('recTagRow');
  if (recTags.length > 0) {
    tagRow.classList.remove('hidden');
    tagRow.innerHTML = '<span class="rec-tag-label">📌 추천 키워드:</span>' +
      recTags.map(t => `<span class="cloth-tag">${t}</span>`).join('') +
      (temp !== null ? `<span style="margin-left:.5rem;color:var(--mint-dark);font-weight:500">${temp}°C · ${getSkyDesc(sky, pty)}</span>` : '');
  }

  // 설명 문구 업데이트
  document.getElementById('comboDesc').textContent = '< > 버튼으로 각 카테고리 아이템을 바꿔가며 나만의 코디를 완성해보세요!';
}

function renderSlot(cat) {
  const list = slotCandidates[cat];
  const idx  = slotIndex[cat];
  const img  = document.getElementById(`slot-${cat}`);
  const empty = document.getElementById(`empty-${cat}`);
  const counter = document.getElementById(`counter-${cat}`);
  const nameEl = document.getElementById(`name-${cat}`);

  if (!list || list.length === 0) {
    img.style.display = 'none';
    empty.style.display = 'flex';
    empty.textContent = weatherState.loaded ? '해당 없음' : '날씨 조회 후\n표시됩니다';
    counter.textContent = '0/0';
    if (nameEl) nameEl.textContent = '';
    return;
  }
  const item = list[idx];
  if (item.image) {
    img.src = item.image;
    img.alt = item.name;
    img.style.display = 'block';
    empty.style.display = 'none';
  } else {
    img.style.display = 'none';
    empty.style.display = 'flex';
    empty.textContent = catEmoji(cat);
  }
  if (nameEl) nameEl.textContent = item.name;
  counter.textContent = `${idx + 1}/${list.length}`;
}

// renderRecommendSummary 제거됨 — 통합 코디 조합판으로 대체

function catEmoji(cat) {
  const map = { '상의':'👔','하의':'👖','겉옷':'🧥','원피스':'👗','신발':'👟','악세사리':'🎩' };
  return map[cat] || '👕';
}

// ─────────────────────────────────────────
//  슬롯 네비게이션
// ─────────────────────────────────────────
document.querySelectorAll('.slot-nav').forEach(btn => {
  btn.addEventListener('click', () => {
    const cat  = btn.dataset.cat;
    const list = slotCandidates[cat];
    if (!list || list.length === 0) return;
    const dir = btn.classList.contains('prev') ? -1 : 1;
    slotIndex[cat] = (slotIndex[cat] + dir + list.length) % list.length;
    renderSlot(cat);
  });
});

// ─────────────────────────────────────────
//  오늘의 코디 선택 / 즐겨찾기
// ─────────────────────────────────────────
document.getElementById('btnSelectOutfit').addEventListener('click', () => {
  pendingOutfitMode = 'outfit';
  openNameModal('오늘의 코디 이름을 입력하세요');
});

document.getElementById('btnFavorite').addEventListener('click', () => {
  pendingOutfitMode = 'fav';
  openNameModal('즐겨찾기 코디 이름을 입력하세요');
});

function openNameModal(title) {
  document.getElementById('nameModalTitle').textContent = title;
  document.getElementById('outfitNameInput').value = '';
  document.getElementById('nameModal').classList.remove('hidden');
}
document.getElementById('closeNameModal').addEventListener('click', () => {
  document.getElementById('nameModal').classList.add('hidden');
});

document.getElementById('confirmOutfitName').addEventListener('click', () => {
  const name = document.getElementById('outfitNameInput').value.trim();
  if (!name) { alert('코디 이름을 입력해 주세요.'); return; }
  saveCurrentOutfit(name, pendingOutfitMode);
  document.getElementById('nameModal').classList.add('hidden');
});

function saveCurrentOutfit(name, mode) {
  const CATS = ['악세사리', '상의', '겉옷', '하의', '신발'];
  const items = [];
  let wearIds = [];

  CATS.forEach(cat => {
    const list = slotCandidates[cat];
    if (list && list.length > 0) {
      const item = list[slotIndex[cat]];
      items.push({ category: cat, id: item.id, name: item.name, image: item.image || null });
      wearIds.push(item.id);
    }
  });

  if (items.length === 0) { alert('추천된 옷이 없어요. 먼저 날씨를 조회하고 옷을 추가해 주세요!'); return; }

  const outfit = {
    id: Date.now(),
    name,
    items,
    date: new Date().toLocaleDateString('ko-KR'),
    weather: weatherState.loaded ? `${weatherState.temp}°C · ${getSkyDesc(weatherState.sky, weatherState.pty)}` : '',
  };

  if (mode === 'outfit') {
    // 착용 횟수 증가
    const clothes = loadClothes();
    wearIds.forEach(id => {
      const c = clothes.find(x => x.id === id);
      if (c) { c.wearCount = (c.wearCount || 0) + 1; c.lastWorn = new Date().toISOString(); }
    });
    saveClothes(clothes);

    const outfits = loadOutfits();
    outfits.unshift(outfit);
    saveOutfits(outfits);
    alert(`"${name}" 코디가 저장되었어요! 착용 횟수도 업데이트 했어요 ✅`);
    renderCloset();
    renderOutfits();
  } else {
    const favs = loadFavs();
    favs.unshift(outfit);
    saveFavs(favs);
    alert(`"${name}" 코디를 즐겨찾기에 추가했어요 ⭐`);
    renderFavorites();
  }
}

// ─────────────────────────────────────────
//  업로드 모달
// ─────────────────────────────────────────
let uploadedImageData = null;
let selectedTags = new Set();

document.getElementById('openUpload').addEventListener('click', openUploadModal);
document.getElementById('closeUpload').addEventListener('click', () => {
  document.getElementById('uploadModal').classList.add('hidden');
});
document.getElementById('uploadModal').addEventListener('click', e => {
  if (e.target === document.getElementById('uploadModal'))
    document.getElementById('uploadModal').classList.add('hidden');
});

function openUploadModal() {
  uploadedImageData = null;
  selectedTags = new Set();
  document.getElementById('clothName').value = '';
  document.getElementById('clothCat').value = '';
  document.getElementById('clothMemo').value = '';
  document.getElementById('customTag').value = '';
  document.getElementById('previewBox').innerHTML = '<span class="preview-hint">📷 사진 클릭하여 업로드</span>';
  document.querySelectorAll('.tag-opt').forEach(b => b.classList.remove('selected'));
  document.getElementById('uploadModal').classList.remove('hidden');
}

// Image preview
document.getElementById('imgInput').addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    uploadedImageData = e.target.result;
    document.getElementById('previewBox').innerHTML = `<img src="${uploadedImageData}" alt="미리보기"/>`;
  };
  reader.readAsDataURL(file);
});

// Tag buttons
document.querySelectorAll('.tag-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    const tag = btn.dataset.tag;
    if (selectedTags.has(tag)) { selectedTags.delete(tag); btn.classList.remove('selected'); }
    else { selectedTags.add(tag); btn.classList.add('selected'); }
  });
});

// Custom tag
document.getElementById('customTag').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const v = e.target.value.trim();
    if (v) { selectedTags.add(v); e.target.value = ''; }
  }
});

// Save cloth
document.getElementById('saveCloth').addEventListener('click', () => {
  const name = document.getElementById('clothName').value.trim();
  const cat  = document.getElementById('clothCat').value;
  const memo = document.getElementById('clothMemo').value.trim();

  if (!name) { alert('옷 이름을 입력해 주세요.'); return; }
  if (!cat)  { alert('종류를 선택해 주세요.'); return; }

  const cloth = {
    id: Date.now(),
    name,
    category: cat,
    tags: [...selectedTags],
    memo,
    image: uploadedImageData || null,
    wearCount: 0,
    lastWorn: null,
    createdAt: new Date().toISOString(),
  };

  const clothes = loadClothes();
  clothes.push(cloth);
  saveClothes(clothes);

  document.getElementById('uploadModal').classList.add('hidden');
  renderCloset();
  renderTagFilter();
  updateStatsRow();

  // 날씨가 로드되어 있으면 추천 갱신
  if (weatherState.loaded) buildRecommendation();
});

// ─────────────────────────────────────────
//  옷장 탭 렌더링
// ─────────────────────────────────────────
let activeFilterCat = '';
let activeFilterTag = '';

function renderTagFilter() {
  const clothes = loadClothes();
  const allTags = new Set();
  clothes.forEach(c => c.tags.forEach(t => allTags.add(t)));

  const el = document.getElementById('tagFilter');
  el.innerHTML = '<button class="chip active" data-tag="">전체</button>';
  allTags.forEach(tag => {
    el.innerHTML += `<button class="chip" data-tag="${tag}">${tag}</button>`;
  });

  el.querySelectorAll('.chip').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('.chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilterTag = btn.dataset.tag;
      renderCloset();
    });
  });
}

function renderCloset() {
  const clothes = loadClothes();
  const grid = document.getElementById('clothesGrid');

  const filtered = clothes.filter(c => {
    if (activeFilterCat && c.category !== activeFilterCat) return false;
    if (activeFilterTag && !c.tags.includes(activeFilterTag)) return false;
    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty-state">해당 조건의 옷이 없어요. 필터를 바꾸거나 옷을 추가해 보세요 👗</div>';
    return;
  }

  grid.innerHTML = filtered.map(c => `
    <div class="cloth-card" data-id="${c.id}">
      <div class="cloth-img">
        ${c.image ? `<img src="${c.image}" alt="${c.name}"/>` : catEmoji(c.category)}
      </div>
      <div class="cloth-info">
        <div class="cloth-name">${c.name}</div>
        <div class="cloth-cat">${c.category}</div>
        <div class="cloth-tags">${c.tags.map(t=>`<span class="cloth-tag">${t}</span>`).join('')}</div>
        <div class="cloth-wear">👕 ${c.wearCount || 0}회 착용${c.lastWorn ? ' · 최근 ' + timeAgo(c.lastWorn) : ''}</div>
      </div>
      <button class="cloth-del" data-id="${c.id}" title="삭제">✕</button>
    </div>
  `).join('');

  grid.querySelectorAll('.cloth-del').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      if (confirm('이 옷을 삭제할까요?')) {
        const id = parseInt(btn.dataset.id);
        const cl = loadClothes().filter(c => c.id !== id);
        saveClothes(cl);
        renderCloset();
        renderTagFilter();
        updateStatsRow();
        if (weatherState.loaded) buildRecommendation();
      }
    });
  });

  renderWearSummary();
}

function updateStatsRow() {
  const clothes = loadClothes();
  document.getElementById('statsRow').innerHTML = `
    <span class="stat-badge">총 ${clothes.length}벌</span>
    <span class="stat-badge">상의 ${clothes.filter(c=>c.category==='상의').length}</span>
    <span class="stat-badge">하의 ${clothes.filter(c=>c.category==='하의').length}</span>
    <span class="stat-badge">겉옷 ${clothes.filter(c=>c.category==='겉옷').length}</span>
  `;
}

function renderWearSummary() {
  const allClothes = loadClothes();
  if (allClothes.length === 0) { document.getElementById('wearSummary').innerHTML = ''; return; }

  // 현재 활성 필터 기준으로 대상 옷 추리기
  const pool = allClothes.filter(c => {
    if (activeFilterCat && c.category !== activeFilterCat) return false;
    if (activeFilterTag && !c.tags.includes(activeFilterTag)) return false;
    return true;
  });

  // 필터 레이블 표시 (무엇 기준인지)
  const filterLabel = activeFilterCat
    ? `'${activeFilterCat}' 중`
    : activeFilterTag
      ? `'${activeFilterTag}' 태그 중`
      : '전체 옷 중';

  if (pool.length === 0) {
    document.getElementById('wearSummary').innerHTML =
      `<div class="wear-card" style="grid-column:1/-1"><p style="color:var(--text-light)">해당 조건의 옷이 없어요.</p></div>`;
    return;
  }

  const sorted = [...pool].sort((a, b) => (b.wearCount||0) - (a.wearCount||0));
  const top    = sorted[0];
  const unworn = pool.filter(c => (c.wearCount||0) === 0);
  const oldest = pool.filter(c => c.lastWorn)
    .sort((a, b) => new Date(a.lastWorn) - new Date(b.lastWorn))[0];

  document.getElementById('wearSummary').innerHTML = `
    <div class="wear-card">
      <h4>🏆 가장 많이 입은 옷 <span class="wear-filter-badge">${filterLabel}</span></h4>
      <p>${top && top.wearCount > 0 ? `${top.name} <em>(${top.wearCount}회)</em>` : '아직 없어요'}</p>
    </div>
    <div class="wear-card">
      <h4>🆕 아직 안 입은 옷 <span class="wear-filter-badge">${filterLabel}</span></h4>
      <p>${unworn.length > 0
        ? unworn.map(c => c.name).slice(0, 3).join(', ') + (unworn.length > 3 ? ` 외 ${unworn.length - 3}개` : '')
        : '없음'}</p>
    </div>
    <div class="wear-card">
      <h4>🕰️ 오래 안 입은 옷 <span class="wear-filter-badge">${filterLabel}</span></h4>
      <p>${oldest ? `${oldest.name} <em>(${timeAgo(oldest.lastWorn)} 전)</em>` : '—'}</p>
    </div>
  `;
}

function timeAgo(iso) {
  const d = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (d === 0) return '오늘';
  if (d < 7) return `${d}일`;
  if (d < 30) return `${Math.floor(d/7)}주`;
  return `${Math.floor(d/30)}개월`;
}

// ─────────────────────────────────────────
//  저장한 코디 / 즐겨찾기 렌더링
// ─────────────────────────────────────────
function renderOutfitList(containerEl, data, storeFn) {
  if (!data || data.length === 0) {
    containerEl.innerHTML = '<div class="empty-state">아직 없어요. 대시보드에서 코디를 선택해 보세요!</div>';
    return;
  }
  containerEl.innerHTML = data.map(outfit => `
    <div class="outfit-card" data-id="${outfit.id}">
      <div class="outfit-card-title">
        <span>${outfit.name}</span>
        <span class="outfit-card-date">${outfit.date}${outfit.weather ? ' · ' + outfit.weather : ''}</span>
      </div>
      <div class="outfit-thumbs">
        ${outfit.items.map(item => item.image
          ? `<div class="outfit-thumb"><img src="${item.image}" alt="${item.name}"/></div>`
          : `<div class="outfit-thumb" title="${item.name}">${catEmoji(item.category)}</div>`
        ).join('')}
      </div>
      <div style="font-size:.78rem;color:var(--text-light);margin-bottom:.5rem">
        ${outfit.items.map(i=>`${catEmoji(i.category)} ${i.name}`).join(' · ')}
      </div>
      <div class="outfit-card-actions">
        <button class="btn-sm btn-del-outfit" data-id="${outfit.id}">🗑️ 삭제</button>
      </div>
    </div>
  `).join('');

  containerEl.querySelectorAll('.btn-del-outfit').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const updated = data.filter(o => o.id !== id);
      storeFn(updated);
      renderOutfits();
      renderFavorites();
    });
  });
}

function renderOutfits() {
  renderOutfitList(document.getElementById('outfitsList'), loadOutfits(), saveOutfits);
}

function renderFavorites() {
  renderOutfitList(document.getElementById('favoritesList'), loadFavs(), saveFavs);
}

// ─────────────────────────────────────────
//  Tab 네비게이션
// ─────────────────────────────────────────
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');

    if (btn.dataset.tab === 'closet') {
      renderCloset();
      renderWearSummary();
      updateStatsRow();
    }
    if (btn.dataset.tab === 'outfits') renderOutfits();
    if (btn.dataset.tab === 'favorites') renderFavorites();
  });
});

// Category filter (closet)
document.getElementById('catFilter').querySelectorAll('.chip').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('catFilter').querySelectorAll('.chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilterCat = btn.dataset.cat;
    renderCloset();
  });
});

// Weather fetch
document.getElementById('fetchWeather').addEventListener('click', () => {
  const city = document.getElementById('locationInput').value.trim();
  if (!city) { alert('지역 이름을 입력해 주세요.'); return; }
  fetchWeather(city);
});
document.getElementById('locationInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('fetchWeather').click();
});

// ─────────────────────────────────────────
//  초기화
// ─────────────────────────────────────────
renderTagFilter();
updateStatsRow();

// 슬롯은 날씨 조회 후에만 채워짐
const CATS = ['악세사리', '상의', '겉옷', '하의', '신발'];
CATS.forEach(cat => {
  renderSlot(cat);
});