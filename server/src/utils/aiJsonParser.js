// utils/aiJsonParser.js

/**
 * Железобетонный каскадный парсер ответов GigaChat
 * @param {string} rawText - Сырой текстовый ответ от ИИ
 * @param {Object} defaultCriteria - Дефолтные критерии на случай критического сбоя ИИ (свои для каждого тренажера)
 * @returns {Object} - Распарсенный объект с полями totalScore, feedback и criteria
 */
const parseAiResponse = (rawText, defaultCriteria) => {
  let evaluation = null

  try {
    let jsonString = rawText.trim()

    // 1. Отрезаем маркдаун-обертки ```json ... ```, если ИИ их добавил
    jsonString = jsonString
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    // 💡 КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Если GigaChat обернул значение поля feedback в ёлочки «...»,
    // превращаем их в валидные двойные кавычки для JSON
    jsonString = jsonString.replace(/:\s*«([\s\S]*?)»/g, ': "$1"')

    // 2. Вырезаем строго блок от первой до последней фигурной скобки
    const jsonMatch = jsonString.match(/\{[\s\S]*\}/)
    if (!jsonMatch)
      throw new Error('Фигурные скобки JSON не найдены в ответе ИИ')
    jsonString = jsonMatch[0]

    // 3. Экранируем переносы строк внутри текстовых полей (превращаем в безопасный "\\n")
    jsonString = jsonString
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')

    // 4. Восстанавливаем служебный синтаксис JSON вокруг скобок, запятых и двоеточий
    jsonString = jsonString.replace(/,\s*\\n\s*"/g, ',\n"')
    jsonString = jsonString.replace(/\{\s*\\n\s*"/g, '{\n"')
    jsonString = jsonString.replace(/:\s*\{\s*\\n\s*"/g, ':{\n"')
    jsonString = jsonString.replace(/"\s*\\n\s*\}/g, '"\n}')
    jsonString = jsonString.replace(/\}\s*\\n\s*\}/g, '}\n}')

    // 5. Убираем одинарные кавычки внутри английских слов (например, English's -> Englishs)
    jsonString = jsonString.replace(/(\w)'(\w)/g, '$1$2')

    // Избавляемся от лишних пробелов/табов между ключами и значениями
    jsonString = jsonString.replace(/\s+/g, ' ')

    // Первая попытка мягкого парсинга
    evaluation = JSON.parse(jsonString)
  } catch (error) {
    console.warn(
      '⚠️ Ошибка первого этапа парсинга ИИ, пробуем агрессивный фоллбек:',
      error.message,
    )

    try {
      // 6. Агрессивный фоллбек: если ИИ тотально сломал кавычки,
      // заменяем все ёлочки на двойные кавычки (так как значения полей важнее)
      let safeJson = rawText
        .replace(/[«»]/g, '"')
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')

      const jsonMatchFallback = safeJson.match(/\{[\s\S]*\}/)
      let finalFallbackString = jsonMatchFallback
        ? jsonMatchFallback[0]
        : safeJson

      finalFallbackString = finalFallbackString
        .replace(/\r?\n|\r/g, ' ')
        .replace(/\s+/g, ' ')

      evaluation = JSON.parse(finalFallbackString)
    } catch (fallbackError) {
      console.error(
        '❌ Критический слом формата GigaChat. Аварийный выход на дефолты.',
        fallbackError.message,
      )
    }
  }

  // 7. Если оба этапа парсинга провалились — возвращаем безопасный объект-заглушку
  if (!evaluation) {
    evaluation = {
      totalScore: 50,
      feedback:
        'Ваше выступление сохранено, но ИИ не смог сформировать детальный текстовый отчет из-за сбоя формата. Начислены базовые баллы.',
      criteria: defaultCriteria,
    }
  }

  return evaluation
}

export { parseAiResponse }
