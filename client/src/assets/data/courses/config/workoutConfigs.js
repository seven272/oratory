// src/config/workoutConfigs.js

import * as pitchThunks from '../../../../redux/slices/ai-courses-thunks/pitchThunks'
import * as objectionThunks from '../../../../redux/slices/ai-courses-thunks/objectionThunks'
import * as networkingThunks from '../../../../redux/slices/ai-courses-thunks/networkingThunks'
import * as vipCloseThunks from '../../../../redux/slices/ai-courses-thunks/vipCloseThunks'
import * as hrScreenerThunks from '../../../../redux/slices/ai-courses-thunks/hrScreenerThunks'
import * as stressInterviewThunks from '../../../../redux/slices/ai-courses-thunks/stressInterviewThunks'
import * as barSmallTalkThunks from '../../../../redux/slices/ai-courses-thunks/barSmallTalkThunks'
import * as vipAfterpartyThunks from '../../../../redux/slices/ai-courses-thunks/vipAfterpartyThunks'
import * as toxicRelativeThunks from '../../../../redux/slices/ai-courses-thunks/toxicRelativeThunks.js'
import * as streetRudenessThunks from '../../../../redux/slices/ai-courses-thunks/streetRudenessThunks.js'
import * as trollHandlerThunks from '../../../../redux/slices/ai-courses-thunks/trollHandlerThunks'
import * as timeLimitPitchThunks from '../../../../redux/slices/ai-courses-thunks/timeLimitPitchThunks'
import * as impromptuToastThunks from '../../../../redux/slices/ai-courses-thunks/impromptuToastThunks'
import * as weddingChallengeThunks from '../../../../redux/slices/ai-courses-thunks/weddingChallengeThunks'


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
  ...toxicRelativeThunks,
  ...streetRudenessThunks,
  ...trollHandlerThunks,
  ...timeLimitPitchThunks,
  ...impromptuToastThunks,
  ...weddingChallengeThunks
  
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
  toxic_relative: {
    id: 'toxic_relative',
    title: '👵 Манипуляции близких: Пассивная агрессия',
    description:
      'Очертите жесткие личные границы в разговоре с токсичным родственником или соседом, не скатываясь в чувство вины.',
    reward: 'Цель: 500 очков суммарно',
    thunks: {
      start: 'fetchStartToxicRelative',
      send: 'fetchSendToxicRelativeResponse',
      finish: 'fetchFinishToxicRelative',
    },
    ui: {
      sessionLabel: 'Семейные границы (Защита от манипуляций)',
      aiRoleName: 'Родственник / Сосед',
      thinkingText: '⏳ Собеседник подбирает аргументы...',
      finishText:
        '🗣️ Разговор подошел к финалу. Собеседник оценивает твердость ваших границ.',
      finishButtonText: 'Посмотреть разбор границ',
      finishButtonLoadingText:
        'ИИ сканирует манипулятивные маркеры...',
    },
    criteria: [
      {
        key: 'stressResistance',
        label: 'Стрессоустойчивость (Выдержка)',
      },
      {
        key: 'reflection',
        label: 'Удержание границ (Отказ без вины)',
      },
    ],
  },
  street_rudeness: {
    id: 'street_rudeness',
    title: '🛑 Жесткое хамство «в поле»',
    description:
      'Примените техники психологического айкидо при столкновении с агрессивным хамом в МФЦ, на парковке или в сфере услуг.',
    reward: 'Цель: 500 очков суммарно',
    thunks: {
      start: 'fetchStartStreetRudeness',
      send: 'fetchSendStreetRudenessResponse',
      finish: 'fetchFinishStreetRudeness',
    },
    ui: {
      sessionLabel: 'Бытовой конфликт (Отражение хамства)',
      aiRoleName: 'Агрессивный персонаж',
      thinkingText: '⏳ Хам реагирует на ваше спокойствие...',
      finishText:
        '🗣️ Словесная стычка завершена. Нейросеть оценивает ваше хладнокровие.',
      finishButtonText: 'Посмотреть анализ конфликта',
      finishButtonLoadingText: 'Психологический аудит диалога...',
    },
    criteria: [
      {
        key: 'stressResistance',
        label: 'Стрессоустойчивость (Хладнокровие)',
      },
      { key: 'reflection', label: 'Амортизация конфликта (Айкидо)' },
    ],
  },
  troll_handler: {
    id: 'troll_handler',
    title: '🤬 Отражение троллинга из зала',
    description:
      'Харизматично перехватить инициативу и отбить каверзные или едкие выкрики скептиков во время вашего публичного вебинара.',
    reward: 'Цель: 500 очков суммарно',
    thunks: {
      start: 'fetchStartTrollHandler',
      send: 'fetchSendTrollResponse',
      finish: 'fetchFinishTrollHandler',
    },
    ui: {
      sessionLabel: 'Прямой эфир (Работа с хейтом)',
      aiRoleName: 'Хейтер / Скептик',
      thinkingText: '⏳ Оппонент формулирует едкую реплику...',
      finishText:
        '🗣️ Словесный поединок окончен. Аудитория оценивает ваше доминирование.',
      finishButtonText: 'Посмотреть разбор атаки',
      finishButtonLoadingText: 'Нейросеть сканирует вашу харизму...',
    },
    criteria: [
      { key: 'trollHandler', label: 'Отражение хейта (Харизма)' },
      {
        key: 'timeLimit',
        label: 'Перехват инициативы (Уверенность)',
      },
    ],
  },
  time_limit_pitch: {
    id: 'time_limit_pitch',
    title: '⏳ Спич в условиях цейтнота',
    description:
      'Уверенно презентовать свой проект перед экспертным комитетом, который постоянно перебивает, и уложиться строго в лимит.',
    reward: 'Цель: 500 очков суммарно',
    thunks: {
      start: 'fetchStartTimeLimitPitch', send: 'fetchSendTimeLimitResponse', finish: 'fetchFinishTimeLimitPitch' 
    },
    ui: {
      sessionLabel: 'Защита проекта (Блиц-интервью)',
      aiRoleName: 'Член комитета',
      thinkingText: '⏳ Эксперт перебивает и задает вопрос...',
      finishText:
        '🗣️ Время вышло. Комитет удаляется для подсчета ваших баллов.',
      finishButtonText: 'Посмотреть вердикт комитета',
      finishButtonLoadingText: 'Анализ структуры спича нейросетью...',
    },
    criteria: [
      { key: 'trollHandler', label: 'Логика изложения (Структура)' },
      { key: 'timeLimit', label: 'Тайм-менеджмент (Цейтнот)' },
    ],
  },

  /* ==========================================================================
     🥂 КУРС 7: Король застолья: Искусство тостов (toast_master)
     ========================================================================== */
  impromptu_toast: {
    id: 'impromptu_toast',
    title: '🎤 Внезапное слово на корпоративе',
    description:
      'За 15 секунд сориентироваться, когда ведущий праздника неожиданно передает вам микрофон перед всем руководством.',
    reward: 'Цель: 500 очков суммарно',
    thunks: {
     start: 'fetchStartImpromptuToast', send: 'fetchSendImpromptuResponse', finish: 'fetchFinishImpromptuToast'
    },
    ui: {
      sessionLabel: 'Корпоративное застолье (Экспромт)',
      aiRoleName: 'Ведущий вечера',
      thinkingText: '⏳ Зал затихает в ожидании продолжения...',
      finishText:
        '🗣️ Микрофон выключен. Коллеги оценивают ваше остроумие.',
      finishButtonText: 'Посмотреть разбор экспромта',
      finishButtonLoadingText: 'Нейросеть сканирует уровень юмора...',
    },
    criteria: [
      { key: 'impromptu', label: 'Речевая мобилизация (Скорость)' },
      { key: 'wedding', label: 'Уместность и юмор' },
    ],
  },
  wedding_challenge: {
    id: 'wedding_challenge',
    title: '🍾 Свадебный тост / Юбилей',
    description:
      'Удержать внимание разношерстной, шумящей или отвлеченной аудитории, связав личную историю с виновником торжества.',
    reward: 'Цель: 500 очков суммарно',
    thunks: {
     start: 'fetchStartWeddingChallenge', send: 'fetchSendWeddingResponse', finish: 'fetchFinishWeddingChallenge'
    },
    ui: {
      sessionLabel: 'Праздничный банкет (Работа с залом)',
      aiRoleName: 'Шумный гость / Зал',
      thinkingText: '⏳ Зал реагирует на вашу историю...',
      finishText:
        '🗣️ Бокалы подняты. Гости оценивают душевность вашей речи.',
      finishButtonText: 'Посмотреть разбор тоста',
      finishButtonLoadingText:
        'ИИ анализирует праздничный сторителлинг...',
    },
    criteria: [
      { key: 'impromptu', label: 'Праздничный сторителлинг' },
      { key: 'wedding', label: 'Удержание внимания толпы' },
    ],
  },
}

// Преобразуем объект в массив для интро-экрана, чтобы не дублировать константы
export const WORKOUT_MODES_LIST = Object.values(WORKOUT_CONFIGS)
