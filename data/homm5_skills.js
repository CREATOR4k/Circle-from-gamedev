// Heroes of Might and Magic 5 Style Skill Wheel Data
// Based on the original game's skill system with 8 sectors and 4 tiers

const HOMM5_SKILL_DATA = {
  "warrior": {
    "id": "warrior_tree",
    "name": "Могучий Воин",
    "description": "Боевые навыки для ближнего боя и защиты",
    "totalSkillPoints": 15,
    "sectors": 8,
    "maxTiers": 4,
    "skills": [
      // Сектор 0: Сила (Offensive)
      {
        "id": "attack_1",
        "name": "Атака",
        "description": "Увеличивает урон в ближнем бою на 10%",
        "icon": { "x": 0, "y": 0 },
        "sector": 0,
        "tier": 0,
        "type": "offensive",
        "prerequisites": [],
        "unlocks": ["attack_2", "defense_1"],
        "requiredPoints": 1,
        "position": { "angle": 0, "radius": 100 },
        "effects": {
          "damage_increase": 10,
          "attack_speed": 5,
          "critical_chance": 2
        },
        "stats": {
          "sector": "Сила",
          "tier_name": "Базовый",
          "color": "#ff4444",
          "recommended_for": ["Воины", "Паладины", "Берсерки"]
        }
      },
      {
        "id": "attack_2",
        "name": "Могучая атака",
        "description": "Увеличивает урон в ближнем бою на 20% и шанс критического удара на 5%",
        "icon": { "x": 64, "y": 0 },
        "sector": 0,
        "tier": 1,
        "type": "offensive",
        "prerequisites": ["attack_1"],
        "unlocks": ["attack_3", "berserk_1"],
        "requiredPoints": 2,
        "position": { "angle": 0, "radius": 200 }
      },
      {
        "id": "attack_3",
        "name": "Сокрушительный удар",
        "description": "Увеличивает урон на 35% и дает шанс оглушить противника",
        "icon": { "x": 128, "y": 0 },
        "sector": 0,
        "tier": 2,
        "type": "offensive",
        "prerequisites": ["attack_2"],
        "unlocks": ["titan_strike"],
        "requiredPoints": 3,
        "position": { "angle": 0, "radius": 300 }
      },
      {
        "id": "titan_strike",
        "name": "Удар титана",
        "description": "Особое умение: один раз за бой наносит тройной урон",
        "icon": { "x": 192, "y": 0 },
        "sector": 0,
        "tier": 3,
        "type": "ultimate",
        "prerequisites": ["attack_3"],
        "unlocks": [],
        "requiredPoints": 4,
        "position": { "angle": 0, "radius": 400 }
      },

      // Сектор 1: Защита (Defensive)
      {
        "id": "defense_1",
        "name": "Защита",
        "description": "Снижает получаемый урон на 15%",
        "icon": { "x": 0, "y": 64 },
        "sector": 1,
        "tier": 0,
        "type": "defensive",
        "prerequisites": ["attack_1"],
        "unlocks": ["defense_2", "armor_1"],
        "requiredPoints": 1,
        "position": { "angle": 45, "radius": 100 }
      },
      {
        "id": "defense_2",
        "name": "Непробиваемая защита",
        "description": "Снижает урон на 25% и увеличивает шанс блока на 15%",
        "icon": { "x": 64, "y": 64 },
        "sector": 1,
        "tier": 1,
        "type": "defensive",
        "prerequisites": ["defense_1"],
        "unlocks": ["defense_3", "shield_mastery"],
        "requiredPoints": 2,
        "position": { "angle": 45, "radius": 200 }
      },
      {
        "id": "defense_3",
        "name": "Каменная стена",
        "description": "Снижает урон на 40% и отражает 10% урона обратно врагу",
        "icon": { "x": 128, "y": 64 },
        "sector": 1,
        "tier": 2,
        "type": "defensive",
        "prerequisites": ["defense_2"],
        "unlocks": ["iron_skin"],
        "requiredPoints": 3,
        "position": { "angle": 45, "radius": 300 }
      },
      {
        "id": "iron_skin",
        "name": "Железная кожа",
        "description": "Особое умение: на 3 хода становится неуязвим к физическим атакам",
        "icon": { "x": 192, "y": 64 },
        "sector": 1,
        "tier": 3,
        "type": "ultimate",
        "prerequisites": ["defense_3"],
        "unlocks": [],
        "requiredPoints": 4,
        "position": { "angle": 45, "radius": 400 }
      },

      // Сектор 2: Берсерк (Special)
      {
        "id": "berserk_1",
        "name": "Ярость берсерка",
        "description": "При низком здоровье увеличивает урон на 25%, но снижает защиту",
        "icon": { "x": 0, "y": 128 },
        "sector": 2,
        "tier": 1,
        "type": "special",
        "prerequisites": ["attack_2"],
        "unlocks": ["berserk_2"],
        "requiredPoints": 2,
        "position": { "angle": 90, "radius": 200 }
      },
      {
        "id": "berserk_2",
        "name": "Безудержная ярость",
        "description": "Увеличивает урон на 40% при ярости и дает иммунитет к оглушению",
        "icon": { "x": 64, "y": 128 },
        "sector": 2,
        "tier": 2,
        "type": "special",
        "prerequisites": ["berserk_1"],
        "unlocks": ["uncontrollable_rage"],
        "requiredPoints": 3,
        "position": { "angle": 90, "radius": 300 }
      },
      {
        "id": "uncontrollable_rage",
        "name": "Неудержимая ярость",
        "description": "Особое умение: на 5 ходов становится неуязвим и наносит двойной урон",
        "icon": { "x": 128, "y": 128 },
        "sector": 2,
        "tier": 3,
        "type": "ultimate",
        "prerequisites": ["berserk_2"],
        "unlocks": [],
        "requiredPoints": 4,
        "position": { "angle": 90, "radius": 400 }
      },

      // Сектор 3: Броня (Defensive)
      {
        "id": "armor_1",
        "name": "Тяжелая броня",
        "description": "Увеличивает защиту от физических атак на 20%",
        "icon": { "x": 0, "y": 192 },
        "sector": 3,
        "tier": 0,
        "type": "defensive",
        "prerequisites": ["defense_1"],
        "unlocks": ["armor_2"],
        "requiredPoints": 1,
        "position": { "angle": 135, "radius": 100 }
      },
      {
        "id": "armor_2",
        "name": "Мастер брони",
        "description": "Увеличивает защиту на 35% и снижает вес брони",
        "icon": { "x": 64, "y": 192 },
        "sector": 3,
        "tier": 1,
        "type": "defensive",
        "prerequisites": ["armor_1"],
        "unlocks": ["armor_3"],
        "requiredPoints": 2,
        "position": { "angle": 135, "radius": 200 }
      },
      {
        "id": "armor_3",
        "name": "Непробиваемая броня",
        "description": "Увеличивает защиту на 50% и дает шанс отразить магию",
        "icon": { "x": 128, "y": 192 },
        "sector": 3,
        "tier": 2,
        "type": "defensive",
        "prerequisites": ["armor_2"],
        "unlocks": ["dragon_scale"],
        "requiredPoints": 3,
        "position": { "angle": 135, "radius": 300 }
      },
      {
        "id": "dragon_scale",
        "name": "Чешуя дракона",
        "description": "Особое умение: получает 80% сопротивления ко всем типам урона",
        "icon": { "x": 192, "y": 192 },
        "sector": 3,
        "tier": 3,
        "type": "ultimate",
        "prerequisites": ["armor_3"],
        "unlocks": [],
        "requiredPoints": 4,
        "position": { "angle": 135, "radius": 400 }
      },

      // Сектор 4: Выносливость (Utility)
      {
        "id": "endurance_1",
        "name": "Выносливость",
        "description": "Увеличивает максимальное здоровье на 15%",
        "icon": { "x": 0, "y": 256 },
        "sector": 4,
        "tier": 0,
        "type": "utility",
        "prerequisites": [],
        "unlocks": ["endurance_2", "regeneration_1"],
        "requiredPoints": 1,
        "position": { "angle": 180, "radius": 100 }
      },
      {
        "id": "endurance_2",
        "name": "Неутомимость",
        "description": "Увеличивает здоровье на 30% и выносливость на 20%",
        "icon": { "x": 64, "y": 256 },
        "sector": 4,
        "tier": 1,
        "type": "utility",
        "prerequisites": ["endurance_1"],
        "unlocks": ["endurance_3"],
        "requiredPoints": 2,
        "position": { "angle": 180, "radius": 200 }
      },
      {
        "id": "endurance_3",
        "name": "Титановая выносливость",
        "description": "Увеличивает здоровье на 50% и дает иммунитет к утомлению",
        "icon": { "x": 128, "y": 256 },
        "sector": 4,
        "tier": 2,
        "type": "utility",
        "prerequisites": ["endurance_2"],
        "unlocks": ["immortality"],
        "requiredPoints": 3,
        "position": { "angle": 180, "radius": 300 }
      },
      {
        "id": "immortality",
        "name": "Бессмертие",
        "description": "Особое умение: один раз за бой восстает из мертвых с полным здоровьем",
        "icon": { "x": 192, "y": 256 },
        "sector": 4,
        "tier": 3,
        "type": "ultimate",
        "prerequisites": ["endurance_3"],
        "unlocks": [],
        "requiredPoints": 4,
        "position": { "angle": 180, "radius": 400 }
      },

      // Сектор 5: Мастерство оружия (Offensive)
      {
        "id": "weapon_1",
        "name": "Мастерство оружия",
        "description": "Увеличивает скорость атаки на 10%",
        "icon": { "x": 0, "y": 320 },
        "sector": 5,
        "tier": 0,
        "type": "offensive",
        "prerequisites": [],
        "unlocks": ["weapon_2", "dual_wield_1"],
        "requiredPoints": 1,
        "position": { "angle": 225, "radius": 100 }
      },
      {
        "id": "weapon_2",
        "name": "Виртуоз оружия",
        "description": "Увеличивает скорость атаки на 20% и точность на 15%",
        "icon": { "x": 64, "y": 320 },
        "sector": 5,
        "tier": 1,
        "type": "offensive",
        "prerequisites": ["weapon_1"],
        "unlocks": ["weapon_3"],
        "requiredPoints": 2,
        "position": { "angle": 225, "radius": 200 }
      },
      {
        "id": "weapon_3",
        "name": "Легендарное мастерство",
        "description": "Увеличивает скорость и урон на 30%, игнорирует 10% защиты врага",
        "icon": { "x": 128, "y": 320 },
        "sector": 5,
        "tier": 2,
        "type": "offensive",
        "prerequisites": ["weapon_2"],
        "unlocks": ["blade_mastery"],
        "requiredPoints": 3,
        "position": { "angle": 225, "radius": 300 }
      },
      {
        "id": "blade_mastery",
        "name": "Властелин клинка",
        "description": "Особое умение: все атаки наносят критический урон на 3 хода",
        "icon": { "x": 192, "y": 320 },
        "sector": 5,
        "tier": 3,
        "type": "ultimate",
        "prerequisites": ["weapon_3"],
        "unlocks": [],
        "requiredPoints": 4,
        "position": { "angle": 225, "radius": 400 }
      },

      // Сектор 6: Тактика (Utility)
      {
        "id": "tactics_1",
        "name": "Тактика",
        "description": "Увеличивает урон по определенным типам врагов на 15%",
        "icon": { "x": 0, "y": 384 },
        "sector": 6,
        "tier": 0,
        "type": "utility",
        "prerequisites": [],
        "unlocks": ["tactics_2", "ambush_1"],
        "requiredPoints": 1,
        "position": { "angle": 270, "radius": 100 }
      },
      {
        "id": "tactics_2",
        "name": "Военная хитрость",
        "description": "Увеличивает урон по всем типам врагов на 20% и точность на 10%",
        "icon": { "x": 64, "y": 384 },
        "sector": 6,
        "tier": 1,
        "type": "utility",
        "prerequisites": ["tactics_1"],
        "unlocks": ["tactics_3"],
        "requiredPoints": 2,
        "position": { "angle": 270, "radius": 200 }
      },
      {
        "id": "tactics_3",
        "name": "Гениальный стратег",
        "description": "Увеличивает урон на 30% и дает шанс оглушить врага при атаке",
        "icon": { "x": 128, "y": 384 },
        "sector": 6,
        "tier": 2,
        "type": "utility",
        "prerequisites": ["tactics_2"],
        "unlocks": ["master_tactician"],
        "requiredPoints": 3,
        "position": { "angle": 270, "radius": 300 }
      },
      {
        "id": "master_tactician",
        "name": "Мастер тактики",
        "description": "Особое умение: на 4 хода все союзники получают +50% к урону",
        "icon": { "x": 192, "y": 384 },
        "sector": 6,
        "tier": 3,
        "type": "ultimate",
        "prerequisites": ["tactics_3"],
        "unlocks": [],
        "requiredPoints": 4,
        "position": { "angle": 270, "radius": 400 }
      },

      // Сектор 7: Лидерство (Utility)
      {
        "id": "leadership_1",
        "name": "Лидерство",
        "description": "Увеличивает урон и защиту союзников на 8%",
        "icon": { "x": 0, "y": 448 },
        "sector": 7,
        "tier": 0,
        "type": "utility",
        "prerequisites": [],
        "unlocks": ["leadership_2", "inspiration_1"],
        "requiredPoints": 1,
        "position": { "angle": 315, "radius": 100 }
      },
      {
        "id": "leadership_2",
        "name": "Вдохновляющее лидерство",
        "description": "Увеличивает урон и защиту союзников на 15% и скорость передвижения",
        "icon": { "x": 64, "y": 448 },
        "sector": 7,
        "tier": 1,
        "type": "utility",
        "prerequisites": ["leadership_1"],
        "unlocks": ["leadership_3"],
        "requiredPoints": 2,
        "position": { "angle": 315, "radius": 200 }
      },
      {
        "id": "leadership_3",
        "name": "Харизматичный лидер",
        "description": "Увеличивает характеристики союзников на 25% и дает шанс воскрешения",
        "icon": { "x": 128, "y": 448 },
        "sector": 7,
        "tier": 2,
        "type": "utility",
        "prerequisites": ["leadership_2"],
        "unlocks": ["divine_commander"],
        "requiredPoints": 3,
        "position": { "angle": 315, "radius": 300 }
      },
      {
        "id": "divine_commander",
        "name": "Божественный полководец",
        "description": "Особое умение: на 5 ходов все союзники становятся неуязвимы",
        "icon": { "x": 192, "y": 448 },
        "sector": 7,
        "tier": 3,
        "type": "ultimate",
        "prerequisites": ["leadership_3"],
        "unlocks": [],
        "requiredPoints": 4,
        "position": { "angle": 315, "radius": 400 }
      }
    ],
    "connections": [
      // Linear connections (direct upgrades)
      { "from": "attack_1", "to": "attack_2", "type": "linear", "style": "straight" },
      { "from": "attack_2", "to": "attack_3", "type": "linear", "style": "straight" },
      { "from": "attack_3", "to": "titan_strike", "type": "linear", "style": "straight" },

      { "from": "defense_1", "to": "defense_2", "type": "linear", "style": "straight" },
      { "from": "defense_2", "to": "defense_3", "type": "linear", "style": "straight" },
      { "from": "defense_3", "to": "iron_skin", "type": "linear", "style": "straight" },

      { "from": "berserk_1", "to": "berserk_2", "type": "linear", "style": "straight" },
      { "from": "berserk_2", "to": "uncontrollable_rage", "type": "linear", "style": "straight" },

      { "from": "armor_1", "to": "armor_2", "type": "linear", "style": "straight" },
      { "from": "armor_2", "to": "armor_3", "type": "linear", "style": "straight" },
      { "from": "armor_3", "to": "dragon_scale", "type": "linear", "style": "straight" },

      { "from": "endurance_1", "to": "endurance_2", "type": "linear", "style": "straight" },
      { "from": "endurance_2", "to": "endurance_3", "type": "linear", "style": "straight" },
      { "from": "endurance_3", "to": "immortality", "type": "linear", "style": "straight" },

      { "from": "weapon_1", "to": "weapon_2", "type": "linear", "style": "straight" },
      { "from": "weapon_2", "to": "weapon_3", "type": "linear", "style": "straight" },
      { "from": "weapon_3", "to": "blade_mastery", "type": "linear", "style": "straight" },

      { "from": "tactics_1", "to": "tactics_2", "type": "linear", "style": "straight" },
      { "from": "tactics_2", "to": "tactics_3", "type": "linear", "style": "straight" },
      { "from": "tactics_3", "to": "master_tactician", "type": "linear", "style": "straight" },

      { "from": "leadership_1", "to": "leadership_2", "type": "linear", "style": "straight" },
      { "from": "leadership_2", "to": "leadership_3", "type": "linear", "style": "straight" },
      { "from": "leadership_3", "to": "divine_commander", "type": "linear", "style": "straight" },

      // Branch connections (alternative paths)
      { "from": "attack_1", "to": "defense_1", "type": "branch", "style": "curved" },
      { "from": "defense_1", "to": "armor_1", "type": "branch", "style": "curved" },
      { "from": "attack_2", "to": "berserk_1", "type": "branch", "style": "curved" },
      { "from": "endurance_1", "to": "regeneration_1", "type": "branch", "style": "curved" },
      { "from": "weapon_1", "to": "dual_wield_1", "type": "branch", "style": "curved" },
      { "from": "tactics_1", "to": "ambush_1", "type": "branch", "style": "curved" },
      { "from": "leadership_1", "to": "inspiration_1", "type": "branch", "style": "curved" }
    ],
    "sectorNames": [
      "Сила", "Защита", "Ярость", "Броня",
      "Выносливость", "Оружие", "Тактика", "Лидерство"
    ],
    "sectorColors": [
      "#ff4444", "#44ff44", "#ff8844", "#44ffff",
      "#ffff44", "#ff44ff", "#4444ff", "#ff44aa"
    ]
  },

  "mage": {
    "id": "mage_tree",
    "name": "Великий Маг",
    "description": "Магические способности и заклинания",
    "totalSkillPoints": 15,
    "sectors": 8,
    "maxTiers": 4,
    "skills": [
      // Сектор 0: Огонь
      {
        "id": "fire_1",
        "name": "Огненный шар",
        "description": "Базовое заклинание огня, наносит урон огнем",
        "icon": { "x": 256, "y": 0 },
        "sector": 0,
        "tier": 0,
        "type": "elemental",
        "prerequisites": [],
        "unlocks": ["fire_2", "explosion_1"],
        "requiredPoints": 1,
        "position": { "angle": 0, "radius": 100 }
      },
      {
        "id": "fire_2",
        "name": "Огненный шторм",
        "description": "Мощное заклинание, наносит урон по площади",
        "icon": { "x": 320, "y": 0 },
        "sector": 0,
        "tier": 1,
        "type": "elemental",
        "prerequisites": ["fire_1"],
        "unlocks": ["fire_3", "inferno"],
        "requiredPoints": 2,
        "position": { "angle": 0, "radius": 200 }
      },
      {
        "id": "fire_3",
        "name": "Пламя феникса",
        "description": "Вызывает огненного феникса, наносящего урон и воскрешающего союзников",
        "icon": { "x": 384, "y": 0 },
        "sector": 0,
        "tier": 2,
        "type": "elemental",
        "prerequisites": ["fire_2"],
        "unlocks": ["armageddon"],
        "requiredPoints": 3,
        "position": { "angle": 0, "radius": 300 }
      },
      {
        "id": "armageddon",
        "name": "Армагеддон",
        "description": "Особое умение: наносит массивный урон огнем по всем врагам",
        "icon": { "x": 448, "y": 0 },
        "sector": 0,
        "tier": 3,
        "type": "ultimate",
        "prerequisites": ["fire_3"],
        "unlocks": [],
        "requiredPoints": 4,
        "position": { "angle": 0, "radius": 400 }
      }
    ],
    "connections": [
      { "from": "fire_1", "to": "fire_2", "type": "linear", "style": "straight" },
      { "from": "fire_2", "to": "fire_3", "type": "linear", "style": "straight" },
      { "from": "fire_3", "to": "armageddon", "type": "linear", "style": "straight" },
      { "from": "fire_1", "to": "explosion_1", "type": "branch", "style": "curved" }
    ],
    "sectorNames": [
      "Огонь", "Вода", "Воздух", "Земля",
      "Свет", "Тьма", "Разум", "Время"
    ],
    "sectorColors": [
      "#ff4444", "#4444ff", "#44ffff", "#884400",
      "#ffff44", "#884488", "#ff44ff", "#44ff44"
    ]
  }
};