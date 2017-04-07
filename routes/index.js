var express = require('express');
var router = express.Router();

/* GET home page. */
/*
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
*/
router.get('/',function(req,res,next){
	res.render('home');
});
/*
=============================================================
RESTFUL DESIGN
=============================================================
*/
router.get('/posts/Found',function(req,res,next){
  var db = req.db;
  var c = db.get('Found');
  var u = req.body.Username;
  c.find({"Username":u},function(e,d){
    res.send(d);
  });
});

router.post('/posts/Found',function(req,res,next){
  var db = req.db;
  var collection = db.get('Found');
  var n = req.body.Username;
  var id = req.body.AnimalID;
  var lat = req.body.Lat;
  var lng = req.body.Long;
  var phone = req.body.Phone;
  var des = req.body.Des;
  var address = req.body.Address;
  collection.find({'AnimalID':id,'Username':n},function(e,d){
    if(d.length==0){
    collection.insert({
    "Username": n,
    "AnimalID": id,
    "Lat": lat,
    "Long": lng,
    "Phone": phone,
    "Des": des,
    "Address": address
    },function(e,docs){if(e){res.send(e);}else{res.send('Success');}});
    }else{
      res.send('post with same animal id already exists');
    }
  });

});

router.delete('/posts/found',function(req,res,next){
  var petid = req.body.petid;
  var colName = req.body.collection;
  var userName = req.body.username;
  var db = req.db;
  var collection = db.get(colName);
  collection.remove({'AnimalID':petid,'Username':userName},function(e,d){
    if(e){res.send(e);}
      else{res.send('deleted');}
  });

});

router.put('/posts/found',function(req,res,next){
res.status(501);
res.send('None shall pass');
});
/*
=============================================================
ADMIN PART
=============================================================
*/
router.post('/admin/query',function(req,res,next){
  var dbname = req.body.query;
  var db = req.db;
  var collection = db.get(dbname);
  collection.find({},function(e,docs){
    if(e||docs==""){res.send('Not found!');}
    else{
      res.send(docs);  
    }
});});

router.post('/admin/adminUserName',function(req,res,next){
	var name = req.body.username;
	var db = req.db;
	var collection = db.get('UserCollection');
	  collection.find({"Username":name},function(e,docs){
	    if(docs!='') {    		
	      var i = docs[0];
	      res.json({
	        'Username': i.Username,
	        'Password': i.Password,
	        'Name': i.Name,
	        'Address': i.Address,
	        'Phone': i.Phone,
	        'Email': i.Email,
	        'Pets': i.Pets
	      });
	    } else {
	   	 	res.send('Not found!');
	    }
	   });
});

router.post('/admin/deleteUser',function(req,res,next){
	var name = req.body.username;
	var db = req.db;
	var collection = db.get('UserCollection');
	  collection.remove({'Username':name});
	  res.send('User '+name+' is successfully removed');
});

router.get('/admin/importPetlist', function(req,res,next){
	var db = req.db;
	var collection = db.get('PetList');
	collection.drop();
	
    var sys = require('sys');
	var exec = require('child_process').exec;
	function puts(error, stdout, stderr) {sys.puts(stdout);}
	exec("mongoimport --db 'test' --collection 'PetList' --type json --file 'RegisteredAnimals.json' --jsonArray", puts);

});

router.post('/admin/editUser',function(req,res,next){
	var db = req.db;
	var collection = db.get('UserCollection');
	var name = req.body.username;
	collection.find({"Username":name},function(e,docs){
	    if(docs.length==0) {    	
      	res.send('no matching user');

	    }else{
        res.render('admin_edit',{username: name});
	    } 
	    
	});
}); 

router.post('/admin/adminAnimalID',function(req,res,next){ 
	var id = parseInt(req.body.id);
	var db = req.db;
	var collection = db.get('PetList');
    collection.find({"AnimalID":id},function(e,docs){
	    if(docs!='') {
	    		var i = docs[0];
	    	  	res.json(i);
	    } else {
	   	  res.send('Not found!');
	    }
	   });
	   
});


