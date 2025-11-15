'use strict'

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


function getMeme() {
    return gMeme
}

