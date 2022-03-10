<template>
  <div ref="radar" class="radarEchart" />
</template>

<script>
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'
// 引入柱状图图表，图表后缀都为 Chart
import { RadarChart } from 'echarts/charts'
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components'
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  RadarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
])
export default {
  data() {
    return {

    }
  },
  mounted() {
    // 实例创建完毕 页面渲染完毕，可以获取到元素节点
    const myEcharts = echarts.init(this.$refs.radar) // 得到图标实例
    myEcharts.setOption({
      legend: {
        data: ['Allocated Budget', 'Actual Spending']
      },
      radar: {
        // shape: 'circle',
        // 每个区域的最高值
        indicator: [
          { name: '考勤', max: 100 },
          { name: '新技术', max: 100 },
          { name: '修复bug', max: 100 },
          { name: '培训新人', max: 100 },
          { name: '自主学习', max: 100 },
          { name: '工作产出', max: 100 }
        ],
        axisName: {
          color: '#000',
          backgroundColor: '#bfa',
          borderRadius: 3,
          padding: [3, 5]
        }
      },
      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
          data: [
            {
              value: [42, 30, 20, 35, 50, 80],
              name: 'Chaos'
            },
            {
              value: [50, 40, 28, 26, 42, 21],
              name: 'Tony'
            }
          ]
        }
      ]
    })
  }
}
</script>

<style scoped>
.radarEchart{
    width:400px;
    height: 400px;
}
</style>
