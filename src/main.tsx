import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import './styles/global.css'
import App from './App'

const theme = {
  token: {
    colorPrimary: '#50beaf',
    colorLink: '#50beaf',
    colorLinkHover: '#3a9e91',
    fontFamily: "'Intro', 'Segoe UI', Arial, sans-serif",
    borderRadius: 6,
    colorBgContainer: '#ffffff',
  },
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={theme} locale={ruRU}>
      <App />
    </ConfigProvider>
  </StrictMode>
)
