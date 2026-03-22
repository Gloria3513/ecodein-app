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
    formulaText: 'CO2 + H2O --[sun]--> O2 + Sugar',
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
    formulaText: 'CO2 + H2O --[sun]--> O2 + Sugar',
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
    formulaText: 'CO2 + H2O --[sun]--> O2 + Sugar',
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
    formulaText: 'CO2 + H2O --[sun]--> O2 + Sugar',
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

/* ========== 장식 파티클 ========== */

function addButterflies(wrapper) {
  const colors = ['#FFD54F', '#FF8A65', '#CE93D8', '#81D4FA', '#A5D6A7'];
  const paths = [
    { cx: 0.5, cz: 0.3, ry: 0.7 },
    { cx: -0.4, cz: -0.4, ry: 0.9 },
    { cx: 0.3, cz: -0.5, ry: 0.5 },
  ];
  paths.forEach((p, i) => {
    const color = colors[i % colors.length];
    const butterfly = addEl(wrapper, 'a-entity', {
      position: `${p.cx} ${p.ry} ${p.cz}`,
      animation: `property: position; from: ${p.cx} ${p.ry} ${p.cz}; to: ${-p.cx} ${p.ry + 0.2} ${-p.cz}; dur: ${4000 + i * 1000}; loop: true; dir: alternate; easing: easeInOutSine`,
      animation__rot: `property: rotation; from: 0 0 0; to: 0 360 0; dur: ${6000 + i * 500}; loop: true; easing: linear`,
    });
    // 날개 2개 (좌우)
    addEl(butterfly, 'a-triangle', {
      'vertex-a': '0 0.02 0', 'vertex-b': '-0.06 -0.02 0', 'vertex-c': '-0.03 0.04 0',
      color, opacity: '0.8',
      animation: `property: rotation; from: 0 0 -20; to: 0 0 20; dur: 300; loop: true; dir: alternate; easing: easeInOutSine`,
    });
    addEl(butterfly, 'a-triangle', {
      'vertex-a': '0 0.02 0', 'vertex-b': '0.06 -0.02 0', 'vertex-c': '0.03 0.04 0',
      color, opacity: '0.8',
      animation: `property: rotation; from: 0 0 20; to: 0 0 -20; dur: 300; loop: true; dir: alternate; easing: easeInOutSine`,
    });
    // 몸통
    addEl(butterfly, 'a-sphere', { radius: '0.008', color: '#5D4037', position: '0 0.02 0' });
  });
}

function addSparkles(wrapper) {
  const sparkleColors = ['#FFEB3B', '#FFF176', '#FFFFFF', '#E1F5FE', '#C8E6C9'];
  for (let i = 0; i < 15; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.2 + Math.random() * 0.5;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = 0.2 + Math.random() * 0.8;
    const color = sparkleColors[i % sparkleColors.length];
    const dur = 1500 + Math.random() * 2000;
    addEl(wrapper, 'a-sphere', {
      radius: '0.012',
      color,
      opacity: '0',
      position: `${x} ${y} ${z}`,
      animation: `property: opacity; from: 0; to: 0.9; dur: ${dur}; delay: ${i * 200}; loop: true; dir: alternate; easing: easeInOutSine`,
      animation__scale: `property: scale; from: 0.5 0.5 0.5; to: 1.5 1.5 1.5; dur: ${dur}; delay: ${i * 200}; loop: true; dir: alternate; easing: easeInOutSine`,
    });
  }
}

function addRainbow(wrapper) {
  const rainbowColors = ['#F44336', '#FF9800', '#FFEB3B', '#4CAF50', '#2196F3', '#3F51B5', '#9C27B0'];
  rainbowColors.forEach((color, i) => {
    const r = 0.45 - i * 0.02;
    addEl(wrapper, 'a-torus', {
      position: '0 0.6 -0.3',
      rotation: '0 0 0',
      radius: r,
      'radius-tubular': '0.008',
      color,
      opacity: '0.5',
      'theta-length': '180',
      animation: `property: opacity; from: 0.3; to: 0.7; dur: 3000; delay: ${i * 100}; loop: true; dir: alternate; easing: easeInOutSine`,
    });
  });
}

