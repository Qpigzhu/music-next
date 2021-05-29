import  { get } from './base'

// 获取歌曲URL
export function processSongs(songs){
    // 歌曲为空
    if(!songs.length){
        return Promise.resolve(songs)
    }
    return get('/api/getSongsUrl',{
        mid:songs.map((song) =>{ // 获取每首歌的播放地址
            return song.mid
        })
    }).then((result)=>{
        const map = result.map
        return songs.map((song)=>{  // 每首歌的播放地址添加到数据中
            song.url = map[song.mid]
            return song
        }).filter((song)=>{ // 过滤不可播放的歌曲
            return song.url.indexOf('vkey') > -1
        })
    })
}

// 歌词获取
const lyricMap = {}
export function getLyric(song){
    if(song.lyric){
        return  Promise.resolve(song.lyric)
    }
    const mid = song.mid
    const lyric = lyricMap[mid]
    if(lyric){
        return Promise.resolve(lyric)
    }
    return get('/api/getLyric',{
        mid,
    }).then((result)=>{
        const lyric = result ? result.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
        lyricMap[mid] = lyric
        return lyric
    })
}