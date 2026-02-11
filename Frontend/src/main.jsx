import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter , RouterProvider} from 'react-router'
import store from './store/store.js'
import { Provider } from 'react-redux'
import {Home , About ,Login , Register} from './pages/index.js'

import {UnAuthLayout } from './layout/index.js'

const router  = createBrowserRouter([
  {
    path: "",
    element: <UnAuthLayout /> ,
    children:[
      {
        path : "/",
        element : <Home/>
      } , 
      {
        path : "/about",
        element : <About />
      } , 
      {
        path :  "/login",
        element : <Login />
      },
      {
        path : '/register',
        element : <Register />
      }
    ]
  }
  
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>

    <RouterProvider router={router} />
    
    </Provider>
  </StrictMode>,
)
