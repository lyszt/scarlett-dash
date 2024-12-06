import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../dashboard.css'
import {Dash} from '../App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Dash />
    </StrictMode>,
)
