// Add Fuse.js via CDN
// <script src="https://cdn.jsdelivr.net/npm/fuse.js@6.6.2"></script>
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/10X0-CCSv7FenZP1YaKlDSE-PD4LSZAgpzT5Rs9F8hvA/export?format=csv&id=10X0-CCSv7FenZP1YaKlDSE-PD4LSZAgpzT5Rs9F8hvA&gid=0";
let fuse;

// Normalize text: lowercase + ignore word order
function normalizeText(str) {
    // Lowercase, trim, remove extra spaces, keep slashes
    let words = str
        .toLowerCase()
        .replace(/[^\w\s\/]/g, "") // keep slashes for problem numbers
        .replace(/\s+/g, " ")
        .trim()
        .split(" ")
        .filter(Boolean);

    // Extract year, keywords, and problem number regardless of order
    let year = null, keywords = [], pnum = null;
    words.forEach(w => {
        if (/^\d{4}$/.test(w)) year = w;
        else if (/^p\d(\/\d)?$/.test(w)) pnum = w.replace(/\/\d/, "");
        else if (/^([a-z]+)\d{4}$/.test(w)) {
            // keyword+year, e.g. imo2001
            let match = w.match(/^([a-z]+)(\d{4})$/);
            keywords.push(match[1]);
            year = match[2];
        } else if (/^\d{4}[a-z]+$/.test(w)) {
            // year+keyword, e.g. 2001imo
            let match = w.match(/^(\d{4})([a-z]+)$/);
            year = match[1];
            keywords.push(match[2]);
        } else if (/^[a-z]+$/.test(w)) {
            keywords.push(w);
        }
    });

    // Build normalized string: "keyword(s) YEAR pX"
    let ordered = [];
    if (keywords.length) ordered.push(...keywords);
    if (year) ordered.push(year);
    if (pnum) ordered.push(pnum);

    // Add remaining words (not keyword/year/pnum)
    words.forEach(w => {
        if (
            keywords.includes(w) ||
            w === year ||
            w === pnum ||
            /^([a-z]+)\d{4}$/.test(w) ||
            /^\d{4}[a-z]+$/.test(w) ||
            /^p\d(\/\d)?$/.test(w)
        ) return;
        ordered.push(w);
    });

    return ordered.join(" ").trim();
}
// Load sheet data using a CORS proxy
// Fallback to TSV if JSON is unavailable
// ...existing code...

let fuse5, fuse9;

// Load sheet data using a CORS proxy
fetch(encodeURIComponent(SHEET_CSV_URL.replace("format=csv", "format=tsv")))
    .then(res => res.text())
    .then(tsv => {
        let lines = tsv.split("\n").filter(Boolean);
        if (lines[0].toLowerCase().includes("key") || lines[0].toLowerCase().includes("value")) {
            lines.shift();
        }
        let dataset5 = lines.map(line => {
            let cols = line.split("\t");
            return {
                value: cols[0] || "",
                key: normalizeText(cols[4] || ""),
                row: cols
            };
        });
        let dataset9 = lines.map(line => {
            let cols = line.split("\t");
            return {
                value: cols[0] || "",
                key: normalizeText(cols[8] || ""),
                row: cols
            };
        });

        fuse5 = new Fuse(dataset5, {
            keys: ["key"],
            includeScore: true,
            threshold: 0.4,
            ignoreLocation: true,
        });
        fuse9 = new Fuse(dataset9, {
            keys: ["key"],
            includeScore: true,
            threshold: 0.4,
            ignoreLocation: true,
        });
    });

// ...existing code...

function searchSheet(fuse, query, n = 5) {
    if (!fuse) return [];
    let normQuery = normalizeText(query);
    let results = fuse.search(normQuery, { limit: n });
    return results.map(r => ({
        value: r.item.value,
        key: r.item.key,
        row: r.item.row // Return the full row array
    }));
}

document.addEventListener("DOMContentLoaded", () => {
    const searchBox5 = document.getElementById("searchBox");
    const resultsList5 = document.getElementById("results");
    const searchBox9 = document.getElementById("searchBox9");
    const resultsList9 = document.getElementById("results9");

    searchBox5.addEventListener("input", () => {
        const query = searchBox5.value;
        const results = searchSheet(fuse5, query, 5);
        resultsList5.innerHTML = "";
        results.forEach(r => {
            const li = document.createElement("li");
            // Show full column 5 value (not normalized)
            li.textContent = `Day ${r.value}, Source: ${r.row[4] || ""}`;
            resultsList5.appendChild(li);
        });
    });

    searchBox9.addEventListener("input", () => {
        const query = searchBox9.value;
        const results = searchSheet(fuse9, query, 5);
        resultsList9.innerHTML = "";
        results.forEach(r => {
            const li = document.createElement("li");
            // Show full column 9 value (not normalized)
            li.textContent = `Day ${r.value}`;
            li.appendChild(document.createElement("br"));
            li.appendChild(document.createTextNode(r.row[8] || ""));
            resultsList9.appendChild(li);
        });
    });
});

// ...existing code...