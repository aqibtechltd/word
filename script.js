// Minimal Trae-like HTTP client
function traePost(url, file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.responseType = 'blob';
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const err = JSON.parse(reader.result);
            reject(err.error || 'Conversion failed');
          } catch {
            reject('Conversion failed');
          }
        };
        reader.readAsText(xhr.response);
      }
    };
    xhr.onerror = () => reject('Network error');
    const formData = new FormData();
    formData.append('file', file);
    xhr.send(formData);
  });
}

const dropArea = document.getElementById('drop-area');
const fileElem = document.getElementById('fileElem');
const progress = document.getElementById('progress');
const message = document.getElementById('message');
const downloadLink = document.getElementById('download-link');

function resetUI() {
  progress.style.display = 'none';
  message.textContent = '';
  downloadLink.style.display = 'none';
}

function handleFiles(files) {
  resetUI();
  const file = files[0];
  if (!file || !/\.(docx?)$/i.test(file.name)) {
    message.textContent = 'Please select a .doc or .docx file.';
    return;
  }
  progress.style.display = 'block';
  progress.textContent = 'Uploading...';
  traePost('/api/convert', file, (percent) => {
    progress.textContent = 'Uploading: ' + percent + '%';
  })
    .then(blob => {
      progress.textContent = 'Conversion complete!';
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = file.name.replace(/\.(docx?)$/i, '.pdf');
      downloadLink.style.display = 'block';
      message.textContent = '';
    })
    .catch(err => {
      progress.style.display = 'none';
      message.textContent = err;
    });
}

dropArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropArea.classList.add('dragover');
});
dropArea.addEventListener('dragleave', (e) => {
  dropArea.classList.remove('dragover');
});
dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dropArea.classList.remove('dragover');
  if (e.dataTransfer.files.length) {
    handleFiles(e.dataTransfer.files);
  }
});
fileElem.addEventListener('change', (e) => {
  if (e.target.files.length) {
    handleFiles(e.target.files);
  }
});
document.getElementById('upload-form').addEventListener('submit', (e) => {
  e.preventDefault();
});