var music = document.getElementById("musicque");
var typeMusic = "Alpha";
var mute = true;
var volume = 1;

// change volume
var slider = document.getElementById("myRange");
var output = document.getElementById("rangePrimary");
slider.oninput = function () {
    output.innerHTML = this.value;
    volume = this.value / 100;
    if (this.value == 0) {
        muteSound();
    } else {
        music.muted = false;
        music.volume = volume;
        loudSound();
    }
}

function playSound() {
    console.log(typeMusic);
    var input = {
        Alpha: ["brain power 2.mp3", "brain power 1.mp3", "brain power 3.mp3"],
        Belta: ["beta 1.mp3", "beta 2.mp3", "beta 3.mp3"],
        Alarm: ["bell_ring.mp3"]
    };
    // get folder with type music
    var folderType = [];
    switch (typeMusic) {
        case "Alpha":
            folderType = input.Alpha;
            break;
        case "Belta":
            folderType = input.Belta;
            break;
        case "Alarm":
            folderType = input.Alarm;
            break;
    }
    var path = "sounds/" + typeMusic + "/" + folderType[Math.floor(Math.random() * folderType.length)];
    console.log(path)
    music.setAttribute('src', path);
    music.load();
    music.play();
}
let youtubeIsPlay = 0;
$('#introModal').click(function () {
    youtubeIsPlay = 1;
});



$('body').click(function () {
    if (youtubeIsPlay == 1) {
        $('iframe').attr('src', $('iframe').attr('src'));
        youtubeIsPlay = 0;
    }

});
$('#youtubeClose').click(function () {
    $('iframe').attr('src', $('iframe').attr('src'));
    youtubeIsPlay = 0;
});

function pause(event) {
    if (music.muted) {
        music.muted = false;
        mute = false;
        $('#myRange').val(volume * 100);
        $('#rangePrimary').val(volume * 100);
    } else {
        music.muted = true;
        mute = true;
        $('#myRange').val(0);
        $('#rangePrimary').val(0);
    }
}

function overTime() {
    typeMusic = "Alarm";
    playSound(); // play with alarm
    music.muted = false; // set volume not mute
    music.volume = 1; // set volume for alarm
    if ($('.popup').css('display') == "none") doneAlarm();
}

function doneAlarm() {
    music.pause();
    music.currentTime = 0;
    music.volume = volume;
    typeMusic = $('#selectMusic option:selected').val();
    console.log("after alarm" + $('#selectMusic option:selected').val())
}

function stop() {
    if (music.paused == false) {
        music.pause();
        music.currentTime = 0;
    }
}

function setTypeMusic(type) {
    typeMusic = type;
}

function setVolume(input) {
    if (input == null) music.volume = 1;
    else music.volume = input / 100;
}


$(document).ready(() => {
    $('#selectMusic').on('change', function () {
        typeMusic = $('#selectMusic option:selected').val();
    });
    console.log(typeMusic)
    if (typeMusic == "Belta") $("#belta-select").attr("selected", "true");
});