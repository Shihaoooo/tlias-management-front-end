<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable no-unused-vars -->
<script setup>
import {
  Avatar,
  Document,
  Edit,
  HelpFilled,
  Histogram,
  HomeFilled,
  InfoFilled,
  Menu,
  Message,
  Promotion,
  Search,
  Share,
  Switch,
  Tools,
  UserFilled,
} from "@element-plus/icons-vue";
import router from "../../router";
</script>
<template>
  <div class="common-layout">
    <el-container>
      <!--header 区域-->
      <el-header class="header">
        <span class="title">Tlias智能学习辅助系统</span>
        <span class="right_tool">
          <a href="#">
            <el-icon><Edit /></el-icon> 修改密码 &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;
          </a>
          <a href="#">
            <el-icon><Switch /></el-icon> 退出登录
          </a>
        </span>
      </el-header>

      <el-container>
        <!--左侧菜单 区域-->
        <el-aside width="200px" class="aside">
          <el-scrollbar>
            <el-menu router="true">
              <!--index属性用于标识每一个item，可以用来制作动态菜单-->

              <!--首页菜单-->
              <el-menu-item index="/index">
                <el-icon><Promotion /></el-icon>首页
              </el-menu-item>

              <!--班级管理菜单-->
              <el-sub-menu index="/manage">
                <template #title>
                  <el-icon><Menu /></el-icon>班级学员管理
                </template>

                <el-menu-item index="/clazz">
                  <el-icon><HomeFilled /></el-icon>班级管理
                </el-menu-item>

                <el-menu-item index="/stu">
                  <el-icon><UserFilled /></el-icon>学员管理
                </el-menu-item>
              </el-sub-menu>

              <!--系统信息菜单-->
              <el-sub-menu index="/system">
                <template #title>
                  <el-icon><Tools /></el-icon>系统信息管理
                </template>

                <el-menu-item index="/dept">
                  <el-icon><HelpFilled /></el-icon>部门管理
                </el-menu-item>

                <el-menu-item index="/emp">
                  <el-icon><Avatar /></el-icon>员工管理
                </el-menu-item>
              </el-sub-menu>

              <!--数据统计管理菜单-->
              <el-sub-menu index="/report">
                <template #title>
                  <el-icon><Histogram /></el-icon>数据统计管理
                </template>

                <el-menu-item index="/empReport">
                  <el-icon><InfoFilled /></el-icon>员工信息统计
                </el-menu-item>

                <el-menu-item index="/stuReport">
                  <el-icon><Share /></el-icon>学员信息统计
                </el-menu-item>

                <el-menu-item index="/log">
                  <el-icon><Document /></el-icon>日志信息统计
                </el-menu-item>
              </el-sub-menu>
            </el-menu>
          </el-scrollbar>
        </el-aside>

        <!--右侧内容 区域-->
        <el-main class="main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.header {
  background-image: linear-gradient(
    to right,
    #005470,
    #007791,
    #0099b3,
    #00b9d5
  );
}

.title {
  display: block;
  position: absolute;
  left: 20px;
  top: 20px;
  width: 410px;
  color: white;
  font-size: 30px;
  font-family: 楷体;
  line-height: 40px;
  font-weight: bolder;
}
.right_tool {
  width: 260px;
  display: block;
  position: absolute;
  right: 0;
  top: 25px;
}
.right_tool a {
  text-decoration: none;
  color: white;
  font-size: 14px;
}
.aside {
  border: 1px solid gainsboro;
  height: 1000px;
}
</style>
