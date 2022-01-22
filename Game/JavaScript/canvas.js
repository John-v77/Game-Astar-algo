
const onload=()=>{
    console.log('page is loaded')


    //get canvas
    canvas = document.querySelector('canvas')
    console.log(canvas, "canvas")

    canvas.width = 800
    canvas.height = 800

    // get context
    let ctx = canvas.getContext("2d")
    ctx.fillStyle="F0F0F0"


    //draw bolder tile
    let img1 = new Image()
    img1.src = '../Images/bolder-tile.png'
    img1.onload = function(){
        ctx.drawImage(img1, 0, 0)
    }

    //draw grass tile
    let img2 = new Image()
    img2.src = 'https://64.media.tumblr.com/5310eb96570ee4e51acae3ae0f57fd2e/9e54f617e5091267-f4/s540x810/cac009e7c086af567dc76a7690b8c4731d3b70d9.png'
    img2.onload = function(){
        ctx.drawImage(img2, 32, 32)
    }
    
}



