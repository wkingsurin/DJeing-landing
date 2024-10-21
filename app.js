const playButtons = document.querySelectorAll('.play')
const audio = document.querySelector('.audio')
// audio.muted = true

const track = document.querySelector('.track')
const trackFullWidth = track.clientWidth

track.max = getDuration(audio, true)
track.value = 0

const progress = document.querySelector('.progress')
progress.style.width = '0px'

const time = document.querySelector('.time')

const current = time.querySelector('.current')
current.textContent = `00:00`

const total = time.querySelector('.total')
total.textContent = correctTime(getDuration(audio, true))

let playing = false

playButtons.forEach(button => {
    let timer
    let currentDuration = 0
    let currentStep = 0
    const fullDuration = getDuration(audio, true)
    const step = trackFullWidth / fullDuration
    const icons = Array.from(button.children)

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

function play(audio, src) {
    if (src) {
        audio.src = `${src}`
    }
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

function controls() {

}