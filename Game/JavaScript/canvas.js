//global variable for the file

    //canvas
    let canvas, ctx


    //sprites
        let terrain
        let Hero
        let Crystal
        let PathOfLight
        let Portal
        


    //map 
    let numTiles = 10
    let pathNumTiles = numTiles*2
        // size in px
    let backcgroundTileSize = 68
    let tileSize = backcgroundTileSize/2

    let mapSize = pathNumTiles * pathNumTiles

    /*  world map - list to be use for generating obstacles 
        and use for path finding Algos                  */
    let worldMap = []
    let travelMap = []  //x2 bigger than world map same obstacles

    
    // Path algo
    let isClickedOnce = false
    let startPoint
    let destinationPoint

    let pathStart = [numTiles, numTiles]
    let pathEnd = [0,0]
    let currentPath = []



//******************   On Load   **********************************/
window.onload=()=>{
    


    //get canvas
    canvas = document.querySelector('canvas')
    

    canvas.width = 800
    canvas.height = 800

    // get context
    ctx = canvas.getContext("2d")
    ctx.fillStyle="F0F0F0"

   

    // createWorld() executes after the images are loaded
    // on mouse click
    canvas.addEventListener("click",   userClick, false)
    





    const ListofLinks ={
        grass: {img:'https://livedoor.blogimg.jp/kamekameboy/imgs/9/d/9d34d6fc.png',
                cropX:808,
                cropY:471,
                w:68,
                h:68},

        trees: {img: 'https://livedoor.blogimg.jp/kamekameboy/imgs/9/d/9d34d6fc.png',
                cropX:945,
                cropY:469,
                w:68,
                h:68},
        
        hero:  {img: 'https://www.pngfind.com/pngs/m/685-6856402_transparent-ness-sprite-png-mega-man-x4-x.png',
                cropX:253,
                cropY:35,
                w:60,
                h:82},
                
        hero2: {img:'https://www.pngfind.com/pngs/m/339-3391874_megaman-clipart-sprite-megaman-powered-up-hd-png.png',
                cropX:202,
                cropY:47,
                w:102,
                h:139},

        pathOfLight: {img:'https://toppng.com/public/uploads/thumbnail/glowing-ball-of-light-115495310350d5n2twaon.png',
                cropX:0,
                cropY:0,
                w:190,
                h:190},

        powerUpPurple: {img:'https://e7.pngegg.com/pngimages/702/519/png-clipart-light-purple-ball-google-s-energy-ball-effects-purple-lightning-game-effect-thumbnail.png',
                cropX:50,
                cropY:50,
                w:240,
                h:240},

        powerUpRed: {img:'https://www.pngkit.com/png/detail/188-1886210_ball-of-light-png-light-effects-png.png',
                cropX:230,
                cropY:50,
                w:350,
                h:350},

        crystalsPYO: {img:'https://e7.pngegg.com/pngimages/324/441/png-clipart-sphere-euclidean-ball-light-effect-element-glass-lights.png',
                cropX:320,
                cropY:25,
                w:260,
                h:260},



    }


    loadImages(ListofLinks)

}
    
// preload images one by one
function loadImages (ListofLinks){



    console.log(ListofLinks)

    terrain = new Image
    Hero = new Image
    Crystal = new Image
    PathOfLight = new Image
    Portal = new Image

    terrain.src = ListofLinks.grass.img
    terrain.onload =()=>{console.log('terrain loaded')}

    Hero.src = ListofLinks.hero.img
    Hero.onload =()=>{console.log('terrain Hero')}

    Crystal.src = ListofLinks.crystalsPYO.img
    Crystal.onload =()=>{console.log('terrain Crystal')}

    PathOfLight.src = ListofLinks.pathOfLight.img
    PathOfLight.onload =()=>{console.log('terrain PathOfLight')}
    
    Portal.src = ListofLinks.powerUpPurple.img
    Portal.onload =()=>{console.log('terrain Portal')}

    createWorld()
}




/////**************************************************** plan ****************************************************
/*
    - use picture for here - create function do draw hero
    - use picture for goal
    - use light for path

    step 2

    - move starting poin along the way of the path -- 0.5 sec delay
    - once it reaches the destination -- redraw - disapear goal. 
    
    step 3

    - add shotting powers -- 
            - when pressing - right click - shoot ball to location -- choose a ball without orientation
    step 4

    - add rolling boulders --
        sprite that moves along the axes - 1 sec delay

    step 5

    - add diferent power balls 
        -- change color of shooting sprites
    
    step 6

    - add portal function 
            -- close the map
            -- redraw another one

    step 7 
        - add interface
        - explain the game
    
    step 8 change it to modules
*/







