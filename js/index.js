document.addEventListener('DOMContentLoaded', async function () {

    const token = localStorage.getItem('user-token')

    // let { data: res } = await axios.get('/dashboard', {
    //     headers: {
    //         'Authorization': token
    //     }
    // })


    const res = await axios.get('/dashboard')
    console.log(res);
})