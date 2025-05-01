import React, { useState } from 'react'
import SwitchDarkMode from '@/components/SwitchDarkModeButton';
import { UpOutlined } from '@ant-design/icons'
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
          >
            <FloatButton />
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
