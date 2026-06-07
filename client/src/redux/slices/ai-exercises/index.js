import debateSlice from './debateSlice'
import interviewSlice from './interviewSlice'
import icebreakerSlice from './icebreakerSlice'
import tribuneSlice from './tribuneSlice'
import alibiSlice from './alibiSlice'
import bargainSlice from './bargainSlice'
import knockoutSlice from './knockoutSlice'

// Экспортируем единый объект со всеми ИИ-редюсерами
const aiSlices = {
  debate: debateSlice,
  interview: interviewSlice,
  icebreaker: icebreakerSlice,
  tribune: tribuneSlice,
  alibi: alibiSlice,
  bargain: bargainSlice,
  knockout: knockoutSlice,
}

export default aiSlices
