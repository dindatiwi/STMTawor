// Player Object
class Player {
  constructor(id,name,img) {
    this.id = id;
    this.name = name;
    this.img = img
    this.health = 100;
    this.isDefending = false;
    this.weapon = {
        name: 'hand', damage: 10, src: '#'
    }
  }
}
// Weapons Object
const weapons = [{
    name: "sabuk",
    damage: 15,
    className: "weapon1",
    image: "#"
},
{
    name: "gear",
    damage: 25,
    className: "weapon2",
    image: "#"
},
{
    name: "samurai",
    damage: 30,
    className: "weapon3",
    image: "#"
},
{
    name: "celurit",
    damage: 35,
    className: "weapon4",
    image: "#"
}
];

// var up=p-10, down=p+10, left=p-1, right=p+1;

// Main Function
$('document').ready(function(){
    //player
    var playerOne = new Player('first',"STMKeras","#");
    var playerTwo = new Player('second',"STMLembek", "#");
    var placed = false;
    let turn = playerOne.id
    let table = $('#grid')
    let box = $('.grid-item')
    let weaponTiles = []
    let notAllowedTiles = [0,99]



//Grid Function

    for(i=0;i<10;i++){
        let tr = document.createElement('tr')
        for(j=0;j<10;j++){
            const td = document.createElement('td')
            td.setAttribute('id',i+'-'+j)
            td.setAttribute('class',"grid-item")
            td.textContent = `${i}:${j}`
            tr.append(td)
        }
        table.append(tr)
    }
    $('#0-0').addClass('first')
    $('#9-9').addClass('second')
    const sqArray = $('.grid-item').toArray()
    createBlock()
    dropWeapons()

//Creating obsacle function
function createBlock(){
    let j = 0
    while(j < 20){
        let randNum = randomNum()
        if(!(notAllowedTiles.includes(randNum) && placed)){
            $(sqArray[randNum]).addClass('unavailable')
            notAllowedTiles.push(randNum)
            placed = true;
            j++
        }
    }
}


// put random weapons
function dropWeapons(){
    let i = 0;
    while(i<weapons.length){
        let randNum = randomNum()
        if(!(weaponTiles.includes(randNum)) && !(notAllowedTiles.includes(randNum))){
            $(sqArray[randNum]).addClass(`${weapons[i].name}`)
            weaponTiles.push(randNum)
            i++
        }
    }
}

console.log(weaponTiles)
console.log(notAllowedTiles)

//Random number function
function randomNum() {
    return Math.floor(Math.random() * 99);
}




// click function
    $('td').click(function(){
        let newPosition = $(this).attr('id')
        let currentPosition = $('.'+turn).attr('id')
        if(!isMoveValid(currentPosition,newPosition)){
            return false
        }else{
            $('.'+turn).removeClass(turn)
            $(this).addClass(turn)
            if(turn == playerOne.id){
                turn = playerTwo.id
            }else if(turn == playerTwo.id){
                turn = playerOne.id
            }
        }
      });

    //   move Function
    function isMoveValid(currentPosition,newPosition){
        let cpR = getRow(currentPosition)
        let cpC = getCol(currentPosition)
        let npR = getRow(newPosition)
        let npC = getCol(newPosition)
        let rMove = Math.abs(cpR-npR)
        let cMove = Math.abs(cpC-npC)
        console.log(rMove)
        console.log(cMove)
        if( rMove <= 3 && cMove == 0){
            return true
        }
        else if( cMove <= 3 && rMove == 0){
            return true
        }else{
            return false
        }
    }
    function getRow(cell){
        let row = cell
        row = row.split('-')
        return row[0]
    }
    function getCol(cell){
        let col = cell
        col = col.split('-')
        return col[1]
    }
})
