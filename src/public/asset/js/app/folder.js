const urlParams = new URLSearchParams(window.location.search)
const dirPath = urlParams.get('dirPath')
console.log(dirPath)

Split({
    columnGutters: [{
        track: 1,
        element: document.querySelector('.gutter-main'),
    }],
    rowGutters: [{
        track: 1,
        element: document.querySelector('.gutter-side'),
    }]
});
