import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import '@ant-design/v5-patch-for-react-19';
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import { useThemeStore } from './stores/themeStore';

const ThemeProviderWithStore = () => {
  const localTheme = useThemeStore(state => state.theme);// Get theme state from store
  const currentAlgorithm = localTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm;

  return (
    <ConfigProvider theme={{ algorithm: currentAlgorithm }}>
      <App />
    </ConfigProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ThemeProviderWithStore />
  </BrowserRouter>
)
