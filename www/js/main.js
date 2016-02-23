var canvas;
var context;
var canvasWidth = 490;
var canvasHeight = 220;
var color = "#000000";
var lineWidth = 2;
var currX = 0;
var currY = 0;
var paint = false;
var pen ="Lapiz";


function onLoad() {
	document.addEventListener("deviceready", onDeviceReady, false);
	
	var app = angular.module('Drawing', [ 'pascalprecht.translate' ]);

	app.config([ '$translateProvider', function($translateProvider) {
		$translateProvider.translations('en', translationsEN);
		$translateProvider.translations('es', translationsES);
		$translateProvider.translations('ca', translationsCAT);
		var loc = navigator.language || navigator.userLanguage;
		var lang = loc.split("-",1);
		$translateProvider.preferredLanguage(lang.toString());
		$translateProvider.fallbackLanguage('en-EN');
		$translateProvider.useSanitizeValueStrategy('escape');
		
	} ]);
	
	app.controller('Ctrl', [ '$translate', '$scope', function($translate, $scope) {
		
		$scope.sizeValue = lineWidth;
		$scope.colorValue = color;
		
		
		//Cambia el idioma de la app 
		$scope.changeLanguage = function(langKey) {
			$translate.use(langKey);
		};
		
		$scope.changeSize = function() {
			lineWidth = $scope.sizeValue;
		}
		
		$scope.changePen = function(value) {
			pen = $scope.penValue;
		}
		
		$scope.changeColor = function() {
			color = $scope.colorValue;
		}
		
		$scope.clean = function() {
			context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		}
		
		
	} ]);
}

function onDeviceReady() {
	//console.log("Start onLoad()");
	redimensionar();
	init();
	//console.log("End onLoad()");
}

function redimensionar() {
	canvasWidth = window.innerWidth;
	canvasHeight = window.innerHeight;
	
	var drawingDiv = $('#drawingDiv');
	drawingDiv.height(canvasHeight+25);
	drawingDiv.width(canvasWidth);

	var drawingCanvas = $('#drawingCanvas');
	drawingCanvas.height(canvasHeight+25);
	drawingCanvas.width(canvasWidth);
}

function init() {
	//console.log("Start init");
	var canvasDiv = document.getElementById('drawingDiv');
	canvas = document.createElement('canvas');
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('id', 'drawingCanvas');
	canvasDiv.appendChild(canvas);
	if(typeof G_vmlCanvasManager != 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvas);
	}
	context = canvas.getContext("2d");
	
	// Menu swipe
	var topMenu = $("#topMenu");
	topMenu.on("swiperight", function() {
		var newPos = (canvasWidth-45)+"px";
		$(this).animate({ "left": newPos }, "slow" );
	});

	topMenu.on("swipeleft", function() {
		alert();
		$(this).animate({ "left": "5px" }, "slow" );

	});

	
	// start Mouset Drawing
	canvas.addEventListener("mousedown", mousedown, false);
	canvas.addEventListener("mousemove", mousemove, false);
	canvas.addEventListener("mouseup", mouseup, false);
	canvas.addEventListener("mouseout", mouseout, false);
	// start Touch Drawing
	canvas.addEventListener("touchstart", handleStart, false);
	canvas.addEventListener("touchend", handleCancel, false);
	canvas.addEventListener("touchcancel", handleCancel, false);
	canvas.addEventListener("touchleave", handleCancel, false);
	canvas.addEventListener("touchmove", handleMove, false);
	
	//console.log("End init");
}

function draw(_prevX, _prevY, _currX, _currY) {
	context = canvas.getContext("2d");
	resetPen();
	if (pen == "Lapiz") {
		context.shadowBlur = lineWidth*5;
		context.shadowColor = color;
	} else if (pen == "Goma") {
		context.strokeStyle = "#FFFFFF";
	}
	context.beginPath();
	context.moveTo(_prevX, _prevY);
	context.lineTo(_currX, _currY);
	console.log(_prevX +" "+ _prevY +" "+ _currX +" "+ _currY);
	context.stroke();
	//context.globalAlpha = 20;
	context.closePath();
}

function resetPen() {
	context.strokeStyle = color;
	context.lineWidth = lineWidth;
	context.lineJoin = context.lineCap = 'round';
	context.shadowBlur = 0;
}

function distanceBetween(point1, point2) {
	return Math.sqrt(Math.pow(point2.x - point1.x, 2)
			+ Math.pow(point2.y - point1.y, 2));
}

function angleBetween(point1, point2) {
	return Math.atan2(point2.x - point1.x, point2.y - point1.y);
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateMousePositionMouse(evt) {
    var target = evt;
    
    if (typeof canvas.offset == 'function') {
    	var offset = canvas.offset();
        currX = target.pageX - offset.left;
        currY = target.pageY - offset.top;
    } else {
    	currX = target.pageX - canvas.offsetLeft;
        currY = target.pageY - canvas.offsetTop;
    }  

}

function updateMousePositionTouch(evt) {
    var touches = evt.changedTouches;
    var target = touches[0];

    if (typeof canvas.offset == 'function') {
    	var offset = canvas.offset();
        currX = target.pageX - offset.left;
        currY = target.pageY - offset.top;
    } else {
    	currX = target.pageX - canvas.offsetLeft;
        currY = target.pageY - canvas.offsetTop;
    }  
}

// Mouse methods
function mousedown(evt) {
	updateMousePositionMouse(evt);
	paint = true;
	draw(currX, currY, currX+0.1, currY+0.1);

}

function mousemove(evt) {
	var _prevX = currX;
	var _prevY = currY;
	updateMousePositionMouse(evt);
	var _currX = currX;
	var _currY = currY;
	if (paint) {
		draw(_prevX, _prevY, _currX, _currY);
	}
}

function mouseup(evt) {
	paint = false;
}

function mouseout(evt) {
	mouseup(evt);
}

//Touch methods
function handleStart(evt) {
	evt.preventDefault();
	updateMousePositionTouch(evt);
	draw(currX, currY, currX+0.1, currY+0.1);
}

function handleMove(evt) {
	evt.preventDefault();
	var _prevX = currX;
	var _prevY = currY;
	updateMousePositionTouch(evt);
	var _currX = currX;
	var _currY = currY;
	draw(_prevX, _prevY, _currX, _currY);
}

function handleCancel(evt) {
	evt.preventDefault();
	updateMousePositionTouch(evt);
	draw(currX, currY, currX, currY);
}



//Utils
/**
 * Determine the mobile operating system.
 * This function either returns 'iOS', 'Android' or 'unknown'
 *
 * @returns {String}
 */
function getMobileOperatingSystem() {
	var userAgent = navigator.userAgent || navigator.vendor || window.opera;

	if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)
			|| userAgent.match(/iPod/i)) {
		return 'iOS';

	} else if (userAgent.match(/Android/i)) {

		return 'Android';
	} else {
		return 'unknown';
	}
}
