
let inputs = [];


const nameString = document.createElement("div");
nameString.innerHTML = "Пожалуйста введите своё имя";
document.body.appendChild(nameString);

const input = document.createElement("input");
document.body.appendChild(input);
let nameInput = input;

for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const titleElement = document.createElement("div");
    titleElement.innerHTML = q.title;
    document.body.appendChild(titleElement);
    //ввод текста
    const input = document.createElement("input");
    inputs[i] = input;
    document.body.appendChild(input);
}


const button = document.createElement("input");
button.type = "button";
button.value = "Проверить";


let win = false;

button.onclick = () => {
    if (!win) {
        fetch("http://localhost:8080/testFinished", {
            method: "POST",
            body: JSON.stringify({
                student: nameInput.value,
                answers: inputs.map(q => q.value),
            })
        })
            .then((res) => {
                return res.json();
            })
            .then((points) => {
                const winString = document.createElement("h2");
                winString.innerHTML = `Поздравляю, вы набрали ${points} очков!!!`;
                document.body.appendChild(winString);
            })
        win = true;
    }
}

document.body.appendChild(button);