import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import RPNCalculator,{evaluateRPN}  from '../RPNCalculator';


describe('evaluateRPN function', () => {
  test('evaluates a simple addition expression', () => {
    const expression = '3 4 +';
    const result = evaluateRPN(expression);
    expect(result).toEqual({
      result: 7,
      steps: [
        'Input: 3 → Stack: [3]',
        'Input: 4 → Stack: [3, 4]',
        'Input: + → Pop 3 and 4, push 7 → Stack: [7]',
      ],
    });
  });

  test('returns error for unknown operator', () => {
    const expression = '5 7 x';  
    const result = evaluateRPN(expression);
    expect(result).toBe('Error: Unknown operator');
  });

  test('handles insufficient values for an operator', () => {
    const expression = '5 +';  
    const result = evaluateRPN(expression);
    expect(result).toBe('Error: Not enough values');
  });

  test('handles too many values', () => {
    const expression = '3 4 5 +';  
    const result = evaluateRPN(expression);
    expect(result).toBe('Error: Too many values');
  });

  test('handles division by zero', () => {
    const expression = '10 0 /';  
    const result = evaluateRPN(expression);
    expect(result).toBe('Error: Cannot divide by zero');
  });

  test('handles square operation', () => {
    const expression = '5 x²';
    const result = evaluateRPN(expression);
    expect(result).toEqual({
      result: 25,
      steps: [
        'Input: 5 → Stack: [5]',
        'Input: x² → Pop 5, push 25 → Stack: [25]',
      ],
    });
  });
});

describe('RPNCalculator', () => {
  beforeEach(() => {
    render(<RPNCalculator />);
  });

  test('renders the calculator', () => {
    expect(screen.getByText(/RPN Calculator/i)).toBeInTheDocument();
  });

  test('displays initial value of 0', () => {
    expect(screen.getByTestId('rpn-display')).toBeInTheDocument();
  });

  test('correctly evaluates a simple expression', () => {
    fireEvent.click(screen.getByText('7'));
    fireEvent.click(screen.getByText('Enter')); // Simulate space input
    fireEvent.click(screen.getByText('9'));
    fireEvent.click(screen.getByText('Enter'));
    fireEvent.click(screen.getByText('/'));
    fireEvent.click(screen.getByText('Calculate'));

    expect(screen.getByTestId('rpn-display').textContent).toEqual("0.7777777777777778")
  });

  test('correctly evaluates a simple expression with composed numbers', () => {
    //[73 9 /] 
    fireEvent.click(screen.getByText('7'));
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByText('Enter')); // Simulate space input
    fireEvent.click(screen.getByText('9'));
    fireEvent.click(screen.getByText('Enter'));
    fireEvent.click(screen.getByText('/'));
    fireEvent.click(screen.getByText('Calculate'));

    expect(screen.getByTestId('rpn-display').textContent).toEqual("8.11111111111111")
  });

  test('handles division by 0 error', () => {
    //[73 9 /] 
    fireEvent.click(screen.getByText('7'));
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByText('Enter')); // Simulate space input
    fireEvent.click(screen.getByText('0'));
    fireEvent.click(screen.getByText('Enter'));
    fireEvent.click(screen.getByText('/'));
    fireEvent.click(screen.getByText('Calculate'));

    expect(screen.getByTestId('rpn-display').textContent).toEqual("Error: Cannot divide by zero")
  });

  test('handles multiple operations correctly', () => {
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('Enter'));
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('Enter'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('Enter'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('4'));
    fireEvent.click(screen.getByText('Enter'));
    fireEvent.click(screen.getByText('*'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByText('Enter'));
    fireEvent.click(screen.getByText('-'));
    fireEvent.click(screen.getByText('Calculate'));

    expect(screen.getByTestId('rpn-display').textContent).toEqual("14")
  });

  // test('handles error for unknown operators', () => {
  //   fireEvent.click(screen.getByText('5'));
  //   fireEvent.click(screen.getByText('Enter'));
  //   fireEvent.click(screen.getByText('7'));
  //   fireEvent.click(screen.getByText('Enter'));
  //   // fireEvent.click(screen.getByText('x')); // Unknown operator
  //   fireEvent.click(screen.getByText('Calculate'));

  //   expect(screen.getByText(/Error: Unknown operator/i)).toBeInTheDocument();
  // });

  test('handles error for not enough values', () => {
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('Enter'));
    fireEvent.click(screen.getByText('+')); // Not enough values
    fireEvent.click(screen.getByText('Calculate'));

    expect(screen.getByText(/Error: Not enough values/i)).toBeInTheDocument();
  });

  test('clears input, result, and history', () => {
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('Enter'));
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByText('Enter'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('Calculate'));

    expect(screen.getByTestId('rpn-display').textContent).toEqual("8")

    fireEvent.click(screen.getByText('Clear'));

    expect(screen.getByTestId('rpn-display').textContent).toEqual("0")
    expect(screen.getByText(/No history yet/i)).toBeInTheDocument();
  });

  test('tracks calculation steps correctly', () => {
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('Enter'));
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('Enter'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('Enter'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('Calculate'));

    expect(screen.getByText(/Input: 2 → Stack: \[5, 1, 2\]/i)).toBeInTheDocument();
    expect(screen.getByText("Input: + → Pop 1 and 2, push 3 → Stack: [5, 3]")).toBeInTheDocument();
    expect(screen.getByTestId('rpn-display').textContent).toEqual("8")

  });

  test('calculates square of a number', () => {
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('Enter'));
    fireEvent.click(screen.getByText('x²'));
    fireEvent.click(screen.getByText('Calculate'));
    expect(screen.getByTestId('rpn-display').textContent).toEqual("25")
  });
});
