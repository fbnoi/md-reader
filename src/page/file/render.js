const urlParams = new URLSearchParams(window.location.search);
const filePath = urlParams.get('filePath');
console.log(filePath);
const fileInfo = window.API.openFile(filePath);
fileInfo.then((res) => {
    console.log(res);
});
