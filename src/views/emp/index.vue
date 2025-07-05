<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from "vue";
import { queryPage } from "@/api/emp";
import {
  Minus,
  Plus,
  Edit,
  Delete,
  UploadFilled,
} from "@element-plus/icons-vue";

// 表格数据展示
const empList = ref([]);

// 分页栏数据模型
const currentPage = ref(1); // 当前页数(默认展示页数)
const pageSize = ref(20); // 每页显示条数
const total = ref(0); // 总条数
const SizeForPagination = ref("default");
const background = ref(false); // 背景色

// 员工搜索条件
const searchEmp = ref({
  name: "",
  gender: "",
  date: "",
});

//定义钩子函数，刷新页面时，自动触发查询事件
onMounted(() => {
  search();
});

// 表单提交（查询事件）
const search = async () => {
  const response = await queryPage(
    searchEmp.value.name,
    searchEmp.value.gender,
    searchEmp.value.date,
    currentPage.value,
    pageSize.value
  );
  console.log(searchEmp.value.name);
  if (response.code == 1) {
    // 解析数据
    empList.value = response.data.rows;
    total.value = response.data.total;
  } else {
    console.log(response.msg);
  }
};

// 表单重置（重置事件）
const reset = () => {
  searchEmp.value = {
    name: "",
    gender: "",
    date: "",
  };
  search();
};

// 新增员工
const addEmp = () => {
  // 显示对话框
  addEmpDialogFormVisible.value = true;
};

// 删除员工
const delEmp = () => {};

// 批量删除员工
const delAllEmp = () => {};

// 编辑员工
const editEmp = () => {};

// size-change当每页展示数发生变化时触发
const handleSizeChange = (val) => {
  console.log(`每页展示${val}条`);
  search();
};

// current-change页码发生变化时触发
const handleCurrentChange = (val) => {
  console.log(`当前页${val}`);
  search();
};

// 添加员工的表单行为
import { reactive } from "vue";
import { ElForm, ElFormItem, ElInput, ElButton } from "element-plus";

// 控制添加员工的表单的显隐
const addEmpDialogFormVisible = ref(false);

// 创建员工的数据模型
const emp = reactive({
  userName: "",
  empName: "",
  phont: "",
  job: "",
  salary: "",
  delivery: "",
  deptName: "",
  gender: "",
  date: "",
});

// 定义校验规则
const rules = reactive({
  userName: [
    { required: true, message: "请输入用户名", trigger: "change" },
    { min: 3, max: 10, message: "长度介于3到10之间", trigger: "change" },
  ],
  empName: [
    {
      required: true,
      message: "请输入姓名",
      trigger: "change",
    },
  ],
  phone: [
    {
      required: true,
      message: "请输入手机号",
      trigger: "change",
    },
    { min: 11, max: 11, message: "请输入合法的手机号", trigger: "change" },
  ],
  date: [
    {
      type: "date",
      required: true,
      message: "请选取时间",
      trigger: "change",
    },
  ],
  job: [
    {
      required: true,
      message: "请输入职位名称",
      trigger: "change",
    },
  ],
  salary: [
    {
      required: true,
      message: "请输入薪资水平",
      trigger: "change",
    },
  ],
  deptName: [
    {
      required: true,
      message: "请输入部门名称",
      trigger: "change",
    },
  ],
  gender: [
    {
      required: true,
      message: "请选取性别",
      trigger: "change",
    },
  ],
});

// 表单的提交事件
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });
};

// 表单的重置事件
const resetForm = (emp) => {
  // 隐藏对话框
  addEmpDialogFormVisible.value = false;
  // 重置表单数据
  if (!emp) return;
  emp = reactive({
    userName: "",
    empName: "",
    phont: "",
    job: "",
    salary: "",
    delivery: "",
    deptName: "",
    gender: "",
    date: "",
  });
};

