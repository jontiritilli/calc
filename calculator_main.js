var calculator = new CalculatorApp();
$(document).ready(calculator.initializeApp.bind(calculator))

function CalculatorApp() {
	this.input = {
		numSet1: [''],
		numSet2: [''],
		operator: [''],
		lastResult: ['']
	};

	this.currentInput = this.input.numSet1;

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
		op_btn: $('.op_btn'),
		decimal_btn: $('#decimal_btn')
		};
		this.$display = $('#display');
		this.addClickHandlers();
	}

	this.addClickHandlers = function(){
		this.buttons.num_btn.on('click', this.makeArgs.bind(this));//pass all number buttons through function makeArgs
		this.buttons.op_btn.on('click', this.makeArgs.bind(this));//pass all operator buttons through function makeArgs
		this.buttons.decimal_btn.on('click', this.decimalOp.bind(this));//pass decimal button through function decimalOp function
		this.buttons.equal_btn.on('click', this.equalsFunction.bind(this));
		this.buttons.clear.on('click', this.clear.bind(this));
		this.buttons.clearEntry.on('click', this.clearEntry.bind(this));
	}
	//function to add decimals and update display. Limits decimal input to one per number set
	this.decimalOp = function(){
		var decimal = $(event.target).text()
		console.log('button pressed',decimal);
		if(this.currentInput.indexOf('.')===-1){
			this.currentInput[0] += decimal;
		}
		this.updateDisplay();
	}
	//attached to all buttons except equals. takes input and processes them to the correct variable
	this.makeArgs = function(){
		var buttonPressed = $(event.target).text();
		console.log('button pressed',buttonPressed);
		if(this.input.numSet2[0]!=='' && buttonPressed === '+'||buttonPressed === '÷'||buttonPressed === '-'||buttonPressed == 'x'){ //in combination with the equals function conditional, causing unwanted operation repeat
			this.equalsFunction();
			this.input.operator[0] = buttonPressed;
			this.currentInput = this.input.numSet2;

		} else {
			if(!isNaN(parseInt(buttonPressed))){
				this.currentInput[0] += buttonPressed;
			} else if (buttonPressed === '+'||buttonPressed === '÷'||buttonPressed === '-'||buttonPressed === 'x'){
					this.input.operator[0] = buttonPressed;
					this.currentInput = this.input.numSet2;
			}
		}
		this.updateDisplay();
	}

	this.equalsFunction = function(){
		if(this.input.numSet1[0]!=='' && this.input.numSet2[0]!==''){
			this.doMath(this.input.numSet1, this.input.numSet2, this.input.operator);
		} else if(this.input.numSet1[0]==='' && this.input.numSet2[0]!==''){//partial operand
			this.doMath(this.input.lastResult, this.input.numSet2, this.input.operator)
		} else if(this.input.numSet1[0]==='' && this.input.numSet2[0]===''){//operation repeat
			this.input.operator = this.input.lastOperator;
			this.input.numSet2 = this.input.lastNumSet2;
			this.doMath(this.input.lastResult, this.input.numSet2, this.input.operator)
		} else if(this.input.operator!=='' && this.input.numSet1[0]===''){
			this.input.operator = this.input.lastOperator;
			this.doMath(this.input.lastResult, this.input.numSet2, this.input.operator)
		}
	}

	this.doMath = function(number1, number2, operator){
		this.input.lastResult = [''];
		number1 = parseFloat(number1);
		number2 = parseFloat(number2);
		operator = operator.join('')
		switch(operator){
			case '+':
				this.input.lastResult = number1 + number2
				break;
			case '-':
				this.input.lastResult = number1 - number2
				break;
			case 'x':
				this.input.lastResult = number1 * number2
				break;
			case '÷':
				this.input.lastResult = number1 / number2
				break;
			};
		this.updateInputs();
		this.updateDisplay();
		this.currentInput = this.input.numSet1;
	}

	this.updateDisplay = function(){
		if(this.input.lastResult === Infinity){
			this.$display.text('Error');
		} else if (this.input.lastResult[0] === ''){ //display current inputs
			this.$display.text(this.input.numSet1+this.input.operator+this.input.numSet2);
		} else if (this.input.numSet1[0] === ''){ //display result
			this.$display.text(this.input.lastResult+this.input.operator+this.input.numSet2);
		} else if (this.input.numSet1[0] === ''){ //display for rollover functions
			this.$display.text(this.input.lastResult+this.input.operator+this.input.numSet2);
		}
	}

	this.updateInputs = function(){
		this.input.lastNumSet2 = this.input.numSet2;
		this.input.lastOperator = this.input.operator;
		this.input.numSet1 = [''];
		this.input.numSet2 = [''];
		this.input.operator = [''];
	}

	this.clearDisplay = function(){
		this.$display.text('0');
	}

	this.clear = function(){
		this.input.numSet1 = [''];
		this.input.numSet2 = [''];
		this.input.operator = [''];
		this.input.lastResult = [''];
		this.input.lastNumSet2 = [''];
		this.input.LastOperator = [''];
		this.currentInput = this.input.numSet1;
		this.clearDisplay();
	}

	this.clearEntry = function(){
		this.currentInput = [''];
	}
}