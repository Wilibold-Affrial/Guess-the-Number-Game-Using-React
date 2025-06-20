import React, { useState, useEffect } from 'react';
import './App.css';

const GuessTheNumber = () => {
  const [targetNumber, setTargetNumber] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [guessHistory, setGuessHistory] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (gameStatus === 'playing') {
      const newTarget = Math.floor(Math.random() * 100) + 1;
      setTargetNumber(newTarget);
    }
  }, [gameStatus]);

  const handleInputChange = (e) => {
    setCurrentGuess(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setErrorMessage('');
    
    const guess = parseInt(currentGuess, 10);
    if (isNaN(guess)) {
      setErrorMessage('Please enter a valid number.');
      return;
    }
    
    if (guess < 1 || guess > 100) {
      setErrorMessage('Please enter a number between 1 and 100.');
      return;
    }

    if (guessHistory.some(g => g.value === guess)) {
      setErrorMessage('You already guessed this number.');
      return;
    }

    const result = guess === targetNumber ? 'correct' : 
                  guess < targetNumber ? 'too-low' : 'too-high';
    
    setGuessHistory(prev => [
      ...prev,
      { value: guess, result, attempt: prev.length + 1 }
    ]);

    if (result === 'correct') {
      setGameStatus('won');
    }

    setCurrentGuess('');
  };

  const playAgain = () => {
    setGameStatus('playing');
    setCurrentGuess('');
    setGuessHistory([]);
    setErrorMessage('');
  };

  const getResultMessage = (result) => {
    switch(result) {
      case 'correct': return 'Correct! You won!';
      case 'too-high': return 'Too high!';
      case 'too-low': return 'Too low!';
      default: return '';
    }
  };

  return (
    <div className="guess-game-container">
      <h1>Guess the Number</h1>
      <p>I'm thinking of a number between 1 and 100</p>
      
      <form onSubmit={handleSubmit} className="guess-form">
        <input
          type="number"
          min="1"
          max="100"
          value={currentGuess}
          onChange={handleInputChange}
          aria-label="Enter your guess"
          aria-invalid={!!errorMessage}
          disabled={gameStatus === 'won'}
          className={gameStatus === 'won' ? 'disabled-input' : ''}
        />
        <button
          type="submit"
          aria-label="Submit guess"
          disabled={gameStatus === 'won'}
          className={gameStatus === 'won' ? 'disabled-button' : ''}
        >
          Submit Guess
        </button>
      </form>

      {errorMessage && (
        <div className="error-message" role="alert" aria-live="polite">
          {errorMessage}
        </div>
      )}

      {guessHistory.length > 0 && (
        <div className={`result ${guessHistory[guessHistory.length - 1].result}`}>
          {getResultMessage(guessHistory[guessHistory.length - 1].result)}
        </div>
      )}

      <div className="attempts-display">
        Attempts: {guessHistory.length}
      </div>

      {gameStatus === 'won' && (
        <button 
          onClick={playAgain} 
          className="play-again-button"
          aria-label="Play again"
        >
          Play Again
        </button>
      )}

      <div className="history-container">
        <h3>Guess History:</h3>
        <ul className="history-list">
          {guessHistory.map((guess, index) => (
            <li key={index} className={`history-item ${guess.result}`}>
              Attempt {guess.attempt}: {guess.value} - {getResultMessage(guess.result)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GuessTheNumber;