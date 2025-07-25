<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from "vue";
import {
  queryPage,
  addEmp as addEmpApi,
  delEmp as delEmpApi,
  updateEmp as updateEmpApi,
} from "@/api/emp";
import { queryAll as queryAllDeptApi } from "@/api/dept";
import {
  Minus,
  Plus,
  Edit,
  Delete,
  UploadFilled,
} from "@element-plus/icons-vue";
import { reactive } from "vue";
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage } from "element-plus";
import { queryEmpById } from "../../api/emp";

// 绑定表格实例
const tableRef = ref();
// 定义校验规则
const rules = ref({
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
  deptId: [
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
  empList: {
    type: "array", // 声明是数组类型
    defaultField: {
      // 数组中每个对象的规则
      type: "object",
      properties: {
        // 工作经历的日期规则（对应expr.date）
        date: [
          { required: true, message: "请选择工作经历日期", trigger: "change" },
          { type: "string", message: "日期格式错误", trigger: "change" }, // 因value-format是字符串，type用string
        ],
        // 公司名称规则（对应expr.company）
        company: [
          { required: true, message: "请输入公司名称", trigger: "change" },
        ],
        // 职位规则（对应expr.job）
        job: [{ required: true, message: "请输入职位", trigger: "change" }],
      },
    },
  },
});

// 定义上传图片的token（因为不是基于axois，所以需要手动处理token）
const token = ref("");
// 表格数据展示
const empList = ref([]);
const dialogTitlle = ref();

// 控制图片自动上传（用于绑定上传组件实例）
const imageUpload = ref();
// 表单引用
const formRef = ref();

// 上传的图片列表
const imageList = ref([]);

// 部门数据列表
const depts = ref([]);

// 职位数据列表
const jobs = ref([
  { name: "班主任", value: 1 },
  { name: "讲师", value: 2 },
  { name: "学工主管", value: 3 },
  { name: "教研主管", value: 4 },
  { name: "咨询师", value: 5 },
  { name: "其他", value: 6 },
]);

// 控制添加员工的表单的显隐
const addEmpDialogFormVisible = ref(false);

// 分页栏数据模型
const currentPage = ref(1); // 当前页数(默认展示页数)
const pageSize = ref(20); // 每页显示条数
const total = ref(0); // 总条数
const SizeForPagination = ref("default");
const background = ref(false); // 背景色
// 创建员工的数据模型
const emp = reactive({
  userName: "",
  empId: "",
  phone: "",
  job: "",
  salary: "",
  deptId: "",
  image: "",
  gender: "",
  date: "",
  empExprList: [],
});
// 创建员工工作经验的数据模型
const empExpr = () => ({
  date: "",
  company: "",
  job: "",
});

// 员工搜索条件
const searchEmp = ref({
  name: "",
  gender: "",
  date: "",
});

//定义钩子函数，刷新页面时，自动触发查询事件
onMounted(() => {
  search();

  // 查询所有部门数据
  queryAllDept();

  // 获取token给upload组件
  const loginUser = JSON.parse(localStorage.getItem("loginUser"));

  if (loginUser) {
    token.value = loginUser.token;
  } else {
    ElMessage.error("获取token失败,请重新登陆");
  }
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

// 查询所有部门数据
const queryAllDept = async () => {
  const response = await queryAllDeptApi();
  if (response.code == 1) {
    depts.value = response.data;
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

// 添加员工经历
const addEmpExpr = () => {
  console.log("addEmpExpr 执行了");
  // 最多写三段
  console.log(emp.empExprList.length);
  if (emp.empExprList.length < 3) {
    emp.empExprList.push(empExpr());
  } else {
    ElMessage.warning("最多只能添加三条工作经历");
  }
};

// 删除员工经历
const delEmpExpr = (index) => {
  // 如果经验列表为空则不执行
  if (emp.empExprList.length == 0) {
    return;
  } else {
    // 删除指定元素
    emp.empExprList.splice(index, 1);
  }
};

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

// 表单的提交事件
const submitForm = async (emp) => {
  console.log("submitForm 执行了");
  // 检查表单是否为空数据
  if (
    emp.userName === "" ||
    emp.empName === "" ||
    emp.phone === "" ||
    emp.job === "" ||
    emp.salary === "" ||
    emp.deptName === "" ||
    emp.gender === "" ||
    emp.date === ""
  ) {
    ElMessage.error("请填写完整的表单");
    return;
  } else {
    const option = dialogTitlle.value;
    console.log("表单数据完整");
    // 表单项完整，先上传图片获取url，如果没有图片，则为#
    if (option == "新增员工") {
      console.log("新增员工");
      if (imageList.value.length == 1) {
        console.log("图片存在");
        console.log(imageList.value.length);
        // 图片存在，上传图片
        imageUpload.value.submit();
      } else {
        console.log("图片不存在");
        // 没有触发图片上传成功的钩子，手动上传员工基本信息
        emp.image = "#";
        const response = await addEmpApi(emp);

        console.log(response);
        if (response.code == 1) {
          ElMessage.success("操作成功");
          // 刷新页面
          search();
          // 隐藏对话框
          addEmpDialogFormVisible.value = false;
          // 重置表单数据
          resetForm(emp);
        } else {
          ElMessage.error(response.msg);
          // 隐藏对话框
          addEmpDialogFormVisible.value = false;
        }
      }
    } else if (option == "编辑员工") {
      console.log("编辑员工");
      // 是否上传新头像
      if (imageList.value.length == 1) {
        // 如果上传了新头像，就重新向服务器上传图片
        imageUpload.value.submit();
      } else {
        // 没有上传新头像，则不用上传到服务器，直接保持原来的头像
        const response = await updateEmpApi(emp);

        if (response.code == 1) {
          ElMessage.success("操作成功");
          // 刷新页面
          search();
          // 隐藏对话框
          addEmpDialogFormVisible.value = false;
          // 重置表单数据
          resetForm(emp);
        } else {
          ElMessage.error(response.msg);
          // 隐藏对话框
          addEmpDialogFormVisible.value = false;
        }
      }
    }
  }
};

// 表单的重置事件
const resetForm = () => {
  // 隐藏对话框
  addEmpDialogFormVisible.value = false;
  // 重置表单数据
  formRef.value.resetFields();
  // 重置图片列表
  imageList.value = [];
  // 重置工作经验列表
  emp.empExprList = [];
};

// 新增员工
const addEmp = () => {
  dialogTitlle.value = "新增员工";
  // 先渲染表单防止表单对象挂载失败引发 undefined 错误
  addEmpDialogFormVisible.value = true;
  // 重置表单数据
  formRef.value.resetFields();
  // 重置图片列表
  imageList.value = [];
  // 重置工作经验列表
  emp.empExprList = [];
  // 显示对话框
};

// 文件上传前的钩子函数
const beforeAvatarUpload = (rowFile) => {
  console.log("beforeAvatarUpload 执行了");
  // 图片格式检测
  if (rowFile.type !== "image/jpeg" && rowFile.type !== "image/png") {
    ElMessage.error("请上传图片文件");
    return false;
  }
  // 文件大小检测(500kb以内)
  if (rowFile.size > 500 * 1024) {
    ElMessage.error("文件大小不能超过500kb");
    return false;
  }
  return true;
};

// 表单的图片上传成功事件
const handleSuccess = async (response) => {
  console.log("handleSuccess 执行了");
  // console.log(response);
  // 上传成功，将图片url绑定到emp对象中

  emp.image = response.data;

  const option = dialogTitlle.value;

  let response_data;

  console.log(`option = ${option}`);

  if (option == "新增员工") {
    // 上传员工基本数据
    response_data = await addEmpApi(emp);
  } else if (option == "编辑员工") {
    response_data = await updateEmpApi(emp);
  } else {
    ElMessage.error("获取操作失败");
  }

  console.log(response);
  console.log(response.data);
  if (response_data.code == 1) {
    ElMessage.success("操作成功");
    // 刷新页面
    search();
    // 隐藏对话框
    addEmpDialogFormVisible.value = false;
    // 重置表单数据
    resetForm(emp);
  } else {
    ElMessage.error(response.data.msg);
  }
};

// 获取多选框选中的所有行
const getSelectedRows = () => {
  const selectionRows = tableRef.value.getSelectionRows();
  let ids = "ids=";
  selectionRows.forEach((element) => {
    ids += element.id + ",";
    // 去掉最后一个逗号
  });
  //console.log(ids.substring(0, ids.length - 1));

  // 删除所选员工

  ids = ids.substring(0, ids.length - 1);
  return ids;
};

// 批量删除员工
const delEmp = async (id) => {
  if (id == undefined || id == null || id == "") {
    const ids = getSelectedRows();

    if (ids != null && ids != "") {
      const respones = await delEmpApi(ids);

      if (respones.code == 1) {
        ElMessage.success("删除员工成功");
        // 刷新页面
        search();
      } else {
        ElMessage.error(respones.msg);
      }
    }
  } else {
    const respones = await delEmpApi(`ids=${id}`);

    if (respones.code == 1) {
      ElMessage.success("删除员工成功");
      // 刷新页面
      search();
    } else {
      ElMessage.error(respones.msg);
    }
  }
};

// 编辑员工
const editEmp = async (id) => {
  // 编辑对话框标题
  dialogTitlle.value = "编辑员工";
  // 查询回显示
  if (id != null && id != "") {
    const response = await queryEmpById(id);

    const data = response.data;

    emp.id = data.id;
    emp.userName = data.userName;
    emp.empName = data.empName;
    emp.phone = data.phone;
    emp.job = data.job;
    emp.salary = data.salary;
    emp.deptId = data.deptId;

    emp.image = data.image;

    emp.gender = data.gender;
    emp.date = data.date;
    emp.empExprList = data.empExprList;

    // 显示对话框
    addEmpDialogFormVisible.value = true;
  }
};
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
    <el-button type="danger" @click="delEmp(null)"
      ><el-icon><Minus /></el-icon>批量删除</el-button
    >
  </div>
  <!--数据表格-->
  <div class="table">
    <el-table :data="empList" border style="width: 100%" ref="tableRef">
      <el-table-column type="selection" width="40" align="center" />
      <el-table-column prop="id" label="员工编号" width="90" align="center" />
      <el-table-column prop="empName" label="姓名" width="80" align="center" />
      <el-table-column prop="gender" label="性别" width="80" align="center">
        <template #default="scope">{{
          scope.row.gender === 1 ? "男" : "女"
        }}</template>
      </el-table-column>
      <el-table-column prop="image" label="头像" width="80" align="center">
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
        width="150"
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
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            round
            @click="editEmp(scope.row.id)"
          >
            <el-icon><Edit /></el-icon>编辑</el-button
          >
          <el-button
            type="danger"
            size="small"
            round
            @click="delEmp(scope.row.id)"
          >
            <el-icon><Delete /></el-icon>删除</el-button
          >
        </template>
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
    <el-dialog
      v-model="addEmpDialogFormVisible"
      :title="dialogTitlle"
      width="500"
    >
      <el-form
        ref="formRef"
        style="max-width: 800px"
        :model="emp"
        :rules="rules"
        label-width="auto"
        label-position="left"
      >
        <div class="base">
          <el-form-item label="用户名" prop="userName">
            <el-input
              v-model="emp.userName"
              placeholder="请输入用户名,长度3-10位"
            />
          </el-form-item>

          <el-form-item label="姓名" prop="empName">
            <el-input v-model="emp.empName" placeholder="请输入姓名" />
          </el-form-item>

          <el-form-item label="性别" prop="gender">
            <el-select v-model="emp.gender" style="width: 350px">
              <el-option label="男" value="1" />
              <el-option label="女" value="2" />
            </el-select>
          </el-form-item>

          <el-form-item label="手机号" prop="phone">
            <el-input v-model="emp.phone" placeholder="请输入手机号" />
          </el-form-item>

          <el-form-item label="职位" prop="job">
            <el-select v-model="emp.job" style="width: 350px">
              <el-option
                v-for="job in jobs"
                :key="job.value"
                :label="job.name"
                :value="job.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="薪资" prop="salary">
            <el-input v-model="emp.salary" placeholder="请输入薪资水平" />
          </el-form-item>

          <el-form-item label="所属部门" prop="deptId">
            <el-select v-model="emp.deptId" style="width: 350px">
              <el-option
                v-for="dept in depts"
                :key="dept.id"
                :label="dept.name"
                :value="dept.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="date" label="入职日期" required>
            <el-date-picker
              v-model="emp.date"
              type="date"
              aria-label="Pick a date"
              placeholder="日期"
              style="width: 350px"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </div>

        <br />

        <el-form-item class="upload">
          <el-upload
            :headers="{ token: token }"
            ref="imageUpload"
            drag
            action="/api/upload"
            multiple
            show-file-list="true"
            limit="1"
            :auto-upload="false"
            :before-upload="beforeAvatarUpload"
            v-model:file-list="imageList"
            @success="handleSuccess"
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

          <!--添加员工经历-->
        </el-form-item>

        <el-form-item class="empexpr"
          >工作经历&nbsp;&nbsp;<el-button
            type="success"
            @click="addEmpExpr"
            plain
            >添加</el-button
          >
        </el-form-item>

        <el-row
          :gutter="20"
          v-for="(expr, index) in emp.empExprList"
          :key="expr.id"
        >
          <el-col :span="8"
            ><el-form-item :prop="`empExprList[${index}].date`">
              <el-date-picker
                v-model="expr.date"
                type="date"
                aria-label="Pick a date"
                placeholder="日期"
                style="width: 150px"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :prop="`empExprList[${index}].company`">
              <el-input
                style="width: 150px"
                v-model="expr.company"
                placeholder="公司名称"
              />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :prop="`empExprList[${index}].job`">
              <el-input
                style="width: 150px"
                v-model="expr.job"
                placeholder="职位"
              />
            </el-form-item>
          </el-col>

          <el-col :span="3">
            <el-form-item class="empexpr"
              ><el-button type="danger" @click="delEmpExpr(index)" plain
                >删除</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="resetForm()">取消</el-button>
          <el-button type="primary" @click="submitForm(emp)"> 确定 </el-button>
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
.upload {
  margin-top: 30px;
}

.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  height: 40px;
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
