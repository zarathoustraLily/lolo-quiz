// filepath: /c:/Users/laure/Desktop/00/lolo_management/dcg_dscg/frontend/src/components/quiz/Quiz.js
import React, { useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import QuizMenu from './quiz_menu';
import './Quiz.css';
import './Quiz-mobile.css';

const Quiz = () => {
  const { deviceType } = useTheme();

  useEffect(() => {
    const cleanup = () => {
      localStorage.removeItem('quizPageRefreshed');
    };

    if (!localStorage.getItem('quizPageRefreshed')) {
      localStorage.setItem('quizPageRefreshed', 'true');
      window.location.reload();
    }

    return cleanup;
  }, []);

  return (
    <div className={`quiz ${deviceType === 'mobile' ? 'quiz-mobile' : 'quiz-desktop'}`}>
      <QuizMenu />
    </div>
  );
};

export default Quiz;