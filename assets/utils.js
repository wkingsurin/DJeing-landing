export const musicList = [
    'Nirvana-Smells-Like-Teen-Spirit.mp3',
    'Nirvana-Heart-Shaped-Box.mp3',
    'Nirvana-Come-As-You-Are.mp3',
    'Nirvana-Drain-You.mp3',
    'Nirvana-In-Bloom.mp3',
    'Nirvana-Something-In-The-Way.mp3',
]

export const arrayFromNodeLst = (nodeList) => {
    return Array.from(nodeList)
}

export const getCorrectName = (musicName) => {
    const name = musicName.split('.')
    name.pop()

    const joinedName = name.join('')
    const newName = joinedName.split('-')
    newName.splice(1, 0, '-')
    return newName.join(' ')
}