var spotlayer;
var pathlayer;

function initMap() {
    var mapInDom = $(".map-container"),
        size = getSize(),
        providerName = mapInDom.data("provider"),
        provider = new MM.StamenTileLayer(providerName);

    spotlayer = new SpotlightLayer();
    pathlayer = new PathLayer();

    var doc = document.documentElement;
    function getSize() {
        return new MM.Point(window.innerWidth, window.innerHeight);
    }

    function resize() {
        try {
            size = getSize();
            if (mapObject) mapObject.setSize(size);
        } catch (e) {
        }
    }
    MM.addEvent(window, "resize", resize);

    var mapObject = new MM.Map(mapInDom[0], provider, size,
        [new MM.DragHandler(), new MM.DoubleClickHandler(), new MM.TouchHandler(), new MM.MouseWheelHandler()]);
    mapObject.autoSize = true;

    mapObject.addLayer(pathlayer);
    mapObject.addLayer(spotlayer);

    var didSetLimits = provider.setCoordLimits(mapObject);

    mapObject.setCenterZoom(new MM.Location(55.0398, 82.902), 12);

    var hasher = new MM.Hash(mapObject);
}

function startFoursquareProcessing() {
    $('.signup-form').hide();
    $('.stats-container').show();
    $('.navbar').show()
    var isDebug = String(document.cookie).indexOf("debug") > 0;
    $('#myTab a').click(function (e) {
        e.preventDefault()
        $(this).tab('show')
    })
    nextStep(isDebug);
}

function nextStep(isDebug) {
    var apiurl = isDebug ? '/api/nextstep?mockdata=1' : '/api/nextstep';
    $.ajaxSetup({ cache: false });
    $.getJSON(apiurl).success(function (data) {
        if (!(data.Live) || !(data.Player.UserInfo)) {            
            document.cookie = "isauth=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            document.location.href = "/";
        }
        if (data.CurrentCheckin) {            
            $('.total-distance').html(number_format_default(data.Live.TotalDistance) + ' km');
            $('.speed-stats').html('TOP ' + number_format_default(data.Live.KeyValue.TopSpeed) + ' kmh' + ' AVG ' + number_format(data.Live.KeyValue.AvgSpeed, 3, ',', ' ') + ' kmh');
            $('.total-checkins').html(number_format_default(data.Live.TotalCheckins));
            $('.distance-stats').html(number_format_default(data.Live.KeyValue.AvgDistancePerCheckin) + 'km PER CHECKIN');

            updateStat($('.most-liked')
                , data.Live.MostLikedCheckin.VenueName + ' (' + data.Live.MostLikedCheckin.LikesCount + ' likes)'
                , data.Live.MostLikedCheckin.VenueName
                ,
                (data.Live.MostLikedCheckin.CreatedAtStr
                 + ' it was liked by '
                 + data.Live.MostLikedCheckin.LikesSummary
                 + '. <a href="'
                 + 'https://foursquare.com/user/'
                 + data.Player.UserInfo.Id
                 + '/checkin/'
                 + data.Live.MostLikedCheckin.ID
                 + '">Foursquare link</a>, click to see details about this checkin')
            );
            updateStat($('.most-popular')
               , data.Live.MostPopularCheckin.VenueName + ' (' + number_format_default(data.Live.MostPopularCheckin.TotalVenueCheckins) + ' checkins total)'
               , data.Live.MostPopularCheckin.VenueName
               ,
               (
                'This place is hot with '
                + number_format_default(data.Live.MostPopularCheckin.TotalVenueCheckins)
                + " checkins total. First time you have been here at "
                + data.Live.MostPopularCheckin.CreatedAtStr
                + '. <a href="'
                + 'https://foursquare.com/user/'
                + data.Player.UserInfo.Id
                + '/checkin/'
                + data.Live.MostPopularCheckin.ID
                + '">Foursquare link</a>, click to see details about this checkin')
           );

            $('.my-top-place').html(data.Live.MyTopCheckin.VenueName);
            $('.my-top-client').html(data.Live.KeyValue.TopClient);
            if (data.CurrentCheckin.LocationLat != 0) {
                var loc = new MM.Location(data.CurrentCheckin.LocationLat, data.CurrentCheckin.LocationLng);
                loc.isMayor = data.CurrentCheckin.IsMayor;
                loc.colorCode = encodeToColor((data.Live.i + data.Response.Offset), data.Response.Count);
                loc.radius = loc.isMayor ? 80 : 40;
                loc.radius = data.CurrentCheckin.MyVenueCheckins + loc.radius;
                pathlayer.addLocation(loc);
                spotlayer.addLocation(loc);
            }

            $('.checkins-timeline').sparkline(data.Live.KeyValue.timeline, {
                type: 'line',
                tooltipFormatter: function tooltipCheckinFormatter(sparkline, options, fields) {
                    return fields.y + " checkins per day at " + data.Live.KeyValue.timelineX[fields.x];
                }
            });
            $('.player-level').html(data.Player.Level);
            $('.player-exp').html(number_format_default(data.Player.Exp));
            $('.verdict').html(data.Player.Diagnose.Short);
            var progress = ((data.Live.i + data.Response.Offset) / data.Response.Count) * 100;
            updateProgessBar(Math.round(progress));
            updatePlayerInfo(data.Player);
            $('.popover-provide').popover({ 'html': 'true', 'placement': 'bottom' })
            nextStep(isDebug);
        }
        else {
            // final step 

        }
    }).fail(function (a) {
        alert('Looks like application is deploying right now and service is unavailable. Please refresh the page.');
        document.cookie = "isauth=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        document.location.href = "/";
    });
}
function updateStat(element, html, title, content) {
    element.html(html);
    element.attr('data-original-title', title);
    element.attr('data-content', content);
}
function updateProgessBar(progress) {
    if (progress == 100)
        $('.processing-progress').removeClass('active').removeClass('progress-striped');
    $('.processing-progress .progress-bar').attr('aria-valuenow', progress);
    $('.processing-progress .progress-bar').css('width', progress + '%');
    $('.processing-progress .progress-bar').html('' + progress + '% complete');
}

function updatePlayerInfo(player) {
    updateSkill($('.sociality-skill'), player.Exp, player.Skills.Sociality, 'sociality');
    updateSkill($('.curiosity-skill'), player.Exp, player.Skills.Curiosity, 'curiosity');
    $('.achievements-log').empty();
    $.each(player.Achievements, function (i, item) {
        $('.achievements-log').append('<p>' + item);
    });

}

function updateSkill(jelement, total_exp, original_value, name) {

    var value = (original_value / (total_exp > 500000 ? 10000000 : 500000)) * 100;
    jelement.attr('aria-valuenow', value);
    jelement.css('width', value + '%');
    jelement.html(name + ':' + original_value);
}

function encodeToColor(i, total) {
    return (765 / total * i);
}



$(function () {
    //$('.retry-button').on('click', window.location.reload());
    var isAuth = String(document.cookie).indexOf("isauth") > 0;
    if (isAuth) {
        startFoursquareProcessing();
    }
    else {
        $('.signup-form').show();
    }
    initMap();
});
