import { musicList } from '/assets/utils.js'

function init() {
    const lastTracks = arrayFromNodeLst(document.querySelectorAll('[name="music"]'))

    {
        const playButton = document.querySelector('.play')
        const parent = playButton.parentNode

        const audio = parent.querySelector('.audio')
        audio.muted = true
        audio.src = `./assets/music/${musicList[0]}`

        const track = parent.querySelector('.track')
        const trackFullWidth = track.clientWidth
        track.value = 0

        let playing = false

        const progress = parent.querySelector('.progress')
        progress.style.width = '0px'

        const time = parent.querySelector('.time')

        const current = time.querySelector('.current')
        current.textContent = `00:00`

        const total = time.querySelector('.total')
        total.textContent = `00:00`

        let timer

        let currentDuration = 0
        let currentStep = 0

        let fullDuration
        let step

        const icons = arrayFromNodeLst(playButton.children)

        audio.addEventListener('loadedmetadata', function setFullDuration(e) {
            track.max = getDuration(audio, true)
            fullDuration = getDuration(audio, true)
            step = trackFullWidth / fullDuration

            total.textContent = correctTime(getDuration(e.currentTarget, true))
        })

        playButton.addEventListener('click', (e) => {
            changeIcon(icons, audio)

            if (playing) {
                pause(audio)
                clearInterval(timer)
                playing = false
            } else {
                play(audio)
                playing = true
                timer = setInterval(() => {
                    currentStep += 1
                    currentDuration += 1

                    current.textContent = correctTime(currentDuration)

                    setProgress({
                        progressBar: progress,
                        currentTime: currentDuration,
                        track: track,
                        step,
                        currentStep
                    })

                    if (currentDuration === fullDuration) {
                        clearInterval(timer)
                    }
                }, 1000)
            }
        })
    }

    {
        let timer

        lastTracks.forEach((music, index) => {
            const parent = music.closest('.block-content')
            const audio = parent.querySelector('.audio')
            // audio.muted = true
            audio.src = `./assets/music/${musicList[0]}`

            let previous = null

            music.textContent = getCorrectName(musicList[index])

            const track = parent.querySelector('.track')
            const trackFullWidth = track.clientWidth
            track.value = 0

            const progress = parent.querySelector('.progress')
            progress.style.width = '0px'

            const time = parent.querySelector('.time')

            const current = time.querySelector('.current')
            current.textContent = `00:00`

            const total = time.querySelector('.total')
            total.textContent = `00:00`

            let currentDuration = 0
            let currentStep = 0

            let fullDuration
            let step

            let playing = false

            const icons = arrayFromNodeLst(parent.querySelector('.play').children)

            // 
            track.max = getDuration(audio, true)
            fullDuration = getDuration(audio, true)
            step = trackFullWidth / fullDuration
            // 

            music.addEventListener('click', (e) => {
                e.preventDefault()

                clearInterval(timer)

                // 
                currentStep = 0
                currentDuration = 0

                if (previous == music.textContent) {
                    console.log(`previous == music.textContent`)
                } else if (previous != music.textContent || previous == null) {
                    console.log(`previous != music.textContent`)
                    // playing = !playing
                }
                // 
                
                audio.src = `./assets/music/${musicList[index]}`

                if (playing) {
                    pause(audio)
                    console.log(`playing`)
                    playing = false
                    changeIcon(icons, false)
                } else {
                    play(audio)

                    console.log(`playing`)

                    playing = true
                    changeIcon(icons, true)
                    previous = music.textContent

                    timer = setInterval(() => {
                        current.textContent = correctTime(currentDuration)

                        setProgress({
                            progressBar: progress,
                            currentTime: currentDuration,
                            track: track,
                            step,
                            currentStep
                        })

                        currentStep += 1
                        currentDuration += 1

                        if (currentDuration === fullDuration) {
                            clearInterval(timer)
                        }
                    }, 1000)
                }
            })
        })
    }
}

function play(audio) {
    audio.play()
}

function pause(audio) {
    audio.pause()
}

function changeIcon(icons, paused) {
    icons.forEach(icon => {
        icon.classList.remove('hide')

        if (paused) {
            if (icon.alt == 'play') {
                icon.classList.add('hide')
            }
        } else {
            if (icon.alt == 'pause') {
                icon.classList.add('hide')
            }
        }
    })
}

function getDuration(audio, integer) {
    return integer ? Math.round(audio.duration) : audio.duration
}

function correctTime(time) {
    let minutes
    let seconds

    if (time < 60) {
        minutes = 0
        seconds = time
    }
    if (time >= 60) {
        minutes = Math.trunc(time / 60)
        seconds = (time - minutes * 60)
    }

    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
}

function setProgress(options) {
    options.track.value = options.currentTime
    options.progressBar.style.width = options.currentStep * options.step + 'px'
}

function arrayFromNodeLst(nodeList) {
    return Array.from(nodeList)
}

function getCorrectName(musicName) {
    const name = musicName.split('.')
    name.pop()

    const joinedName = name.join('')
    const newName = joinedName.split('-')
    newName.splice(1, 0, '-')
    return newName.join(' ')
}

init()