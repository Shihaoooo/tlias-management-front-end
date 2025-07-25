<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { onMounted, ref } from "vue";
import { useTransition } from "@vueuse/core";
import { queryPage as queryPageEmpApi } from "@/api/emp";
import { queryPage as queryPageStuApi } from "@/api/stu";
import { ElMessage } from "element-plus";

const totalEmpSource = ref(0);
const totalStuSource = ref(0);
const totalSource = ref(0);

const totalEmp = useTransition(totalEmpSource, {
  duration: 1000,
});

const totalStu = useTransition(totalStuSource, {
  duration: 1000,
});

const total = useTransition(totalSource, {
  duration: 1000,
});

// 初始化用户信息
const username = ref("");

// 定义问候语
let greet = ref("");

onMounted(() => {
  // 初始化
  userInit();
  initTime();
  getData();
});

// 初始化用户信息
const userInit = () => {
  // 在本地获取用户信息
  const loginUser = JSON.parse(localStorage.getItem("loginUser"));

  if (loginUser) {
    // 获取用户名
    username.value = loginUser.userName;
  } else {
    // 用户获取失败
    ElMessage.error("获取用户信息失败，请重新登录");
  }
};

// 初始化系统时间
const initTime = () => {
  const hour = new Date().getHours();

  // 自定义时段划分（可根据需求调整）
  if (hour >= 5 && hour < 10) {
    greet.value = "早上好"; // 5:00 - 9:59
  } else if (hour >= 10 && hour < 14) {
    greet.value = "中午好"; // 10:00 - 13:59
  } else if (hour >= 14 && hour < 18) {
    greet.value = "下午好"; // 14:00 - 17:59
  } else if (hour >= 18 && hour < 22) {
    greet.value = "晚上好"; // 18:00 - 21:59
  } else {
    greet.value = "深夜了,注意休息"; // 22:00 - 4:59
  }
};

// 初始化所需数据
const getData = async () => {
  // 学生数量
  const responseStu = await queryPageStuApi("", "", "", 1, 99999999);

  console.log(responseStu);

  totalStuSource.value = responseStu.data.total;

  // 员工数量
  const responseEmp = await queryPageEmpApi("", "", "", 1, 99999999);

  console.log(responseEmp);

  totalEmpSource.value = responseEmp.data.total;

  // 总数
  totalSource.value = totalStuSource.value + totalEmpSource.value;
};
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-page-header icon="">
          <template #content>
            <div class="flex items-center">
              <el-avatar
                :size="32"
                class="mr-3"
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              />
              <span class="text-large font-600 mr-3"> {{ greet }} ～ </span>
              <span
                class="text-sm mr-2"
                style="color: var(--el-text-color-regular)"
              >
                {{ username }}
              </span>
            </div>
          </template>
          <template #extra>
            <div class="flex items-center">
              <el-button>个人主页</el-button>
              <el-button type="primary" class="ml-2">编辑</el-button>
            </div>
          </template>
        </el-page-header>
      </el-header>

      <el-main>
        <el-row>
          <el-col :span="6">
            <el-statistic title="学生数量" :value="totalStu" />
          </el-col>
          <el-col :span="6">
            <el-statistic title="员工数量" :value="totalEmp" />
          </el-col>
          <el-col :span="6">
            <el-statistic title="机构人数" :value="total" />
          </el-col>
        </el-row>
      </el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>

<style scoped>
.el-col {
  text-align: center;
}
</style>