function addFloatingPetals(wrapper) {
  const petalColors = ['#FFCDD2', '#F8BBD0', '#E1BEE7', '#FFF9C4', '#DCEDC8'];
  for (let i = 0; i < 8; i++) {
    const x = (Math.random() - 0.5) * 1.2;
    const z = (Math.random() - 0.5) * 1.2;
    const yStart = 1.2 + Math.random() * 0.5;
    const yEnd = -0.1;
    const color = petalColors[i % petalColors.length];
    const dur = 5000 + Math.random() * 4000;
    addEl(wrapper, 'a-sphere', {
      radius: '0.015',
      color,
      opacity: '0.7',
      position: `${x} ${yStart} ${z}`,
      animation: `property: position; from: ${x} ${yStart} ${z}; to: ${x + (Math.random() - 0.5) * 0.3} ${yEnd} ${z + (Math.random() - 0.5) * 0.3}; dur: ${dur}; delay: ${i * 600}; loop: true; easing: easeInOutSine`,
      animation__rot: `property: rotation; from: 0 0 0; to: ${Math.random() * 360} ${Math.random() * 360} ${Math.random() * 360}; dur: ${dur}; delay: ${i * 600}; loop: true; easing: linear`,
      animation__opacity: `property: opacity; from: 0.8; to: 0; dur: ${dur}; delay: ${i * 600}; loop: true; easing: easeInQuad`,
    });
  }
}

function addGlowRing(wrapper, y, color, dur) {
  addEl(wrapper, 'a-torus', {
    position: `0 ${y} 0`,
    rotation: '90 0 0',
    radius: '0.2',
    'radius-tubular': '0.005',
    color,
    opacity: '0.4',
    animation: `property: scale; from: 0.5 0.5 0.5; to: 2.5 2.5 2.5; dur: ${dur}; loop: true; easing: easeOutQuad`,
    animation__opacity: `property: opacity; from: 0.6; to: 0; dur: ${dur}; loop: true; easing: easeOutQuad`,
  });
}

function addMushroomsAndFlowers(wrapper) {
  const groundDeco = [
    { pos: '0.35 0.04 0.2', type: 'mushroom', color: '#F44336', dotColor: '#FFF' },
    { pos: '-0.4 0.04 -0.15', type: 'mushroom', color: '#FF9800', dotColor: '#FFF' },
    { pos: '0.25 0.04 -0.35', type: 'flower', colors: ['#E91E63', '#FCE4EC'] },
    { pos: '-0.3 0.04 0.35', type: 'flower', colors: ['#9C27B0', '#F3E5F5'] },
    { pos: '0.42 0.04 -0.1', type: 'flower', colors: ['#2196F3', '#E3F2FD'] },
  ];
  groundDeco.forEach((d) => {
    if (d.type === 'mushroom') {
      // 버섯 줄기
      addEl(wrapper, 'a-cylinder', {
        position: d.pos,
        radius: '0.015', height: '0.04', color: '#FFF9C4',
      });
      // 버섯 갓
      addEl(wrapper, 'a-sphere', {
        position: d.pos.replace(/([\d.-]+) ([\d.-]+) ([\d.-]+)/, (_, x, y, z) => `${x} ${parseFloat(y) + 0.03} ${z}`),
        radius: '0.03', color: d.color,
        animation: `property: scale; from: 1 1 1; to: 1.1 0.9 1.1; dur: 2000; loop: true; dir: alternate; easing: easeInOutSine`,
      });
    } else {
      // 작은 꽃
      for (let p = 0; p < 5; p++) {
        const a = (p * 72) * Math.PI / 180;
        const r = 0.02;
        const basePos = d.pos.split(' ').map(Number);
        addEl(wrapper, 'a-sphere', {
          position: `${basePos[0] + Math.cos(a) * r} ${basePos[1] + 0.01} ${basePos[2] + Math.sin(a) * r}`,
          radius: '0.01', color: d.colors[0], opacity: '0.9',
        });
      }
      addEl(wrapper, 'a-sphere', {
        position: d.pos.replace(/([\d.-]+) ([\d.-]+) ([\d.-]+)/, (_, x, y, z) => `${x} ${parseFloat(y) + 0.01} ${z}`),
        radius: '0.008', color: d.colors[1],
      });
    }
  });
}

