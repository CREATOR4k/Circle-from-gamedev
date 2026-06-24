// Heroes of Might and Magic 5 Style Skill Wheel Implementation
// Complete rewrite with proper skill dependencies, icons, and visual connections

// Import skill data
const canvas = document.getElementById('skillWheel');
const ctx = canvas.getContext('2d');
const W = canvas.width, H = canvas.height;
const cx = W / 2, cy = H / 2;

// Load skill data
let skillData = {};
let currentClass = 'warrior';
let learnedSkills = new Set();
let usedPoints = 0;
let maxPoints = 15;
let hoveredSkill = null;
let skillIcons = new Image();
skillIcons.src = 'img/skills.png';

// Skill state constants
const SKILL_STATES = {
  LOCKED: 'locked',
  AVAILABLE: 'available',
  LEARNED: 'learned'
};

// Initialize the skill wheel
function initSkillWheel() {
  // Load skill data directly
  skillData = HOMM5_SKILL_DATA;
  buildClassSelector();
  resetSkills();
  drawWheel();
}

// Build class selector dropdown
function buildClassSelector() {
  const selector = document.getElementById('selector');
  selector.innerHTML = '';

  Object.keys(skillData).forEach(classId => {
    const option = document.createElement('option');
    option.value = classId;
    option.textContent = skillData[classId].name;
    selector.appendChild(option);
  });

  selector.addEventListener('change', () => {
    currentClass = selector.value;
    resetSkills();
    drawWheel();
  });
}

// Reset skills to initial state
function resetSkills() {
  learnedSkills.clear();
  usedPoints = 0;
  updatePointsDisplay();
  hoveredSkill = null;
}

// Update skill points display
function updatePointsDisplay() {
  document.getElementById('points-val').textContent = maxPoints - usedPoints;
}

// Check if a skill is available based on prerequisites
function isSkillAvailable(skill) {
  if (learnedSkills.has(skill.id)) return true;

  // Check if all prerequisites are learned
  return skill.prerequisites.every(prereqId =>
    learnedSkills.has(prereqId)
  );
}

// Get skill state
function getSkillState(skill) {
  if (learnedSkills.has(skill.id)) return SKILL_STATES.LEARNED;
  if (isSkillAvailable(skill)) return SKILL_STATES.AVAILABLE;
  return SKILL_STATES.LOCKED;
}

// Draw the entire skill wheel
function drawWheel() {
  ctx.clearRect(0, 0, W, H);

  const classData = skillData[currentClass];

  // Draw concentric rings (HOMM5 style)
  drawConcentricRings(classData);

  // Draw connections first (so they appear behind skills)
  drawConnections(classData);

  // Draw skills
  classData.skills.forEach(skill => {
    drawSkill(skill, classData);
  });

  // Draw center
  drawCenter(classData);

  // Draw sector separators
  drawSectorSeparators(classData);
}

// Draw concentric rings around the wheel (HOMM5 lobby style)
function drawConcentricRings(classData) {
  // Calculate ring radii to be tangent to skill circles
  // Skill radii: 130, 200, 300, 400
  // Ring radii should be skill_radius + skill_circle_radius (30)
  const ringRadii = [150, 250, 350, 450]; // Radii for each tier ring

  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(200, 180, 140, 0.15)';

  ringRadii.forEach((radius, index) => {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);

    // Alternate ring styles
    if (index % 2 === 0) {
    }

    ctx.stroke();
  });

  // Reset line dash
  ctx.setLineDash([]);
}

