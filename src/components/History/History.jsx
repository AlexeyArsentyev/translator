import React from 'react';
import arrowDown from './arrow-down.svg';
import './History.css';

const History = ({ history }) => {
  return (
    <>
      {history.length > 0 && <h2>Conversions</h2>}
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

export default History;
