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

// 不同列表下的歌曲可能 mid 相同，mid 相同的歌曲是同一首歌，歌词也一样，那么使用映射来存储已经获取过的歌词，下次请求时查看映射中是否请求过当前 mid 的歌词
const lyricMap = {}

export function getLyric (song) {
  // 如果歌曲本身已经有歌词了，直接返回 resolved 状态的 promise
  if (song.lyric) return Promise.resolve(song.lyric)

  const mid = song.mid

  // 如果映射中存在当前 mid 的歌词，直接返回
  const lyric = lyricMap[mid]
  if (lyric) return Promise.resolve(lyric)

  return get('/api/getLyric', {
    mid
  }).then(res => {
    const lyric = res ? res.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
    lyricMap[mid] = lyric
    return lyric
  })
}
