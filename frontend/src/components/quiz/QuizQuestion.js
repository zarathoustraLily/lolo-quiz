import React, { useState, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './QuizQuestion.css';
import './Quiz-mobile.css';

const QuizQuestion = ({ directory }) => {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { deviceType } = useTheme();

  const decodeText = (text) => {
    try {
      const decodedText = decodeURIComponent(escape(text));
      return decodedText
        .replace(/\r\n/g, '')
        .replace(/\n/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    } catch (e) {
      return text
        .replace(/\r\n/g, '')
        .replace(/\n/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    }
  };

  const parseCSVContent = useCallback((content) => {
    try {
      const lines = content.split('\n');
      console.log('Nombre de lignes trouvées:', lines.length);
      
      const questions = lines
        .filter(line => line.trim() !== '')
        .map(line => {
          const decodedLine = decodeText(line);
          console.log('Ligne à traiter:', decodedLine);
          
          const cells = decodedLine.split(',')
            .map(cell => decodeText(cell))
            .filter(cell => cell !== '');

          if (cells.length >= 3) {
            return {
              question: cells[0],
              correctAnswer: cells[1],
              wrongAnswers: cells.slice(2)
            };
          }
          return null;
        })
        .filter(q => q !== null);

      return questions;
    } catch (error) {
      console.error('Erreur lors du parsing:', error);
      throw new Error(`Erreur de format du fichier CSV: ${error.message}`);
    }
  }, []);

  const findCSVFiles = useCallback(async () => {
    try {
      // Utiliser require.context pour trouver tous les fichiers CSV dans le dossier
      const context = require.context('./questions', true, /\.csv$/);
      const paths = context.keys();
      
      // Filtrer les chemins pour ne garder que ceux du dossier sélectionné
      const relevantPaths = paths.filter(path => {
        const cleanPath = path.replace(/^\.\//, '');
        return cleanPath.startsWith(directory + '/') || cleanPath === directory + '.csv';
      });

      console.log('Fichiers CSV trouvés pour le dossier:', relevantPaths);
      return relevantPaths;
    } catch (error) {
      console.error('Erreur lors de la recherche des fichiers:', error);
      return [];
    }
  }, [directory]);

  const loadQuestion = useCallback(async () => {
    try {
      console.log('Chargement des questions pour le dossier:', directory);
      
      // Trouver tous les fichiers CSV dans le dossier
      const csvFiles = await findCSVFiles();
      if (csvFiles.length === 0) {
        throw new Error('Aucun fichier CSV trouvé dans ce dossier');
      }

      // Charger tous les fichiers CSV
      const allQuestions = [];
      for (const csvPath of csvFiles) {
        try {
          // Construire le chemin public
          const cleanPath = csvPath.replace(/^\.\//, '');
          const publicPath = `/questions/${cleanPath}`;
          console.log('Chargement du fichier:', publicPath);

          const response = await fetch(publicPath);
          if (!response.ok) {
            console.error(`Erreur HTTP ${response.status} pour ${publicPath}`);
            continue;
          }

          const blob = await response.blob();
          const content = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsText(blob, 'ISO-8859-1');
          });

          const questions = parseCSVContent(content);
          allQuestions.push(...questions);
        } catch (error) {
          console.error('Erreur lors du chargement du fichier:', csvPath, error);
        }
      }

      console.log(`Total des questions trouvées: ${allQuestions.length}`);

      if (allQuestions.length === 0) {
        throw new Error('Aucune question valide trouvée dans les fichiers');
      }

      // Sélectionner une question au hasard
      const randomQuestion = allQuestions[Math.floor(Math.random() * allQuestions.length)];
      console.log('Question sélectionnée:', randomQuestion);

      setQuestion(randomQuestion.question);
      setCorrectAnswer(randomQuestion.correctAnswer);
      setAnswers(shuffleArray([randomQuestion.correctAnswer, ...randomQuestion.wrongAnswers]));
      setError(null);

    } catch (error) {
      console.error('Erreur complète:', error);
      setError(`Erreur lors du chargement des questions: ${error.message}`);
      setQuestion('');
      setAnswers([]);
    } finally {
      setIsLoading(false);
    }
  }, [directory, findCSVFiles, parseCSVContent]);

  React.useEffect(() => {
    setIsLoading(true);
    setError(null);
    setQuestion('');
    setAnswers([]);
    loadQuestion();
  }, [loadQuestion]);

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleAnswerClick = (answer) => {
    if (status !== null) return;
    
    if (answer === correctAnswer) {
      setStatus('correct');
    } else {
      setStatus('incorrect');
    }

    setTimeout(() => {
      setStatus(null);
      loadQuestion();
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className={`quiz-container ${deviceType === 'mobile' ? 'quiz-container-mobile' : ''}`}>
        <div className={`question-container ${deviceType === 'mobile' ? 'question-container-mobile' : ''}`}>
          <h2>Chargement de la question...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={`quiz-container ${deviceType === 'mobile' ? 'quiz-container-mobile' : ''}`}>
      <div className={`question-container ${deviceType === 'mobile' ? 'question-container-mobile' : ''}`}>
        <h2>{question || 'Chargement de la question...'}</h2>
        {error && (
          <div className="error-message" style={{color: 'red', marginTop: '10px'}}>
            Erreur: {error}
          </div>
        )}
      </div>
      <div className={`answers-container ${status ? status : ''} ${deviceType === 'mobile' ? 'answers-container-mobile' : ''}`}>
        {answers.length > 0 && answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(answer)}
            className={`answer-button ${deviceType === 'mobile' ? 'answer-button-mobile' : ''}`}
            disabled={status !== null}
          >
            {answer}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestion; 