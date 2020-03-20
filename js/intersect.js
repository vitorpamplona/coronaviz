/**
    Calculate intersections of two arrays of lat and long. 

    Two arrays of { Lat, Long, Time (ms) }

 */
const DIFF_1_DAY = 24 * 60 * 60 * 1000;
const DIFF_1_KM = 0.01; 

function contact(myLoc, inLoc) {
    return Math.abs(myLoc.lat - inLoc.lat) < DIFF_1_KM * 10
        && Math.abs(myLoc.long - inLoc.long) < DIFF_1_KM * 10;
        //&& Math.abs(myLoc.time - inLoc.time) < DIFF_1_DAY;
}

function group_by_date(locations) {
    var days = new Map();
    for (var i = 0; i < locations.length; i++) {
        var dayStr = new Date(locations[i].time).toISOString().substring(0, 7);
        
        var daySet = days.get(dayStr);
        if (daySet) {
            daySet.push(locations[i]);
        } else {
            days.set(dayStr, [locations[i]]);
        }
    }

    return days;
}

function intersectByDate(myLocations, infectedLocations, progress) {
    console.log("Calculating Intersections By Date");
    var locByDate = group_by_date(myLocations);
    var infByDate = group_by_date(infectedLocations);

    console.log("Grouped");

    var risk = [];

    for (const [dayStr, myLocations] of locByDate.entries()) {
        console.log("Date ", dayStr);
        infectedLocations = infByDate.get(dayStr);
        risk = risk.concat(intersect(myLocations, infectedLocations, progress));
    }

    console.log("Risk Calculated " + risk.length);

    return risk;
}

// brute force
function intersect(myLocations, infectedLocations, progress) {
    if (!myLocations) return [];
    if (!infectedLocations) return [];

    console.log("Calculating Intersections");
    
    var risk = [];
    // brute force
    for (var i = 0; i < myLocations.length; i++) {
        var contacts = 0;
        for (var j = 0; j < infectedLocations.length; j++) {
            if (contact(myLocations[i], infectedLocations[j])) {
                contacts += 1;
            }
        }
        if (contacts > 0) {
            risk.push(myLocations[i]);
        }
        progress(Math.trunc(i*10000.00/myLocations.length)/100);
    }

    progress(100);

    console.log("Found " + risk.length + " risks");

    return risk;
}