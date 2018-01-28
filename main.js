class Calculator {
	constructor () {
		this.input = new Input;
		this.display = new Display;
		this.numSet1 = ['']; //number set to the left of the operator
		this.operator = [''];
		this.numSet2 = ['']; //number set to the right of the operator
		this.mathDone = false;
		this.currentInput = this.numSet1;//set current input that can be changed, either adding to numSet1 or numSet2
	}

	addClickHandlers() {
		this.input.num_btn.on('click', () => { this.makeArgs(); this.display.updateDisplay() }); //run makeArgs on number btn clicks
		this.input.op_btn.on('click', () => { this.makeArgs(); this.display.updateDisplay() }); //run makeArgs on operator btn clicks
		this.input.decimal_btn.on('click', () => { this.decimalOp(); this.display.updateDisplay() }); //run decimalOp on decimal btn clicks
		this.input.equal_btn.on('click', () => { this.equals(); this.display.updateDisplay() }); //run equals function on equalbtn click
		this.input.clear_btn.on('click', () => { this.resetInputs(); this.display.displayToZero() }); //run clear function on click
		this.input.clearEntry_btn.on('click', () => { this.clearEntry(); this.display.updateDisplay() }); //run clearEntry function on click
	}

	//function to add decimals and update display. Limits decimal input to one per number set
	decimalOp() {
		let decimal = $(event.target).text()
		console.log('button pressed',decimal);
		if(this.currentInput.indexOf('.')===-1){ //check if no decimal is present
			this.currentInput.concat(decimal); //add decimal if true
		}
	}
	//attached to all buttons except equals. takes input and processes them to the correct variable
	makeArgs() {
		let buttonPressed = $(event.target).text(); //assign button clicked to variable
		console.log('button pressed',buttonPressed); //log out button
		if (!this.operator && !this.numSet2 && ['+', '÷', '-', 'x'].indexOf(buttonPressed) > -1){ //check to see if equals function should be performed by an operator btn
			this.equals();
			this.operator[0] += buttonPressed; //store operator, to be used for next operation
			this.currentInput = this.numSet2; //set currentInput to numset2. allows equals function to operate on result and any new input
		} else {
			if(!isNaN(parseInt(buttonPressed))){ //verify button pressed is a number, not an operator
				this.mathDone = false;
				this.currentInput[0] += buttonPressed; 
			} else if (['+', '÷', '-', 'x'].indexOf(buttonPressed)> -1){//check if button pressed was an operator
					this.operator[0] += buttonPressed; //store operator pressed to the operator variable
					this.currentInput = this.numSet2; //switch numset we are putting numbers in
			}
		}
	}

	equals() {
		if(this.mathDone === false && this.numSet2){ //if both numSets are NOT empty, doMath
			this.doMath(this.numSet1, this.numSet2, this.operator);
		} else if(this.mathDone === true && this.numSet2){//if numSet1 is empty, partial operand
			this.doMath(this.numSet1, this.numSet2, this.operator)
		} else if(this.mathDone === true && this.operator && this.numSet2){ //rollover operation, adds last result to last result if no inputs and an operator
			this.numSet2 = this.lastNumSet2; //get last numset2 and assign to current numset2
			this.doMath(this.numSet1, this.numSet1, this.operator)
		} else if(this.mathDone === true && !this.operator && !this.numSet2){//operation repeat, perform last operation on result and last numset 2
			this.operator = this.lastOperator; //get last operator used and assign to current operator
			this.numSet2 = this.lastNumSet2; //get last numset2 and assign to current numset2
			this.doMath(this.numSet1, this.numSet2, this.operator)
		}
	}

	doMath(number1, number2, operator){
		let num1 = parseFloat(number1); 
		let num2 = parseFloat(number2);
		let op = operator.toString();
		switch(op){ //checks what operator was used, performs operation and stores result
			case '+':
				this.numSet1 = num1 + num2
				break;
			case '-':
				this.numSet1 = num1 - num2
				break;
			case 'x':
				this.numSet1 = num1 * num2
				break;
			case '÷':
				this.numSet1 = num1 / num2
				break;
			};
		this.mathDone = true;
		this.updateInputs();
		this.currentInput = this.numSet1; //reset input to numset 1 (left side of operator)
	}
	updateInputs() {
		this.lastNumSet2 = this.numSet2;
		this.lastOperator = this.operator;
		// this.input.numSet1 = [''];
		this.numSet2 = [''];
		this.operator = [''];
	}
	resetInputs() {
		this.numSet1 = ['']; //number set to the left of the operator
		this.operator = [''];
		this.numSet2 = ['']; //number set to the right of the operator
		this.mathDone = false;
		this.currentInput = this.numSet1;//set current input that can be changed, either adding to numSet1 or numSet2
	}
}

class Display{
	constructor(){
		this.$display = $('#display'); 
	}
	updateDisplay() {
		if (isNaN(calculator.numSet1) || calculator.numSet1 === Infinity){ //if result is infinity, display an error
			this.$display.text('Error');
		// } else if (this.input.numSet1[0] === ''){ //if result is empty
		// 	this.$display.text(this.input.numSet1+this.input.operator+this.input.numSet2);
		} else if (calculator.numSet1){ //display result and additional
			this.$display.text(calculator.numSet1 + calculator.operator + calculator.numSet2);
		} else if (!calculator.numSet1 && !calculator.numSet1){ //display for rollover functions
			this.$display.text(calculator.numSet1 + calculator.operator + calculator.numSet2);
		}
	}

	displayToZero(){
		this.$display.text('0');
	}

	clear(){
		calculator = new Calculator();
		this.displayToZero();
	}

	clearEntry(){
		Calculator.currentInput = [];
		this.updateDisplay();
	}
}

class Input{
	constructor() {
		this.clear_btn = $('#clear_btn');
		this.clearEntry_btn = $('#clearEntry_btn');
		this.equal_btn = $('#equal_btn');
		this.num_btn = $('.num_btn');
		this.op_btn = $('.op_btn');
		this.decimal_btn = $('#decimal_btn');
	}
}

$(document).ready(() => {
	calculator = new Calculator();
	display = new Display(calculator)
	calculator.addClickHandlers();
}
)