//**************************************************** Game Logic ****************************************************


// #1
function createWorld(){
    initiateTravelMap(numTiles)
    createsMapList(numTiles)
    console.log(worldMap)
}




// #2
function createsMapList(numOfTiles){


    // initiateTravelMap(numOfTiles)
    //creates a 2d matrix that hold information about every tile

    let val
    
    for(let x=0; x<numOfTiles; x++){

        //creates a list to hold the row data
        worldMap[x] = []
        for(let y=0; y<numOfTiles; y++){

            //polulates each list, 0=flat terrain, 1=impasable terrain
            val = createObstacles()
            worldMap[x][y] = val

            createTravelMap(x,y,val)  // translate this values to a bigger map - for calculating travel path
        }
    }

    console.log(worldMap)

    console.log(travelMap)
    renderWorlMap()
    
}


function initiateTravelMap(numOfTiles){

    let len = numOfTiles * 2  // double the size of original map
    
    for(let x=0; x<len; x++){
        travelMap[x] = []
        for(let y=0; y<len; y++){
            travelMap[x][y] = null
        }
    }
    console.log(travelMap, "travelMap")
}



function createTravelMap(x,y,val){

    let newX = x*2
    let newY = y*2
    travelMap[newX][newY] = val
    travelMap[newX+1][newY] = val
    travelMap[newX][newY+1] = val
    travelMap[newX+1][newY+1] = val
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
    if(travelMap.length === 0) return

    for(let x=0; x < (numTiles); x++){
        for(let y=0; y < (numTiles); y++){
            drawPicture(worldMap[x][y], x, y)
        }
    }

}


// #5
function drawSquare(colorNumber, x, y){

    let colorZ
    let newX = (y)*tileSize
    let newY = (x)*tileSize

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
        case 7:
            colorZ = '#0000FF' //final path
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
    ctx.font = "10px Arial";
    ctx.fillStyle = "red"
    ctx.fillText(`${x} x ${y}`, newX+(tileSize-29), newY+(tileSize/1.5));
}

function drawPicture(tileNumber, x, y){
    
    let picTile = new Image

    let newX = (x+1)*backcgroundTileSize
    let newY = (y+1)*backcgroundTileSize

    let cropX
    let cropY
    let picToRender

    switch(tileNumber){
        case 1:                 // obstacles
            cropX = 945
            cropY = 469
            picTile.src = 'https://livedoor.blogimg.jp/kamekameboy/imgs/9/d/9d34d6fc.png'
            break;
        case 3:
            cropX = ListofLinks.hero.cropX
            cropY = ListofLinks.hero.cropY
            picTile.src = ListofLinks.hero.img
            break;
        case 5:
            cropX = ListofLinks.crystalsPYO.cropX
            cropY = ListofLinks.crystalsPYO.cropY
            picTile.src = ListofLinks.crystalsPYO.img
            break;
        default:                //open tile
            cropX = 808
            cropY = 471
            picTile.src = 'https://livedoor.blogimg.jp/kamekameboy/imgs/9/d/9d34d6fc.png'   // grass
    }
    
    picTile.onload = function(){

        ctx.drawImage(picTile, cropX, cropY, backcgroundTileSize, backcgroundTileSize, newX, newY, backcgroundTileSize, backcgroundTileSize)
    }

}




//*********************** User Input *****************************

// #6
function userClick(e){

   let x, y

    // grab mouse coordinates
    if(e.pageX != undefined && e.pageY != undefined){
    x = e.pageX
    y = e.pageY
    }

    // adjust coordinates for to canvas only
    x -= canvas.offsetLeft
    y -= canvas.offsetTop

    
    // translate coordinates in tile position
    x =  Math.floor(x/tileSize)
    y =  Math.floor(y/tileSize)


    console.log(x,'| |', y)
    // drawSquare(3,x,y)

    setTravelPoints(y, x)    // inverse x,y for to adjust for vertical orientation
}


