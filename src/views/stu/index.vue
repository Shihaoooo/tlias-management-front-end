<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { nextTick, onMounted, ref } from "vue";
import {
  queryPage,
  getDegreeList,
  getClazzList,
  addStu as addStuApi,
  delStu as delStuApi,
  queryStuById as queryStuByIdApi,
  updateStu as updateStuApi,
  violation as violationApi,
} from "@/api/stu";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Minus,
  Plus,
  Edit,
  Delete,
  UploadFilled,
} from "@element-plus/icons-vue";
// 定义搜索框数据
const searchForm = ref({
  name: "",
  degree: "",
  clazzId: "",
});
const searchFormRef = ref(); // 搜索框组件

const degreeList = ref([]); // 学历列表
const clazzList = ref([]); // 班级列表

// 定义分页数据
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 定义表单对话框数据
const rules = ref({
  name: [
    { required: true, message: "请输入姓名", trigger: "change" },
    { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "change" },
  ],
  gender: [{ required: true, message: "请选择性别", trigger: "change" }],
  idCard: [
    { required: true, message: "请输入身份证号", trigger: "change" },
    { min: 18, max: 18, message: "长度为18位", trigger: "change" },
  ],
  address: [
    { required: true, message: "请输入地址", trigger: "change" },
    { min: 5, max: 50, message: "长度在 5 到 50 个字符", trigger: "change" },
  ],
  graduationDate: [
    { required: true, message: "请选择毕业日期", trigger: "change" },
  ],
  no: [
    { required: true, message: "请输入学号", trigger: "change" },
    { min: 10, max: 10, message: "长度为10位", trigger: "change" },
  ],
  phone: [
    { required: true, message: "请输入手机号", trigger: "change" },
    { min: 11, max: 11, message: "长度为11位", trigger: "change" },
  ],
  isCollege: [{ required: true, message: "请选择是否在校", trigger: "change" }],
  degree: [{ required: true, message: "请选择学历", trigger: "change" }],
  clazzId: [{ required: true, message: "请选择班级", trigger: "change" }],
});
const formData = ref({
  name: "",
  gender: "",
  idCard: "",
  address: "",
  graduationDate: "",

  no: "",
  phone: "",
  isCollege: "",
  degree: "",
  clazzId: "",
}); // 表单数据
const formRef = ref(); // 表单组件

const dialogFormVisible = ref(false); // 表单对话框是否可见
const title = ref(""); // 表单对话框标题

// 定义数字输入框的数据模型
const score = ref(0); // 默认0分，则不记分

// 钩子函数
onMounted(async () => {
  search();
  // 获取学历列表
  const response_degree = await getDegreeList();
  if (response_degree.code == 1) {
    degreeList.value = response_degree.data;
  } else {
    ElMessage.error(response_degree.msg);
  }

  // 获取班级列表
  const response_clazz = await getClazzList();
  if (response_clazz.code == 1) {
    clazzList.value = response_clazz.data;
  } else {
    ElMessage.error(response_clazz.msg);
  }
});

// 定义表格数据
const stuList = ref([]);
const tableRef = ref(); // 表格组件

// 搜索学生
const search = async () => {
  const response = await queryPage(
    searchForm.value.name,
    searchForm.value.degree,
    searchForm.value.clazzId,
    currentPage.value,
    pageSize.value
  );

  if (response.code == 1) {
    // 解析数据
    stuList.value = response.data.rows;
    total.value = response.data.total;
  } else {
    ElMessage.error(response.msg);
  }
};

// 新增学生
const addStu = async () => {
  // 修改标题
  title.value = "新增学员";
  // 显示表单
  dialogFormVisible.value = true;
  // 重置表单
  await nextTick();

  formRef.value.resetFields();
};

// 表单的提交事件
const submit = async () => {
  formRef.value.validate(async (valid) => {
    let response = "";

    if (valid) {
      // 校验通过发送请求
      if (title.value == "新增学员") {
        response = await addStuApi(formData.value);
      } else if (title.value == "编辑学员") {
        response = await updateStuApi(formData.value);

        // 检查是否有违纪记录
        if (score.value != 0) {
          // 存在违纪记录，发送违纪记录请求
          const response_violation = await violationApi(
            formData.value.id,
            score.value
          );
          if (response_violation.code == 1) {
            console.log("违纪记录发送成功");
          } else {
            ElMessage.error("违纪记录发送失败");
          }
        }
      } else {
        ElMessage.error("表单渲染错误");
        return;
      }

      if (response.code == 1) {
        ElMessage.success("操作成功");
        dialogFormVisible.value = false;
        search();
      } else {
        ElMessage.error(response.msg);
      }
    } else {
      ElMessage.error("请完整填写表单");
    }
  });
};

// 重置搜索框
const reset = () => {
  if (searchFormRef.value) {
    searchFormRef.value.resetFields();
  }
};

// 重置对话框
const resetForm = async () => {
  // 关闭对话框
  dialogFormVisible.value = false;
  // 清空表单
  await nextTick();
  formRef.value.resetFields();
};

// 获取所有被选择的行的id值
const getSelectedRows = () => {
  const selected = tableRef.value.getSelectionRows();

  if (selected.length == 0) {
    ElMessage.warning("请选择需要操作的行");
    return "";
  }
  let ids = "ids=";

  selected.forEach((element) => {
    ids += element.id + ",";
  });

  ids = ids.substring(0, ids.length - 1);

  return ids;
};
// 删除学生
const delStu = async (id) => {
  if (id == "" || id == undefined || id == null) {
    // 批量删除
    const ids = getSelectedRows();

    if (ids == "") {
      return;
    } else {
      const response = await delStuApi(ids);
      if (response.code == 1) {
        return true;
      } else {
        return false;
      }
    }
  } else {
    // 单个删除
    const response = await delStuApi("ids=" + id);
    if (response.code == 1) {
      return true;
    } else {
      return false;
    }
  }
};

