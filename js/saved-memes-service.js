'use strict'

let gSavedMemes = loadFromStorage('savedMemes') || []

function saveMeme() {
    gMeme.lines.forEach((line, idx) => {
        if (!line.pos) {
            line.pos = {
                x: gCanvas.width / 2,
                y: idx === 0 ? 50 : gCanvas.height - 80
            }
        }
    })

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

    elGrid.innerHTML = memes.map(meme => `
        <img 
            class="saved-meme-item"
            src="${meme.preview}" 
            data-id="${meme.id}"
            onclick="onLoadSavedMeme('${meme.id}')">
    `).join('')
}

function getSavedMemes(){
    return gSavedMemes
}