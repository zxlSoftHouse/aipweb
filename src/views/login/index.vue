<template>
  <div class="app-page">
		<!-- <particles /> -->
    <!-- <indexbg /> -->
    <div class="login-container"> 
    <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px"
      class="card-box login-form">
      <h3 class="title">用户登录</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="off" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="off"
          placeholder="请输入密码">
        </el-input>
          <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
      </el-form-item>
      <el-form-item class="login-btn">
        <el-button type="primary" style="width: 100%;height: 50px;font-size: 20px;" :loading="loading" @click.native.prevent="handleLogin">
          登   录
        </el-button>
      </el-form-item>
      <el-radio-group class="rt" v-model="langToggle" size="mini">
        <el-radio-button label="中"></el-radio-button>
        <el-radio-button label="En"></el-radio-button>
      </el-radio-group>
      <!-- <div class="tips">
        <span style="margin-right:20px;">账户: aip</span>
        <span> 密码: admin123</span>
      </div>
      <div class="tips">
        <span style="margin-right:20px;">账户: editor</span>
        <span> 密码: editor</span>
      </div> -->
    </el-form>
  </div>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import userApi from "@/api/sysManage/userManage";

export default {
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        grant_type: "password"
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: "请输入用户名" }],
        password: [{ required: true, trigger: 'blur', message: "请输入密码", }]
        // username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        // password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password',
      langToggle: '中'
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      var vm = this;
      // vm.$router.push({ path: '/home' })
      vm.$refs.loginForm.validate(valid => {
        if (valid) {
          vm.loading = true
          vm.$store.dispatch('Login', vm.loginForm).then(() => {
            this.loginLog();
            vm.loading = false
            vm.$router.push({ path: '/home' })            
            this.$store.commit('menuRouteLoaded', false) // 要求重新加载导航菜单
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    
    loginLog(){//统计登录日志
      userApi.loginLog().then(response => {
      }).catch(error => {
      })
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg:#2d3a4b;
  $dark_gray:#969696;
  $light_gray:#eee;
  .app-page{
    width: 100%;
    height: 100%;
    overflow: hidden; 
  }

  .login-container {
    position: fixed;
    height: 100%;
    width:100%;
    z-index:99999;
    background: url(../../assets/images/login.png) 0 0 no-repeat;
    .el-radio-button__inner {
      padding: 3px 8px;
    }
    .el-radio-button:first-child .el-radio-button__inner {
      border-radius: 40% 0 0 40%;
    }
    .el-radio-button:last-child .el-radio-button__inner {
      border-radius: 0 40% 40% 0;
    }
    input:-webkit-autofill {
      box-shadow: 0 0 0px 1000px #293444 inset !important;
      // -webkit-text-fill-color: #fff !important;
    }
    input {
      background: transparent; 
      -webkit-appearance: none;
      border-radius: 0px;
      border: 0px solid #dcdfe6;
      // padding: 12px 5px 12px 15px;
      // height: 36px;
      text-overflow: ellipsis;
      background-color: transparent; 
      // color: #fff;
    }
    .el-input {
      display: inline-block;
      // height: 36px;
      width: 85%;
    }
    // .tips {
    //   font-size: 14px;
    //   color: #fff;
    //   margin-bottom: 10px;
    // }
    .el-checkbox{
      color:#fff;
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login {
        font-size: 20px;
      }
    }
    .title {
      font-size: 28px;
      margin: 25px auto 40px auto;
      text-align: center;
      color: #2C84FE;
      font-weight: 500;
    }
    .login-form {
      position: fixed;
      right: 100px;
      top: 24%;
      width: 460px;
      padding: 35px 60px 25px 60px; 
      height: 450px;
      background: #fff;
    }
    .el-form-item {
      // border: 1px solid rgba(255, 255, 255, 0.897);
      // background: rgba(0, 0, 0, 0.1);
      border: 1px solid #EDEDED;
      border-radius: 5px;
      color: #454545;
      margin-bottom: 20px;
      &.login-btn {
        margin-top: 40px;
        margin-bottom: 40px;
      }
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select:none;
    }
    .thirdparty-button{
      position: absolute;
      right: 35px;
      bottom: 28px;
    }
  }
</style>
