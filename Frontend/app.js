function showTab(tab){
  document.getElementById("analyzeTab").style.display = tab === "analyze" ? "block" : "none";
  document.getElementById("dashboardTab").style.display = tab === "dashboard" ? "block" : "none";
}

async function analyze(){
  const res = await fetch("http://localhost:5000/api/analyze", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({code: code.value})
  });

  const data = await res.json();

  result.innerHTML =
    "<h3>Issues</h3>" + data.issues.join("<br>") +
    "<h3>Suggestions</h3>" + data.suggestions.join("<br>");
}

async function loadDashboard(){
  const res = await fetch("http://localhost:5000/api/dashboard/results");
  const data = await res.json();

  dashboard.innerText = JSON.stringify(data, null, 2);
}