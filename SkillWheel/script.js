const skillsData = {
    haven: {
        logo: "images/factions/haven.png",
        // Круг 1: Базовые навыки (доступны всегда)
        ring1: [
            { id: "h1", name: "Контрудар", desc: "Расовое умение рыцаря.", img: "images/skills/counter.png", req: null },
            { id: "h2", name: "Магия Света", desc: "Позволяет учить свитки света.", img: "images/skills/light.png", req: null },
            { id: "h3", name: "Нападение", desc: "Увеличивает урон ближнего боя.", img: "images/skills/attack.png", req: null }
        ],
        // Круг 2: Продвинутые (требуют навыки из Круга 1)
        ring2: [
            { id: "h2_1", name: "Молитва", desc: "Усиливает атаку и защиту войска.", img: "images/skills/prayer.png", req: "h2" },
            { id: "h2_2", name: "Дарующий свет", desc: "Удешевляет заклинания света.", img: "images/skills/light_cost.png", req: "h2" },
            { id: "h3_1", name: "Стрельба", desc: "Повышает урон стрелков.", img: "images/skills/archery.png", req: "h3" }
        ],
        // Круг 3: Супер-навык (требует навык из Круга 2)
        ring3: [
            { id: "h3_super", name: "Святой Воитель", desc: "Финальная способность Ордена Порядка.", img: "images/skills/champion.png", req: "h2_1" }
        ]
    },
    inferno: {
        logo: "images/factions/inferno.png",
        ring1: [
            { id: "i1", name: "Открытие врат", desc: "Призыв демонов на поле боя.", img: "images/skills/gating.png", req: null }
        ],
        ring2: [],
        ring3: []
    }
};

let activeFaction = 'haven';
// Хранилище для изученных навыков (id: true/false)
let activatedSkills = {}; 

function renderWheel() {
    const faction = skillsData[activeFaction];
    const svg = document.getElementById('wheelLines');
    svg.innerHTML = ''; // Очищаем старые линии
    
    // Сбор всех нод в плоский массив для удобства расчетов и связей
    const allSkills = [...faction.ring1, ...faction.ring2, ...faction.ring3];
    const positions = {}; // Для хранения точных координат нод {id: {x, y}}

    // Радиусы кругов
    const radii = { ring1: 100, ring2: 180, ring3: 250 };
    const center = 280; // Точный центр контейнера (560 / 2)

    // Распределяем элементы и фиксируем их координаты
    ['ring1', 'ring2', 'ring3'].forEach(ringName => {
        const ringData = faction[ringName];
        const ringElement = document.getElementById(ringName);
        ringElement.innerHTML = ''; 

        ringData.forEach((skill, index) => {
            const angle = (index * 360 / ringData.length) * (Math.PI / 180);
            const radius = radii[ringName];
            
            // Вычисляем смещение от центра
            const tx = radius * Math.cos(angle);
            const ty = radius * Math.sin(angle);

            // Сохраняем абсолютные координаты внутри колеса для линий SVG
            positions[skill.id] = { x: center + tx, y: center + ty };

            // Создаем DOM-элемент навыка
            const node = document.createElement('div');
            node.className = 'skill-node';
            node.style.backgroundImage = `url('${skill.img}')`;
            
            // Багфикс смещения ховера: используем CSS-переменные для сдвига вместо чистого left/top
            node.style.transform = `translate(${tx - 23}px, ${ty - 23}px)`; // 23px - это половина ширины ноды (46/2)
            node.style.setProperty('--tx', `${tx - 23}px`);
            node.style.setProperty('--ty', `${ty - 23}px`);

            // Проверка состояния доступности навыка (Логика дерева)
            if (!skill.req) {
                // Если требований нет — навык доступен для изучения
                if (activatedSkills[skill.id]) {
                    node.classList.add('active-node');
                } else {
                    node.classList.add('available');
                }
            } else {
                // Если требование есть, проверяем, активно ли оно
                if (activatedSkills[skill.req]) {
                    if (activatedSkills[skill.id]) {
                        node.classList.add('active-node');
                    } else {
                        node.classList.add('available');
                    }
                } else {
                    node.classList.add('disabled');
                    // Если родитель выключен, то и текущий выключается (авто-сброс бага)
                    activatedSkills[skill.id] = false; 
                }
            }

            // Интерактивность
            node.addEventListener('mouseenter', () => updateInfoPanel(skill, faction));
            node.addEventListener('click', () => {
                if (node.classList.contains('disabled')) return;
                
                // Переключаем статус
                activatedSkills[skill.id] = !activatedSkills[skill.id];
                // Перерисовываем колесо, чтобы обновить зависимые ветки и линии
                renderWheel();
            });

            ringElement.appendChild(node);
        });
    });

    // Отрисовка линий связей (Багфикс позиционирования линий)
    allSkills.forEach(skill => {
        if (skill.req && positions[skill.id] && positions[skill.req]) {
            const start = positions[skill.req];
            const end = positions[skill.id];

            const line = document.createElementNS('http://w3.org', 'line');
            line.setAttribute('x1', start.x);
            line.setAttribute('y1', start.y);
            line.setAttribute('x2', end.x);
            line.setAttribute('y2', end.y);
            
            // Если родительский навык взят — подсвечиваем линию золотым
            if (activatedSkills[skill.req]) {
                line.setAttribute('stroke', activatedSkills[skill.id] ? '#45f3ff' : '#c5a059');
                line.setAttribute('stroke-width', '2');
            } else {
                line.setAttribute('stroke', '#333');
                line.setAttribute('stroke-width', '1');
            }
            svg.appendChild(line);
        }
    });
}

function updateInfoPanel(skill, faction) {
    document.getElementById('infoTitle').innerText = skill.name;
    document.getElementById('infoDescription').innerText = skill.desc;
    
    const reqBadge = document.getElementById('infoRequirements');
    if (skill.req) {
        // Ищем имя родительского навыка для вывода в панель
        const parentSkill = [...faction.ring1, ...faction.ring2].find(s => s.id === skill.req);
        reqBadge.innerText = `Требуется: ${parentSkill ? parentSkill.name : 'Предыдущий навык'}`;
    } else {
        reqBadge.innerText = 'Базовое умение';
    }
}

// Переключение фракций
document.querySelectorAll('.faction-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelector('.faction-btn.active').classList.remove('active');
        e.target.classList.add('active');
        activeFaction = e.target.dataset.faction;
        activatedSkills = {}; // Сбрасываем прокачку при смене фракции
        document.getElementById('factionLogo').src = skillsData[activeFaction].logo;
        renderWheel();
    });
});

// Старт
window.onload = () => {
    renderWheel();
};
