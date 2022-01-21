
const onload=()=>{
    console.log('page is loaded')

    canvas = document.querySelector('canvas')
    console.log(canvas, "canvas")

    canvas.width = 800
    canvas.height = 800

    let ctx = canvas.getContext("2d")
    ctx.fillStyle="F0F0F0"
    
}



