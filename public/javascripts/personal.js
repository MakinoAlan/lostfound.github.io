$(document).ready(function() {
  getUserInfo();
  $('#btnUpdateUser').on('click',updateUserInfo);
  $('#btnAddPet').on('click',addPetIDToUser);
  $('#lostpostbtn').on('click',lostPostHandler);
  $('#foundpostbtn').on('click',foundPostHandler);
  $('#btnDelPet').on('click',deletepet);
  $('#pet-list').on('click','.PetInfoModal',getPetDetailInfo);
  $('#user-post').on('click','.viewPost',editPost);
  getAllMyPosts();
  
  $('#myPersonal').bootstrapValidator({

		live:'enabled',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            fullname: {
                message: 'The fullname is not valid',
                validators: {
                    notEmpty: {
                        message: 'The fullname is required and cannot be empty'
                    },
                    stringLength: {
                        min: 6,
                        max: 30,
                        message: 'The fullname must be more than 6 and less than 30 characters long'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z_]+$/,
                        message: 'The username can only consist of alphabetical and underscore'
                    }
                }
            },
			phone: {
				validators: {
					stringLength: {
						min:11,
						max:11,
						message:'Then phone number should be 10 characters long'
					},
					regexp: {
						regexp: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
						message:'The phone number is invalid, Format should be:1xxxxxxxxxx'
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
function dostuff(){
  alert('ok');
}

function editPost(){
  var petid = $(this).data('id');
  var type = $(this).data('type');
  var uName = $(this).data('uname');
  var category = $(this).data('category');
  if (type == 'delete') {
    var r = confirm('You sure want to delete this post');
    if (r){
      deletePost(petid,category,uName);
      getAllMyPosts();
    }else{
      return;
    }
  } else {
    fetchPost(petid,uName,category);
  }
};


function fetchPost(petid,uName,category){
  $.ajax({
    type:'GET',
    data:{'petid':petid, 'collection':category,'username':uName},
    url:'/posts/retrieve',
    async:false
  }).done(function(response){
    if(category=="Lost"){
      $('#EditPostModal .modal-body #post-id').attr('readonly',true);
    }else{
      $('#EditPostModal .modal-body #post-id').attr('readonly',false);
    }
      $('#EditPostModal .modal-body #post-id').val(response[0].AnimalID);
      $('#EditPostModal .modal-body #post-addre').val(response[0].Address);
      $('#EditPostModal .modal-body #post-mess').val(response[0].Des);
      $('#EditPostModal').modal();
      $('#post-updatebtn').unbind();
      $('#post-updatebtn').on('click',function(){updatePost(petid,uName,category)});
 })

}

function updatePost(petid,uName,category){
  var address = $('#post-addre').val();
  var message = $('#post-mess').val();
  newLatLong = getLocation(address);
  if(newLatLong.lat==0 && newLatLong.lng==0){
        return;
  }
  var d = {'petid':petid,
          'username':uName,
          'collection':category,
          'newAddress':address,
          'newMes':message,
          'lat': newLatLong.lat,
          'long':newLatLong.lng
         };
  $.ajax({
    type:'POST',
    data:d,
    url:'/posts/updateMyPost',
    async:false
  }).done(function(response){
    alert(response);
  })

}


function deletePost(petid,category,uName){
  $.ajax({
    type:'POST',
    data:{'petid':petid, 'collection':category,'username':uName},
    url:'/posts/delete',
    async:false
  }).done(function(response){
    alert(response);

  })
}

function getPetDetailInfo(){
  var petid = $(this).data('id');
  
  $('#PetInfoModal .modal-title').text('Your pet info for '+petid);

  $.ajax({

    type:'GET',
    data: {'id':petid},
    url: '/user/getpetinfo',
    dataType: 'JSON',
    async:false

  }).done(function(response){
    if(!response.Message){
      alert('can not find animal info with animal id = '+petid);
    }else{
      $('#PetInfoModal .modal-body #pet-name').val(response.Name);
      $('#PetInfoModal .modal-body #pet-id').val(response.AnimalID);
      $('#PetInfoModal .modal-body #pet-color').val(response.Color);
      $('#PetInfoModal .modal-body #pet-breed').val(response.Breed);
      $('#PetInfoModal .modal-body #pet-agecategory').val(response.AgeCategory);
      $('#PetInfoModal .modal-body #pet-sex').val(response.Sex);
      $('#PetInfoModal .modal-body #pet-shotsdate').val(response.ShotsDate);
      $('#PetInfoModal .modal-body #pet-status').val(response.Status);
    }
    })
   .fail(function(response){
      alert('something went wrong when retrieving pet info... ');
    })
};


function getUserInfo(){
  var username = $('#u p').html();
  $.ajax({
    type: 'POST',
    data: {'username': username},
    url: '/user/getdata',
    dataType: 'JSON',
    async:false
  }).done(function(response) {
    $('#inputUserName').val(response.Username);
    $('#inputUserEmail').val(response.Email);
    $('#inputUserFullname').val(response.Name);
    $('#inputUserAddress').val(response.Address);
    $('#inputUserPhone').val(response.Phone);
    $('#inputUserPassword').val(response.Password);
    var petList = response.Pets;
    var tableData = '';
    var optionData= '';
    for (var i=0 ; i < petList.length; i++) {
      tableData +='<tr>';
      tableData += '<td><a href="javascript:void(0);" class="PetInfoModal" data-toggle="modal" data-target="#PetInfoModal" data-id="'+petList[i]+'" >'+petList[i]+'</a></td>';
      tableData +='</tr>';
      optionData += '<option>'+petList[i]+'</option>';
    }
    $('#pet-list table tbody').html(tableData);
    $('#l-post-animalid').html(optionData);
  });

};

function addPetIDToUser(){
  var petId = {
    'id' : $('#inputPetId').val(),
    'username' : $('#inputUserName').val()
  };
  $.ajax({
    type: 'POST',
    data: petId,
    url: '/user/addpet',
    async: false
  }
  ).done(function(response){
    alert(response);
  });

  getUserInfo();
}

function deletepet(){
  var petId = {
    'id' : $('#inputPetId').val(),
    'username' : $('#inputUserName').val()
  };
  $.ajax({
    type: 'POST',
    data: petId,
    url: '/user/deletepet',
    async: false
  }
  ).done(function(response){
    alert(response);
  });

  getUserInfo();
}


function updateUserInfo(){
  var newUserInfo = {
    'Username': $('#inputUserName').val(),
    'Email': $('#inputUserEmail').val(),
    'Name': $('#inputUserFullname').val(),
    'Password': $('#inputUserPassword').val(),
    'Address': $('#inputUserAddress').val(),
    'Phone': $('#inputUserPhone').val()

  };

  $.ajax({
    type: 'POST',
    data: newUserInfo,
    url: '/user/updateinfo',
    dataType: 'text'
  }).done(function(response){
    alert(response);
	

  });
  return false;
};

function lostPostHandler(){
  var lpAddress=$('#l-post-lostlocation').val();
  var addressLocation = getLocation(lpAddress);
  if(!(addressLocation.lat==0&&addressLocation.lng==0)){
    var lostPostInfo={
      'Username': $('#inputUserName').val(),
      'AnimalID': $( "#l-post-animalid option:selected" ).text(),
      'Lat': addressLocation.lat,
      'Long':addressLocation.lng,
      'Des': $('#l-post-message').val(),
      'Address': lpAddress
    };
    $.ajax({
      method:"POST",
      data:lostPostInfo,
      url:'/posts/addLost'
    }).done(function(res){
      alert(res);
      getAllMyPosts();
    })
  }
};


function foundPostHandler(){
  var fpAddress=$('#f-post-lostlocation').val();
  var addressLocation = getLocation(fpAddress);
  if(!(addressLocation.lat==0&&addressLocation.lng==0))
  {
    var foundPostInfo={
      'Username': $('#inputUserName').val(),
      'AnimalID': $( '#f-post-animalid').val(),
      'Lat': addressLocation.lat,
      'Long':addressLocation.lng,
      'Phone': $('#f-post-contactphone').val(),
      'Des': $('#f-post-message').val(),
      'Address': fpAddress
    };
    $.ajax({
      method:"POST",
      data:foundPostInfo,
      url:'/posts/addFound'
    }).done(function(res){
      alert(res);
      getAllMyPosts();
    })
  } 
};


function getAllMyPosts(){
  var username = {
    Username: $('#inputUserName').val()
  };

  $('#user-lost-post table tbody').html(getMyLostPost(username));
  $('#user-found-post table tbody').html(getMyFoundPost(username));

  //getMyFoundPost(username);


};

function getMyLostPost(username){
  var lostAnimalPostTable='';
  $.ajax({
    method:'POST',
    url:'/posts/myLost',
    data:username,
    async:false
  }).done(function(data){
    for (var i=0;i<data.length;i++){
      lostAnimalPostTable +='<tr>';
      lostAnimalPostTable +='<td><a href="javascript:void(0);" class="viewPost" data-category="Lost" data-type="update" data-uname="'+data[i].Username+'" data-id="'+data[i].AnimalID+'">'+data[i].AnimalID+'</a></td>';
      lostAnimalPostTable +='<td><a href="javascript:void(0);" class="viewPost" data-category="Lost" data-type="delete" data-uname="'+data[i].Username+'" data-id="'+data[i].AnimalID+'">Delete</a></td>';      lostAnimalPostTable +='</tr>';

    }
  });
  return lostAnimalPostTable;
};

function getMyFoundPost(username){
  var foundAnimalPostTable='';
  $.ajax({
    method:'POST',
    url:'/posts/myFound',
    data:username,
    async:false
  }).done(function(data){
    for (var i=0;i<data.length;i++){
      foundAnimalPostTable +='<tr>';
      foundAnimalPostTable +='<td><a href="javascript:void(0);" class="viewPost" data-category="Found" data-type="update" data-uname="'+data[i].Username+'" data-id="'+data[i].AnimalID+'">'+data[i].AnimalID+'</a></td>';
      foundAnimalPostTable +='<td><a href="javascript:void(0);" class="viewPost" data-category="Found" data-type="delete" data-uname="'+data[i].Username+'" data-id="'+data[i].AnimalID+'">Delete</a></td>';      foundAnimalPostTable +='</tr>';

    }
  });
  return foundAnimalPostTable;
};

function getLocation(address){
  var result={'lat':0,'lng':0};
  $.ajax({
    method:"GET",
    url:"http://maps.googleapis.com/maps/api/geocode/json",
    data:{"address":address},
    async:false

  }).done(function(data){
    if(typeof(data.results[0])=='undefined'){alert('Invalid Location');}
    else{
      var location={
        'lat':data.results[0].geometry.location.lat,
        'lng':data.results[0].geometry.location.lng
      }
      result.lat=location.lat;
      result.lng=location.lng;
    }});
  return result;
};