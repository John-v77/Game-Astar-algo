//global variable for the file

    //canvas
    let canvas, ctx

    //terain
    let terrain


    //map 
    let numTiles = 10
        // size in px
    let tileSize = 68
    let mapSize = tileSize * numTiles

    /*  world map - list to be use for generating obstacles 
        and use for path finding Algos                  */
    worldMap = []

    
    // Path algo
    let isClickedOnce = false
    let startPoint
    let destinationPoint

    let pathStart = [numTiles, numTiles]
    let pathEnd = [0,0]
    let currentPath = []



//******************   On Load   **********************************/
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

    // on mouse click
    canvas.addEventListener("click",   userClick, false)
    
}


//**************************************************** Game Logic ****************************************************


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

    renderWorlMap()
}

// #3
function createObstacles(){

    /* random obstacles - can generate more or less if modifying "numOb"
     smaller the number more obstacle you get*/

    let numOb = 0.75
    if(Math.random() > numOb) return 1
    return 0
}


// #4

function renderWorlMap(){

    //check for edge cases
    if(worldMap.length === 0) return

    for(let x=0; x<numTiles; x++){
        for(let y=0; y<numTiles; y++){
            drawSquare(worldMap[x][y], x, y)
        }
    }

}


// #5
function drawSquare(colorNumber, x, y){

    let colorZ
    let newX = (x+1)*tileSize
    let newY = (y+1)*tileSize

    switch(colorNumber){
        case 1:
            colorZ = '#000000' //black - obstacle
            break;
        case 3:
            colorZ = '#00FF00' //green - start
            break;
        case 5:
            colorZ = '#D3AF37' //gold - finish
            break;
        case 9:
            colorZ = '#F0F0F0' //visited
            break;
        default:
            colorZ = '#cccccc' //light grey - open terrain
    }

    //chages the color of the fill
    ctx.fillStyle = colorZ

    //draw the rectangler
    ctx.fillRect(newX, newY, tileSize, tileSize)
}

function drawPicture(tileNumber, x, y){
    
    let picTile = new Image
    picTile.src = 'https://livedoor.blogimg.jp/kamekameboy/imgs/9/d/9d34d6fc.png'
    let newX = (x+1)*tileSize
    let newY = (y+1)*tileSize

    let cropX
    let cropY

    switch(tileNumber){
        case 1:
            cropX = 945
            cropY = 469
            break;
        case 3:
            cropX = 605
            cropY = 310
            break;
        case 5:
            cropX = 790
            cropY = 205
            break;
        default:
            cropX = 808
            cropY = 471
    }
    
    picTile.onload = function(){

        ctx.drawImage(picTile, cropX, cropY, tileSize, tileSize, newX, newY, tileSize, tileSize)
    }

}




//*********************** User Input *****************************

// #6
function userClick(e){
    
    // console.log(e)


    //             console.log(e.pageX, 'x')
    //             console.log(e.pageY, 'y')


    // grab mouse coordinates
    let x = e.pageX
    let y = e.pageY

    // adjust coordinates for to canvas only
    x -= canvas.offsetLeft
    y -= canvas.offsetTop

    
    // translate coordinates in tile position
    x =  Math.floor(x/tileSize) - 1
    y =  Math.floor(y/tileSize) - 1


    console.log(x, y, 'worldCell')
    // drawSquare(3,x,y)


    setTravelPoints(x,y)

    

}


// #7
function setTravelPoints(x, y){

    // console.log('initalizing' + 'setTravelPoints')

    console.log('is valid:    ' + (isValidPoint(x,y)))

    if(!isValidPoint(x,y)) return           //if the point is an obstacle exit

    isClickedOnce = !isClickedOnce

    //clear previous travel point
    if(isClickedOnce && startPoint && destinationPoint){
        worldMap[startPoint[0]][startPoint[1]] = 0
        worldMap[destinationPoint[0]][destinationPoint[1]] = 0
    }

    if(isClickedOnce) {
        startPoint = [x,y]
        worldMap[x][y] = 3   // add the value of the starting point on the map
        console.log('valueStart : ' + worldMap[x][y])
    }else{
        destinationPoint = [x,y]  // add the value of the end point on the map
        worldMap[x][y] = 5
        console.log('valueEnd : ' + worldMap[x][y])
        isClickedOnce = false  // resets the two click series
    }

    renderWorlMap()

        //guard clause
    if(startPoint && destinationPoint) {
    
    //finding path
    let pathStart = { x: startPoint[0] , y: startPoint[1]}
    let pathEnd = { x: destinationPoint[0] , y: destinationPoint[1]}
    findPath(pathStart, pathEnd)

    findNeighbours(startPoint[0], startPoint[1])


    let pathZ = calculatePath(pathStart, pathEnd)
    console.log('final***********', pathZ)
    // aStarAlgo(pathStart, pathEnd)

    pathZ.forEach(el => { drawSquare(9, el[0], el[1]) }) 
    
    }
}


