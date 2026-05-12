import React from 'react'

import styles from './ExerciseSlider.module.css'
import ExercisePreview from '../../../components/exercise-preview/ExercisePreview'

const ExerciseSlider = ({ titleLvl, exList, }) => {
  return (
    <div className={styles.level_section}>
      <h3 className={styles.title_block}>{titleLvl}</h3>
      <div className={styles.carousel_wrapper}>
        {exList.map((ex) => (
          <ExercisePreview
            key={ex.alias}
            exData={ex}
          />
        ))}
      </div>
    </div>
  )
}

export default ExerciseSlider
