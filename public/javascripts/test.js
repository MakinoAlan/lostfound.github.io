$(document).ready(function(){
  $('#bt').on('click',function(){
  	$.ajax({
      method: "POST",
      url: "/posts/lost"
  	}).done(function(data){
      alert(data.length);
  	});
  });

});