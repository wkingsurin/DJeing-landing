import { musicList } from '/assets/utils.js'

const playButtons = document.querySelectorAll('.play')

playButtons.forEach((button, index) => {
    const parent = button.parentNode

    const audio = parent.querySelector('.audio')
    audio.muted = true
    audio.src = `./assets/music/${musicList[index]}`

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

    const icons = Array.from(button.children)

    audio.addEventListener('loadedmetadata', function setFullDuration(e) {
        track.max = getDuration(audio, true)
        fullDuration = getDuration(audio, true)
        step = trackFullWidth / fullDuration

        total.textContent = correctTime(getDuration(e.currentTarget, true))
    })

    button.addEventListener('click', (e) => {
        changeIcon(icons)

        if (playing) {
            pause(audio, timer)
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
})

function play(audio) {
    audio.play()
}

function pause(audio, timer) {
    audio.pause()
    clearInterval(timer)
}

function changeIcon(icons) {
    icons.forEach(icon => {
        icon.classList.toggle('hide')
    })
}

function getCurrentTime(audio, integer) {
    return integer ? Math.round(audio.currentTime) : audio.currentTime
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