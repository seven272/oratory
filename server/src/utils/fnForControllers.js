// Мягкая прогрессия: каждый уровень требует на 500 XP больше предыдущего
const getXpThreshold = (level) => {
  if (level <= 1) return 1000
  return 1000 + (level - 1) * 500
}

export { getXpThreshold }
