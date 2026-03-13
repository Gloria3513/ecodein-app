import { useState } from 'react';

const CATEGORIES = [
  {
    id: 'transport',
    icon: '🚗',
    title: '이동수단',
    items: [
      { label: '자가용 (1시간)', co2: 2.3, emoji: '🚙' },
      { label: '버스 (1시간)', co2: 0.5, emoji: '🚌' },
      { label: '지하철 (1시간)', co2: 0.3, emoji: '🚇' },
      { label: '자전거 (1시간)', co2: 0, emoji: '🚲' },
      { label: '걸어가기 (1시간)', co2: 0, emoji: '🚶' },
    ],
  },
  {
    id: 'food',
    icon: '🍽️',
    title: '음식',
    items: [
      { label: '소고기 (1인분)', co2: 6.0, emoji: '🥩' },
      { label: '돼지고기 (1인분)', co2: 1.5, emoji: '🥓' },
      { label: '닭고기 (1인분)', co2: 0.8, emoji: '🍗' },
      { label: '채소 위주 식사', co2: 0.3, emoji: '🥗' },
      { label: '과일 간식', co2: 0.1, emoji: '🍎' },
    ],
  },
  {
    id: 'energy',
    icon: '⚡',
    title: '에너지',
    items: [
      { label: 'TV 시청 (1시간)', co2: 0.1, emoji: '📺' },
      { label: '에어컨 (1시간)', co2: 1.5, emoji: '❄️' },
      { label: '컴퓨터 (1시간)', co2: 0.2, emoji: '💻' },
      { label: '샤워 (10분)', co2: 0.4, emoji: '🚿' },
      { label: '세탁기 (1회)', co2: 0.6, emoji: '👕' },
    ],
  },
  {
    id: 'waste',
    icon: '🗑️',
    title: '쓰레기',
    items: [
      { label: '일회용 컵 (1개)', co2: 0.1, emoji: '🥤' },
      { label: '비닐봉지 (1개)', co2: 0.05, emoji: '🛍️' },
      { label: '플라스틱 병 (1개)', co2: 0.08, emoji: '🧴' },
      { label: '재활용 분리수거', co2: -0.2, emoji: '♻️' },
      { label: '음식물 쓰레기 줄이기', co2: -0.3, emoji: '🌿' },
    ],
  },
];

const TREE_CO2_PER_YEAR = 22;

const FUN_COMPARISONS = [
  { threshold: 0.1, text: '스마트폰 충전 {n}번과 같아요!', unit: 0.008, emoji: '📱' },
  { threshold: 1, text: '풍선 {n}개 분량의 CO₂예요!', unit: 0.014, emoji: '🎈' },
  { threshold: 3, text: '자동차로 {n}km 달린 것과 같아요!', unit: 0.21, emoji: '🚗' },
  { threshold: 6, text: '비행기로 {n}km 날아간 것과 같아요!', unit: 0.255, emoji: '✈️' },
  { threshold: Infinity, text: '코끼리 {n}마리가 하루 내쉬는 숨과 같아요!', unit: 10, emoji: '🐘' },
];

const DAILY_CHALLENGES = [
  { text: '오늘 하루 대중교통만 이용하기!', emoji: '🚌', reward: '지구 히어로 뱃지' },
  { text: '채식 한 끼 도전!', emoji: '🥗', reward: '초록 식탁 뱃지' },
  { text: '플러그 3개 이상 뽑기!', emoji: '🔌', reward: '에너지 절약왕 뱃지' },
  { text: '텀블러 사용하고 일회용 컵 NO!', emoji: '☕', reward: '제로웨이스트 뱃지' },
  { text: '엘리베이터 대신 계단 이용하기!', emoji: '🏃', reward: '건강한 지구 뱃지' },
  { text: '분리수거 완벽하게 하기!', emoji: '♻️', reward: '분리수거 마스터 뱃지' },
  { text: '샤워 5분 안에 끝내기!', emoji: '⏱️', reward: '물 절약 히어로 뱃지' },
];

function getDailyChallenge() {
  const today = new Date();
  const dayIndex = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % DAILY_CHALLENGES.length;
  return DAILY_CHALLENGES[dayIndex];
}

function getFunComparison(co2) {
  if (co2 <= 0) return null;
  const comp = FUN_COMPARISONS.find((c) => co2 < c.threshold);
  const count = Math.max(1, Math.round(co2 / comp.unit));
  return {
    emoji: comp.emoji,
    text: comp.text.replace('{n}', count.toLocaleString()),
  };
}

function getEarthEmoji(co2) {
  if (co2 <= 0) return { emoji: '🌍', state: '건강한 지구', color: '#27ae60' };
  if (co2 < 2) return { emoji: '🌏', state: '괜찮은 지구', color: '#2ecc71' };
  if (co2 < 5) return { emoji: '🌎', state: '걱정되는 지구', color: '#f39c12' };
  if (co2 < 8) return { emoji: '🥵', state: '뜨거운 지구', color: '#e67e22' };
  return { emoji: '🔥', state: '위험한 지구', color: '#e74c3c' };
}

