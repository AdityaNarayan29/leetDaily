async function getDailyQuestionSlug() {
  const query = {
    query: `
      query questionOfToday {
        activeDailyCodingChallengeQuestion {
          question {
            titleSlug
            title
            difficulty
            questionFrontendId
          }
        }
      }
    `
  };

  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query)
  });

  const data = await response.json();
  return data.data.activeDailyCodingChallengeQuestion.question;
}

document.addEventListener("DOMContentLoaded", async () => {
  const question = await getDailyQuestionSlug();

  const difficultyColors = {
    Easy: "bg-green-100 text-green-800",
    Medium: "bg-orange-100 text-orange-800",
    Hard: "bg-red-100 text-red-800"
  };

  const chipClass = difficultyColors[question.difficulty] || "";
  const chipHTML = `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${chipClass} ml-2">${question.difficulty}</span>`;

  document.getElementById("question").innerHTML = `<strong>${question.questionFrontendId}.</strong><span>${question.title}</span>${chipHTML}`;


  document.getElementById("open").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "visitedToday" }, () => {
      chrome.tabs.create({
        url: `https://leetcode.com/problems/${question.titleSlug}`
      });
    });
  });
});
