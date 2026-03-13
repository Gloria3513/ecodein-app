import { useState } from 'react';

const PLANTS = [
  { id: 'sunflower', name: '해바라기', emoji: '🌻', maxStage: 4, co2: 2.5 },
  { id: 'tomato', name: '방울토마토', emoji: '🍅', maxStage: 4, co2: 1.8 },
  { id: 'cactus', name: '선인장', emoji: '🌵', maxStage: 4, co2: 0.5 },
  { id: 'tree', name: '소나무', emoji: '🌲', maxStage: 4, co2: 10 },
];

const STAGE_EMOJIS = {
  sunflower: ['🫘', '🌱', '🪴', '🌿', '🌻'],
  tomato: ['🫘', '🌱', '🪴', '🌿', '🍅'],
  cactus: ['🫘', '🌱', '🪴', '🌿', '🌵'],
  tree: ['🫘', '🌱', '🪴', '🌿', '🌲'],
};

const STAGE_NAMES = ['씨앗', '새싹', '줄기', '잎사귀', '꽃/열매'];

const WATER_MESSAGES = {
  sunflower: ['해바라기가 시원한 물을 좋아해요! 💧', '물을 받아 줄기가 쭉쭉! 💧', '뿌리가 물을 쭉쭉 빨아요 💧'],
  tomato: ['토마토에게 물을 줬어요! 💧', '빨간 열매가 될 준비 중... 💧', '물을 먹고 잎이 반짝! 💧'],
  cactus: ['선인장은 물을 조금만 줘도 돼요 💧', '사막 친구에게 물 한 모금! 💧', '물을 저장하고 있어요 💧'],
  tree: ['소나무 뿌리가 깊이 물을 마셔요 💧', '큰 나무가 될 거예요! 💧', '숲의 향기가 나요 💧'],
};

const SUN_MESSAGES = {
  sunflower: ['해바라기가 해를 향해 고개를 돌려요! ☀️', '태양을 따라 빙글빙글 ☀️', '광합성 파워 충전! ☀️'],
  tomato: ['토마토가 따뜻한 햇살을 받아요 ☀️', '달콤한 열매를 만드는 중... ☀️', '비타민 D 충전! ☀️'],
  cactus: ['선인장은 뜨거운 태양도 좋아해요 ☀️', '사막의 태양 아래 끄떡없어요 ☀️', '가시가 더 튼튼해져요 ☀️'],
  tree: ['소나무가 햇빛을 가득 받아요 ☀️', '솔잎에서 산소가 팡팡! ☀️', '나이테가 하나 더 생길지도? ☀️'],
};

const STAGE_UP_MESSAGES = {
  sunflower: ['', '🌱 작은 새싹이 흙을 뚫고 나왔어요!', '🪴 줄기가 하늘을 향해 쑥쑥!', '🌿 넓은 잎이 펼쳐졌어요!', '🌻 드디어 해바라기꽃이 활짝!'],
  tomato: ['', '🌱 귀여운 새싹이 나왔어요!', '🪴 줄기가 단단해지고 있어요!', '🌿 잎사귀가 무성해졌어요!', '🍅 빨간 방울토마토가 열렸어요!'],
  cactus: ['', '🌱 작은 선인장 아기가 태어났어요!', '🪴 몸통이 조금씩 커지고 있어요!', '🌿 가시가 돋아나기 시작했어요!', '🌵 멋진 선인장으로 자랐어요!'],
  tree: ['', '🌱 솔잎 새싹이 올라왔어요!', '🪴 어린 나무가 되었어요!', '🌿 가지가 뻗어나가고 있어요!', '🌲 우뚝 솟은 소나무가 되었어요!'],
};

function getTimeStr() {
  const now = new Date();
  const h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, '0');
  const period = h < 12 ? '오전' : '오후';
  const hour12 = h % 12 || 12;
  return `${period} ${hour12}:${m}`;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getInitialPlantState() {
  return {
    selectedPlant: null,
    stage: 0,
    water: 50,
    sunlight: 50,
    exp: 0,
    totalCo2: 0,
    log: [],
  };
}