// Draw connections between skills
function drawConnections(classData) {
  classData.connections.forEach(conn => {
    const fromSkill = classData.skills.find(s => s.id === conn.from);
    const toSkill = classData.skills.find(s => s.id === conn.to);

    if (!fromSkill || !toSkill) return;

    const fromPos = getSkillPosition(fromSkill);
    const toPos = getSkillPosition(toSkill);

    ctx.beginPath();
    ctx.moveTo(fromPos.x, fromPos.y);

    if (conn.style === 'curved') {
      // Create curved connection
      const controlX = (fromPos.x + toPos.x) / 2;
      const controlY = (fromPos.y + toPos.y) / 2;
      const offsetX = (toPos.y - fromPos.y) * 0.2;
      const offsetY = (fromPos.x - toPos.x) * 0.2;

      ctx.quadraticCurveTo(
        controlX + offsetX,
        controlY + offsetY,
        toPos.x, toPos.y
      );
    } else {
      // Straight connection
      ctx.lineTo(toPos.x, toPos.y);
    }

    // Style based on skill states
    const fromLearned = learnedSkills.has(fromSkill.id);
    const toAvailable = isSkillAvailable(toSkill);

    if (fromLearned && toAvailable) {
      ctx.strokeStyle = '#4CAF50'; // Green for available path
      ctx.lineWidth = 2;
    } else if (fromLearned) {
      ctx.strokeStyle = '#FFC107'; // Yellow for potential path
      ctx.lineWidth = 1.5;
    } else {
      ctx.strokeStyle = '#607D8B'; // Gray for locked path
      ctx.lineWidth = 1;
    }

    ctx.stroke();
  });
}

// Draw individual skill
function drawSkill(skill, classData) {
  const pos = getSkillPosition(skill);
  const radius = 30;
  const state = getSkillState(skill);
  const isHovered = hoveredSkill && hoveredSkill.id === skill.id;

  // Draw outer ring (HOMM5 style)
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, radius + 8, 0, Math.PI * 2);
  ctx.lineWidth = 4;

  // Outer ring color based on state
  if (state === SKILL_STATES.LEARNED) {
    ctx.strokeStyle = '#FFD700'; // Gold for learned
  } else if (state === SKILL_STATES.AVAILABLE) {
    ctx.strokeStyle = '#4CAF50'; // Green for available
  } else {
    ctx.strokeStyle = '#555555'; // Gray for locked
  }
  ctx.stroke();

  // Draw skill circle
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);

  // Color based on state
  if (isHovered) {
    ctx.fillStyle = '#FFFFFF';
  } else {
    switch (state) {
      case SKILL_STATES.LEARNED:
        ctx.fillStyle = classData.sectorColors[skill.sector];
        break;
      case SKILL_STATES.AVAILABLE:
        ctx.fillStyle = classData.sectorColors[skill.sector];
        break;
      case SKILL_STATES.LOCKED:
        ctx.fillStyle = '#222222';
        break;
    }
  }

  ctx.fill();

  // Inner border
  ctx.lineWidth = 2;
  ctx.strokeStyle = state === SKILL_STATES.LEARNED ? '#FFFFFF' : '#333333';
  ctx.stroke();

  // Draw icon
  if (skillIcons.complete) {
    drawSkillIcon(skill, pos.x, pos.y, radius, state);
  }

  // Draw checkmark for learned skills
  if (state === SKILL_STATES.LEARNED) {
    ctx.fillStyle = 'white';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✓', pos.x + 12, pos.y - 12);
  }

  // Highlight effect for hovered skills
  if (isHovered) {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius + 12, 0, Math.PI * 2);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}

// Draw skill icon from sprite sheet
function drawSkillIcon(skill, x, y, radius, state) {
  const iconSize = 48;
  const iconX = skill.icon.x;
  const iconY = skill.icon.y;

  // Save current context state
  ctx.save();

  // Clip to circle
  ctx.beginPath();
  ctx.arc(x, y, radius - 4, 0, Math.PI * 2);
  ctx.clip();

  // Draw icon with proper opacity based on state
  if (state === SKILL_STATES.LOCKED) {
    ctx.globalAlpha = 0.3;
  } else {
    ctx.globalAlpha = 1.0;
  }

  // Draw the icon from sprite sheet
  ctx.drawImage(
    skillIcons,
    iconX, iconY, iconSize, iconSize,
    x - (iconSize / 2), y - (iconSize / 2), iconSize, iconSize
  );

  // Restore context state
  ctx.restore();
}

// Get skill position in canvas coordinates
function getSkillPosition(skill) {
  const angleRad = skill.position.angle * (Math.PI / 180);
  return {
    x: cx + Math.cos(angleRad) * skill.position.radius,
    y: cy + Math.sin(angleRad) * skill.position.radius
  };
}

