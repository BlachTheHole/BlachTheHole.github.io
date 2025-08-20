const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/10X0-CCSv7FenZP1YaKlDSE-PD4LSZAgpzT5Rs9F8hvA/export?format=csv&id=10X0-CCSv7FenZP1YaKlDSE-PD4LSZAgpzT5Rs9F8hvA&gid=0";
let data = [];
let fuse;

// Load Google Sheet CSV
fetch(SHEET_CSV_URL)
    .then(res => res.text())
    .then(text => {
    let rows = text.split("\n").map(r => ({ value: r.split(",")[4] })); // first column
    data = rows;
    fuse = new Fuse(data, {
        keys: ["value"],
        includeScore: true,
        threshold: 0.4,  // lower = stricter match
        ignoreLocation: true,
        minMatchCharLength: 2
    });
});

    // Handle input
document.getElementById("searchBox").addEventListener("input", e => {
    let query = e.target.value;
    if (!fuse) return;
    let results = fuse.search(query, { limit: 5 });
    document.getElementById("results").innerHTML = results.map(r => `<li>${r.item.value} (score: ${r.score.toFixed(3)})</li>`).join("");
});