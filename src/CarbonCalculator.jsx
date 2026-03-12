import { useState } from 'react';

const CATEGORIES = [
  {
    id: 'transport',
    icon: '🚗',
    title: '이동수단',
    items: [
      { label: '자가용 (1시간)', co2: 2.3 },
      { label: '버스 (1시간)', co2: 0.5 },
      { label: '지하철 (1시간)', co2: 0.3 },
      { label: '자전거 (1시간)', co2: 0 },
      { label: '걸어가기 (1시간)', co2: 0 },
    ],
  },
  {
    id: 'food',
    icon: '🍽️',
    title: '음식',
    items: [
      { label: '소고기 (1인분)', co2: 6.0 },
      { label: '돼지고기 (1인분)', co2: 1.5 },
      { label: '닭고기 (1인분)', co2: 0.8 },
      { label: '채소 위주 식사', co2: 0.3 },
      { label: '과일 간식', co2: 0.1 },
    ],
  },
  {
    id: 'energy',
    icon: '⚡',
    title: '에너지',
    items: [
      { label: 'TV 시청 (1시간)', co2: 0.1 },
      { label: '에어컨 (1시간)', co2: 1.5 },
      { label: '컴퓨터 (1시간)', co2: 0.2 },
      { label: '샤워 (10분)', co2: 0.4 },
      { label: '세탁기 (1회)', co2: 0.6 },
    ],
  },
  {
    id: 'waste',
    icon: '🗑️',
    title: '쓰레기',
    items: [
      { label: '일회용 컵 (1개)', co2: 0.1 },
      { label: '비닐봉지 (1개)', co2: 0.05 },
      { label: '플라스틱 병 (1개)', co2: 0.08 },
      { label: '재활용 분리수거', co2: -0.2 },
      { label: '음식물 쓰레기 줄이기', co2: -0.3 },
    ],
  },
];

const TREE_CO2_PER_YEAR = 22;

function CarbonCalculator() {
  const [selections, setSelections] = useState({});

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

  function getGrade() {
    if (totalCo2 <= 0) return { emoji: '🌟', label: '완벽해요!', color: '#27ae60' };
    if (totalCo2 < 2) return { emoji: '😊', label: '잘하고 있어요!', color: '#2ecc71' };
    if (totalCo2 < 5) return { emoji: '🤔', label: '조금 줄여봐요!', color: '#f39c12' };
    return { emoji: '😰', label: '많이 줄여야 해요!', color: '#e74c3c' };
  }

  const grade = getGrade();

  return (
    <div className="page-container">
      <h2 className="page-title">🧮 나의 탄소 발자국 계산기</h2>
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

      <div className="calc-result" style={{ borderColor: grade.color }}>
        <div className="result-grade-emoji">{grade.emoji}</div>
        <h3 style={{ color: grade.color }}>{grade.label}</h3>

        <div className="result-total">
          <span className="result-label">오늘의 탄소 배출량</span>
          <span className="result-number" style={{ color: grade.color }}>
            {roundedTotal}kg CO₂
          </span>
        </div>

        {treesNeeded > 0 && (
          <div className="result-trees">
            <p>
              1년이면 <strong>{Math.round(roundedTotal * 365)}kg</strong>!
            </p>
            <p>
              이걸 흡수하려면 나무 🌳 <strong>{treesNeeded}그루</strong>가 필요해요
            </p>
          </div>
        )}

        {totalCo2 <= 0 && selectedItems.length > 0 && (
          <div className="result-eco-message">
            <p>🌍 대단해요! 오늘은 지구에 도움을 주고 있어요!</p>
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
