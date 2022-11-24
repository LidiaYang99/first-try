// 上面这个代码处理过度动画（默认加上不用管）
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.body.classList.add('sidenav-pinned')
    document.body.classList.add('ready')
  }, 200)
})


const toastBox = document.querySelector('#myToast')
const toast = new bootstrap.Toast(toastBox, {
  animation: true,
  autohide: true,
  delay: 3000
})

const tip = (msg) => {
  toastBox.querySelector('.toast-body').innerHTML = msg
  toast.show()
}

let username = document.querySelector('.navbar .font-weight-bold')
let logout = document.querySelector('#logout')

// 因为这里是公共的js，登录页也会用到这些，所以如果不对是否有username进行判断，会在登录页报错
if (username) {
  username.innerHTML = localStorage.getItem('user-name')
}

if (logout) {
  logout.addEventListener('click', () => {
    localStorage.removeItem('user-token')
    localStorage.removeItem('user-name')
    location.href = './login.html'
  })
}