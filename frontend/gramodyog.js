// Response from Copilot for generating AI interactive questions

/* <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactive AI Quiz Bot</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    #chatbox { border: 1px solid #ccc; padding: 10px; width: 400px; height: 300px; overflow-y: auto; }
    #input { width: 300px; padding: 5px; }
    #send { padding: 5px 10px; }
    .option { margin: 5px 0; padding: 5px; border: 1px solid #007BFF; border-radius: 5px; cursor: pointer; }
    .option:hover { background-color: #f0f8ff; }
    .correct { background-color: #d4edda; }
    .wrong { background-color: #f8d7da; }
  </style>
</head>
<body>
  <h2>Interactive AI Quiz Bot</h2>
  <div id="chatbox"></div>
  <input id="input" type="text" placeholder="Enter a topic...">
  <button id="send">Generate Question</button>

  <script src="test.js"></script>
</body>
</html>

const chatbox = document.getElementById("chatbox");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");

const API_URL = "https://api.openai.com/v1/chat/completions";
const API_KEY = "YOUR_API_KEY"; // keep this secret!

async function getAIQuestion(topic) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `Generate a multiple-choice quiz question about ${topic}. Provide 4 options and mark the correct one.` }]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

function renderQuestion(questionText) {
  chatbox.innerHTML += `<p><strong>Bot:</strong> ${questionText}</p>`;

  // Example parsing (you can refine with regex or structured format)
  const options = ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"];
  options.forEach(opt => {
    const div = document.createElement("div");
    div.className = "option";
    div.innerText = opt;
    div.onclick = () => checkAnswer(div, "B"); // Example: correct answer is B
    chatbox.appendChild(div);
  });
}

function checkAnswer(selected, correct) {
  if (selected.innerText.startsWith(correct)) {
    selected.classList.add("correct");
    chatbox.innerHTML += `<p><strong>Bot:</strong> ✅ Correct!</p>`;
  } else {
    selected.classList.add("wrong");
    chatbox.innerHTML += `<p><strong>Bot:</strong> ❌ Wrong, try again!</p>`;
  }
}

sendBtn.addEventListener("click", async () => {
  const topic = input.value;
  chatbox.innerHTML += `<p><strong>You:</strong> ${topic}</p>`;
  input.value = "";

  const aiQuestion = await getAIQuestion(topic);
  renderQuestion(aiQuestion);
});
*/
