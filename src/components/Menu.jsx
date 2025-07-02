import React from 'react';

const Menu = ({ 
  showMenu, 
  onMenuToggle,
  onMenuClick 
}) => {
  const stations = [
    {
      key: 'home',
      label: 'Trang chủ',
      icon: '🏠',
      color: 'from-green-200 to-blue-200',
    },
    {
      key: 'topic',
      label: 'Từ vựng',
      icon: '📚',
      color: 'from-pink-300 to-yellow-200',
    },
    {
      key: 'flipgame',
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

  return (
    <div className={`fixed left-0 top-14 w-44 shadow-2xl z-50 flex flex-col pt-3 pb-3 px-2 transition-transform duration-300 ${showMenu ? 'translate-x-0' : '-translate-x-44'}`}
      style={{height: 'calc(100vh - 56px - 32px)', borderTopRightRadius: '2rem', borderBottomRightRadius: '2rem', background: 'linear-gradient(135deg, #e0f7fa 0%, #f3e8ff 100%)', boxShadow: '0 8px 32px 0 rgba(255, 182, 193, 0.25)'}}>
      <div className="flex flex-col gap-3 items-start w-full mt-2">
        {stations.map((station) => (
          <div
            key={station.key}
            className="flex flex-row items-center gap-3 w-full px-4 py-2 text-lg font-semibold justify-start text-left pl-2 transition-all duration-200 rounded-lg hover:bg-green-100 hover:scale-105 hover:shadow-md cursor-pointer"
            style={{fontFamily:'"Baloo 2", Arial, sans-serif'}}
            onClick={() => onMenuClick(station.key)}
          >
            <span className="text-2xl">{station.icon}</span>
            <span className="text-pink-700 drop-shadow-sm">{station.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu; 