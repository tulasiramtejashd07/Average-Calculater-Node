/**
 * AverageService - Business logic for the Running Average Calculator.
 *
 * Stores submitted numbers in an in-memory array and provides methods
 * to add a number and retrieve running statistics (average, count, sum).
 *
 * Data resets when the server restarts because no database is used.
 */
class AverageService {
  constructor() {
    /** @type {number[]} In-memory array of all submitted numbers */
    this.numbers = [];
  }

  /**
   * Add a number and return the updated running statistics.
   *
   * @param {number} num - The number to add.
   * @returns {{ average: number, count: number, sum: number }} Updated stats.
   */
  addNumber(num) {
    this.numbers.push(num);

    const count = this.numbers.length;
    const sum = this.numbers.reduce((acc, val) => acc + val, 0);
    const average = sum / count;

    return { average, count, sum };
  }

  /**
   * Get the current running statistics without adding a number.
   *
   * @returns {{ average: number, count: number, sum: number }} Current stats.
   */
  getStats() {
    const count = this.numbers.length;

    if (count === 0) {
      return { average: 0, count: 0, sum: 0 };
    }

    const sum = this.numbers.reduce((acc, val) => acc + val, 0);
    const average = sum / count;

    return { average, count, sum };
  }

  /**
   * Get the list of all submitted numbers.
   *
   * @returns {number[]} Copy of the submitted numbers array.
   */
  getNumbers() {
    return [...this.numbers];
  }

  /**
   * Reset all stored data. Useful for testing.
   */
  reset() {
    this.numbers = [];
  }
}

module.exports = AverageService;
