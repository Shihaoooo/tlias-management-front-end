<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
import { ref } from "vue";
import { useTransition } from "@vueuse/core";
import { ChatLineRound, Male } from "@element-plus/icons-vue";
const source = ref(0);
const outputValue = useTransition(source, {
  duration: 1000,
});
const totalStu = ref(0);
source.value = 200;
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
              <span class="text-large font-600 mr-3"> Hello ～</span>
              <span
                class="text-sm mr-2"
                style="color: var(--el-text-color-regular)"
              >
                周诗皓
              </span>
              <el-tag>管理员</el-tag>
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
            <el-statistic title="总学生数" :value="totalStu" />
          </el-col>
          <el-col :span="6">
            <el-statistic :value="138">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  男女比例
                  <el-icon style="margin-left: 4px" :size="12">
                    <Male />
                  </el-icon>
                </div>
              </template>
              <template #suffix>/100</template>
            </el-statistic>
          </el-col>

          <el-col :span="6">
            <el-statistic title="员工数量" :value="outputValue" />
          </el-col>
          <el-col :span="6">
            <el-statistic title="数据统量" :value="562">
              <template #suffix>
                <el-icon style="vertical-align: -0.125em">
                  <ChatLineRound />
                </el-icon>
              </template>
            </el-statistic>
          </el-col>
        </el-row>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>

<style scoped>
.el-col {
  text-align: center;
}
</style>