/* ========== 광합성 파티클 (개선) ========== */

function addParticles(wrapper) {
  // 햇빛 (더 많고 다양한 크기)
  const sunRays = [
    { from: '-0.3 1.5 0', to: '-0.05 0.7 0' },
    { from: '0 1.6 0', to: '0 0.75 0' },
    { from: '0.3 1.5 0', to: '0.05 0.7 0' },
    { from: '-0.15 1.55 0.2', to: '0 0.72 0.05' },
    { from: '0.2 1.45 -0.15', to: '0.03 0.68 -0.03' },
  ];
  sunRays.forEach((ray, i) => {
    const size = 0.02 + Math.random() * 0.015;
    addEl(wrapper, 'a-sphere', {
      radius: String(size), color: '#FFD600', opacity: '0.8', position: ray.from,
      animation: `property: position; from: ${ray.from}; to: ${ray.to}; dur: ${1800 + i * 200}; delay: ${i * 250}; loop: true; easing: easeInOutSine`,
      animation__opacity: `property: opacity; from: 0.9; to: 0.1; dur: ${1800 + i * 200}; delay: ${i * 250}; loop: true; easing: easeInOutSine`,
      animation__scale: `property: scale; from: 1 1 1; to: 0.3 0.3 0.3; dur: ${1800 + i * 200}; delay: ${i * 250}; loop: true; easing: easeInOutSine`,
    });
  });

  // 태양 빛줄기 효과 (상단)
  addEl(wrapper, 'a-sphere', {
    radius: '0.12', color: '#FFD600', opacity: '0.3', position: '0 1.6 0',
    animation: `property: scale; from: 1 1 1; to: 1.5 1.5 1.5; dur: 2000; loop: true; dir: alternate; easing: easeInOutSine`,
    animation__opacity: `property: opacity; from: 0.4; to: 0.15; dur: 2000; loop: true; dir: alternate; easing: easeInOutSine`,
  });

  // CO₂ (회색 → 식물로 흡수)
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
  });
  addEl(wrapper, 'a-text', {
    value: 'CO2', position: '-0.8 0.45 0.3', scale: '0.5 0.5 0.5', color: '#546E7A', align: 'center',
    animation: `property: position; from: -0.8 0.45 0.3; to: -0.1 0.65 0.05; dur: 3000; loop: true; easing: easeInOutQuad`,
    animation__opacity: `property: opacity; from: 1; to: 0; dur: 3000; loop: true; easing: easeInQuad`,
  });

  // O₂ (식물에서 나오는 파란 산소 방울 — 더 많고 활발)
  const o2 = [
    { from: '0 0.6 0', to: '0.7 1.1 0.4' },
    { from: '0 0.55 0', to: '-0.6 1.0 -0.3' },
    { from: '0 0.5 0', to: '0.5 1.2 -0.5' },
    { from: '0 0.58 0', to: '-0.7 1.1 0.4' },
    { from: '0.05 0.62 0.05', to: '0.4 1.3 0.3' },
    { from: '-0.05 0.52 -0.05', to: '-0.5 1.2 -0.4' },
  ];
  o2.forEach((p, i) => {
    addEl(wrapper, 'a-sphere', {
      radius: '0.022', color: '#4FC3F7', opacity: '0.8', position: p.from,
      animation: `property: position; from: ${p.from}; to: ${p.to}; dur: ${2200 + i * 200}; delay: ${i * 350}; loop: true; easing: easeOutQuad`,
      animation__scale: `property: scale; from: 0.5 0.5 0.5; to: 1.5 1.5 1.5; dur: ${2200 + i * 200}; delay: ${i * 350}; loop: true; easing: easeOutQuad`,
      animation__opacity: `property: opacity; from: 0.9; to: 0; dur: ${2200 + i * 200}; delay: ${i * 350}; loop: true; easing: easeOutQuad`,
    });
  });
  addEl(wrapper, 'a-text', {
    value: 'O2', position: '0 0.75 0', scale: '0.5 0.5 0.5', color: '#0288D1', align: 'center',
    animation: `property: position; from: 0 0.75 0; to: 0.7 1.15 0.4; dur: 2500; loop: true; easing: easeOutQuad`,
    animation__opacity: `property: opacity; from: 1; to: 0; dur: 2500; loop: true; easing: easeOutQuad`,
  });

  // 물 (뿌리에서 위로 — 물방울 트레일)
  for (let i = 0; i < 5; i++) {
    const xOff = (Math.random() - 0.5) * 0.15;
    const zOff = (Math.random() - 0.5) * 0.1;
    addEl(wrapper, 'a-sphere', {
      radius: '0.018', color: '#2196F3', opacity: '0.6', position: `${xOff} -0.05 ${zOff}`,
      animation: `property: position; from: ${xOff} -0.1 ${zOff}; to: ${xOff * 0.5} 0.4 ${zOff * 0.5}; dur: ${2200 + i * 300}; delay: ${i * 500}; loop: true; easing: easeOutCubic`,
      animation__opacity: `property: opacity; from: 0.8; to: 0; dur: ${2200 + i * 300}; delay: ${i * 500}; loop: true; easing: easeOutCubic`,
      animation__scale: `property: scale; from: 1 1 1; to: 0.3 0.3 0.3; dur: ${2200 + i * 300}; delay: ${i * 500}; loop: true; easing: easeOutCubic`,
    });
  }
  addEl(wrapper, 'a-text', {
    value: 'H2O', position: '0 -0.05 0.15', scale: '0.35 0.35 0.35', color: '#1565C0', align: 'center',
    animation: `property: position; from: 0 -0.05 0.15; to: 0 0.3 0.1; dur: 2500; loop: true; easing: easeOutCubic`,
    animation__opacity: `property: opacity; from: 1; to: 0; dur: 2500; loop: true; easing: easeOutCubic`,
  });

  // 광합성 글로우 링 (주기적으로 퍼지는 빛 고리)
  addGlowRing(wrapper, 0.5, '#4CAF50', 3000);
  addGlowRing(wrapper, 0.55, '#8BC34A', 3500);
}

