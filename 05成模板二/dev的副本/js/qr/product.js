$(function () {

    var $keyword = $('#keyword');
    var packageTypeConfig = ['盒', '条', '瓶'];
    var typeConfig = {
        t1: '烟',
        t2: '茶',
        t3: '红酒',
        t4: '白酒'
    };

    function getList(page, keyword, orderBy, size) {
        $('.table-loader.hide').removeClass('hide');
        $.ajax({
            url: '/qr_product/list',
            type: 'GET',
            data: {
                page: page,
                size: size ? size : 10,
                order_by: orderBy ? orderBy : '',
                keyword: keyword ? keyword : ''
            },
            success: function (data) {
                if (data.code === 1) {
                    data.context.packageTypeConfig = packageTypeConfig;
                    data.context.typeConfig = typeConfig;
                    $('tbody').html(tmpl('template_list', data.context));
                    data.context.page = page;
                    $('[data-info=page]').text(page);
                    $('.pagination1').html(tmpl('template_page', data.context));
                    $('[data-info="totalPage"]').html(data.context.totalPage);
                    $('[data-page="' + page + '"]').parent().addClass('active');
                    // 翻页
                    if (page > 1) {
                        $('#data-table_previous').removeClass('disabled')
                            .find('a').attr('data-page', page - 1);
                    }
                    if (data.context.totalPage > 1 && page < data.context.totalPage) {
                        $('#data-table_next').removeClass('disabled')
                            .find('a').attr('data-page', page - 0 + 1);
                    }
                    $('[data-tz="page"]').on('click', function () {
                        if (!$(this).parent().hasClass('active') && !$(this).parent().hasClass('disabled')) {
                            var i = $(this).data('page');
                            var orderBy = $('[data-sort].active').data('sort');
                            var datatableLength = $('#data-table_length select').val();
                            getList(i, $.trim($keyword.val()), orderBy, datatableLength);
                        }
                    });
                } else {
                    alert(data.msg);
                }
                $('.table-loader').addClass('hide');
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('服务器返回错误!错误代码：' + XMLHttpRequest.status + ' ' + textStatus);
            }
        });
    }

    // 一进页面加载列表
    getList(1);
    // 点击排序加载列表
    $('[data-sort]').click(function () {
        if (!$(this).hasClass('active')) {
            var datatableLength = $('#data-table_length select').val();
            getList(1, $.trim($keyword.val()), $(this).data('sort'), datatableLength);
            $('[data-sort].active').removeClass('active');
            $(this).addClass('active');
        }
    });
    // 选择n项结果加载列表
    $('#data-table_length select').change(function () {
        var orderBy = $('[data-sort].active').data('sort');
        var datatableLength = $('#data-table_length select').val();
        getList(1, $.trim($keyword.val()), orderBy, datatableLength);
    });
    // 关键字搜索加载列表
    $('[data-tz="search"]').click(function () {
        var orderBy = $('[data-sort].active').data('sort');
        var datatableLength = $('#data-table_length select').val();
        getList(1, $.trim($keyword.val()), orderBy, datatableLength);
        $('[data-dismiss="modal"]').trigger('click');

    });
    $('#keyword').on('keyup', function (e) {
        if (e.keyCode === 13) {
            $('[data-tz="search"]').trigger('click');
        }
        if ($(this).val().length > 0) {
            $(this).next('.search-clear-btn').removeClass('hide');
        }
        else {
            $(this).next('.search-clear-btn').addClass('hide')
        }
    });
    $('.search-clear-btn').click(function () {
        $(this).addClass('hide').prev('[type=search]').val('');
        $('[data-tz="search"]').trigger('click');
    });
    // 上传图片
    $('[data-tz="imgUpload"]').on('change', function () {
        var $this = $(this);
        var formData = new FormData();
        formData.append('file', this.files[0]);
        var channel = $this.data('channel');
        formData.append('channel', channel);
        $.ajax({
            url: '/op/storage/upload',
            type: 'POST',
            cache: false,
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json'
        }).done(function (res) {
            var code = res.code;
            if (code === 1) {
                console.log('上传成功,图片地址为:' + res.context.url);
                var url = res.context.url;
                if (url) {
                    $this.parent().next('[type="url"]').val(url);
                    $this.prev().remove();
                    $('<div class="pic"><img src=' + url + '></div>').insertBefore($this);
                }
            }
            else {
                alert(code + '\r\n' + res.message);
            }
        }).fail(function (res) {
            alert('上传失败!请重试');
        });
    });
    $('[type="url"]').change(function () {
        var $target = $(this).parent().find('.pic img');
        if ($target.length > 0) {
            $target.attr('src', $(this).val());
        }
    });
    // 新建
    $('#form').parsley().on('form:submit', function () {
        var $name = $('#name');
        var $type = $('#type');
        var $price = $('#price');
        var $brandName = $('#brandName');
        // var $summary = $('#summary');
        // var $detail = $('#detail');
        var $memo = $('#memo');
        var $simage = $('#simage');
        var params = {};
        params.name = $.trim($name.val());
        params.type = $type.val();
        params.price = $.trim($price.val());
        params.brandName = $.trim($brandName.val());
        // params.summary = $.trim($summary.val()); // 摘要
        // params.detail = $.trim($detail.val()); // 图文信息
        params.memo = $.trim($memo.val());
        params.simage = $.trim($simage.val());

        $.ajax({
            url: '/qr_product/add',
            type: 'post',
            data: params,
            success: function (data) {
                if (data.code === 1) {
                    var orderBy = $('[data-sort].active').data('sort');
                    var datatableLength = $('#data-table_length select').val();
                    getList(1, $.trim($keyword.val()), orderBy, datatableLength);
                    $('#form').parsley().reset();
                    $('#form')[0].reset();
                    $('[data-dismiss="modal"]').trigger('click');
                }
                else {
                    alert(data.msg);
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('服务器返回错误!错误代码：' + XMLHttpRequest.status + ' ' + textStatus);
            }
        });
        return false;
    });
    // 删除
    $('tbody').on('click', '[data-tz="hide"]', function () {
        if (!window.confirm('确定隐藏？')) {
            return;
        }
        $.ajax({
            url: '/qr_product/hide',
            type: 'post',
            data: {sn: $(this).data('sn')},
            success: function (data) {
                if (data.code === 1) {
                    var page = $('.pagination li.active a').data('page');
                    var orderBy = $('[data-sort].active').data('sort');
                    var datatableLength = $('#data-table_length select').val();
                    getList(page, $.trim($keyword.val()), orderBy, datatableLength);
                }
                else {
                    alert(data.msg);
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('服务器返回错误!错误代码：' + XMLHttpRequest.status + ' ' + textStatus);
            }
        });
    });
    // 修改
    $('tbody').on('click', '[data-tz="update"]', function () {

        // 动态添加“添加类型”dom
        if ($('#typeSelect').find('.add').length === 0) {
            // 如果没有创建新增的dom，则添加
            $('#typeSelect .bs-searchbox').append('<div class="add" id="addType">添加类型<i>+</i></div>')
        }

        // 动态添加“添加品牌”dom
        if ($('#brandSelect').find('.add').length === 0) {
            // 如果没有创建新增的dom，则添加
            $('#brandSelect .bs-searchbox').append('<div class="add" id="addBrand">添加品牌<i>+</i></div>')
        }

        // 类型-多级选择
        $('#typeSelect').on('mouseenter', '.dropdown-menu>li' , function(e){
            stopBubble(e);
            stopDefault(e);

            var index = $(this).index();
            var parentId = $(this).parents('.bootstrap-select').find('select').children().eq(index).val();

            var selector = $(this);
            var num = selector.data('original-index');
            selector = '[data-original-index = "' + num + '"]';
            if ( $(selector).find('.sub-ul').length === 0 ) {
                if ( parentId ) {
                    // categoryList(parentId, selector);
                }
            } else {
                return
            }
        })
        // 点击添加品牌
        $('.bs-searchbox').on('click', '#addBrand', function(e){
            $('#pop_addBrand').css('display', 'block');
            window.setTimeout(function(){
                $('#pop_addBrand').addClass('self-show');
            }, 20);
            stopDefault(e);
            stopBubble(e);
            return false
        })
    
        // 点击添加类型
        $('.bs-searchbox').on('click', '#addType', function(e){
            $('#pop_addType').css('display', 'block');
            window.setTimeout(function(){
                $('#pop_addType').addClass('self-show');
            }, 20)
            stopDefault(e);
            stopBubble(e);
            return false
        })

        var $sn = $('#sn');
        var $name = $('#nameEdit');
        var $type = $('#typeEdit');
        var $price = $('#priceEdit');
        var $brandName = $('#brandNameEdit');
        // var $summary = $('#summaryEdit');
        // var $detail = $('#detailEdit');
        var $memo = $('#memoEdit');
        var $simage = $('#simageEdit');

        var $tr = $(this).parents('tr');
        $sn.val($tr.find('[data-info="sn"]').data('val'));
        $name.val($tr.find('[data-info="name"]').html());
        $type.val($tr.find('[data-info="type"]').data('val'));
        $price.val($tr.find('[data-info="price"]').html());
        $brandName.val($tr.find('[data-info="brandName"]').html());
        // $summary.val($tr.find('[data-info="summary"]').html());
        // $detail.val($tr.find('[data-info="detail"]').html());
        $memo.val($tr.find('[data-info="memo"]').val());
        if ($tr.find('[data-simage]').data('simage')) {
            $simage.val($tr.find('[data-simage]').data('simage'))
                .parent().find('.pic img').attr('src', $tr.find('[data-simage]').data('simage'));
        }
        $('.selectpicker').selectpicker('refresh');
        // 提交修改
        $('#modal-update').on('hidden.bs.modal', function () {
            $(this).parsley().reset();
            $(this)[0].reset();
            $(this).find('.pic img').attr('src', '//saascore.oss-cn-beijing.aliyuncs.com/custom/img/common/upload.jpg');
        }).parsley().on('form:submit', function () {
            var params = {};
            params.sn = $sn.val();
            params.name = $.trim($name.val());
            params.type = $type.val();
            params.price = $.trim($price.val());
            params.brandName = $.trim($brandName.val());
            // params.summary = $.trim($summary.val());
            // params.detail = $.trim($detail.val());
            params.memo = $.trim($memo.val());
            params.simage = $.trim($simage.val());
            $.ajax({
                url: '/qr_product/update',
                type: 'post',
                data: params,
                success: function (data) {
                    if (data.code === 1) {
                        var page = $('.pagination li.active a').data('page');
                        var orderBy = $('[data-sort].active').data('sort');
                        var datatableLength = $('#data-table_length select').val();
                        getList(page, $.trim($keyword.val()), orderBy, datatableLength);
                        $('[data-dismiss="modal"]').trigger('click');
                    }
                    else {
                        alert(data.msg);
                    }

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert('服务器返回错误!错误代码：' + XMLHttpRequest.status + ' ' + textStatus);
                }
            });
            return false;
        });
    });

    // 添加类型
    $('#pop_addType').on('click', '[data-dismiss="modal"]', function(){
        clearForm('#pop_addType')
    }).parsley().on('form:submit', function(){
        var val = {};
        val.name = $('#typeNameAdd').val();
        val.short_name = $('#typeNameAdd').val();
        val.pinyin = $('#TpinYin').val();

        var compare_html = $('[data-id="typeEditInner"] span').html();
        val.parent = Number($('#typeEditInner option').filter(function(x){
            return this.innerHTML === compare_html
        }).val()) || null; //如果为0，则代表添加的是大类型

        // 添加的方法放在这里执行
        addCategory(val);
        return false
    })

    // 添加品牌
    $('#pop_addBrand').on('click', '[data-dismiss="modal"]', function(){
        clearForm('#pop_addBrand');
    }).parsley().on('form:submit', function(){
        var val = {};
        val.name = $('#brandNameAdd').val();
        val.short_name = $('#shorNameAdd').val();
        val.pinyin = $('#pinYin').val();
        val.image = $('#addBrandPic').val();
        $.ajax({
            url: '/product/brand/add',
            type: 'post',
            data: val,
            success: function (res) {
                var code = res.code;
                if (code === 1) {
                    alert('添加成功');
                    brandList();
                    $('#pop_addBrand').removeClass('self-show');
                    window.setTimeout(function(){
                        $('#pop_addBrand').css({'display': 'none'});
                        clearForm('#pop_addBrand');
                    }, 200)
                } else {
                    alert(res.msg + '\r\n' + code);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('服务器返回错误!错误代码：' + XMLHttpRequest.status + ' ' + textStatus);
            }
        });
        return false;
    })             

    // 品牌
    function brandList(page, size, selector, tmplSelector){
        $.ajax({
            url:'/product/brand/list',
            data:{
                "page": page ? page : 1,
                "size": size ? size : 10
            },
            method:'get',
            success: function(res) {
                var code = res.code;
                if ( code == 1 ) {
                    var totalPage = res.context.totalPage;
                    if (tmplSelector === 'brandListJS') {
                        $('.brandList-cur-page').html(page);
                        $('.brandList-total-page').html(totalPage);
                        var init = function() {
                            Pagination.Init(document.getElementById('Pagination2'), {
                                size: totalPage, // pages size 指总共页数
                                page: page,  // selected page
                                step: 3   // pages before and after current
                            });
                        };
                        init();
                    }
                    $(selector).html(tmpl(tmplSelector, res.context));
                    $('.selectpicker').selectpicker('refresh');
                } else {
                    alert(code + '\r\n' + res.message);
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert('服务器返回错误!错误代码：' + XMLHttpRequest.status + ' ' + textStatus);
            }
        })
    }

    // 1-1 修改下拉框展示品牌
    brandList('1', '10', '#brandNameEdit', 'brandNameList');

    // 1-2点击品牌列表
    $('#brandList-tab').on('click', function(){
        brandList('1', '10', '#brandList .col-sm-12', 'brandListJS');
    })

    // 1-3 
    $('#Pagination3').on('click', function(){

    })

    // 1-4 选择每页显示个数
    $('#brand-data-table_length select').change(function() {
        var datatableLength = $('#brand-data-table_length select').val();
        brandList('1', datatableLength, '#brandList .col-sm-12', 'brandListJS');
    })


    // 类型
    // 1. 展示父类型
    function showFatherCategory(page, size, selector, tmplSelector) {
        $.ajax({
            url: '/product/category/list',
            data:{
                "page": page ? page : 1,
                "size": size ? size : 10,
                "parent": null
            },
            method: 'get',
            success: function(res) { 
                var code = res.code;
                if (code === 1) {
                    TypetotalPage = res.context.totalPage;
                    if ( selector.length > 0 && tmplSelector.length > 0 ) {
                        if ( selector === '#typeEditInner' ) {
                            //  需要在添加类型的时候增加一个（无）
                            res.context.categoryList.unshift({'id': 0, 'name': '(无)'});
                        } 
                        if ( selector === '#firstTypeWrap') {
                            var TypetotalPage = res.context.totalPage;
                            $('#typeManage .cur-page').html(page);
                            $('#typeManage .total-page').html(TypetotalPage); 
                            var init = function() {
                                Pagination.Init(document.getElementById('Pagination3'), {
                                    size: TypetotalPage, // pages size 指总共页数
                                    page: page,  // selected page
                                    step: 3   // pages before and after current
                                });
                            };
                            init();
                        }
                        $(selector).html(tmpl(tmplSelector, res.context));
                        $('.typeName:first').addClass('blue').siblings().removeClass('blue');
                    }
                    $('.selectpicker').selectpicker('refresh');
                } else {
                    alert(res.msg + '\r\n' + code);
                    return
                }
            }
        })
    }

    // 1-1. 修改弹框的选择下拉框
    showFatherCategory(1, 10, '#typeEdit', 'categoryList');
    // 1-2. 添加类型的大类下拉框
    showFatherCategory(1, 10, '#typeEditInner', 'categoryListInner');
    // 1-3. 类型管理默认展示第一页10个大类
    showFatherCategory(1, 10, '#firstTypeWrap', 'firstType');
    
    // 2. 展示子类型
    function showChildCategory(id, selector, tmplSelector) {
        $.ajax({    
            url: '/product/category/list',
            data:{
                "page": 1,
                "size": 50,
                "parent": id
            },
            method: 'get',
            success: function(res) { 
                var code = res.code;
                if (code === 1) {
                    $(selector).html(tmpl(tmplSelector, res.context));
                } else {
                    alert(res.msg + '\r\n' + code);
                    return
                }
            }
        })
    }

    // 2-1. 点击类型管理，展示第一个大类的子类
    $('#typeManage-tab').on('click', function(){
        var parentId = $('#firstTypeWrap').find('.typeName:first').data('id');
        // 默认展示第一页10个大类型，以及第一个大类型的子类型
        showChildCategory(parentId, '#myTypeContent', 'sonTypeList');
    })

    // 2-2. 点击类型管理大类
    // 点击类型管理里面一级类
    $('#firstTypeWrap').on('click', function(e){
        var $target = $(e.target);
        if ($target.data('type') === 'type') {
            var id = $target.data('id');
            $target.addClass('blue').siblings().removeClass('blue');
            showChildCategory(id, '#myTypeContent', 'sonTypeList')
        }

    })


    // 点击类型管理页码
    $('#Pagination3').on('click', function(e){
        var $target = $(e.target);
        var $page = $(this).children();
        if (!$target.hasClass('current') && $target[0].tagName === 'A' ) {
            var currentPage = $(this).find('.current').html();
            if (currentPage==1) {
                // 如果是第一页，点击向前无反应
                if ($target == $page.first()) {
                    return
                }
            } 
            if (currentPage==$('#typeManage .total-page').html()) {
                 // 如果是最后一页，点击最后和向后无反应
                if ($target == $page.last()) {
                    return
                }
            } 
            $target.addClass('current');
            var index_page = $target.html();
            var size = $('#type-data-table_length select').val();
            showFatherCategory(index_page, size, '#firstTypeWrap', 'firstType')
            window.setTimeout(function(){
                var id = $('.typeName').first().data('id');
                showChildCategory(id, '#myTypeContent', 'sonTypeList')
            }, 100)              
        }
    })

    // 类型管理页面 选择每页展示个数
    $('#type-data-table_length select').change(function () {
        var datatableLength = $('#type-data-table_length select').val();
        console.log(datatableLength);
        showFatherCategory(1, datatableLength, '#firstTypeWrap', 'firstType');
        window.setTimeout(function(){
            var id = $('.typeName').first().data('id');
            showChildCategory(id, '#myTypeContent', 'sonTypeList')
        }, 100)
    });

    // 添加类型
    function addCategory(val){
        $.ajax({
            url: '/product/category/add',
            type: 'post',
            data: val,
            success: function(res) {
                var code = res.code;
                if (code === 1) {
                    alert('添加成功');
                    showFatherCategory(1, 10, '#typeEdit', 'categoryList');
                    $('#pop_addType').removeClass('self-show');
                    window.setTimeout(function(){
                        $('#pop_addType').css({'display': 'none'});
                        clearForm('#pop_addType')
                    }, 200)
                } else {
                    alert(res.msg + '\r\n' + code);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('服务器返回错误!错误代码：' + XMLHttpRequest.status + ' ' + textStatus);
            }
        })
    }

    // 清空新增所填内容
    function clearForm(selector) {
        $pop = $(selector);
        $pop.parsley().reset();
        $pop[0].reset();
        $pop.find('.pic img').attr('src', '//saascore.oss-cn-beijing.aliyuncs.com/custom/img/common/upload.jpg');
        $pop.removeClass('self-show');
        window.setTimeout(function(){
            $pop.css({'display': 'none'})
        }, 200)
    }
});
