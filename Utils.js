// To check if we attack
function rC({rectangle1, rectangle2}){
    return(
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
        )
}
function output({player, enemy, timerId}){
    clearTimeout(timerId)
    document.querySelector("#End").style.display = "flex"
    if (player.health == enemy.health){
        document.querySelector("#End").innerHTML = "Tie"
    }if (player.health > enemy.health){
        document.querySelector("#End").innerHTML = "Player 1 Wins!"
    }if (player.health < enemy.health){
        document.querySelector("#End").innerHTML = "Player 2 Wins!"
    }
}
// To decrease the timer
let timer = 60;
let timerId
function decreaseTimer(){
    if (timer > 0){ 
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector("#timer").innerHTML = timer
    }else output({player, enemy, timerId})
}