// 上面这个代码处理过度动画（默认加上不用管）
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.body.classList.add('sidenav-pinned')
    document.body.classList.add('ready')
  }, 200)
})

// 轻提示封装包
const toastBox = document.querySelector('#myToast')
const toast = new bootstrap.Toast(toastBox, {
  animation: true,
  autohide: true,
  delay: 10000
})

function tip(msg) {
  toastBox.querySelector('.toast-body').innerHTML = msg
}

toast.show()