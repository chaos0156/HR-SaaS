<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="角色管理" name="third">
            <el-row style="height: 60px">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="small"
                @click="dialogVisible = true"
              >新增角色</el-button>
            </el-row>
            <el-table :data="rolesList" style="width: 100%" border stripe>
              <el-table-column
                align="center"
                type="index"
                label="序号"
                width="150"
              />
              <el-table-column prop="name" label="角色名" width="200" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作" width="300">
                <template slot-scope="slot">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="getRoleDetail(slot.row.id)"
                  >修改</el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteRole(slot.row.id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 放置分页组件 -->
            <el-row
              type="flex"
              justify="end"
              align="middle"
              style="height: 60px"
            >
              <el-pagination
                layout="total,prev, pager, next"
                :total="queryInfo.total"
                :page-size="queryInfo.pagesize"
                :current-page="queryInfo.page"
                @current-change="handleCurrentChange"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息" name="first">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              :closable="false"
              :show-icon="true"
            />
            <el-form
              ref="form"
              :model="firmdata"
              label-width="120px"
              style="margin-top: 50px"
            >
              <el-form-item label="企业名称">
                <el-input
                  v-model="firmdata.name"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="firmdata.companyAddress"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="公司电话">
                <el-input
                  v-model="firmdata.companyPhone"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="firmdata.mailbox"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="firmdata.remarks"
                  disabled
                  style="width: 400px"
                  type="textarea"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- 弹层 -->
      <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="30%"
        center
        @close="btnCancel"
      >
        <el-form
          ref="roleFormRef"
          :model="roleForm"
          label-width="80px"
          :rules="roleFormRules"
        >
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="btnCancel">取 消</el-button>
          <el-button type="primary" @click="btnOK">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getRolesList,
  getCompanyInfo,
  deleteRole,
  getRoleDetail,
  updateRole,
  addRole
} from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      dialogVisible: false,
      activeName: 'third',
      form: '',
      rolesList: [],
      queryInfo: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      firmdata: {
        // 公司信息
      },
      roleForm: {
        name: '',
        description: ''
      },
      roleFormRules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['companyId']),
    title() {
      return this.roleForm.id ? '编辑角色' : '新增角色'
    }
  },
  created() {
    this.getRoles()
    this.getCompanyInfo()
  },
  methods: {
    // 获取全部角色列表
    async getRoles() {
      const data = await getRolesList(this.queryInfo)
      this.queryInfo.total = data.total
      this.rolesList = data.rows
    },
    handleCurrentChange(val) {
      this.queryInfo.page = val
      this.getRoles()
    },
    async getCompanyInfo() {
      this.firmdata = await getCompanyInfo(this.companyId)
    },
    async deleteRole(id) {
      // #region
      /* this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteRole(id)
          // 改变前端数据
          this.getRoles()
          this.$message({
            type: 'success',
            message: '删除角色成功'
          })
        }).catch(() => {}) */
      // #endregion
      try {
        await deleteRole(id)
        this.getRoles()
        this.$message.success('删除成功')
      } catch (err) {
        console.log(err)
      }
    },
    async getRoleDetail(id) {
      this.dialogVisible = true
      this.roleForm = await getRoleDetail(id)
    },
    // 点击对话框的确定来编辑角色或新增角色
    async btnOK() {
      // #region
      /* this.$refs.roleFormRef.validate(async(val) => {
        if (!val) return this.$message.error('请填写正确数据')
        try {
          await updateRole(this.roleForm)
          this.dialogVisible = false
          this.getRoles()
          this.$message.success('成功更新角色信息')
        } catch (error) {
          console.log(error)
        }
      }) */
      // #endregion
      //  validate返回一个promise对象,当其成功才可以执行后续代码
      try {
        await this.$refs.roleFormRef.validate()
        // 通过this.roleForm有没有id属性来判断是编辑还是新增功能
        if (this.roleForm.id) {
          // 有id,编辑
          await updateRole(this.roleForm)
        } else {
          // 新增
          await addRole(this.roleForm)
        }
        this.dialogVisible = false
        this.getRoles()
        this.$message.success('操作成功')
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      // 重置数据
      this.roleForm = {
        name: '',
        description: ''
      }
      // 关闭弹出层
      this.dialogVisible = false // 关闭弹层会触发el-dialog的close事件
      // 移除校验
      this.$refs.roleFormRef.resetFields()
    }
  }
}
</script>

<style>
</style>
