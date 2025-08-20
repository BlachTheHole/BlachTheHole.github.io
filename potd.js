const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/10X0-CCSv7FenZP1YaKlDSE-PD4LSZAgpzT5Rs9F8hvA/export?format=csv&id=10X0-CCSv7FenZP1YaKlDSE-PD4LSZAgpzT5Rs9F8hvA&gid=0";
let data = [];
let fuse;

// Load Google Sheet CSV
fetch(SHEET_CSV_URL)
    .then(res => res.text())
    .then(text => {
        let rows = text.split("\n").map(r => {
            let cols = r.split(",");
            return { value: cols[4], firstCol: cols[0] }; // 5th column for search, 1st column for output
        });
        data = rows;
        fuse = new Fuse(data, {
            keys: ["value"],
            includeScore: true,
            threshold: 0.4,
            ignoreLocation: true,
            minMatchCharLength: 2
        });
    });

document.getElementById("searchBox").addEventListener("input", e => {
    let query = e.target.value;
    if (!fuse) return;
    let results = fuse.search(query, { limit: 5 });
    document.getElementById("results").innerHTML = results
        .map(r => `<li>${r.item.firstCol} (score: ${r.score.toFixed(3)})</li>`)
        .join("");
});