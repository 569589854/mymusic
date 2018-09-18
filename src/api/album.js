import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getAlbumsList(mid) {
  const url = '/api/getAlbum'

  const data = Object.assign({}, commonParams, {
    callback: 'getUCGI7326849970818405',
    jsonpCallback: 'getUCGI7326849970818405',
    g_tk: 626732535,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    data: `{"singerAlbum":{"method":"get_singer_album","param":{"singermid":"${mid}","order":"time","begin":0,"num":30,"exstatus":1},"module":"music.web_singer_info_svr"}}`
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    let data = res.data
    if (typeof (data) === 'string') {
      let str = data.split('data":{')[1]
      str = str.split('}]}],')[0]
      str = str + '}]}]'
      str = '{' + str + '}'
      data = JSON.parse(str)
    }
    // console.log(data)
    return Promise.resolve(data)
  })
}

export function getAlbumSongs(mid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg'

  const data = Object.assign({}, commonParams, {
    albummid: mid,
    loginUin: 2733358560,
    g_tk: 626732535,
    inCharset: 'utf8',
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  })
  return jsonp(url, data, options)
}