// 上传图片
const options = Array.from({ length: 10000 }).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`,
}));
</script>

<template>
  <h1>员工管理</h1>

  <!--搜索栏-->
  <div class="search-bar">
    <el-form :inline="true" :model="searchEmp" class="search-form">
      <el-form-item label="姓名">
        <el-input
          v-model="searchEmp.name"
          placeholder="请输入员工姓名"
          clearable
        />
      </el-form-item>
      <el-form-item label="性别">
        <el-select
          v-model="searchEmp.gender"
          placeholder="请输入员工性别"
          clearable
        >
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="入职时间">
        <el-date-picker
          v-model="searchEmp.date"
          type="date"
          placeholder="选取入职时间"
          clearable
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="reset" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!--功能按钮-->
  <div class="function-btn">
    <el-button type="primary" @click="addEmp"
      ><el-icon><Plus /></el-icon>新增员工</el-button
    >
    <el-button type="danger" @click="delAllEmp"
      ><el-icon><Minus /></el-icon>批量删除</el-button
    >
  </div>

  <div class="table">
    <el-table :data="empList" border style="width: 100%">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="empName" label="姓名" width="120" align="center" />
      <el-table-column prop="gender" label="性别" width="120" align="center">
        <template #default="scope">{{
          scope.row.gender === 1 ? "男" : "女"
        }}</template>
      </el-table-column>
      <el-table-column prop="image" label="头像" width="120" align="center">
        <template #default="scope">
          <img :src="scope.row.image" height="40px" />
        </template>
      </el-table-column>
      <el-table-column prop="job" label="职位" width="120" align="center">
        <template #default="scope">
          <span v-if="scope.row.job == 1">班主任</span>
          <span v-else-if="scope.row.job == 2">讲师</span>
          <span v-else-if="scope.row.job == 3">学工主管</span>
          <span v-else-if="scope.row.job == 4">教研主管</span>
          <span v-else-if="scope.row.job == 5">咨询师</span>
          <span v-else-if="scope.row.job == 6">其他</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="入职日期"
        width="180"
        align="center"
      />
      <el-table-column
        prop="deptName"
        label="所属部门"
        width="120"
        align="center"
      />
      <el-table-column
        prop="updateTime"
        label="最后操作时间"
        width="200"
        align="center"
      />
      <el-table-column label="操作" align="center">
        <el-button type="primary" size="small" round>
          <el-icon><Edit /></el-icon>编辑</el-button
        >
        <el-button type="danger" size="small" round>
          <el-icon><Delete /></el-icon>删除</el-button
        >
      </el-table-column>
    </el-table>
  </div>

  <!--分页栏-->
  <div class="pagination">
    <!--page-sizes每页显示条数选择器-->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      :size="SizeForPagination"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--size-change当每页展示数发生变化时触发-->
    <!--current-change页码发生变化时触发-->
  </div>
  <!--添加员工的表单-->
  <div class="add-emp-form">
    <el-dialog v-model="addEmpDialogFormVisible" title="添加员工" width="500">
      <el-form
        ref="ruleFormRef"
        style="max-width: 450px"
        :model="emp"
        :rules="rules"
        label-width="auto"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="emp.userName" />
        </el-form-item>

        <el-form-item label="姓名" prop="empName">
          <el-input v-model="emp.empName" />
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <el-select v-model="emp.gender" style="width: 350px">
            <el-option label="男" value="1" />
            <el-option label="女" value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="emp.phone" />
        </el-form-item>

        <el-form-item label="职位" prop="job">
          <el-select v-model="emp.job" style="width: 350px">
            <el-option label="班主任" value="1" />
            <el-option label="讲师" value="2" />
            <el-option label="学工主管" value="3" />
            <el-option label="教研主管" value="4" />
            <el-option label="咨询师" value="5" />
            <el-option label="其他" value="6" />
          </el-select>
        </el-form-item>

        <el-form-item label="薪资" prop="salary">
          <el-input v-model="emp.salary" />
        </el-form-item>

        <el-form-item label="所属部门" prop="deptName">
          <el-select v-model="emp.deptName" style="width: 350px"> </el-select>
        </el-form-item>

        <el-form-item prop="date" label="入职日期" required>
          <el-date-picker
            v-model="emp.date"
            type="date"
            aria-label="Pick a date"
            placeholder="Pick a date"
            style="width: 350px"
            value-format="YYYY-MM-DD"
          />

          <br />

          <el-form-item class="headIcon">
            <el-upload
              class="upload-demo"
              drag
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
              multiple
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                拖拽头像到此处或 <em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  jpg/png 格式的图片,要求不多于500kb
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="resetForm(emp)">取消</el-button>
          <el-button type="primary" @click="addEmpDialogFormVisible = false">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.add-emp-form .el-input {
  --el-input-width: 350px;
}
.table {
  margin-top: 30px;
}
.pagination {
  margin-top: 30px;
}
.add-emp-form {
  margin-top: 30px;
}
.headIcon {
  margin-top: 30px;
}
</style>