// 删除确认
const confirmDel = async (id) => {
  ElMessageBox.confirm("此操作不可撤回，确定要继续吗？", "Warning", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
    center: true,
  })
    .then(async () => {
      const flag = await delStu(id);
      if (flag) {
        ElMessage.success("操作成功");
        search();
      } else {
        ElMessage.error("操作失败");
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "操作取消",
      });
    });
};

// 回显查询(编辑学生)
const queryStuById = async (id) => {
  title.value = "编辑学员";

  // 清零违规记分
  score.value = 0;
  const response = await queryStuByIdApi(id);

  if (response.code == 1) {
    // 回显数据
    formData.value = response.data;

    // 显示对话框
    dialogFormVisible.value = true;
  } else {
    ElMessage.error(response.msg);
  }
};
</script>

<template>
  <h1>学生管理</h1>

  <!--搜索框-->
  <div class="search-box">
    <el-form :inline="true" ref="searchFormRef" :model="searchForm">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="searchForm.name" placeholder="请输入姓名"></el-input>
      </el-form-item>

      <el-form-item label="最高学历" prop="degree">
        <el-select v-model="searchForm.degree">
          <el-option
            v-for="item in degreeList"
            :key="item.id"
            :label="item.degreeName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="所属班级" prop="clazzId">
        <el-select v-model="searchForm.clazzId">
          <el-option
            v-for="item in clazzList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="reset" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!--功能按钮-->
  <div class="function-btn">
    <el-button type="primary" @click="addStu"
      ><el-icon><Plus /></el-icon>新增学员</el-button
    >
    <el-button type="danger" @click="confirmDel('')"
      ><el-icon><Minus /></el-icon>批量删除</el-button
    >
  </div>

  <!--数据表格-->
  <div class="table">
    <el-table :data="stuList" border style="width: 100%" ref="tableRef">
      <el-table-column
        type="selection"
        width="55"
        align="center"
      ></el-table-column>
      <el-table-column prop="name" label="姓名" width="82" align="center" />
      <el-table-column prop="no" label="学号" width="110" align="center" />
      <el-table-column
        prop="clazzName"
        label="班级"
        width="140"
        align="center"
      />
      <el-table-column prop="gender" label="性别" width="80" align="center">
        <template #default="scope">
          {{ scope.row.gender == 1 ? "男" : "女" }}
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号" width="120" align="center" />
      <el-table-column
        prop="degreeName"
        label="最高学历"
        width="90"
        align="center"
      />
      <el-table-column
        prop="violationCount"
        label="违纪次数"
        width="90"
        align="center"
      />
      <el-table-column
        prop="violationScore"
        label="违纪扣分"
        width="90"
        align="center"
      />
      <el-table-column
        prop="updateTime"
        label="最后修改时间"
        width="180"
        align="center"
      />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            round
            @click="queryStuById(scope.row.id)"
          >
            <el-icon><Edit /></el-icon>编辑</el-button
          >
          <el-button
            type="danger"
            size="small"
            round
            @click="confirmDel(scope.row.id)"
          >
            <el-icon><Delete /></el-icon>删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!--分页-->
  <div class="pagination">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[5, 10, 20, , 50, 100]"
      :disabled="disabled"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="search()"
      @current-change="search()"
    />
  </div>

  <!--表单-->
  <el-dialog v-model="dialogFormVisible" :title="title" width="850px">
    <el-form
      ref="formRef"
      style="max-width: 800px"
      :model="formData"
      status-icon
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      label-position="left"
    >
      <el-row>
        <el-col :span="10" style="margin-right: 60px; margin-left: 30px">
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="formData.name"
              placeholder="请输入姓名"
            ></el-input>
          </el-form-item>

          <el-form-item label="性别" prop="gender">
            <el-select v-model="formData.gender" style="width: 270px">
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="身份证号" prop="idCard">
            <el-input
              v-model="formData.idCard"
              placeholder="请输入身份证号"
            ></el-input>
          </el-form-item>

          <el-form-item label="联系地址" prop="address">
            <el-input
              v-model="formData.address"
              placeholder="请输入联系地址"
            ></el-input>
          </el-form-item>

          <el-form-item label="毕业日期" prop="graduationDate">
            <el-date-picker
              v-model="formData.graduationDate"
              type="date"
              placeholder="选择日期"
              style="width: 270px"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="违纪记分" v-if="title == '编辑学员'">
            <el-input-number
              v-model="score"
              :disabled="false"
              :min="0"
              :max="10"
            ></el-input-number>
          </el-form-item>
        </el-col>

        <el-col :span="10">
          <el-form-item label="学号" prop="no">
            <el-input v-model="formData.no" placeholder="请输入学号"></el-input>
          </el-form-item>

          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="formData.phone"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>

          <el-form-item label="是否来自院校" prop="isCollege">
            <el-select v-model="formData.isCollege" style="width: 270px">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="最高学历" prop="degree">
            <el-select v-model="formData.degree" style="width: 270px">
              <el-option
                v-for="item in degreeList"
                :key="item.id"
                :label="item.degreeName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="所属班级" prop="clazzId">
            <el-select v-model="formData.clazzId" style="width: 270px">
              <el-option
                v-for="item in clazzList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="dialog-footer">
        <el-button @click="resetForm()">取消</el-button>
        <el-button type="primary" @click="submit()"> 确定 </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<style scoped>
.table {
  margin-top: 20px;
}
.dialog-footer {
  margin-left: 330px;
}
.pagination {
  margin-top: 20px;
}
</style>
