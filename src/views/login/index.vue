<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted, reactive } from "vue";
import { login as loginApi } from "@/api/login";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

// 表单数据
const form = ref({
  userName: "",
  password: "",
});

// 路由
const router = useRouter();

// 状态管理
const isLoading = ref(false);
const showPassword = ref(false);
const focusState = reactive({
  userName: false,
  password: false,
});
const errorState = reactive({
  userName: false,
  password: false,
});
const errorMessage = reactive({
  userName: "",
  password: "",
});

// 处理输入框焦点
const handleFocus = (field) => {
  focusState[field] = true;
  errorState[field] = false; // 聚焦时清除错误状态
};

// 处理输入框失焦
const handleBlur = (field) => {
  focusState[field] = false;
  validateField(field); // 失焦时验证字段
};

// 字段验证
const validateField = (field) => {
  if (field === "userName" && !form.value.userName.trim()) {
    errorState.userName = true;
    errorMessage.userName = "请输入用户名";
    return false;
  }

  if (field === "password" && !form.value.password) {
    errorState.password = true;
    errorMessage.password = "请输入密码";
    return false;
  }

  return true;
};

// 整体表单验证
const validateForm = () => {
  let isValid = true;

  if (!form.value.userName.trim()) {
    errorState.userName = true;
    errorMessage.userName = "请输入用户名";
    isValid = false;
  }

  if (!form.value.password) {
    errorState.password = true;
    errorMessage.password = "请输入密码";
    isValid = false;
  }

  return isValid;
};

// 登录处理
const handleLogin = async () => {
  if (!validateForm()) return;

  isLoading.value = true;

  const response = await loginApi(form.value);
  console.log(response);

  isLoading.value = false;

  if (response.code == 1) {
    // 登录成功
    console.log("登录成功");

    //1.提示信息
    ElMessage.success("登陆成功");

    //2.存储用户信息
    localStorage.setItem("loginUser", JSON.stringify(response.data));

    //3.跳转页面(首页) 
    router.push("/index");
  } else {
    console.log("登录失败");
    // 登录失败
    ElMessage.error(response.msg);
  }
};

// 初始化 - 读取记住的用户
onMounted(() => {
  const rememberedUser = localStorage.getItem("rememberedUser");
  if (rememberedUser) {
    const user = JSON.parse(rememberedUser);
    form.value.userName = user.userName;
    form.value.rememberMe = true;
  }
});
</script>

<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <!-- 登录卡片 -->
    <div class="login-card">
      <div class="login-header">
        <h1 class="login-title">欢迎回来</h1>
        <p class="login-subtitle">请登录您的账号继续访问</p>
      </div>

      <form class="login-form" @submit.prevent>
        <!-- 用户名输入 -->
        <div class="form-group">
          <label class="form-label" for="userName">用户名</label>
          <div class="input-wrapper">
            <i class="icon-user"></i>
            <input
              type="text"
              id="userName"
              v-model.trim="form.userName"
              @focus="handleFocus('userName')"
              @blur="handleBlur('userName')"
              :class="{
                'input-focus': focusState.userName,
                'input-error': errorState.userName,
              }"
              placeholder="请输入用户名"
            />
          </div>
          <p class="error-message" v-if="errorState.userName">
            {{ errorMessage.userName }}
          </p>
        </div>

        <!-- 密码输入 -->
        <div class="form-group">
          <div class="label-wrapper">
            <label class="form-label" for="password">密码</label>
            <a href="#" class="forgot-link">忘记密码?</a>
          </div>
          <div class="input-wrapper">
            <i class="icon-lock"></i>
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model.trim="form.password"
              @focus="handleFocus('password')"
              @blur="handleBlur('password')"
              :class="{
                'input-focus': focusState.password,
                'input-error': errorState.password,
              }"
              placeholder="请输入密码"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              <i
                class="icon-eye"
                :class="{ 'icon-eye-slash': showPassword }"
              ></i>
            </button>
          </div>
          <p class="error-message" v-if="errorState.password">
            {{ errorMessage.password }}
          </p>
        </div>

        <!-- 登录按钮 -->
        <button
          type="submit"
          class="login-button"
          :disabled="isLoading"
          @click="handleLogin"
        >
          <span v-if="!isLoading">登录</span>
          <div class="loader" v-if="isLoading"></div>
        </button>

        <!-- 注册提示 -->
        <div class="register-prompt">
          还没有账号?
          <a href="#" class="register-link">立即注册</a>
        </div>
      </form>
    </div>
  </div>
