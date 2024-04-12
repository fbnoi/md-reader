document.addEventListener('DOMContentLoaded', function () {
    let initialed = false;
    let radio = 0;
    const sideViewElem = document.querySelector('.side-view');
    const categoryElem = document.querySelector('.side-view .category');
    const articleElem = document.querySelector('.main-view .article');

    function splitResize() {
        sideViewElem.style['grid-template-rows'] = '1fr 5px ' + sideViewElem.clientHeight * radio + 'px';
    }

    function updateRadio() {
        radio = categoryElem.clientHeight / sideViewElem.clientHeight;
    }
    
    new Promise((resolve) => {
        Split({
            columnGutters: [{
                track: 1,
                element: document.querySelector('.gutter-main'),
            }],
            rowGutters: [{
                track: 1,
                element: document.querySelector('.gutter-side'),
            }],
            onDragEnd: function(direction, track) {
                if (direction === 'row' && track === 1) {
                    updateRadio();
                }
            }
        });
        resolve();
    }).then(() => {
        return new URLSearchParams(window.location.search).get('dirPath');
    }).then((dirPath) => {
        return window.API.openDir(dirPath);
    }).then((html) => {
        document.querySelector('.file-tree').innerHTML = html;
        return;
    }).then(() => {
        document.querySelectorAll('.file-tree a[property-type="2"]').forEach(elem => {
            elem.addEventListener('click', function() {
                const filePath = this.getAttribute('property-path');
                new Promise(resolve => {
                    resolve(window.API.openFile(filePath));
                }).then((fileInfo) => {
                    document.title = fileInfo.name;
                    articleElem.innerHTML = fileInfo.doc.html;
                    articleElem.scrollTop = 0;;
                    categoryElem.innerHTML = fileInfo.doc.toc;
                    if (!initialed) {
                        initialed = true;
                        radio = 0.5;
                        splitResize();
                    }
                }).then(() => {
                    document.querySelectorAll('a.open-in-browser').forEach((link) => {
                        link.addEventListener('click', (e) => {  
                            e.preventDefault();
                            window.API.openExternal(link.href);
                        }); 
                    });
                });
            })
        });
    });

    window.addEventListener('resize', splitResize);
});