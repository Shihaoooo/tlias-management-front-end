<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { onMounted, ref, nextTick } from "vue";
import { Edit, Delete } from "@element-plus/icons-vue";
import {
  queryPage,
  update,
  add,
  dropById,
  queryById,
  getSubject,
} from "@/api/clazz";
import { queryPage as queryPageEmpApi } from "@/api/emp";
import { ElMessage, ElMessageBox } from "element-plus";

// 定义钩子函数
onMounted(() => {
  search();
});
// 定义表格数据
const clazzList = ref([]);
const empList = ref([]);

// 定义搜索条件
const searchClazz = ref({
  name: "",
  date: "",
});

// 定义分页数据
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 定义对话框数据
const dialogFormVisible = ref(false);
const title = ref("");
const formRef = ref();
const subjectList = ref([]);

const formData = ref({
  name: "",
  room: "",
  beginDate: "",
  endDate: "",
  masterName: "",
  subject: "",
  subjectName: "",
});

// 校验规则
const rules = ref({
  name: [
    { required: true, message: "请输入班级名称", trigger: "change" },
    { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "change" },
  ],
  room: [
    {
      required: true,
      message: "请输入正确的班级教室",
      trigger: "change",
      type: "string",
      min: 3,
      max: 3,
    },
  ],
  masterName: [
    { required: true, message: "请输入班主任姓名", trigger: "change" },
    { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "change" },
  ],
  beginDate: [{ required: true, message: "请选择开班日期", trigger: "change" }],
  endDate: [{ required: true, message: "请选择结业日期", trigger: "change" }],
  subjectName: [
    { required: true, message: "请输入学科", trigger: "change" },
    { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "change" },
  ],
});

// 查询
const search = async () => {
  let begin = "";
  let end = "";
  if (searchClazz.value.date != "") {
    begin = searchClazz.value.date[0];
    end = searchClazz.value.date[1];
  }

  // 解析数据
  const response = await queryPage(
    searchClazz.value.name,
    begin,
    end,
    currentPage.value,
    pageSize.value
  );

  clazzList.value = response.data.rows;

  console.log(response.data.rows);

  total.value = response.data.total;
};

// 重置搜索
const reset = () => {
  searchClazz.value = {
    name: "",
    date: "",
  };
};

// 重置表单
const resetForm = async () => {
  await nextTick();
  // 清空表单项
  formRef.value.resetFields();

  // 关闭表单
  dialogFormVisible.value = false;
};

// 提交表单
const submitForm = async () => {
  // 校验表单(完整性校验)
  if (
    formData.value.name == "" ||
    formData.value.room == "" ||
    formData.value.masterName == "" ||
    formData.value.beginDate == "" ||
    formData.value.endDate == "" ||
    formData.value.subject == ""
  ) {
    ElMessage.error("请完整填写表单");
    return;
  }
  if (formData.value.endDate < formData.value.beginDate) {
    // 校验表单（结业日期不能等于或早于开班日期）
    ElMessage.error("结业日期不能早于开班日期");
    return;
  }
  let response;

  if (title.value == "新增班级") {
    response = await add(formData.value);
  } else if (title.value == "修改班级") {
    response = await update(formData.value);
  } else {
    ElMessage.error("表单渲染出错");
  }

  if (response.code == 1) {
    // 提交成功
    ElMessage.success("操作成功");
  } else {
    ElMessage.error(response.msg);
  }
  // 关闭表单
  dialogFormVisible.value = false;
  // 刷新表格
  search();
};
// 新增班级
const addClazz = async () => {
  title.value = "新增班级";

  // 显示对话框
  dialogFormVisible.value = true;

  // 2. 等待 DOM 渲染完成（表单已挂载）
  await nextTick();

  formRef.value.resetFields();

  // 加载员工列表
  const response = await queryPageEmpApi("", "", "", 1, 9999999);

  empList.value = response.data.rows;
};

// 删除班级
const delClazz = async (id) => {
  // 弹出确认框
  ElMessageBox.confirm("这是一个不可撤回操作. 是否继续?", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    center: true,
  })
    .then(async () => {
      // 确认删除
      const response = await dropById(id);
      if (response.code == 1) {
        ElMessage.success("操作成功");
      } else {
        ElMessage.error(response.msg);
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "操作取消",
      });
    });
};

