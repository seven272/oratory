import React from 'react';
import styles from './AiWorkoutResult.module.css';

const AiWorkoutResult = ({ evaluationResult, config, onBack }) => {
  return (
    <div className={styles.result_card}>
      <h3 className={styles.result_title}>🎯 Итоги встречи</h3>
      
      <div className={styles.metrics_row}>
        {/* Главный итоговый балл (остается общим для всех) */}
        <div className={styles.metric_item}>
          <div className={styles.score_main}>{evaluationResult.totalScore}</div>
          <div className={styles.metric_label}>Общий балл</div>
        </div>

        {/* ДИНАМИЧЕСКИЙ РЕНДЕРИНГ ШКАЛ НА ОСНОВЕ КОНФИГА */}
        {config.criteria.map((criterion) => {
          const score = evaluationResult.criteria?.[criterion.key] || 0;
          return (
            <div key={criterion.key} className={styles.metric_item}>
              <div className={styles.score_sub}>{score}/100</div>
              <div className={styles.metric_label}>{criterion.label}</div>
            </div>
          );
        })}
      </div>

      <p className={styles.feedback_box}>
        <strong>Разбор ментора:</strong> {evaluationResult.feedback}
      </p>

      <button className={styles.back_button} onClick={onBack}>
        Вернуться в каталог модулей
      </button>
    </div>
  );
};

export default AiWorkoutResult;
