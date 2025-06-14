let secretNum = Math.ceil(Math.random() * 10);
let tries = 0;

function restart() {
    secretNum = Math.ceil(Math.random() * 10);
    tries = 0;
}

function check(num) {
    if(num > secretNum) {
        alert(`Ваше число больше загаданного. Осталось попыток: ${5 - tries}`);
        return false;
    }
    else if(num === secretNum) {
        alert(`Вы угадали число с ${tries} попытки.`);
        return true;
    }
    else {
        alert(`Ваше число меньше загаданного. Осталось попыток: ${5 - tries}`);
        return false;
    }
}

function guessNum(num) {
    tries++;

    if(tries === 5) {
        alert(`Вы потратили все 5 попыток так и не угадав число.`);
        restart();
        return;
    }
    
    const isGuessed = check(num);
    if(isGuessed) {
        restart();
    }
}