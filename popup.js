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
            stats
            topicTags {
              name
            }
          }
        }
      }
    `
  };

  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query),
  });

  const data = await response.json();
  return data.data.activeDailyCodingChallengeQuestion.question;
}

document.addEventListener("DOMContentLoaded", async () => {
  const question = await getDailyQuestionSlug();

  const difficultyColors = {
    Easy: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    Medium: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    Hard: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  };

  const chipClass = difficultyColors[question.difficulty] || "";
  const chipHTML = `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${chipClass} ml-2">${question.difficulty}</span>`;

  let acceptanceRate = "N/A";
  try {
    const stats = JSON.parse(question.stats || "{}");
    acceptanceRate = stats.acRate ? parseFloat(stats.acRate).toFixed(2) : "N/A";
  } catch {
    acceptanceRate = "N/A";
  }

  // Updated topic chip style for better visibility
  const topicChipClass = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border border-neutral-300 bg-neutral-100 text-neutral-800 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white";

  const topicsArray = question.topicTags || [];
  const topicsHTML = topicsArray.length > 0
    ? topicsArray.map((tag) =>
      `<span class="${topicChipClass} mr-1 mb-1">${tag.name}</span>`
    ).join("")
    : '<span class="text-gray-500 dark:text-gray-400">N/A</span>';

  document.getElementById("question").innerHTML = `
  <div class="text-sm font-medium">
    <strong>Leetcode  ${question.questionFrontendId}</strong>
  </div>
  <div class="mt-1 text-gray-300 text-base">
    <span>${question.title}</span>
    ${chipHTML}
  </div>
  <div class="text-sm mt-3 space-y-1">
    <div><strong>Acceptance:</strong> ${acceptanceRate}%</div>
    <div>
      <button id="toggle-topics" class="underline underline-offset-2 text-sm font-medium cursor-pointer text-inherit focus:outline-none">
        Show Topics
      </button>
      <div id="topics-list" class="mt-1 flex-wrap hidden">
        ${topicsHTML}
      </div>
    </div>
  </div>
`;

  document.getElementById("toggle-topics").addEventListener("click", () => {
    const topicsList = document.getElementById("topics-list");
    const button = document.getElementById("toggle-topics");
    const isHidden = topicsList.classList.contains("hidden");

    topicsList.classList.toggle("hidden");
    button.textContent = isHidden ? "Hide Topics" : "Show Topics";
  });


  document.getElementById("open").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "visitedToday" }, () => {
      chrome.tabs.create({
        url: `https://leetcode.com/problems/${question.titleSlug}`,
      });
    });
  });
});
