var calculator = new CalculatorApp();
$(document).ready(calculator.initializeApp.bind(calculator))

function CalculatorApp() {
	this.input = { //create inputs to hold all arguments and operators
		numSet1: [''], //number set to the left of the operator
		numSet2: [''], //number set to the right of the operator
		operator: [''],
		result: [''] //most recent result of doMath
	};

	this.currentInput = this.input.numSet1; //set current input that can be changed, either adding to numSet1 or numSet2

	this.initializeApp = function(){
		this.buttons = { //assign all jQuery targets to keys pairs
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
		this.$display = $('#display'); //assign display jQuery target to variable
		this.addClickHandlers();
	}

	this.addClickHandlers = function(){
		this.buttons.num_btn.on('click', this.makeArgs.bind(this)); //run makeArgs on number btn clicks
		this.buttons.op_btn.on('click', this.makeArgs.bind(this)); //run makeArgs on operator btn clicks
		this.buttons.decimal_btn.on('click', this.decimalOp.bind(this)); //run decimalOp on decimal btn clicks
		this.buttons.equal_btn.on('click', this.equalsFunction.bind(this)); //run equals function on equalbtn click
		this.buttons.clear.on('click', this.clear.bind(this)); //run clear function on click
		this.buttons.clearEntry.on('click', this.clearEntry.bind(this)); //run clearEntry function on click
	}

	//function to add decimals and update display. Limits decimal input to one per number set
	this.decimalOp = function(){
		var decimal = $(event.target).text()
		console.log('button pressed',decimal);
		if(this.currentInput.indexOf('.')===-1){ //check if no decimal is present
			this.currentInput[0] += decimal; //add decimal if true
		}
		this.updateDisplay();
	}
	//attached to all buttons except equals. takes input and processes them to the correct variable
	this.makeArgs = function(){
		var buttonPressed = $(event.target).text(); //assign button clicked to variable
		console.log('button pressed',buttonPressed); //log out button
		// if(this.input.operator[0]!=='' && this.input.numSet2[0]!=='' && buttonPressed === '+'||buttonPressed === '÷'||buttonPressed === '-'||buttonPressed == 'x'){ //check to see if math should be performed by an operator btn, similar to a basic four function caclulator
		// 	this.equalsFunction();
		// 	this.input.operator[0] = buttonPressed; //store operator, to be used for next operation
		// 	this.currentInput = this.input.numSet2; //set currentInput to numset2. allows equals function to operate on result and any new input
		// } else {
			if(!isNaN(parseInt(buttonPressed))){ //verify button pressed is a number, not an operator
				this.currentInput[0] += buttonPressed; 
			} else if (buttonPressed === '+'||buttonPressed === '÷'||buttonPressed === '-'||buttonPressed === 'x'){//check if button pressed was an operator
					this.input.operator[0] = buttonPressed; //store operator pressed to the operator variable
					this.currentInput = this.input.numSet2; //switch numset we are putting numbers in
			}
		// }
		this.updateDisplay();
	}

	this.equalsFunction = function(){
		if(this.input.numSet1[0]!=='' && this.input.numSet2[0]!==''){ //if both numSets are NOT empty, doMath
			this.doMath(this.input.numSet1, this.input.numSet2, this.input.operator);
		} else if(this.input.numSet1[0]==='' && this.input.numSet2[0]!==''){//if numSet1 is empty, partial operand
			this.doMath(this.input.result, this.input.numSet2, this.input.operator)
		} else if(this.input.operator[0]!=='' && this.input.numSet1[0]==='' && this.input.numSet2[0]===''){ //rollover operation, adds last result to last result if no inputs and an operator
			this.input.numSet2 = this.input.lastNumSet2; //get last numset2 and assign to current numset2
			this.doMath(this.input.result, this.input.result, this.input.operator)
		} else if(this.input.operator[0]==='' && this.input.numSet1[0]==='' && this.input.numSet2[0]===''){//operation repeat, perform last operation on result and last numset 2
			this.input.operator = this.input.lastOperator; //get last operator used and assign to current operator
			this.input.numSet2 = this.input.lastNumSet2; //get last numset2 and assign to current numset2
			this.doMath(this.input.result, this.input.numSet2, this.input.operator)
		}
	}

	this.doMath = function(number1, number2, operator){
		this.input.result = ['']; //reset result
		number1 = parseFloat(number1); 
		number2 = parseFloat(number2);
		operator = operator.join(''); //this is necessary, but why?? What is it doing?
		switch(operator){ //checks what operator was used, performs operation and stores result
			case '+':
				this.input.result = number1 + number2
				break;
			case '-':
				this.input.result = number1 - number2
				break;
			case 'x':
				this.input.result = number1 * number2
				break;
			case '÷':
				this.input.result = number1 / number2
				break;
			};
		this.updateInputs();
		this.updateDisplay();
		this.currentInput = this.input.numSet1; //reset input to numset 1 (left side of operator)
	}

	this.updateDisplay = function(){
		if(isNaN(this.input.result) || this.input.result === Infinity){ //if result is infinity, display an error
			this.$display.text('Error');
		} else if (this.input.result[0] === ''){ //if result is empty
			this.$display.text(this.input.numSet1+this.input.operator+this.input.numSet2);
		} else if (this.input.numSet1[0] === ''){ //display result and additional
			this.$display.text(this.input.result+this.input.operator+this.input.numSet2);
		} else if (this.input.result[0] !== '' && this.input.numSet1[0] !== ''){ //display for rollover functions
			this.$display.text(this.input.numSet1+this.input.operator+this.input.numSet2);
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
		this.input.result = [''];
		this.input.lastNumSet2 = [''];
		this.input.LastOperator = [''];
		this.currentInput = this.input.numSet1;
		this.clearDisplay();
	}

	this.clearEntry = function(){
		this.currentInput[0] = '';
		this.updateDisplay();
	}
}