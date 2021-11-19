import storage from 'good-storage'

function insertArrayItem (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index >= 0) return
  if (maxLen && arr.length >= maxLen) {
    arr.pop()
  }
  arr.unshift(val)
}

export function save (item, key, compare, maxLen) {
  const list = storage.get(key, []) // 获取 key 对应的列表，如果没有则初始化一个空数组
  insertArrayItem(list, item, compare, maxLen)
  storage.set(key, list)
  return list
}

function removeArrayItem (arr, compare) {
  const index = arr.findIndex(compare)

  if (index === -1) return

  arr.splice(index, 1)
}

export function remove (key, compare) {
  const list = storage.get(key, []) // 获取 key 对应的列表，如果没有则初始化一个空数组
  removeArrayItem(list, compare)
  storage.set(key, list)
  return list
}

export function load (key) {
  return storage.get(key, [])
}