/* ========== 식물별 3D 모델 (개선) ========== */

function buildSunflower(wrapper, cfg) {
  // 줄기 (굽이치는 느낌)
  addEl(wrapper, 'a-cylinder', {
    position: '0 0.4 0', radius: cfg.stemRadius, height: cfg.stemHeight, color: cfg.stemColor,
    animation: `property: rotation; from: 0 0 -1; to: 0 0 1; dur: 3000; loop: true; dir: alternate; easing: easeInOutSine`,
  });
  // 잎사귀 (흔들림)
  cfg.leaves.forEach((leaf, i) => {
    addEl(wrapper, 'a-box', {
      position: leaf.pos, rotation: leaf.rot, width: leaf.w, height: '0.02', depth: leaf.d, color: leaf.color, opacity: '0.9',
      animation: `property: rotation; from: ${leaf.rot}; to: ${leaf.rot.replace(/-?\d+$/, (m) => parseInt(m) + 5)}; dur: ${2000 + i * 300}; loop: true; dir: alternate; easing: easeInOutSine`,
    });
  });
  // 꽃 중심 (회전)
  addEl(wrapper, 'a-sphere', {
    position: `0 ${cfg.flowerY} 0`, radius: cfg.flowerRadius, color: cfg.flowerColor,
    animation: `property: rotation; from: 0 0 0; to: 0 360 0; dur: 10000; loop: true; easing: linear`,
  });
  // 꽃잎 (숨쉬듯 퍼짐)
  for (let i = 0; i < cfg.petalCount; i++) {
    const angle = (i * (360 / cfg.petalCount)) * Math.PI / 180;
    const x = Math.cos(angle) * cfg.petalDistance;
    const z = Math.sin(angle) * cfg.petalDistance;
    const xFar = Math.cos(angle) * (cfg.petalDistance + 0.02);
    const zFar = Math.sin(angle) * (cfg.petalDistance + 0.02);
    addEl(wrapper, 'a-sphere', {
      position: `${x} ${cfg.flowerY} ${z}`, radius: cfg.petalRadius, color: cfg.petalColor,
      animation: `property: position; from: ${x} ${cfg.flowerY} ${z}; to: ${xFar} ${cfg.flowerY} ${zFar}; dur: 2000; delay: ${i * 100}; loop: true; dir: alternate; easing: easeInOutSine`,
    });
  }
  // 꽃 주변 빛나는 점들
  for (let i = 0; i < 6; i++) {
    const a = (i * 60) * Math.PI / 180;
    const r = 0.2;
    addEl(wrapper, 'a-sphere', {
      position: `${Math.cos(a) * r} ${cfg.flowerY + 0.05} ${Math.sin(a) * r}`,
      radius: '0.01', color: '#FFF176', opacity: '0',
      animation: `property: opacity; from: 0; to: 0.8; dur: 1200; delay: ${i * 200}; loop: true; dir: alternate; easing: easeInOutSine`,
    });
  }
}

