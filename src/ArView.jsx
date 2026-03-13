import { useEffect, useRef, useState } from 'react';

const AFRAME_SRC = 'https://aframe.io/releases/1.4.2/aframe.min.js';
const ARJS_SRC = 'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js';

const PLANT_CONFIGS = {
  sunflower: {
    name: '해바라기',
    stemColor: '#2E7D32',
    stemHeight: 0.8,
    stemRadius: 0.04,
    leaves: [
      { pos: '0.15 0.5 0', rot: '0 0 -30', color: '#43A047', w: 0.25, d: 0.12 },
      { pos: '-0.15 0.6 0', rot: '0 0 30', color: '#66BB6A', w: 0.25, d: 0.12 },
      { pos: '0 0.55 0.12', rot: '30 0 0', color: '#4CAF50', w: 0.2, d: 0.15 },
      { pos: '0 0.45 -0.12', rot: '-30 0 0', color: '#388E3C', w: 0.2, d: 0.15 },
    ],
    flowerY: 0.85,
    flowerColor: '#FFEB3B',
    flowerRadius: 0.1,
    petalColor: '#FF9800',
    petalCount: 8,
    petalRadius: 0.05,
    petalDistance: 0.13,
    groundColor: '#4CAF50',
    formulaText: 'Sunflower: CO2 + H2O → O2',
  },
  tomato: {
    name: '방울토마토',
    stemColor: '#558B2F',
    stemHeight: 0.6,
    stemRadius: 0.035,
    leaves: [
      { pos: '0.12 0.35 0', rot: '0 0 -25', color: '#7CB342', w: 0.2, d: 0.1 },
      { pos: '-0.12 0.4 0', rot: '0 0 25', color: '#8BC34A', w: 0.2, d: 0.1 },
      { pos: '0.1 0.45 0.08', rot: '20 30 -15', color: '#689F38', w: 0.18, d: 0.09 },
      { pos: '-0.08 0.3 -0.08', rot: '-20 -30 15', color: '#7CB342', w: 0.18, d: 0.09 },
    ],
    fruits: [
      { pos: '0.08 0.55 0.06', color: '#F44336', r: 0.05 },
      { pos: '-0.06 0.5 -0.04', color: '#E53935', r: 0.045 },
      { pos: '0.03 0.48 -0.07', color: '#FF5722', r: 0.04 },
    ],
    groundColor: '#795548',
    formulaText: 'Tomato: CO2 + H2O → O2',
  },
  cactus: {
    name: '선인장',
    bodyColor: '#2E7D32',
    bodyRadius: 0.12,
    bodyHeight: 0.5,
    arms: [
      { pos: '0.15 0.35 0', rot: '0 0 -30', h: 0.25, r: 0.06, color: '#388E3C' },
      { pos: '-0.13 0.28 0', rot: '0 0 25', h: 0.2, r: 0.055, color: '#43A047' },
    ],
    spines: 12,
    flowerY: 0.55,
    flowerColor: '#FF4081',
    groundColor: '#D7CCC8',
    formulaText: 'Cactus: CO2 + H2O → O2',
  },
  tree: {
    name: '소나무',
    trunkColor: '#5D4037',
    trunkHeight: 0.7,
    trunkRadius: 0.06,
    foliage: [
      { pos: '0 0.7 0', r: 0.3, color: '#1B5E20' },
      { pos: '0 0.9 0', r: 0.22, color: '#2E7D32' },
      { pos: '0 1.05 0', r: 0.14, color: '#388E3C' },
    ],
    groundColor: '#4CAF50',
    formulaText: 'Pine: CO2 + H2O → O2',
  },
};

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

function addEl(parent, tag, attrs) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  parent.appendChild(el);
  return el;
}

