import { LandingPage } from '@/pages/landingpage'
import { Trade } from '@/pages/trade'
import { Routes, Route} from 'react-router'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/trade" element={<Trade />} />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  )
}