function CarbonCalculator() {
  const [selections, setSelections] = useState({});
  const [challengeDone, setChallengeDone] = useState(false);

  const challenge = getDailyChallenge();

  function toggleItem(categoryId, itemIndex) {
    const key = `${categoryId}-${itemIndex}`;
    setSelections((prev) => {
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = CATEGORIES.find((c) => c.id === categoryId).items[itemIndex];
      }
      return next;
    });
  }

  function resetAll() {
    setSelections({});
  }

  const selectedItems = Object.entries(selections);
  const totalCo2 = selectedItems.reduce((sum, [, item]) => sum + item.co2, 0);
  const roundedTotal = Math.round(totalCo2 * 100) / 100;
  const treesNeeded = totalCo2 > 0
    ? Math.ceil((totalCo2 * 365) / TREE_CO2_PER_YEAR)
    : 0;

  const earth = getEarthEmoji(totalCo2);
  const comparison = getFunComparison(totalCo2);
  const gaugePercent = Math.min(100, (totalCo2 / 10) * 100);

  return (
    <div className="page-container">
      <h2 className="page-title">🧮 나의 탄소 발자국</h2>

      {/* 오늘의 챌린지 */}
      <div className="calc-challenge">
        <div className="challenge-header">
          <span className="challenge-badge">오늘의 미션</span>
          {challengeDone && <span className="challenge-complete">완료!</span>}
        </div>
        <div className="challenge-body">
          <span className="challenge-emoji">{challenge.emoji}</span>
          <div className="challenge-text">
            <p className="challenge-desc">{challenge.text}</p>
            <p className="challenge-reward">보상: {challenge.reward} 🏅</p>
          </div>
          <button
            className={`challenge-button ${challengeDone ? 'challenge-done' : ''}`}
            onClick={() => setChallengeDone((prev) => !prev)}
          >
            {challengeDone ? '✅' : '도전!'}
          </button>
        </div>
      </div>

      {/* 지구 상태 게이지 */}
      <div className="calc-earth-gauge">
        <div className="earth-display">
          <span className="earth-emoji">{earth.emoji}</span>
          <span className="earth-state" style={{ color: earth.color }}>{earth.state}</span>
        </div>
        <div className="gauge-bar">
          <div
            className="gauge-fill"
            style={{
              width: `${gaugePercent}%`,
              background: `linear-gradient(90deg, #2ecc71, #f39c12 50%, #e74c3c)`,
            }}
          />
          <div className="gauge-labels">
            <span>🌱 0kg</span>
            <span>⚠️ 5kg</span>
            <span>🔥 10kg+</span>
          </div>
        </div>
      </div>

      <p className="page-desc">오늘 하루 활동을 선택해 보세요!</p>

      <div className="calc-categories">
        {CATEGORIES.map((category) => (
          <div key={category.id} className="calc-category">
            <h3 className="calc-category-title">
              {category.icon} {category.title}
            </h3>
            <div className="calc-items">
              {category.items.map((item, i) => {
                const key = `${category.id}-${i}`;
                const isSelected = Boolean(selections[key]);
                const isNegative = item.co2 < 0;
                return (
                  <button
                    key={i}
                    className={`calc-item ${isSelected ? 'calc-item-selected' : ''} ${isNegative ? 'calc-item-eco' : ''}`}
                    onClick={() => toggleItem(category.id, i)}
                  >
                    <span className="calc-item-emoji">{item.emoji}</span>
                    <span className="calc-item-label">{item.label}</span>
                    <span className={`calc-item-co2 ${isNegative ? 'eco-value' : ''}`}>
                      {item.co2 > 0 ? '+' : ''}{item.co2}kg
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="calc-result" style={{ borderColor: earth.color }}>
        <div className="result-grade-emoji">{earth.emoji}</div>
        <h3 style={{ color: earth.color }}>{earth.state}</h3>

        <div className="result-total">
          <span className="result-label">오늘의 탄소 배출량</span>
          <span className="result-number" style={{ color: earth.color }}>
            {roundedTotal}kg CO₂
          </span>
        </div>

        {/* 재미있는 비교 */}
        {comparison && (
          <div className="result-comparison">
            <span className="comparison-emoji">{comparison.emoji}</span>
            <p>{comparison.text}</p>
          </div>
        )}

        {treesNeeded > 0 && (
          <div className="result-trees">
            <p>
              1년이면 <strong>{Math.round(roundedTotal * 365)}kg</strong>!
            </p>
            <p>
              이걸 흡수하려면 나무 {Array(Math.min(treesNeeded, 10)).fill('🌳').join('')}
              {treesNeeded > 10 ? ` +${treesNeeded - 10}그루 더` : ` ${treesNeeded}그루`}가 필요해요
            </p>
          </div>
        )}

        {totalCo2 <= 0 && selectedItems.length > 0 && (
          <div className="result-eco-message">
            <p>🌍 대단해요! 오늘은 지구에 도움을 주고 있어요!</p>
            <div className="eco-celebration">🎉🌱🎉</div>
          </div>
        )}

        {selectedItems.length > 0 && (
          <button className="reset-button calc-reset" onClick={resetAll}>
            🔄 다시 계산하기
          </button>
        )}
      </div>

      <div className="calc-tips">
        <h3>💡 탄소 줄이는 꿀팁</h3>
        <ul>
          <li>🚶 가까운 거리는 걸어가거나 자전거를 타요</li>
          <li>🥗 일주일에 하루는 채식을 해봐요</li>
          <li>🔌 안 쓰는 전자제품 플러그를 뽑아요</li>
          <li>♻️ 분리수거를 꼼꼼히 해요</li>
          <li>🌳 나무를 심거나 식물을 키워요</li>
        </ul>
      </div>
    </div>
  );
}

export default CarbonCalculator;
