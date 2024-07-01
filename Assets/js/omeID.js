
// Function to get browser name
function getBrowserName() {
    var ua = window.navigator.userAgent;
    var browserName;
    
    if (ua.indexOf("Firefox") > -1) {
        browserName = "Firefox";
    } else if (ua.indexOf("Chrome") > -1) {
        browserName = "Chrome";
    } else if (ua.indexOf("Safari") > -1) {
        browserName = "Safari";
    } else if (ua.indexOf("MSIE") > -1 || ua.indexOf("Trident/") > -1) {
        browserName = "Internet Explorer";
    } else if (ua.indexOf("Edge") > -1) {
        browserName = "Edge";
    } else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) {
        browserName = "Opera";
    } else if (ua.indexOf("Brave") > -1) {
        browserName = "Brave";
    } else {
        browserName = "Unknown";
    }
    
    return browserName;
}

// Function to get country
function getUserCountry(callback) {
    $.getJSON('https://ipapi.co/json/', function(data) {
        callback(data.country_name);
    });
}


var omeID = localStorage.getItem("omeID");
if (omeID) {
    $.ajax({
        url: "/new-user-update/" + omeID + "",
        type: "PUT",
        success: function (data) {
            const newOmeID = data.omeID;
            if (newOmeID) {
                localStorage.removeItem("omeID");
                localStorage.setItem("omeID", newOmeID);
                username = newOmeID;
            } else {
                username = omeID;
            }
        },
    });
} else {
    getUserCountry(function(country) {
        var browserName = getBrowserName();
        var postData = {
            country: country,
            browser: browserName
        };
        
        $.ajax({
            type: "POST",
            url: "/api/toassignomeID",
            data: postData,
            success: function (response) {
                localStorage.setItem("omeID", response);
            },
            error: function (error) {
                console.log(error);
            },
        });
    });
}
