import React from 'react';
import './App.css';
import TranslatorForm from './components/Form/Form.jsx';

export default () => (
  <div className="main-wrapper">
    <h1>Broken translator</h1>
    <p className="description">
      Get your text through a Google translator a bunch of times to get some strange result
      <br></br>
      Why would you need this? No idea. You decide.
    </p>
    <main>
      <TranslatorForm />
    </main>
    <div className="bg-gradient-prime"></div>
    <div className="bg-gradient-secondary"></div>
  </div>
);
