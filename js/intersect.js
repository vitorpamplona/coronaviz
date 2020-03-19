/**
    Calculate intersections of two arrays of lat and long. 

    Two arrays of { Lat, Long, Time (ms) }

 */
const DIFF_1_DAY = 24 * 60 * 60 * 1000;
const DIFF_1_KM = 0.01 * 100; 

function contact(myLoc, inLoc) {
    return Math.abs(myLoc.lat - inLoc.lat) < DIFF_1_KM 
        && Math.abs(myLoc.long - inLoc.long) < DIFF_1_KM;
        //&& Math.abs(myLoc.time - inLoc.time) < DIFF_1_DAY;
}

function intersect(myLocations, infectedLocations) {
    console.log("Calculating Intersections");
    
    var risk = []
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
    }

    console.log("Found " + risk.length + " risks");

    return risk;
}