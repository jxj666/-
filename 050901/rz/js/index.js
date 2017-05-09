$(document).ready(function() {
  
  var verifyItem = $('.verify-data-item');

  verifyItem.on('hover', function() {
    var index = $(this).index();
    $(this).addClass('verify-data-select').siblings().removeClass('verify-data-select');
    
    var imgArr = ['v_notice','v_method','v_standard','v_index'];
    
    for(var i = 0 ; i < imgArr.length ; i++) {
      var url = '';
      if(index === i) {

        url = 'url(img/' + imgArr[i] + '.png)';

      } else {
        url = 'url(img/' + imgArr[i] + '_gray.png)'
      }

      verifyItem.eq(i).css('background-image', url);
    }
  });

  verifyItem.on('click', function() {
    window.location.href = 'detail.html';
  });

  //default beijing
  var beijing = {'cityName': '北京', 'total': '22334', 'qiye': '234', 'shiye': '168', 'yuanqu' : '102'}
  showCityData(beijing);
});
  
// echarts相关
require.config({
  paths: {
    echarts: 'http://echarts.baidu.com/build/dist'
  }
});

require(
  [
    'echarts',
    'echarts/chart/map'
  ],

  function(ec) {
    var myChart = ec.init(document.getElementById('map'));
    var option = {
      series: [
      {
        name: '中国',
        type: 'map',
        mapType: 'china',
        selectedMode : 'single',

        itemStyle:{
          normal: {
            areaStyle: {
              color: '#ebf0f4'
            },
            label: {
              show:true,
              textStyle: { color: '#231816' }
            },
            borderColor:"#FCFCFC",
            borderWidth:"2",
          },
          
          emphasis: {
            areaStyle: {
              color: '#00a1cb'  //鼠标hover上的地区背景颜色
            },
            label: {
              show:true,
              textStyle: { color: '#231816' }
            }
          }
        },
        data:[
          {name: '北京', selected: true}
        ]
      }]
    };

    myChart.setOption(option);

    //点击省份
    myChart.on('click', function (params) {
      cityData(params.name);
    });
  }
);

//根据城市显示数据
function showCityData(obj) {
  $('.area-title').text(obj.cityName + '地区');
  $('.total').text(obj.total);
  $('.qiye').text(obj.qiye);
  $('.shiye').text(obj.shiye);
  $('.yuanqu').text(obj.yuanqu);
}


