'use strict'

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