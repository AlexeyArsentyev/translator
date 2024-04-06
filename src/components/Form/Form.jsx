import React, { useState, useEffect } from 'react';
import './Form.css';
import './slider.css';
import languageList from './languageCodes.json';

const TranslatorForm = () => {
  const [formText, setFormText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [distortionLevel, setDistortionLevel] = useState(1);

  let text = '';

  const key = 'AIzaSyCk_wRLpPQjjfOZwPdYHVQ4lfolzd03v40';

  const languagesLength = languageList.languages.length;

  const targetLanguage = 'en';

  const translate = async (languageCode) => {
    try {
      const randomId = Math.floor(Math.random() * languagesLength);

      let code;
      if (!languageCode) {
        code = languageList.languages[randomId].code;
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

      const fullName = languageList.languages.find((language) => language.code === code).name;
      console.log(fullName, ': ', text);

      setTranslatedText(text);
    } catch (error) {
      console.error('ERROR', error);
    }
  };

  const fetchText = async () => {
    if (!text) {
      return;
    }

    for (let i = 0; i < distortionLevel; i++) {
      await translate();
    }
    await translate('en');
  };

  const handleSubmit = () => {
    event.preventDefault();
    text = formText;
    fetchText();
  };

  return (
    <div>
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
        <div className="options center-flex">
          <button className="submit-btn" type="submit">
            Translate
          </button>
          <div className="options-distortion center-flex">
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
      <p className="translated-text">{translatedText}</p>
    </div>
  );
};

export default TranslatorForm;