router.get('/admin/dbtest',function(req,res,next){
	var db = req.db;
	var MongoClient = require('mongodb').MongoClient;
	//
	// // Connect to the db
	MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
		if (!err) {
			res.send(true);
		} else {
			res.send(false);
	}
	});
});

router.post('/admin',function(req,res,next){
  if(req.body.key=='123'){res.send('yes');}
  else {res.send(req.body.key);}
});

router.post('/admin/check',function(req,res,next){
  res.render('admin');
  
});

/*
=============================================================
USER PART
=============================================================
*/
router.post('/user',function(req,res,next){
  var name = req.body.username;
  var psw = req.body.password;
  var db = req.db;
  var collection = db.get('UserCollection');
  collection.find({"Username":name},function(e,docs){
    if(e||docs==""){res.send('error');}
    else{
      if(psw == docs[0].Password){
       res.send('yes');}
      else{res.send('no');}
    }
  });
});

router.post('/user/updateinfo',function(req,res,next){
  var u = req.body.Username;
  var db = req.db;
  var collection = db.get('UserCollection');
  collection.update(
    {'Username': u},
    {$set:{'Password':req.body.Password,'Name':req.body.Name,'Address':req.body.Address,'Phone':req.body.Phone,'Email':req.body.Email}}
  );res.send('updated');
});

router.post('/user/getdata',function(req,res,next){
  var u = req.body.username;
  var db = req.db;
  var collection = db.get('UserCollection');
  collection.find({"Username":u},function(e,docs){
    if(docs!=''){
      var i = docs[0];
      res.json({
        'Username': i.Username,
        'Password': i.Password,
        'Name': i.Name,
        'Address': i.Address,
        'Phone': i.Phone,
        'Email': i.Email,
        'Pets': i.Pets
      });

  }});
});

router.post('/user/profile',function(req,res,next){
  var name = req.body.username;
  var psw = req.body.password;
  var db = req.db;
  var collection = db.get('UserCollection');
  collection.find({"Username":name},function(e,docs){
    if(e||docs==""){res.send('error');}
    else{
      if(psw == docs[0].Password){
         res.render('personal',{username: name});}
      else{res.send('no');}
    }
  });
});

router.post('/register',function(req,res,next){
  var u = req.body.username;
  var p = req.body.password;
  var db = req.db;
  var collection = db.get('UserCollection');
  collection.find({'Username':u},function(e,docs){
    if(docs==''){
      collection.insert({'Username':u,'Password':p,'Pets':[]});
      res.send('Success');}
    else{res.send('Already Registered');}
  });
});

router.get('/user/getpetinfo',function(req,res,next){
  var petId = parseInt(req.query.id);
  var db = req.db;
  var col = db.get('PetList');
  col.find({'AnimalID':petId},function(e,d){
    if(d!=''){
      var pet = d[0];
      res.json({
        "Message":"OK",
        "Name":pet.Name,
        "AnimalID":pet.AnimalID,
        "AgeCategory":pet.AgeCategory,
        "Sex": pet.Sex,
        "ShotsDate":pet.ShotsDate,
        "Status":pet.Status,
        "Color":pet.Color,
        "EnteredBy":pet.EnteredBy,
        "Breed":pet.Breed,
        "Weight": pet.ApproxWeight 
      });

    }else{
      res.json({
        'Message':'false',
        'petid':petId
      });
    }
  });
 
});

router.post('/user/addpet',function(req,res,next){
  var u = req.body.username;
  var id = req.body.id;
  var db = req.db;
  var co1 = db.get('UserCollection');
  var co2 = db.get('PetList');
  var co3 = db.get('Ownship');
  co2.find({'AnimalID':parseInt(id)},function(e,d){
    if(d.length==0){res.send('Cannot find matching Animal ID: '+id+' in Animal Control Inventory Database...')
    }else{
  co3.find({'AnimalID':id},function(e,d){
    if(d==''){
        co1.find({'Username':u},function(e,d){
    
    var list = d[0].Pets;
     list.push(id);
    
     co1.update({'Username':u},{$set:{'Pets':list}});
    co3.insert({'Username':u,'AnimalID':id});
    
    res.send('Success');
  });
    }
    else{res.send('already claimed');}

  });
}
});
});

