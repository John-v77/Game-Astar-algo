//global variable for the file

    //canvas
    let canvas
    let ctx

    //terain
    let terrain


    //map 
    let numTiles = 16
        // size in px
    let tileSize = 32
    let mapSize = tileSize * numTiles

    /*  world map - list to be use for generating obstacles 
        and use for path finding Algos                  */
    worldMap = []





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


    //draw bolder tile
    // let img1 = new Image()
    // img1.src = '../Images/bolder-tile.png'
    // img1.onload = function(){
    //     ctx.drawImage(img1, 0, 0)
    // }

    //draw grass tile
    // let img2 = new Image()
    // img2.src = 'https://64.media.tumblr.com/5310eb96570ee4e51acae3ae0f57fd2e/9e54f617e5091267-f4/s540x810/cac009e7c086af567dc76a7690b8c4731d3b70d9.png'
    // img2.onload = function(){
    //     ctx.drawImage(img2, 32, 32)
    // }


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
    
    createWorld()
    
}


// Game Logic ****************************************************


// #1
function createWorld(){

    console.log('creating world')

    createsMapList(numTiles)
    
    console.log(worldMap)
}




// #2
function createsMapList(numOfTiles){

    console.log('creating createsMapList')

    //creates a 2d matrix that hold information about every tile

    let val
    
    for(let x=0; x<numOfTiles; x++){

        //creates a list to hold the row data
        worldMap[x] = []
        for(let y=0; y<numOfTiles; y++){

            //polulates each list, 0=flat terrain, 1=impasable terrain
            val = createObstacles()
            worldMap[x][y] = val
        }
    }
}

// #3
function createObstacles(){

    /* random obstacles - can generate more or less if modifying "numOb"
     smaller the number more obstacle you get*/

    let numOb = 0.75
    if(Math.random() > numOb) return 1
    return 0
}