function buildTomato(wrapper, cfg) {
  addEl(wrapper, 'a-cylinder', {
    position: '0 0.3 0', radius: cfg.stemRadius, height: cfg.stemHeight, color: cfg.stemColor,
    animation: `property: rotation; from: 0 0 -1; to: 0 0 1; dur: 2500; loop: true; dir: alternate; easing: easeInOutSine`,
  });
  cfg.leaves.forEach((leaf, i) => {
    addEl(wrapper, 'a-box', {
      position: leaf.pos, rotation: leaf.rot, width: leaf.w, height: '0.02', depth: leaf.d, color: leaf.color, opacity: '0.9',
      animation: `property: rotation; from: ${leaf.rot}; to: ${leaf.rot.replace(/-?\d+$/, (m) => parseInt(m) + 4)}; dur: ${2200 + i * 200}; loop: true; dir: alternate; easing: easeInOutSine`,
    });
  });
  // 열매 (통통 튀는 느낌 + 반짝)
  cfg.fruits.forEach((fruit, i) => {
    const baseY = parseFloat(fruit.pos.split(' ')[1]);
    addEl(wrapper, 'a-sphere', {
      position: fruit.pos, radius: fruit.r, color: fruit.color,
      animation: `property: position; from: ${fruit.pos}; to: ${fruit.pos.replace(/([\d.-]+) ([\d.-]+) ([\d.-]+)/, (_, x, y, z) => `${x} ${baseY + 0.03} ${z}`)}; dur: ${1200 + i * 200}; delay: ${i * 300}; loop: true; dir: alternate; easing: easeInOutSine`,
      animation__scale: `property: scale; from: 1 1 1; to: 1.15 1.15 1.15; dur: ${1200 + i * 200}; delay: ${i * 300}; loop: true; dir: alternate; easing: easeInOutSine`,
    });
    // 열매 광택
    addEl(wrapper, 'a-sphere', {
      position: fruit.pos.replace(/([\d.-]+) ([\d.-]+) ([\d.-]+)/, (_, x, y, z) => `${parseFloat(x) + 0.01} ${parseFloat(y) + 0.01} ${parseFloat(z) + 0.01}`),
      radius: String(fruit.r * 0.3), color: '#FFFFFF', opacity: '0.5',
    });
  });
  // 작은 노란 꽃 (토마토 꽃)
  addEl(wrapper, 'a-sphere', {
    position: '0.06 0.58 0.02', radius: '0.015', color: '#FFEB3B',
    animation: `property: scale; from: 0.8 0.8 0.8; to: 1.2 1.2 1.2; dur: 1500; loop: true; dir: alternate; easing: easeInOutSine`,
  });
}

