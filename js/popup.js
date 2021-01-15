ready(() => {
    setTimeout(restoreOptions, 1);
    getId('startbtn').onclick = startRefresh
})


function get_interval() {
    var time_result = []
    time_result[0] = getId('minValue').value + "-" + getId('maxValue').value;
    time_result[1] = "rand";
    return time_result;
}

function startRefresh() {
    if (getId("startbtn").value == "Start") {

        getId("startbtn").classList.add("stop");
        getId("startbtn").value = "Stop";

        var myInterval = get_interval();
        var views = chrome.extension.getViews();
        var preurl = getId("pdurlinp").value;

        for (var i in views) {
            if (views[i].loop_start) {
                views[i].loop_start(-1, myInterval[0], myInterval[1], null, null, preurl);
            }
        }
    } else {
        getId("startbtn").value = "Start";
        getId("startbtn").classList.remove("stop");
        var views = chrome.extension.getViews();
        for (var i in views) {
            if (views[i].loop_stop) {
                views[i].loop_stop();
            }
        }
    }
}

function restoreOptions() {
    if (localStorage['random_time'] == 'true') {
        show(getId('randombox'))
    }
    if (localStorage['pdcheck'] && localStorage['pdcheck'] == 'true') {
        show(getId('pdurlbox'))
        var pdurl = localStorage['pdurl'];
        getId('pdurlinp').value = pdurl
    }

    var port = chrome.extension.connect({
        name: "getOptions"
    });
    port.onMessage.addListener(recvData);
    port.postMessage({
        msg: 'getAllOptions'
    });

    // quick fix for mac scrollbar
    document.body.style.paddingRight = '11px';
}

function recvData(data) {
    if (data.status == 'start') {
        getId("startbtn").value = "Stop";
        getId("startbtn").classList.add("stop");
    } else {
        getId("startbtn").value = "Start";
        getId("startbtn").classList.remove("stop");
    }
}

function updateCustomValue() {
    var hours = getId('hours')
    var minutes = getId('minutes')
    var seconds = getId('seconds')
    localStorage.customHour = hours.value
    localStorage.customMinute = minutes.value
    localStorage.customSecond = seconds.value
    var sum = parseInt(hours.value) + parseInt(minutes.value) + parseInt(seconds.value)
    getId('custom').value = sum
}


var scrollRoot = document.body;
var header = getId('header');
var is_scrolling = true;

function update() {
    if (is_scrolling) {
        if (scrollRoot.scrollTop)
            header.classList.add('scrolled');
        else
            header.classList.remove('scrolled');
        is_scrolling = false;
    }
    requestAnimationFrame(update);
}
update();

document.onscroll = function() {
    is_scrolling = true;
}