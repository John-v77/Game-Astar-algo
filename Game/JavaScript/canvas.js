//global variable for the file

    //canvas
    let canvas
    let ctx

    //terain
    let terrain


    //map size in px
    let tileSize = 32
    let mapSize = tileSize * 16

    /*  world map - list to be use for generating obstacles 
        and use for path finding Algos                  */
    world = []





const onload=()=>{
    console.log('page is loaded')


    //get canvas
    canvas = document.querySelector('canvas')
    console.log(canvas, "canvas")

    canvas.width = 800
    canvas.height = 800

    // get context
    ctx = canvas.getContext("2d")
    ctx.fillStyle="F0F0F0"



    //draw grid

    for(let i=tileSize; i<=mapSize; i+=tileSize){
        
        //vertical lines
        ctx.moveTo(i, tileSize)
        ctx.lineTo(i,mapSize)

        //horizontal lines
        ctx.moveTo(tileSize, i)
        ctx.lineTo(mapSize, i)

        ctx.strokeStyle="#333333"
        ctx.stroke()
    }
    

    
}