// Draw center of the wheel
function drawCenter(classData) {
  const radius = 40;

  // Draw center circle
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = '#1a1410';
  ctx.fill();

  // Draw border
  ctx.strokeStyle = '#c9a83c';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw center text
  ctx.fillStyle = '#c9a83c';
  ctx.font = '500 10px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(classData.name.toUpperCase(), cx, cy - 7);
  ctx.fillText(`${usedPoints}/${maxPoints}`, cx, cy + 8);
}

// Draw sector separators (HOMM5 lobby style)
function drawSectorSeparators(classData) {
  const totalSectors = 8; 
  const maxRadius = 450; 

  // Тонкие разделительные линии
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1;

  // Массив углов границ секторов (всего 8 секторов = 8 границ)
  const sectorAngles = getSectorAngles();

  for (let i = 0; i < totalSectors; i++) {
    const angle = sectorAngles[i];

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * maxRadius, cy + Math.sin(angle) * maxRadius);
    ctx.stroke();
  }

  // Передаем массив углов дальше
  drawSectorBackgrounds(classData, sectorAngles);
}

function drawSectorBackgrounds(classData, sectorAngles) {
  const totalSectors = 8;
  const innerRadius = 50; 
  const outerRadius = 480; 

  for (let i = 0; i < totalSectors; i++) {
    // Начальный и конечный угол текущего сектора
    const startAngle = sectorAngles[i];
    const endAngle = sectorAngles[(i + 1) % totalSectors];

    // Отрисовка цветного фона сектора
    ctx.beginPath();
    ctx.arc(cx, cy, innerRadius, startAngle, endAngle, false);
    ctx.lineTo(cx + Math.cos(endAngle) * outerRadius, cy + Math.sin(endAngle) * outerRadius);
    ctx.arc(cx, cy, outerRadius, endAngle, startAngle, true);
    ctx.lineTo(cx + Math.cos(startAngle) * innerRadius, cy + Math.sin(startAngle) * innerRadius);
    ctx.closePath();

    // Получаем цвет
    const colorHex = classData.sectorColors[i] || '#ffffff';
    ctx.fillStyle = `rgba(${hexToRgb(colorHex).join(',')}, 0.15)`;
    ctx.fill();

    // Отрисовка левой границы сектора
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(startAngle) * innerRadius, cy + Math.sin(startAngle) * innerRadius);
    ctx.lineTo(cx + Math.cos(startAngle) * outerRadius, cy + Math.sin(startAngle) * outerRadius);
    ctx.strokeStyle = `rgba(${hexToRgb(colorHex).join(',')}, 0.3)`;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Отрисовка правой границы сектора
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(endAngle) * innerRadius, cy + Math.sin(endAngle) * innerRadius);
    ctx.lineTo(cx + Math.cos(endAngle) * outerRadius, cy + Math.sin(endAngle) * outerRadius);
    ctx.strokeStyle = `rgba(${hexToRgb(colorHex).join(',')}, 0.3)`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

// Вспомогательная функция для расчета кастомной сетки углов
function getSectorAngles() {
  const toRad = Math.PI / 180;
  const topCenter = -Math.PI / 2; // Вертикально вверх (-90 градусов)

  const startFirst = topCenter - (22.5 * toRad); 
  const endFirst = topCenter + (22.5 * toRad);
  
  const step = 45 * toRad;
  
  // Генерируем последовательные углы для всех 8 секторов
  return [
    startFirst,                 // Старт 1-го сектора
    endFirst,                   // Конец 1-го / Старт 2-го
    endFirst + step,            // Старт 3-го
    endFirst + (2 * step),      // Старт 4-го
    endFirst + (3 * step),      // Старт 5-го
    endFirst + (4 * step),      // Старт 6-го
    endFirst + (5 * step),      // Старт 7-го
    endFirst + (6 * step)       // Старт 8-го
  ];
}


// Helper function to convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [100, 100, 100];
}

