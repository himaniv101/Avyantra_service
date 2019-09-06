var hospital = require('../../controllers/hospitalController')


describe('add ', function(){

  var a;
  var b;
  
  it("add" , function(){
  
     a= 7
     b= 8
  
      var result = hospital.add(a,b)
  
      expect(result).toEqual(15);
      
     });
  })



describe('Hospital registration test', function(){

var _reqObject;

it("should login hospital user" , function(){

    _reqObject = {
        "email": "apollo@mail.com",
        "hospital_name": "apolloooo",
        "username": "him11111",
        "password": "urversgi",
        "confirmPass": "aspl101"
      }

    var result = hospital.hospitalSignUp(_reqObject,_resObject,_nextObject)

    expect(result.status).toEqual(200);
    
   });
})


