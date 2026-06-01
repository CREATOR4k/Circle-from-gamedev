const canvas = document.getElementById('skillWheel');
const ctx = canvas.getContext('2d');
const W = canvas.width, H = canvas.height;
const cx = W / 2, cy = H / 2;

const SECTOR_COLORS = ["#ffe600","#ffae00","#d10d0d","#ff0080","#f700ff","#1900ff","#00ffbf","#3cff00"];

const options = [
  { label: "Вариант 1 — Воин", sectorNames: ["Сила","Броня","Ярость","Выносл.","Щит","Удар","Рывок","Крик"], descs: ["Физическая мощь и урон в ближнем бою.","Снижение получаемого урона и стойкость.","Накопление ярости для мощных атак.","Повышение очков здоровья и регенерации.","Блок и контратаки щитом.","Скорость и точность ударов.","Молниеносный рывок к врагу.","Боевой клич, оглушающий врагов."] },
  { label: "Вариант 2 — Маг", sectorNames: ["Огонь","Лёд","Молния","Тьма","Свет","Земля","Ветер","Время"], descs: ["Заклинания огня и горения.","Заморозка и замедление.","Электрические удары и цепная молния.","Некромантия и теневые атаки.","Исцеление и защитные ауры.","Землетрясения и каменная броня.","Скорость и ветровые вихри.","Остановка и замедление времени."] },
  { label: "Вариант 3 — Лучник", sectorNames: ["Прицел","Ловкость","Ловушки","Скрытн.","Зелья","Животн.","Ветер","Удача"], descs: ["Точность выстрелов и критические попадания.","Уклонение и скорость передвижения.","Установка ловушек на местности.","Скрытное передвижение и засады.","Изготовление и применение зелий.","Командование боевым питомцем.","Дальность выстрела и скорость стрел.","Шанс редкого лута и удача в бою."] },
];

let currentOption = 0;
let learnedSkills = new Set();
const maxPoints = 5;
let usedPoints = 0;
let hoveredEl = null;

const RING_RADII = [50, 150, 250, 350];

function buildSelector() {
  const sel = document.getElementById('selector');
  options.forEach((o, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = o.label;
    sel.appendChild(opt);
  });
}

function changeOption() {
  currentOption = parseInt(document.getElementById('selector').value);
  learnedSkills.clear();
  usedPoints = 0;
  updatePointsDisplay();
  drawWheel(hoveredEl);
  updateInfo(null);
}

function resetSkills() {
  learnedSkills.clear();
  usedPoints = 0;
  updatePointsDisplay();
  drawWheel(hoveredEl);
  updateInfo(hoveredEl);
}

function updatePointsDisplay() {
  document.getElementById('points-val').textContent = (maxPoints - usedPoints);
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return [r,g,b];
}

function darken(hex, amt) {
  let [r,g,b] = hexToRgb(hex);
  r = Math.max(0, r+amt); g = Math.max(0, g+amt); b = Math.max(0, b+amt);
  return `rgb(${r},${g},${b})`;
}

function getSectorAngles(s) {
  const a0 = s * (Math.PI/4) - Math.PI/2 - Math.PI/8;
  const a1 = a0 + Math.PI/4;
  return { a0, a1 };
}

function isHit(mouseX, mouseY, s, t) {
  const { a0, a1 } = getSectorAngles(s);
  const rMin = RING_RADII[t], rMax = RING_RADII[t+1];
  ctx.beginPath();
  ctx.arc(cx, cy, rMax, a0, a1);
  ctx.arc(cx, cy, rMin, a1, a0, true);
  ctx.closePath();
  return ctx.isPointInPath(mouseX, mouseY);
}

function isAvailable(s, t) {
  if (t === 0) return true;
  return learnedSkills.has(`${s}_${t-1}`);
}