function addParticles(wrapper) {
  // 햇빛
  const sunRays = [
    { from: '-0.3 1.5 0', to: '-0.05 0.7 0' },
    { from: '0 1.6 0', to: '0 0.75 0' },
    { from: '0.3 1.5 0', to: '0.05 0.7 0' },
  ];
  sunRays.forEach((ray, i) => {
    addEl(wrapper, 'a-sphere', {
      radius: '0.025', color: '#FFD600', opacity: '0.8', position: ray.from,
      animation: `property: position; from: ${ray.from}; to: ${ray.to}; dur: 2000; delay: ${i * 300}; loop: true; easing: easeInOutSine`,
      animation__opacity: `property: opacity; from: 0.9; to: 0.2; dur: 2000; delay: ${i * 300}; loop: true; easing: easeInOutSine`,
    });
  });

  // CO₂
  const co2 = [
    { from: '-0.8 0.3 0.3', to: '-0.1 0.5 0.05' },
    { from: '0.8 0.4 -0.2', to: '0.1 0.55 -0.05' },
    { from: '-0.6 0.5 -0.4', to: '-0.05 0.5 -0.05' },
    { from: '0.7 0.2 0.5', to: '0.05 0.45 0.05' },
  ];
  co2.forEach((p, i) => {
    addEl(wrapper, 'a-sphere', {
      radius: '0.03', color: '#78909C', opacity: '0.7', position: p.from,
      animation: `property: position; from: ${p.from}; to: ${p.to}; dur: 3000; delay: ${i * 500}; loop: true; easing: easeInOutQuad`,
      animation__scale: `property: scale; from: 1 1 1; to: 0.3 0.3 0.3; dur: 3000; delay: ${i * 500}; loop: true; easing: easeInOutQuad`,
    });
    if (i === 0) {
      addEl(wrapper, 'a-text', {
        value: 'CO2', position: '-0.8 0.45 0.3', scale: '0.4 0.4 0.4', color: '#546E7A', align: 'center',
        animation: `property: position; from: -0.8 0.45 0.3; to: -0.1 0.65 0.05; dur: 3000; loop: true; easing: easeInOutQuad`,
      });
    }
  });

  // O₂
  const o2 = [
    { from: '0 0.6 0', to: '0.7 0.9 0.4' },
    { from: '0 0.55 0', to: '-0.6 0.85 -0.3' },
    { from: '0 0.5 0', to: '0.5 1.0 -0.5' },
    { from: '0 0.58 0', to: '-0.7 0.95 0.4' },
  ];
  o2.forEach((p, i) => {
    addEl(wrapper, 'a-sphere', {
      radius: '0.025', color: '#4FC3F7', opacity: '0.8', position: p.from,
      animation: `property: position; from: ${p.from}; to: ${p.to}; dur: 2500; delay: ${i * 400}; loop: true; easing: easeOutQuad`,
      animation__scale: `property: scale; from: 0.5 0.5 0.5; to: 1.2 1.2 1.2; dur: 2500; delay: ${i * 400}; loop: true; easing: easeOutQuad`,
      animation__opacity: `property: opacity; from: 0.9; to: 0.1; dur: 2500; delay: ${i * 400}; loop: true; easing: easeOutQuad`,
    });
    if (i === 0) {
      addEl(wrapper, 'a-text', {
        value: 'O2', position: '0 0.75 0', scale: '0.5 0.5 0.5', color: '#0288D1', align: 'center',
        animation: `property: position; from: 0 0.75 0; to: 0.7 1.05 0.4; dur: 2500; loop: true; easing: easeOutQuad`,
      });
    }
  });

  // 물
  for (let i = 0; i < 3; i++) {
    const xOff = (i - 1) * 0.1;
    addEl(wrapper, 'a-sphere', {
      radius: '0.02', color: '#2196F3', opacity: '0.6', position: `${xOff} 0 0`,
      animation: `property: position; from: ${xOff} -0.1 0; to: ${xOff} 0.3 0; dur: 2000; delay: ${i * 600}; loop: true; easing: easeOutQuad`,
      animation__opacity: `property: opacity; from: 0.8; to: 0; dur: 2000; delay: ${i * 600}; loop: true; easing: easeOutQuad`,
    });
  }
}

function buildSunflower(wrapper, cfg) {
  addEl(wrapper, 'a-cylinder', { position: '0 0.4 0', radius: cfg.stemRadius, height: cfg.stemHeight, color: cfg.stemColor });
  cfg.leaves.forEach((leaf) => {
    addEl(wrapper, 'a-box', { position: leaf.pos, rotation: leaf.rot, width: leaf.w, height: '0.02', depth: leaf.d, color: leaf.color, opacity: '0.9' });
  });
  addEl(wrapper, 'a-sphere', { position: `0 ${cfg.flowerY} 0`, radius: cfg.flowerRadius, color: cfg.flowerColor });
  for (let i = 0; i < cfg.petalCount; i++) {
    const angle = (i * (360 / cfg.petalCount)) * Math.PI / 180;
    const x = Math.cos(angle) * cfg.petalDistance;
    const z = Math.sin(angle) * cfg.petalDistance;
    addEl(wrapper, 'a-sphere', { position: `${x} ${cfg.flowerY} ${z}`, radius: cfg.petalRadius, color: cfg.petalColor });
  }
}

function buildTomato(wrapper, cfg) {
  addEl(wrapper, 'a-cylinder', { position: '0 0.3 0', radius: cfg.stemRadius, height: cfg.stemHeight, color: cfg.stemColor });
  cfg.leaves.forEach((leaf) => {
    addEl(wrapper, 'a-box', { position: leaf.pos, rotation: leaf.rot, width: leaf.w, height: '0.02', depth: leaf.d, color: leaf.color, opacity: '0.9' });
  });
  cfg.fruits.forEach((fruit, i) => {
    addEl(wrapper, 'a-sphere', {
      position: fruit.pos, radius: fruit.r, color: fruit.color,
      animation: `property: position; from: ${fruit.pos}; to: ${fruit.pos.replace(/[\d.]+$/, (m) => parseFloat(m) + 0.02)}; dur: 1500; delay: ${i * 300}; loop: true; dir: alternate; easing: easeInOutSine`,
    });
  });
}

