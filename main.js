/*
  1:歌曲搜索接口
    请求地址:https://autumnfish.cn/search
    请求方法:get
    请求参数:keywords(查询关键字)
    响应内容:歌曲搜索结果

  2:歌曲url获取接口
    请求地址:https://autumnfish.cn/song/url
    请求方法:get
    请求参数:id(歌曲id)
    响应内容:歌曲url地址
  3.歌曲详情获取
    请求地址:https://autumnfish.cn/song/detail
    请求方法:get
    请求参数:ids(歌曲id)
    响应内容:歌曲详情(包括封面信息)
  4.热门评论获取
    请求地址:https://autumnfish.cn/comment/hot?type=0
    请求方法:get
    请求参数:id(歌曲id,地址中的type固定为0)
    响应内容:歌曲的热门评论
  5.mv地址获取
    请求地址:https://autumnfish.cn/mv/url
    请求方法:get
    请求参数:id(mvid,为0表示没有mv)
    响应内容:mv的地址
*/
var app = new Vue({
  el: '#all',
  data: {
    //搜索绑定
    search: '',
    //歌曲搜索结果的数组
    searchResultArr: [],
    //播放的歌曲
    playSong: '',
    //播放时长
    playTime: 0,
    //歌曲总时长
    duration: 0,
    //评论内容数组
    commentList: [],
    //热门留言
    hotTitle: '',
    //mv地址
    mvUrl: '',
    //mv模块是否显示
    isShowMv: false,
    //歌曲封面
    albumImg: '',
    //歌曲是否播放
    isPlaying: false,

  },
  computed: {
 

  },
  mounted() {
    let oldSearch = window.localStorage.getItem('searchData');
    this.searchResultArr = JSON.parse(oldSearch);
  },
  methods: {
    //歌曲搜索发送数据
    searchMusic() {
      //判断是否上次搜索的结果

      axios.get('https://autumnfish.cn/search?keywords=' + this.search)
        .then(response => {
          let resultArr = response.data.result.songs;
          // console.log(resultArr);
          
          this.searchResultArr = resultArr;
          this.search = '';
        localStorage.setItem('searchData', JSON.stringify(this.searchResultArr));

        })
        .catch(error => {
          console.log(error);
        })
    },
      
    //点击播放发送数据
    playMusic(id, timeLong) {
      this.playSong = '';
      //播放
      axios.get('https://autumnfish.cn/song/url?id=' + id)
        .then(response => {
          let songUrl = response.data.data[0].url;
          this.playSong = songUrl;
          let time = new Date(timeLong);
          let m = time.getMinutes();
          if (m < 10) {
            m = '0' + m;
          }
          let s = time.getSeconds();
          if (s < 10) {
            s = '0' + s;
          }
          let songLong = m + ':' + s;
          this.duration = songLong;
          
        })
        .catch(error => {})
      //热门评论
      axios.get('https://autumnfish.cn/comment/hot?type=0&&id=' + id)
        .then(response => {
          // console.log(response);
          this.hotTitle = '热门留言';
          this.commentList = response.data.hotComments;
        })
        .catch(error => {
          console.log(error);
        })
      //播放歌曲 封面
      axios.get('https://autumnfish.cn/song/detail?ids=' + id)
        .then(response => {
        // console.log(response.data.songs);
          this.albumImg = response.data.songs[0].al.picUrl;
        })
      .catch(error=>{console.log(error);
      })
    },
    //点击播放mv 发送数据
    playMv(id) {
      this.playSong = '';
      axios.get('https://autumnfish.cn/mv/url?id=' + id)
        .then(response => {
          let mvUrl = response.data.data.url;
          // console.log(mvUrl);
          this.mvUrl = mvUrl;
          this.isShowMv = true;
        })
        .catch(error => {
        console.log(error);
        
      })
    },
    //关闭mv
    closeMv() {
      this.mvUrl = '';
      this.isShowMv = false;
    },
    //动画 播放
    songPlay() {
      
      this.isPlaying = false;
      
    },
    //动画 暂停
    songPaused() {
      this.isPlaying = true;
     
      
      
    }
  


  },
})