function buildCactus(wrapper, cfg) {
  // 몸통 (미세하게 숨쉬듯)
  addEl(wrapper, 'a-cylinder', {
    position: '0 0.25 0', radius: cfg.bodyRadius, height: cfg.bodyHeight, color: cfg.bodyColor,
    animation: `property: scale; from: 1 1 1; to: 1.02 1.01 1.02; dur: 3000; loop: true; dir: alternate; easing: easeInOutSine`,
  });
  cfg.arms.forEach((arm) => {
    addEl(wrapper, 'a-cylinder', {
      position: arm.pos, rotation: arm.rot, radius: arm.r, height: arm.h, color: arm.color,
      animation: `property: rotation; from: ${arm.rot}; to: ${arm.rot.replace(/-?\d+$/, (m) => parseInt(m) + 3)}; dur: 4000; loop: true; dir: alternate; easing: easeInOutSine`,
    });
  });
  // 가시 (반짝)
  for (let i = 0; i < cfg.spines; i++) {
    const angle = (i * (360 / cfg.spines)) * Math.PI / 180;
    const x = Math.cos(angle) * (cfg.bodyRadius + 0.02);
    const z = Math.sin(angle) * (cfg.bodyRadius + 0.02);
    const y = 0.15 + (i % 3) * 0.12;
    addEl(wrapper, 'a-cone', {
      position: `${x} ${y} ${z}`,
      rotation: `0 0 ${(-angle * 180 / Math.PI) + 90}`,
      'radius-bottom': '0.008', 'radius-top': '0', height: '0.06', color: '#FDD835',
      animation: `property: opacity; from: 0.7; to: 1; dur: ${800 + i * 100}; loop: true; dir: alternate; easing: easeInOutSine`,
    });
  }
  // 꽃 (펼쳐지는 느낌)
  addEl(wrapper, 'a-sphere', {
    position: `0 ${cfg.flowerY} 0`, radius: '0.06', color: cfg.flowerColor,
    animation: `property: scale; from: 0.9 0.9 0.9; to: 1.2 1.2 1.2; dur: 2000; loop: true; dir: alternate; easing: easeInOutSine`,
  });
  for (let i = 0; i < 5; i++) {
    const a = (i * 72) * Math.PI / 180;
    const dist = 0.07;
    const distFar = 0.09;
    addEl(wrapper, 'a-sphere', {
      position: `${Math.cos(a) * dist} ${cfg.flowerY + 0.02} ${Math.sin(a) * dist}`,
      radius: '0.025', color: '#F48FB1',
      animation: `property: position; from: ${Math.cos(a) * dist} ${cfg.flowerY + 0.02} ${Math.sin(a) * dist}; to: ${Math.cos(a) * distFar} ${cfg.flowerY + 0.03} ${Math.sin(a) * distFar}; dur: 2000; delay: ${i * 150}; loop: true; dir: alternate; easing: easeInOutSine`,
    });
  }
  // 사막 먼지 파티클
  for (let i = 0; i < 4; i++) {
    const x = (Math.random() - 0.5) * 0.8;
    const z = (Math.random() - 0.5) * 0.8;
    addEl(wrapper, 'a-sphere', {
      radius: '0.01', color: '#BCAAA4', opacity: '0.3', position: `${x} 0.05 ${z}`,
      animation: `property: position; from: ${x} 0.05 ${z}; to: ${x + 0.3} 0.15 ${z}; dur: ${3000 + i * 500}; delay: ${i * 800}; loop: true; easing: easeOutQuad`,
      animation__opacity: `property: opacity; from: 0.4; to: 0; dur: ${3000 + i * 500}; delay: ${i * 800}; loop: true; easing: easeOutQuad`,
    });
  }
}

