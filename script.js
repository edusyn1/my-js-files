
    const apiKey = 'EoTk15gWWQCjGaSFs8yYZPZS';

    const fileInput = document.getElementById('file-input');
    const downloadButton = document.getElementById('download-button');
    const resultImage = document.getElementById('result-image');
    const resultContainer = document.getElementById('result-container');
    const loader = document.getElementById('loader');

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      const formData = new FormData();
      formData.append('size', 'auto');
      formData.append('image_file', file);

      loader.style.display = 'block';
      resultImage.style.display = 'none';
      downloadButton.style.display = 'none';
      resultContainer.style.display = 'block';

      fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': apiKey
        },
        body: formData
      })
      .then(res => res.blob())
      .then(blob => {
        loader.style.display = 'none';
        const url = URL.createObjectURL(blob);
        resultImage.src = url;
        resultImage.style.display = 'block';
        downloadButton.href = url;
        downloadButton.style.display = 'inline-block';
      })
      .catch(err => {
        loader.style.display = 'none';
        alert("Kuchh galat ho gaya. Kripya fir se try karein.");
        console.error(err);
      });
    });
 
