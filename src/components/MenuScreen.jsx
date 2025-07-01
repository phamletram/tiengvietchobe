// components/MenuScreen.js
import React, { useRef, useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import PageCounter from './PageCounter.jsx';
import PropTypes from 'prop-types';

const stations = [
  {
    key: 'topic',
    label: 'Từ vựng',
    icon: '📚',
    color: 'from-pink-300 to-yellow-200',
  },
  {
    key: 'game',
    label: 'Lật thẻ',
    icon: '📟',
    color: 'from-blue-200 to-pink-200',
  },
  {
    key: 'puzzlegame',
    label: 'Xếp chữ',
    icon: '🧩',
    color: 'from-yellow-200 to-blue-200',
  },
  {
    key: 'alphabet',
    label: 'Chữ cái',
    icon: '🔤',
    color: 'from-blue-200 to-pink-200',
  },
  {
    key: 'writing',
    label: 'Tập viết',
    icon: '✍️',
    color: 'from-pink-200 to-blue-200',
  },
];

const MenuScreen = ({ score, setGameState }) => {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const [positions, setPositions] = useState([]);
  const [svgSize, setSvgSize] = useState({ width: 400, height: 400 });

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const btnSize = isMobile ? 110 : 160;
  const margin = 40 + btnSize/2;

  // Responsive: cập nhật kích thước SVG khi resize
  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        // Đảm bảo svgSize.height không vượt quá 60% viewport để tổng thể không vượt 100vh
        const vh = window.innerHeight;
        const h = window.innerWidth < 640 ? Math.min(500, vh*0.6) : Math.min(700, vh*0.6);
        setSvgSize({ width: w, height: h });
      }
    }
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Tạo 5 điểm zigzag cách đều nhau, left luân phiên sát trái/phải
  const n = stations.length;
  const points = Array.from({length: n}).map((_, i) => {
    const availableHeight = svgSize.height - 2.5*btnSize;
    let top, left;
    if (i === 0) {
      // Trạm đầu tiên sát trái hơn, lên cao hơn
      top = btnSize * 0.2;
      left = margin * 1;
    } else if (i === 1) {
      // Trạm thứ 2 sát phải hơn, lên cao hơn
      top = btnSize * 0.6;
      left = svgSize.width - margin *1;
    } else if (i === 2) {
      // Trạm thứ 3 lên cao hơn, về trái hơn
      top = btnSize * 1.6;
      left = margin * 1;
    } else if (i === n-1) {
      // Trạm cuối ở giữa dưới
      top = btnSize*2.5 + (n-1) * (availableHeight) / (n-1);
      left = margin * 1;
    } else {
      // Các trạm giữa zigzag
      top = btnSize*1.7 + i * (availableHeight) / (n-1);
      left = svgSize.width - margin *1;
    }
    return { left, top };
  });
  // Đặt trạm đúng vào các điểm này
  useEffect(() => {
    setPositions(points);
  }, [svgSize, isMobile]);
  // Vẽ path đi qua các điểm này (zigzag mạnh)
  const pathD = points.reduce((acc, pt, i) => {
    return acc + (i === 0 ? `M ${pt.left} ${pt.top}` : ` L ${pt.left} ${pt.top}`);
  }, '');

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-yellow-200 via-pink-200 to-blue-200 font-inter relative overflow-x-hidden ${!isMobile ? 'overflow-y-hidden' : ''}`}
      style={{height: '100vh', maxHeight: '100vh'}}>
      <div ref={containerRef} className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <div className="absolute top-0 left-0 w-full flex flex-col items-center pt-2 z-20">
          <h1 className="text-4xl md:text-5xl font-extrabold text-pink-600 mb-1 drop-shadow-lg leading-tight" style={{fontFamily:'"Baloo 2", Arial, sans-serif'}}>
            Học Tiếng Việt
          </h1>
          <p className="text-lg md:text-xl text-blue-600 drop-shadow-md opacity-90 font-semibold mb-1" style={{fontFamily:'"Baloo 2", Arial, sans-serif'}}>Vui học mỗi ngày!</p>
        </div>
        <div className="relative w-full flex flex-col items-center" style={{height: svgSize.height, minHeight: svgSize.height, maxHeight: svgSize.height}}>
          {/* SVG đường đi */}
          <svg viewBox={`0 0 ${svgSize.width} ${svgSize.height}`} width="100%" height={svgSize.height} className="absolute left-1/2 top-0 -translate-x-1/2 z-0 select-none pointer-events-none">
            <path ref={pathRef} d={pathD} stroke="#fbbf24" strokeWidth={isMobile ? 8 : 12} fill="none" strokeLinecap="round" strokeDasharray="16 16" />
          </svg>
          {/* Các trạm trên đường */}
          {positions.length === stations.length && stations.map((station, idx) => (
            <button
              key={station.key}
              onClick={() => setGameState(station.key)}
              className={`group absolute z-10 flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-pink-300 active:scale-95 shadow-xl bg-gradient-to-br ${station.color} rounded-full border-4 border-white`}
              style={{ left: positions[idx].left-btnSize/2, top: positions[idx].top-btnSize/2, width: btnSize, height: btnSize }}
              title={station.label}
            >
              <span className={`mb-1 group-hover:animate-wiggle ${isMobile ? 'text-3xl' : 'text-5xl md:text-6xl'}`}>{station.icon}</span>
              <span className={`font-bold text-pink-700 ${isMobile ? 'text-base' : 'text-lg md:text-xl'}`} style={{fontFamily:'"Baloo 2", Arial, sans-serif'}}>{station.label}</span>
            </button>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 w-full flex items-center justify-center gap-6 pb-2 z-20">
          <div className="flex items-center bg-white bg-opacity-30 rounded-full px-5 py-2 shadow-md">
            <Trophy className="w-6 h-6 mr-2 text-yellow-300" />
            <span className="text-xl font-semibold text-yellow-700" style={{fontFamily:'"Baloo 2", Arial, sans-serif'}}>Điểm: {score}</span>
          </div>
          <div className="flex items-center">
            <PageCounter />
          </div>
        </div>
      </div>
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
        }
        .animate-bounce-slow { animation: bounce-slow 2.2s infinite; }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-8deg); }
          20% { transform: rotate(8deg); }
          40% { transform: rotate(-6deg); }
          60% { transform: rotate(6deg); }
          80% { transform: rotate(-4deg); }
        }
        .group-hover\\:animate-wiggle:hover { animation: wiggle 0.7s ease-in-out; }
      `}</style>
    </div>
  );
};

MenuScreen.propTypes = {
  score: PropTypes.number,
  setGameState: PropTypes.func.isRequired,
};

export default MenuScreen;