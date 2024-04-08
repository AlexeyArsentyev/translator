import React, { useState } from 'react';
import './Form.css';
import './slider.css';
import './languageSelector.css';
import languageList from './languageCodes.json';
import arrowDown from './arrow-down.svg';
import TextareaAutosize from 'react-textarea-autosize';

const TranslatorForm = () => {
  let key;

  const getKey = async () => {
    if (import.meta.env.PROD) {
      key = import.meta.env.VITE_TRANSLATE_KEY;
    } else {
      const devEnv = await import('../../../devEnv.json');
      key = devEnv.key;
    }
    return key;
  };

  getKey();

  const [formText, setFormText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [distortionLevel, setDistortionLevel] = useState(3);
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [history, setHistory] = useState([]);

  let text = '';

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

      text = text.replace(/&#39;/g, '');
      updateHistory(code, text);

      setTranslatedText(text);
    } catch (error) {
      console.error('ERROR', error);
    }
  };

  const updateHistory = (code, text) => {
    const languageName = languageList.find((language) => language.code === code).name;

    setHistory((currentHistory) => [...currentHistory, { languageName, text }]);
  };
  const handleSubmit = () => {
    event.preventDefault();
    text = formText;
    fetchText();
  };

  const fetchText = async () => {
    if (!text) {
      return;
    }

    if (text === 'something') {
      setTranslatedText('Not literally!');
      return;
    }

    setHistory([]);
    updateHistory(targetLanguage, formText);
    for (let i = 0; i < distortionLevel; i++) {
      await translate();
    }
    await translate(targetLanguage);
  };

  const handleLanguageChange = (event) => {
    setTargetLanguage(event.target.value);
  };

  const onEnterPress = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="translation-area">
          <div className="translation-section">
            <h2>Input text</h2>

            <label className="text-input-label" htmlFor="text"></label>
            <TextareaAutosize
              minRows="1"
              maxRows="15"
              placeholder="Write something"
              className="text-input"
              id="text"
              type="text"
              value={formText}
              onChange={(e) => setFormText(e.target.value)}
              onKeyDown={onEnterPress}
            ></TextareaAutosize>
          </div>
          {translatedText && (
            <div className="translation-section">
              <h2 className="translated-header">Translated text</h2>
              <p className="translated-text">{translatedText}</p>
            </div>
          )}
        </div>

        {/* options */}

        <div className="options center-flex">
          <div className="submit-language-pair">
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

      {/* history */}

      {history.length > 0 && <h2>Translations</h2>}
      <ul className="history">
        {history.map(({ languageName, text }, index) => (
          <li key={index}>
            {index !== 0 && <img src={arrowDown} alt="arrow-down" className="arrow-down" />}
            <p className="history-log">
              <span className="language-name"> {languageName + ':'}</span>

              <span className="history-log-text"> {text}</span>
            </p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default TranslatorForm;
