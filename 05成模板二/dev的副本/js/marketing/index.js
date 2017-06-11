$(function () {
    $('#calendar').fullCalendar({
        header: {
            left: 'month,basicWeek,agendaDay,listMonth',
            center: 'title',
            right: 'prev,today,next'
        },
        /*views: {
         basicTwoWeek: {
         type: 'basic',
         duration: {weeks: 2},
         buttonText: '2周'
         }
         },*/
        defaultView: 'basicWeek',
        weekNumbers: true,
        navLinks: true, // can click day/week names to navigate views
        slotLabelFormat: 'HH:mm',
        slotDuration: '02:00:00',
        // aspectRatio: 0.75,
        events: function (start, end, timezone, callback) {
            $.ajax({
                url: '/weiop/activity/stat/info',
                data: {
                    // our hypothetical feed requires UNIX timestamps
                    beginTime: start.format('l'),
                    endTime: end.format('l'),
                    activityId: 'QR00000003'
                },
                success: function (data) {
                    data = [
                        {
                            title: '砍价',
                            start: '2016-12-25T09:00:00',
                            end: '2017-02-10T12:00:00'
                        },
                        {
                            title: '采茶',
                            start: '2016-12-28',
                            end: '2017-01-10'
                        },
                        {
                            id: 999,
                            title: 'Repeating Event',
                            start: '2016-12-21T16:00:00'
                        },
                        {
                            id: 999,
                            title: 'Repeating Event',
                            start: '2016-12-28T16:00:00'
                        },
                        {
                            title: '回到首页',
                            url: '/',
                            start: '2016-12-29'
                        }
                    ];
                    var events = [];
                    $.each(data, function (i, v) {
                        events.push({
                            title: v.title,
                            start: v.start,// will be parsed
                            end: v.end ? v.end : ''
                        });
                    });
                    callback(events);
                }
            });
        },
        /*events: [
         {
         title: '砍价',
         start: '2016-12-21T09:00:00',
         end: '2017-02-10T12:00:00'
         },
         {
         title: '采茶',
         start: '2016-12-21',
         end: '2017-01-10'
         },
         {
         id: 999,
         title: 'Repeating Event',
         start: '2016-12-21T16:00:00'
         },
         {
         id: 999,
         title: 'Repeating Event',
         start: '2016-12-22T16:00:00'
         },
         {
         title: '回到首页',
         url: '/',
         start: '2016-12-21'
         }
         ],*/
        eventMouseover: function (event, jsEvent, view) {
            var title = event.end ? '开始时间：' + moment(event.start).format('l') + '<br>结束时间：' + moment(event.end).format('l')
                : '开始时间：' + moment(event.start).format('l');
            if ($('.calendar.popover').length > 0) {
                $('.calendar.popover').remove();
            }
            $('body').append('<div class="calendar popover top" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>');
            $('.calendar.popover .popover-title').html(title);
            $('.calendar.popover .popover-content').html(event.title);
            var width = $(this).width();
            var top = $(this).offset().top;
            var left = $(this).offset().left;
            $('.calendar.popover').css({
                top: top - $('.calendar.popover').height() - 5 + 'px',
                left: left - $('.calendar.popover').width() / 2 + width / 2 + 'px'
            }).fadeIn();
        },
        eventMouseout: function (event, jsEvent, view) {
            $('.calendar.popover').fadeOut();
        }
    });
});

