class Model {
	constructor () {
		this.num1 = ['']; 
		this.operator = [''];
		this.num2 = ['']; 
		this.result = [''];
		this.mathDone = false;
		this.currentInput = this.num1;
	}
	giveProps() {
		return {
			result: this.result,
			current: this.currentInput,
			num1: this.num1,
			num2: this.num2,
			op: this.operator
		}
	}
	decimalOp(decimal) {
		console.log('button pressed',decimal);
		if(this.currentInput.indexOf('.')===-1){ //check if no decimal is present
			this.currentInput.concat(decimal); //add decimal if true
		}
		return this.giveProps();
	}
	makeArgs(buttonPressed) {
		console.log('button pressed', buttonPressed); //log button pressed
		if (!this.operator && !this.num2 && ['+', '÷', '-', 'x'].indexOf(buttonPressed) > -1) { //check to see if equals function should be performed by an operator btn
			this.equals();
			this.operator[0] += buttonPressed; //store operator, to be used for next operation
			this.currentInput = this.num2; //set currentInput to num2. allows equals function to operate on result and any new input
		} else {
			if (!isNaN(parseInt(buttonPressed))) { //verify button pressed is a number, not an operator
				this.mathDone = false;
				this.currentInput[0] += buttonPressed;
			} else if (['+', '÷', '-', 'x'].indexOf(buttonPressed) > -1) {//check if button pressed was an operator
				this.operator[0] += buttonPressed; //store operator pressed to the operator variable
				this.currentInput = this.num2; //switch num we are putting numbers in
			}
		}
		return this.giveProps();
	}	
	equals() {
		if(this.mathDone === true && this.operator && this.num2){ //rollover operation, adds last result to last result if no inputs and an operator
			this.num2 = this.lastnum2; //get last num2 and assign to current num2
		} else if(this.mathDone === true && !this.operator && !this.num2){//operation repeat, perform last operation on result and last num 2
			this.operator = this.lastOperator; //get last operator used and assign to current operator
			this.num2 = this.lastnum2; //get last num2 and assign to current num2
		}
		this.doMath(this.num1, this.num2, this.operator);
		return this.giveProps();
	}
	doMath(number1, number2, operator){
		let num1 = parseFloat(number1); 
		let num2 = parseFloat(number2);
		let op = operator.toString();
		switch(op){ //checks what operator was used, performs operation and stores result
			case '+':
				this.result = num1 + num2
				break;
			case '-':
				this.result = num1 - num2
				break;
			case 'x':
				this.result = num1 * num2
				break;
			case '÷':
				this.result = num1 / num2
				break;
			};
	}
	// updateInputs() {
	// 	this.lastnum2 = this.num2;
	// 	this.lastOperator = this.operator;
	// 	// this.num1 = [''];
	// 	this.num2 = [''];
	// 	this.operator = [''];
	// }
	resetInputs() {
		this.num1 = ['']; //number set to the left of the operator
		this.operator = [''];
		this.num2 = ['']; //number set to the right of the operator
		this.mathDone = false;
		this.currentInput = this.num1;//set current input that can be changed, either adding to num1 or num2
	}
	clearEntry() {
		this.currentInput = [''];
		this.currentInput = this.num1;
	}
}

class View{
	constructor(){
		this.mainDisplay = $('#display');
		this.smallDisplay = $('#small-display');
		this.history = $('.history');
	}
	updateDisplay(num) {
		let number = parseInt(num.current);
		if(number && !isNaN(number)){
			this.mainDisplay.text(number)
		}
	}
	updateHistory(num) {
		const { num1, op, num2, result } = num;
		// let lastCalc = this.smallDisplay.text(`${num1} ${op} ${num2} = ${result}`);
		let div = $('<div>');
		div.addClass('col-12 text-center');
		div.append(span.text(`${num1} ${op} ${num2} = ${result}`)).append
		this.history.append(div)
	}
	addToHistory(calc){
	}
	displayToZero(){
		this.mainDisplay.text('0');
	}
}

class Controller{
	constructor() {
		this.calculator = new Model;
		this.display = new View;
		this.num_btn = $('.num_btn');
		this.op_btn = $('.op_btn');
		this.decimal_btn = $('#decimal_btn');
		this.equal_btn = $('#equal_btn');
		this.clear_btn = $('#clear_btn');
		this.clearEntry_btn = $('#clearEntry_btn');
	}
	addClickHandlers() {
		this.num_btn.on('click', () => { 
			this.display.updateDisplay(
				this.calculator.makeArgs($(event.target).text())
			) 
		}); //run makeArgs on number btn clicks
		this.op_btn.on('click', () => { 
			this.display.updateDisplay(
				this.calculator.makeArgs($(event.target).text())
			) 
		}); //run makeArgs on operator btn clicks
		this.decimal_btn.on('click', () => { 
			this.display.updateDisplay(
				this.calculator.decimalOp($(event.target).text())
			) 
		}); //run decimalOp on decimal btn clicks
		this.equal_btn.on('click', () => { 
			this.display.updateHistory(
				this.calculator.equals()
			);
			this.calculator.resetInputs();
			this.display.displayToZero();
		}); //run equals function on equalbtn click
		this.clear_btn.on('click', () => { 
			this.calculator.resetInputs(); 
			this.display.displayToZero() ;
		}); //run clear function on click
		this.clearEntry_btn.on('click', () => { 
			this.calculator.clearEntry();
			this.display.displayToZero();
		}); //run clearEntry function on click
	}
}

$(document).ready(() => {
	let input = new Controller;
	input.addClickHandlers();
}
)