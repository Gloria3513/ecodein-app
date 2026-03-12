import { useState } from 'react';
import './App.css';
import Home from './Home';
import Grow from './Grow';
import Learn from './Learn';
import CarbonCalculator from './CarbonCalculator';
import ArView from './ArView';

const TABS = [
  { id: 'home', label: '홈', icon: '🏠' },
  { id: 'grow', label: '키우기', icon: '🌱' },
  { id: 'learn', label: '배우기', icon: '📚' },
  { id: 'calculator', label: '탄소계산기', icon: '🧮' },
];

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showAr, setShowAr] = useState(false);

  if (showAr) {
    return <ArView onClose={() => setShowAr(false)} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-logo">🌍</span>
        <h1 className="app-title">에코드인</h1>
        <span className="app-subtitle">지구를 지키는 작은 영웅</span>
      </header>

      <main className="app-main">
        {activeTab === 'home' && <Home />}
        {activeTab === 'grow' && <Grow onOpenAr={() => setShowAr(true)} />}
        {activeTab === 'learn' && <Learn />}
        {activeTab === 'calculator' && <CarbonCalculator />}
      </main>

      <nav className="tab-bar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'tab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
