

//Handle running test
async function runTest(content, nameOfFile)
{
    try
    {
        const response = await fetch("/upload",
            {
                method : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: content, name: nameOfFile})
                
            }
        );

        const result = await response.json();
        console.log(result);
    }
    catch(err)
    {
        console.error(err);
    }
}

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const fileName = document.getElementById('fileName');
const testButton = document.getElementById('test-btn');
var fileName2;
var content2;
// Handle file selection
fileInput.addEventListener('change', function(e) {
    if (this.files && this.files[0]) {
        fileName.textContent = `Selected file: ${this.files[0].name}`;
        const nameOfFile = this.files[0].name
        fileName2 = nameOfFile;
        const reader = new FileReader();
            reader.onload = async function(event) {
                const content = event.target.result;
                content2 = content;
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

testButton.addEventListener('click', function(e) {
    
    e.preventDefault();
    runTest(content2,fileName2);
    fileInput.value = '';
    fileName.textContent = '';

});



//
