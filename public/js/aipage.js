let message =""


async function generateSolution(url, message) {
  try {
    const response = await fetch('/api/generate-solution', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, message }), // Pass both URL and message
    });

    if (!response.ok) {
      console.error('Error fetching solution:', response.statusText);
      return 'Error fetching solution. Please try again later.';
    }

    const data = await response.json();
    return data.solution;
  } catch (error) {
    console.error('Network error:', error);
    return 'A network error occurred. Please check your connection.';
  }
}
async function generateSolutionFile(url, message) {
  try {
    const response = await fetch('/api/generate-solution-file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, message }), // Pass both URL and message
    });

    if (!response.ok) {
      console.error('Error fetching solution:', response.statusText);
      return 'Error fetching solution. Please try again later.';
    }

    const data = await response.json();
    return data.solution; // Return the fixed HTML as text
  } catch (error) {
    console.error('Network error:', error);
    return 'A network error occurred. Please check your connection.';
  }
}

document.getElementById('getsolution').addEventListener('click', async () => {
  const messageInput = document.getElementById('errorMessage').value.trim();
  const urlInput = document.getElementById('urlInput').value.trim();
  const solutionText = document.getElementById('solutionText');
  const button = document.getElementById('getsolution');

  if (!messageInput) {
    solutionText.textContent = 'Please enter an error message.';
    return;
  }

  button.disabled = true; // Disable button during request
  solutionText.textContent = 'Generating solution...';

  try {
    const solution = await generateSolution(urlInput, messageInput);
    solutionText.textContent = solution;
  } catch (error) {
    console.error('Error:', error);
    solutionText.textContent = 'An error occurred while fetching the solution.';
  } finally {
    button.disabled = false; // Re-enable button after request
  }
});
document.getElementById('getsolutionfile').addEventListener('click', async () => {
  const messageInput = document.getElementById('errorMessage').value.trim();
  const urlInput = document.getElementById('urlInput').value.trim();
  const solutionText = document.getElementById('solutionText');
  const button = document.getElementById('getsolutionfile');

  if (!messageInput) {
    solutionText.textContent = 'Please enter an error message.';
    return;
  }

  button.disabled = true; // Disable button during request
  solutionText.textContent = 'Generating solution file...';

  try {
    const solution = await generateSolutionFile(urlInput, messageInput);
    solutionText.textContent = solution; // Display the fixed HTML directly
  } catch (error) {
    console.error('Error:', error);
    solutionText.textContent = 'An error occurred while generating the solution file.';
  } finally {
    button.disabled = false; // Re-enable button after request
  }
});
