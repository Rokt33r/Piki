import React from 'react'
import ReactDOM from 'react-dom'

const mainElement = getMainElement()

ReactDOM.render(<h1>Hello</h1>, mainElement)

function getMainElement() {
  let mainElement = document.getElementById('main')
  if(mainElement) return mainElement
  mainElement = document.createElement('div')
  mainElement.setAttribute('id', 'main')
  document.body.appendChild(mainElement)
  return mainElement
}
