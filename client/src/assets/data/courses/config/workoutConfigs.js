// src/config/workoutConfigs.js

import * as pitchThunks from '../../../../redux/slices/ai-courses-thunks/pitchThunks'
import * as objectionThunks from '../../../../redux/slices/ai-courses-thunks/objectionThunks'
import * as networkingThunks from '../../../../redux/slices/ai-courses-thunks/networkingThunks'
import * as vipCloseThunks from '../../../../redux/slices/ai-courses-thunks/vipCloseThunks'
import * as hrScreenerThunks from '../../../../redux/slices/ai-courses-thunks/hrScreenerThunks'
import * as stressInterviewThunks from '../../../../redux/slices/ai-courses-thunks/stressInterviewThunks'
import * as barSmallTalkThunks from '../../../../redux/slices/ai-courses-thunks/barSmallTalkThunks'
import * as vipAfterpartyThunks from '../../../../redux/slices/ai-courses-thunks/vipAfterpartyThunks'
// Собираем все санки в единый объект для динамического вызова по ключу
export const ALL_WORKOUT_THUNKS = {
  ...pitchThunks,
  ...objectionThunks,
  ...networkingThunks,
  ...vipCloseThunks,
  ...hrScreenerThunks,
  ...stressInterviewThunks,
  ...barSmallTalkThunks,
  ...vipAfterpartyThunks,
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
  vip_client_close: {
    id: 'vip_client_close',
    title: '👑 Встреча на миллион: Закрытие VIP-клиента',
    description:
      'Плотный деловой созвон или встреча в ресторане с потенциальным крупным заказчиком. Он выделил вам 5 минут. Задача — презентовать себя через кейсы, выявить его главную боль и закрыть на полноценный аудит/консалтинг.',
    reward: 'Цель: 500 очков суммарно',
    thunks: {
      start: 'fetchStartVipClose',
      send: 'fetchSendVipResponse',
      finish: 'fetchFinishVipClose',
    },
    ui: {
      sessionLabel: 'Деловые переговоры с VIP',
      aiRoleName: 'Потенциальный заказчик',
      thinkingText: '⏳ Заказчик оценивает ваше предложение...',
      finishText:
        '🗣️ Встреча подошла к концу. Клиент принимает решение по следующему шагу.',
      finishButtonText: 'Посмотреть разбор переговоров',
      finishButtonLoadingText:
        'Нейросеть сканирует ваши аргументы...',
    },
    criteria: [
      {
        key: 'usp',
        label: 'УТП (Понятно ли ваше отличие от конкурентов)',
      },
      {
        key: 'painFocus',
        label:
          'Фокус на боли (Насколько питч попал в проблему клиента)',
      },
    ],
  },
  hr_screener: {
    id: 'hr_screener',
    title: '📞 Первичный HR-скрининг: Чат-интервью',
    description:
      'Симуляция первого созвона с рекрутером. ИИ будет проверять вашу адекватность, базовые софт-скиллы и соответствие резюме.',
    reward: 'Цель: 500 очков суммарно',
    thunks: {
      start: 'fetchStartHrScreener',
      send: 'fetchSendHrScreenerResponse',
      finish: 'fetchFinishHrScreener',
    },
    ui: {
      sessionLabel: 'Первичный скрининг (Голосовое интервью)',
      aiRoleName: 'HR-Рекрутер',
      thinkingText: '⏳ Рекрутер делает пометки в резюме...',
      finishText:
        '🗣️ Первичный созвон окончен. Рекрутер формирует фидбэк для нанимающего менеджера.',
      finishButtonText: 'Посмотреть отчет рекрутера',
      finishButtonLoadingText: 'ИИ анализирует ваши софт-скиллы...',
    },
    criteria: [
      {
        key: 'softSkills',
        label: 'Софт-скиллы (Адекватность и самопрезентация)',
      },
      {
        key: 'starStructure',
        label: 'Структура STAR (Логика изложения опыта)',
      },
    ],
  },
  stress_interview: {
    id: 'stress_interview',
    title: '🔥 Стресс-интервью с будущим боссом',
    description:
      'Жесткий разговор с руководителем отдела. ИИ начнет давить, цепляться к пробелам в резюме и детально расспрашивать про ваши факапы.',
    reward: 'Цель: 500 очков суммарно',
    thunks: {
      start: 'fetchStartStressInterview',
      send: 'fetchSendStressResponse',
      finish: 'fetchFinishStressInterview',
    },
    ui: {
      sessionLabel: 'Стресс-собеседование (Работа под давлением)',
      aiRoleName: 'Руководитель отдела',
      thinkingText: '⏳ Босс оценивает ваши аргументы...',
      finishText:
        '🗣️ Интервью подошло к концу. Руководитель принимает финальное решение по вашей кандидатуре.',
      finishButtonText: 'Посмотреть разбор стресс-теста',
      finishButtonLoadingText:
        'Нейросеть сканирует вашу стрессоустойчивость...',
    },
    criteria: [
      {
        key: 'stressResistance',
        label:
          'Стрессоустойчивость (Реакция на давление и каверзные вопросы)',
      },
      {
        key: 'reflection',
        label:
          'Рефлексия (Умение признавать и разбирать свои ошибки)',
      },
    ],
  },
  /* ==========================================================================
     🥂 КУРС: Харизма нетворкинга: Свой в любой компании (party_charisma)
     ========================================================================== */
  bar_small_talk: {
    id: 'bar_small_talk',
    title: '🍹 Разговор у барной стойки',
    description:
      'Растопите лед в общении с незнакомцем на неформальной вечеринке. Завяжите непринужденный разговор ни о чем и плавно найдите общие темы.',
    reward: 'Цель: 500 очков суммарно',
    thunks: {
      start: 'fetchStartBarSmallTalk',
      send: 'fetchSendBarSmallTalkResponse',
      finish: 'fetchFinishBarSmallTalk',
    },
    ui: {
      sessionLabel: 'Неформальный Small Talk (У стойки бара)',
      aiRoleName: 'Собеседник у бара',
      thinkingText: '⏳ Собеседник делает глоток и отвечает...',
      finishText:
        '🗣️ Легкая беседа завершается. Собеседник оценивает, насколько комфортно и интересно было с вами общаться.',
      finishButtonText: 'Посмотреть анализ Small Talk',
      finishButtonLoadingText:
        'Нейросеть измеряет вашу легкость в общении...',
    },
    criteria: [
      {
        key: 'iceBreaking',
        label:
          'Растапливание льда (Ситуативный старт и естественность)',
      },
      {
        key: 'conversationalFlow',
        label: 'Плавность диалога (Умение слушать и передавать мяч)',
      },
    ],
  },
  vip_afterparty: {
    id: 'vip_afterparty',
    title: '🥂 Закрытое афтерпати лидеров',
    description:
      'Вклиньтесь в закрытый круг топ-менеджеров или инфлюенсеров. Органично заявите о себе без душной экспертности и договоритесь о кофе.',
    reward: 'Цель: 500 очков суммарно',
    thunks: {
      start: 'fetchStartVipAfterparty',
      send: 'fetchSendVipAfterpartyResponse',
      finish: 'fetchFinishVipAfterparty',
    },
    ui: {
      sessionLabel: 'Общение на VIP-афтерпати (Высокий статус)',
      aiRoleName: 'VIP-Гость / Лидер мнений',
      thinkingText: '⏳ Собеседник оценивает вашу харизму...',
      finishText:
        '🗣️ Время экспресс-знакомства вышло. Лидеры мнений принимают решение, стоит ли добавлять вас в контакты.',
      finishButtonText: 'Узнать вердикт VIP-круга',
      finishButtonLoadingText:
        'ИИ сканирует ваш харизматический статус...',
    },
    criteria: [
      {
        key: 'charismaStatus',
        label: 'Харизматический статус (Уверенность на равных)',
      },
      {
        key: 'ecologicalExit',
        label:
          'Экологичный выход (Красивый финал и фиксация контакта)',
      },
    ],
  },
}

// Преобразуем объект в массив для интро-экрана, чтобы не дублировать константы
export const WORKOUT_MODES_LIST = Object.values(WORKOUT_CONFIGS)
