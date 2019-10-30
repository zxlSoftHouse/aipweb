<template>
  <div class="sensorCard">
    <el-row :gutter="35">
      <el-col :span="6" v-for="item in data" :key="item.key">
        <el-card class="rel" :body-style="{ padding: '15px 10px',height: '130px' }">
          <div :class="item.class + '-bg'" slot="header">{{item.name}}</div>
          <div>
            <i
              class="iconfont"
              :class="'icon-' + item.icon + ' ' + item.class + '-color'"
            ></i>
            <span>
              <em>{{item.val}}</em>
              {{item.unit}}
            </span>
          </div>
          <div class="layer" :class="item.class + '-bg'">
            {{item.name}}
            <br>
            <span>
              <em>{{item.val}}</em>
              {{item.unit}}
            </span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    data: Object
  }
};
</script>

<style lang="scss">
.sensorCard {
  $green1: #79a021;
  $red: #d54f3e;
  $blue: #5f90b8;
  $green2: #7dbdb3;
  $green3: #5ccac4;
  $green4: #7dbdb3;
  $yellow: #e5c367;
  $purple: #d08dc1;
  $brown: #8e858c;
  .el-carousel__button {
    background-color: $brown;
  }
  .green1-bg {
    background: $green1;
  }
  .green2-bg {
    background: $green2;
  }
  .green3-bg {
    background: $green3;
  }
  .green4-bg {
    background: $green4;
  }
  .red-bg {
    background: $red;
  }
  .blue-bg {
    background: $blue;
  }
  .yellow-bg {
    background: $yellow;
  }
  .purple-bg {
    background: $purple;
  }
  .brown-bg {
    background: $brown;
  }
  .green1-color {
    color: $green1;
  }
  .green2-color {
    color: $green2;
  }
  .green3-color {
    color: $green3;
  }
  .green4-color {
    color: $green4;
  }
  .red-color {
    color: $red;
  }
  .blue-color {
    color: $blue;
  }
  .yellow-color {
    color: $yellow;
  }
  .purple-color {
    color: $purple;
  }
  .brown-color {
    color: $brown;
  }
  .el-card {
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    margin-bottom: 10px;
    cursor: pointer;
    background: #fff;
    .el-card__header {
      padding: 0;
      div {
        height: 45px;
        padding: 0 20px;
        font-size: 20px;
        line-height: 45px;
        color: #fff;
      }
    }
    .el-card__body {
      // position: relative;
      text-align: center;
      &:hover .layer {
        height: 100%;
        line-height: 40px;
        padding-top: 40px;
        transition: height 0.4s ease;
      }
      .layer {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 0;
        overflow: hidden;
        text-align: center;
        color: #fff;
        font-size: 20px;
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
        span {
          margin: 0;
          color: #fff;
        }
      }
      i {
        font-size: 50px;
        position: absolute;
        top: 70px;
        left: 20px;
      }
      span {
        color: #c5c5c5;
        font-size: 20px;
        display: inline-block;
        margin-top: 30px;
        em {
          font-size: 30px;
          font-weight: bold;
        }
      }
    }
  }
}
.dark {
  .sensorCard {
    .el-card {
      border-color: transparent;
      &.is-always-shadow {
        box-shadow: 0 2px 12px 0 rgba(255, 255, 255, 0.3);
      }
      .el-card__header {
        border-color: transparent;
      }
    }
  }
}
</style>
