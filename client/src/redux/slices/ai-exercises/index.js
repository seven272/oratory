

import debateSlice from './debateSlice'
import interviewSlice from './interviewSlice'
import icebreakerSlice from './icebreakerSlice'
import tribuneSlice from './tribuneSlice'
// По мере разработки 7 новых тренажеров, вы будете просто дописывать их импорты сюда:
// import manipulationSlice from './manipulationSlice'

// Экспортируем единый объект со всеми ИИ-редюсерами
 const aiSlices = {
  debate: debateSlice,
  interview: interviewSlice,
  icebreaker: icebreakerSlice,
  tribune: tribuneSlice,
  // manipulation: manipulationSlice,
}

export default aiSlices
