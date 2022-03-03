// 负责管理所有的自定义指令

export const imageerror = {
  // 钩子函数，会在绑定的DOM元素添加到DOM树之后执行。
  inserted: function(element, binding) {
    // element是指令绑定的元素，可以直接用来操作DOM
    // binding是一个对象，里面包含一些使用指令时的属性，value表示给指令绑定的值。

    // 图片加载地址找不到时，会触发error事件
    // DOM可以绑定error事件，当图片加载出现异常时，将指令配置的默认图片设置为该图片的内容
    element.onerror = function() {
      // element就是img标签，可以设置src属性
      element.src = binding.value
    }
  }
}
