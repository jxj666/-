// 6月5号开始学习

var vm = new Vue({
    el: '#app',
    data: {
        title: '靳小健',
        productList: [],
        totalMoney: 0,
        checkAllNum: false
    },
    filters: {
        formatMoney: function(val) {
            return '￥' + val;
        }
    },
    mounted: function() {
        this.cartView();
    },
    methods: {
        cartView: function() {

            this.title += '的购物车';
            this.$http.get('data/cartData.json', { 'id': 123 }).then(
                res => {
                    this.productList = res.body.result.list;
                    
                }
            )

        },
        changeMoney: function(obj, val) {
            if (val > 0) {
                obj.productQuantity++;
            } else {
                obj.productQuantity > 1 ? obj.productQuantity-- : console.log('不可减少了');
            }
            this.toutalNum();

        },
        selectedProduct: function(obj) {
            if (typeof obj.checked == 'undefined') {
                Vue.set(obj, 'checked', true)
                    // this.$set(obj,'checked',true)
            } else {
                obj.checked = !obj.checked;
            }
            this.toutalNum();
        },
        checkAll: function(bol) {
            this.checkAllNum = bol;
            var _this = this;
            this.productList.forEach(function(obj, index) {
                if (typeof obj.checked == 'undefined') {
                    Vue.set(obj, 'checked', _this.checkAllNum)
                } else {
                    obj.checked = _this.checkAllNum;
                }
            })
            this.toutalNum();

        },
        toutalNum:function(){
          var _this=this;
          _this.totalMoney=0;
          this.productList.forEach(function(obj, index) {
            if(obj.checked){
              _this.totalMoney +=obj.productPrice*obj.productQuantity;
            }
          })
        }
    }
});
Vue.filter('money', function(val, type) {
    return '共' + val + type;
})
