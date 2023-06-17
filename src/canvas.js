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
let erase_mode = false

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
            if(!erase_mode) {
                pos.force = touch.force
                strokes.push([pos])
                mouse_is_down = true
            } else {
                mouse_is_down = true
                erase(pos)
            }
        } else {
            let pos = Vec(touch.clientX, touch.clientY)
            if(Vec.dist(pos, Vec(10,window.innerHeight/2 - 25)) < 50) {
                erase_mode = ! erase_mode
            }
        }
    }
})

window.addEventListener("touchmove", e=>{
    for(const touch of e.touches) {
        if(mouse_is_down && touch.touchType === 'stylus') {
            let pos = Vec(touch.clientX, touch.clientY)
            if(!erase_mode) { 
                pos.force = touch.force
                strokes[strokes.length-1].push(pos)
            } else {
                erase(pos)
            }
        }
    }
})

window.addEventListener("touchend", e=>{
    mouse_is_down = false
})

function erase(pos) {
    for (let i = 0; i < strokes.length; i++) {
        const stroke = strokes[i];
        let did_match = false
        for (const point of stroke) {
            if(Vec.dist(pos, point) < 10) {
                did_match = true
                break;
            }
        }
        if(did_match) {
            strokes.splice(i, 1)
        }
        
    }
}

function render(){
    ctx.clearRect(0,0, window.innerWidth, window.innerHeight)
    ctx.strokeStyle = "#000000"

    for(const stroke of strokes) {
        ctx.beginPath()
        ctx.moveTo(stroke[0].x, stroke[0].y)
        for (let i = 1; i < stroke.length; i++) {
            ctx.lineTo(stroke[i].x, stroke[i].y)    
        }
        ctx.stroke()
    }

    ctx.beginPath()
    ctx.rect(10,window.innerHeight/2 - 25,50,50)
    if(erase_mode) {
        ctx.stroke()
    } else {
        ctx.fill()
    }
    

    requestAnimationFrame(render)
}

render()