<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import * as echarts from "echarts";
import { onMounted } from "vue";
import { getStuDegreeData } from "@/api/report";
import { getStuCountData } from "@/api/report";

// 第一张表数据模型
let chartDom1;
let myChart1;
let option1;
option1 = {
  legend: {
    top: "bottom",
  },
  toolbox: {
    show: true,
    feature: {
      mark: { show: true },
      dataView: { show: true, readOnly: false },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
  series: [
    {
      name: "Nightingale Chart",
      type: "pie",
      radius: [50, 250],
      center: ["50%", "50%"],
      roseType: "area",
      itemStyle: {
        borderRadius: 8,
      },
      data: [],
    },
  ],
};

// 第二张表数据模型
let chartDom2;
let myChart2;
let option2;

option2 = {
  xAxis: {
    type: "category",
    data: [],
    axisLabel: {
      rotate: 30, // 旋转标签（重点）
      interval: 0, // 强制显示所有标签（避免标签重叠被隐藏）
    },
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [],
      type: "bar",
      showBackground: true,
      backgroundStyle: {
        color: "rgba(180, 180, 180, 0.2)",
      },
    },
  ],
};

onMounted(async () => {
  // 加载第一张表数据
  chartDom1 = document.getElementById("chart1");
  myChart1 = echarts.init(chartDom1);

  const response1 = await getStuDegreeData();

  console.log(response1);

  option1.series[0].data = response1.data;

  option1 && myChart1.setOption(option1);

  // 第二张表数据
  chartDom2 = document.getElementById("chart2");
  myChart2 = echarts.init(chartDom2);

  // 获取标签数据
  const response2 = await getStuCountData();

  const dataAxis = response2.data.clazzList;
  const data = response2.data.dataList;

  // 重新赋值
  option2.xAxis.data = dataAxis;
  option2.series[0].data = data;
  option2 && myChart2.setOption(option2);
});
</script>

<template>
  <div id="main-container">
    <div class="header">
      <h1>学生信息统计</h1>
    </div>

    <div class="main">
      <div id="chart1"></div>

      <div id="chart2"></div>
    </div>
  </div>
</template>

<style scoped>
#main-container .header {
  height: 50px;
}
#main-container .main {
  height: 1200px;
  width: 700px;
  margin: 50px auto;
}
#chart1 {
  height: 50%;
  width: 100%;
}
#chart2 {
  height: 50%;
  width: 100%;
}
</style>
