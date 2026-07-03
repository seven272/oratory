// components/Dashboard/ExerciseCatalogBlock.jsx
import React from 'react'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'

import styles from './ExerciseCatalogBlock.module.css'
import level1Icon from '../../../assets/images/other/level1.png'
import level2Icon from '../../../assets/images/other/level2.png'
import level3Icon from '../../../assets/images/other/level3.png'

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
          <div className={styles.badge_dot}>
           
            <img
              src={level1Icon}
              alt="иконка 1 уровня"
              className={styles.level_icon}
            />
            БАЗА
          </div>

          <span className={styles.level_subtitle}>1 Уровень</span>
        </button>

        <button
          className={`${styles.catalog_item} ${styles.type_advanced}`}
          onClick={() => routeNavigator.push('exercises/level2')}
        >
          <div className={styles.badge_dot}> <img
              src={level2Icon}
              alt="иконка 2 уровня"
              className={styles.level_icon}
            /> ПРОДВИНУТЫЙ</div>
          <span className={styles.level_subtitle}>2 Уровень</span>
        </button>

        <button
          className={`${styles.catalog_item} ${styles.type_expert}`}
          onClick={() => routeNavigator.push('exercises/level3')}
        >
          <div className={styles.badge_dot}> <img
              src={level3Icon}
              alt="иконка 3 уровня"
              className={styles.level_icon}
            /> ЭКСПЕРТ</div>
          <span className={styles.level_subtitle}>Premium</span>
        </button>
      </div>
    </section>
  )
}

export default ExerciseCatalogBlock
