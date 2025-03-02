import { BrowserRouter,Routes,Route } from 'react-router-dom'
import './styles/App.scss'

import Header from './views/Header'
import Homepage from './views/Homepage'
import LevelOne from './views/LevelOne'
function App() {
  return (
    
   <BrowserRouter basename="/WhereisthatPokemon">
        <Header />

      
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/levelone" element={<LevelOne />} />

          </Routes>
    
        <footer>
          By Geo Ju
        </footer>
      </BrowserRouter>
       

     
      
  
  )
}

export default App
