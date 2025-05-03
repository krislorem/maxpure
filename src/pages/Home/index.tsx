import { useRef, useState } from "react";
import FloatToolButton from "@/components/FloatToolButton";
import IREditor, { editorRef } from "@/components/Vditor/IREditor";
import VPreviewer from "@/components/Vditor/VPreviewer";
import CalendarHeatMap from "@/components/CalendarHeatMap";
import { Button } from "antd";
import ScrollProgress from "@/components/ScrollProgress";
import Independent from "@/components/QwenAntdX";
import { editorRef } from "@/components/Vditor/IREditor";
const Home = () => {
  const data = [
    {
      date: '2023-01-23',
      count: 2,
      level: 1,
    },
    {
      date: '2024-06-23',
      count: 2,
      level: 1,
    },
    {
      date: '2024-08-02',
      count: 16,
      level: 4,
    },
    {
      date: '2024-11-29',
      count: 11,
      level: 3,
    },
  ];

  const editorRef = useRef<{ getValue: () => string, getHTML: () => string, getCount: () => any }>(null);
  const [content, setContent] = useState(editorRef.current?.getValue() ?? "");
  const save = () => {
    setContent(editorRef.current?.getValue() ?? "");
    console.log(editorRef?.current?.getHTML() ?? "");
    console.log(editorRef?.current?.getCount() ?? "");
  };
  return (
    <div>
      <ScrollProgress />
      <IREditor ref={editorRef} />
      <VPreviewer content={content} />
      <Button onClick={save}>save</Button>
      <FloatToolButton />
      <CalendarHeatMap data={data} />
      <Independent />
    </div>
  );
};

export default Home;
