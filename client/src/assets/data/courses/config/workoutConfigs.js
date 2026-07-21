// src/config/workoutConfigs.js

import * as pitchThunks from '../../../../redux/slices/ai-courses-thunks/pitchThunks'
import * as objectionThunks from '../../../../redux/slices/ai-courses-thunks/objectionThunks'

// Собираем все санки в единый объект для динамического вызова по ключу
export const ALL_WORKOUT_THUNKS = {
  ...pitchThunks,
  ...objectionThunks,
}

export const WORKOUT_CONFIGS = {
  investor_pitch: {
    id: 'investor_pitch',
    title: '🤖 Питч-сессия с жестким инвестором',
    description:
      'Симуляция встречи с венчурным фондом. ИИ будет перебивать, задавать неудобные вопросы о юнит-экономике.',
    reward: 'Цель: 500 XP суммарно',
    thunks: {
      start: 'fetchStartPitchTrainer',
      send: 'fetchSendPitchResponse',
      finish: 'fetchFinishPitchTrainer',
    },
    ui: {
      sessionLabel: 'Текущая сессия ИИ (Голосовой питч)',
      aiRoleName: 'Инвестор',
      thinkingText: '⏳ Инвестор слушает и думает...',
      finishText:
        '🗣️ Диалог подошел к концу. Инвестор готов выставить оценку.',
      finishButtonText: 'Получить вердикт инвестора',
      finishButtonLoadingText: 'Анализ питча нейросетью...',
    },
    criteria: [
      { key: 'structure', label: 'Структура' },
      { key: 'persuasion', label: 'Убедительность' },
    ],
  },

  objection_handler: {
    id: 'objection_handler',
    title: '🔥 Минное поле: Отработка возражений',
    description:
      'Вам противостоит разгневанный, экономный или скептичный клиент. Спасите сделку и удержите позиции без оправданий.',
    reward: 'Цель: 600 XP суммарно',
    thunks: {
      start: 'fetchStartObjectionTrainer',
      send: 'fetchSendObjectionResponse',
      finish: 'fetchFinishObjectionTrainer',
    },
    ui: {
      sessionLabel: 'Текущая сессия ИИ (Работа с возражениями)',
      aiRoleName: 'Клиент',
      thinkingText: '⏳ Клиент формулирует ответ...',
      finishText:
        '🗣️ Переговоры завершены. Клиент принимает финальное решение.',
      finishButtonText: 'Узнать вердикт клиента',
      finishButtonLoadingText: 'Анализ диалога экспертом...',
    },
    criteria: [
      { key: 'empathy', label: 'Эмпатия' },
      { key: 'argumentation', label: 'Аргументация' },
    ],
  },
  elevator_pitch: {
    id: 'elevator_pitch',
    title: '🚀 Elevator Pitch: Зацепить за 45 секунд',
    description:
      'Вы сталкиваетесь в лифте или кулуарах с топовым инвестором, крупным клиентом или потенциальным партнером. У вас есть считанные секунды, чтобы кратко заявить о себе, вызвать жгучий интерес и получить визитку.',
    reward: 'Цель: 500 очков суммарно',
    thunks: {
      start: 'fetchStartElevatorPitch', // Соответствующие санки в вашем слайсе
      send: 'fetchSendElevatorResponse',
      finish: 'fetchFinishElevatorPitch',
    },
    ui: {
      sessionLabel: 'Мини-презентация (Elevator Pitch)',
      aiRoleName: 'Слушатель (VIP)',
      thinkingText: '⏳ Собеседник обдумывает ваши слова...',
      finishText:
        '🗣️ Лифт приехал / беседа окончена. Собеседник делает выводы.',
      finishButtonText: 'Узнать вердикт собеседника',
      finishButtonLoadingText: 'Нейросеть оценивает силу питча...',
    },
    criteria: [
      {
        key: 'clarity',
        label: 'Ясность (Понятно ли, чем вы заняты)',
      },
      { key: 'hook', label: 'Крючок (Зацепила ли интрига)' },
    ],
  },

  // 2. ТРЕНАЖЕР: НЕТВОРКИНГ НА КОНФЕРЕНЦИИ
  networking_expert: {
    id: 'networking_expert',
    title: '🤝 Нетворкинг-мастер: Бизнес-знакомство',
    description:
      'Вы на профильной конференции. Вокруг сотни экспертов и заказчиков. Ваша задача — уверенно подойти, познакомиться, кратко донести свою ценность по формуле "Польза + Кейс" и договориться о созвоне.',
    reward: 'Цель: 500 очков суммарно',
    thunks: {
      start: 'fetchStartNetworking',
      send: 'fetchSendNetworkingResponse',
      finish: 'fetchFinishNetworking',
    },
    ui: {
      sessionLabel: 'Диалог на конференции',
      aiRoleName: 'Эксперт / Заказчик',
      thinkingText: '⏳ Собеседник отвечает...',
      finishText:
        '🗣️ Обмен контактами завершен. Собеседник оценивает ваш профессионализм.',
      finishButtonText: 'Посмотреть разбор знакомства',
      finishButtonLoadingText: 'Экспертный анализ диалога...',
    },
    criteria: [
      {
        key: 'positioning',
        label: 'Позиционирование (Ваша ценность)',
      },
      {
        key: 'callToAction',
        label: 'Призыв к действию (Оффер/Контакты)',
      },
    ],
  },
    // 3. ТРЕНАЖЕР: ВСТРЕЧА НА МИЛЛИОН (ЗАКРЫТИЕ VIP-КЛИЕНТА)
  vip_client_close: {
    id: 'vip_client_close',
    title: '👑 Встреча на миллион: Закрытие VIP-клиента',
    description: 'Плотный деловой созвон или встреча в ресторане с потенциальным крупным заказчиком. Он выделил вам 5 минут. Задача — презентовать себя через кейсы, выявить его главную боль и закрыть на полноценный аудит/консалтинг.',
    reward: 'Цель: 500 очков суммарно',
    thunks: {
      start: 'fetchStartVipClose',
      send: 'fetchSendVipResponse',
      finish: 'fetchFinishVipClose'
    },
    ui: {
      sessionLabel: 'Деловые переговоры с VIP',
      aiRoleName: 'Потенциальный заказчик',
      thinkingText: '⏳ Заказчик оценивает ваше предложение...',
      finishText: '🗣️ Встреча подошла к концу. Клиент принимает решение по следующему шагу.',
      finishButtonText: 'Посмотреть разбор переговоров',
      finishButtonLoadingText: 'Нейросеть сканирует ваши аргументы...'
    },
    criteria: [
      { key: 'usp', label: 'УТП (Понятно ли ваше отличие от конкурентов)' },
      { key: 'painFocus', label: 'Фокус на боли (Насколько питч попал в проблему клиента)' }
    ]
  }
}

// Преобразуем объект в массив для интро-экрана, чтобы не дублировать константы
export const WORKOUT_MODES_LIST = Object.values(WORKOUT_CONFIGS)
