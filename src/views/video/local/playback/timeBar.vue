<template>
  <div class="progress">
    <div class='BarControl'>
      <div class='BarBeginTime'>{{barBeginTime}}</div>
      <div class="TheBar">
        <div class="TimeBall"></div>
        <div class="TheColorBar"></div>
      </div>
      <div class="BarFinishTime">{{barFinishTime}}</div>
    </div>
  </div>
</template>

<script>
import '@/assets/js/plugins/hkvVideo/jquery-1.7.1.min.js'
import '@/assets/css/barstyle.css'
export default {
  props: {
    data: Object,
    type: Number
  },
  data() {
    return {
      barBeginTime: '00:00:00',
      barFinishTime: '',
      isAction: true,
      width: 0, //总长度
      thewidth: 0,
      currTime: 0,
      timer: '', // 定时器
      addHour: 0,
      addMinute: 0,
      addSecond: 0,
      theHour: 0,
      theMinute: 0,
      theSecond: 0,
      flag: 0,
      allTime: 1000*60*60*24 - 500,
      addwidth: 0,
      offsetW: 0,
      times: 0,
      rwidth: 0,
      down: false,
      barMove: false,
      lastX: 0,
      newX: 0
    }
  },
  methods: {
    // 初始化时间轴
    initBar() {
      this.width = $('.TheBar').width();
      this.times = this.allTime / 1000;
      this.rwidth = this.width - 8;
      this.addwidth = (this.width - 10) / this.times;
      var t = this.transitionTime(this.allTime);
      this.barFinishTime = t.stringTime;
    },
    resetTime(allTime) {
      this.cleanAll();
      this.initBar();
      this.stopBar();
      $('.TheColorBar').css("width", 0);
      $('.TimeBall').css("left", 0);
    },
    openBar() {
      this.stopBar();
      this.isAction = true;
      this.changeBar();
      console.log(this.data.interval*(7/8));
      this.timer = setInterval(this.changeBar, this.data.interval);
    },
    stopBar() {
      if (!this.down) {
        this.isAction = false;
      }
      clearInterval(this.timer);
    },
    timechange() {
      this.currTime = parseInt(this.thewidth / this.rwidth * this.allTime);
      var ltx = this.transitionTime(this.currTime);
      if (this.theHour > 0) {
        if (ltx.hHour) {
          this.barBeginTime = ltx.stringTime;
        } else {
          this.barBeginTime = "00:" + ltx.stringTime;
        }
      } else {
        this.barBeginTime = ltx.stringTime;
      }
      this.addSecond = ltx.tsec;
      this.addMinute = ltx.tmin;
      this.addHour = ltx.thour
    },
    changeBar() {
      var second, minute, hour;
      this.thewidth = this.thewidth * 1 + this.addwidth - this.offsetW;
      if (this.offsetW > 0) {
        this.offsetW = 0
      }
      if (this.thewidth < this.rwidth && this.currTime < this.allTime) {
        this.currTime = this.currTime + 1 * 1000;
        this.addSecond = this.addSecond + 1;
        if (this.addSecond > 59) {
          this.addSecond = 0;
          this.addMinute = this.addMinute + 1;
          if (this.addMinute > 59) {
            this.addMinute = 0;
            this.addHour = this.addHour + 1
          }
        }
        if (this.addSecond > 9) {
          second = "" + this.addSecond
        } else {
          second = "0" + this.addSecond
        } if (this.addMinute > 9) {
          minute = "" + this.addMinute
        } else {
          minute = "0" + this.addMinute
        } if (this.addHour > 9) {
          hour = "" + this.addHour
        } else {
          hour = "0" + this.addHour
        } if (this.addHour > 0) {
          this.flag = 1
        }
        if (this.flag == 0) {
          this.barBeginTime = minute + ":" + second;
        } else {
          this.barBeginTime = hour + ":" + minute + ":" + second;
        }
      } else {
        this.thewidth = this.rwidth;
        this.stopBar()
      }
      $('.TheColorBar').css("width", this.thewidth + 1);
      $('.TimeBall').css("left", this.thewidth)
    },
    transitionTime(str) {
      this.flag = 1;
      var m = parseFloat(str) / 1000;
      var time = "";
      var second, minute, hour;
      var ch = parseInt(m / 3600.0),
          csx = parseInt((parseFloat((parseFloat(m / 3600.0) - parseInt(m / 3600.0)) * 60) - parseInt((parseFloat(m / 3600.0) - parseInt(m / 3600.0)) * 60)) * 60),
          cm = parseInt((parseFloat(m / 3600.0) - parseInt(m / 3600.0)) * 60),
          haveHour = true;
      if (ch < 10) {
        hour = "0" + ch
      } else {
        hour = "" + ch
      } if (cm < 10) {
        minute = "0" + cm
      } else {
        minute = "" + cm
      } if (csx < 10) {
        second = "0" + csx
      } else {
        second = "" + csx
      }
      this.theHour = ch;
      this.theMinute = cm;
      this.theSecond = csx;
      time = hour + ":" + minute + ":" + second;
      this.barBeginTime = "00:00:00";
      var tt = {
        hHour: haveHour,
        thour: ch,
        tmin: cm,
        tsec: csx,
        stringTime: time
      };
      return tt;
    },
    // 清空
    cleanAll() {
      this.isAction = true;
      this.currTime = 0;
      this.addHour = 0;
      this.addMinute = 0;
      this.addSecond = 0;
      this.theHour = 0;
      this.theMinute = 0;
      this.theSecond = 0;
      this.offsetW = 0;
      this.thewidth = 0;
      this.flag = 0
    }
  },
  created() {
  },
  mounted () {
    this.initBar();
    var _this = this;
    $(document).on("mousedown", '.TimeBall', function(event) {
      _this.lastX = event.clientX;
      event.preventDefault();
      _this.down = true;
      _this.barMove = true;
      if (_this.isAction) {
        _this.stopBar();
      }
    });
    $(document).mousemove(function(event) {
      event.preventDefault();
      _this.newX = event.clientX;
      if (_this.barMove) {
        var mcs = _this.newX - _this.lastX;
        _this.lastX = _this.newX;
        if (mcs < 0) {
          if (_this.thewidth - (-mcs) > 0) {
            _this.thewidth = _this.thewidth - (-mcs)
          }
        } else {
          if (_this.thewidth + mcs < _this.rwidth) {
            _this.thewidth = _this.thewidth + mcs
          } else {
            _this.thewidth = _this.rwidth
          }
        }
        _this.timechange();
        $('.TheColorBar').css("width", _this.thewidth + 1);
        $('.TimeBall').css("left", _this.thewidth);
        _this.$emit('typeChange', 1);
        _this.$emit('playback');
      }
    });
    $(document).mouseup(function() {
      if (_this.barMove) {
        _this.barMove = false;
        _this.down = false;
        _this.newX = 0;
        var xo = parseInt(_this.currTime / 1000);
        _this.offsetW = _this.thewidth - xo * _this.addwidth;
        if (_this.isAction) {
          _this.openBar();
        }
      }
    });
  }
}
</script>

<style>

</style>
