import { useEffect } from "react";
import VditorPreview from "vditor";
import AnchorNav from "@/components/AnchorNav";
import "vditor/dist/index.css";
import './index.css'
import { useThemeStore } from "@/stores/themeStore";
import { useAnchor } from "@/hooks/useAnchor";
const VPreviewer: React.FC<{ content: string }> = ({ content }) => {
  const theme = useThemeStore(state => state.theme);
  const anchorList = useAnchor(content);
  useEffect(() => {
    const viewer = document.getElementById("vpreviewer") as HTMLDivElement;
    VditorPreview.preview(viewer, content, {
      mode: theme === "dark" ? 'dark' : 'light',
      hljs: { style: "github" },
      anchor: 2,
      icon: "ant"
    });
  }, [content, theme, anchorList]);
  return (
    <div className="vditor-container">
      <div id="vpreviewer" className={theme === "dark" ? 'dark' : ''} />
      <AnchorNav anchorList={anchorList} />
    </div>
  )

}

export default VPreviewer
