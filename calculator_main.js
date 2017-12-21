
var calculator = new CalculatorApp();
$(document).ready(calculator.initializeApp.bind(calculator))

function CalculatorApp() {
	this.input = [];
	
	this.initializeApp = function(){
		this.buttons = {
		clear: $('#clear_btn'),
		clearEntry: $('#clearEntry_btn'),
		divide: $('#divide_btn'),
		multiply: $('#multiply_btn'),
		add: $('#add_btn'),
		subtract: $('#subtract_btn'),
		equal_btn: $('#equal_btn'),
		num_btn: $('.num_btn'),
		op_btn: $('.op_btn')
		};
		this.$display = $('#display');
		this.addClickHandlers();
	};
	this.addClickHandlers = function(){
		this.buttons.num_btn.on('click', this.getValue.bind(this));
		this.buttons.op_btn.on('click', this.getValue.bind(this));
		this.buttons.equal_btn.on('click', this.makeArgs.bind(this));
		this.buttons.clear.on('click', this.clear.bind(this));
		// this.buttons.clearEntry.on('click', this.clearEntry.bind(this)); SEE BELOW FUNCTION
	};
	this.makeArgs = function(){
		this.numSet1 = [];
		this.numSet2 = [];
		this.lastOperator = '';
		this.currentSet = this.numSet1;
		for(inputIndex = 0; inputIndex<this.input.length; inputIndex++){
			this.currentChar = this.input[inputIndex];
			if(this.currentChar == '+'||this.currentChar == '÷'||this.currentChar == '-'||this.currentChar == 'x'){
				this.lastOperator = this.input[inputIndex];
				this.currentSet = this.numSet2;
			} else {
				this.currentSet.push(this.currentChar);
			}
		};
		if(this.numSet1.length>0 && this.numSet2.length>0){
			this.doMath(this.numSet1,this.numSet2,this.lastOperator);
		} else {
			this.equalsFunction(this.numSet1,this.lastOperator);
		};
		
	};
	
	this.equalsFunction = function(){

	}

	this.doMath = function(numSet1,numSet2,lastOperator){
		this.number1 = parseFloat(numSet1.join(''));
		this.number2 = parseFloat(numSet2.join(''));
		this.result = '';
		switch(lastOperator){
			case '+':
				this.result = this.number1 + this.number2
				break;
			case '-':
				this.result = this.number1 - this.number2
				break;
			case 'x':
				this.result = this.number1 * this.number2
				break;
			case '÷':
				this.result = this.number1 / this.number2
				break;
			};
		this.input = [];
		this.input.push(this.result);
		this.updateDisplay();
	};


	this.getValue = function(){
		var buttonPressed = $(event.target).text();
		console.log('button pressed',buttonPressed);
		this.input.push(buttonPressed);
		this.updateDisplay();
	};
	this.updateDisplay = function(){
		if(this.input[0] === Infinity){
			this.$display.text('Error');
		} else {
			this.$display.text(this.input.join(''));
		}
	};
	this.clearDisplay = function(){
		this.$display.text('0');
	};
	this.clear = function(){
		this.input = [];
		this.clearDisplay();
	};
	// this.clearEntry = function(){
		//function needs to remove just the numbers following the last operator added
	// };
}