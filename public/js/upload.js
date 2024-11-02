

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const fileName = document.getElementById('fileName');

// Handle file selection
fileInput.addEventListener('change', function(e) {
    if (this.files && this.files[0]) {
        fileName.textContent = `Selected file: ${this.files[0].name}`;
        console.log(this.files)
        const reader = new FileReader();
            reader.onload = async function(event) {
                const content = event.target.result;
                console.log("Java File Content:", content);  // Log the file content

                // const response = await fetch('/read-file', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json'
                //     },
                //     body: JSON.stringify({ content: content })
                // });

                // const result = await response.json();
                // document.getElementById('result').textContent = result.content;
            };
            reader.readAsText(this.files[0]);


    }
});

// Handle drag and drop
dropZone.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.classList.add('dragover');
});

dropZone.addEventListener('dragleave', function(e) {
    e.preventDefault();
    this.classList.remove('dragover');
});

dropZone.addEventListener('drop', function(e) {
    e.preventDefault();
    this.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
        fileInput.files = files;
        fileName.textContent = `Selected file: ${files[0].name}`;
    }
});

// Handle click on the drop zone
dropZone.addEventListener('click', function(e) {
    if (e.target === this || e.target.tagName !== 'BUTTON') {
        fileInput.click();
    }
});




//
