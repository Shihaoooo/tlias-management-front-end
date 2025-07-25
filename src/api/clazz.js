import request from "@/utils/request";

// 条件分页查询所有班级
export const queryPage = (name, begin, end, page, pageSize) => {
  return request.get(
    `/clazzs?name=${name}&begin=${begin}&end=${end}&currentPage=${page}&pageSize=${pageSize}`
  );
};

// 查询所有班级
export const queryAll = () => {
  return request.get("/clazzs/list");
};

// 根据id查询班级信息
export const queryById = (id) => {
  return request.get(`/clazzs/${id}`);
};

// 新增班级
export const add = (clazz) => {
  return request.post("/clazzs", clazz);
};

// 修改班级
export const update = (clazz) => {
  return request.put(`/clazzs`, clazz);
};

// 删除班级
export const dropById = (id) => {
  return request.delete(`/clazzs/${id}`);
};

// 获取所有科目名称
export const getSubject = () => {
  return request.get("/clazzs/subject");
}
