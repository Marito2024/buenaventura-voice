export const generateBingoCard = () => {
  const numbers: (number | null)[][] = Array(3).fill(null).map(() => Array(9).fill(null));
  const usedNumbers = new Set<number>();
  
  // Generate numbers for each row ensuring exactly 5 numbers per row
  for (let row = 0; row < 3; row++) {
    let numbersInRow = 0;
    const availableColumns = Array.from({length: 9}, (_, i) => i);
    
    // Add exactly 5 numbers per row
    while (numbersInRow < 5) {
      const randomColumnIndex = Math.floor(Math.random() * availableColumns.length);
      const col = availableColumns[randomColumnIndex];
      
      // Calculate range for this column
      const min = col * 10;
      const max = col === 8 ? 90 : (col + 1) * 10 - 1;
      let num;
      
      // Generate unique number for this column
      do {
        num = Math.floor(Math.random() * (max - min + 1)) + min;
      } while (usedNumbers.has(num));
      
      numbers[row][col] = num;
      usedNumbers.add(num);
      numbersInRow++;
      availableColumns.splice(randomColumnIndex, 1);
    }
  }

  // Sort numbers within each column
  for (let col = 0; col < 9; col++) {
    const columnNumbers = numbers.map(row => row[col]).filter(num => num !== null);
    columnNumbers.sort((a, b) => (a || 0) - (b || 0));
    
    let numberIndex = 0;
    for (let row = 0; row < 3; row++) {
      if (numbers[row][col] !== null) {
        numbers[row][col] = columnNumbers[numberIndex++];
      }
    }
  }

  // Ensure last column is not empty
  let lastColumnEmpty = true;
  for (let row = 0; row < 3; row++) {
    if (numbers[row][8] !== null) {
      lastColumnEmpty = false;
      break;
    }
  }

  if (lastColumnEmpty) {
    // Force at least one number in the last column
    const randomRow = Math.floor(Math.random() * 3);
    let emptyColumn = -1;
    
    // Find a column with numbers that we can empty
    for (let col = 0; col < 8; col++) {
      if (numbers[randomRow][col] !== null) {
        emptyColumn = col;
        break;
      }
    }

    if (emptyColumn !== -1) {
      // Move a number from the found column to the last column
      const num = numbers[randomRow][emptyColumn];
      numbers[randomRow][emptyColumn] = null;
      numbers[randomRow][8] = num;
    }
  }

  return numbers;
};