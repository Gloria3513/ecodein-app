import { useState } from 'react';

const PLANTS = [
  { id: 'sunflower', name: '해바라기', emoji: '🌻', maxStage: 4, co2: 2.5 },
  { id: 'tomato', name: '방울토마토', emoji: '🍅', maxStage: 4, co2: 1.8 },
  { id: 'cactus', name: '선인장', emoji: '🌵', maxStage: 4, co2: 0.5 },
  { id: 'tree', name: '소나무', emoji: '🌲', maxStage: 4, co2: 10 },
];

const STAGE_EMOJIS = ['🫘', '🌱', '🪴', '🌿', '🌸'];
const STAGE_NAMES = ['씨앗', '새싹', '줄기', '잎사귀', '꽃/열매'];

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
      log: [`${plant.name} 씨앗을 심었어요! 🫘`],
    });
  }

  function doAction(action) {
    setState((prev) => {
      if (!prev.selectedPlant) return prev;

      const isWater = action === 'water';
      const newWater = Math.min(100, prev.water + (isWater ? 20 : -5));
      const newSunlight = Math.min(100, prev.sunlight + (isWater ? -5 : 20));
      const newExp = prev.exp + 10;
      const newStage = Math.min(prev.selectedPlant.maxStage, Math.floor(newExp / 30));
      const co2Gained = prev.selectedPlant.co2 * 0.1;
      const stageUp = newStage > prev.stage;

      const logEntry = isWater
        ? '물을 주었어요! 💧'
        : '햇빛을 쐬었어요! ☀️';

      const newLog = [
        ...(stageUp ? [`🎉 ${STAGE_NAMES[newStage]} 단계로 성장했어요!`] : []),
        logEntry,
        ...prev.log,
      ].slice(0, 10);

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
          {isMaxStage ? state.selectedPlant.emoji : STAGE_EMOJIS[state.stage]}
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
          if (typeof onOpenAr === 'function') onOpenAr();
        }}
      >
        🔍 AR로 광합성 보기
      </button>

      <div className="grow-log">
        <h3>📋 성장 일지</h3>
        <ul>
          {state.log.map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Grow;
