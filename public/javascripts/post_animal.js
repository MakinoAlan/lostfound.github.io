$(document).ready(function(){
  var u = $('#AnimalID').html();
  $.ajax(
    {
     method:"GET",
     url:"/user/getpetinfo",
     data:{'id':u}
    }  	
    ).done(function(data){
       $('#info').html(data.Message);
       if(data.Message=="OK"){
        $('#weight').html(data.Weight);
        $('#name').html(data.Name);
        $('#age').html(data.AgeCategory);
        $('#sex').html(data.Sex);
        $('#status').html(data.Status);
        $('#color').html(data.Color);
        $('#breed').html(data.Breed);
       }
  });

});