import {commonParams} from './config'
import axios from 'axios'

export function getComments(cmd, pagenum, pagesize, songid) {
  const url = '/api/getComments'

  const data = Object.assign({}, commonParams, {
    g_tk: '626732535',
    jsonpCallback: 'jsoncallback5910265397486432',
    loginUin: 2733358560,
    hostUin: 0,
    format: 'jsonp',
    inCharset: 'utf8',
    outCharset: 'GB2312',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    cid: 205360772,
    reqtype: 2,
    biztype: 1,
    topid: songid,
    cmd: cmd,
    needmusiccrit: 0,
    pagenum: pagenum,
    pagesize: pagesize,
    lasthotcommentid: '',
    callback: 'jsoncallback5910265397486432',
    domain: 'qq.com',
    ct: 24,
    cv: 101010
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    let data = res.data
    if (typeof (data) === 'string') {
      let str = data.split('0265397486432(')[1]
      str = str.substring(0, str.length - 3)
      data = JSON.parse(str)
    }
    return Promise.resolve(data)
  })
}
