import { LandingPage } from '@/pages/landingpage'
import { Routes, Route} from 'react-router'
import TradePage from '@/pages/trade'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/trade" element={<TradePage />} />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  )
}
