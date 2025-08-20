const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/10X0-CCSv7FenZP1YaKlDSE-PD4LSZAgpzT5Rs9F8hvA/export?format=csv&id=10X0-CCSv7FenZP1YaKlDSE-PD4LSZAgpzT5Rs9F8hvA&gid=0";
let fuse;

// Normalize text: lowercase + ignore word order
function normalizeText(str) {
  return str
    .toLowerCase()
    .split(/\s+/)
    .sort()
    .join(" ");
}

// Load sheet data
fetch(SHEET_CSV_URL)
  .then(res => res.text())
  .then(text => {
    let rows = text.split("\n").map(r => r.split(","));
    // Each entry: search in col5 (index 4), return col1 (index 0)
    let dataset = rows.map(r => ({
      key: normalizeText(r[4] || ""),   // column 5
      value: r[0] || ""                 // column 1
    }));

    fuse = new Fuse(dataset, {
      keys: ["key"],
      includeScore: true,
      threshold: 0.4,
      ignoreLocation: true,
    });
  });

// Search function
function searchSheet(query, n = 5) {
  if (!fuse) return [];
  let normQuery = normalizeText(query);
  let results = fuse.search(normQuery, { limit: n });
  return results.map(r => r.item.value); // return only column-1 values
}

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