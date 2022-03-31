<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构的内容 -->
      <el-card class="tree-card">
        <TreeNode id="tree-head" :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <hr>
        <!-- 树形组件 -->
        <el-tree :data="departs" :props="prop" default-expand-all>
          <TreeNode
            slot-scope="{ data }"
            :tree-node="data"
            @delDepts="getDepartments"
            @addDepts="addDepts"
            @editDepts="editDepts"
          />
        </el-tree>
      </el-card>
    </div>
    <!-- 放置新增弹层组件 -->
    <AddDept
      ref="addDeptRef"
      :show-dia.sync="showDia"
      :tree-node="node"
      @addSubDepts="getDepartments"
    />
  </div>
</template>

<script>
import TreeNode from './components/tree-tools.vue'
import AddDept from './components/add-dept.vue'
import { getDepartments } from '@/api/departments'
import { transListToTreeData } from '@/utils/index'
export default {
  components: {
    TreeNode,
    AddDept
  },
  data() {
    return {
      departs: [],
      prop: {
        label: 'name' // 表示 从这个属性显示内容
      },
      company: {
        name: '',
        manager: ''
      },
      showDia: false,
      node: null // 记录当前点击的node节点
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const res = await getDepartments()
      this.company.name = '江苏新能源企业'
      this.company.manager = '负责人'
      // 在最根级的tree-tools组件中，没有id属性，在add-dept添加子部门的组件中，无法判断最外层的部门名是否有重复
      this.company.id = ''
      this.departs = transListToTreeData(res.depts, '')
      // console.log(this.departs)
    },
    // 监听tree-tools中触发的点击添加子部门的事件
    addDepts(node) {
      this.showDia = true
      this.node = node
    },
    // 监听tree-tools中触发的点击编辑子部门事件
    async editDepts(node) {
      this.showDia = true
      this.node = node
      // 父组件中调用子组件的方法
      this.$refs.addDeptRef.getDepartmentDetail(node.id)
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
#tree-head{
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
}
</style>
