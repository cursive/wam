var ui;
var gui;
var socket;
var p5=100;
var p3=300;
var piezo
var piezostatus=false;
var canBlink=true

$(function() {



		initArduino()
        initSockets();
		initUI();

});



	
function initArduino(){
    console.log("init");
	// Declare these variables so you don't have
    // to type the full namespace
    var IOBoard = BO.IOBoard;
    var IOBoardEvent = BO.IOBoardEvent;
    var Pin = BO.Pin;
    var PinEvent = BO.PinEvent;

    // If you are not serving this file from the same computer
    // that the Arduino board is connected to, replace
    // window.location.hostname with the IP address or hostname
    // of the computer that the Arduino board is connected to.
    var host = window.location.hostname;
    // if the file is opened locally, set the host to "localhost"
    if (window.location.protocol.indexOf("file:") === 0) {
        host = "localhost";
    }
    var arduino = new IOBoard(host, 8887);
    // var $analogVal = $('#value');
    // var $progressBar = $("#progressbar");

    // Listen for the IOBoard READY event which indicates the IOBoard
    // is ready to send and receive data
    arduino.addEventListener(IOBoardEvent.READY, onReady);

    function onReady(event) {
        // Remove the event listener because it is no longer needed
        console.log("Arduino onReady");
        arduino.removeEventListener(IOBoardEvent.READY, onReady);
        arduino.enableAnalogPin(0);
        arduino.enableAnalogPin(3);
        arduino.enableAnalogPin(5);
        arduino.setDigitalPinMode(11, Pin.DOUT);
        piezo = arduino.getDigitalPin(11);
        var sensor0 = arduino.getAnalogPin(0);
        var sensor3 = arduino.getAnalogPin(3);
        var sensor5 = arduino.getAnalogPin(5);
        sensor0.addEventListener(PinEvent.CHANGE, onChange0);
        sensor3.addEventListener(PinEvent.CHANGE, onChange3);
        sensor5.addEventListener(PinEvent.CHANGE, onChange5);
        // $(".display").text("Connected");
        $(".display").css({backgroundColor:'green'})
        piezobuzz();

        
    }

    function piezobuzz(){
        piezostatus=!piezostatus;
        if(canBlink){
            if(piezostatus){
                piezo.value = Pin.HIGH;
            }else{
                piezo.value = Pin.LOW;
            }
        }
        setTimeout(piezobuzz,p3);
        console.log(p3*10);
    }


    function onChange0(evt) {
        // console.log("change0");
        var valueIn = evt.target.value;
        var value = valueIn * 100;
        $(".display0 .label").text("Pot 0 "+value) 
        $(".display0 .bar").css({width:value}) 
    }
    function onChange3(evt) {
        // console.log("change3");
        var valueIn = evt.target.value;
        var value = valueIn * 100;
        $(".display3 .label").text("Pot 3 "+value) 
        $(".display3 .bar").css({width:value}) 
        p3=Math.floor(valueIn * 100)
    }
    function onChange5(evt) {
        // console.log("change5");
        var valueIn = evt.target.value;
        var value = valueIn * 100;
        p5=Math.floor(valueIn * 100)
        $(".display5 .label").text("Pot 5 "+value) 
        $(".display5 .bar").css({width:value}) 
    }
}



 
function randomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function initSockets(){
   // socket = io();
   // alert(json.ip);
    socket = io.connect('http://192.168.25.235:8887');
     $('form').submit(function(){
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function(msg){
        console.log("received");
        $('#messages').append($('<li>').text(msg));
    });
    socket.on('new user', function(msg){
        console.log("new user");
        $('#messages').append($('<li class="newuser">').text("New User Jouined"));
    });
    socket.on('buttonTap', function(msg){

            console.log("buttonTap"+Math.floor($(".display5 .label").text())*5);
            $(".circle").animate({
                left:Math.random()*300,
                top:Math.random()*300
            }, p5*10)
    });
}

function initUI(){
    console.log("init ui");
    $(".circle").click(function(){
        socket.emit('buttonTap',"aaa");
    })
      $(".blink").click(function(){
        canBlink=!canBlink;
    })
}