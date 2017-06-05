// 6月5号开始学习

var vm = new Vue({
            el: '#app',
            data: {
                title: '靳小健',
                productList: [],
                totalMoney: 0
            },
            filters: {},
            mounted: function() {
                this.cartView();
            },
            methods: {
                cartView: function() {

                    this.title += '的购物车';
                    this.$http.get('data/cartData.json', { 'id': 123 }).then(
                        res => {
                            this.productList = res.body.result.list;
                            this.totalMoney = res.body.result.totalMoney;
                        }
                        )

                    }
                }
            })
