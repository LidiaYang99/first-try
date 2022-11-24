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

// axios公共配置
axios.defaults.baseURL = 'http://ajax-api.itheima.net'

// axios请求拦截器(给每个请求装上token)
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  // 数据发送之前给设置请求体token
  const token = localStorage.getItem('user-token')
  if (token) {
    config.headers.Authorization = token
  }

  return config; //这里返回的是请求的配置项，删了就请求不出去了。
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});


// axios响应拦截器(同意处理错误响应)
// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  console.log(response.data); // 这里走的是成功的信息，如果是失败的信息，应该在下面
  // Do something with response data
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  console.dir(error)

  if (error.response.status === 401) {
    localStorage.removeItem('user-token')
    localStorage.removeItem('user-name')
    location.href = './login.html'
  }


  // Do something with response error
  return Promise.reject(error);
});