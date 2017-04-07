$(document).ready(function(){
  alert('page loaded');
  $('#bt1').on('click',function(){
  	$.post('/admin/query',{query:$('#in1').val()}).done(function(data){
  		$('#result').html(JSON.stringify(data));
  	});
  	return false;
  });

  $('#bt2').on('click',function(){
  	  $.get('/admin/dbtest',function(data){
        if(data){
  	  	$('#status').html("Connected");}
        else{$('#status').html("Conncetion failed");}
  	  });
  });
  
  $('#bt3').on('click',function(){
  	$.post('/admin/adminUserName',{username:$('#in3').val()}).done(function(data){
  		$('#result').html(JSON.stringify(data));
  	});
  	return false;
  });
  
  $('#bt4').on('click',function(){
  	$.post('/admin/adminAnimalID',{id:$('#in4').val()}).done(function(data){
  		$('#result').html(JSON.stringify(data));
  	});
  	return false;
  });
 
  $('#bt7').on('click',function(){
  	$.post('/admin/deleteUser',{username:$('#in3').val()}).done(function(data){
  		$('#result').html(JSON.stringify(data));
  	});
  	return false;
  });
  
  $('#bt10').on('click',function(){
  	  $.get('/admin/importPetlist');
      alert('data is loaded');
  	  return false;
  });

});