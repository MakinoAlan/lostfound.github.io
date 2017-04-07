var map1;
var map2;
function initMap() {
  map1 = new google.maps.Map(document.getElementById('map1'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });
  map2 = new google.maps.Map(document.getElementById('map2'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });
  if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(data){
        var pos = {
          lat: data.coords.latitude,
          lng: data.coords.longitude
        };
        map1.setCenter(pos);
        map2.setCenter(pos);
        addLost();
        addFound();
      });
  }
  else {alert('Cannot get current location!');}
};

function addLost(){
  var u = $('#username').html();
  $.ajax({
    method:"POST",
    url:"/posts/allLost"
  }).done(function(data){
    var marker;
    var markers = [];
    var infos = [];
    var infowindow = new google.maps.InfoWindow();
    for(var i = 0;i<data.length;i++){
      var pos = {
        lat: parseFloat(data[i].Lat),
        lng: parseFloat(data[i].Long)
      };
      marker = new google.maps.Marker({
        position: pos,
        map: map1
      });
      var content = data[i].Des;
      if (markers.length!=0){
        for (var j = markers.length-1;j>=0;j--){
          if(marker.getPosition().lat()==markers[j].getPosition().lat()&&marker.getPosition().lng()==markers[j].getPosition().lng()){
            content = content+"<br />----------<br />"+infos[j];
            break;                    
          }
        }
      }
      markers.push(marker);
      infos.push(content);
    
      google.maps.event.addListener(marker, 'click', (function(marker,i) {
        return function() {
          infowindow.setContent(infos[i]);
          infowindow.open(map1, marker);
        }
      })(marker,i));
    }
  }
)};
function addFound(){
var u = $('#username').html();
  $.ajax({
    method:"POST",
    url:"/posts/allFound"
  }).done(function(data){
    var marker;
    var markers = [];
    var infos = [];
    var infowindow = new google.maps.InfoWindow();
    for(var i = 0;i<data.length;i++){
      var pos = {
        lat: parseFloat(data[i].Lat),
        lng: parseFloat(data[i].Long)
      };
      marker = new google.maps.Marker({
        position: pos,
        map: map2
      });
      var content = data[i].Des;
      if (markers.length!=0){
        for (var j = markers.length-1;j>=0;j--){
          if(marker.getPosition().lat()==markers[j].getPosition().lat()&&marker.getPosition().lng()==markers[j].getPosition().lng()){
            content = content+"<br />----------<br />"+infos[j];
            break;                    
          }
        }
      }
      markers.push(marker);
      infos.push(content);
    
      google.maps.event.addListener(marker, 'click', (function(marker,i) {
        return function() {
          infowindow.setContent(infos[i]);
          infowindow.open(map2, marker);
        }
      })(marker,i));
    }
  }
)};
  

