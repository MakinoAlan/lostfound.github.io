$(document).ready(function(){
	$('#bt2').on('click',function(){
		var flag = $.ajax({
			type:'POST',
			url:'admin',
			data:{key:$('#admin').val()},
			async: false
		}).responseText;
		if(flag=='yes'){return true;}
        alert('wrong key(123)');
		return false;
	});
    
    $('#bt1').on('click',function(){
		var flag = $.ajax({
			type:'POST',
			url:'user',
			data:{username:$('#username').val(),password:$('#password').val()},
			async: false
		}).responseText;
		if(flag=='yes'){return true;}
		alert('wrong username/password');
		return false;
	});

    $('#bt3').on('click',function(){
        var u = $('#username').val();
        var p = $('#password').val();
        $.post('register',{username:u,password:p}).done(function(data){
        	alert(data);
        });
        return false;
    });
	
	$('#lastTry').bootstrapValidator({

		live:'enabled',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            username: {
                message: 'The username is not valid',
                validators: {
                    notEmpty: {
                        message: 'The username is required and cannot be empty'
                    },
                    stringLength: {
                        min: 6,
                        max: 30,
                        message: 'The username must be more than 6 and less than 30 characters long'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_]+$/,
                        message: 'The username can only consist of alphabetical, number and underscore'
                    }
                }
            },
			password: {
				validators: {
					notEmpty: {
						message: 'The password is required and cannot be empty'
					},
					stringLength: {
						min: 3,
						max: 8,
						message: 'The password must be more than 4 and less than 8 characters long'
					}
				}
			},
            email: {
                validators: {
                    notEmpty: {
                        message: 'The email is required and cannot be empty'
                    },
                    emailAddress: {
                        message: 'The input is not a valid email address'
                    }
                }
            }
        }
    }).css("font-size","20px");


});