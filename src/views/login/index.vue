<script setup>
  import {ref} from 'vue'

  const loginForm = ref({username: '', password: ''})

</script>

<template>
  <div id="container">
    <div class="login-form">
      <el-form label-width="60px">
        <p class="title">Tlias 智能学习辅助系统</p>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="button" @click="login">登录</el-button>
          <el-button type="button" @click="resetForm">重置</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<style scoped></style>