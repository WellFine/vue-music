import { get } from './base'

export function getSingerList () {
  return get('/api/getSingerList')
}

// 获取歌手详情，即歌手的歌曲列表，但歌曲列表不包含歌曲播放 url，需通过 ./song.js 的 processSongs 获取
export function getSingerDetail (singer) {
  return get('/api/getSingerDetail', {
    mid: singer.mid
  })
}
