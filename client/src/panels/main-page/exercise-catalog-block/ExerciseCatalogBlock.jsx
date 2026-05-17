// components/Dashboard/ExerciseCatalogBlock.jsx
import React from 'react'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'

import styles from './ExerciseCatalogBlock.module.css'

const ExerciseCatalogBlock = () => {
  const routeNavigator = useRouteNavigator()

  return (
    <section className={styles.catalog_section}>
      <h2 className={styles.section_title}>⭐ КАТАЛОГ УПРАЖНЕНИЙ</h2>
      <div className={styles.catalog_grid}>
        <button
          className={`${styles.catalog_item} ${styles.type_base}`}
          onClick={() => routeNavigator.push('exercises/level1')}
        >
          <div className={styles.badge_dot}>🟢 БАЗА</div>
          <span className={styles.level_subtitle}>1 Уровень</span>
        </button>

        <button
          className={`${styles.catalog_item} ${styles.type_advanced}`}
          onClick={() => routeNavigator.push('exercises/level2')}
        >
          <div className={styles.badge_dot}>🟡 ПРОДВИНУТЫЙ</div>
          <span className={styles.level_subtitle}>2 Уровень</span>
        </button>

        <button
          className={`${styles.catalog_item} ${styles.type_expert}`}
          onClick={() => routeNavigator.push('exercises/level3')}
        >
          <div className={styles.badge_dot}>👑 ЭКСПЕРТ</div>
          <span className={styles.level_subtitle}>Premium</span>
        </button>
      </div>
    </section>
  )
}

export default ExerciseCatalogBlock
