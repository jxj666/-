$('[data-click="log"]').click(function () {
	console.log('dd');
	$('.pop').removeClass('none')
					 .children('.log-pop').removeClass('none');
})

$('[data-click="return"]').click(function () {
	$('.pop').addClass('none');
	console.log('aa');
});



var city = {};
$(".select-menu select").change(function () {
    $(this).parent().prev("span").text($(this).find("option:selected").text());
});
// console.log(data);
data.district_list = data.province_list;
// console.log(data.district_list);

data.district_list.map(function (item) {
    city[item.code] = item.district_list;
});
// console.log(city);

$("#province").html("<option value='-1'>省</option>" + tmpl("template_area", data)).change(function () {
    $("#city").parent().prev("span").text("市");
    $("#district").prop("disabled", true).html("<option value='-1'>区</option>").parent().prev("span").text("区");
    if ($("#province").val() == -1) {
        $("#city").prop("disabled", true).html("<option value='-1'>市</option>");
    } else {
        $("#city").prop("disabled", false).html("<option value='-1'>市</option>" + tmpl("template_area", {district_list: city[$("#province").val()]})).change(
            function () {
                $("#district").parent().prev("span").text("区");
                if ($("#city").val() == -1) {
                    $("#district").prop("disabled", true).html("<option value='-1'>区</option>");
            } else {
                var country = {};
                city[$("#province").val()].map(function (item) {
                    country[item.code] = item.district_list;
                })
                $("#district").prop("disabled", false).html("<option value='-1'>区</option>" + tmpl("template_area", {district_list: country[$("#city").val()]}))
            }
        })
    }
})