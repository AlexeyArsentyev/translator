import React, { useState, useEffect } from 'react';
import './Form.css';
import './slider.css';
import './languageSelector.css';
import languageList from './languageCodes.json';

const TranslatorForm = () => {
  const [formText, setFormText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [distortionLevel, setDistortionLevel] = useState(1);
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [history, setHistory] = useState([]);

  let text = '';

  const key = 'AIzaSyCk_wRLpPQjjfOZwPdYHVQ4lfolzd03v40';

  const length = languageList.length;

  const translate = async (languageCode) => {
    try {
      const randomId = Math.floor(Math.random() * length);

      let code;
      if (!languageCode) {
        code = languageList[randomId].code;
      } else {
        code = languageCode;
      }

      const body = {
        q: text,
        target: code,
      };

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      };

      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${key}`,
        options
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData.error.message);
        return;
      }

      const data = await response.json();

      text = data.data.translations[0].translatedText;

      // text = text.replace(/&#39;/g, '');

      const fullName = languageList.find((language) => language.code === code).name;
      const historyLog = fullName + ': ' + text + '\n';

      const newHistory = (prevHistory) => [...prevHistory, historyLog];
      setHistory(newHistory);
      console.log(newHistory);

      setTranslatedText(text);
    } catch (error) {
      console.error('ERROR', error);
    }
  };

  const fetchText = async () => {
    if (!text) {
      return;
    }

    setHistory([]);

    for (let i = 0; i < distortionLevel; i++) {
      await translate();
    }
    await translate(targetLanguage);
  };

  const handleSubmit = () => {
    event.preventDefault();
    text = formText;
    fetchText();
  };

  const handleLanguageChange = (event) => {
    setTargetLanguage(event.target.value);
  };

  return (
    <div>
      <img src="./down.png" alt="arrow-down" />
      <h2>Input text</h2>
      <form onSubmit={handleSubmit}>
        <label className="text-input-label" htmlFor="text"></label>
        <textarea
          placeholder="Write something"
          className="text-input"
          id="text"
          type="text"
          value={formText}
          onChange={(e) => setFormText(e.target.value)}
        ></textarea>

        {/* options */}

        <div className="options center-flex">
          <button className="submit-btn" type="submit">
            Translate
          </button>

          <div className="sub-options center-flex">
            <label htmlFor="language-select">To: </label>
            <select
              className="language-select"
              id="language-select"
              onChange={handleLanguageChange}
            >
              <option value="en">English</option>

              {languageList.map((language) => (
                <option value={language.code}>{language.name}</option>
              ))}
            </select>
          </div>
          <div className="sub-options center-flex">
            <label htmlFor="distortion">Chaos level: </label>
            <input
              type="range"
              id="distortion"
              className="distortion"
              value={distortionLevel}
              max="10"
              min="1"
              onChange={(e) => setDistortionLevel(e.target.value)}
            />
          </div>
        </div>
      </form>

      <p className="history">
        {history.map((log) => (
          <div>
            <p>{log}</p>
            <img src="./arrow-down (2).svg" alt="arrow-down" />
          </div>
        ))}
      </p>
    </div>
  );
};

export default TranslatorForm;
