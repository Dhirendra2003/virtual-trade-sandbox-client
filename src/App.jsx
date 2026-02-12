import Router from './pages/Router'
import { TooltipProvider } from '@/components/ui/tooltip'

const App = () => {
  return (
    <TooltipProvider>
      <Router />
    </TooltipProvider>
  )
}

export default App
