import request from "@/utils/request";

// 条件分页查询员工数据
export const queryPage = (name, gender, date, currentPage, pageSize) => {
  return request.get(
    `/emps?name=${name}&gender=${gender}&date=${date}&currentPage=${currentPage}&pageSize=${pageSize}`
  );
};

// 新增员工
export const addEmp = (emp) => {
  return request.post("/emps", emp);
};
