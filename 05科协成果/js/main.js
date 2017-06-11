$(document).ready(function() {
    var $LN = $('#look_need')
    var $TATS = $(".tech_achieve_talents_show")
    var $TATH = $('.tech_achieve_talents_hide')
    $LN.on('click', function() {
        console.log('1')
        $TATS.slideDown('fast');
        $TATH.hide();
    })
})
