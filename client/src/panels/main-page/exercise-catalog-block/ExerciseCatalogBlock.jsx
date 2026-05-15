// components/Dashboard/ExerciseCatalogBlock.jsx
import React from 'react'
import { useDispatch } from 'react-redux'
// import { changeScreen } from '../../store/navigationSlice'
import styles from './ExerciseCatalogBlock.module.css'

const ExerciseCatalogBlock = () => {
  const dispatch = useDispatch()

  return (
    <section className={styles.catalog_section}>
      <h2 className={styles.section_title}>⭐ КАТАЛОГ УПРАЖНЕНИЙ</h2>
      <div className={styles.catalog_grid}>
        <button
          className={`${styles.catalog_item} ${styles.type_base}`}
        //   onClick={() => dispatch(changeScreen('exercises_base'))}
        >
          <div className={styles.badge_dot}>🟢 БАЗА</div>
          <span className={styles.level_subtitle}>1 Уровень</span>
        </button>

        <button
          className={`${styles.catalog_item} ${styles.type_advanced}`}
        //   onClick={() => dispatch(changeScreen('exercises_advanced'))}
        >
          <div className={styles.badge_dot}>🟡 ПРОДВИНУТЫЙ</div>
          <span className={styles.level_subtitle}>2 Уровень</span>
        </button>

        <button
          className={`${styles.catalog_item} ${styles.type_expert}`}
        //   onClick={() => dispatch(changeScreen('exercises_expert'))}
        >
          <div className={styles.badge_dot}>👑 ЭКСПЕРТ</div>
          <span className={styles.level_subtitle}>Premium</span>
        </button>
      </div>
    </section>
  )
}

export default ExerciseCatalogBlock
