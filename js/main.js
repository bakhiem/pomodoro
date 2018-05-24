
let t;
Storage.prototype.setObj = function (key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function (key) {
    return JSON.parse(this.getItem(key))
}
$('.fa.fa-times').on('click', () => {
    location.reload();
});

let volumes = localStorage.getObj('rangeValue') || 100;
$('#myRange').val(volumes);
$('#rangePrimary').html(volumes);

let isDisplayInTile = localStorage.getObj('isDisplayInTile');
let POMODORO_TIME = localStorage.getObj('POMODORO_TIME') || 25;
let SHORT_BREAK_TIME = localStorage.getObj('SHORT_BREAK_TIME') || 5;
let LONG_BREAK_TIME = localStorage.getObj('LONG_BREAK_TIME') || 10;
let timerState = {
    pomodoro: POMODORO_TIME,
    shortBreak: 5,
    longBreak: 10,
    isRunning: false,
    state: "pomodoro",
    min: POMODORO_TIME,
    sec: 0

}

$(document).ready(() => {
    renderTimer(timerState.min, timerState.sec);
    onClickStart();
    onClickReset();
    shortBreak();
    longBreak();
    pomodoro();
    onAddWork();
    reAddWork();
    titleTimeChecked();
    buttonState();
    if(localStorage.getObj('musicName')!=null)
    setTypeMusic(localStorage.getObj('musicName'));
    setVolume(localStorage.getObj('rangeValue'));
})


const titleTimeChecked = () => {
    if (localStorage.getObj('isDisplayInTile') === 1) {
        $('#checkBoxTimerIndication').prop('checked', true);
    } else $('#checkBoxTimerIndication').prop('checked', false);
}

const timer = () => {
    if (timerState.isRunning == true) {
        if (timerState.min != 0) {
            if (timerState.sec == 0) {
                timerState.sec = 59;
                timerState.min--;
            } else {
                --timerState.sec
            }
        } else {
            if (timerState.sec != 0) {
                --timerState.sec
            } else {
                return;
            }
        }
    }
    showPopupBreakOnFinishPomodoroTime();
}
let runTimer = () => {
    clearInterval(t);
    t = setInterval(() => {
        renderTimer(timerState.min, timerState.sec);
        timer();
        // renderTimer(min, sec);
    }, 1000);
}
const onClickStart = () => {
    $(".playBtn").on('click', () => {
        timerState.isRunning = true;
        runTimer();
        $(".playBtn").attr('disabled', true);
    })
}

const renderTimer = (minute, second) => {
    if (minute - 10 < 0) {
        minute = "0" + minute;
    }
    if (second - 10 < 0) {
        second = "0" + second;
    }
    if (timerState.state == "pomodoro") {
        let totalTime = localStorage.getObj('TotalTime') || 0;
        totalTime += 1;
        localStorage.setObj('TotalTime', totalTime);
    }
    let time = `${minute}: ${second}`;
    if (isDisplayInTile === 1) {
        document.title = time;
    }
    if (minute == "00" && second == "00") {
        document.title = "Over time !!!";
        overTime();
    }

    $("#minute").html(minute);
    $("#second").html(second);

}

const onClickReset = () => {
    $(".resetBtn").on('click', () => {
        clearInterval(t);
        timerState.isRunning = false;
        timerState.sec = 0;
        if (timerState.state == "pomodoro") {
            timerState.min = POMODORO_TIME;
        } else if (timerState.state == "shortbreak") {
            timerState.min = SHORT_BREAK_TIME;
        } else {
            timerState.min = LONG_BREAK_TIME;
        }
        renderTimer(timerState.min, timerState.sec);
        $(".playBtn").attr('disabled', false);
    })
}

const pomodoro = () => {
    $("#pomodoro").on("click", () => {
        $(".playBtn").removeAttr('disabled');
        if (timerState.state == "shortbreak" || timerState.state == "longbreak") {
            $('#remove-work-field').removeClass('work-field-hide');
            $('#short-break-text').css('display', 'none');
            $('#long-break-text').css('display', 'none');
        }
        setState(false, "pomodoro", POMODORO_TIME);
        renderTimer(timerState.min, timerState.sec);
        $("#addwork").attr("readonly", false);
        buttonState();
    })
}

const shortBreak = () => {
    $("#shortbreak").on("click", () => {
        doOnShortBreak();
        stop();
        $('#long-break-text').css('display', 'none');
    })
}

const longBreak = () => {

    $("#longbreak").on("click", () => {
        buttonState();
        stop();
        $('#short-break-text').css('display', 'none');
        doOnLongBreak();
    })
}
//khiem-add to daywork
const addtoDayWork = (input) => {
    let dayWork = localStorage.getObj('dayWork') || {};
    var day = new Date();
    var dateInMonth = day.getDate();
    if (dayWork.day != dateInMonth) {
        localStorage.removeItem('dayWork');
        dayWork.day = dateInMonth;
        dayWork.works = [];
    }
    let oneWork = {
        work: input,
        isDone: false
    }
    dayWork.works.push(oneWork);
    localStorage.setObj('dayWork', dayWork);
    reAddWork();
}

const reAddWork = function () {
    let dayWork = localStorage.getObj('dayWork') || {};
    var day = new Date();
    var dateInMonth = day.getDate();
    if (dayWork.day == dateInMonth && dayWork.works.length > 0) {
        let works = dayWork.works;
        $("#work-list").html('');
        for (let i = 0; i < works.length; i++) {
            let work = works[i];
            if (work.isDone) {
                $("#work-list").prepend(
                    `<div class='oneWork' style="position: relative;">
                        <input type="text" class="form-control inputAdd" disabled value='${work.work}'>
                        <span class='workStatus'>
                            <i class="far fa-trash-alt delete"></i>
                            <i class="far fa-check-circle done"></i>
                        </span>
                    </div>`
                )
            } else if (!work.isDone) {
                $("#work-list").prepend(
                    `<div class='oneWork' style="position: relative;">
                        <input type="text" class="form-control inputAdd" value='${work.work}'>
                        <span class='workStatus'>
                            <i class="far fa-trash-alt delete"></i>
                            <i class="far fa-check-circle done"></i>
                        </span>
                    </div>`
                )
            }

        }
        $('#addwork').val('');
    }
}
const onAddWork = () => {
    $("#addwork").keyup(function (e) {
        let input = $("#addwork").val();

        var code = e.which; // recommended to use e.which, it's normalized across browsers
        if (code == 13) e.preventDefault();
        if (code == 13 && input !== "") {
            addtoDayWork(input);
            let toDoWork = localStorage.getObj('toDoWork') || [];
            toDoWork.push(input);
            localStorage.setObj('toDoWork', toDoWork);
        } // missing closing if brace

    });
}


/*========================== SETTINGS POP-UP==========================*/

function toggleSetting(checkbox, setting) {
    var thisCheck = $(checkbox)[0];
    if (thisCheck.checked) {
        localStorage.setItem(setting, true);
    } else {
        localStorage.setItem(setting, false);
    }
}
// Phải time lưu vào local storage sau đó reload lại page
const onSaveSettings = () => {
    let timePomodoro = $("#time_pomodoro").val();
    let timeShortBreak = $("#time_shortbreak").val();
    let timeLongBreak = $("#time_longbreak").val();
    let musicName = $('#selectMusic :selected').text();
    localStorage.setObj('musicName', musicName);
    let rangeValue = $('#myRange').val();
    localStorage.setObj('rangeValue', rangeValue);
   
    if (timePomodoro !== '' && Number(timePomodoro >= 1)) {
        localStorage.setObj('POMODORO_TIME', timePomodoro);
    }
    if (timeShortBreak !== '' && Number(timeShortBreak >= 1)) {
        localStorage.setObj('SHORT_BREAK_TIME', timeShortBreak);
    }
    if (timeLongBreak !== '' && Number(timeLongBreak >= 1)) {
        localStorage.setObj('LONG_BREAK_TIME', timeLongBreak);
    }
    if ($('#checkBoxTimerIndication').is(':checked')) {
        localStorage.setObj('isDisplayInTile', 1);
    } else {
        localStorage.setObj('isDisplayInTile', 0);
        
    }

    location.reload();
}

/*==============================DELETE + DONE WORKS======================================= */
$(document).click(function (event) {
    if (($(event.target).attr('class')) != undefined && ($(event.target).attr('class')).includes('delete')) {
        $(event.target).parent().parent().addClass("deleteButton");
        let item = $(event.target).parent().prev().val()
        removeDaywork(item);
        addTodoWorktoLocal(item);
    }
});

const removeDaywork = (item) => {
    let dayWork = localStorage.getObj('dayWork');
    let works = dayWork.works;
    for (let i = 0; i < works.length; i++) {
        if (works[i].work == item) {
            works.splice(i, 1);
        }
    }
    localStorage.setObj('dayWork', dayWork);
}
let addTodoWorktoLocal = (item) => {
    let toDoWork = localStorage.getObj('toDoWork') || [];
    let index = toDoWork.indexOf(item);
    if (index != -1) {
        toDoWork.splice(index, 1);
    }
    localStorage.setObj('toDoWork', toDoWork);
    let toDoWorkDone = localStorage.getObj('toDoWorkDone') || [];
    toDoWorkDone.push(item);
    localStorage.setObj('toDoWorkDone', toDoWorkDone);
}
const doneDaywork = (item) => {
    let dayWork = localStorage.getObj('dayWork');
    let works = dayWork.works;
    for (let i = 0; i < works.length; i++) {
        if (works[i].work == item) {
            works[i].isDone = true;
        }
    }

    localStorage.setObj('dayWork', dayWork);
}

$(document).click(function (event) {
    if (($(event.target).attr('class')) != undefined && ($(event.target).attr('class')).includes('done')) {
        $(event.target).prop('disabled', true);
        $(event.target).parent().prev().prop('disabled', true);
        let item = $(event.target).parent().prev().val();
        addTodoWorktoLocal(item);
        doneDaywork(item);
    }
});
/*======================================================================================*/

/*==============================POPUP SHORT, LONG BREAK================================ */

const showPopupBreakOnFinishPomodoroTime = () => {
    if (timerState.state == "pomodoro" && timerState.min == 0 && timerState.sec == 0) {

        var popup = document.getElementById("myPopup");
        popup.classList.toggle("show");

        //Fix khi show break popup ko cho click button
        $("#pomodoro").attr('disabled', true);
        $("#shortbreak").attr('disabled', true);
        $("#longbreak").attr('disabled', true);

        $(".popup").css("display", "block");
        $(".popupbtn").css("display", "inline-block");
        $(".fa-times").on('click', () => {
            $(".popup").css("display", "none");
        });

        onClickShortBreakPopup();
        onClickLongBreakPopup();

    }

    if ((timerState.state == "shortbreak" || timerState.state == "longbreak") && timerState.min == 0 && timerState.sec == 0) {
        location.reload();
    }
}

const doNothingOnBreak = (state, timebreak) => {
    $(document).on("mouseenter focus keydown mousemove mousedown", () => {
        if (timerState.state === state) {
            timerState.min = timebreak;
            timerState.sec = 0;
            $('#short-break-text').addClass('onmouseover');
            setTimeout(function () {
                $('#short-break-text').removeClass('onmouseover');
            }, 1000);
        }
    })
};
let doOnShortBreak = () => {
    setState(true, "shortbreak", SHORT_BREAK_TIME);
    buttonState();
    $(".popup").css("display", "none");
    $('#remove-work-field').addClass('work-field-hide');
    $('#short-break-text').css('display', 'block');
    $('#short-break-text h1').html(`Do nothing in ${timerState.min} minutes`)
    runTimer();
    doNothingOnBreak("shortbreak", SHORT_BREAK_TIME);
    renderTimer(timerState.min, timerState.sec);
    doneAlarm();
}

let doOnLongBreak = () => {
    setState(true, "longbreak", LONG_BREAK_TIME);
    buttonState();
    $('#remove-work-field').addClass('work-field-hide');
    $('#long-break-text').css('display', 'block');
    $(".popup").css("display", "none");
    $("#shortbreak").css("background-color", "#95F9E3");
    $("#longbreak").css("background-color", "");
    runTimer();
    renderTimer(timerState.min, timerState.sec);
    doneAlarm();
}

const onClickShortBreakPopup = () => {
    $("#shortbreakpopup").on("click", () => {
        stop();
        doOnShortBreak();

    })
}
const onClickLongBreakPopup = () => {
    $("#longbreakpopup").on("click", () => {
        stop();
        doOnLongBreak();

    })
}
const setState = (isRunning, state, min) => {
    timerState.isRunning = isRunning;
    timerState.state = state;
    timerState.min = min;
    timerState.sec = 0;
}

const onClickIntroductionIcon = () => {
    $(".open").on("click", function () {
        $(".popup-overlay, .popup-content").addClass("active");
    });

    //removes the "active" class to .popup and .popup-content when the "Close" button is clicked 
    $(".close, .popup-overlay").on("click", function () {
        $(".popup-overlay, .popup-content").removeClass("active");
    });
}

const buttonState = () => {
    $("#pomodoro").attr('disabled', false);
    $("#shortbreak").attr('disabled', false);
    $("#longbreak").attr('disabled', false);
    if (timerState.state === 'pomodoro') {
        $("#pomodoro").css('opacity', '1');
        $("#shortbreak").css('opacity', '0.5');
        $("#longbreak").css('opacity', '0.5');
    } else if (timerState.state === 'shortbreak') {
        $("#pomodoro").css('opacity', '0.5');
        $("#shortbreak").css('opacity', '1');
        $("#longbreak").css('opacity', '0.5');
    } else {
        $("#pomodoro").css('opacity', '0.5');
        $("#shortbreak").css('opacity', '0.5');
        $("#longbreak").css('opacity', '1');
    }
}