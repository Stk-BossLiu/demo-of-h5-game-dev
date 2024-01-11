<script setup lang="ts">
import { ref } from 'vue'
import { userAuthenticate } from '@/api/home'
const password = ref('')
const onLoginBtnClick = function () {
  userAuthenticate({ password: password.value }).then((res) => {
    const code: number = res.code
    const msg = res.msg
    if (code == 0) {
      // window.location.href = '/'
    } else {
      alert(msg)
    }
  })
}
</script>
<template>
  <div class="authentication">
    <h1>输入访问密码</h1>
    <input v-model="password" placeholder="密码" type="password" />
    <button @click="onLoginBtnClick">登录</button>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .authentication {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  input {
    display: block;
    margin: 0 auto;
    width: 300px;
    height: 40px;
    border-radius: 5px;
    border: 1px solid #ccc;
    padding: 0 10px;
    font-size: 16px;
    outline: none;
  }
}
</style>
