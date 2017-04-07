$(document).ready(function(){
  var u = $('#Username').html();
  $.ajax(
    {
     method:"POST",
     url:"/user/getdata",
     data:{'username':u}
    }  	
    ).done(function(data){
    $('#name').html(data.Name);
    $('#phone').html(data.Phone);
    $('#email').html(data.Email);
    $('#address').html(data.Address);
  });
$('.fb-comments').attr('data-href',window.location.href);
$('.fb-share-button').attr('data-href',window.location.href);

});