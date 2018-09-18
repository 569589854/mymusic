<template>
  <div class="music-list" ref="musicList">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bg_Image" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" @click="playRandom" ref="playBtn" v-show="songs.length>0 && currentIndex===0 || showDetail">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
        <switches v-show="showFlag && hasAlbum" @switch="switchItem" class="switches" :currentIndex="currentIndex"
                  :switches="switches"></switches>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer">
    </div>
    <scroll v-show="currentIndex===0" @scroll="scroll" :listenScroll="listenScroll" :probeType="probeType" :data="songs"
            class="list" ref="list">
      <div class="song-list-wrapper">
        <song-list @select="selectItem" :rank="rank" :songs="songs"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <Loading></Loading>
      </div>
    </scroll>
    <scroll ref="AlbumList" v-show="currentIndex===1" @scroll="scroll" :listenScroll="listenScroll" :probeType="probeType" :data="albums" class="list">
      <div class="album-list">
        <ul>
          <li @click="selectAItem(item)" :key="index" v-for="(item,index) in albums" class="item">
            <div class="icon">
              <img width="60" height="60"
                   :src="'https://y.gtimg.cn/music/photo_new/T002R300x300M000' + item.album_mid + '.jpg?max_age=2592000'">
            </div>
            <div class="text">
              <h2 class="name" v-html="item.album_name"></h2>
              <p class="desc" v-html="item.pub_time"></p>
            </div>
          </li>
        </ul>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <Loading></Loading>
      </div>
    </scroll>
    <scroll ref="AlbumSongList" v-show="showDetail" @scroll="scroll" :listenScroll="listenScroll" :probeType="probeType" :data="albumSong" class="list">
      <album-song @select="selectSItem" :songs="albumSong"></album-song>
      <div class="loading-container" v-show="!songs.length">
        <Loading></Loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import Switches from 'base/switches/switches'
import Loading from 'base/loading/loading'
import AlbumSong from 'components/album-song/album-song'
import {mapActions} from 'vuex'
import {playListMixin} from 'common/js/mixin'
import {getAlbumSongs} from 'api/album'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'

const IMAGE_HEIGHT = 40
export default {
  mixins: [playListMixin],
  props: {
    songs: {
      type: Array,
      default: function () {
        return []
      }
    },
    albums: {
      type: Array,
      default: function () {
        return []
      }
    },
    bgImage: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    },
    hasAlbum: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scrollY: 0,
      switches: [
        {name: '热门歌曲'},
        {name: '个人专辑'}
      ],
      currentIndex: 0,
      showFlag: true,
      albumSong: [],
      showDetail: false
    }
  },
  computed: {
    bg_Image() {
      return `background-image:url(${this.bgImage})`
    }
  },
  methods: {
    _normalizeSongs(list) {
      let ret = []
      list.forEach((item) => {
        ret.push(createSong(item))
      })
      return ret
    },
    // 专辑中歌曲操作
    selectSItem(item, index) {
      this.selectPlay({
        list: this.albumSong,
        index: index
      })
      setTimeout(() => {
        this.$refs.AlbumSongList.refresh()
      })
    },
    // 专辑操作
    selectAItem(item) {
      // bug处理 默认跳转至默认位置
      this.scrollY = 10
      this.showDetail = true
      this.currentIndex = -1
      getAlbumSongs(item.album_mid).then((res) => {
        if (res.code === ERR_OK) {
          this.albumSong = this._normalizeSongs(res.data.list)
        }
      })
    },
    switchItem(index) {
      this.scrollY = 10
      this.showDetail = false
      this.currentIndex = index
      setTimeout(() => {
        this.$refs.list.refresh()
        this.$refs.AlbumList.refresh()
      }, 200)
    },
    handlePlaylist(playList) {
      let bottom = playList.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.AlbumList.$el.style.bottom = bottom
      this.$refs.AlbumSongList.$el.style.bottom = bottom
      this.$refs.list.refresh()
      this.$refs.AlbumList.refresh()
      this.$refs.AlbumSongList.refresh()
    },
    // 随机播放全部歌曲
    playRandom() {
      this.randomPlay({
        // 播放 专辑中歌曲 全部歌曲
        list: this.showDetail ? this.albumSong : this.songs
      })
    },
    // 返回歌手列表
    back() {
      this.$router.back()
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    // 点击添加所有歌曲到当前播放列表
    selectItem(item, index) {
      this.selectPlay({
        list: this.songs,
        index: index
      })
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.imageHeight + IMAGE_HEIGHT
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
    this.$refs.AlbumList.$el.style.top = `${this.imageHeight}px`
    this.$refs.AlbumSongList.$el.style.top = `${this.imageHeight}px`
  },
  components: {
    Scroll,
    SongList,
    Loading,
    Switches,
    AlbumSong
  },
  watch: {
    scrollY(newY) {
      // 向上偏移 translateY 为负值 在此限制layer上升最大距离
      let translateY = Math.max(this.minTranslateY, newY)
      let zIndex = 0
      let scale = 1
      let blur = 0
      // 计算缩放的百分比
      const percent = Math.abs(newY / this.imageHeight)
      // 向下拖动时
      if (newY > 0) {
        scale = 1 + percent
        zIndex = 10
      } else {
        // 给IOS设置高斯模糊 最大模糊度20px
        blur = Math.min(20 * percent, 20)
      }
      this.$refs.filter.style['backdrop-filter'] = `blur(${blur}px)`
      this.$refs.layer.style.transform = `translate3d(0,${translateY}px,0)`
      // 当滚动到指定位置
      if (newY < this.minTranslateY) {
        // 隐藏切换按钮
        this.showFlag = false
        // 改变图片z-index 覆盖 歌曲列表
        zIndex = 10
        // 改变paddingTop值 和 将图片高度设为 顶部 预留的高度 40px
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${IMAGE_HEIGHT}px`
        // 当列表向上滚动 隐藏播放歌曲字样
        this.$refs.playBtn.style.display = 'none'
      } else {
        // 还原默认状态
        this.showFlag = true
        this.$refs.bgImage.style.paddingTop = `70%`
        this.$refs.bgImage.style.height = 0
        this.$refs.playBtn.style.display = this.currentIndex === 0 ? '' : 'none'
        if (this.showDetail) {
          this.$refs.playBtn.style.display = ''
        }
      }
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style.transform = `scale(${scale})`
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .switches
          margin-bottom -21px
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 10px auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .album-list
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          &:first-child
            margin-top: 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
