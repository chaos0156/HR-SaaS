import request from '@/utils/request'

// 获取组织架构的数据
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

// 删除组织架构的部门
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete' // 接口满足restful接口规范===> 同样的地址  不同的方法 执行不同的业务
    // delete删除业务
    // get 获取业务
    // post 新增或添加业务
    // put 修改业务
  })
}

// 新增组织架构的部门
export function addDepartments(data) {
  return request({
    method: 'POST',
    url: '/company/department',
    data // post方法中的body参数
  })
}

// 根据ID查询部门详情
export function getDepartmentsById(id) {
  return request({
    url: `/company/department/${id}`
  })
}

// 根据ID修改部门详情
export function editDepartmentsById(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'PUT',
    data
  })
}
