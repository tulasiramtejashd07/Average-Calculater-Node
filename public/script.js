/**
 * Frontend Script for the Running Average Calculator.
 *
 * Communicates with the backend POST /average API using the Fetch API.
 * Updates the UI with statistics and number history.
 */
(function () {
  'use strict';

  // --- DOM Elements ---
  const form = document.getElementById('number-form');
  const numberInput = document.getElementById('number-input');
  const submitBtn = document.getElementById('submit-btn');
  const formMessage = document.getElementById('form-message');
  const statusBar = document.getElementById('status-bar');
  const statAverage = document.getElementById('stat-average');
  const statCount = document.getElementById('stat-count');
  const statSum = document.getElementById('stat-sum');
  const historyList = document.getElementById('history-list');
  const historyEmpty = document.getElementById('history-empty');

  /** @type {number[]} Local copy of submitted numbers for the history list */
  const submittedNumbers = [];

  // --- Check Backend Connection on Page Load ---
  checkConnection();

  // --- Form Submit Handler ---
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearMessage();

    const rawValue = numberInput.value.trim();

    // Basic frontend validation (the backend also validates)
    if (rawValue === '') {
      showMessage('Please enter a number.', 'error');
      return;
    }

    const num = Number(rawValue);

    if (!Number.isFinite(num)) {
      showMessage('Please enter a valid finite number.', 'error');
      return;
    }

    // Disable button while request is in flight
    submitBtn.disabled = true;

    try {
      const response = await fetch('/average', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number: num })
      });

      const data = await response.json();

      if (!response.ok) {
        // Backend returned an error
        showMessage(data.error || 'Something went wrong.', 'error');
        return;
      }

      // Update statistics display
      statAverage.textContent = formatNumber(data.average);
      statCount.textContent = data.count;
      statSum.textContent = formatNumber(data.sum);

      // Update history
      submittedNumbers.push(num);
      renderHistory();

      // Clear input and show success
      numberInput.value = '';
      showMessage(`Number ${num} submitted successfully.`, 'success');

      // Update status bar
      setStatus('connected', '✅ Backend connected — data updated.');
    } catch (error) {
      showMessage('Could not reach the server. Is it running?', 'error');
      setStatus('error', '❌ Cannot connect to backend.');
    } finally {
      submitBtn.disabled = false;
      numberInput.focus();
    }
  });

  // --- Helper Functions ---

  /**
   * Check if the backend is reachable by sending a test request.
   */
  async function checkConnection() {
    try {
      const res = await fetch('/average', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number: 0 })
      });

      if (res.ok) {
        setStatus('connected', '✅ Backend connected and ready.');
        // Clean up: the 0 was added, so stats will show count: 1
        // We accept this small side-effect for a real connection check.
        const data = await res.json();
        statAverage.textContent = formatNumber(data.average);
        statCount.textContent = data.count;
        statSum.textContent = formatNumber(data.sum);
        submittedNumbers.push(0);
        renderHistory();
      } else {
        setStatus('disconnected', '⚠️ Backend responded with an error.');
      }
    } catch {
      setStatus('error', '❌ Cannot connect to backend. Start the server first.');
    }
  }

  /**
   * Set the status bar state.
   *
   * @param {'connected'|'disconnected'|'error'} type - Status type.
   * @param {string} message - Status message text.
   */
  function setStatus(type, message) {
    statusBar.className = 'status-bar status-' + type;
    statusBar.textContent = message;
  }

  /**
   * Show a message below the form.
   *
   * @param {string} text - Message text.
   * @param {'success'|'error'} type - Message type.
   */
  function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = 'form-message ' + type;
  }

  /** Clear the form message. */
  function clearMessage() {
    formMessage.textContent = '';
    formMessage.className = 'form-message';
  }

  /** Render the number history list (newest first). */
  function renderHistory() {
    historyEmpty.style.display = submittedNumbers.length === 0 ? 'block' : 'none';
    historyList.innerHTML = '';

    // Show newest numbers first
    for (let i = submittedNumbers.length - 1; i >= 0; i--) {
      const li = document.createElement('li');
      li.innerHTML =
        '<span>' + submittedNumbers[i] + '</span>' +
        '<span class="history-index">#' + (i + 1) + '</span>';
      historyList.appendChild(li);
    }
  }

  /**
   * Format a number for display (remove unnecessary trailing zeros).
   *
   * @param {number} num - Number to format.
   * @returns {string} Formatted number string.
   */
  function formatNumber(num) {
    if (Number.isInteger(num)) {
      return num.toString();
    }
    // Show up to 4 decimal places, trimming trailing zeros
    return parseFloat(num.toFixed(4)).toString();
  }
})();
