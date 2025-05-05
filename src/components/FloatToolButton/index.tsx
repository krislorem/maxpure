import React, { useState } from 'react'
import SwitchDarkMode from '@/components/SwitchDarkModeButton';
import { UpOutlined, ArrowUpOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons'
import { Flex, FloatButton } from 'antd';
import './index.css'
const BOX_SIZE = 100;
const BUTTON_SIZE = 40;
const wrapperStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 0,
  right: 0,
};

const boxStyle: React.CSSProperties = {
  width: BOX_SIZE,
  height: BOX_SIZE,
  position: 'relative',
};

const insetInlineEnd: React.CSSProperties['insetInlineEnd'] = (BOX_SIZE - BUTTON_SIZE) / 2

const bottom: React.CSSProperties['bottom'] = BOX_SIZE - BUTTON_SIZE / 2

const FloatToolButton = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('theme') === 'dark' : false
  )

  const handleDarkModeChange = (isDark: boolean) => {
    setIsDarkMode(isDark)
  }
  const style: React.CSSProperties = {
    position: 'absolute',
    insetInlineEnd: insetInlineEnd,
    bottom: bottom,
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const fullscreen = () => {
    const el = document.documentElement
    if (el.requestFullscreen) {
      el.requestFullscreen()
      setIsFullscreen(true)
    }
  }
  const exitfullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }
  return (
    <div className="toolfloot">
      <Flex justify="space-evenly" align="center" style={wrapperStyle}>
        <div style={boxStyle}>
          <FloatButton.Group
            key="top"
            trigger="click"
            placement="top"
            style={style}
            icon={<UpOutlined key="up" />}
            tooltip="工具"
          >
            <FloatButton icon={<ArrowUpOutlined />} tooltip={"回到顶部"} onClick={scrollToTop} />
            {!isFullscreen ? <FloatButton icon={<FullscreenOutlined />} tooltip={"全屏"} onClick={fullscreen} /> : <FloatButton icon={<FullscreenExitOutlined />} tooltip={"退出全屏"} onClick={exitfullscreen} />}
            <SwitchDarkMode
              duration={1000}
              styleId="circle-animation"
              className="!w-10 !h-10 !text-xl"
              isDarkMode={isDarkMode}
              onDarkModeChange={handleDarkModeChange}
            />
          </FloatButton.Group>
        </div>
      </Flex>
    </div>
  )
}

export default FloatToolButton
