$(function () {    
    var isAuth = String(document.cookie).indexOf("isauth") > 0;
    if (isAuth) {
        startInstagramProcessing();
    }
    else {
        document.location.href = "/api/signin_instagram";
    }
    initMap();
});
