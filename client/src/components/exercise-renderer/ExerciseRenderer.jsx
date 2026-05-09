import React from 'react'

import styles from './ExerciseRenderer.module.css'
//level1
import Association from '../exercises/level-1/association/Association'
import Description from '../exercises/level-1/description/Description'
import Emotion from '../exercises/level-1/emotion/Emotion'
import LogicChain from '../exercises/level-1/logic-chain/LogicChain'
import Synonyms from '../exercises/level-1/synonyms/Synonyms'
import TongueTwister from '../exercises/level-1/tongue-twister/TongueTwister'
//level2
import JargonTask from '../exercises/level-2/jargon-task/JargonTask'
import SpeakingThread from '../exercises/level-2/speaking-thread/SpeakingThread'
import ToastMaster from '../exercises/level-2/toast-master/ToastMaster'
import JokeMaster from '../exercises/level-2/joke-master/JokeMaster'
import Taboo from '../exercises/level-2/taboo/Taboo'
import ScienceTranslator from '../exercises/level-2/science-translator/ScienceTranslator'
import KingFailure from '../exercises/level-2/king-failure/KingFailure'
import FearExplosive from '../exercises/level-2/fear-explosive/FearExplosive'
//level 3
import DebateTrainerAi from '../exercises/level-3/debate-trainer-ai/DebateTrainerAi'
import InterviewAi from '../exercises/level-3/interview-ai/InterviewAi'
import IcebreakerAi from '../exercises/level-3/icebreaker-ai/IcebreakerAi'
import TribuneAi from '../exercises/level-3/tribune-ai/TribuneAi'

const ExerciseRenderer = ({ exercise }) => {
  // Определяем, какой компонент отрисовать на основе типа из конфига
  switch (exercise.alias) {
    case 'association':
      return <Association alias={exercise.alias}/>
    case 'description':
      return <Description alias={exercise.alias}/>
    case 'tongue-twister':
      return <TongueTwister alias={exercise.alias}/>
    case 'synonyms':
      return <Synonyms alias={exercise.alias}/>
    case 'emotion':
      return <Emotion alias={exercise.alias}/>
    case 'logic-chain':
      return <LogicChain alias={exercise.alias}/>
    case 'jargon-task':
      return <JargonTask alias={exercise.alias}/>
    case 'speaking-thread':
      return <SpeakingThread alias={exercise.alias}/>
    case 'toast-master':
      return <ToastMaster alias={exercise.alias}/>
    case 'joke-master':
      return <JokeMaster alias={exercise.alias}/>
    case 'taboo':
      return <Taboo alias={exercise.alias}/>
    case 'science-translator':
      return <ScienceTranslator alias={exercise.alias}/>
    case 'fear-explosive':
      return <FearExplosive alias={exercise.alias}/>
    case 'king-failure':
      return <KingFailure alias={exercise.alias}/>
    case 'ai-debate':
      return <DebateTrainerAi alias={exercise.alias}/>
    case 'ai-interview':
      return <InterviewAi alias={exercise.alias}/>
    case 'ai-icebreaker':
      return <IcebreakerAi alias={exercise.alias}/>
    case 'ai-tribune':
      return <TribuneAi alias={exercise.alias}/>

    default:
      return (
        <div className={styles.unknown_ex}>
          <span>Неизвестный тип упражнения</span>
        </div>
      )
  }
}

export default ExerciseRenderer
