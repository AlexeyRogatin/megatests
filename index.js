const http = require("http");
const fs = require("fs");

const correctAnswers = ["Антананариво", "1 2 3"];
const questions = [
    {
        title: "Как называется столица Мадагаскара?",
        randomOrder: false,
        points: 10,
    },
    {
        title: "Введите 1 2 3 в случайном порядке через пробел",
        randomOrder: true,
        points: -100,
    },
];

function listener(req, res) {
    if (req.url === '/') {
        const fileString = `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        
        <body>
        
            <script>
                const questions = ${JSON.stringify(questions)};
                ${fs.readFileSync("./generateForm.js").toString()}
            </script>
        
        </body>
        
        </html>`;

        res.statusCode = 200;
        res.end(fileString);
    } else if (req.url === "/testFinished") {
        const data = [];
        req.on("data", (chunk) => {
            data.push(chunk);
        });
        req.on("end", () => {
            const { student, answers } = JSON.parse(data);

            let points = 0;
            for (let i = 0; i < questions.length; i++) {
                const q = questions[i];
                if (!q.randomOrder) {
                    if (correctAnswers[i] === answers[i]) {
                        points += q.points;
                    }
                } else {
                    let words = correctAnswers[i].split(' ');
                    let ourWords = answers[i].split(' ');
                    let correctWords = 0;
                    for (let l = 0; l < words.length; l++) {
                        for (let d = 0; d < ourWords.length; d++) {
                            if (words[l] === ourWords[d]) {
                                correctWords++;
                            }
                        }
                    }
                    if (correctWords === words.length && correctWords === ourWords.length) {
                        points += q.points;
                    }
                }
            }

            const students = JSON.parse(fs.readFileSync("./results.json").toString());
            students.push({ student, points });
            fs.writeFileSync("./results.json", JSON.stringify(students));

            res.end(JSON.stringify(points));
        })
    }
}

const server = http.createServer(listener);

server.listen(8080, 'localhost');