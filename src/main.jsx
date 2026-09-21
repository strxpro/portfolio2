import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/global.css'
import './styles/lab.css'
import './styles/stage.css'
import './styles/parts.css'
import './styles/paper.css'
import './styles/showcase.css'
import './styles/cover.css'
import './styles/me.css'
import './styles/deep.css'
// kosmos na koncu: nadpisuje tla sekcji, wiec musi wygrac kaskade
import './styles/cosmos.css'
import './styles/story.css'
import 'lenis/dist/lenis.css'

/**
 * Zanim Reactowi w ogóle wolno cokolwiek narysować.
 *
 * Przeglądarka przywraca scroll dopiero wtedy, gdy dokument odzyska
 * poprzednią wysokość — czyli już PO pierwszym renderze. Ustawienie tej
 * flagi w efekcie komponentu było więc spóźnione i odświeżenie w połowie
 * strony wyrzucało czytelnika w losowe miejsce zamiast na górę.
 */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
window.scrollTo(0, 0)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
