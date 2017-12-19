
var calculator = new CalculatorApp();
$(document).ready(calculator.initializeApp.bind(calculator))

function CalculatorApp() {
	var input = [];

	var buttons = {
		'clear': $('#clear_btn'),
		'clear-entry': $('#clearEntry_btn'),
		'divide': $('#divide_btn'),
		'multiply': $('#subtract_btn'),
		'add': $('#add_btn'),
		'subtract': $('#clear_btn'),
		'num_btn': $('.num_btn')
	}

	this.initializeApp = function(){
		this.addClickHandlers();
	}

	this.addClickHandlers = function(){
		$('.num_btn').on('click', this.getValue.bind(this));
		$('.op_btn').on('click', this.getValue.bind(this));
		$('#clear_btn').on('click', this.clear.bind(this));
	}

	this.getValue = function(){
		var buttonPressed = $(event.target).text();
		console.log('button pressed',buttonPressed);
		input.push(buttonPressed);
		this.updateDisplay(input).bind(this);
	}

	this.updateDisplay = function(){
		$('#display').text(input);
	}

	this.clear = function(){
		input = [];
		this.updateDisplay()
	}
}