router.post('/user/deletepet',function(req,res,next){
  var u = req.body.username;
  var id = req.body.id;
  var db = req.db;
  var co1 = db.get('UserCollection');
  var co2 = db.get('Ownship');
  co2.find({'Username':u,'AnimalID':id},function(e,d){
    if (d==''){res.send('This pet is not yours');}
    else{
      co2.remove({'Username':u,'AnimalID':id},function(e,d){
        if(e){res.send(e);}
        else{
          co1.find({'Username':u},function(e,d){
            if(e){res.send(e);}
            else{
              var list = d[0].Pets;
              var len = list.length;
              var newList=[];
              for(var i=0;i<len;i++){
                        if(list[i]!=id){newList.push(list[i]);}
      }
              co1.update({'Username':u},{$set:{'Pets':newList}},function(e,d){
                if(e){res.send(e);}
                else{res.send('Deteled');}
              });
            }
          });
        }
      });
    }
  });

});
/*
=============================================================
Posts
=============================================================
*/
router.get('/posts/retrieve',function(req,res,next){
  var petid = req.query.petid;
  var colName = req.query.collection;
  var userName = req.query.username;
  var db = req.db;
  var collection = db.get(colName);
  collection.find({'AnimalID':petid,'Username':userName},function(e,d){
    if(e){res.send(e);}
    else{res.send(d);}
  });

});

router.post('/posts/updateMyPost',function(req,res,next){
  var petid = req.body.petid;
  var colName = req.body.collection;
  var userName = req.body.username;
  var newAddress = req.body.newAddress;
  var newMessage = req.body.newMes;
  var newLat = req.body.lat;
  var newLong = req.body.long;
  var db = req.db;
  var collection = db.get(colName);
  var q = {'AnimalID':petid,'Username':userName};
  collection.update(q,{$set: {'Des':newMessage,'Address':newAddress,'Lat':newLat,'Long':newLong}},function(e,d){
    if(e){res.send(e);}
      else{res.send('your post has been updated');}
  }); 
 //res.send(petid +" "+colName+' '+userName+' '+newAddress+' '+newMessage+' '+newLat+' '+newLong);

})

router.post('/posts/delete',function(req,res,next){
  var petid = req.body.petid;
  var colName = req.body.collection;
  var userName = req.body.username;
  var db = req.db;
  var collection = db.get(colName);
  collection.remove({'AnimalID':petid,'Username':userName},function(e,d){
    if(e){res.send(e);}
      else{res.send('deleted');}
  });

});
router.post('/posts/lost',function(req,res,next){
  var db = req.db;
  var collection = db.get('Lost');
  collection.find({},function(e,d){
    if(e){res.send(e);}
    else{res.send(d);}
  });
});
router.post('/posts/found',function(req,res,next){
  var db = req.db;
  var collection = db.get('Found');
  collection.find({},function(e,d){
    if(e){res.send(e);}
    else{res.send(d);}
  });
});
router.post('/posts/addLost',function(req,res,next){
  var db = req.db;
  var collection = db.get('Lost');
  var u = req.body.Username;
  var id = req.body.AnimalID;
  var lat = req.body.Lat;
  var lng = req.body.Long;
  var des = req.body.Des;
  var address = req.body.Address;
  var exists;
  collection.find({'AnimalID':id,'Username':u},function(e,d){
    if(d.length==0){
    collection.insert({
    "Username":u,
    "AnimalID":id,
    "Lat": lat,
    "Long": lng,
    'Des':des,
    "Address": address
  },function(e,doc){if(e){res.send(e);}else{res.send('Success');}});
    }else{
    res.send('post with same animal id already exists');
    }
  });

});

