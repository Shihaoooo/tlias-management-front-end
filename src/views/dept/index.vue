<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
import { DeleteFilled, Edit, Plus } from "@element-plus/icons-vue";
import { ref, onMounted } from "vue";
import { queryAll, add, queryById, update, dropById } from "@/api/dept";
import { ElMessage, ElMessageBox } from "element-plus";

//要展示的数据集
const deptList = ref([]);

//控制对话框显隐
const dialogFormVisible = ref(false);
const dialogFormVisible_edit = ref(false);

//控制表单宽度
const formLabelWidth = "140px";

//控制表单的数据
const dept = ref({ name: "" });
const dept_id = ref("");

//控制表单标题
const formTitle = ref("");

//控制表单校验规则
// 范形是ts的语法可以直接删掉，reactive可以替换为ref(校验规则不要用ts的语法就可以正常运行了)
const rules = ref({
  name: [
    // 第一个校验规则     blur：失去焦点时触发
    { required: true, message: "请输入部门名称", trigger: "blur" },
    // 第二个校验规则     blur:失去焦点时触发，min:最小长度，max:最大长度
    {
      min: 2,
      max: 10,
      message: "部门的长度必须在2到10个字符之间",
      trigger: "blur",
    },
  ],
});

//声明钩子函数
onMounted(() => {
  search();
});

// 查询函数
//const search = async () => {
//  const result = await axios.get('http://localhost:8080/depts');
//  if(result.data.code === 1){
//value访问其内部值
//    deptList.value = result.data.data;
// }

//  console.log(deptList.value)

//}

// 数据查询事件
const search = async () => {
  const response = await queryAll();
  // 使用axios对象创建的requet对象中，使用了拦截器已经将response = response.data
  deptList.value = response.data;
};

// 数据插入事件或修改事件
const save = async () => {
  if (dept.value.name.length == 0) {
    console.log("表单为空");
  } else if (dept.value.name.length < 2 || dept.value.name.length > 10) {
    console.log("部门名称长度不符合要求");
  } else {
    // 要求post请求给后端返回一个js数据，所以不用dept.value.name，而是dept.value
    const response = await add(dept.value);

    if (response.code == 1) {
      //1.提示成功
      ElMessage({
        message: "添加成功 ovo ! ",
        type: "success",
      });
      //2.关闭对话框
      dialogFormVisible.value = false;

      //3.清空表单数据
      dept.value.name = "";

      //3.刷新页面
      search();
    } else {
      //提示失败
      ElMessage.error(response.msg);
    }
  }
};

// 新增部门对话框弹出事件
const addDept = () => {
  dialogFormVisible.value = true;
  formTitle.value = "新增部门";

  //清空表单数据
  dept.value.name = "";
};

// 新增部门对话框取消事件
const cancel = () => {
  dialogFormVisible.value = false;
  dialogFormVisible_edit.value = false;
  dept.value.name = "";
};

// 编辑对话框弹出事件
const edit = async (id) => {
  //1.打开对话框
  dialogFormVisible_edit.value = true;
  //2.设置标题
  formTitle.value = "编辑部门";
  //3.根据id查询部门信息
  const response = await queryById(id);
  //4.设置表单数据
  dept.value.name = response.data;
  //5.绑定id与名称
  dept_id.value = id;
};

// 提交修改的结果事件
const save_edit = async () => {
  if (dept.value.name.length == 0) {
    console.log("表单为空");
  } else if (dept.value.name.length < 2 || dept.value.name.length > 10) {
    console.log("部门名称长度不符合要求");
  } else {
    // 要求post请求给后端返回一个js数据，所以不用dept.value.name，而是dept.value
    const response = await update({
      id: dept_id.value,
      name: dept.value.name,
    });

    if (response.code == 1) {
      //1.提示成功
      ElMessage({
        message: "修改成功 ovo ! ",
        type: "success",
      });
      //2.关闭对话框
      dialogFormVisible.value = false;

      //3.清空表单数据
      dept.value.name = "";

      //3.刷新页面
      search();
    } else {
      //提示失败
      ElMessage.error(response.msg);
    }
  }
};

// 删除部分的事件
const deleteById = (id) => {
  ElMessageBox.confirm("确认要删除该部门吗?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const response = await dropById(id);

      console.log(response);

      if (response.code == 1) {
        ElMessage.success("删除成功");
        search();
      } else {
        console.log(response);
        console.log(response.code);
        ElMessage.error(response.msg);
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "删除取消",
      });
    });
};
</script>

<template>
  <div>
    <h1>部门管理</h1>
    <el-button size="" round :plain="true" @click="addDept">
      <el-icon><Plus /></el-icon>&nbsp;新增部门
    </el-button>
  </div>

  <br />

  <div>
    <el-table :data="deptList" border style="width: 100%">
      <!--type="index"可以显示序号，还可以排序-->
      <el-table-column align="center" prop="id" label="序号" width="120" />
      <el-table-column
        align="center"
        prop="name"
        label="部门名称"
        width="150"
      />
      <el-table-column align="center" prop="createTime" label="创建时间" />
      <el-table-column align="center" prop="updateTime" label="最后操作时间" />
      <el-table-column align="center" prop="operation" label="操作">
        <template #default="scope">
          <el-button @click="edit(scope.row.id)" type="primary" size="small">
            <el-icon><Edit /></el-icon>编辑
          </el-button>
          <el-button
            @click="deleteById(scope.row.id)"
            type="danger"
            size="small"
          >
            <el-icon><DeleteFilled /></el-icon>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--这是添加部门对话框组件-->
    <el-dialog v-model="dialogFormVisible" :title="formTitle" width="500">
      <el-form :model="dept" :rules="rules">
        <el-form-item
          prop="name"
          label="部门名称"
          :label-width="formLabelWidth"
        >
          <el-input v-model="dept.name" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="save"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>

    <!--这是编辑部门对话框组件-->
    <el-dialog v-model="dialogFormVisible_edit" :title="formTitle" width="500">
      <el-form :model="dept" :rules="rules">
        <el-form-item
          prop="name"
          label="部门名称"
          :label-width="formLabelWidth"
        >
          <el-input v-model="dept.name" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="save_edit"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped></style>
