import { useState } from 'react'
import './App.css'
import UploadForm from './components/UploadForm/UploadForm.jsx'

function App() {

  return (
    <>
      <header>
        <h1>Audio Modification App</h1>
      </header>
      <section>
        <UploadForm />
      </section>
    </>
  )
}

export default App
