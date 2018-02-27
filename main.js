class Model {
	constructor () {
		this.num1 = ['']; 
		this.operator = [''];
		this.num2 = ['']; 
		this.result = [''];
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
	makeArgs(buttonPressed) {
		console.log('button pressed', buttonPressed); //log button pressed
		if (!isNaN(parseInt(buttonPressed))) { //verify button pressed is a number, not an operator
			this.currentInput[0] += buttonPressed;
		}
		if (buttonPressed === '.' && this.currentInput[0].indexOf('.') === -1){ //check if no decimal is present
			this.currentInput[0] += buttonPressed; //add decimal if true
		} 
		if (this.num1[0].length > 0 && ['+', '÷', '-', 'x'].indexOf(buttonPressed) > -1) {//check if button pressed was an operator
			this.operator[0] = buttonPressed; //store operator pressed to the operator variable
			this.currentInput = this.num2; //switch num we are putting numbers in
		}
		this.lastnum2 = this.num2;
		this.lastOperator = this.operator;
		return this.giveProps();
	}
	invertValue() {
		let inverse = this.currentInput[0] * -1;
		this.currentInput[0] = inverse.toString();
		return this.giveProps();
	}
	equals() {
		if(this.num2[0].length===0){ //rollover operation, adds last result to last result if no inputs and an operator
			this.num2 = this.lastnum2; //get last num2 and assign to current num2
		} else if(!this.operator[0] && !this.num2[0]){//operation repeat, perform last operation on result and last num 2
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
				this.result[0] += num1 + num2
				break;
			case '-':
				this.result[0] += num1 - num2
				break;
			case 'x':
				this.result[0] += num1 * num2
				break;
			case '÷':
				this.result[0] += num1 / num2
				break;
			};
	}
	resetInputs() {
		this.num1 = ['']; //number set to the left of the operator
		this.operator = [''];
		this.num2 = ['']; //number set to the right of the operator
		this.result = [''];
		this.currentInput = this.num1;//set current input that can be changed, either adding to num1 or num2
	}
	clearEntry() {
		if(this.currentInput[0].length===0){
			this.currentInput = this.num1;
		}
		this.currentInput[0] = '';
		return this.giveProps();
	}
}

class View{
	constructor(){
		this.mainDisplay = $('#display');
		this.smallDisplay = $('#small-display');
		this.history = $('.history');
	}
	updateDisplay(num) {
		if(num.current[0].length>0){
			this.mainDisplay.text(num.current);
		}
	}
	updateHistory(num) {
		const { num1, op, num2, result } = num;
		if (num1[0].length > 0 && op[0].length > 0 && num2[0].length > 0 && result[0].length > 0) {
			let h5 = $('<h5>');
			h5.text(`${num1} ${op} ${num2} = ${result}`);
			this.history.append(h5)
			this.mainDisplay.text(result);
		}
	}
	clearHistory() {
		$('.history').empty();
	}
	displayToZero(){
		this.mainDisplay.text('0');
	}
	displayToResult(num){
		this.mainDisplay.text(num.result);
	}
}

class Controller{
	constructor() {
		this.calculator = new Model;
		this.display = new View;
	}
	addClickHandlers() {
		$('.num_btn').on('click', () => { 
			this.display.updateDisplay(
				this.calculator.makeArgs($(event.target).text())
			) 
		});
		$('.op_btn').on('click', () => {
			this.display.updateDisplay(
				this.calculator.makeArgs($(event.target).text())
			) 
		});
		$('.plus_minus').on('click', () => {
			this.display.updateDisplay(
				this.calculator.invertValue()
			)
		});
		$('#equal_btn').on('click', () => {
			this.display.updateHistory(
				this.calculator.equals()
			);
			this.calculator.resetInputs();
			// this.display.displayToZero();
		});
		$('#clear_btn').on('click', () => {
			this.calculator.resetInputs(); 
			this.display.displayToZero() ;
		});
		$('#clearEntry_btn').on('click', () => {
			this.calculator.clearEntry();
			this.display.displayToZero();
		});
		$('.clear_history').on('click', () => {
			this.display.clearHistory();
		});
	}
}

$(document).ready(() => {
	let input = new Controller;
	input.addClickHandlers();
}
)