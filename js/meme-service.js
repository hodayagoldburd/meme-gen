'use strict'

const gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['funny', 'cat'] },
    { id: 2, url: 'img/2.jpg', keywords: ['baby', 'cute'] },
    { id: 3, url: 'img/3.jpg', keywords: ['dog', 'smile'] },
    { id: 4, url: 'img/4.jpg', keywords: ['dog', 'smile'] },
    { id: 5, url: 'img/5.jpg', keywords: ['dog', 'smile'] },
    { id: 6, url: 'img/6.jpg', keywords: ['dog', 'smile'] },
    { id: 7, url: 'img/7.jpg', keywords: ['dog', 'smile'] },
    { id: 8, url: 'img/8.jpg', keywords: ['dog', 'smile'] },
    { id: 9, url: 'img/9.jpg', keywords: ['dog', 'smile'] },
    { id: 10, url: 'img/10.jpg', keywords: ['dog', 'smile'] },
    { id: 11, url: 'img/11.jpg', keywords: ['dog', 'smile'] },
    { id: 12, url: 'img/12.jpg', keywords: ['dog', 'smile'] },
    { id: 13, url: 'img/13.jpg', keywords: ['dog', 'smile'] },
    { id: 14, url: 'img/14.jpg', keywords: ['dog', 'smile'] },
    { id: 15, url: 'img/15.jpg', keywords: ['dog', 'smile'] },
    { id: 16, url: 'img/16.jpg', keywords: ['dog', 'smile'] },
    { id: 17, url: 'img/17.jpg', keywords: ['dog', 'smile'] },
    { id: 18, url: 'img/18.jpg', keywords: ['dog', 'smile'] },
]

const gMeme = {
    selectedImgId: null,
    selectedLineIdx: 0,
    lines: [
        {
            txt: '',
            size: 30,
            color: 'white',
            pos: { x: 200, y: 50 }
        }
    ]
}



function getImgs() {
    return gImgs
}

function getMeme() {
    return gMeme
}

function setImg(imgId) {
    gMeme.selectedImgId = imgId
}

function getImgById(imgId) {
    return gImgs.find(img => img.id === imgId)
}

function showGallery() {
    document.querySelector('.gallery-container').classList.remove('hidden')
    document.querySelector('.show-gallery-btn').classList.add('hidden')
}

function setLineTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function changeFontSize(diff) {
    const line = gMeme.lines[gMeme.selectedLineIdx]
    line.size += diff * 2
    if (line.size < 16) line.size = 16
    if (line.size > 80) line.size = 80
}

function setTextColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color
}

function addLine() {
    const x = gCanvas.width / 2
    let y

    const numLines = gMeme.lines.length
    if (numLines === 1) y = gCanvas.height - 50
    else y = gCanvas.height / 2

    const newLine = {
        txt: 'New line',
        size: 30,
        color: 'white',
        pos: { x, y }
    }

    gMeme.lines.push(newLine)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}



function switchLine() {
    gMeme.selectedLineIdx++
    if (gMeme.selectedLineIdx >= gMeme.lines.length) gMeme.selectedLineIdx = 0
}

function setTextAlign(align) {
    gMeme.lines[gMeme.selectedLineIdx].align = align

    const line = gMeme.lines[gMeme.selectedLineIdx]
    if (align === 'left') line.pos.x = 20
    if (align === 'center') line.pos.x = gCanvas.width / 2
    if (align === 'right') line.pos.x = gCanvas.width - 20
}

function setFontFamily(font) {
    gMeme.lines[gMeme.selectedLineIdx].font = font
}

function deleteLine() {
    if (!gMeme.lines.length) return
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)

    gMeme.selectedLineIdx = 0
    if (gMeme.lines.length === 0) {
        addLine()
    }
}

function moveLine(diff) {
    const line = gMeme.lines[gMeme.selectedLineIdx]
    let newY = line.pos.y + diff
    if (newY < 0) newY = 0
    if (newY > gCanvas.height - line.size) {
        newY = gCanvas.height - line.size
    }
    line.pos.y = newY
}
function drawText(line) {
    const { txt, pos, size, color, font = 'Impact', align = 'center' } = line
    gCtx.lineWidth = 2
    gCtx.strokeStyle = 'black'
    gCtx.fillStyle = color
    gCtx.font = `${size}px ${font}`
    gCtx.textAlign = align
    gCtx.textBaseline = 'top'

    gCtx.fillText(txt, pos.x, pos.y)
    gCtx.strokeText(txt, pos.x, pos.y)

    const textWidth = gCtx.measureText(txt).width
    const textHeight = size

    let x
    if (align === 'left') {
        x = pos.x
    } else if (align === 'right') {
        x = pos.x - textWidth
    } else {
        x = pos.x - textWidth / 2
    }

    line.bounds = {
        x,
        y: pos.y,
        width: textWidth,
        height: textHeight
    }
}


let gSavedMemes = loadFromStorage('savedMemes') || []

function saveMeme() {
    // renderCleanMeme()
    const memeCopy = JSON.parse(JSON.stringify(gMeme))
    memeCopy.id = makeId()
    memeCopy.preview = gCanvas.toDataURL('image/jpeg')

    gSavedMemes.push(memeCopy)
    saveToStorage('savedMemes', gSavedMemes)

    renderMeme()
}


function renderSavedMemes() {
    const memes = getSavedMemes()
    const elGrid = document.querySelector('.saved-memes-grid')

    if (!memes.length) {
        elGrid.innerHTML = '<p>No saved memes yet.</p>'
        return
    }

    const htmls = memes.map(meme => `
        <img 
            class="saved-meme-item"
            src="${meme.preview}" 
            data-id="${meme.id}"
            onclick="onLoadSavedMeme('${meme.id}')">
    `)

    elGrid.innerHTML = htmls.join('')

    // addSavedMemesListeners()
}

function getSavedMemes(){
    return gSavedMemes
}
