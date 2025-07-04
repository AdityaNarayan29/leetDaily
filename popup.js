async function getDailyQuestionSlug() {
  const query = {
    query: `
      query questionOfToday {
        activeDailyCodingChallengeQuestion {
          question {
            titleSlug
            title
            difficulty
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
  document.getElementById("question").innerText = `${question.title} (${question.difficulty})`;

  document.getElementById("open").addEventListener("click", () => {
    chrome.tabs.create({
      url: `https://leetcode.com/problems/${question.titleSlug}`
    });
  });
});
