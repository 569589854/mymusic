export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// 时间戳转化 php
export function formatDateTime(timeStamp) {
  var date = new Date()
  date.setTime(timeStamp * 1000)
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  m = m < 10 ? ('0' + m) : m
  var d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  var h = date.getHours()
  h = h < 10 ? ('0' + h) : h
  var minute = date.getMinutes()
  var second = date.getSeconds()
  minute = minute < 10 ? ('0' + minute) : minute
  second = second < 10 ? ('0' + second) : second
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
}

// 日期格式转换 js
export function formatDate(date, fmt) {
  // 年份2016 特殊处理
  if (/(y+)/.test(fmt)) {
    // RegExp.$1 -> yyyy 第一个匹配到的子表达式 RegExp 会不断更新
    fmt = fmt.replace(RegExp.$1, date.getFullYear() + '')
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    // 定义一个新的正则匹配  M+,d+...
    let reg = new RegExp(`(${k})`)
    // 转为字符串
    let str = o[k] + ''
    if (reg.test(fmt)) {
      // yyyy-m-dd -> str, yyyy-mm-dd -> addZero
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : addZero(str))
    }
  }
  return fmt
}

function addZero(str) {
  // RegExp.$1.length === 1 要求显示 2016-7-23
  // 09 -> 0009.substr(2) -> 09,  9 -> 009.substr(1) -> 09
  return ('00' + str).substr(str.length)
}

// 洗牌函数 打乱顺序
export function shuffle(arr) {
  // 创造一个副本 防止修改
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let tmp = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = tmp
  }
  return _arr
}

// 函数节流: 是指一定时间内js方法只跑一次。比如人的眨眼睛，就是一定时间内眨一次。这是函数节流最形象的解释。一定时间间隔 3-9次
// 函数防抖: 是指频繁触发的情况下，只有足够的空闲时间，才执行代码一次。 滚动停止时 1次
// 函数防抖
export function debounce(func, delay) {
  let timer = null
  let self = this
  return function (...args) {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(self, args)
    }, delay)
  }
}

/**
 函数节流
 var canRun = true
 document.getElementById('throttle').onscroll = function () {
  if (!canRun) {
    // 判断是否已空闲，如果在执行中，则直接return
    return
  }

  canRun = false
  setTimeout(function () {
    console.log('函数节流')
    canRun = true
  }, 300)
}

 // 函数防抖
 var timer = false
 document.getElementById('debounce').onscroll = function () {
  clearTimeout(timer) // 清除未执行的代码，重置回初始化状态

  timer = setTimeout(function () {
    console.log('函数防抖')
  }, 300)
}
 **/
