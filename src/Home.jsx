import React from 'react';

function Home() {
  return (
    <div style={{ background: 'linear-gradient(160deg, #e8fdf0, #d0f8ff)', minHeight: '80vh' }}>
      
      {/* 히어로 배너 */}
      <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '5rem', marginBottom: '1rem', animation: 'none' }}>🌱</div>
        <h1 style={{
          fontSize: '2.5rem', color: '#1a5c2a', lineHeight: 1.3, marginBottom: '1rem'
        }}>
          식물을 키우며<br/>
          <span style={{ color: '#2ecc71' }}>지구를 지켜요!</span>
        </h1>
        <p style={{ color: '#4a7a30', fontSize: '1.1rem', marginBottom: '2rem' }}>
          AR로 내 식물의 광합성을 눈으로 봐요 👀✨
        </p>
      </div>

      {/* 기능 카드 4개 */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem', padding: '0 2rem 2rem'
      }}>
        {[
          { icon: '📦', title: '식물 키우기 키트', desc: '씨앗부터 수확까지! 단계별 가이드와 함께 나만의 식물을 키워요' },
          { icon: '🔍', title: 'AR 증강현실', desc: '카메라로 비추면 광합성 애니메이션이 짠! 나타나요' },
          { icon: '📚', title: '탄소중립 배우기', desc: '퀴즈와 게임으로 기후변화를 재미있게 배워요!' },
          { icon: '🏆', title: '에코 뱃지 모으기', desc: '미션을 완료하고 귀여운 뱃지를 모아요!' },
        ].map((card, i) => (
          <div key={i} style={{
            background: '#fff', borderRadius: '20px', padding: '1.5rem',
            border: '2px solid rgba(46,204,113,0.2)',
            boxShadow: '0 4px 15px rgba(46,204,113,0.1)',
            cursor: 'default'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{card.icon}</div>
            <h3 style={{ color: '#1a5c2a', marginBottom: '0.5rem', fontSize: '1rem' }}>{card.title}</h3>
            <p style={{ color: '#5a7a4a', fontSize: '0.85rem', lineHeight: 1.6 }}>{card.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Home;