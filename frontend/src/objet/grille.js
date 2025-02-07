// frontend/src/objet/grille.js
import React, { useState, useEffect } from 'react';
import './GridBackground.css'; // Importer le CSS pour le fond cadrillé

export const GridBackground = ({ children }) => {
  const [gridSize, setGridSize] = useState(20); // Taille initiale de la grille

  const handleWheel = (event) => {
    if (event.deltaY < 0) {
      setGridSize((prevSize) => Math.min(prevSize + 5, 100)); // Augmenter la taille de la grille
    } else {
      setGridSize((prevSize) => Math.max(prevSize - 5, 5)); // Diminuer la taille de la grille
    }
  };

  useEffect(() => {
    window.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--grid-size', `${gridSize}px`);
  }, [gridSize]);

  return (
    <div className="grid-background" style={{ '--grid-size': `${gridSize}px` }}>
      {children}
    </div>
  );
};