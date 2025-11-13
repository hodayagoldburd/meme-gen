'use strict'

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function makeId(length = 8) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let id = ''

    for (let i = 0; i < length; i++) {
        const randIdx = getRandomIntInclusive(0, possible.length - 1)
        id += possible[randIdx]
    }

    return id
}
