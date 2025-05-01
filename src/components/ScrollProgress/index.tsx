import { useState, useEffect } from 'react';
import { Progress } from 'antd';
import './index.css';
const ScrollProgress = () => {
  const [scrollPercent, setScrollPercent] = useState(0);

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    const windowHeight = document.documentElement.clientHeight;
    const docHeight = document.documentElement.scrollHeight;
    const progress = (scrollTop / (docHeight - windowHeight)) * 100;
    setScrollPercent(progress);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <Progress className="scroll-progress" percent={scrollPercent} showInfo={false}
    strokeColor={
      {
        '0%': '#87d068',
        '100%': '#108ee9'
      }
    }
    strokeLinecap="round" />;
};

export default ScrollProgress;