router.post('/posts/addFound',function(req,res,next){
  var db = req.db;
  var collection = db.get('Found');
  var n = req.body.Username;
  var id = req.body.AnimalID;
  var lat = req.body.Lat;
  var lng = req.body.Long;
  var phone = req.body.Phone;
  var des = req.body.Des;
  var address = req.body.Address;
  collection.find({'AnimalID':id,'Username':n},function(e,d){
    if(d.length==0){
    collection.insert({
    "Username": n,
    "AnimalID": id,
    "Lat": lat,
    "Long": lng,
    "Phone": phone,
    "Des": des,
    "Address": address
    },function(e,docs){if(e){res.send(e);}else{res.send('Success');}});
    }else{
      res.send('post with same animal id already exists');
    }
  });

});

router.post('/posts/myFound',function(req,res,next){
  var db = req.db;
  var c = db.get('Found');
  var u = req.body.Username;
  c.find({"Username":u},function(e,d){
    res.send(d);
  });
});

router.post('/posts/allFound',function(req,res,next){
    var db = req.db;
    var c = db.get('Found');
    c.find({},function(e,d){
      res.send(d);
    });
});
router.post('/posts/myLost',function(req,res,next){
  var db = req.db;
  var c = db.get('Lost');
  var u = req.body.Username;
  c.find({'Username':u},function(e,d){
    res.send(d);
  });
});

router.post('/posts/allLost',function(req,res,next){
  var db = req.db;
  var c= db.get('Lost');
  c.find({},function(e,d){
    res.send(d);
  });
});

router.post('/posts/contact',function(req,res,next){
  var u = req.body.Username;
  res.render('contact',{"Username":u},function(e,h){res.send(h);});
});

router.get('/posts/post_animal/*',function(req,res,next){
  res.render('post_animal',{AnimalID:req.params[0]});
});

router.get('/posts/post_contact/*',function(req,res,next){
  res.render('post_contact',{Username:req.params[0]});
});

router.get('/posts/post_post/*/*',function(req,res,next){
  res.render('post_post',{AnimalID:req.params[1],Username:req.params[0]});
});

router.post('/posts/information1',function(req,res,next){
  var db = req.db;
  var c= db.get('Ownship');
  var id = req.body.id;
  c.find({"AnimalID":id},function(e,d){
    if(d!=""){
    res.send(d[0].Username);}
    else{res.send("");}
  });
});

router.post('/posts/information2',function(req,res,next){
  var db = req.db;
  var c= db.get('Found');
  var id = req.body.id;
  c.find({"AnimalID":id},function(e,d){
    if(d!=""){
    res.send({"user":d[0].Username,"des":d[0].Des});}
    else{res.send("");}
  });
});

router.post('/post/moreinfo',function(req,res,next){
  var db = req.db;
  var c1 = db.get('Lost');
  var c2 = db.get('Found');
  var u = req.body.Username;
  var id = req.body.AnimalID;
  c1.find({Username:u,AnimalID:id},function(e,d){
    if(d.length!=0){res.send(d);}
    else{
      c2.find({Username:u,AnimalID:id},function(e,d){
        res.send(d);
      });
    }
  });
});
/*
=============================================================
Map
=============================================================
*/
router.get('/map',function(req,res,next){
  res.render('post');
});

router.get('/viewposts',function(req,res,next){
  res.render('guest');
});

/*
=============================================================
RETURN
=============================================================
*/

/*
=============================================================
TEST PART
=============================================================
*/

router.get('/map',function(req,res,next){
  res.render('map');
});

router.get('/test',function(req,res,next){
  res.render('test');
});

router.post('/test/getdata',function(req,res,next){
  var db = req.db;
  var collection = db.get('test');
  collection.find({"user":"array"},function(e,d){
    var a = d[0].data;
    var id = d[0].id;
    a.push('nima');
    collection.update({'user':'array'},{$set:{'data':a}});
    res.send('done');
  });
  
});
/*
=========================================================
*/

module.exports = router;
