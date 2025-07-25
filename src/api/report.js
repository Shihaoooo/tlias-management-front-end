import request from "@/utils/request";

// 员工统计岗位人数
export const getEmpJobData = () => {
  return request.get("/report/empJobData");
};

// 员工统计性别
export const getEmpGenderData = () => {
  return request.get("/report/empGenderData");
};

// 学员统计学历
export const getStuDegreeData = () => {
  return request.get("/report/studentDegreeData");
};

// 学员统计人数
export const getStuCountData = () => {
  return request.get("/report/studentCountData");
};