function buildTree(wrapper, cfg) {
  addEl(wrapper, 'a-cylinder', { position: '0 0.35 0', radius: cfg.trunkRadius, height: cfg.trunkHeight, color: cfg.trunkColor });
  // 나뭇잎 (각각 다른 속도로 흔들림)
  cfg.foliage.forEach((f, i) => {
    addEl(wrapper, 'a-cone', {
      position: f.pos, 'radius-bottom': f.r, 'radius-top': '0.02', height: String(f.r * 1.2), color: f.color,
      animation: `property: rotation; from: 0 0 -2; to: 0 0 2; dur: ${2000 + i * 500}; loop: true; dir: alternate; easing: easeInOutSine`,
      animation__scale: `property: scale; from: 1 1 1; to: 1.03 1 1.03; dur: ${3000 + i * 300}; loop: true; dir: alternate; easing: easeInOutSine`,
    });
  });
  // 나무 둥치 디테일
  addEl(wrapper, 'a-cylinder', { position: '0 0.05 0', radius: String(cfg.trunkRadius + 0.02), height: '0.1', color: '#4E342E' });
  // 솔방울
  addEl(wrapper, 'a-sphere', {
    position: '0.12 0.65 0.08', radius: '0.025', color: '#795548',
    animation: `property: position; from: 0.12 0.65 0.08; to: 0.12 0.62 0.08; dur: 2000; loop: true; dir: alternate; easing: easeInOutSine`,
  });
  addEl(wrapper, 'a-sphere', {
    position: '-0.08 0.75 -0.06', radius: '0.02', color: '#6D4C41',
    animation: `property: position; from: -0.08 0.75 -0.06; to: -0.08 0.72 -0.06; dur: 2500; loop: true; dir: alternate; easing: easeInOutSine`,
  });
  // 나뭇잎 떨어지는 효과
  for (let i = 0; i < 4; i++) {
    const x = (Math.random() - 0.5) * 0.3;
    const z = (Math.random() - 0.5) * 0.3;
    addEl(wrapper, 'a-sphere', {
      radius: '0.012', color: '#388E3C', opacity: '0.6',
      position: `${x} 1.0 ${z}`,
      animation: `property: position; from: ${x} 1.0 ${z}; to: ${x + (Math.random() - 0.5) * 0.4} 0.05 ${z + (Math.random() - 0.5) * 0.4}; dur: ${4000 + i * 1000}; delay: ${i * 1500}; loop: true; easing: easeInQuad`,
      animation__rot: `property: rotation; from: 0 0 0; to: ${Math.random() * 360} 0 ${Math.random() * 360}; dur: ${4000 + i * 1000}; delay: ${i * 1500}; loop: true; easing: linear`,
      animation__opacity: `property: opacity; from: 0.7; to: 0; dur: ${4000 + i * 1000}; delay: ${i * 1500}; loop: true; easing: easeInQuad`,
    });
  }
}

/* ========== 씬 빌드 ========== */

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

  // 땅 (풀밭 느낌 — 동심원 + 색상 변화)
  addEl(wrapper, 'a-cylinder', { position: '0 0 0', radius: '0.6', height: '0.05', color: cfg.groundColor, opacity: '0.8' });
  addEl(wrapper, 'a-cylinder', { position: '0 0.005 0', radius: '0.45', height: '0.05', color: cfg.groundColor, opacity: '0.5' });
  addEl(wrapper, 'a-cylinder', { position: '0 0.01 0', radius: '0.3', height: '0.05', color: cfg.groundColor, opacity: '0.3' });

  // 땅 위 장식 (버섯, 작은 꽃)
  addMushroomsAndFlowers(wrapper);

  // 식물별 3D 모델
  if (plantId === 'tomato') buildTomato(wrapper, cfg);
  else if (plantId === 'cactus') buildCactus(wrapper, cfg);
  else if (plantId === 'tree') buildTree(wrapper, cfg);
  else buildSunflower(wrapper, cfg);

  // 광합성 파티클 (CO₂, O₂, 햇빛, 물)
  addParticles(wrapper);

  // 장식 효과
  addSparkles(wrapper);
  addButterflies(wrapper);
  addFloatingPetals(wrapper);
  addRainbow(wrapper);

  // 수식 (더 예쁘게)
  addEl(wrapper, 'a-text', {
    value: cfg.formulaText, position: '0 -0.2 0', scale: '0.4 0.4 0.4', color: '#1B5E20', align: 'center',
    animation: `property: opacity; from: 0.4; to: 1; dur: 1500; loop: true; dir: alternate; easing: easeInOutSine`,
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