function Grow({ onOpenAr }) {
  const [state, setState] = useState(getInitialPlantState);

  function selectPlant(plant) {
    setState({
      ...getInitialPlantState(),
      selectedPlant: plant,
      log: [{
        type: 'start',
        text: `${plant.name} 씨앗을 심었어요!`,
        emoji: '🫘',
        time: getTimeStr(),
      }],
    });
  }

  function doAction(action) {
    setState((prev) => {
      if (!prev.selectedPlant) return prev;
      const plantId = prev.selectedPlant.id;

      const isWater = action === 'water';
      const newWater = Math.min(100, prev.water + (isWater ? 20 : -5));
      const newSunlight = Math.min(100, prev.sunlight + (isWater ? -5 : 20));
      const newExp = prev.exp + 10;
      const newStage = Math.min(prev.selectedPlant.maxStage, Math.floor(newExp / 30));
      const co2Gained = prev.selectedPlant.co2 * 0.1;
      const stageUp = newStage > prev.stage;
      const time = getTimeStr();

      const actionEntry = {
        type: isWater ? 'water' : 'sun',
        text: isWater ? pickRandom(WATER_MESSAGES[plantId]) : pickRandom(SUN_MESSAGES[plantId]),
        emoji: isWater ? '💧' : '☀️',
        time,
        co2: `+${Math.round(co2Gained * 100) / 100}kg`,
      };

      const entries = [actionEntry];

      if (stageUp) {
        entries.unshift({
          type: 'milestone',
          text: STAGE_UP_MESSAGES[plantId][newStage],
          emoji: '🎉',
          time,
          stage: newStage,
        });
      }

      if (newStage >= prev.selectedPlant.maxStage && prev.stage < prev.selectedPlant.maxStage) {
        entries.unshift({
          type: 'complete',
          text: `${prev.selectedPlant.name}가 완전히 자랐어요! 축하해요!`,
          emoji: '🏆',
          time,
        });
      }

      const newLog = [...entries, ...prev.log].slice(0, 20);

      return {
        ...prev,
        water: Math.max(0, newWater),
        sunlight: Math.max(0, newSunlight),
        exp: newExp,
        stage: newStage,
        totalCo2: Math.round((prev.totalCo2 + co2Gained) * 100) / 100,
        log: newLog,
      };
    });
  }

  function resetPlant() {
    setState(getInitialPlantState());
  }

  if (!state.selectedPlant) {
    return (
      <div className="page-container">
        <h2 className="page-title">🌱 어떤 식물을 키울까요?</h2>
        <div className="plant-select-grid">
          {PLANTS.map((plant) => (
            <button
              key={plant.id}
              className="plant-select-card"
              onClick={() => selectPlant(plant)}
            >
              <span className="plant-select-emoji">{plant.emoji}</span>
              <span className="plant-select-name">{plant.name}</span>
              <span className="plant-select-co2">
                CO₂ 흡수력: {plant.co2}kg/년
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const plantId = state.selectedPlant.id;
  const stageEmojis = STAGE_EMOJIS[plantId];
  const isMaxStage = state.stage >= state.selectedPlant.maxStage;

  return (
    <div className="page-container">
      <div className="grow-header">
        <h2 className="page-title">
          {state.selectedPlant.emoji} 내 {state.selectedPlant.name}
        </h2>
        <button className="reset-button" onClick={resetPlant}>
          다른 식물 키우기
        </button>
      </div>

      <div className="grow-stage-display">
        <div className="grow-plant-emoji">
          {stageEmojis[state.stage]}
        </div>
        <div className="grow-stage-label">
          {isMaxStage
            ? '🎉 다 자랐어요!'
            : `${STAGE_NAMES[state.stage]} 단계`}
        </div>
        <div className="grow-progress-bar">
          <div
            className="grow-progress-fill"
            style={{ width: `${(state.stage / state.selectedPlant.maxStage) * 100}%` }}
          />
        </div>
      </div>

      <div className="grow-stats">
        <div className="stat-card">
          <span className="stat-icon">💧</span>
          <span className="stat-label">물</span>
          <div className="stat-bar">
            <div
              className="stat-bar-fill water-bar"
              style={{ width: `${state.water}%` }}
            />
          </div>
          <span className="stat-value">{state.water}%</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">☀️</span>
          <span className="stat-label">햇빛</span>
          <div className="stat-bar">
            <div
              className="stat-bar-fill sun-bar"
              style={{ width: `${state.sunlight}%` }}
            />
          </div>
          <span className="stat-value">{state.sunlight}%</span>
        </div>
        <div className="stat-card co2-stat">
          <span className="stat-icon">🌍</span>
          <span className="stat-label">CO₂ 흡수량</span>
          <span className="stat-value co2-value">{state.totalCo2}kg</span>
        </div>
      </div>

      <div className="grow-actions">
        <button
          className="action-button water-button"
          onClick={() => doAction('water')}
          disabled={isMaxStage}
        >
          💧 물 주기
        </button>
        <button
          className="action-button sun-button"
          onClick={() => doAction('sun')}
          disabled={isMaxStage}
        >
          ☀️ 햇빛 쐬기
        </button>
      </div>

      <button
        className="action-button ar-button"
        onClick={() => {
          if (typeof onOpenAr === 'function') onOpenAr(state.selectedPlant);
        }}
      >
        🔍 AR로 {state.selectedPlant.name} 광합성 보기
      </button>

      <div className="grow-log">
        <h3>📋 {state.selectedPlant.name} 성장 일지</h3>
        <div className="log-entries">
          {state.log.map((entry, i) => (
            <div key={i} className={`log-entry log-${entry.type}`}>
              <div className="log-left">
                <span className="log-emoji">{entry.emoji}</span>
                {entry.type === 'milestone' && (
                  <div className="log-stage-badge">Lv.{entry.stage}</div>
                )}
              </div>
              <div className="log-content">
                <p className="log-text">{entry.text}</p>
                <div className="log-meta">
                  <span className="log-time">{entry.time}</span>
                  {entry.co2 && <span className="log-co2">{entry.co2} CO₂</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Grow;
