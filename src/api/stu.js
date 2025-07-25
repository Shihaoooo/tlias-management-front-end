import request from "@/utils/request";

// 分页查询学生数据
export const queryPage = (name, degree, clazzId, currentPage, PageSize) => {
  return request.get(
    `/students?name=${name}&degree=${degree}&clazzId=${clazzId}&currentPage=${currentPage}&PageSize=${PageSize}`
  );
};

// 删除学生(ids的值应该是 ids = 1，2，3，4，5...)
export const delStu = (ids) => {
  return request.delete(`/students?${ids}`);
};

// 添加学生
export const addStu = (stu) => {
  return request.post(`/students`, stu);
};

//根据id查询(查询回显)
export const queryStuById = (id) => {
  return request.get(`/students/${id}`);
};

//修改学生
export const updateStu = (stu) => {
  return request.put(`/students`, stu);
};

// 学生违纪处理
export const violation = (id, score) => {
  return request.put(`/students/violation/${id}/${score}`);
};

// 获取所有学历
export const getDegreeList = () => {
  return request.get("/students/degree");
}

// 获取所有班级
export const getClazzList = () => {
  return request.get("/students/clazz");
}