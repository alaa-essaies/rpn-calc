import React, { useState } from 'react';

// Function to evaluate the RPN expression
export const evaluateRPN = (expr: string) => {
    const stack: number[] = [];
    const tokens = expr.trim().split(/\s+/);  // Split the expression by whitespace
    const stepsList: string[] = [];  // To store each step of the calculation

    for (const token of tokens) {
        if (!isNaN(parseFloat(token))) {
            stack.push(parseFloat(token)); // If it's a number, push it to the stack
            stepsList.push(`Input: ${token} → Stack: [${stack.join(', ')}]`);
        } else {
            const b = stack.pop(); // Pop the top value
            let result: number;

            switch (token) {
                case '+':
                    const aAdd = stack.pop();
                    if (aAdd === undefined || b === undefined) {
                        return 'Error: Not enough values';
                    }
                    result = aAdd + b;
                    stack.push(result);
                    stepsList.push(`Input: ${token} → Pop ${aAdd} and ${b}, push ${result} → Stack: [${stack.join(', ')}]`);
                    break;
                case '-':
                    const aSub = stack.pop();
                    if (aSub === undefined || b === undefined) {
                        return 'Error: Not enough values';
                    }
                    result = aSub - b;
                    stack.push(result);
                    stepsList.push(`Input: ${token} → Pop ${aSub} and ${b}, push ${result} → Stack: [${stack.join(', ')}]`);
                    break;
                case '*':
                    const aMul = stack.pop();
                    if (aMul === undefined || b === undefined) {
                        return 'Error: Not enough values';
                    }
                    result = aMul * b;
                    stack.push(result);
                    stepsList.push(`Input: ${token} → Pop ${aMul} and ${b}, push ${result} → Stack: [${stack.join(', ')}]`);
                    break;
                case '/':
                    const aDiv = stack.pop();
                    if (aDiv === undefined || b === undefined) {
                        return 'Error: Not enough values';
                    }
                    if (b === 0) {
                        return 'Error: Cannot divide by zero';
                    }
                    result = b !== 0 ? aDiv / b : NaN;
                    stack.push(result);
                    stepsList.push(`Input: ${token} → Pop ${aDiv} and ${b}, push ${result} → Stack: [${stack.join(', ')}]`);
                    break;
                case 'x²':
                    if (b === undefined) {
                        return 'Error: Not enough values'; // x² requires one value
                    }
                    result = b * b; // Square the value
                    stack.push(result); // Push the result back to the stack
                    stepsList.push(`Input: ${token} → Pop ${b}, push ${result} → Stack: [${stack.join(', ')}]`);
                    break;
                default:
                    return 'Error: Unknown operator';
            }
        }
    }

    return stack.length === 1 ? { result: stack[0], steps: stepsList } : 'Error: Too many values';
};

const RPNCalculator: React.FC = () => {
    const [expression, setExpression] = useState<string>('');  // Stores the entire input expression
    const [result, setResult] = useState<number | string>(''); // Stores the result
    const [history, setHistory] = useState<string[]>([]);      // Track history of expressions and results
    const [steps, setSteps] = useState<string[]>([]);          // Track detailed steps of calculation

    // Function to handle button press (numbers and operators)
    const handleButtonPress = (value: string) => {
        if (/\d/.test(value)) {
            setExpression(expression + value); // Add to the expression directly
        } else if (value === 'Enter') {
            setExpression(expression + ' ');
        } else {
            setExpression(expression + ' ' + value + ' '); // Add operator with spaces for proper parsing
        }
    };

    // Function to handle calculation when the "Calculate" button is pressed
    const handleCalculate = () => {
        if (expression.trim() === '') {
            setResult('Error: No input');
            return;
        }

        const evaluation = evaluateRPN(expression);
        if (typeof evaluation === 'string') {
            setResult(evaluation);
            setSteps([]); // Clear steps if there was an error
        } else {
            setResult(evaluation.result);
            setSteps(evaluation.steps);
            setHistory([...history, `${expression.trim()} = ${evaluation.result}`]); // Add expression to history
        }
        setExpression(''); // Clear the expression after calculation
    };

    // Clears the input, result, and history
    const handleClear = () => {
        setExpression('');
        setResult('');
        setHistory([]);
        setSteps([]);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
                <div className="mb-4">
                    <h1 className="text-3xl font-bold text-center mb-4">RPN Calculator</h1>
                    <div className="border p-2 text-right text-xl bg-gray-50" data-testid="rpn-display">
                        {expression || result || '0'}
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-4">
                    {/* Number Buttons */}
                    {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0'].map((num) => (
                        <button
                            key={num}
                            className="p-4 bg-gray-200 hover:bg-gray-300 rounded"
                            onClick={() => handleButtonPress(num)}
                        >
                            {num}
                        </button>
                    ))}

                    {/* Enter Button */}
                    <button
                        className="p-4 bg-gray-300 hover:bg-gray-400 rounded"
                        onClick={() => handleButtonPress('Enter')}
                    >
                        Enter
                    </button>

                    {/* Operator Buttons */}
                    {['+', '-', '*', '/', 'x²'].map((op) => (
                        <button
                            key={op}
                            className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded"
                            onClick={() => handleButtonPress(op)}
                        >
                            {op}
                        </button>
                    ))}

                    {/* Calculate and Clear Buttons */}
                    <button
                        className="col-span-2 p-4 bg-green-500 hover:bg-green-600 text-white rounded"
                        onClick={handleCalculate}
                    >
                        Calculate
                    </button>
                    <button
                        className="col-span-2 p-4 bg-red-500 hover:bg-red-600 text-white rounded"
                        onClick={handleClear}
                    >
                        Clear
                    </button>
                </div>

                {/* Steps History */}
                <div className="border-t mt-4 pt-4">
                    <h2 className="text-xl font-bold mb-2">Calculation Steps</h2>
                    <ul className="list-disc list-inside text-left">
                        {steps.length > 0 ? (
                            steps.map((step, index) => <li key={index}>{step}</li>)
                        ) : (
                            <li>No steps yet</li>
                        )}
                    </ul>
                </div>

                {/* History */}
                <div className="border-t mt-4 pt-4">
                    <h2 className="text-xl font-bold mb-2">History</h2>
                    <ul className="list-disc list-inside text-left">
                        {history.length > 0 ? (
                            history.map((entry, index) => <li key={index}>{entry}</li>)
                        ) : (
                            <li>No history yet</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default RPNCalculator;
