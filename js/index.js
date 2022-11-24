document.addEventListener('DOMContentLoaded', function () {
    let token = localStorage.getItem('user-token')

    axios.get('/dashboard', {
        headers: {
            'Autorization': token
        }
    })
})