'use strict'

let gCanvas
let gCtx

function onSelectImg(elImg) {
    if (!gCanvas) {
        gCanvas = document.querySelector('#meme-canvas')
        gCtx = gCanvas.getContext('2d')
    }
    const img = new Image()
    img.src = elImg.src

    img.onload = () => {
        gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
    }
}
