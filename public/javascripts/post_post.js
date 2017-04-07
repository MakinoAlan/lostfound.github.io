$(document).ready(function(){
	var u = $('#Username').html();
	var id = $('#AnimalID').html();
$.ajax({
	method:"POST",
	url:"/post/moreinfo",
	data:{Username:u,AnimalID:id}
}).done(function(data){
	var con = "<p>Phone: "+data[0].Phone+"</p><p>Description: "+data[0].Des+"</p><p>Location: "+data[0].Address+"</p>"
	$('#content').html(con);
});
  
$('.fb-comments').attr('data-href',window.location.href);
$('.fb-share-button').attr('data-href',window.location.href);
});