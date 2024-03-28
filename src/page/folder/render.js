const urlParams = new URLSearchParams(window.location.search);
const dirPath = urlParams.get('dirPath'); // "value"
console.log(dirPath);