// #8
function isValidPoint(x,y){

    //guard clause
    if(x > numTiles-1 || x < 0) return false
    if(y > numTiles-1 || y < 0) return false

    if(worldMap[x][y] === 0 || worldMap[x][y] === 5) return true
    return false
}


// once click start  - set point and draw again -
// once click 2 time - set end - create animation along the path - start animation

/*  *** The A-star Algorithm *** */

     /* world is a 2d array
        pointStart = [x,y]    */

// main Function for finding Path

// #9
function findPath(pathStart, pathEnd){

    console.log('finding path')
    // in case have rough terrain, but not blocked
    let maxValofWalkableTile = 0

    let worldSize = numTiles^2

    //more path finding algorithms will be added later 
    let distanceFunction = ManhattanDistance(pathStart, pathEnd);

    console.log("distanceFunction: ", distanceFunction)
}


// #10
// function to calculate distance
function ManhattanDistance(Point, Goal){
    //linear movement - no diagonals
    let res =  Math.abs(Point.x - Goal.x) + Math.abs(Point.y - Goal.y)

    console.log(res)

    return res
}


// #11
function findNeighbours(x,y){
    let north = +y-1
    let south = +y+1

    let east = +x+1
    let west = +x-1

    let result = []

    console.log('north: ', north,
                'south: ', south,
                'east: ', east,
                'west: ', west

    )


    //North - check if out of boundries
    if(north > -1 && isValidPoint(x,north)){
        result.push({x:x, y:north})}
    
    //South
    if(south < numTiles && isValidPoint(x,south)){
        result.push({x:x, y:south})
    }

    //East
    if(east < numTiles && isValidPoint(east, y)){
        result.push({x:east, y:y})
    }

    //West
    if(west > -1 && isValidPoint(west, y)){
        result.push({x:west, y:y})
    }

    console.log('result: ', result)
    return result
}


// #12
function Node(Parent, Point){

    console.log("parent :",  Parent)
    console.log("Point :",  Point)

    let newNode = {
        // pointer to another Node object
        Parent:Parent,
        
        //array index of this Node in the world linear array
        valueZ:Point.x + (Point.y * numTiles),
        
        // the location coordinates of this Node
        x:Point.x,
        y:Point.y,
        
        // the heuristic estimated cost
        // of an entire path using this node
        f:0,
        // the distanceFunction cost to get 
        // from the starting point to this node
        g:0
    }

    return newNode
}



// #13
function calculatePath(pathStart, pathEnd){

    // creates Nodes from the Start and End x,y coordinates

    let xPathStart = Node(null, {x:pathStart.x, y: pathStart.y})
    let xPathEnd = Node(null, {x:pathEnd.x, y: pathEnd.y})

    // create an array that will map all the vizited points
    let AStar = new Array(numTiles)
    
    // list of currently open Nodes
    let Open = [xPathStart]

    //list of closed Nodes
    let Closed = []

    // list of the final output array
    let finalResult = []

    // reference to a Node nearby
    let nextNeighbours

    // reference to a Node - that is considered now
    let currentNode

    // reference to a Node - that starts the path in question
    let myPath

    // temp integers variables used in calculations
    let length, max, min, i, j;


    //iterate throught the open list until none are left
    // loop
    length = Open.length

    while( length = Open.length){
        max = numTiles
        min = -1

        for( i=0; i<length; i++){
            if(Open[i].f < max){
                max = Open[i].f
                min = i
            }
        }


        //grab the next node and remove it form Open array
        currentNode = Open.splice(min,1)[0]

        // it it the destination node?
        if(currentNode.valueZ === xPathEnd.valueZ){
            console.log('destination found')

            myPath = Closed[Closed.push(currentNode) - 1]
            do{
                finalResult.push([myPath.x, myPath.y])
            }while (myPath = myPath.Parent) 
            
            // clear the working arrays
            AStar = Closed = Open = []
            // we want to return start to finish

            finalResult.reverse()
        }else{

            //find the next walkable tiles
            nextNeighbours = findNeighbours(currentNode.x, currentNode.y)

            // test each one that hasn't been tried already
            nextNeighbours.forEach(el =>{
                myPath = Node(currentNode, el)
                if(!AStar[myPath.valueZ]){

                    //estimated cost of this particular route so far
                    myPath.g = currentNode.g + ManhattanDistance(el, currentNode)

                    //estimated cost of entire guessed route to the destination
                    myPath.f = myPath.g + ManhattanDistance(el, xPathEnd)

                    //remember this new path for testing above
                    Open.push(myPath)


                    //mark this node in the world graph as visited
                    AStar[myPath.valueZ] = true

                    console.log(AStar)
                }
            })
            // remember this route as having no more untested options
            
        }

    } // keep iterating until the Open list is empty
    return finalResult
}
