import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import type { Anchor } from '@/hooks/useAnchor'
interface AnchorNavProps {
  anchorList: Anchor[];
}
const AnchorNav: React.FC<AnchorNavProps> = ({ anchorList }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 处理锚点点击
  const handleAnchorClick = (e: React.MouseEvent, value: string) => {
    e.preventDefault();
    navigate(`${location.pathname}#${value}`);
    const target = document.getElementById(value);
    target?.scrollIntoView({ behavior: 'smooth' });
  };

  // 高亮当前锚点
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    const element = document.getElementById(hash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.hash]);

  return (
    <div style={{
      position: 'fixed',
      right: '15px',
      top: '130px',
      padding: '0 10px 5px 0',
      borderRadius: '8px',
      backdropFilter: 'blur(.9px)',
      backgroundColor: 'transparent',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ margin: '10px 0 0 8px', color: '#586069', borderBottom: '1px dashed #777', fontSize: '12px' }}>
        大纲&nbsp;&nbsp;
      </div>
      <nav>
        {anchorList.map((anchor) => (
          <div
            key={anchor.suffix}
            style={{
              maxWidth: '250px',
              overflow: 'hidden',
              paddingLeft: `${(anchor.level - 1) * 15}px`,
              margin: '8px 0',
              transition: 'all 0.3s',
              cursor: 'pointer',
              color: location.hash === `#${anchor.suffix}` ? '#1890ff' : '#888'
            }}
            onClick={(e) => handleAnchorClick(e, anchor.suffix)}
          >
            <a
              style={{
                textDecoration: 'none',
                fontSize: `${16 - (anchor.level - 1) * 2}px`,
                color: 'inherit'
              }}
              href={`#${anchor.suffix}`}
            >
              {anchor.value}
            </a>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default AnchorNav;
