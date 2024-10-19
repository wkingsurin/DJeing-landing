const playButtons = document.querySelectorAll('.play')
const audio = document.querySelector('.audio')
audio.muted = true

const time = document.querySelector('.time')

const current = time.querySelector('.current')
current.textContent = `00:00`

const total = time.querySelector('.total')
total.textContent = correctTime(getDuration(audio, true))

let playing = false

playButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        let currentDuration = 0
        const fullDuration = getDuration(audio, true)
        let timer

        const icons = Array.from(e.currentTarget.children)
        changeIcon(icons)

        if (playing) {
            pause(timer)
            playing = false
        } else {
            play()
            playing = true
            timer = setInterval(() => {
                currentDuration += 1

                current.textContent = correctTime(currentDuration)

                if (currentDuration === fullDuration) {
                    clearInterval(timer)
                }
            }, 1000)
        }
    })
})

function play(event) {
    audio.play()
}

function pause(timer) {
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