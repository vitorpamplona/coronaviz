/**
    Process Google Location History Takeout Files 
*/ 

const STARTING_DATE = new Date("Dec 1, 2019 00:00:00:000").getTime();

function processGoogleTakout(lines) {
    console.log("Importing My Locations after Dec 1, 2019 00:00:00:000: " + STARTING_DATE);

    var newArr = JSON.parse(lines);
    var locations = [];

    if (newArr.locations) {
        console.log("Locations ", newArr.locations.length);
        for (var i=0; i<newArr.locations.length; i++) {
            //console.log("Locations ", newArr.locations[i].timestampMs);
            if (newArr.locations[i].timestampMs > STARTING_DATE) {
                locations.push( 
                    {lat: newArr.locations[i].latitudeE7 * (10 ** -7), 
                    long: newArr.locations[i].longitudeE7 * (10 ** -7),
                    time: newArr.locations[i].timestampMs} );
            }
        }    
    }

    if (newArr.timelineObjects) {
        console.log("Timeline ", newArr.timelineObjects.length);
        for (var i=0; i<newArr.timelineObjects.length; i++) {
            //console.log("Timeline ", newArr.timelineObjects[i]);
            if (newArr.timelineObjects[i].placeVisit && newArr.timelineObjects[i].placeVisit.location) {
                if (newArr.timelineObjects[i].placeVisit.duration.startTimestampMs > STARTING_DATE) {
                    locations.push( 
                       {lat: newArr.timelineObjects[i].placeVisit.location.latitudeE7 * (10 ** -7), 
                       long: newArr.timelineObjects[i].placeVisit.location.longitudeE7 * (10 ** -7), 
                       time: newArr.timelineObjects[i].placeVisit.duration.startTimestampMs} );
                }
            } 

            if (newArr.timelineObjects[i].activitySegment && newArr.timelineObjects[i].activitySegment.startLocation) {
                if (newArr.timelineObjects[i].activitySegment.duration.startTimestampMs > STARTING_DATE) {
                    locations.push(
                        {lat: newArr.timelineObjects[i].activitySegment.startLocation.latitudeE7 * (10 ** -7), 
                        long: newArr.timelineObjects[i].activitySegment.startLocation.longitudeE7 * (10 ** -7), 
                        time: newArr.timelineObjects[i].activitySegment.duration.startTimestampMs} );
                }
            } 
        }
    }

    console.log("Places Imported " + locations.length);
    return locations;  
}