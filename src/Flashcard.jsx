import React, { useState, useEffect } from 'react';
import './Flashcard.css';

const Flashcard = ({ card, speak }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [card]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSpeak = (e) => {
    e.stopPropagation();
    speak(card.word);
  };

  return (
    <div className="flashcard-container" onClick={handleFlip}>
      <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
        <div className="card-face card-front">
          <span id="word-front">{card.word}</span>
          <span className="speaker-icon" onClick={handleSpeak}>
            🔊
          </span>
        </div>
        <div className="card-face card-back">
          <div className="meaning">{card.meaning}</div>
          <div className="ipa">{card.ipa}</div>
          <div className="example">{card.example}</div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;