import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import QuizQuestion from './QuizQuestion';
import './Quiz.css';
import './Quiz-mobile.css';

const QuizMenu = () => {
  const [directories, setDirectories] = useState([]);
  const [selectedDirectory, setSelectedDirectory] = useState(null);
  const { deviceType } = useTheme();

  useEffect(() => {
    const fetchDirectories = () => {
      try {
        // Utiliser require.context avec recursive: true pour scanner tous les sous-dossiers
        const context = require.context('./questions', true, /\.csv$/);
        const paths = context.keys();
        console.log('Tous les chemins trouvés:', paths);

        // Extraire tous les dossiers uniques
        const allDirs = new Set();
        paths.forEach(path => {
          // Nettoyer le chemin et diviser en segments
          const cleanPath = path.replace(/^\.\//, '');
          const segments = cleanPath.split('/').filter(Boolean);
          
          // Ne pas ajouter le fichier CSV lui-même
          if (segments.length > 1) {
            // Ajouter chaque niveau de dossier sauf le dernier (qui est le fichier)
            for (let i = 0; i < segments.length - 1; i++) {
              const dirPath = segments.slice(0, i + 1).join('/');
              allDirs.add(dirPath);
            }
          }
        });

        // Convertir en tableau et trier
        const sortedDirs = Array.from(allDirs).sort();
        console.log('Dossiers trouvés:', sortedDirs);
        setDirectories(sortedDirs);
      } catch (error) {
        console.error('Erreur lors de la recherche des dossiers:', error);
        setDirectories(['droit/droit_societe', 'droit/intro_droit']); // Fallback
      }
    };

    fetchDirectories();
  }, []);

  const handleClick = (dir) => {
    console.log(`Sélection du dossier: ${dir}`);
    setSelectedDirectory(dir);
  };

  const handleBack = () => {
    console.log('Retour au menu');
    setSelectedDirectory(null);
  };

  const formatText = (text) => {
    // Prendre uniquement le dernier segment du chemin
    const lastSegment = text.split('/').pop();
    // Remplacer les underscores par des espaces et mettre en majuscule la première lettre
    return lastSegment
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (selectedDirectory) {
    return (
      <div className={`quiz-container ${deviceType === 'mobile' ? 'quiz-container-mobile' : ''}`}>
        <button 
          onClick={handleBack}
          className={`back-button ${deviceType === 'mobile' ? 'back-button-mobile' : ''}`}
          style={deviceType === 'mobile' ? {} : {
            position: 'absolute',
            top: '20px',
            left: '20px',
            padding: '10px 20px',
            backgroundColor: '#4c268f',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Retour au menu
        </button>
        <QuizQuestion directory={selectedDirectory} />
      </div>
    );
  }

  return (
    <div className={`QuizMenu ${deviceType === 'mobile' ? 'QuizMenu-mobile' : 'QuizMenu-desktop'}`}>
      <h1>Quiz Menu</h1>
      <div className={`quiz-button-container ${deviceType === 'mobile' ? 'quiz-button-container-mobile' : 'quiz-button-container-desktop'}`}>
        {directories.map((dir, index) => (
          <button 
            key={index} 
            onClick={() => handleClick(dir)}
            className={`quiz-button ${deviceType === 'mobile' ? 'quiz-button-mobile' : 'quiz-button-desktop'}`}
          >
            {formatText(dir)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizMenu;