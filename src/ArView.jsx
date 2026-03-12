import { useEffect, useRef, useState } from 'react';

const AFRAME_SRC = 'https://aframe.io/releases/1.4.2/aframe.min.js';
const ARJS_SRC = 'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js';

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function buildScene(container) {
  const scene = document.createElement('a-scene');
  scene.setAttribute('embedded', '');
  scene.setAttribute('arjs', 'sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;');
  scene.setAttribute('vr-mode-ui', 'enabled: false');
  scene.setAttribute('renderer', 'logarithmicDepthBuffer: true; antialias: true;');

  const marker = document.createElement('a-marker');
  marker.setAttribute('preset', 'hiro');
  marker.setAttribute('smooth', 'true');
  marker.setAttribute('smoothCount', '5');

  // 땅 (초록 원반)
  const ground = document.createElement('a-cylinder');
  ground.setAttribute('position', '0 0 0');
  ground.setAttribute('radius', '0.6');
  ground.setAttribute('height', '0.05');
  ground.setAttribute('color', '#4CAF50');
  ground.setAttribute('opacity', '0.8');
  marker.appendChild(ground);

  // 줄기
  const stem = document.createElement('a-cylinder');
  stem.setAttribute('position', '0 0.4 0');
  stem.setAttribute('radius', '0.04');
  stem.setAttribute('height', '0.8');
  stem.setAttribute('color', '#2E7D32');
  marker.appendChild(stem);

  // 잎사귀들
  const leaves = [
    { pos: '0.15 0.5 0', rot: '0 0 -30', color: '#43A047' },
    { pos: '-0.15 0.6 0', rot: '0 0 30', color: '#66BB6A' },
    { pos: '0 0.55 0.12', rot: '30 0 0', color: '#4CAF50' },
    { pos: '0 0.45 -0.12', rot: '-30 0 0', color: '#388E3C' },
  ];
  leaves.forEach((leaf) => {
    const el = document.createElement('a-box');
    el.setAttribute('position', leaf.pos);
    el.setAttribute('rotation', leaf.rot);
    el.setAttribute('width', '0.25');
    el.setAttribute('height', '0.02');
    el.setAttribute('depth', '0.12');
    el.setAttribute('color', leaf.color);
    el.setAttribute('opacity', '0.9');
    marker.appendChild(el);
  });

  // 꽃
  const flower = document.createElement('a-sphere');
  flower.setAttribute('position', '0 0.85 0');
  flower.setAttribute('radius', '0.08');
  flower.setAttribute('color', '#FFEB3B');
  marker.appendChild(flower);

  // 꽃잎
  for (let i = 0; i < 5; i++) {
    const petal = document.createElement('a-sphere');
    const angle = (i * 72) * Math.PI / 180;
    const x = Math.cos(angle) * 0.1;
    const z = Math.sin(angle) * 0.1;
    petal.setAttribute('position', `${x} 0.85 ${z}`);
    petal.setAttribute('radius', '0.05');
    petal.setAttribute('color', '#FF9800');
    marker.appendChild(petal);
  }

  // 햇빛 (위에서 내려오는 노란 빛)
  const sunRays = [
    { from: '-0.3 1.5 0', to: '-0.05 0.7 0' },
    { from: '0 1.6 0', to: '0 0.75 0' },
    { from: '0.3 1.5 0', to: '0.05 0.7 0' },
  ];
  sunRays.forEach((ray, i) => {
    const el = document.createElement('a-sphere');
    el.setAttribute('radius', '0.025');
    el.setAttribute('color', '#FFD600');
    el.setAttribute('opacity', '0.8');
    el.setAttribute('position', ray.from);
    el.setAttribute('animation', `property: position; from: ${ray.from}; to: ${ray.to}; dur: 2000; delay: ${i * 300}; loop: true; easing: easeInOutSine`);
    el.setAttribute('animation__opacity', 'property: opacity; from: 0.9; to: 0.2; dur: 2000; delay: ' + (i * 300) + '; loop: true; easing: easeInOutSine');
    marker.appendChild(el);
  });

  // CO₂ 파티클 (파란색, 식물 쪽으로 이동)
  const co2Positions = [
    { from: '-0.8 0.3 0.3', to: '-0.1 0.5 0.05' },
    { from: '0.8 0.4 -0.2', to: '0.1 0.55 -0.05' },
    { from: '-0.6 0.5 -0.4', to: '-0.05 0.5 -0.05' },
    { from: '0.7 0.2 0.5', to: '0.05 0.45 0.05' },
  ];
  co2Positions.forEach((p, i) => {
    const el = document.createElement('a-sphere');
    el.setAttribute('radius', '0.03');
    el.setAttribute('color', '#78909C');
    el.setAttribute('opacity', '0.7');
    el.setAttribute('position', p.from);
    el.setAttribute('animation', `property: position; from: ${p.from}; to: ${p.to}; dur: 3000; delay: ${i * 500}; loop: true; easing: easeInOutQuad`);
    el.setAttribute('animation__scale', 'property: scale; from: 1 1 1; to: 0.3 0.3 0.3; dur: 3000; delay: ' + (i * 500) + '; loop: true; easing: easeInOutQuad');
    marker.appendChild(el);

    // CO₂ 라벨
    if (i === 0) {
      const text = document.createElement('a-text');
      text.setAttribute('value', 'CO2');
      text.setAttribute('position', '-0.8 0.45 0.3');
      text.setAttribute('scale', '0.4 0.4 0.4');
      text.setAttribute('color', '#546E7A');
      text.setAttribute('align', 'center');
      text.setAttribute('animation', 'property: position; from: -0.8 0.45 0.3; to: -0.1 0.65 0.05; dur: 3000; loop: true; easing: easeInOutQuad');
      marker.appendChild(text);
    }
  });

  // O₂ 파티클 (초록색, 식물에서 나가는 방향)
  const o2Positions = [
    { from: '0 0.6 0', to: '0.7 0.9 0.4' },
    { from: '0 0.55 0', to: '-0.6 0.85 -0.3' },
    { from: '0 0.5 0', to: '0.5 1.0 -0.5' },
    { from: '0 0.58 0', to: '-0.7 0.95 0.4' },
  ];
  o2Positions.forEach((p, i) => {
    const el = document.createElement('a-sphere');
    el.setAttribute('radius', '0.025');
    el.setAttribute('color', '#4FC3F7');
    el.setAttribute('opacity', '0.8');
    el.setAttribute('position', p.from);
    el.setAttribute('animation', `property: position; from: ${p.from}; to: ${p.to}; dur: 2500; delay: ${i * 400}; loop: true; easing: easeOutQuad`);
    el.setAttribute('animation__scale', 'property: scale; from: 0.5 0.5 0.5; to: 1.2 1.2 1.2; dur: 2500; delay: ' + (i * 400) + '; loop: true; easing: easeOutQuad');
    el.setAttribute('animation__opacity', 'property: opacity; from: 0.9; to: 0.1; dur: 2500; delay: ' + (i * 400) + '; loop: true; easing: easeOutQuad');
    marker.appendChild(el);

    // O₂ 라벨
    if (i === 0) {
      const text = document.createElement('a-text');
      text.setAttribute('value', 'O2');
      text.setAttribute('position', '0 0.75 0');
      text.setAttribute('scale', '0.5 0.5 0.5');
      text.setAttribute('color', '#0288D1');
      text.setAttribute('align', 'center');
      text.setAttribute('animation', 'property: position; from: 0 0.75 0; to: 0.7 1.05 0.4; dur: 2500; loop: true; easing: easeOutQuad');
      marker.appendChild(text);
    }
  });

  // 물 파티클 (아래에서 올라오는 파란 점)
  for (let i = 0; i < 3; i++) {
    const water = document.createElement('a-sphere');
    const xOff = (i - 1) * 0.1;
    water.setAttribute('radius', '0.02');
    water.setAttribute('color', '#2196F3');
    water.setAttribute('opacity', '0.6');
    water.setAttribute('position', `${xOff} 0 0`);
    water.setAttribute('animation', `property: position; from: ${xOff} -0.1 0; to: ${xOff} 0.3 0; dur: 2000; delay: ${i * 600}; loop: true; easing: easeOutQuad`);
    water.setAttribute('animation__opacity', 'property: opacity; from: 0.8; to: 0; dur: 2000; delay: ' + (i * 600) + '; loop: true; easing: easeOutQuad');
    marker.appendChild(water);
  }

  // 광합성 수식 텍스트
  const formula = document.createElement('a-text');
  formula.setAttribute('value', 'CO2 + H2O → O2 + Sugar');
  formula.setAttribute('position', '0 -0.15 0');
  formula.setAttribute('scale', '0.35 0.35 0.35');
  formula.setAttribute('color', '#1B5E20');
  formula.setAttribute('align', 'center');
  formula.setAttribute('animation', 'property: opacity; from: 0.5; to: 1; dur: 1500; loop: true; dir: alternate; easing: easeInOutSine');
  marker.appendChild(formula);

  scene.appendChild(marker);

  const camera = document.createElement('a-entity');
  camera.setAttribute('camera', '');
  scene.appendChild(camera);

  container.appendChild(scene);

  return scene;
}

