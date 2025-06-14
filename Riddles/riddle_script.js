const riddles = [
      {
        question: 'Он всё ломает, но его все любят. Без него программа — не жизнь, а мука.',
        correctAnswer: 'баг',
        hints: ['Он появляется неожиданно', 'Его ищут с лупой'],
        tries: 3,
      },
      {
        question: 'Вечно пьёт, но не воду. Пишет код, но не на бумаге.',
        correctAnswer: 'разработчик',
        hints: ['Это человек', 'Его часто кормят пиццей и кофе'],
        tries: 3,
      },
      {
        question: 'К нему заходят, чтобы выйти. Выходят, чтобы зайти. Если ошибка — всё сначала.',
        correctAnswer: 'цикл',
        hints: ['Он связан с повторением', 'Его называют вечным, если забыли условие'],
        tries: 3,
      },
      {
        question: 'Он обещает, но не факт что выполнит. Особенно если ты не await.',
        correctAnswer: 'промис',
        hints: ['Это не человек', 'Часто используется в JavaScript'],
        tries: 3,
      },
      {
        question: 'Он видит всё, но только в консоли. Не судит, только пишет.',
        correctAnswer: 'лог',
        hints: ['Это способ узнать, что происходит внутри', 'Часто содержит слово "console"'],
        tries: 3,
      }
    ];

let currentRiddleIndex = 0;
let currentTry = 0;

const card = document.getElementById('card');
const progressBar = document.getElementById('progress');

function updateProgressBar() {
    const progressPercent = (currentRiddleIndex / riddles.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
}

function showRiddle() {
    const riddle = riddles[currentRiddleIndex];
    document.getElementById('riddle').innerText = riddle.question;
    document.getElementById('hint').innerText = '';
    document.getElementById('tries').innerText = `Осталось попыток: ${riddle.tries}`;
    document.querySelector('input').value = '';
    document.querySelector('input').style.display = '';
    currentTry = 0;
    updateProgressBar();
}

function check() {
    const riddle = riddles[currentRiddleIndex];
    const input = document.querySelector('input');
    const guessedAnswer = input.value.trim().toLowerCase();

    if (!guessedAnswer) {
        alert("Введите ответ!");
        return;
    }

    currentTry++;

    if (guessedAnswer === riddle.correctAnswer.toLowerCase()) {
        alert("Правильно!");
        transitionToNextRiddle();
    } 
    else {
        const remainingTries = riddle.tries - currentTry;

        if (remainingTries > 0) {
          alert("Неправильно. Попробуйте ещё!");
          document.getElementById('hint').innerText = riddle.hints[currentTry - 1] || '';
          document.getElementById('tries').innerText = `Осталось попыток: ${remainingTries}`;
        } 
        else {
          alert(`Попытки закончились! Правильный ответ: ${riddle.correctAnswer}`);
          transitionToNextRiddle();
        }
    }
}

function transitionToNextRiddle() {
    card.classList.add('fade-out');

    setTimeout(() => {
        currentRiddleIndex++;

        if (currentRiddleIndex < riddles.length) {
          showRiddle();
        } 
        else {
          document.getElementById('riddle').innerText = "Все загадки пройдены!";
          document.getElementById('hint').innerText = '';
          document.getElementById('tries').innerText = '';
          document.querySelector('input').style.display = 'none';
          updateProgressBar();
        }

        card.classList.remove('fade-out');
    }, 600);
}

window.onload = () => {
    showRiddle();
    updateProgressBar();
};