// 修改班级
const editClazz = async (id) => {
  title.value = "修改班级";
  // 查询回显示
  const response = await queryById(id);

  // 加载员工信息
  const response_emp = await queryPageEmpApi("", "", "", 1, 9999999);
  empList.value = response_emp.data.rows;

  // 加载科目信息
  const response_subject = await getSubject();

  subjectList.value = response_subject.data;

  if (response.code == 1) {
    console.log("查询回显成功");
    // 解析数据
    formData.value = response.data;

    // 显示对话框
    dialogFormVisible.value = true;

    console.log(formData.value);
  } else {
    console.log("查询回显失败");
    ElMessage.error(response.msg);
    return;
  }
};
</script>

<template>
  <h1>班级管理</h1>

  <!--搜索栏-->
  <div class="search-bar">
    <el-form :inline="true" :model="searchClazz" class="search-form">
      <el-form-item label="名称">
        <el-input
          v-model="searchClazz.name"
          placeholder="请输入班级名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="开班时间">
        <el-date-picker
          v-model="searchClazz.date"
          type="daterange"
          range-separator="到"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :size="size"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="reset" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>

  <el-button type="primary" @click="addClazz">新增班级</el-button>
  <!--表格-->
  <div class="table">
    <el-table :data="clazzList" border style="width: 100%">
      <el-table-column prop="id" label="序号" width="60" align="center" />
      <el-table-column
        prop="name"
        label="班级名称"
        width="150"
        align="center"
      />
      <el-table-column prop="room" label="班级教室" width="110" align="center" />
      <el-table-column
        prop="masterName"
        label="班主任"
        width="100"
        align="center"
      />
      <el-table-column
        prop="beginDate"
        label="开班日期"
        width="150"
        align="center"
      />
      <el-table-column
        prop="endDate"
        label="结业日期"
        width="150"
        align="center"
      />
      <el-table-column prop="status" label="状态" width="100" align="center" />
      <el-table-column
        prop="updateTime"
        label="最后操作时间"
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            round
            @click="editClazz(scope.row.id)"
          >
            <el-icon><Edit /></el-icon>编辑</el-button
          >
          <el-button
            type="danger"
            size="small"
            round
            @click="delClazz(scope.row.id)"
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
      :page-sizes="[3, 10, 20, 30, 50, 100]"
      :disabled="disabled"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="search()"
      @current-change="search()"
    />
  </div>

  <!--对话框-->
  <el-dialog v-model="dialogFormVisible" :title="title" width="400">
    <el-form
      :model="formData"
      :inline="true"
      ref="formRef"
      :rules="rules"
      label-width="auto"
      label-position="left"
    >
      <div class="dialog-body">
        <el-form-item label="班级名称" prop="name">
          <el-input
            placeholder="请输入班级名称"
            v-model="formData.name"
            style="width: 190px"
          ></el-input>
        </el-form-item>
        <el-form-item label="班级教室" prop="room">
          <el-input
            placeholder="请输入班级教室"
            v-model="formData.room"
            style="width: 190px"
          ></el-input>
        </el-form-item>
        <el-form-item label="班主任姓名" prop="masterName">
          <el-select v-model="formData.masterId">
            <el-option
              v-for="emp in empList"
              :key="emp.id"
              :label="emp.empName"
              :value="emp.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开班日期" prop="beginDate">
          <el-date-picker
            v-model="formData.beginDate"
            type="date"
            placeholder="请选择开班日期"
            value-format="YYYY-MM-DD"
            style="width: 180px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结业日期" prop="endDate">
          <el-date-picker
            v-model="formData.endDate"
            type="date"
            placeholder="请选择结业日期"
            value-format="YYYY-MM-DD"
            style="width: 180px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="学科" prop="subject">
          <el-select v-model="formData.subject">
            <el-option
              v-for="objSub in subjectList"
              :key="objSub.subject"
              :label="objSub.subjectName"
              :value="objSub.subject"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="dialog-footer">
        <el-button @click="resetForm">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<style scoped>
.table {
  margin: 20px auto;
}
</style>
