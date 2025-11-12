'use strict'

let gCanvas
let gCtx

function onInit() {
    gCanvas = document.querySelector('#meme-canvas')
    gCtx = gCanvas.getContext('2d')
    renderGallery()
}

function renderGallery() {
    const imgs = getImgs()
    const elGallery = document.querySelector('.image-gallery')
    const strHTMLs = imgs.map(img =>
        `<img src="${img.url}" alt="meme" onclick="onImgSelect(${img.id})">`
    )
    elGallery.innerHTML = strHTMLs.join('')
}

function onImgSelect(imgId) {
    setImg(imgId)
    renderMeme()
    hideGallery()
}

function hideGallery() {
    document.querySelector('.gallery-container').classList.add('hidden')
    document.querySelector('.show-gallery-btn').classList.remove('hidden')
}

function onShowGallery() {
    showGallery()
}

function renderMeme() {
    const meme = getMeme()
    if (!meme.selectedImgId) return
    const img = getImgById(meme.selectedImgId)
    const elImg = new Image()
    elImg.src = img.url
    elImg.onload = () => {
        gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
        gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height)
        drawText(meme.lines[0].txt, gCanvas.width / 2, 50)
    }
}

function drawText(text, x, y) {
    gCtx.lineWidth = 2
    gCtx.strokeStyle = 'black'
    gCtx.fillStyle = 'white'
    gCtx.font = '30px Impact'
    gCtx.textAlign = 'center'
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
}

function onSetLineTxt(txt) {
    setLineTxt(txt)
    renderMeme()
}

function onDownloadMeme() {
  const link = document.createElement('a')
  link.download = 'my-meme.jpg'
  link.href = gCanvas.toDataURL('image/jpeg')
  link.click()
}

