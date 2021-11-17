// 洗牌算法复制数组 source，打乱新数组并返回
export function shuffle (source) {
  const arr = source.slice() // 避免影响原数组

  for (let i = 0; i < arr.length; i++) swap(arr, i, getRandomInt(i))

  return arr
}

function getRandomInt (max) {
  return Math.floor(Math.random() * (max + 1))
}

function swap (arr, i, j) {
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}
