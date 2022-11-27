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

// 根据overview数据，渲染预览数据

async function render() {
    let { data: { data: { overview } } } = await axios.get('/dashboard')

    for (let key in overview) {
        document.querySelector(`[name=${key}]`).innerHTML = overview[key]
    }
}
render()

// 渲染2022全学科薪资走势
function initYearChart() {
    // 记住这里前面要加echarts的init
    let myChart = echarts.init(document.querySelector('#line'))

    const option = {
        title: {
            text: '2022全学科薪资走势',
            textStyle: {
                color: 'blue',
                fontSize: 20,
            },
            top: 20,
            left: 'center',
        },

        xAxis: {
            type: 'category',
            data: ['一月', '二月', '三月', '四月', '五月', '六月'],
            axisLine: {
                show: true,
                lineStyle: {
                    color: 'gray',
                    type: 'dashed',
                }
            }
        },

        yAxis: {
            type: 'value',
            splitLine: {
                lineStyle: {
                    color: 'gray',
                    type: 'dashed'
                }
            }
        },

        tooltip: {
            trigger: 'axis'
        },

        grid: {
            top: '15%',
            left: '10%',
            bottom: '13%'
        },

        series: [
            {
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                symbol: 'emptyCircle', //标记图形
                symbolSize: 12, //标记图形的大小
                lineStyle: {
                    width: 4 //宽
                },
                smooth: true, //线是否有曲线，是否平滑过渡

                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: 'rgba(138,189,248,0.8)'
                        }, {
                            offset: 0.8, color: 'rgba(138,189,248,0.1)'
                        }, {
                            offset: 1, color: 'rgba(138,189,248,0)'
                        }],
                        global: false
                    }
                }
            }]
    }

    myChart.setOption(option)
}
initYearChart()
