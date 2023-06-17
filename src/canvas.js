import Vec from "./lib/vec"

// SETUP CANVAS
const dom = document.body
const canvas = document.createElement("canvas")
dom.appendChild(canvas)
const dpr = window.devicePixelRatio
let bounds = dom.getBoundingClientRect()
canvas.width = bounds.width * dpr
canvas.height = bounds.height * dpr
const ctx = canvas.getContext("2d")
//ctx.translate(canvas.width/2, canvas.height/2)
ctx.scale(dpr, dpr)

let strokes = []

let mouse_is_down = false

// MOUSE EVENTS
window.addEventListener("mousedown", e=> {
    let pos = Vec(e.clientX, e.clientY)
    mouse_is_down = true
    strokes.push([pos])
})

window.addEventListener("mousemove", e=> {
    if(mouse_is_down) {
        let pos = Vec(e.clientX, e.clientY)
        strokes[strokes.length-1].push(pos)
    }
})

window.addEventListener("mouseup", e=> {
    mouse_is_down = false
})

window.addEventListener("touchstart", e=>{
    for(const touch of e.touches) {
        if(touch.touchType === 'stylus') {
            let pos = Vec(touch.clientX, touch.clientY)
            pos.force = touch.force
            strokes.push([pos])
            mouse_is_down = true
        }
    }
})

window.addEventListener("touchmove", e=>{
    for(const touch of e.touches) {
        if(mouse_is_down && touch.touchType === 'stylus') {
            let pos = Vec(touch.clientX, touch.clientY)
            pos.force = touch.force
            strokes[strokes.length-1].push(pos)
        }
    }
})

window.addEventListener("touchend", e=>{
    mouse_is_down = false
})

function render(){
    ctx.clearRect(0,0, window.innerWidth, window.innerHeight)
    ctx.strokeStyle = "#FF0000"

    for(const stroke of strokes) {
        ctx.beginPath()
        ctx.moveTo(stroke[0].x, stroke[0].y)
        for (let i = 1; i < stroke.length; i++) {
            ctx.lineTo(stroke[i].x, stroke[i].y)    
        }
        ctx.stroke()
    }

    requestAnimationFrame(render)
}

render()