let message =""


async function generateSolution(message) {
  console.log("hello")
    const response = await fetch('/api/generate-solution', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    
    if (!response.ok) {
      console.error('Error fetching solution');
      return 'Error fetching solution';
    }
    
    const data = await response.json();
    return data.solution;
  }
  
  

  document.getElementById('getsolution').addEventListener('click', async () => {
    const messageInput = document.getElementById('errorMessage').value.trim();
    const solutionText = document.getElementById('solutionText');
  
    if (!messageInput) {
      solutionText.textContent = "Please enter an error message.";
      return;
    }
  
    solutionText.textContent = "Generating solution...";
    
    try {
      const solution = await generateSolution(messageInput);
      solutionText.textContent = solution ;
    } catch (error) {
      console.error('Error:', error);
      solutionText.textContent = "An error occurred while fetching the solution.";
    }
  });
  