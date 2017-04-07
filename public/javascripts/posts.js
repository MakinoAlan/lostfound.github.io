$(document).ready(function(){
	$('#re').on('click',function(){
	  top.location.href='/';	
	});
	$('#search').on('click',function(){
		var id = $('#AnimalID').val();
        $.ajax({
        	method:"POST",
        	url:"/posts/information1",
        	data:{"id":id}

        }).done(function(data){
          if(data==""){$('#information1').html("No Owner Found");}
          else{
          var content = "<a href='/posts/post_contact/"+data+"' target='_blank'>"+data+"</a>";
          $('#information1').html(content);}
        });
        
        $.ajax({
        	method:"POST",
        	url:"/posts/information2",
        	data:{"id":id}

        }).done(function(data){
          if(data==""){$('#information2').html("No Post Found");}
          else{
          var content = "<a href='/posts/post_contact/"+data.user+"' target='_blank'>"+data.user+"</a>";
          content+="<p>"+data.des+"</p>";
          $('#information2').html(content);}
        });



	});

});