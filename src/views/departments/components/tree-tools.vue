<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <el-col>
      <i v-if="isRoot" class="el-icon-s-custom" />
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="5">
      <el-row type="flex" justify="end">
        <el-col> {{ treeNode.manager }} </el-col>
        <el-col>
          <el-dropdown @command="operateDepts">
            <span :class="{head:isRoot}"> 操作<i class="el-icon-arrow-down" /> </span>
            <!-- 具名插槽 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item
                v-if="!isRoot"
                command="edit"
              >编辑子部门</el-dropdown-item>
              <el-dropdown-item
                v-if="!isRoot"
                command="del"
              >删除子部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col></el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  props: {
    // 定义传入的属性
    treeNode: {
      required: true, // 要求使用组件时必须传入treeNode对象
      type: Object
    },
    isRoot: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    operateDepts(command) {
      if (command === 'add') {
        // 添加子部门
        // 点击添加子部门时，触发add-dept弹层
        // 在当前点击的部门下添加子部门 this.treeNode就是当前要点击的部门 需要传入父级部门ID
        this.$emit('addDepts', this.treeNode)
      } else if (command === 'edit') {
        //  编辑子部门
        // 点击谁，编辑谁
        this.$emit('editDepts', this.treeNode)
      } else {
        //  删除部门
        // 提示用户是否删除
        this.$confirm('确定要删除该部门吗？')
          .then(() => {
            return delDepartments(this.treeNode.id)
          })
          .then(() => {
            // 接口删除后，后端数据发生了变化，需要更新前端页面数据index.vue
            // 利用自定义事件
            // 触发自定义事件，在父组件中监听自定义事件
            this.$emit('delDepts')
            this.$message.success('删除部门成功')
          })
      }
    }
  }
}
</script>

<style scoped>
.head{
  color: #000;
  font-weight: bold;
  font-size:20px;
}
</style>
