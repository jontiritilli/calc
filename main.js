class Model {
	constructor () {
		this.num1 = ['0'];
		this.num2 = [''];
		this.operator = [''];
		this.result = [''];
		this.lastnum2 = [''];
		this.lastOperator =[''];
		this.lastResult = [''];
		this.currentInput = this.num1;
		this.error = [''];
	}
	giveProps() {
		return {
			result: this.result,
			current: this.currentInput,
			num1: this.num1,
			num2: this.num2,
			op: this.operator,
			error: this.error
		}
	}
	makeArgs(buttonPressed) {
		if (this.num1[0] === '0'){
			this.num1[0] = '';
		}
		if (!isNaN(parseInt(buttonPressed))) { //verify pressed number
			this.currentInput[0] += buttonPressed;
		}
		if (buttonPressed === '.' && this.currentInput[0].indexOf('.') === -1){
			this.currentInput[0] += buttonPressed;
		}
		if (['+', '÷', '/', '-', '×', 'x'].indexOf(buttonPressed) > -1) { //verify operator btn press
			this.operator[0] = buttonPressed;
			this.currentInput = this.num2;
		}
		return this.giveProps();
	}
	invertValue() {
		if (this.currentInput[0] !== ''){
			let inverse = this.currentInput[0] * -1;
			this.currentInput[0] = inverse.toString();
		}
		return this.giveProps();
	}
	equals() {
		if (this.operator[0] && !this.num2[0]) { //set up rollover operation, repeat last operation on result
			this.num2[0] = this.lastResult[0] || this.num1[0];
		}
		if (!this.operator[0] && !this.num2[0] && this.lastResult[0]) { //set up operation repeat, perform last operation on result and lastNum2
			this.num1[0] = this.lastResult[0] || '0';
			this.operator[0] = this.lastOperator[0];
			this.num2[0] = this.lastnum2[0];
		}
		if (!this.num1[0] && this.operator[0] && this.num2[0]) { //add to last result/subsequent operations
			this.num1[0] = this.lastResult[0] || '0';
		}
		if(['÷', '/'].indexOf(this.operator[0]) > -1 && this.num2[0] === '0'){
			this.error[0] = 'cannot divide by zero';
			return this.giveProps();
		}
		if(this.num1[0] && this.num2[0] && this.operator[0]){
			this.doMath(this.num1[0], this.num2[0], this.operator[0]);
			return this.giveProps();
		}
		return this.giveProps();
	}
	doMath(num1, num2, op){ //
		num1 = parseFloat(num1);
		num2 = parseFloat(num2);
		switch(op){
			case '+':
				this.result[0] += num1 + num2
				break;
			case '-':
				this.result[0] += num1 - num2
				break;
			case '×':
				this.result[0] += num1 * num2
				break;
			case 'x':
				this.result[0] += num1 * num2
				break;
			case '÷':
				this.result[0] += num1 / num2
				break;
			case '/':
				this.result[0] += num1 / num2
				break;
			};
		this.lastResult = this.result;
		this.lastnum2 = this.num2;
		this.lastOperator = this.operator;
	}
	resetInputs(response) {
		if(response === true){
			this.num1 = ['0'];
			this.operator = [''];
			this.num2 = [''];
			this.result = [''];
			this.currentInput = this.num1;
			this.error = [''];
			return this.giveProps();
		}
	}
	clearEntry() {
		if (this.currentInput[0] && this.currentInput === this.num2){
			this.currentInput[0] = '';
			this.currentInput = this.num1;
			return this.giveProps();
		}
		this.currentInput[0] = '0';
		return this.giveProps()
	}
}

class View {
	constructor(){
		this.mainDisplay = $('#display');
		this.historyDOM = $('.history');
		this.historyArray = new Array
	}
	updateDisplay(num) {
		if(num.current[0]){
			this.mainDisplay.text(num.current);
		}
	}
	addToHistory(num) {
		let { num1, op, num2, result } = num;
		num1[0] = this.roundHistoryNum(num1[0]);
		num2[0] = this.roundHistoryNum(num2[0]);
		result[0] = this.roundHistoryNum(result[0]);
		if (num1[0] && op[0] && num2[0] && result[0]) {
			this.historyArray.push(`${num1} ${op} ${num2} = ${result}`);
		}
	}
	printHistory(historyArr){
		for(let histInd = 0; histInd < historyArr.length; histInd++){
			let p = $('<p>', {
				class: 'history_item'
			});
			let span = $('<span>', {
				class: 'history_divider'
			});
			p.text(historyArr[histInd]);
			this.historyDOM.append(span, p);
		}
	}
	historyScrollTop(){
		this.historyDOM.animate({scrollTop: 0}, {duration: 10})
	}
	clearHistory(clearArr) {
		if(clearArr){
			this.historyArray = new Array;
		}
		this.historyDOM.empty();
	}
	roundHistoryNum(num) {
		if (num.length > 8) {
			num = parseFloat(num)
			return String(Number(num.toPrecision(10)));
		}
		return num
	}
	roundDisplayNum(num){
		if(num.length>10){
			num = parseFloat(num)
			return String(Number(num.toPrecision(10)));
		}
		return num
	}
	displayResult(num){
		if(num.error[0]){
			this.mainDisplay.text(num.error);
			return true;
		}
		if(num.result[0]){
			this.mainDisplay.text(this.roundDisplayNum(num.result[0]));
			this.addToHistory(num);
			this.clearHistory(false);
			this.printHistory(this.historyArray);
			this.historyScrollTop();
			return true
		}
		if(!num.result[0] && !num.error[0]){
			return false;
		}
	}
}

class Controller {
	constructor() {
		this.calculator = new Model;
		this.display = new View;
	}
	handleKeyPress(e) {
		if(e.which==13){
			this.calculator.resetInputs(
				this.display.displayResult(
					this.calculator.equals()
				)
			);
		}
		this.display.updateDisplay(
			this.calculator.makeArgs(String.fromCharCode(e.which))
		)
		return
	}
	addClickHandlers() {
		$('.num_btn').on('click', (event) => {
			this.display.updateDisplay(
				this.calculator.makeArgs($(event.target).text())
			)
		});
		$('.op_btn').on('click', (event) => {
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
			this.calculator.resetInputs(
				this.display.displayResult(
					this.calculator.equals()
				)
			);
		});
		$('#clear_btn').on('click', () => {
			this.calculator = new Model;
			this.display.updateDisplay(
				this.calculator.resetInputs(true)
			);
		});
		$('#clearEntry_btn').on('click', () => {
			this.display.updateDisplay(
				this.calculator.clearEntry());
		});
		$('.clear_history').on('click', () => {
			this.display.clearHistory(true);
		});
	}
}

$(document).ready(() => {
	let input = new Controller;
	input.addClickHandlers();
	document.onkeypress = (e) => {
		input.handleKeyPress(e);
	}
})