function drawWheel(hov) {
  ctx.clearRect(0, 0, W, H);

  for (let s = 0; s < 8; s++) {
    const baseColor = SECTOR_COLORS[s];
    for (let t = 0; t < 3; t++) {
      const key = `${s}_${t}`;
      const learned = learnedSkills.has(key);
      const available = isAvailable(s, t);
      const isHovered = hov && hov.s === s && hov.t === t;
      const { a0, a1 } = getSectorAngles(s);
      const rMin = RING_RADII[t], rMax = RING_RADII[t+1];

      ctx.beginPath();
      ctx.arc(cx, cy, rMax, a0, a1);
      ctx.arc(cx, cy, rMin, a1, a0, true);
      ctx.closePath();

      if (isHovered) {
        ctx.fillStyle = '#ffffff';
      } else if (learned) {
        ctx.fillStyle = baseColor;
      } else if (available) {
        const [r,g,b] = hexToRgb(baseColor);
        ctx.fillStyle = `rgba(${r},${g},${b},0.28)`;
      } else {
        const [r,g,b] = hexToRgb(baseColor);
        ctx.fillStyle = `rgba(${r},${g},${b},0.10)`;
      }

      ctx.fill();
      ctx.strokeStyle = learned ? darken(baseColor, -30) : 'rgba(120,100,70,0.35)';
      ctx.lineWidth = isHovered ? 1.5 : 0.8;
      ctx.stroke();
    }
  }

  for (let rr of RING_RADII) {
    ctx.beginPath();
    ctx.arc(cx, cy, rr, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(100,80,40,0.3)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  for (let s = 0; s < 8; s++) {
    const { a0 } = getSectorAngles(s);
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a0)*RING_RADII[0], cy + Math.sin(a0)*RING_RADII[0]);
    ctx.lineTo(cx + Math.cos(a0)*RING_RADII[3], cy + Math.sin(a0)*RING_RADII[3]);
    ctx.strokeStyle = 'rgba(100,80,40,0.3)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  for (let s = 0; s < 8; s++) {
    for (let t = 0; t < 3; t++) {
      if (!learnedSkills.has(`${s}_${t}`)) continue;
      const { a0, a1 } = getSectorAngles(s);
      const midA = (a0+a1)/2;
      const rMid = (RING_RADII[t]+RING_RADII[t+1])/2;
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.font = 'bold 9px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✓', cx + Math.cos(midA)*rMid, cy + Math.sin(midA)*rMid);
    }
  }

  ctx.beginPath();
  ctx.arc(cx, cy, 52, 0, Math.PI*2);
  ctx.fillStyle = 'rgba(28,20,12,0.9)';
  ctx.fill();
  ctx.strokeStyle = '#c9a83c';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#c9a83c';
  ctx.font = '500 10px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('НАВЫКИ', cx, cy-7);
  ctx.fillText(`${maxPoints-usedPoints}/${maxPoints}`, cx, cy+8);
}

function updateInfo(el) {
  const title = document.getElementById('infoTitle');
  const type = document.getElementById('infoType');
  const desc = document.getElementById('infoDesc');

  if (!el) {
    title.textContent = 'Выберите навык';
    type.textContent = 'Наведите или нажмите на сектор';
    desc.textContent = 'Здесь будет отображено описание выбранного умения, а также требования для его получения.';
    return;
  }

  const opt = options[currentOption];
  const key = `${el.s}_${el.t}`;
  const learned = learnedSkills.has(key);
  const available = isAvailable(el.s, el.t);
  const tierNames = ['Основа (I уровень)', 'Главный навык (II уровень)', 'Супер-умение (III уровень)'];

  title.textContent = `${opt.sectorNames[el.s]} — ${tierNames[el.t]}`;
  type.textContent = learned ? '✓ Изучен' : available ? 'Доступен для изучения' : 'Заблокирован';
  desc.textContent = opt.descs[el.s]
    + (el.t > 0 ? ` Требует изучения уровня ${el.t} этого навыка.` : '')
    + (learned ? ' Нажмите, чтобы сбросить.' : available && (maxPoints-usedPoints)>0 ? ' Нажмите, чтобы изучить.' : !available ? ' Сначала изучите предыдущий уровень.' : ' Недостаточно очков.');
}

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left, my = e.clientY - rect.top;
  let found = null;
  for (let s = 0; s < 8 && !found; s++)
    for (let t = 0; t < 3 && !found; t++)
      if (isHit(mx, my, s, t)) found = {s, t};
  hoveredEl = found;
  canvas.style.cursor = found ? 'pointer' : 'default';
  drawWheel(found);
  updateInfo(found);
});

canvas.addEventListener('mouseleave', () => {
  hoveredEl = null;
  canvas.style.cursor = 'default';
  drawWheel(null);
  updateInfo(null);
});

canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left, my = e.clientY - rect.top;
  let found = null;
  for (let s = 0; s < 8 && !found; s++)
    for (let t = 0; t < 3 && !found; t++)
      if (isHit(mx, my, s, t)) found = {s, t};
  if (!found) return;

  const key = `${found.s}_${found.t}`;
  if (learnedSkills.has(key)) {
    const hasHigher = found.t < 2 && learnedSkills.has(`${found.s}_${found.t+1}`);
    if (!hasHigher) { learnedSkills.delete(key); usedPoints--; updatePointsDisplay(); }
  } else {
    if (!isAvailable(found.s, found.t)) return;
    if (usedPoints >= maxPoints) return;
    learnedSkills.add(key); usedPoints++; updatePointsDisplay();
  }
  drawWheel(found);
  updateInfo(found);
});

buildSelector();
drawWheel(null);