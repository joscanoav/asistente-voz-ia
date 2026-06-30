import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import LandingPage from './LandingPage'
import Taller from './pages/Taller'

import Dia1Index from './pages/Dia1/Dia1Index'
import Dia1Bloque1 from './pages/Dia1/Bloque1'
import Dia1Bloque2 from './pages/Dia1/Bloque2'

import Dia2Index from './pages/Dia2/Dia2Index'
import PrimariaIndex from './pages/Dia2/Primaria/Index'
import PrimariaBloque1 from './pages/Dia2/Primaria/Bloque1'
import PrimariaBloque2 from './pages/Dia2/Primaria/Bloque2'
import SecundariaIndex from './pages/Dia2/Secundaria/Index'
import SecundariaBloque1 from './pages/Dia2/Secundaria/Bloque1'
import SecundariaBloque2 from './pages/Dia2/Secundaria/Bloque2'

import Recursos from './pages/Recursos'
import VegAI from './pages/VegAI'
import Placeholder from './components/Placeholder'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/taller" element={<Taller />} />

        <Route path="/dia1" element={<Dia1Index />} />
        <Route path="/dia1/bloque1" element={<Dia1Bloque1 />} />
        <Route path="/dia1/bloque2" element={<Dia1Bloque2 />} />

        <Route path="/dia2" element={<Dia2Index />} />
        <Route path="/dia2/primaria" element={<PrimariaIndex />} />
        <Route path="/dia2/primaria/bloque1" element={<PrimariaBloque1 />} />
        <Route path="/dia2/primaria/bloque2" element={<PrimariaBloque2 />} />
        <Route path="/dia2/secundaria" element={<SecundariaIndex />} />
        <Route path="/dia2/secundaria/bloque1" element={<SecundariaBloque1 />} />
        <Route path="/dia2/secundaria/bloque2" element={<SecundariaBloque2 />} />

        <Route path="/recursos" element={<Recursos />} />
        <Route path="/vegai" element={<VegAI />} />

        <Route path="*" element={<Placeholder titulo="Página no encontrada" />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)