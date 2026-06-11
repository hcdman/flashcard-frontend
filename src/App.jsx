import React, { useState, useEffect } from 'react';
import Flashcard from './Flashcard';
import './App.css';

function App() {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [vocabularyData, setVocabularyData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [file, setFile] = useState(null);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/api/collections')
      .then((res) => res.json())
      .then((data) => setCollections(data));
  }, []);

  useEffect(() => {
    if (selectedCollection) {
      fetch(`http://localhost:3001/api/words/${selectedCollection}`)
        .then((res) => res.json())
        .then((data) => {
          setVocabularyData(data);
          setCurrentIndex(0);
        });
    }
  }, [selectedCollection]);

  const speak = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  };

  const nextCard = () => {
    if (currentIndex < vocabularyData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("🎉 Congratulations! You've completed all the cards!");
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file || !newCollectionName) {
      alert('Please select a file and enter a collection name.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('collectionName', newCollectionName);

    fetch('http://localhost:3001/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        setNewCollectionName('');
        setFile(null);
        setShowUpload(false); // Hide after upload
        // Refresh collections
        fetch('http://localhost:3001/api/collections')
          .then((res) => res.json())
          .then((data) => setCollections(data));
      });
  };

  return (
    <div className="App">
      <div className="top-bar">
        <button onClick={() => setShowUpload(!showUpload)} className="toggle-upload-btn">
          {showUpload ? 'Close Uploader' : 'Add New Collection'}
        </button>
      </div>

      <div className={`upload-section ${showUpload ? 'show' : ''}`}>
        <h2>Upload New Words</h2>
        <input
          type="text"
          placeholder="New collection name"
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
        />
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>

      <div className="collection-selector">
        <h2>Select a Collection to Learn</h2>
        <select
          value={selectedCollection}
          onChange={(e) => setSelectedCollection(e.target.value)}
        >
          <option value="">--Select a collection--</option>
          {collections.map((collection) => (
            <option key={collection} value={collection}>
              {collection}
            </option>
          ))}
        </select>
      </div>

      {selectedCollection && vocabularyData.length > 0 ? (
        <>
          <h1>{selectedCollection}</h1>
          <div className="progress">
            Card {currentIndex + 1} of {vocabularyData.length}
          </div>
          <Flashcard card={vocabularyData[currentIndex]} speak={speak} />
          <p className="hint">💡 Click on the card to flip it!</p>
          <div className="controls">
            <button onClick={prevCard}>Previous</button>
            <button onClick={nextCard}>Next</button>
          </div>
        </>
      ) : (
        <p>Please select a collection to start learning.</p>
      )}
    </div>
  );
}

export default App;
