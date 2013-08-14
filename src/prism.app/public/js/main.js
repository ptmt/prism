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

function startProcessing() {
    $('.signup-form').hide();
    $('.stats-container').show();
    var isDebug = String(document.cookie).indexOf("debug") > 0;
    nextStep(isDebug);
}

function nextStep(isDebug) {
    var apiurl = isDebug ? '/api/nextstep?mockdata=1' : '/api/nextstep';
    $.get(apiurl).success(function (data) {
        if (!data.Live) 
            alert('Seems like application is deploying right now, and service is unavailable please refresh the page.');
        if (data.CurrentCheckin) {
            //console.log(data);            
            $('.total-distance').html(number_format_default(data.Live.TotalDistance) + ' km');
            $('.total-checkins').html(number_format_default(data.Live.TotalCheckins));
            $('.most-likes').html(data.Live.MostLikedCheckin.VenueName + '(' + data.Live.MostLikedCheckin.LikesCount + ' likes)');
            //console.log(data.Live.MostLikedCheckin);
            $('.most-likes').attr('data-original-title', data.Live.MostLikedCheckin.VenueName);
            $('.most-likes').attr('data-content', 'Checkin date: '
                     + new Date(data.Live.MostLikedCheckin.CreatedAt).toString('yyyy-MM-dd')
                     + '. It was liked by '
                     + data.Live.MostLikedCheckin.LikesSummary
                     + '. Click to see details about this checkin');
            // checkin example href https://foursquare.com/potomushto/checkin/51a04eb7498ee3b3e824999c
            $('.most-popular').html(number_format_default(data.Live.MostPopularCheckin.TotalVenueCheckins) + ' in ' + data.Live.MostPopularCheckin.VenueName);
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
            $('.player-exp').html(data.Player.Exp);
            var progress = ((data.Live.i + data.Response.Offset) / data.Response.Count) * 100;
            updateProgessBar(Math.round(progress));
            updatePlayerInfo(data.Player);
            $('.popover-provide').popover()
            nextStep(isDebug);
        }
        else {
            // final step 

        }
    }).fail(function(a){alert('Seems like application is deploying right now, and service is unavailable please refresh the page.');});
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

function number_format_default(number) { return number_format(number, 0, ',', ' '); }
function number_format(number, decimals, dec_point, thousands_sep) {
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

$(function () {
    //$('.retry-button').on('click', window.location.reload());
    var isAuth = String(document.cookie).indexOf("isauth") > 0;
    if (isAuth) {
        startProcessing();
    }
    else {
        $('.signup-form').show();
    }
    initMap();
});
