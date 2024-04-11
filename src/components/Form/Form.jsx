import React, { useState } from 'react';
import './Form.css';
import './slider.css';
import './languageSelector.css';
import languageList from './languageCodes.json';
import TextareaAutosize from 'react-textarea-autosize';
import History from '../History/History';
import copyImg from './copy.svg';

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
  const [isCopied, setIsCopied] = useState(false);

  let text = '';

  const length = languageList.length;

  const translate = async (index) => {
    try {
      const randomId = Math.floor(Math.random() * length);

      let code;
      if (index === distortionLevel - 1) {
        code = targetLanguage;
      } else {
        code = languageList[randomId].code;
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
        f;
      }

      const data = await response.json();

      text = data.data.translations[0].translatedText;

      text = text.replace(/&#39;/g, '');

      if (index === 0) {
        updateHistory(data.data.translations[0].detectedSourceLanguage, formText);
      }
      updateHistory(code, text);

      setTranslatedText(text);
      setIsCopied(false);
    } catch (error) {
      console.error('ERROR', error);
    }
  };

  const updateHistory = (code, text) => {
    const languageName = languageList.find((language) => language.code === code).name;

    setHistory((currentHistory) => [...currentHistory, { languageName, text }]);
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

    for (let i = 0; i < distortionLevel; i++) {
      await translate(i);
    }
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

  const handleSubmit = () => {
    event.preventDefault();
    text = formText;
    fetchText();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <section className="translation-area">
          <div className="translation-section">
            <h2>Input text</h2>

            <label className="text-input-label" htmlFor="text"></label>
            <TextareaAutosize
              minRows="3"
              maxRows="15"
              placeholder="Write something"
              className="text-input large-font"
              id="text"
              type="text"
              value={formText}
              onChange={(e) => setFormText(e.target.value)}
              onKeyDown={onEnterPress}
            ></TextareaAutosize>
          </div>
          {translatedText && (
            <div className="translation-section">
              <div className="copy-btn-wrapper">
                <h2 className="translated-header">Translated text</h2>
                <img
                  className="copy-btn"
                  src={copyImg}
                  alt="copy"
                  onClick={() => {
                    navigator.clipboard.writeText(translatedText);
                    setIsCopied(true);
                  }}
                />

                {isCopied && <span className="secondary-text">Copied</span>}
              </div>

              <p className="translated-text large-font">{translatedText}</p>
            </div>
          )}
        </section>

        {/* options */}

        <section className="options center-flex">
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
        </section>
      </form>

      <History history={history} />
    </>
  );
};

export default TranslatorForm;
