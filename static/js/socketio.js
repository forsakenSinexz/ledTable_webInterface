var currentSubPageName = 'main';//TODO: if you ever add landing page support, change index to the page you desire

var socket = io(); // just init socketio before other stuff!
var isSocketReady = false;
// socket.on('connect', function() {
//     socket.emit('load_sub_page', currentSubPageName); 
//     isSocketReady = true;
// });


socket.on('sub_page', function(page, page_name){
    // var toActivate = []
    // while(page.includes("+[") && page.includes("]+")){
    //     var posL = page.indexOf("+[");
    //     var posR = page.indexOf("]+");
    //     toActivate.push(page.substring(posL + 2, posR));
    //     page = page.substr(0, posL) + page.substr(posR + 2, page.length);
    // }
    $('#final_content_container').html("");
    $('#final_content_container').append($.parseHTML(page, document, true));
    // document.getElementById('final_content_container').innerHTML = page;
    // toActivate.forEach(function(f,i){
    //     window[f](true);
    // })
    // window.history.pushState("object or string", "Title", page_name);
    document.getElementById('wrapper-loading').classList.remove("active");
    document.getElementById('wrapper-loading').innerHTML = "";
    removeLoadingAfterTime(200);
});

async function removeLoadingAfterTime(time){
    await(time);
    document.getElementById('wrapper-loading').style.visibility = "hidden";
} 

function mode_switch(mode){
    subPage_switch(mode);
    socket.emit('mode_switch_event', mode);
}

function change_color_mode(cmode){
    socket.emit('color_mode_change', cmode);
}

function change_color_submode(id, mode){
    socket.emit('color_submode_change', {co: parseInt(id, 10), m:mode});
}

function subPage_switch(page_name){
    if(page_name.localeCompare(currentSubPageName) != 0){
        currentSubPageName = page_name;
        document.getElementById('wrapper-loading').style.visibility = "visible";
        document.getElementById('wrapper-loading').classList.add("active");
        document.getElementById('wrapper-loading').innerHTML = 
        '<div class="row justify-content-center align-items-center" style="margin: auto;">'
        + '<div class="spinner-grow" style="width: 3rem; height: 3rem; color: white;" role="status">' 
        + '<span class="sr-only">Loading...</span></div>'
        + '</div>';
        socket.emit('load_sub_page', page_name);
    }
}

function change_mode(mode){
    socket.emit('color_mode_change', mode);
}

function test_test(){
    socket.emit('test');
}