// 判断城市
function cityData(cityName) {

  //{'cityName': '', 'total': '', 'qiye': '', 'shiye': '', 'yuanqu' : ''}
  var data = {};  

  switch(cityName) {
    case '北京': data = {'cityName': cityName, 'total': '22334', 'qiye': '234', 'shiye': '168', 'yuanqu' : '102'}; break;
    case '天津': data = {'cityName': cityName, 'total': '189', 'qiye': '234', 'shiye': '118', 'yuanqu' : '2'}; break;
    case '上海': data = {'cityName': cityName, 'total': '3680', 'qiye': '809', 'shiye': '26', 'yuanqu' : '12'}; break;
    case '重庆': data = {'cityName': cityName, 'total': '1978', 'qiye': '937', 'shiye': '132', 'yuanqu' : '142'}; break;
    case '河北': data = {'cityName': cityName, 'total': '1234', 'qiye': '245', 'shiye': '1324', 'yuanqu' : '32'}; break;
    case '河南': data = {'cityName': cityName, 'total': '280', 'qiye': '93', 'shiye': '468', 'yuanqu' : '92'}; break;
    case '辽宁': data = {'cityName': cityName, 'total': '637', 'qiye': '234', 'shiye': '138', 'yuanqu' : '22'}; break;
    case '云南': data = {'cityName': cityName, 'total': '1690', 'qiye': '160', 'shiye': '168', 'yuanqu' : '62'}; break;
    case '黑龙江': data = {'cityName': cityName, 'total': '380', 'qiye': '120', 'shiye': '108', 'yuanqu' : '123'}; break;
    case '湖南': data = {'cityName': cityName, 'total': '310', 'qiye': '126', 'shiye': '224', 'yuanqu' : '56'}; break;
    case '安徽': data = {'cityName': cityName, 'total': '334', 'qiye': '260', 'shiye': '382', 'yuanqu' : '90'}; break;
    case '山东': data = {'cityName': cityName, 'total': '23', 'qiye': '138', 'shiye': '850', 'yuanqu' : '135'}; break;
    case '新疆': data = {'cityName': cityName, 'total': '937', 'qiye': '479', 'shiye': '168', 'yuanqu' : '68'}; break;
    case '江苏': data = {'cityName': cityName, 'total': '7204', 'qiye': '502', 'shiye': '16', 'yuanqu' : '90'}; break;
    case '浙江': data = {'cityName': cityName, 'total': '23', 'qiye': '144', 'shiye': '148', 'yuanqu' : '23'}; break;
    case '江西': data = {'cityName': cityName, 'total': '334', 'qiye': '216', 'shiye': '134', 'yuanqu' : '86'}; break;
    case '湖北': data = {'cityName': cityName, 'total': '785', 'qiye': '42', 'shiye': '148', 'yuanqu' : '23'}; break;
    case '广西': data = {'cityName': cityName, 'total': '53', 'qiye': '480', 'shiye': '138', 'yuanqu' : '78'}; break;
    case '甘肃': data = {'cityName': cityName, 'total': '676', 'qiye': '734', 'shiye': '184', 'yuanqu' : '132'}; break;
    case '山西': data = {'cityName': cityName, 'total': '127', 'qiye': '1260', 'shiye': '129', 'yuanqu' : '46'}; break;
    case '内蒙古': data = {'cityName': cityName, 'total': '208', 'qiye': '1260', 'shiye': '168', 'yuanqu' : '92'}; break;
    case '陕西': data = {'cityName': cityName, 'total': '356', 'qiye': '42', 'shiye': '4', 'yuanqu' : '34'}; break;
    case '吉林': data = {'cityName': cityName, 'total': '724', 'qiye': '1260', 'shiye': '183', 'yuanqu' : '732'}; break;
    case '福建': data = {'cityName': cityName, 'total': '635', 'qiye': '473', 'shiye': '168', 'yuanqu' : '54'}; break;
    case '贵州': data = {'cityName': cityName, 'total': '134', 'qiye': '249', 'shiye': '138', 'yuanqu' : '53'}; break;
    case '广东': data = {'cityName': cityName, 'total': '765', 'qiye': '1260', 'shiye': '368', 'yuanqu' : '24'}; break;
    case '青海': data = {'cityName': cityName, 'total': '7765', 'qiye': '1260', 'shiye': '138', 'yuanqu' : '50'}; break;
    case '西藏': data = {'cityName': cityName, 'total': '12', 'qiye': '344', 'shiye': '137', 'yuanqu' : '25'}; break;
    case '四川': data = {'cityName': cityName, 'total': '432', 'qiye': '678', 'shiye': '432', 'yuanqu' : '48'}; break;
    case '宁夏': data = {'cityName': cityName, 'total': '756', 'qiye': '169', 'shiye': '68', 'yuanqu' : '45'}; break;
    case '海南': data = {'cityName': cityName, 'total': '304', 'qiye': '1260', 'shiye': '138', 'yuanqu' : '78'}; break;
    case '台湾': data = {'cityName': cityName, 'total': '980', 'qiye': '1260', 'shiye': '368', 'yuanqu' : '134'}; break;
    case '香港': data = {'cityName': cityName, 'total': '12', 'qiye': '1260', 'shiye': '136', 'yuanqu' : '89'}; break;
    case '澳门': data = {'cityName': cityName, 'total': '22', 'qiye': '1260', 'shiye': '168', 'yuanqu' : '12'}; break;
  }

  showCityData(data);
}

