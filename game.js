//Global def
let cell, firstPlayer, secondPlayer, sabuk, gear, samurai, celurit,hand;
let turn = 'first'
let weaponTiles = []
let notAllowedTiles = []
let availableCell
let lower = []
let fightStatus = 0;


// Player Object
class Player {
  constructor(turn,name,sprite,position,weapon,attackValue) {
    this.turn = turn
    this.name = name
    this.sprite = sprite
    this.position = position
    this.health = 100
    this.weapon = weapon
    this.attackValue = attackValue
  }
  playerPosition(){
      let pCell = $(`#${this.position}`)
      pCell.addClass('sprite ' + this.sprite);
  }
  changePosition(newPosition){
    $(`#${this.position}`).removeClass('sprite ' + this.sprite)
    $(`#${newPosition}`).addClass('sprite ' + this.sprite)
    this.position = newPosition;
    }
    defaultWeapon(){
        $(`#${this.name}_weapon`).attr('src', `assets/${this.weapon}.png`);
        $(`#${this.name}atkVal`).html(`Attack Value = ${this.attackValue}`);
    }
    result(){
        $(`#pOne_btns`).css('display','none')
        $(`#pTwo_btns`).css('display','none')
        $('.wpn').css('display','none')
        $(`#${this.name}`).append(`<h1 class='winner'>WINNER</h1>`)
    }
}
// Weapons Object
class weapon {
    constructor(name, position, weaponClass, damage){
        this.name = name;
        this.position = position;
        this.weaponClass = weaponClass;
        this.damage= damage;
    }
}

const weapons = [{name: "hand"},{name: "sabuk"},{name: "gear"},{name: "samurai"},{name: "celurit"}];

//Grid Function
function createGrid(){
    let table = document.createElement('table')
    table.setAttribute('id','grid')
    $('.game-board').append(table);
    for(i=1;i<11;i++){
        let tr = document.createElement('tr')
        for(j=1;j<11;j++){
            const td = document.createElement('td')
            td.setAttribute('id',i+'-'+j)
            td.setAttribute('class',"grid-item")
            tr.append(td)
        }
        $('#grid').append(tr)
    }
}

//Creating obsacle function
function createBlock(){
    let j = 1
    while(j < 35){
        let randNum = randomNum()
        if(!((notAllowedTiles[i]==randNum) && (weaponTiles[i]== randNum) && (randNum=='1-1'))){
            notAllowedTiles[i] = randNum;
            $('#' + randNum).addClass('unavailable');
            j++
        }
    }
}

// put random weapons
function randWeapons(){
    let i = 1;
    while(i<5){
        let randNum = randomNum()
        if( !((weaponTiles[i]== randNum) && (notAllowedTiles[i]==randNum) && (randNum=='1-1'))){
            $('#' + randNum).addClass(`weapon ${weapons[i].name}`)
            $('#' + randNum).removeClass('unavailable')
            weaponTiles[i] = randNum;
            i++
        }
    }
}
//position cell and row
function cellPosition(i){
    // to identify column number
    let gridCol = i % 10;
    //to identify row number
    let gridRow = Math.floor(i / 10);
    return gridCol + "-" + gridRow;
}

//Random number function
function randomNum() {
    let randNum = Math.floor(Math.random() * 100);
    cell = cellPosition(randNum);
    return cell;
    
}

//func add weapon image and atk value in the player board
function takenWeapon(player, weapon_num){
    player.weapon = weapon_num;
    $(`.${weapon_num}`).removeClass(weapon_num);
    player.attackValue = eval(weapon_num).damage;
    $(`#${player.name}atkVal`).html("Attack Value = "+ player.attackValue);
    $(`#${player.name}_weapon`).attr('src', 'assets/' + weapon_num +'.png');
}

function dropWeapon(player, position, new_weapon){
    $(`#${player.position}`).addClass(`weapon ${player.weapon}`);
    player.changePosition(position);
    let newWeapon = takenWeapon(player, new_weapon);
    player.weapon = new_weapon;
}

/*____________________________________________________________________________
// Main-Game Actions functions  //
____________________________________________________________________________*/
//switching turn each player
function changeTurn(){
    if (turn == 'first'){
        $('#pTwo_on').css('background-color', '#d5d5d5');
        $('#pOne_on').css('background-color', '#5eb80b');
        turn = 'second';
    }
    else if (turn == 'second') {
        $('#pOne_on').css('background-color', '#d5d5d5');
        $('#pTwo_on').css('background-color', '#5eb80b');
        turn = 'first';
    }
}

// construct id from x and y points
function id_value(x, y){
    return x.toString() + '-' + y.toString();
}

// function to extract x and y values of a position
function xy_extract(position){
    let dash = position.split('-');
    let x_value = parseInt(dash[0]);
    let y_value = parseInt(dash[1]);
    return [x_value, y_value];
}