// #7
function setTravelPoints(x, y){

    if(!isValidPoint(x,y)) return           //if the point is an obstacle exit

    //clear previous travel point
    if(!isClickedOnce && startPoint && destinationPoint){
        travelMap[startPoint[0]][startPoint[1]] = 0
        travelMap[destinationPoint[0]][destinationPoint[1]] = 0
    }

    if(!isClickedOnce) {
        startPoint = [x,y]
        travelMap[x][y] = 3   // add the value of the starting point on the map
        isClickedOnce = !isClickedOnce
    }else{
        destinationPoint = [x,y]  // add the value of the end point on the map
        travelMap[x][y] = 5
        isClickedOnce = !isClickedOnce      // resets the two click series
    }

    renderWorlMap()  // the whole map need to be redrawn to clear previous points

    // guard clause
    if(startPoint && destinationPoint && !isClickedOnce) {
    
    //finding path
    let pathStart = { x: startPoint[0] , y: startPoint[1]}
    let pathEnd = { x: destinationPoint[0] , y: destinationPoint[1]}

    let pathZ = findPath(pathStart, pathEnd)
    // aStarAlgo(pathStart, pathEnd)

    console.log(pathZ, 'pathZ')
    for(let i=1; i<pathZ.length-1; i++){
        drawSquare(7, pathZ[i][0], pathZ[i][1])
    }
    
    }
    console.log(worldMap)
}


// #8
function isValidPoint(x,y){

    //guard clause
    if(x > pathNumTiles-1 || x < 0) return false
    if(y > pathNumTiles-1 || y < 0) return false

    if(travelMap[x][y] === 0 || travelMap[x][y] === 5) return true
    return false
}

/*  *** The A-star Algorithm *** */

     /* world is a 2d array
        pointStart = [x,y]    */

// main Function for finding Path

// #9


// #10
// function to calculate distance
function ManhattanDistance(Point, Goal){
    //linear movement - no diagonals
    let res =  Math.abs(Point.x - Goal.x) + Math.abs(Point.y - Goal.y)

    return res
}


// #11
function findNeighbours(x,y){
    let north = {x:x-1, y:y}
    let south = {x:x+1, y:y}

    let east =  {x:x, y:y+1}
    let west =  {x:x, y:y-1}

    let result = []


    //North - check if out of boundries
    if(north.x > -1 && isValidPoint(north.x, north.y)){
        result.push(north)}
    
    //East
    if(east.y < pathNumTiles && isValidPoint(east.x, east.y)){
        result.push(east)
    }

    
    //South
    if(south.x < pathNumTiles && isValidPoint(south.x, south.y)){
        result.push(south)
    }

    //West
    if(west.y > -1 && isValidPoint(west.x, west.y)){
        result.push(west)
    }

    return result
}


// #12
function Node(Parent, Point){


    let newNode = {
        // pointer to another Node object
        Parent:Parent,
        
        //array index of this Node in the world linear array
        valueZ:Point.x + (Point.y * pathNumTiles),
        
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
function findPath(pathStart, pathEnd){

    // creates Nodes from the Start and End x,y coordinates

    let xPathStart = Node(null, {x:pathStart.x, y: pathStart.y})
    let xPathEnd = Node(null, {x:pathEnd.x, y: pathEnd.y})

    // create an array that will map all the vizited points
    let AStar = new Array(mapSize)
    
    // list of currently open Nodes
    let Open = [xPathStart]

    //lis of closed Nodes
    let closedNodes = []

    // list of the final output array
    let finalResult = []

    // reference to a Node nearby
    let nextNeighbours

    // reference to a Node - that is considered now
    let currentNode

    // reference to a Node - that starts the path in question
    let myPath

    // temp integers variables used in calculations
    let length, max, idexZ, i, j;


    //iterate throught the open list until none are left
    // loop
    while( length = Open.length){  // if lenght is 0 - is considered false as well
        // reset to maximum cost of travel to "infinity" -- or values big enough to be ouside of boundries
        max = mapSize
        indeZ = -1

        // check in the open list for the node that has the smallest - estimate value to destination '.f'
        for(let i=0; i< length; i++){
            if(Open[i].f < max){
                max = Open[i].f    // replace value of max distance with the smallest one in the list
                indeZ = i     // remember the index for splice
            }
        }

        //grab the next node and remove it form Open array
        currentNode = Open.splice(indeZ,1)[0]

        if(!xPathStart || !xPathEnd){
        drawSquare(9, currentNode.x, currentNode.y)
        }
        // it it the destination node?
        if(currentNode.valueZ === xPathEnd.valueZ){

               // adjust for 0 index
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
                    }

                    //mark this node in the world graph as visited
                    AStar[myPath.valueZ] = true
    
            })
            // remember this route as having no more untested options
            
        }

    } // keep iterating until the Open list is empty
    return finalResult
}
