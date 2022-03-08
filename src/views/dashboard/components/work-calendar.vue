<template>
  <!-- 工作日历 -->
  <div>
    <el-row type="flex" justify="end">
      <!-- 年 -->
      <!-- 使用组件给定一个日期，日期获取年份，取前五年和后五年 -->
      <el-select v-model="currentYear" size="small" style="width:120px;margin-right:10px" @change="dateChange">
        <el-option
          v-for="item in yearList"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <!-- 月 -->
      <el-select v-model="currentMonth" size="small" style="width:120px" @change="dateChange">
        <el-option
          v-for="item in 12"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select></el-row>
    <el-calendar v-model="currentDate">
      <!-- <template slot="dateCell"> -->
      <!-- 自定义单元格显示内容 -->
      <template v-slot:dateCell="{date,data}">
        <!-- 在 scoped-slot 可以获取到 date（当前单元格的日期）, data（包括 type，isSelected，day 属性）。 -->
        <div class="date-content">
          <span class="text"> {{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  filters: {
    getDay(value) {
      // 专门获取日期
      const day = value.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    }
  },
  props: {
    startDate: {
      type: Date,
      default: () => new Date() // 如果没有传递startDate就获取当前时间
    }
  },
  data() {
    return {
      yearList: [], // 要遍历的年数组
      currentYear: null, // 当前年份
      currentMonth: null,
      currentDay: null,
      currentDate: null, // 当前时间，随着年与月份的变化而变化
      nowMonth: null,
      nowYear: null
    }
  },
  created() {
    // 获取当前年份
    this.currentYear = this.startDate.getFullYear()
    this.nowYear = this.currentYear
    this.currentMonth = this.startDate.getMonth() + 1
    this.nowMonth = this.currentMonth
    this.currentDay = this.startDate.getDate()
    // 快速生成数组
    this.yearList = Array(11).fill().map((i, index) => index + this.currentYear - 5)
    // 钩子函数执行后要初始化日期
    this.currentDate = new Date(`${this.currentYear}-${this.currentMonth}-${this.currentDay}`)
  },
  methods: {
    // 判断当前是否是周末
    isWeek(date) {
      return date.getDay() === 0 || date.getDay() === 6
    },
    dateChange(newV) {
      if (newV === this.nowMonth || newV === this.nowYear) {
        this.currentDate = new Date(`${this.currentYear}-${this.currentMonth}-${this.currentDay}`)
      } else {
        // 生成最新的日期
        this.currentDate = new Date(`${this.currentYear}-${this.currentMonth}-1`)
      }
    }
  }

}
</script>

<style  scoped>
 /deep/ .el-calendar-day {
  height:  auto;
 }
 /deep/ .el-calendar-table__row td,/deep/ .el-calendar-table tr td:first-child,  /deep/ .el-calendar-table__row td.prev{
  border:none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
 /deep/ .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
 /deep/ .el-calendar__header {
   display: none
 }
</style>