// Find skill at mouse position
function findSkillAtPosition(mouseX, mouseY) {
  const classData = skillData[currentClass];

  // Check each skill's hit area (from center outward for proper z-order)
  for (let tier = classData.maxTiers - 1; tier >= 0; tier--) {
    for (let skill of classData.skills) {
      if (skill.position.radius !== (tier + 1) * 100) continue;

      const pos = getSkillPosition(skill);
      const distance = Math.sqrt(
        Math.pow(mouseX - pos.x, 2) +
        Math.pow(mouseY - pos.y, 2)
      );

      if (distance < 30) { // 30px hit radius
        return skill;
      }
    }
  }

  return null;
}

// Update info panel with skill details
function updateInfoPanel(skill) {
  const title = document.getElementById('infoTitle');
  const type = document.getElementById('infoType');
  const desc = document.getElementById('infoDesc');

  if (!skill) {
    title.textContent = 'Выберите навык';
    type.textContent = 'Наведите на навык для подробностей';
    desc.textContent = 'Изучайте навыки, чтобы открывать новые возможности.';
    return;
  }

  const state = getSkillState(skill);
  const classData = skillData[currentClass];
  const tierNames = ['Базовый', 'Продвинутый', 'Эксперт', 'Особое умение'];

  // Set title with skill name and tier
  title.textContent = `${skill.name} (${tierNames[skill.tier]})`;
  type.textContent = getSkillTypeText(skill, state);

  // Build comprehensive description with all characteristics
  let descriptionText = `<strong>📜 Описание:</strong>\n${skill.description}`;

  // Add effects if available
  if (skill.effects) {
    descriptionText += `\n\n<strong>⚔️ Эффекты:</strong>`;
    for (const [effect, value] of Object.entries(skill.effects)) {
      const effectNames = {
        'damage_increase': 'Увеличение урона',
        'attack_speed': 'Скорость атаки',
        'critical_chance': 'Шанс критического удара',
        'damage_reduction': 'Снижение урона',
        'block_chance': 'Шанс блока',
        'health_increase': 'Увеличение здоровья',
        'stamina_increase': 'Увеличение выносливости',
        'max_stamina': 'Макс. выносливость',
        'stamina_regen': 'Регенерация выносливости',
        'rage_generation': 'Генерация ярости',
        'damage_while_raged': 'Урон в ярости',
        'berserk_damage': 'Урон берсерка',
        'berserk_defense_penalty': 'Штраф защиты',
        'berserk_duration': 'Длительность ярости',
        'stamina_cost_reduction': 'Снижение стоимости выносливости',
        'damage_vs_humans': 'Урон по людям',
        'damage_vs_beasts': 'Урон по зверям',
        'ally_damage_bonus': 'Бонус урона союзникам',
        'ally_defense_bonus': 'Бонус защиты союзникам',
        'burn_chance': 'Шанс поджечь',
        'slow_chance': 'Шанс замедлить',
        'aoe_radius': 'Радиус области',
        'fire_damage': 'Урон огнем',
        'explosion_radius': 'Радиус взрыва',
        'thorns_damage': 'Урон от шипов',
        'critical_damage': 'Урон критического удара',
        'devastating_blows': 'Сокрушающие удары'
      };

      const effectName = effectNames[effect] || effect.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      descriptionText += `\n• ${effectName}: +${value}%`;
    }
  }

  // Add stats if available
  if (skill.stats) {
    descriptionText += `\n\n<strong>📊 Характеристики:</strong>`;
    descriptionText += `\n• Сектор: ${skill.stats.sector}`;
    descriptionText += `\n• Уровень: ${skill.stats.tier_name}`;
    descriptionText += `\n• Рекомендуется для: ${skill.stats.recommended_for.join(', ')}`;
  }

  // Add requirements info
  descriptionText += `\n\n<strong>🔗 Требования:</strong>`;
  if (skill.prerequisites.length > 0) {
    descriptionText += `\n• Требуемые навыки: ${skill.prerequisites.map(prereqId => {
      const prereqSkill = classData.skills.find(s => s.id === prereqId);
      return prereqSkill ? prereqSkill.name : prereqId;
    }).join(', ')}`;
  } else {
    descriptionText += `\n• Нет требований (базовый навык)`;
  }

  // Add unlocks info
  if (skill.unlocks.length > 0) {
    descriptionText += `\n\n<strong>🔓 Открывает:</strong>`;
    descriptionText += `\n• Следующие навыки: ${skill.unlocks.map(unlockId => {
      const unlockSkill = classData.skills.find(s => s.id === unlockId);
      return unlockSkill ? unlockSkill.name : unlockId;
    }).join(', ')}`;
  }

  // Add points cost
  descriptionText += `\n\n<strong>💰 Стоимость:</strong>`;
  descriptionText += `\n• Требуется очков: ${skill.requiredPoints} из ${maxPoints - usedPoints} доступных`;

  // Add action info
  descriptionText += getSkillActionText(skill, state);

  // Set the description with HTML formatting
  desc.innerHTML = descriptionText;
}

