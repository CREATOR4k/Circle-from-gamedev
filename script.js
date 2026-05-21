const canvas = document.getElementById('skillWheel');
const ctx = canvas.getContext('2d');

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

// 8 главных фракций
const sectors = [
    { name: "Навык", color: "#ffe600ff", desc: "some text." },
    { name: "Навык", color: "#ffae00ff", desc: "some text." },
    { name: "Навык", color: "#d10d0dff", desc: "some text." },
    { name: "Навык", color: "#ff0080ff", desc: "some text." },
    { name: "Навык", color: "#f700ffff", desc: "some text." },
    { name: "Навык", color: "#1900ffff", desc: "some text." },
    { name: "Навык", color: "#00ffbfff", desc: "some text."},
    { name: "Навык", color: "#3cff00ff", desc: "some text."},
];

// Уровни колеса (радиусы)
const tiers = [
    { rMin: 50,  rMax: 564, type: "Основа (Раса/Класс)" },
    { rMin: 190, rMax: 600, type: "Главный Навык" },
    { rMin: 300, rMax: 600, type: "Супер-умение" }
];

const learnedSkills = new Set();

// Отрисовка колеса
function drawWheel(mouseX = -1  , mouseY = -1) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let hoveredElement = null;

    // Проходим по 8? секторам (каждый по 45 градусов)
    for (let s = 0; s < 8; s++) {
        const startAngle = s * (Math.PI / 4) - Math.PI;
        const endAngle = (s + 1) * (Math.PI / 4) - Math.PI;

        // Проходим по 3 уровням глубины
        for (let t = 0; t < 3; t++) {
            const tier = tiers[t];
            const skillKey = `${s}_${t}`;
            const isLearned = learnedSkills.has(skillKey);

            ctx.beginPath();
            ctx.arc(centerX, centerY, tier.rMax, startAngle, endAngle);
            ctx.arc(centerX, centerY, tier.rMin, endAngle, startAngle, true);
            ctx.closePath();

            let isHovered = false;
            if (mouseX >= 0 && mouseY >= 0 && ctx.isPointInPath(mouseX, mouseY)) {
                isHovered = true;
                hoveredElement = { sector: s, tier: t };
            }

            ctx.lineWidth = 2;
            ctx.strokeStyle = "#5c4326";

            if (isHovered) {
                ctx.fillStyle = "#ffffffff"; // Подсветка при наведении
            } else if (isLearned) {
                ctx.fillStyle = sectors[s].color; // Яркий цвет, если изучен
            } else {
                // Затемненный цвет, если не изучен
                ctx.fillStyle = adjustColor(sectors[s].color, -80); 
            }

            ctx.fill();
            ctx.stroke();

            // Отрисовка разделительных линий и декоративных кругов
            ctx.beginPath();
            ctx.arc(centerX, centerY, tier.rMax, 0, Math.PI * 2);
            ctx.strokeStyle = "#302211";
            ctx.stroke();
        }
    }

    //ось колеса
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
    ctx.fillStyle = "#1c140c";
    ctx.strokeStyle = "#ffd700";
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();

    return hoveredElement;
}

// Служебная функция для затемнения цвета некорректных/неизученных навыков
function adjustColor(hex, percent) {
    let R = parseInt(hex.substring(1, 3), 16);
    let G = parseInt(hex.substring(3, 5), 16);
    let B = parseInt(hex.substring(5, 7), 16);
    R = Math.max(0, Math.min(255, R + percent));
    G = Math.max(0, Math.min(255, G + percent));
    B = Math.max(0, Math.min(255, B + percent));
    return `rgb(${R},${G},${B})`;
}

// Обновление интерфейса информации
function updateInfo(element) {
    // if (!element) return;

    const title = document.getElementById('infoTitle');
    const type = document.getElementById('infoType');
    const desc =  document.getElementById('infoDesc');

     if (!element) {
        title.innerHTML = `Выберите навык`;
        type.innerHTML = 'Наведите или нажмите на сектор колеса';
        desc.innerHTML = 'Здесь будет отображено описание выбранного умения или школы магии, а также требования для его получения.';
        return;
    };

    const sector = sectors[element.sector];
    const tier = tiers[element.tier];

    title.innerText = `${sector.name} (${element.tier + 1} ур.)`;
    type.innerText = tier.type;
    desc.innerText = `${sector.desc} Требуется для продвижения на следующий уровень древа Героя.`;

};

// Обработка движения мыши (Hover эффект)
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const hovered = drawWheel(mouseX, mouseY);
    // if (hovered) {
        updateInfo(hovered);
    // }
});

canvas.addEventListener('mouseleave', () => {
    drawWheel(-1, -1);
    updateInfo(null);
});


// Обработка клика (Изучение навыка)
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const clicked = drawWheel(mouseX, mouseY);
    if (clicked) {
        const skillKey = `${clicked.sector}_${clicked.tier}`;
        
        // нельзя взять тир 2, не взяв тир 1 в этом секторе
        if (clicked.tier > 0 && !learnedSkills.has(`${clicked.sector}_${clicked.tier - 1}`)) {
            alert("Сначала необходимо изучить предыдущий уровень этого навыка!");
            return;
        }
//дописать скрипт(при нажатии белый появляется)
        if (learnedSkills.has(skillKey)) {
            // Если кликнули на уже изученный верхний, сбрасываем его
            if (clicked.tier === 2 || !learnedSkills.has(`${clicked.sector}_${clicked.tier + 1}`)) {
                learnedSkills.delete(skillKey);
            }
        } else {
            learnedSkills.add(skillKey);
        }
        drawWheel(mouseX, mouseY);
    }
});

// Инициализация
drawWheel();