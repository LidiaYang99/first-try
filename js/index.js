document.addEventListener('DOMContentLoaded', async function () {

    const token = localStorage.getItem('user-token')

    // let { data: res } = await axios.get('/dashboard', {
    //     headers: {
    //         'Authorization': token
    //     }
    // })

    const { data: { data: res } } = await axios.get('/dashboard')
    console.log(res.provinceData);

    initYearChart(res.year)
    initSalaryChart(res.salaryData)
    initGroupData(res.groupData)
    initSalaryGender(res.salaryData)
    initMapChart(res.provinceData)
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

// 渲染期望/实际薪资
function initGroupData(hope) {

    let myChart = echarts.init(document.querySelector('#lines'))

    // 老方法，遍历
    /* let btn = document.querySelectorAll('#btns .btn')
    for (let i = 0; i < btn.length; i++) {
        btn[i].addEventListener('click', function () {
            btn[i].className = ''
            this.className = 'btn-blue'
        })
    } */

    // 新方法，事件委托
    let btn = document.querySelector('#btns')
    btn.addEventListener('click', function (e) {
        if (e.target.tagName === 'BUTTON') {
            btn.querySelector('.btn-blue').classList.remove('btn-blue')
            e.target.classList.add('btn-blue')


            let num = e.target.innerText

            option.xAxis.data = hope[num].map(item => item.name)
            option.series[0].data = hope[num].map(item => item.hope_salary)
            option.series[1].data = hope[num].map(item => item.salary)

            myChart.setOption(option)

            // 如果想实现数据图实时更新，可以设置每多长时间，重新获取数据并渲染即可。
        }

    })


    const option = {

        tooltip: {},

        grid: {
            left: '5%',
            right: '3%',
            bottom: 30,
            top: 30
        },

        xAxis: {
            type: 'category',

            data: hope[1].map(item => item.name),
            axisLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                    color: '#ccc'
                }
            }
        },

        yAxis: {
            type: 'value',
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                    color: '#ccc'
                }
            }
        },

        color: [
            {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 1,
                // 线条起始和结束时的颜色，自动渐变
                colorStops: [{
                    // 内容区域颜色的渐变，从上到下
                    offset: 0, color: '#43D6A1'
                }, {
                    offset: 0.8, color: 'rgba(100,221,178,0.5)'
                }, {
                    offset: 1, color: 'rgba(196,242,226,0.4)'
                }],

                global: false
            },
            {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 1,
                // 线条起始和结束时的颜色，自动渐变
                colorStops: [{
                    // 内容区域颜色的渐变，从上到下
                    offset: 0, color: '#54A5EF'
                }, {
                    offset: 0.8, color: 'rgba(131,190,243,0.5)'
                }, {
                    offset: 1, color: 'rgba(198,224,249,0.5)'
                }],

                global: false
            }
        ],

        series: [
            {
                name: '期望薪资',
                data: hope[1].map(item => item.hope_salary),
                type: 'bar',
            },
            {
                name: '实际薪资',
                data: hope[1].map(item => item.salary),
                type: 'bar'
            },


        ]
    };


    myChart.setOption(option)
}

// 渲染男女薪资分布
function initSalaryGender(gender) {
    let myChart = echarts.init(document.querySelector('#gender'))

    // return的写法
    let boySalary = gender.map(item => {
        return {
            name: item.label,
            value: item.b_count
        }
    })

    // 使用小括号，将其变成对象，来省掉return
    let girlSalary = gender.map(item => ({
        name: item.label,
        value: item.g_count
    }))

    const option = {
        title: [{
            text: '男女薪资分布',
            left: '2%',
            top: '2%'
        },
        {
            text: '男生',
            left: '45%',
            top: '45%',
            textStyle: {
                fontSize: 12
            }
        },
        {
            text: '女生',
            left: '45%',
            top: '90%',
            textStyle: {
                fontSize: 12
            }
        }],

        tooltip: {
            trigger: 'item'
        },

        color: ['#FFA314', '#4096FF', '#20AAFF', '#34D39A'],


        series: [
            // 上面的
            {
                name: '男生',
                type: 'pie',
                radius: ['22%', '32%'],
                center: ['50%', '30%'],
                data: boySalary,

                // 高亮作用
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            },

            // 下面的
            {
                name: '女生',
                type: 'pie',
                radius: ['22%', '32%'],
                center: ['50%', '75%'],
                data: girlSalary,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }


    myChart.setOption(option)
}

// 地图渲染
const initMapChart = (provinceData) => {
    const myEchart = echarts.init(document.querySelector('#map'))


    const dataList = [
        { name: '南海诸岛', value: 0 },
        { name: '北京', value: 0 },
        { name: '天津', value: 0 },
        { name: '上海', value: 0 },
        { name: '重庆', value: 0 },
        { name: '河北', value: 0 },
        { name: '河南', value: 0 },
        { name: '云南', value: 0 },
        { name: '辽宁', value: 0 },
        { name: '黑龙江', value: 0 },
        { name: '湖南', value: 0 },
        { name: '安徽', value: 0 },
        { name: '山东', value: 0 },
        { name: '新疆', value: 0 },
        { name: '江苏', value: 0 },
        { name: '浙江', value: 0 },
        { name: '江西', value: 0 },
        { name: '湖北', value: 0 },
        { name: '广西', value: 0 },
        { name: '甘肃', value: 0 },
        { name: '山西', value: 0 },
        { name: '内蒙古', value: 0 },
        { name: '陕西', value: 0 },
        { name: '吉林', value: 0 },
        { name: '福建', value: 0 },
        { name: '贵州', value: 0 },
        { name: '广东', value: 0 },
        { name: '青海', value: 0 },
        { name: '西藏', value: 0 },
        { name: '四川', value: 0 },
        { name: '宁夏', value: 0 },
        { name: '海南', value: 0 },
        { name: '台湾', value: 0 },
        { name: '香港', value: 0 },
        { name: '澳门', value: 0 },
    ]

    //遍历数据
    dataList.forEach(item => {
        const obj = provinceData.find(v => {
            // 所有带有这些的都替换成''
            const regExp = /省|回族自治区|吾尔自治区|壮族自治区|特别行政区|自治区/g
            //数据中的name项在替换后，如果和服务器中的数据的name项匹配
            return v.name.replace(regExp, '') === item.name
        })

        if (obj) {
            item.value = obj.value
        }
    })

    let option = {
        title: {
            text: '籍贯分布',
            top: '2%',
            left: '2%',
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} 位学员',
            borderColor: 'transparent',
            backgroundColor: 'rgba(0,0,0,0.5)',
            textStyle: {
                color: '#fff',
            },
        },
        visualMap: {
            min: 0,
            max: 6,
            left: 'left',
            bottom: '20',
            text: ['6', '0'],
            inRange: {
                color: ['#ffffff', '#0075F0'],
            },
            show: true,
            left: 40,
        },
        geo: {
            map: 'china',
            roam: false,
            zoom: 1.0,
            label: {
                normal: {
                    show: true,
                    fontSize: '10',
                    color: 'rgba(0,0,0,0.7)',
                },
            },
            itemStyle: {
                normal: {
                    borderColor: 'rgba(0, 0, 0, 0.2)',
                    color: '#e0ffff',
                },
                emphasis: {
                    areaColor: '#34D39A',
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowBlur: 20,
                    borderWidth: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
            },
        },
        series: [
            {
                name: '籍贯分布',
                type: 'map',
                geoIndex: 0,
                data: dataList,
            },
        ],
    }
    myEchart.setOption(option)
}

