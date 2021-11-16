import { get } from './base'

/**
 * 将歌曲列表中的歌曲 mid 解析为数组请求歌曲 url
 * @param {Array} songs 歌曲列表
 */
export function processSongs (songs) {
  if (!songs.length) return Promise.resolve(songs)

  return get('/api/getSongsUrl', {
    mid: songs.map(song => song.mid)
  }).then(res => {
    const map = res.map

    return songs.map(song => {
      // map 是经过本地 node server 处理的一个歌曲 mid 对歌曲 url 的映射
      song.url = map[song.mid]
      return song
    }).filter(song => song.url.includes('vkey')) // 如果歌曲 url 是有效的，那么 url 里面一定含有 vkey 这个字符串，如果没有则是无效 url，需要排除
  })
}
