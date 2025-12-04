const sparkBaseUrl = "https://spark.cyrilng.com";
//const sparkBaseUrl = "http://localhost:8080";

function subscribeToHkoWarnings(eventHandlerFunction) {
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === "") {

    }
    const evtSource = new EventSource(sparkBaseUrl + "/hko/warnings/stream");
    evtSource.onmessage = (event) => {
        const warnings = JSON.parse(event.data);
        //console.log("Received HKO warnings:", warnings);
        const responseArray = [];
        if (!warnings.hasOwnProperty("details")) {
            eventHandlerFunction(["no active weather warnings"]);
            return;
        } else {
            warnings.details.forEach(element => {
                var description;
                if (Object.hasOwn(element, "subtype")) {
                    description = WARNING_DESCRIPTION_MAP[element["subtype"]];
                } else {
                    description = WARNING_DESCRIPTION_MAP[element["warningStatementCode"]];
                }
                // console.log(JSON.stringify(element));
                responseArray.push(description);
            });
            eventHandlerFunction(responseArray);
        }
    };
    evtSource.onerror = (err) => {
        console.error("Failed to connect to stream: ", err);
        eventHandlerFunction(["link weather warnings"]);
    };
    return evtSource;
};

function concatenateHkoWarnings(warnings) {
    return "HKO: " + warnings.join(" | ");
}

function createList(warnings) {
    var warning_list = document.getElementById("hko_warnings");
    warning_list.innerHTML = "";

    var link = document.createElement("a");
    link.href = "https://www.hko.gov.hk/en/wxinfo/dailywx/wxwarntoday.htm";
    link.textContent = concatenateHkoWarnings(warnings);
    
    warning_list.appendChild(link);
}

function addToMarquee(text) {
    //console.log("addToMarquee: " + text);
    var marquee = document.getElementById("main_marquee");
    marquee.innerHTML = ""

    var link = document.createElement("a");
    link.href = "https://www.hko.gov.hk/en/wxinfo/dailywx/wxwarntoday.htm";
    
    var div = document.createElement("div");
    div.className = "marquee_text";
    div.textContent = text || "";

    link.appendChild(div);
    marquee.appendChild(link);
}

const WARNING_DESCRIPTION_MAP = {
  "WFIREY"  :   "Yellow Fire Danger Warning",
  "WFIRER"  :   "Red Fire Danger Warning",
  "WRAINA"  :   "Amber Rainstorm Warning",
  "WRAINR"  :   "Red Rainstorm Warning",
  "WRAINB"  :   "Black Rainstorm Warning",
  "TC1"     :   "Standby Signal No.1",
  "TC3"     :   "Strong Wind Signal No.3",
  "WTCPRE8" :   "Pre-8 Tropical Cyclone Special Announcement",
  "TC8NE"   :   "No.8 North East Gale or Storm",
  "TC8SE"   :   "No.8 South East Gale or Storm",
  "TC8SW"   :   "No.8 South West Gale or Storm",
  "TC8NW"   :   "No.8 North West Gale or Storm",
  "TC9"     :   "Increasing Gale or Storm No.9",
  "TC10"    :   "Hurricane Signal No.10",
  "WTCSGNL" :   "Tropical Cyclone Signals Cancelled",
  "CANCEL"  :   "All Signals Cancelled",
  "WFROST"  :   "Frost Warning",
  "WHOT"    :   "Very Hot Weather Warning",
  "WCOLD"   :   "Cold Weather Warning",
  "WMSGNL"  :   "Strong Monsoon",
  "WFNTSA"  :   "Flooding in the Northern New Territories",
  "WL"      :   "Landslip Warning",
  "WTMW"    :   "Tsunami Warning",
  "WTS"     :   "Thunderstorm Warning",
};