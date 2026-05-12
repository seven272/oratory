import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearLastAwarded } from '../../redux/slices/profileSlice'; 
import styles from './AchievementModal.module.css';

const AchievementModal = () => {
  const dispatch = useDispatch();
  const lastAwarded = useSelector((state) => state.profile.lastAwarded);

  if (!lastAwarded) return null;

  // Берем первую ачивку из массива новых
  const award = lastAwarded[0];

  return (
    <div className={styles.overlay} onClick={() => dispatch(clearLastAwarded())}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.shine} />
        <span className={styles.badge}>NEW RECORD</span>
        
        <div className={styles.iconContainer}>
          <img src={`/images/awards/${award.code}.png`} className={styles.img} alt="award" />
        </div>

        <h2 className={styles.title}>{award.title}</h2>
        <p className={styles.text}>Вы разблокировали новое достижение!</p>
        
        <button className={styles.btn} onClick={() => dispatch(clearLastAwarded())}>
          Забрать награду
        </button>
      </div>
    </div>
  );
};

export default AchievementModal;
