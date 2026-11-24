import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router'
import { cartStore } from './features/cart/cartStore'
import { StoreProvider } from './app/StoreContext'
import App from './app/App'
import './index.css'
import './styles.css'

// One Redux store (cart, order, wishlist) and one router for the whole site.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={cartStore}>
      <BrowserRouter>
        <StoreProvider>
          <App />
        </StoreProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