</template>

<style>
:root {
  --primary-color: #3b82f6;
  --primary-light: #60a5fa;
  --primary-dark: #2563eb;
  --bg-color: #f8fafc;
  --card-bg: #ffffff;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
  --error-color: #ef4444;
  --success-color: #10b981;
  --shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05),
    0 8px 10px -6px rgba(0, 0, 0, 0.02);
  --transition: all 0.3s ease;
}
</style>
<style scoped>
/* 基础样式与变量 */
.login-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-color);
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

/* 背景装饰 */
.bg-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--primary-light) 0%,
    var(--primary-color) 100%
  );
  opacity: 0.1;
  filter: blur(80px);
}

.circle-1 {
  width: 600px;
  height: 600px;
  top: -300px;
  left: -100px;
}

.circle-2 {
  width: 500px;
  height: 500px;
  bottom: -250px;
  right: -150px;
}

.circle-3 {
  width: 300px;
  height: 300px;
  top: 50%;
  right: 10%;
  transform: translateY(-50%);
}

/* 登录卡片 */
.login-card {
  width: 100%;
  max-width: 400px;
  background-color: var(--card-bg);
  border-radius: 20px;
  box-shadow: var(--shadow);
  padding: 40px 30px;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px -8px rgba(0, 0, 0, 0.1);
}

/* 登录标题 */
.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 10px 0;
}

.login-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

/* 表单样式 */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-label {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
}

.forgot-link {
  font-size: 13px;
  color: var(--primary-color);
  text-decoration: none;
  transition: var(--transition);
}

.forgot-link:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

input {
  width: 100%;
  padding: 14px 16px;
  padding-left: 44px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 15px;
  transition: var(--transition);
  box-sizing: border-box;
  background-color: transparent;
}

input::placeholder {
  color: #94a3b8;
  font-size: 14px;
}

input:focus {
  outline: none;
}

.input-focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-error {
  border-color: var(--error-color);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* 图标样式 */
[class^="icon-"] {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  transition: var(--transition);
}

.input-focus ~ [class^="icon-"] {
  color: var(--primary-color);
}

.icon-eye,
.icon-eye-slash {
  left: auto;
  right: 16px;
  cursor: pointer;
}

/* 密码切换按钮 */
.toggle-password {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 错误信息 */
.error-message {
  margin: 0;
  font-size: 12px;
  color: var(--error-color);
  height: 14px;
  line-height: 14px;
}

/* 记住密码 */
.remember-section {
  margin-top: 5px;
}

.remember-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
}

.remember-checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: relative;
  height: 16px;
  width: 16px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  transition: var(--transition);
}

.remember-checkbox:checked ~ .checkmark {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 5px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.remember-checkbox:checked ~ .checkmark:after {
  display: block;
}

/* 登录按钮 */
.login-button {
  width: 100%;
  padding: 14px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-button:hover:not(:disabled) {
  background-color: var(--primary-dark);
}

.login-button:disabled {
  background-color: #cbd5e1;
  cursor: not-allowed;
}

/* 加载动画 */
.loader {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 注册提示 */
.register-prompt {
  text-align: center;
  margin-top: 25px;
  font-size: 14px;
  color: var(--text-secondary);
}

.register-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
}

.register-link:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

/* 响应式调整 */
@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }

  .login-title {
    font-size: 22px;
  }
}
</style>
