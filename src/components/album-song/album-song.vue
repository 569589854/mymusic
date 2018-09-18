<template>
  <div class="albumSong_list">
    <ul class="padding-ul">
      <li @click="selectItem(song,index)" v-for="(song,index) in songs" :key="index" class="item">
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{song.singer}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import SongList from 'base/song-list/song-list'

export default {
  props: {
    songs: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  methods: {
    selectItem(item, index) {
      this.$emit('select', item, index)
    }
  },
  components: {
    SongList
  }

}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .albumSong_list
    margin-top 20px
    .padding-ul
      padding 20px 30px
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
</style>