function buildCactus(wrapper, cfg) {
  addEl(wrapper, 'a-cylinder', { position: '0 0.25 0', radius: cfg.bodyRadius, height: cfg.bodyHeight, color: cfg.bodyColor });
  cfg.arms.forEach((arm) => {
    addEl(wrapper, 'a-cylinder', { position: arm.pos, rotation: arm.rot, radius: arm.r, height: arm.h, color: arm.color });
  });
  // 가시
  for (let i = 0; i < cfg.spines; i++) {
    const angle = (i * (360 / cfg.spines)) * Math.PI / 180;
    const x = Math.cos(angle) * (cfg.bodyRadius + 0.02);
    const z = Math.sin(angle) * (cfg.bodyRadius + 0.02);
    const y = 0.15 + (i % 3) * 0.12;
    addEl(wrapper, 'a-cone', {
      position: `${x} ${y} ${z}`,
      rotation: `0 0 ${(-angle * 180 / Math.PI) + 90}`,
      'radius-bottom': '0.008', 'radius-top': '0', height: '0.06', color: '#FDD835',
    });
  }
  addEl(wrapper, 'a-sphere', { position: `0 ${cfg.flowerY} 0`, radius: '0.06', color: cfg.flowerColor });
  for (let i = 0; i < 5; i++) {
    const a = (i * 72) * Math.PI / 180;
    addEl(wrapper, 'a-sphere', {
      position: `${Math.cos(a) * 0.07} ${cfg.flowerY + 0.02} ${Math.sin(a) * 0.07}`,
      radius: '0.025', color: '#F48FB1',
    });
  }
}

function buildTree(wrapper, cfg) {
  addEl(wrapper, 'a-cylinder', { position: '0 0.35 0', radius: cfg.trunkRadius, height: cfg.trunkHeight, color: cfg.trunkColor });
  cfg.foliage.forEach((f) => {
    addEl(wrapper, 'a-cone', {
      position: f.pos, 'radius-bottom': f.r, 'radius-top': '0.02', height: String(f.r * 1.2), color: f.color,
      animation: `property: rotation; from: 0 0 0; to: 0 360 0; dur: 20000; loop: true; easing: linear`,
    });
  });
  // 나무 둥치 디테일
  addEl(wrapper, 'a-cylinder', { position: '0 0.05 0', radius: String(cfg.trunkRadius + 0.02), height: '0.1', color: '#4E342E' });
}

function buildScene(container, plantId) {
  const cfg = PLANT_CONFIGS[plantId] || PLANT_CONFIGS.sunflower;

  const scene = document.createElement('a-scene');
  scene.setAttribute('embedded', '');
  scene.setAttribute('arjs', 'sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;');
  scene.setAttribute('vr-mode-ui', 'enabled: false');
  scene.setAttribute('renderer', 'logarithmicDepthBuffer: true; antialias: true;');

  const marker = document.createElement('a-marker');
  marker.setAttribute('preset', 'hiro');
  marker.setAttribute('smooth', 'true');
  marker.setAttribute('smoothCount', '5');

  const wrapper = document.createElement('a-entity');
  wrapper.setAttribute('scale', '3 3 3');

  // 땅
  addEl(wrapper, 'a-cylinder', { position: '0 0 0', radius: '0.6', height: '0.05', color: cfg.groundColor, opacity: '0.8' });

  // 식물별 3D 모델
  if (plantId === 'tomato') buildTomato(wrapper, cfg);
  else if (plantId === 'cactus') buildCactus(wrapper, cfg);
  else if (plantId === 'tree') buildTree(wrapper, cfg);
  else buildSunflower(wrapper, cfg);

  // 공통 파티클
  addParticles(wrapper);

  // 수식
  addEl(wrapper, 'a-text', {
    value: cfg.formulaText, position: '0 -0.15 0', scale: '0.35 0.35 0.35', color: '#1B5E20', align: 'center',
    animation: `property: opacity; from: 0.5; to: 1; dur: 1500; loop: true; dir: alternate; easing: easeInOutSine`,
  });

  marker.appendChild(wrapper);
  scene.appendChild(marker);
  addEl(scene, 'a-entity', { camera: '' });
  container.appendChild(scene);
  return scene;
}

function ArView({ onClose, plantId }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const [status, setStatus] = useState('loading');

  const plantName = PLANT_CONFIGS[plantId]?.name || '식물';

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
        sceneRef.current = buildScene(containerRef.current, plantId);
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
  }, [plantId]);

  return (
    <div className="ar-overlay">
      <div className="ar-top-bar">
        <button className="ar-close-button" onClick={onClose}>
          ✕ 닫기
        </button>
        <span className="ar-title">🔍 {plantName} 광합성 AR</span>
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
          <p>📌 Hiro 마커를 비추면 {plantName}이 나타나요!</p>
          <a
            className="ar-marker-link"
            href="/hiro-marker.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            📄 마커 열기
          </a>
        </div>
      )}

      <div ref={containerRef} className="ar-container" />
    </div>
  );
}

export default ArView;
