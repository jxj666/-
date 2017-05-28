/*var theme = {
 color: [
 '#69b6e1','#c4b857', '#be7557', '#bb5257', '#6cc9b1', '#51b36b'
 ]}; shadowStyle:{
 color:'rgba(106,186,232,.1)'
 }*/

var theme = {
    color: [
        '#6abae8', '#ead867', '#be7557', '#bb5257', '#6cc9b1', '#51b36b', '#ca5656', '#69d2bf', '#48bd7e', '#9a69d2', '#d269a7', '#f78baa'
    ],
    tooltip: {
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            shadowStyle: {
                color: 'rgba(106,186,232,.1)'
            }
        }
    },

    categoryAxis: {
        axisTick: {
            show: false
        },
        axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
                color: '#888'
            }
        },
        splitLine: {           // 分隔线
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                color: ['#e1e1e1']
            }
        }
    },
    valueAxis: {
        axisTick: {
            show: false
        },
        axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
                color: '#888'
            }
        },
        splitLine: {           // 分隔线
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                color: ['#e1e1e1']
            }
        }
    },
};
