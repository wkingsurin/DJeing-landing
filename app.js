import { musicList, getCorrectName, arrayFromNodeLst } from '/assets/utils.js'

function init() {
    const lastTracks = arrayFromNodeLst(document.querySelectorAll('[name="music"]'))
    const playButtons = arrayFromNodeLst(document.querySelectorAll('.play'))

    playButtons.forEach((button, index) => {
        const list = index == 1 ? lastTracks : false
        addControls(button, list)
    })
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

function addControls(playButton, list) {
    const parent = playButton.parentNode
    const audio = parent.querySelector('.audio')
    // audio.muted = true
    audio.src = `./assets/music/${musicList[0]}`

    const track = parent.querySelector('.track')
    const trackFullWidth = track.clientWidth
    track.value = 0

    let playing = false

    let timer

    let currentDuration = 0
    let currentStep = 0

    let fullDuration
    let step

    let previous = null

    const icons = arrayFromNodeLst(playButton.children)

    const progress = parent.querySelector('.progress')
    progress.style.width = '0px'

    const time = parent.querySelector('.time')

    const current = time.querySelector('.current')
    current.textContent = `00:00`

    const total = time.querySelector('.total')
    total.textContent = `00:00`

    audio.addEventListener('loadedmetadata', function setFullDuration(e) {
        track.max = getDuration(audio, true)
        fullDuration = getDuration(audio, true)
        step = trackFullWidth / fullDuration

        total.textContent = correctTime(getDuration(e.currentTarget, true))
    })


    addClickEventListener({
        elem: playButton,
        isButton: true,
        timer,
        previous,
        currentStep,
        currentDuration,
        audio,
        playing,
        icons,
        current,
        progress,
        track,
        step,
        fullDuration
    })
    // playButton.addEventListener('click', (e) => {
    //     if (playing) {
    //         pause(audio)
    //         clearInterval(timer)
    //         playing = false
    //         changeIcon(icons, false)
    //     } else {
    //         play(audio)

    //         timer = setInterval(() => {
    //             currentStep += 1
    //             currentDuration += 1

    //             current.textContent = correctTime(currentDuration)

    //             setProgress({
    //                 progressBar: progress,
    //                 currentTime: currentDuration,
    //                 track,
    //                 step,
    //                 currentStep
    //             })

    //             if (currentDuration === fullDuration) {
    //                 clearInterval(timer)
    //             }
    //         }, 1000)

    //         playing = true
    //         changeIcon(icons, true)
    //     }
    // })

    if (list) {
        list.forEach((music, index) => {
            music.textContent = getCorrectName(musicList[index])

            let rest = addClickEventListener({
                elem: music,
                isButton: false,
                timer,
                previous,
                currentStep,
                currentDuration,
                audio,
                playing,
                index,
                icons,
                current,
                progress,
                track,
                step,
                fullDuration
            })

            console.log(rest)

            // music.addEventListener('click', (e) => {
            //     e.preventDefault()

            //     clearInterval(timer)

            //     if (previous != music.textContent || previous == null) {
            //         currentStep = 0
            //         currentDuration = 0

            //         audio.src = `./assets/music/${musicList[index]}`

            //         playing = false
            //     }

            //     if (playing) {
            //         pause(audio)

            //         playing = false

            //         changeIcon(icons, false)
            //     } else {
            //         play(audio)

            //         timer = setInterval(() => {
            //             currentStep += 1
            //             currentDuration += 1

            //             current.textContent = correctTime(currentDuration)

            //             setProgress({
            //                 progressBar: progress,
            //                 currentTime: currentDuration,
            //                 track,
            //                 step,
            //                 currentStep
            //             })

            //             if (currentDuration === fullDuration) {
            //                 clearInterval(timer)
            //             }
            //         }, 1000)

            //         playing = true
            //         changeIcon(icons, true)
            //         previous = music.textContent
            //     }
            // })
        })
    }
}

init()

function addClickEventListener(options) {
    let {
        elem,
        isButton,
        timer,
        previous,
        currentStep,
        currentDuration,
        audio,
        playing,
        index,
        icons,
        current,
        progress,
        track,
        step,
        fullDuration
    } = options

    elem.addEventListener('click', (e) => {
        if (!isButton) {
            e.preventDefault()
            clearInterval(timer)
            console.log(`timer: ${timer}`)
            console.log(`Не кнопка, очистка интервала!`)

            if (previous != elem.textContent || previous == null) {
                currentStep = 0
                currentDuration = 0

                audio.src = `./assets/music/${musicList[index]}`

                playing = false
            }
        }

        if (playing) {
            pause(audio)

            if (isButton) {
                clearInterval(timer)
            }

            playing = false
            changeIcon(icons, false)
        } else {
            play(audio)

            timer = setInterval(() => {
                currentStep += 1
                currentDuration += 1

                current.textContent = correctTime(currentDuration)

                setProgress({
                    progressBar: progress,
                    currentTime: currentDuration,
                    track,
                    step,
                    currentStep
                })

                if (currentDuration === fullDuration) {
                    clearInterval(timer)
                }
            }, 1000)

            playing = true
            changeIcon(icons, true)

            if (!isButton) {
                previous = elem.textContent
            }
        }

        return [timer, fullDuration, step]
    })
}