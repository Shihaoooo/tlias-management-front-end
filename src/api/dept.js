import request from "@/utils/request";

// 查询所有部门
export const queryAll = () => {
  return request.get("/depts");
};

// 根据id查询部门信息
export const queryById = (id) => {
  //这种是属于拼接类型的的请求 "/depts/id" 模版字符串可以有效防止sql注入问题
  return request.get(`/depts/${id}`);
};

// 新增部门
export const add = (dept) => {
  return request.post("/depts", dept);
};

// 修改部门
export const update = (dept) => {
  return request.put("/depts", dept);
};

// 删除部门
export const dropById = (id) => {
  return request.delete(`/depts?id=${id}`);
};
