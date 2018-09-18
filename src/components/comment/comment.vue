<template>
  <transition name="slide">
    <div class="comment" ref="commentWrapper">
      <div class="header">
        <div class="back" @click="back">
          <i class="icon-back"></i>
        </div>
        <h1 class="title">{{getTitle}}</h1>
        <switches class="switches" :currentIndex="currentIndex" @switch="switchItem" :switches="switches"></switches>
      </div>
      <scroll class="comment-list"
              :pullup="pullup"
              :data="comment"
              ref="comment"
              :listenScroll="listenScroll"
              :probeType="probeType"
              @scrollToEnd="loadMore"
      >
        <ul class="ul-item">
          <li v-for="(item,index) in comment" :key="index" class="list-item" ref="list">
            <div class="c-left">
              <img v-lazy="item.avatarurl" class="avatar">
            </div>
            <div class="c-right">
              <span class="name">{{item.nick}}</span>
              <span class="desc">{{getComment(item)}}</span>
              <span class="time">{{item.time | formatDate}}</span>
              <span class="like" @click="increase(item, index)" :class="{signed:hasSigned(index)}">
                <i class="icon fa fa-thumbs-o-up"></i>
                <span class="count">{{item.praisenum}}</span>
                <i class="icon fa fa-commenting-o"></i>
              </span>
            </div>
          </li>
          <p class="nomore" v-show="!hasMore">没有更多了</p>
          <loading v-show="hasMore && comment.length" title=""></loading>
        </ul>
        <div class="loading-container" v-show="!comment.length && !noResult">
          <loading></loading>
        </div>
        <div v-show="noResult" class="no-result-wrapper">
          <no-result :title="title"></no-result>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script>
import ListView from 'base/listview/listview'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import NoResult from 'base/no-result/no-result'
import Switches from 'base/switches/switches'
import {formatDateTime} from 'common/js/util'

export default {
  props: {
    comment: {
      type: Array,
      default: function () {
        return []
      }
    },
    currentSong: {
      type: Object,
      default: function () {
        return {}
      }
    },
    hasMore: {
      type: Boolean,
      default: true
    },
    noResult: {
      type: Boolean,
      default: false
    },
    firstFlag: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  components: {
    ListView,
    Scroll,
    Loading,
    NoResult,
    Switches
  },
  data() {
    return {
      listenScroll: true,
      probeType: 3,
      pullup: true,
      num: 0,
      currentIndex: 0,
      clickIndex: [],
      onceClick: [],
      switches: [
        {name: '热门评论'},
        {name: '最新评论'}
      ]
    }
  },
  computed: {
    getTitle() {
      return `${this.currentSong.singer} - ${this.currentSong.name}`
    }
  },
  methods: {
    // 点赞样式
    hasSigned(index) {
      if (this.clickIndex[index]) {
        return this.clickIndex[index].signed
      } else {
        return false
      }
    },
    recalculate() {
      this.clickIndex = []
    },
    // 只能点赞一次 再次点赞取消
    increase(item, index) {
      // 生成clickIndex 数组
      if (!this.clickIndex.length) {
        for (let i = 0; i < this.comment.length; i++) {
          this.clickIndex.push({id: i, count: this.comment[i].praisenum, signed: false})
        }
      }
      for (let j = 0; j < this.clickIndex.length; j++) {
        if (index === j) {
          if (this.clickIndex[j].signed === false) {
            this.clickIndex[j].signed = true
            this.clickIndex[j].count = item.praisenum + 1
          } else {
            this.clickIndex[j].signed = false
            this.clickIndex[j].count = item.praisenum - 1
          }
          item.praisenum = this.clickIndex[j].count
        }
      }
    },
    switchItem(index) {
      this.currentIndex = index
      this.$emit('switch', index)
    },
    loadMore() {
      if (this.num === 0 && !this.firstFlag) {
        this.resetHeight(80)
      }
      this.$emit('loadMore')
      this.num++
    },
    // 评论 回复评论
    getComment(item) {
      let content = null
      if (item.middlecommentcontent) {
        content = `回复 ${item.rootcommentnick}:`
      } else {
        content = item.rootcommentcontent
      }
      return content
    },
    back() {
      this.$emit('back')
    },
    refresh() {
      this.$refs.comment.refresh()
    },
    // 滚动到顶部
    reset() {
      this.$refs.comment.scrollTo(0, 0)
    },
    // 修改scroll高度
    resetHeight(val) {
      let Height = this.$refs.comment.$el.clientHeight
      this.$refs.comment.$el.style.height = Height - val + 'px'
      this.refresh()
    }
  },
  filters: {
    // 将时间戳格式化
    formatDate(time) {
      let date = new Date(time)
      return formatDateTime(date)
    }
  },
  created() {
  }
}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'
  .slide-enter-active, .slide-leave-active
    transition 0.3s all
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
  .slide-leave, .slide-enter-to
    transform translate3d(0, 0, 0)
  .comment
    .header
      height 70px
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
        no-wrap()
        top: 0
        left: 15%
        z-index: 40
        width: 80%
        no-wrap()
        text-align: center
        line-height: 40px
        font-size: $font-size-large
        color: $color-text
      .switches
        position: absolute
        top: 50px
    .comment-list
      position absolute
      left 0
      top 80px
      height 100%
      width 100%
      overflow: hidden
      .ul-item
        .list-item
          display flex
          padding: 20px 0 35px 20px
          border-1px(rgba(237, 237, 237,0.2))
          &:last-child
            border-none()
          .c-left
            width 60px
            margin-right 10px
            .avatar
              width: 50px
              height: 50px
              border-radius: 50%
          .c-right
            position relative
            flex 1 auto
            padding-right 20px
            line-height 25px
            .name
              display block
              color #999
            .like
              position absolute
              right 20px
              bottom -25px
              color dimgrey
              &.signed
                .count,.fa-thumbs-o-up
                  color #ffcd32
              .count
                margin-right 10px
            .time
              position absolute
              left 0
              bottom -25px
              color #999
            .desc
              font-weight lighter
        .nomore
          padding 20px
          text-align: center
          color #aaa
      .loading-container
        position: absolute
        z-index 500
        width: 100%
        top: 50%
        transform: translateY(-50%)
      .no-result-wrapper
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
