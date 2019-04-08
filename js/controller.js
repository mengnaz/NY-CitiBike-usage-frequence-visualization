
var geoJSON = {"type": "FeatureCollection", "features": []};
document.getElementById('file').onchange = function(){
    var file = this.files[0];
    var reader = new FileReader();
    reader.onload = function(progressEvent){
        // Entire file
        //console.log(this.result);
        // By lines
        var lines = this.result.split('\n');
        for(var i = 1; i < lines.length-1; i++){
            var row=lines[i].split(',');

            var point = [+row[3], +row[2]];
            var feature = {
                "type": "Feature",
                "properties": {},
                "geometry": {"type": "point", "coordinates": point}
            };
            feature.properties['start station id'] = row[1];
            feature.properties['borrow_frequency'] = row[4];
            geoJSON.features.push(feature);
        }
        map.data.addGeoJson(geoJSON);
        var data=map.data.j.j;
        for (var key in data){
            var value = data[key];
            if(value.l['borrow_frequency']<=260){
                map.data.overrideStyle(value,{ icon: "./assets/blue_MarkerL.png"});
            }
            if(260<value.l['borrow_frequency']&&value.l['borrow_frequency']<1375){
                map.data.overrideStyle(value,{ icon: "./assets/darkgreen_MarkerM.png"});
            }
            else if(value.l['borrow_frequency']>=1375){
                map.data.overrideStyle(value,{ icon: "./assets/red_MarkerH.png"});
            }
        }
    };
    reader.readAsText(file);
};
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.742, lng: -73.954 },
        zoom: 14,
        disableDefaultUI: false,
        mapTypeControl: false});
}

function selectLow(){
    var data=map.data.j.j;

    for (var key in data){
        var value = data[key];
        map.data.overrideStyle(value, {visible:false});
    }

    for (var key in data){
        var value = data[key];
        if(value.l['borrow_frequency']<=260){
            map.data.overrideStyle(value, {visible:true});
        }
    }
}

function selectMed(){
    var data=map.data.j.j;
    for (var key in data){
        var value = data[key];
        map.data.overrideStyle(value, {visible:false});
    }
    for (var key in data){
        var value = data[key];
        if(260<value.l['borrow_frequency']&&value.l['borrow_frequency']<1375){
            map.data.overrideStyle(value, {visible:true});
        }
    }
}

function selectHigh(){
    var data=map.data.j.j;
    for (var key in data){
        var value = data[key];
        map.data.overrideStyle(value, {visible:false});
    }

    for (var key in data){
        var value = data[key];
        if(value.l['borrow_frequency']>=1375){
            map.data.overrideStyle(value, {visible:true});
        }
    }
}

function selectAll(){
    var data=map.data.j.j;
    for (var key in data){
        var value = data[key];
        map.data.overrideStyle(value, {visible:true});
    }
}

this.initMap();


map.data.addListener('click', (event)=>{
    console.log(event.feature.l);
    var html='<b>start station id:</b> '+event.feature.l['start station id']+'<br>';
    html+='<b>borrow_freqency:</b> '+event.feature.l['borrow_frequency']+'</b>';
    var infowindow = new google.maps.InfoWindow({
        content: html
    });
    infowindow.setPosition(event.feature.getGeometry().get());
    infowindow.setOptions({pixelOffset: new google.maps.Size(0,-30)});
    infowindow.open(map);
});