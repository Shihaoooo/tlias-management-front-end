<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import * as echarts from "echarts";
import { onMounted, ref } from "vue";
import { getEmpJobData, getEmpGenderData } from "@/api/report";

// 第一张图表数据模型
let chartDom1;
let myChart1;
let option1;
const empJobData = ref([]);

// 第二张图表数据模型
let chartDom2;
let myChart2;
let option2;

// 挂载生命周期
onMounted(async () => {
  // 挂载第一张图表
  chartDom1 = document.getElementById("chart1");
  myChart1 = echarts.init(chartDom1);
  option1;

  // 加载第一张的表数据
  const jobResponse = await getEmpJobData();

  for (let i = 0; i < jobResponse.data.jobList.length; i++) {
    empJobData.value.push({
      name: jobResponse.data.jobList[i],
      value: jobResponse.data.amountList[i],
    });
  }

  console.log(empJobData.value);
  option1 && myChart1.setOption(option1); // 数据加载完成后再渲染图表

  // 挂载第二张图表
  chartDom2 = document.getElementById("chart2");
  myChart2 = echarts.init(chartDom2);
  option2;

  // 加载第二张图表数据
  const genderResponse = await getEmpGenderData();

  option2.series[0].data = genderResponse.data;

  option2 && myChart2.setOption(option2);
});

// 第一张图表数据区
option1 = {
  backgroundColor: "#ffffff",
  title: {
    text: "员工职位人数比例",
    left: "center",
    top: 20,
    textStyle: {
      color: "#333",
    },
  },
  tooltip: {
    trigger: "item",
  },
  visualMap: {
    show: false,
    min: 15,
    max: 80,
    inRange: {
      colorLightness: [0, 0.9],
    },
  },
  series: [
    {
      name: "人数",
      type: "pie",
      radius: "55%",
      center: ["50%", "50%"],
      data: empJobData.value.sort(function (a, b) {
        return a.value - b.value;
      }),
      roseType: "radius",
      label: {
        color: "rgb(31, 31, 31,0.5)",
        fontSize: 20,
      },
      labelLine: {
        lineStyle: {
          color: "rgb(31, 31, 31,0.5)",
        },
        smooth: 0.2,
        length: 10,
        length2: 20,
      },
      itemStyle: {
        color: "#3f9eff",
        shadowBlur: 200,
        shadowColor: "rgba(0, 0, 0, 0.5)",
      },
      animationType: "scale",
      animationEasing: "elasticOut",
      animationDelay: function (idx) {
        return Math.random() * 200;
      },
    },
  ],
};

// 第二张图表数据区
option2 = {
  title: {
    text: "员工性别人数比例",
    left: "center",
    top: 20,
    textStyle: {
      color: "#333",
    },
  },
  tooltip: {
    trigger: "item",
  },
  legend: {
    top: "10%",
    left: "center",
  },
  series: [
    {
      name: "人数",
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      padAngle: 5,
      itemStyle: {
        borderRadius: 10,
      },
      label: {
        show: false,
        position: "center",
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20,
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
      data: [],
    },
  ],
};
</script>

<template>
  <div id="main-container">
    <div class="header">
      <h1>员工信息统计</h1>
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
