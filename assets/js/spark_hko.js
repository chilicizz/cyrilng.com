//const sparkBaseUrl = "https://spark.cyrilng.com";
const sparkBaseUrl = "http://localhost:8080";

function subscribeToHkoWarnings() {
    const evtSource = new EventSource(sparkBaseUrl + "/hko/warnings/stream");
    evtSource.onmessage = (event) => {
        const warnings = JSON.parse(event.data);
        warnings.details.forEach(element => {
            console.log("contents: " + element["contents"]);
            console.log("subtype: " + element["subtype"]);
            console.log("warningStatementCode: " + element["warningStatementCode"]);
            console.log("updateTime: " + element["updateTime"]);
            var description;
            if (Object.hasOwn(element, "subtype")) {
                description = WARNING_DESCRIPTION_MAP[element["subtype"]];
            } else {
                description = WARNING_DESCRIPTION_MAP[element["warningStatementCode"]];
            }
            console.log(description);
        });
    };
    evtSource.onerror = (err) => {
        console.error("EventSource failed:", err);
    };
    return evtSource;
};

const WARNING_DESCRIPTION_MAP = {
  "WFIREY": "Yellow Fire Danger Warning",
  "WFIRER": "Red Fire Danger Warning",
  "WRAINA": "Amber Rainstorm Warning",
  "WRAINR": "Red Rainstorm Warning",
  "WRAINB": "Black Rainstorm Warning",
  "TC1": "Standby Signal No.1",
  "TC3": "Strong Wind Signal No.3",
  "WTCPRE8": "Pre-8 Tropical Cyclone Special Announcement",
  "TC8NE": "No.8 North East Gale or Storm",
  "TC8SE": "No.8 South East Gale or Storm",
  "TC8SW": "No.8 South West Gale or Storm",
  "TC8NW": "No.8 North West Gale or Storm",
  "TC9": "Increasing Gale or Storm No.9",
  "TC10": "Hurricane Signal No.10",
  "WTCSGNL": "Tropical Cyclone Signals Cancelled",
  "CANCEL": "All Signals Cancelled",
  "WFROST": "Frost Warning",
  "WHOT": "Very Hot Weather Warning",
  "WCOLD": "Cold Weather Warning",
  "WMSGNL": "Strong Monsoon",
  "WFNTSA": "Flooding in the Northern New Territories",
  "WL": "Landslip Warning",
  "WTMW": "Tsunami Warning",
  "WTS": "Thunderstorm Warning",
};