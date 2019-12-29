import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

function render(Component: typeof App) {
  let mainElement = document.getElementById('root')
  if (mainElement == null) {
    mainElement = document.createElement('div', {})
    mainElement.setAttribute('id', 'root')
    document.body.appendChild(mainElement)
  }
  ReactDOM.render(
    <Component />,
    document.getElementById('root')
  )
}

if (module.hot != null) {
  module.hot.accept('./components/App', () => {
    render(App)
  })
}

render(App)
