'use strict'

let gCanvas
let gCtx

function onInit() {
    gCanvas = document.querySelector('#meme-canvas')
    gCtx = gCanvas.getContext('2d')
    renderGallery()

    gCanvas.addEventListener('click', onCanvasClick)
    gCanvas.addEventListener('touchstart', onCanvasTouch)
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
            if (idx === meme.selectedLineIdx && idx !== -1) drawFrame(line)
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
        line.bounds.x - 10,
        line.bounds.y - 5,
        line.bounds.width + 20,
        line.bounds.height + 10
    )
}


function onCanvasClick(ev) {
    const { offsetX, offsetY } = ev
    handleCanvasInteraction(offsetX, offsetY)
}


function onCanvasTouch(ev) {
    ev.preventDefault()
    const touch = ev.changedTouches[0]
    const rect = gCanvas.getBoundingClientRect()
    const offsetX = touch.clientX - rect.left
    const offsetY = touch.clientY - rect.top

    handleCanvasInteraction(offsetX, offsetY)
}

function handleCanvasInteraction(offsetX, offsetY) {
    const meme = getMeme()

    const clickedLineIdx = meme.lines.findIndex(line => {
        if (!line.bounds) return false
        const { x, y, width, height } = line.bounds
        return offsetX >= x && offsetX <= x + width &&
            offsetY >= y && offsetY <= y + height
    })

    if (clickedLineIdx === -1) {
        meme.selectedLineIdx = -1
        renderMeme()
        document.querySelector('.text-input').value = ''
        return
    }

    meme.selectedLineIdx = clickedLineIdx
    renderMeme()
    updateTextInput()
}

function onAlignLeft() {
    setTextAlign('left')
    renderMeme()
}

function onAlignCenter() {
    setTextAlign('center')
    renderMeme()
}

function onAlignRight() {
    setTextAlign('right')
    renderMeme()
}

function onSetFontFamily(font) {
    setFontFamily(font)
    renderMeme()
}

function onMoveLine(diff) {
    moveLine(diff)
    renderMeme()
}

function onDeleteLine() {
    deleteLine()
    renderMeme()
    updateTextInput()
}

function onShareFacebook() {
    renderCleanMeme()
    setTimeout(() => {
        const imgData = gCanvas.toDataURL('image/jpeg')

        const fbUrl =
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imgData)}`

        window.open(fbUrl, '_blank')
        renderMeme()
    }, 100)
}


function onSaveMeme() {
    renderCleanMeme()

    setTimeout(() => {
        saveMeme()
        renderMeme()
        // console.log('Meme saved!')
    }, 100)
}


function onLoadSavedMeme(id) {
    const meme = gSavedMemes.find(m => m.id === id)
    if (!meme) return

    const loadedMeme = JSON.parse(JSON.stringify(meme))

    gMeme.selectedImgId = loadedMeme.selectedImgId
    gMeme.lines = loadedMeme.lines
    gMeme.selectedLineIdx = 0 

    gMeme.lines.forEach((line, idx) => {
        if (!line.pos) {
            line.pos = {
                x: gCanvas.width / 2,
                y: idx === 0 ? 50 : gCanvas.height - 80
            }
        }
    })

    renderMeme()
    updateTextInput()

    document.querySelector('.saved-memes-container').classList.add('hidden')
    document.querySelector('.btn-feature').innerText = 'Saved Memes'
}





// function onShowSavedMemes() {
//     renderSavedMemes()
//     document.querySelector('.saved-memes-container').classList.remove('hidden')
// }

// function addSavedMemesListeners() {
//     const items = document.querySelectorAll('.saved-meme-item')

//     items.forEach(item => {
//         item.addEventListener('pointerdown', ev => {
//             const id = ev.target.dataset.id
//             onLoadSavedMeme(id)
//         })
//     })
// }

function onToggleSavedMemes() {
    const elContainer = document.querySelector('.saved-memes-container')
    const elBtn = document.querySelector('.btn-feature')
    if (elContainer.classList.contains('hidden')) {
        renderSavedMemes()
        elContainer.classList.remove('hidden')
        elBtn.innerText = 'Close'
    }
    else {
        elContainer.classList.add('hidden')
        elBtn.innerText = 'Saved Memes'
    }
}

function onCloseGallery() {
    document.querySelector('.gallery-container').classList.add('hidden')
    document.querySelector('.show-gallery-btn').classList.remove('hidden')
}

