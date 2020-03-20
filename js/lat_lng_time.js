class LatLngTime extends google.maps.LatLng {
    constructor(lat, long, time) {
        super(lat, long);
        this.time = time;
    }
}