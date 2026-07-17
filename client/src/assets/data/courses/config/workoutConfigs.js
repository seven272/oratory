// src/config/workoutConfigs.js

import * as pitchThunks from '../../../../redux/slices/ai-courses-thunks/pitchThunks';
import * as objectionThunks from '../../../../redux/slices/ai-courses-thunks/objectionThunks';

// Собираем все санки в единый объект для динамического вызова по ключу
export const ALL_WORKOUT_THUNKS = { ...pitchThunks, ...objectionThunks };

export const WORKOUT_CONFIGS = {
  investor_pitch: {
    id: 'investor_pitch',
    title: '🤖 Питч-сессия с жестким инвестором',
    description: 'Симуляция встречи с венчурным фондом. ИИ будет перебивать, задавать неудобные вопросы о юнит-экономике.',
    reward: 'Цель: 500 XP суммарно',
    thunks: {
      start: 'fetchStartPitchTrainer',
      send: 'fetchSendPitchResponse',
      finish: 'fetchFinishPitchTrainer'
    },
    ui: {
      sessionLabel: 'Текущая сессия ИИ (Голосовой питч)',
      aiRoleName: 'Инвестор',
      thinkingText: '⏳ Инвестор слушает и думает...',
      finishText: '🗣️ Диалог подошел к концу. Инвестор готов выставить оценку.',
      finishButtonText: 'Получить вердикт инвестора',
      finishButtonLoadingText: 'Анализ питча нейросетью...'
    },
    criteria: [
      { key: 'structure', label: 'Структура' },
      { key: 'persuasion', label: 'Убедительность' }
    ]
  },

  objection_handler: {
    id: 'objection_handler',
    title: '🔥 Минное поле: Отработка возражений',
    description: 'Вам противостоит разгневанный, экономный или скептичный клиент. Спасите сделку и удержите позиции без оправданий.',
    reward: 'Цель: 600 XP суммарно',
    thunks: {
      start: 'fetchStartObjectionTrainer',
      send: 'fetchSendObjectionResponse',
      finish: 'fetchFinishObjectionTrainer'
    },
    ui: {
      sessionLabel: 'Текущая сессия ИИ (Работа с возражениями)',
      aiRoleName: 'Клиент',
      thinkingText: '⏳ Клиент формулирует ответ...',
      finishText: '🗣️ Переговоры завершены. Клиент принимает финальное решение.',
      finishButtonText: 'Узнать вердикт клиента',
      finishButtonLoadingText: 'Анализ диалога экспертом...'
    },
    criteria: [
      { key: 'empathy', label: 'Эмпатия' },
      { key: 'argumentation', label: 'Аргументация' }
    ]
  }
  
  // Сюда можно добавлять еще 10+ тренажеров по аналогии
};

// Преобразуем объект в массив для интро-экрана, чтобы не дублировать константы
export const WORKOUT_MODES_LIST = Object.values(WORKOUT_CONFIGS);
