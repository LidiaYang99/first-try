document.addEventListener('DOMContentLoaded', async function () {

    const token = localStorage.getItem('user-token')

    // let { data: res } = await axios.get('/dashboard', {
    //     headers: {
    //         'Authorization': token
    //     }
    // })

    const { data: { data: res } } = await axios.get('/dashboard')
    console.log(res.salaryData);

    initYearChart(res.year)
    initSalaryChart(res.salaryData)
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
function initYearChart(year) {
    console.log(year);

    // 对year里的数据处理 (fon..in写法)
    let mes = []
    let salario = []
    for (let key in year) {
        mes.push(year[key].month)
        salario.push(year[key].salary)
    }

    // 对year里数据的处理(map写法)
    let a = year.map(item => item.month)
    console.log(a);

    // 记住这里前面要加echarts的init
    let myChart = echarts.init(document.querySelector('#line'))

    const option = {
        title: {
            text: '2022全学科薪资走势',
            textStyle: {
                color: '#499EEE',
                fontSize: 20,
            },
            top: 20,
            left: 'center',
        },

        xAxis: {
            type: 'category',
            // data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月'],
            data: mes,
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
            right: '5%',
            bottom: '13%'
        },

        color: [{
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 1,
            // 线条起始和结束时的颜色，自动渐变
            colorStops: [{
                offset: 0, color: '#499EEE'
            }, {
                offset: 1, color: '#5D76F0'
            }],
            global: false
        }],

        series: [
            {
                // data: [820, 932, 901, 934, 1290, 1330, 1320],
                data: salario,
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
                            // 内容区域颜色的渐变，从上到下
                            offset: 0, color: 'rgba(176,213,247,0.8)'
                        }, {
                            offset: 0.8, color: 'rgba(255,255,255,0.1)'
                        }, {
                            offset: 1, color: 'rgba(255,255,255,0)'
                        }],
                        global: false
                    }
                }
            }]
    }

    myChart.setOption(option)
}

// 渲染班级薪资分布图
function initSalaryChart(salary) {
    let myChart = echarts.init(document.querySelector('#salary'))

    let salaryData = salary.map(item => {
        //map遍历也可以返回一个数组对象
        return {
            value: `${item.g_count + item.b_count}`,
            name: item.label
        }
    })

    console.log(salaryData);

    const option = {
        // 标题
        title: {
            text: '班级薪资分布',
            textStyle: {
                color: 'black',
                fontSize: 16
            },
            top: 20,
            left: 20
        },

        // 提示框
        tooltip: {
            trigger: 'item'
        },

        // 图例
        legend: {
            bottom: '6%',
            left: 'center'
        },

        // 调色盘
        // 饼图的颜色是从12点方向开始的
        color: ['#FFA314', '#4096FF', '#20AAFF', '#34D39A'],

        //数据
        series: [
            {
                name: '班级薪资分布', //鼠标悬停标识名
                type: 'pie',
                center: ['50%', '45%'], //圆心坐标(x,y坐标)
                radius: ['65%', '50%'], // 内圆和外圆的半径
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 30,
                    borderColor: '#fff',
                    borderWidth: 3 //每段之间的距离
                },
                label: {
                    show: false, //文字说明默认不显示
                    position: 'center' //所有的文字中间显示
                },
                //控制文字显示的效果
                // emphasis: {
                //   label: {
                //     show: true,
                //     fontSize: '40',
                //     fontWeight: 'bold'
                //   }
                // },
                labelLine: {
                    show: false  //文字和item项的线
                },
                data: salaryData


            }
        ]
    }

    myChart.setOption(option)
}
