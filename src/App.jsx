import React from 'react';
import './App.css';
import TranslatorForm from './components/Form/Form.jsx';

export default () => (
  <div className="main-wrapper">
    <h1>Cursed translator</h1>
    <main>
      <TranslatorForm />
    </main>
    <div className="bg-gradient-prime"></div>
    <div className="bg-gradient-secondary"></div>
  </div>
);