function isblocked(i){
    return $(`#${availableCell}`).hasClass('unavailable') ||  $(`#${availableCell}`).hasClass('sprite') || (i < 1) || (i > 10);
}

function lowerLoop(){
    for(let i = 0; i < lower.length; i++){
        $(`#${lower[i]}`).addClass('available');
    }
    lower = [];
}


///check here
function possibleMove(player){
    let x = xy_extract(player.position)[0];
    let y = xy_extract(player.position)[1];
    let x_new = x - 3;
    let y_new = y - 3;

    // Horizontal possible cells
    for(x_new; x_new <= x + 3; x_new++){
        availableCell = id_value(x_new, y);
        if(isblocked(x_new)){
            if(x_new == x){
                continue;
            } else if(x_new < x){
                lower = [];
            } else{
                break;
            }
        }else {
            if(x_new < x){
                lower.push(availableCell);
            }else {
                $(`#${availableCell}`).addClass('available');
            }
        }
    }
    lowerLoop();

    //Vertical possible cells
    for(y_new; y_new <= y + 3; y_new++){
        availableCell = id_value(x, y_new);
        if(isblocked(y_new)){
            if(y_new == y){
                continue;
            } else if(y_new < y){
                lower = [];
            } else{
                break;
            }
        }else {
            if(y_new < y){
                lower.push(availableCell);
            }else {
                $(`#${availableCell}`).addClass('available');
            }
        }
    }
    lowerLoop();
}

function moveOrFight() {
    $('.grid-item').unbind('click');
    if(fightStatus == 0){
        if(turn == 'first'){
            movements(firstPlayer);
        }else if(turn == 'second'){
            movements(secondPlayer);
        }
    }else{
        fight();
    }
    changeTurn();
}

function listener(cells, player){
    cells.bind("click", function(){

        $('.grid-item').removeClass('available');
        updatedPosition = $(this).attr('id');
        player.changePosition(updatedPosition);
        // take weapon
        if(weaponTiles.indexOf(updatedPosition) > -1){
            let weapon_class = ($(this).attr('class').split(' ').splice(2, 1)).toString();
            dropWeapon(player, player.position, weapon_class);
            console.log(weapon_class)
        }
        // fight activation state
        let p1_xy = xy_extract(firstPlayer.position);
        let p2_xy = xy_extract(secondPlayer.position);
        let x_diff = p1_xy[0] - p2_xy[0];
        let y_diff = p1_xy[1] - p2_xy[1];
        if(
            (x_diff == -1 && y_diff == 0) ||
            (x_diff == 1 && y_diff == 0) ||
            (x_diff == 0 && y_diff == -1) ||
            (x_diff == 0 && y_diff == 1)){
                fightStatus = 1;
                changeTurn();
        }
        moveOrFight();
    });
}

// movements function
function movements(player){
    possibleMove(player);
    let possibleCell = $('.available');
    listener(possibleCell, player);
    
}

// function to execute the attack and defend buttons
function attack(player1, player2){
    $('#' + player2.name + '_attack').unbind("click");
    $('#' + player2.name + '_defend').unbind("click");
    // show and hide attack buttons
    $('#' + player1.name + '_btns').css('display', 'block');
    $('#' + player2.name + '_btns').css('display', 'none');
    // attack button
    $('#' + player1.name + '_attack').bind("click", function(){
        let curr_val = $('#' + player2.name + '_power').val();
        let new_val = Number(curr_val) - player1.attackValue;
        $('#' + player2.name + '_power').val(new_val);
        player1.health = new_val;
        $('#'+ player2.name + '_progress_value').html(new_val + '%');
        moveOrFight();
    });
    // defend button
    $('#' + player1.name + '_defend').bind("click", function(){
        player2.weapon.damage = player2.weapon.damage / 2;
        moveOrFight();
    });
    // end game condition
    if(player2.health <= 0){
        player2.result();
    }
}

// function to execute attack and switch turns for players to fight
function fight(){
    $('.game-board').css('display','none')
    if (turn == 'first') {
        attack(firstPlayer, secondPlayer);
    }else if (turn == 'second') {
        attack(secondPlayer, firstPlayer);
    }
}

$('#start_button').click(function(){
    $( "#start" ).css('display','none')
    createGrid()
    createBlock()
    randWeapons()

    firstPlayer = new Player("first","pOne", "first", "1-1","hand",10);
    secondPlayer = new Player("second","pTwo", "second", "10-10","hand",10);
    firstPlayer.playerPosition();
    secondPlayer.playerPosition();
    firstPlayer.defaultWeapon();
    secondPlayer.defaultWeapon();

    sabuk = new weapon("sabuk", weaponTiles[0],"sabuk", 15);
    gear = new weapon("gear", weaponTiles[1],"gear", 25);
    samurai = new weapon("samurai", weaponTiles[2],"samurai", 35);
    celurit = new weapon("celurit", weaponTiles[3],"celurit", 20);
    hand = new weapon('hand', weapons[4],'hand', 10);

    moveOrFight();
});