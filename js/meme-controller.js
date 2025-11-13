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

        meme.lines.forEach((line, idx) => {
    if (!line.txt) return
    drawText(line)
    if (idx === meme.selectedLineIdx) drawFrame(line)
})
    }
}

function renderCleanMeme() {
    const meme = getMeme()
    if (!meme.selectedImgId) return

    const img = getImgById(meme.selectedImgId)
    const elImg = new Image()
    elImg.src = img.url

    elImg.onload = () => {
        gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
        gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height)

        meme.lines.forEach(line => {
            if (!line.txt) return
            drawText(line)
        })
    }
}



function drawText(line) {
    const { txt, pos, size, color } = line
    gCtx.lineWidth = 2
    gCtx.strokeStyle = 'black'
    gCtx.fillStyle = color
    gCtx.font = `${size}px Impact`
    gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'
    gCtx.fillText(txt, pos.x, pos.y)
    gCtx.strokeText(txt, pos.x, pos.y)
}



function onSetLineTxt(txt) {
    setLineTxt(txt)
    renderMeme()
}

function onDownloadMeme() {
 renderCleanMeme()

    setTimeout(() => {
        const link = document.createElement('a')
        link.download = 'my-meme.jpg'
        link.href = gCanvas.toDataURL('image/jpeg')
        link.click()

        renderMeme()
    }, 100)
}


function onChangeFontSize(diff) {
    changeFontSize(diff)
    renderMeme()
}

function onSetTextColor(color) {
    setTextColor(color)
    renderMeme()
}

function onAddLine() {
    addLine()
    renderMeme()
    updateTextInput()
}

function onSwitchLine() {
    switchLine()
    renderMeme()
    updateTextInput()
}

function updateTextInput() {
    const meme = getMeme()
    const line = meme.lines[meme.selectedLineIdx]
    const elInput = document.querySelector('.text-input')
    elInput.value = line.txt || ''
    elInput.placeholder = line.txt || 'Enter meme text'
}


function drawFrame(line) {
    const textWidth = gCtx.measureText(line.txt).width
    const textHeight = line.size
    gCtx.strokeStyle = 'red'
    gCtx.lineWidth = 2
    gCtx.strokeRect(
        line.pos.x - textWidth / 2 - 10,
        line.pos.y - textHeight / 2 - 5,
        textWidth + 20,
        textHeight + 10
    )
}

