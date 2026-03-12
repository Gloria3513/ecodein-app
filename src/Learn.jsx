import { useState } from 'react';

const QUIZZES = [
  {
    question: '나무 한 그루가 1년에 흡수하는 CO₂는 약 얼마일까요?',
    options: ['약 2kg', '약 10kg', '약 22kg', '약 50kg'],
    answer: 2,
    explanation: '나무 한 그루는 1년에 약 22kg의 이산화탄소를 흡수해요! 🌳',
  },
  {
    question: '다음 중 온실가스가 아닌 것은?',
    options: ['이산화탄소(CO₂)', '메탄(CH₄)', '산소(O₂)', '아산화질소(N₂O)'],
    answer: 2,
    explanation: '산소는 우리가 숨쉬는 기체예요. 온실가스에는 CO₂, 메탄, 아산화질소 등이 있어요! 💨',
  },
  {
    question: '탄소중립이란 무엇일까요?',
    options: [
      '탄소를 아예 안 만드는 것',
      '배출한 탄소만큼 흡수해서 0으로 만드는 것',
      '탄소를 다른 나라에 보내는 것',
      '탄소를 땅속에 묻는 것',
    ],
    answer: 1,
    explanation:
      '탄소중립은 배출한 만큼 흡수·제거해서 순배출량을 "0"으로 만드는 거예요! ⚖️',
  },
  {
    question: '광합성에 필요하지 않은 것은?',
    options: ['햇빛', '물', '이산화탄소', '소금'],
    answer: 3,
    explanation: '식물은 햇빛 + 물 + CO₂로 광합성을 해서 산소와 포도당을 만들어요! 🌿',
  },
  {
    question: '지구 온난화의 가장 큰 원인은?',
    options: ['화산 폭발', '화석연료 사용', '숲이 너무 많아서', '바다가 너무 깊어서'],
    answer: 1,
    explanation:
      '석유·석탄·가스 같은 화석연료를 태우면 CO₂가 대량으로 나와요! 🏭',
  },
  {
    question: '다음 중 탄소 발자국을 줄이는 행동은?',
    options: ['자동차 타기', '일회용 컵 사용', '대중교통 이용', '에어컨 강풍'],
    answer: 2,
    explanation: '대중교통은 자가용보다 1인당 CO₂ 배출이 훨씬 적어요! 🚌',
  },
  {
    question: '식물이 광합성으로 만들어내는 기체는?',
    options: ['이산화탄소', '수소', '산소', '질소'],
    answer: 2,
    explanation: '식물은 CO₂를 흡수하고 산소(O₂)를 내뿜어요. 고마운 식물! 🌱',
  },
  {
    question: '북극곰이 위험해진 이유는?',
    options: ['먹이가 너무 많아서', '빙하가 녹고 있어서', '너무 추워서', '바다가 얼어서'],
    answer: 1,
    explanation: '지구 온난화로 북극 빙하가 녹으면서 북극곰의 서식지가 사라지고 있어요 🐻‍❄️',
  },
];

const TOPICS = [
  {
    title: '🌍 기후변화란?',
    content:
      '지구의 평균 온도가 올라가는 현상이에요. 마치 지구가 두꺼운 이불을 덮고 있는 것처럼, 온실가스가 열을 가둬서 점점 더워지고 있어요.',
    emoji: '🌡️',
  },
  {
    title: '🌿 광합성이란?',
    content:
      '식물이 햇빛을 이용해서 요리하는 거예요! 물과 이산화탄소를 재료로, 햇빛을 불로 사용해서 포도당(음식)과 산소를 만들어요.',
    emoji: '☀️',
  },
  {
    title: '♻️ 탄소중립이란?',
    content:
      '시소를 상상해 보세요! 한쪽에는 우리가 내뿜는 CO₂, 다른 쪽에는 나무가 흡수하는 CO₂. 이 시소가 균형을 이루면 "탄소중립"이에요!',
    emoji: '⚖️',
  },
  {
    title: '👣 탄소 발자국이란?',
    content:
      '우리가 생활하면서 남기는 CO₂의 양이에요. 밥 먹고, 학교 가고, TV 볼 때도 탄소 발자국이 생겨요. 발자국이 작을수록 지구에 좋아요!',
    emoji: '👣',
  },
];

function Learn() {
  const [mode, setMode] = useState('menu');
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  function startQuiz() {
    setMode('quiz');
    setQuizIndex(0);
    setSelected(null);
    setScore(0);
    setShowResult(false);
  }

  function handleAnswer(optionIndex) {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === QUIZZES[quizIndex].answer) {
      setScore((prev) => prev + 1);
    }
  }

  function nextQuestion() {
    if (quizIndex + 1 >= QUIZZES.length) {
      setShowResult(true);
    } else {
      setQuizIndex((prev) => prev + 1);
      setSelected(null);
    }
  }

  if (mode === 'menu') {
    return (
      <div className="page-container">
        <h2 className="page-title">📚 탄소중립 배우기</h2>

        <div className="learn-topics">
          {TOPICS.map((topic, i) => (
            <div key={i} className="topic-card">
              <div className="topic-emoji">{topic.emoji}</div>
              <div className="topic-content">
                <h3>{topic.title}</h3>
                <p>{topic.content}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="quiz-start-button" onClick={startQuiz}>
          🧠 퀴즈 도전하기!
        </button>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / QUIZZES.length) * 100);
    const message =
      percentage >= 80
        ? '🏆 대단해요! 탄소중립 박사!'
        : percentage >= 50
          ? '👍 잘했어요! 조금만 더 배워봐요!'
          : '📖 다시 공부하고 도전해 봐요!';

    return (
      <div className="page-container">
        <div className="quiz-result">
          <div className="result-emoji">
            {percentage >= 80 ? '🎉' : percentage >= 50 ? '😊' : '📚'}
          </div>
          <h2>퀴즈 결과</h2>
          <div className="result-score">
            {score} / {QUIZZES.length}
          </div>
          <div className="result-percentage">{percentage}점</div>
          <p className="result-message">{message}</p>
          <div className="result-actions">
            <button className="quiz-start-button" onClick={startQuiz}>
              🔄 다시 도전!
            </button>
            <button
              className="quiz-back-button"
              onClick={() => setMode('menu')}
            >
              📚 다시 공부하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const quiz = QUIZZES[quizIndex];

  return (
    <div className="page-container">
      <div className="quiz-header">
        <span className="quiz-progress">
          {quizIndex + 1} / {QUIZZES.length}
        </span>
        <button className="quiz-back-link" onClick={() => setMode('menu')}>
          ← 돌아가기
        </button>
      </div>

      <div className="quiz-card">
        <h3 className="quiz-question">❓ {quiz.question}</h3>

        <div className="quiz-options">
          {quiz.options.map((option, i) => {
            let className = 'quiz-option';
            if (selected !== null) {
              if (i === quiz.answer) className += ' correct';
              else if (i === selected) className += ' wrong';
            }
            return (
              <button
                key={i}
                className={className}
                onClick={() => handleAnswer(i)}
                disabled={selected !== null}
              >
                {option}
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div className="quiz-explanation">
            <p>{quiz.explanation}</p>
            <button className="quiz-next-button" onClick={nextQuestion}>
              {quizIndex + 1 >= QUIZZES.length ? '결과 보기 🏆' : '다음 문제 →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Learn;
