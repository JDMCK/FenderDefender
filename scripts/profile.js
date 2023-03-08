function uploadFile() {
    const input = document.getElementById('fileInput');
    const file = input.files[0];
  
    const formData = new FormData();
    formData.append('file', file);
  
    fetch('/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log('Upload successful!');
      console.log(data);
    })
    .catch(error => {
      console.error('Upload failed!');
      console.error(error);
    });
  }