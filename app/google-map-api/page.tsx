'use client';

export default async function Page(): Promise<JSX.Element> {
    const apiUrlPrefixes = {
      geocodeApi: 'https://maps.googleapis.com/maps/api/geocode/json',
      nearbyApi: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
      placeDetailApi: 'https://maps.googleapis.com/maps/api/place/details/json',
    };
    const address = '5034 39 ST INNISFAIL AB CANADA T4G1V3';
    const encodedAddr = encodeURIComponent(address);
    const key = 'AIzaSyBPHofs9Od9CO6iojmaOjnpuqIOcB7C4oY';

    lat: String;
    lng: String;
    geocodeError: String;
    nearbyJson: String;
    nearbyError: String;

    fetch(`${apiUrlPrefixes.geocodeApi}?address=${encodedAddr}&region=ca&key=${key}`, {
        method: 'GET',
        headers: {
            "Accept": "application/json",
        }
    }).then(response => response.json())
    .then(json => {
        const latitude = json.results[0].geometry.location.lat;
        const longitude = json.results[0].geometry.location.lng;
        console.log(`lat = ${latitude}, lng = ${longitude}`);
        // nearbySearch('' + latitude, '' + longitude);
        const keyword = encodeURIComponent('cibc bank');
        const loc = encodeURIComponent(latitude + ',' + longitude);
        // CORS issue here
        // https://issuetracker.google.com/issues/35827564?pli=1
        // google replied that it won't fix since the place-api is intended to call from server side, not client side.
        fetch(`${apiUrlPrefixes.nearbyApi}?location=${loc}&radius=50000&type=bank&keyword=${keyword}&key=${key}`, {
            method: 'GET',
            headers: {
                "Accept": "application/json",
            }
        }).then(response => response.json())
            .then(json => {
                console.log('nearby api result = ' + JSON.stringify(json));
            }).catch(err2 => {
            console.log('fail to call nearby api', err2);
        })
    }).catch(err => {
       console.log('fail to call geocode api', err);
    });

    function handleNearbySearch(e) {
        e.preventDefault();
        var formData = new FormData(e.target);
        const formValues = Object.fromEntries(formData);
        console.log('form values', formValues);
    }

    return (<div>
        <h1>CIBC Bank near me V3</h1>
        <br />
        <form onSubmit={handleNearbySearch}>
            <label htmlFor="#address">Address</label>
            <input placeholder="Enter your preferred address"
                   type={"text"}
                   id="address"
                   name="address"
            />
            <div style={{display: "flex", justifyContent: "center"}}>
                <button type="submit">Submit</button>
            </div>
        </form>
    </div>)
}