function ArView({ onClose }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        setStatus('loading');
        await loadScript(AFRAME_SRC);
        if (cancelled) return;
        await loadScript(ARJS_SRC);
        if (cancelled) return;

        setStatus('ready');
        sceneRef.current = buildScene(containerRef.current);
      } catch (err) {
        if (!cancelled) {
          setStatus('error');
        }
      }
    }

    init();

    return () => {
      cancelled = true;
      if (sceneRef.current) {
        sceneRef.current.remove();
        sceneRef.current = null;
      }
    };
  }, []);

  return (
    <div className="ar-overlay">
      <div className="ar-top-bar">
        <button className="ar-close-button" onClick={onClose}>
          ✕ 닫기
        </button>
        <span className="ar-title">🔍 광합성 AR</span>
      </div>

      {status === 'loading' && (
        <div className="ar-status-overlay">
          <div className="ar-loading">
            <span className="ar-loading-emoji">📷</span>
            <p>AR을 준비하고 있어요...</p>
            <p className="ar-loading-sub">카메라 권한을 허용해 주세요!</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="ar-status-overlay">
          <div className="ar-error">
            <span className="ar-loading-emoji">😢</span>
            <p>AR을 시작할 수 없어요</p>
            <p className="ar-loading-sub">카메라 권한을 확인하거나<br />다른 브라우저로 시도해 주세요</p>
            <button className="ar-retry-button" onClick={onClose}>돌아가기</button>
          </div>
        </div>
      )}

      {status === 'ready' && (
        <div className="ar-guide">
          <p>📌 Hiro 마커를 카메라에 비춰 보세요!</p>
        </div>
      )}

      <div ref={containerRef} className="ar-container" />
    </div>
  );
}

export default ArView;
