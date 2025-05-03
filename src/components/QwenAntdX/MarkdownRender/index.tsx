import { useEffect, useRef } from 'react';
import 'vditor/dist/index.css';  // 引入基础样式 
import Vditor from 'vditor';
interface MarkdownRenderProps {
  content: string;
  theme?: 'light' | 'dark';
}

const MarkdownRender = ({ content, theme = 'light' }: MarkdownRenderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !content) return;

    Vditor.preview(containerRef.current!, content, {
      mode: theme,
      math: { engine: 'KaTeX' },    // 启用数学公式支持 
      hljs: { style: 'github' },    // 代码高亮配置
      anchor: 2,
      after() {
        // 渲染后回调（例如添加点击事件）
        containerRef.current?.querySelectorAll('a').forEach(link => {
          link.target = '_blank';
        });
      }
    });

    return () => {
      // 清理残留内容
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [content, theme]);

  return <div ref={containerRef} className="vditor-reset" />; // 应用 Vditor 重置样式 
};

export default MarkdownRender;
