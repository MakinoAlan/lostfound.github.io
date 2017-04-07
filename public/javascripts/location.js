$(document).ready(function(){
  $('#bt1').on('click',function(){
  	$.ajax({
      method:"GET",
      url:"http://maps.googleapis.com/maps/api/geocode/json",
      data:{"address":$('#in').val()}

  	}).done(function(data){
  		alert("address: "+data.results[0].formatted_address);
  		alert("lat: "+data.results[0].geometry.location.lat);
  		alert("long: "+data.results[0].geometry.location.lng);
  	});
  });

});