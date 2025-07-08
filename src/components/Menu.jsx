import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const Menu = ({ 
  showMenu, 
  onMenuClick 
}) => {
  const { t } = useTranslation();
  const stations = [
    {
      key: 'home',
      label: t('menu.home'),
      icon: '🏠',
      color: 'from-green-200 to-blue-200',
    },
    {
      key: 'alphabet-intro',
      label: t('menu.alphabet'),
      icon: '🔤',
      color: 'from-yellow-200 to-pink-200',
    },
    {
      key: 'topic',
      label: t('menu.topic'),
      icon: '📚',
      color: 'from-pink-300 to-yellow-200',
    },
    {
      key: 'flipgame',
      label: t('menu.flipgame'),
      icon: '📟',
      color: 'from-blue-200 to-pink-200',
    },
    {
      key: 'puzzlegame',
      label: t('menu.puzzlegame'),
      icon: '🧩',
      color: 'from-yellow-200 to-blue-200',
    },
  ];

  return (
    <div className={`fixed left-0 top-14 w-44 shadow-2xl z-50 flex flex-col pt-3 pb-3 px-2 transition-transform duration-300 ${showMenu ? 'translate-x-0' : '-translate-x-44'}`}
      style={{height: 'calc(100vh - 56px - 32px)', borderTopRightRadius: '2rem', borderBottomRightRadius: '2rem', background: 'linear-gradient(135deg, #e0f7fa 0%, #f3e8ff 100%)', boxShadow: '0 8px 32px 0 rgba(255, 182, 193, 0.25)'}}>
      <div className="flex flex-col gap-3 items-start w-full mt-2">
        {stations.map((station) => (
          <div
            key={station.key}
            className="flex flex-row items-center gap-1 w-full px-4 py-2 text-lg font-semibold justify-start text-left pl-2 transition-all duration-200 rounded-lg hover:bg-green-100 hover:scale-105 hover:shadow-md cursor-pointer"
            style={{fontFamily:'"Baloo 2", Arial, sans-serif'}}
            onClick={() => onMenuClick(station.key)}
          >
            <span className="text-xl">{station.icon}</span>
            <span
              className="text-pink-700 drop-shadow-sm w-0 flex-1 max-w-full overflow-hidden text-sm sm:text-lg"
              style={{
                display: 'inline-block',
                whiteSpace: 'nowrap',
                fontSize: 'clamp(0.40rem, 1.8vw, 1.125rem)',
                lineHeight: 1.1,
                
                overflow: 'hidden',
                // fit toàn bộ chữ nếu có thể
                WebkitTextSizeAdjust: '100%',
                MozTextSizeAdjust: '100%',
                msTextSizeAdjust: '100%',
              }}
            >
              {station.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

Menu.propTypes = {
  showMenu: PropTypes.bool,
  onMenuClick: PropTypes.func.isRequired,
};

export default Menu; 