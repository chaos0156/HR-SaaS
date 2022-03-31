<template>
  <!-- 放置弹层组件 -->
  <el-dialog :title="title" :visible="showDia" width="30%" @close="btnCancel">
    <!-- 表单数据 -->
    <!-- label-width设置所有标题的宽度 -->
    <el-form
      ref="addFormRef"
      label-width="120px"
      :model="addForm"
      :rules="addFormRules"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="addForm.name"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="addForm.code"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="addForm.manager"
          style="width: 80%"
          placeholder="请选择"
          @focus="getEmploySimple"
        >
          <!-- 遍历选项 -->
          <el-option
            v-for="i in employeesSimple"
            :key="i.id"
            :label="i.username"
            :value="i.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="addForm.introduce"
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <!-- 确定和取消按钮 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取 消</el-button>
        <el-button type="primary" size="small" @click="btnOk">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  getDepartments,
  addDepartments,
  getDepartmentsById,
  editDepartmentsById
} from '@/api/departments'
import { getEmployeesList } from '@/api/employee'
export default {
  props: {
    showDia: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    //   同级部门中禁止出现重复部门
    const checkNameRepeat = async(rule, value, callback) => {
      //   value是部门名称 要去和同级部门去比较 如果有相同名称的部门，则不能通过
      // 获取部门最新数据
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.addForm.id) {
        // 编辑部门
        // 编辑的数据在数据库中是已经存在的。要保证，同级部门下，修改的部门名不能和其他部门的名字重复
        // 首先要找到同级部门 this.addForm.id是当前的id,pid是this.addForm.pid  this.addForm.id === this.treeNode.id
        // 找同级部门下,除了点击的部门之外的所以同级部门
        // 要排除自身
        isRepeat = depts
          .filter(
            (i) => i.pid === this.treeNode.pid && i.id !== this.treeNode.id
          )
          .some((item) => item.name === value)
      } else {
        //   找同级部门下有没有和value相同的部门
        //   找同级部门的所有子部门
        // 新增部门
        isRepeat = depts
          .filter((i) => i.pid === this.treeNode.id)
          .some((item) => item.name === value)
      }
      if (isRepeat) {
        callback(new Error(`同级部门下已经存在${value}部门了`))
      } else {
        callback()
      }
    }
    // 部门编码在整个模块中都不允许重复
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.addForm.id) {
        // 编辑部门
        // 不能与其他部门有相同的code
        isRepeat = depts.filter(i => i.code !== this.treeNode.code).some((i) => i.code === value && value)
      } else {
        // 新增部门
        //  防止没有code，value值不为空
        // 子部门中不能有相同的code
        isRepeat = depts.some((i) => i.code === value && value)
      }
      isRepeat
        ? callback(new Error(`组织架构下已经存在${value}编码了`))
        : callback()
    }
    return {
      // 响应式数据
      addForm: {
        name: '',
        introduce: '',
        manager: '',
        code: ''
      },
      //   校验规则对象 {{key:数组}}
      addFormRules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门名称要求1-50个字符',
            trigger: 'blur'
          },
          { trigger: 'blur', validator: checkNameRepeat }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门编码要求1-50个字符',
            trigger: 'blur'
          },
          {
            trigger: 'blur',
            validator: checkCodeRepeat
          }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'change' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 300,
            message: '部门介绍要求1-300个字符',
            trigger: 'blur'
          }
        ]
      },
      employeesSimple: []
    }
  },
  computed: {
    title() {
      return this.addForm.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    async getEmploySimple() {
      this.employeesSimple = await getEmployeesList()
    },
    btnOk() {
      // 手动校验表单
      this.$refs.addFormRef.validate(async(val) => {
        if (!val) return this.$message.error('请填写正确的数据')
        // 根据addForm中是否包含id来判断点击了哪个场景
        if (this.addForm.id) {
          // 编辑
          await editDepartmentsById(this.addForm)
        } else {
          // 新增
          // 将新增的子部门提交给接口
          await addDepartments({ ...this.addForm, pid: this.treeNode.id })
        }
        // 在后端数据更改后，告诉父组件更新前端页面
        // 触发一个自定义事件
        this.$emit('addSubDepts')
        // 点击确定之后应该告诉父组件，关闭新增弹层
        // 利用sync修饰符
        this.$emit('update:showDia', false)
        // 关闭dialog时，会触发el-dialog的close事件
      })
    },
    btnCancel() {
      // 点击取消删除id属性
      this.addForm = {
        name: '',
        introduce: '',
        manager: '',
        code: ''
      }
      // 关闭弹层
      this.$emit('update:showDia', false)
      // 重置表单 但是只能重置定义在表单addForm中的数据
      this.$refs.addFormRef.resetFields()
    },
    // 根据ID来获取部门信息
    async getDepartmentDetail(id) {
      // 获取部门信息的接口不可以直接传入this.treeNode.id
      // 因为要在父组件index.vue中调用子组件的方法
      // 先设置了node数据，再直接调用子组件的方法，但因为props是异步的
      // 有一定的概率是无法读取到treeNode数据
      this.addForm = await getDepartmentsById(id)
      // 应该由父组件将id传递给子组件
    }
  }
}
</script>

<style>
</style>
