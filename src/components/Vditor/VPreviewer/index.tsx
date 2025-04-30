import { useEffect } from "react";
import VditorPreview from "vditor";
import "vditor/dist/index.css";
import './index.css'
import { useThemeStore } from "@/stores/themeStore";
const VPreviewer: React.FC<{ content: string }> = ({ content }) => {
  const theme = useThemeStore(state => state.theme);

  useEffect(() => {
    const viewer = document.getElementById("vpreviewer") as HTMLDivElement;
    VditorPreview.preview(viewer, content, {
      mode: theme === "dark" ? 'dark' : 'light',
      hljs: { style: "github" },
    });
  }, [content, theme]);
  return (
    <div className="vditor-container">
      <div id="vpreviewer" className={theme === "dark" ? 'dark' : ''} />
    </div>
  )

}

export default VPreviewer