function getSkillTypeText(skill, state) {
  const typeNames = {
    'offensive': 'Атака',
    'defensive': 'Защита',
    'utility': 'Утилита',
    'special': 'Специальное',
    'ultimate': 'Особое умение',
    'elemental': 'Стихия'
  };

  const stateNames = {
    'learned': '✓ ИЗУЧЕНО',
    'available': 'ДОСТУПНО ДЛЯ ИЗУЧЕНИЯ',
    'locked': 'ЗАБЛОКИРОВАНО'
  };

  return `${typeNames[skill.type] || 'Навык'} • ${stateNames[state]}`;
}

function getSkillActionText(skill, state) {
  if (state === SKILL_STATES.LEARNED) {
    const hasDependents = classData.skills.some(s =>
      s.prerequisites.includes(skill.id) &&
      learnedSkills.has(s.id)
    );

    if (!hasDependents) {
      return '\n\nНажмите, чтобы сбросить навык.';
    } else {
      return '\n\nНельзя сбросить - требуется для других навыков.';
    }
  } else if (state === SKILL_STATES.AVAILABLE) {
    if (maxPoints - usedPoints >= skill.requiredPoints) {
      return `\n\nНажмите, чтобы изучить (требуется ${skill.requiredPoints} очков).`;
    } else {
      return `\n\nНедостаточно очков (требуется ${skill.requiredPoints}, доступно ${maxPoints - usedPoints}).`;
    }
  } else {
    return '\n\nИзучите требуемые навыки, чтобы разблокировать.';
  }
}

// Handle mouse move
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  hoveredSkill = findSkillAtPosition(mouseX, mouseY);
  canvas.style.cursor = hoveredSkill ? 'pointer' : 'default';
  drawWheel();
  updateInfoPanel(hoveredSkill);
});

// Handle mouse leave
canvas.addEventListener('mouseleave', () => {
  hoveredSkill = null;
  canvas.style.cursor = 'default';
  drawWheel();
  updateInfoPanel(null);
});

// Handle click
canvas.addEventListener('click', (e) => {
  if (!hoveredSkill) return;

  const classData = skillData[currentClass];
  const state = getSkillState(hoveredSkill);

  if (state === SKILL_STATES.LEARNED) {
    // Check if we can unlearn this skill
    const hasDependents = classData.skills.some(s =>
      s.prerequisites.includes(hoveredSkill.id) &&
      learnedSkills.has(s.id)
    );

    if (!hasDependents) {
      learnedSkills.delete(hoveredSkill.id);
      usedPoints -= hoveredSkill.requiredPoints;
      updatePointsDisplay();
      drawWheel();
      updateInfoPanel(hoveredSkill);
    }
  } else if (state === SKILL_STATES.AVAILABLE) {
    // Check if we have enough points
    if (maxPoints - usedPoints >= hoveredSkill.requiredPoints) {
      learnedSkills.add(hoveredSkill.id);
      usedPoints += hoveredSkill.requiredPoints;
      updatePointsDisplay();
      drawWheel();
      updateInfoPanel(hoveredSkill);
    }
  }
});

// Initialize the skill wheel when the page loads
window.addEventListener('load', initSkillWheel);

// Reset button
function resetSkills() {
  learnedSkills.clear();
  usedPoints = 0;
  updatePointsDisplay();
  hoveredSkill = null;
  drawWheel();
  updateInfoPanel(null);
}