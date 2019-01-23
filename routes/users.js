var express = require('express');
var router = express.Router();
const  _ = require('lodash');
var UserSchema = require('../models/userSchema');
const {EmployeeSchema} = require('../models/employeeSchema.js');
const {CompanySchema} = require('../models/companySchema.js');
const {JobSchema} = require('../models/jobSchema.js');
const {TmpData} = require('../models/tmpData.js');
const {DocumentSchema} = require('../models/documentSchema.js');
var passport = require('passport');
const {ObjectID}  = require('mongodb');
var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
const PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
var discovery = new DiscoveryV1({
    version: '2018-12-03',
    iam_apikey: '1ImX0abYJPqlYzm56WzIr7O0Hd8UmAjPMV96GRuhuo9s', 
    url: 'https://gateway-syd.watsonplatform.net/discovery/api'
});
// var personalityInsights = new PersonalityInsightsV3({
//     version: '2017-10-13',
//     username: 'e017ffe0-0eec-40b1-9cbc-5f22de364688',
//     password: 'vGT2DJsQA3Op',
//     url: 'https://gateway.watsonplatform.net/personality-insights/api'
// });
/* GET users listing. */
router.get('/', function(req, res, next) {
 res.send('respond with a resource');
});
router.get('/newDatas', function(req, res) {
    var hour23 = 82800000;
    TmpData.findOne().then((data ,e)=>{
        if (e)
        res.error("Failed");
        else{
            if(data && Date.now() - data.date_created > hour23){
                //check time #true to proceeding adding everything
                TmpData.collection.remove();
                res.send(true);
            }
            else if(!data){
                res.send(true);
            }
            else
            res.send(false);
            //console.log(JSON.stringify(data, null, 2));
            //res.send(data.date_created);
        }
       
    });
});
router.get('/getCategory', (req,res)=>{
    discovery.query({ environment_id: `17bc5cf7-1be3-4f8e-a06f-9ddec7317aec`, collection_id: `d47a72a6-07c6-4aad-aa36-4944659d6589`},function(data,e){
        if (e)
        res.send(e);
        else
        {
            for(var x =0 ; x < data.matching_results;x++){
                CompanySchema.findOneAndUpdate({
                    _id : data.results[x].id
                },{$set: {"type":2}},{upsert:true}).then(data =>{
                    // set data
                });
                data.results[x].enriched_text.categories[0].label.replace("/", "");
            }
        }
        res.send(data.results.enriched_text);
    });
    // TmpData.find().then((data , e )=>{
    //     if (e)
    //     console.log("Error is : ",e)
    //     else
    //     {
    //         for(var i = 0 ; i< data.lenght; i++){
                
    //             discovery.query({ environment_id: `17bc5cf7-1be3-4f8e-a06f-9ddec7317aec`, collection_id: `d47a72a6-07c6-4aad-aa36-4944659d6589`}).then((data))
    //         }
    //     }
        
    // })
});
router.post('/addDiscovery', (req,res)=>{
    //Adding file into datas.json then pushing into watson
    
    console.log(JSON.stringify(req.body, null, 2));
    
var text = req.body.text.replace(/\?meow\?/g, '"');
var fileName = req.body.fileName;
var  buf = Buffer.from(JSON.stringify({text: text}));


discovery.addDocument({ environment_id: '17bc5cf7-1be3-4f8e-a06f-9ddec7317aec', 
                        collection_id: 'd47a72a6-07c6-4aad-aa36-4944659d6589', 
                        file: buf,
                        metadata: undefined,
                        file_content_type: "application/json",
                        filename: fileName 
    },function(error, data){
        if(error){
            console.log("Error is ",error)
            res.status(404).send(e);
        }
        else{
            var newID = data.document_id
            var doc = new DocumentSchema({
                _id: newID,
                fileName : fileName,
                text: text
            });
            doc.save().then((SpecificData)=>{});

            var temp = new TmpData({
                _id: newID,
                fileName : fileName,
                text: text
            });
            temp.save().then((SpecificData)=>{});

            console.log(JSON.stringify(data, null, 2));
            res.send("Hey it work");
        }
    }).then(()=>{
        
    });
});
router.get('/useReport', (req,res)=>{
    TmpData.findOneAndUpdate({
        _id : "083e23b5-ac0b-46bc-8c94-9179c68be176"
    },{$set: {category: "meow "}},{upsert:true,new:true}).then((data,err) =>{
        if (err)
        res.send(err);

        else res.send(data);
        // set data
    });
//     var json = {
//         "text" : "Greenland has gone through an unprecedented period of ice loss within the last two decades. The Grace satellites revealed a four-fold increase in mass being lost from Greenland's ice sheet from 2003-2013. The study in Proceedings of the National Academy of Sciences shows that ice loss subsequently stalled for 12-18 months. The research reveals how different areas of Greenland might contribute to sea-level rise in future. Scientists concerned about sea levels have long focused on Greenland's south-east and north-west regions, where glaciers continually force large chunks of ice into the Atlantic Ocean. But the largest sustained acceleration in ice loss from early 2003 to mid-2013 occurred in south-west Greenland, which is largely devoid of these large glaciers. ?meow?Whatever this was, it couldn't be explained by glaciers, because there aren't many there,?meow? said the study's lead author Michael Bevis, from The Ohio State University. ?meow?It had to be the surface mass - the ice was melting inland from the coastline.?meow? The ice melt accelerations in this region tracked a weather phenomenon known as the North Atlantic Oscillation (NAO). When in a particular (?meow?negative?meow?) phase, the NAO enhances summertime warming and the solar radiation that reaches the Earth's surface, while reducing snowfall - especially in western Greenland. The researchers believe the melting in south-west Greenland is a combination of climate change and conditions brought on by the NAO. ?meow?These oscillations have been happening forever... so why only now are they causing this massive melt? It's because the atmosphere is, at its baseline, warmer. The transient warming driven by the North Atlantic Oscillation was riding on top of more sustained global warming,?meow? said Prof Bevis. The consequence of this finding is that south-west Greenland, which had not been considered a serious threat, now looks as if it will become a major future contributor to sea-level rise. ?meow?We knew we had one big problem with increasing rates of ice discharge by some large outlet glaciers,?meow? said Prof Bevis. ?meow?But now we recognise a second serious problem: Increasingly, large amounts of ice mass are going to leave as meltwater, as rivers that flow into the sea.?meow? GPS systems in place now monitor Greenland's ice around most of its margin, but the network is sparse in the south-west. Because the Grace satellites stopped taking data in 2016, it remains unclear whether the pause in melting - which began in 2013 - has now stopped or is still ongoing. Andrew Shepherd, professor of Earth observation at the University of Leeds, UK, who was not involved with the latest study, told BBC News: ?meow?This study goes a long way towards explaining why Greenland's ice sheet stopped melting in 2013, but unfortunately the Grace satellite died in 2016 just when things started to get interesting. ?meow?So I think we will have to look elsewhere to understand whether the pause has ended and whether it affected the ice flow.?meow? The paper in PNAS also suggests the pause is linked to a change in the phase of the NAO - from negative to positive. Grace (the Gravity Recovery and Climate Experiment) consisted of two Earth-orbiting satellites which took detailed measurements of gravity-field anomalies. A joint mission between Nasa and the German Aerospace Center, they were launched in March 2002. A replacement pair were put up last year, but have yet to be brought fully online. Last month, researchers reported that the Greenland melt was unprecedented in 350 years. A US research team examined ice cores from western Greenland that record the behaviour of the ice sheet dating back to 1650. The group's analysis indicated that an uptick in melting began soon after the onset of industrial-era Arctic warming in the mid-1800s, and that the decade 2004-2013 experienced more sustained and intense melting than any other 10-year period in the 350-year record."
//     }
//     json.text= json.text.replace(/\?meow\?/g, '"');
//     res.send(json);
});
router.post('/register', (req,res)=>{
  var newID = ObjectID.createPk();
  if(req.body.user_type == "Employee"){
      console.log("Employee");
      var user = new EmployeeSchema({
          _id: newID
      });
      var generalUser = new UserSchema({
          _id: newID,
          username : req.body.username,
          password : UserSchema.hashPassword(req.body.password),
          email : req.body.email,
          user_type : req.body.user_type
      });
  }else if (req.body.user_type == "Company"){
      console.log("Company");
      var user = new CompanySchema({
          _id: newID
      });
      var generalUser = new UserSchema({
          _id: newID,
          username : req.body.username,
          password : UserSchema.hashPassword(req.body.password),
          email : req.body.email,
          user_type : req.body.user_type
      });
  } 

  user.save().then((SpecificData)=>{
      
      generalUser.save().then((allData)=>{
          res.send(allData);
      },(e)=>{ //i doubt that this is the right way to do the error handing XD
          res.status(400).send(e);
      }).catch((err)=>{
          res.send(err);
      });
  },(e)=>{
      res.status(400).send(e);
  }).catch((err)=>{
      res.send(err);
  });

});

router.post('/login',function(req,res,next){
  passport.authenticate('local', function(err, user, info) {
    if (err) { return res.status(501).json(err); }
    if (!user) { return res.status(501).json(info); }
    req.logIn(user, function(err) {
      if (err) { return res.status(501).json(err); }
      UserSchema.findOneAndUpdate({'_id': user._id },{
        $set:{
          num_of_login : user.num_of_login + 1
            } 
        },{new:true}).then((data)=>{

        });
   
      return res.status(200).json( user.num_of_login);
      
    });
  })(req, res, next);
});

router.get('/user',isValidUser,function(req,res,next){
  return res.status(200).json(req.user);

});
router.get('/logout',isValidUser,function(req,res,next){
  req.logOut();
  return res.status(200).json({message:'Logout Success'});

});

function isValidUser(req,res,next){
  //act as a middleware
  if(req.isAuthenticated()) next();
  else return res.status(401).json({message:'Unauthroised Request'});
}
//==========================================================================
router.patch('/updateProfile/:id/:type',(req,res)=>{
    //how to use > /updateProfile/_id/user_type

    var id = req.params.id;
    var type = req.params.type;
    var secondBody ;
    
    var body = _.pick(req.body,['username','email']); // allow which property users can update
    UserSchema.findOneAndUpdate({_id:id},{$set: body},{new:true}).then((userSchema)=>{
    if(type === "Employee"){
        secondBody = _.pick(req.body,['full_name','birthdate','specialization']);
        var thirdBody = _.pick(req.body,['description']);
        console.log(thirdBody);
        if(Object.keys(thirdBody).length === 0 && thirdBody.constructor === Object || thirdBody.description.content.length < 10 || !thirdBody.description.content){
            //Check for empty object or object shorter then 10 index of description posted
            console.log("The description is empty/short hence -NO API IS CALLED-" );
        }else{
            //excute > save new data
           
            EmployeeSchema.findOneAndUpdate({_id: id},{
                $push: thirdBody
               },{new:true}).then((updatedData)=>{
                 if(!updatedData){
                    return res.status(404).send();
                 }
                 var profileParams = {
                    content:{ 
                        "contentItems": updatedData.description
                    },
                    'content_type': 'application/json',
                    'consumption_preferences': true,
                    'raw_scores': true
                };
                personalityInsights.profile(profileParams, function(error, profile) {
                     //excute > api calling
                    if (error) {
                      console.log(error);
                    }
                    else {
                      // make take the percentile and use it for some calcation of matching criteria
                      var needsArr =  [] ;
                      var personalityArr =  [] ;
                      var valuesArr =  [] ;
                      for(var x=0 ; x < 5; x++){
                       needsArr.push({
                           trait_name : _.orderBy(profile.needs, ['percentile'],['desc']).splice(0, 5)[x].name ,
                           trait_rank : x+1
                       });
                       personalityArr.push({
                            trait_name : _.orderBy(profile.personality, ['percentile'],['desc']).splice(0, 5)[x].name ,
                            trait_rank : x+1
                       });
                       valuesArr.push({
                            trait_name : _.orderBy(profile.values, ['percentile'],['desc']).splice(0, 5)[x].name ,
                            trait_rank : x+1
                       });
                      }
                      console.log();
                      EmployeeSchema.findOneAndUpdate({_id :id },{$set: Object.assign({trait_needs: needsArr , trait_personality: personalityArr, trait_values:valuesArr},secondBody)},{new:true}).then((updatedData)=>{
                        console.log( "Api finished parsin");
                        res.send(updatedData);
                      });
                    }
                });
                 //console.log( "Added new description" ,updatedData);
               });
        }   
    }

    else if (type === "Company"){
        //company
        secondBody = _.pick(req.body,['company_name','bio','address','phone_no', 'company_type']);
        CompanySchema.findOneAndUpdate({_id: id},{
            $set: secondBody
           },{new:true}).then((userTypeSchema)=>{
             if(!userTypeSchema){
                return res.status(404).send();
             }
             var s = {userSchema,userTypeSchema};
             res.send(s);
           });
    }
 
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

         //console.log(updatedData);
       });
});
router.get('/userprofile/:id',(req,res)=>{
    UserSchema.findById({_id: req.params.id}).then((userSchema)=>{ 
        var database = eval(`${userSchema.user_type}Schema`);
        database.findById({_id: req.params.id}).then(usertypeSchema=>{
            res.send({userSchema,usertypeSchema});
            
        })
    },(err) =>{
            res.status(400).send(err);
    });
});
router.patch('/feed/:id', (req,res)=>{
    // only display this when it skip first login
    var id = req.params.id;
    var obj;

    
    UserSchema.findById({_id:id}).then((x)=>{
         obj =  x; 
    },(err) =>{
        res.status(400).send(err);
    }).then( ()=>{
        if( obj.user_type == "Employee"){
            function updateEmployee(arr,employeeID){
                //console.log("employee update ", arr ,"The id :",employeeID)
                EmployeeSchema.update({_id:employeeID },{$set :  {
                    potentional_jobs:  arr
                }},{new:true}).then();
            };
            function updateCompany(jobID,companyID,employeeID){
                CompanySchema.findOneAndUpdate({_id:companyID},{$push :  {
                    potential_employee:{
                        matched_date: Date.now(),
                        employee_id: employeeID,
                        job_id: jobID
                    } 
                }}).then();
            };
            EmployeeSchema.findById({_id:id}).then((employeeData)=>{ 
                //TODO 3. matching here
                var matchingCriteria = _.pick(employeeData,['trait_needs','trait_personality','trait_values']);
                var count = 0;
                var objArr = [];
                [matchingCriteria.trait_needs,matchingCriteria.trait_personality,matchingCriteria.trait_values].map(function(objOfTraits){
                 var traitClass = ["require_trait_needs","require_trait_personality","require_trait_values"];
                    objOfTraits.map(function(objs){
                        var obj = {};
                        obj[traitClass[count]+".trait_name"] = objs.trait_name;
                        objArr.push(obj);
                    });
                count++;
                });
                //var matchingCriteria = { trait_needs: [{"trait_name":"Structursdae","trait_rank":1},{"trait_name":"Curiosity","trait_rank":2},{"trait_name":"Stability","trait_rank":3},{"trait_name":"Practicality","trait_rank":4},{"trait_name":"Challenge","trait_rank":5}] };
                JobSchema.find({
                    $or : objArr
                }).then((yourcompanywhowantsyou)=>{ 
                    var jobArr= [];
                    var listArr = [];
                    var sum = 0 ;                   
                    yourcompanywhowantsyou.forEach(jobList => {  
                        var v = true;
                        
                        var requireTraitClass = ["require_trait_needs","require_trait_personality","require_trait_values"];
                        var traitClass = ["trait_needs","trait_personality","trait_values"];
                        for(var t =0 ; t<3 ;t++){
                            var jobTraits = eval("jobList."+requireTraitClass[t]);
                            var toMatchTraits = eval("matchingCriteria."+traitClass[t]);
                            var ylen = jobTraits.length;
                            var xlen = toMatchTraits.length;
                            for(var y= 0 ;y<jobTraits.length; y++ ){
                                for(var x= 0 ;x <toMatchTraits.length; x++ ){     
                                    if(toMatchTraits[x].trait_name == jobTraits[y].trait_name){
                                        var currentYRank = jobTraits[y].trait_rank;
                                        var currentXRank = toMatchTraits[x].trait_rank;
                                        // y for company , x is for employee 
                                        // why five because the trait of the employees which i used
                                        // watson api to find hence is a fixed amount at 5 and the percentage balancer is (((5+1-ylen)/15)+(10/15). 15 is 5 magic num 
                                        // This below is caculating the need model. divide 3 because 3 traits
                                        
                                        //console.log("X :" ,currentXRank,' Y :',currentYRank);
                                        sum += (((1+ylen)-currentYRank)/(((ylen * ylen) + ylen)/2)* ((1+xlen-currentXRank)/5)/(((6-ylen)/15)+(10/15)))/3;
                                    }  
                                } 
                            }
                        }
                        if (sum >0.60 ){
                            jobArr.push(jobList);
                            console.log("More then 60%! The job title :",jobList.title," is a ",Math.round(sum*100) ,"% matched!");                
                            for(var i = 0 ; i<employeeData.potentional_jobs.length;i++){
                                if(employeeData.potentional_jobs[i].job_id == jobList._id && employeeData.potentional_jobs[i].company_id ==jobList.company_id){
                                    v = false;
                                }
                            }
                            if (v){
                                listArr.push(jobList);
                            }
                            sum = 0;
                        }
                        else if (sum < 0.60 ){                          
                            console.log('No match ',jobList._id,' The sum :', sum);
                            sum = 0;
                        }  
                    });
                    if(listArr === undefined || listArr.length == 0){
                        // add array together
                        // var companyID = [];
                        // for(var i = 0; i<employeeData.potentional_jobs.length;i++){
                        //     companyID.push({
                        //         _id : employeeData.potentional_jobs[i].company_id
                        //     })
                        // }
                        // CompanySchema.find({$or: companyID}).then((data)=>{
                        //     console.log("The old data :",data);           
                        //     res.send(data);
                        for(var i =0 ; i< jobArr.lenght;i++){
                            console.log("Job Title matched " , jobArr[i].title)
                        }
                            res.send(jobArr);
                        // })
                        
                       // res.send("Potential jobs for employee and company is already updated!");
                    }else{
                        var c = employeeData.potentional_jobs;
                        var companyCode = "";
                        for(var i = 0; i<listArr.length;i++){
                           c =  c.concat({
                                matched_date: Date.now(),
                                job_id: listArr[i]._id,
                                company_id: listArr[i].company_id
                            });
                            companyCode =  companyCode.concat(`updateCompany(listArr[${i}].job_id,listArr[${i}].company_id,listArr[${i}].employee_id),`);
                            
                        }
                         var code  = eval(companyCode.slice(0, -1));
                         
                        
                        Promise.all([updateEmployee(c,listArr[0]._id),code])
                        .then(() =>{
                            for(var i =0 ; i< listArr.lenght;i++){
                                console.log("Job Title matched " , listArr[i].title)
                            }
                            res.send(listArr);
                            
                        });
                    }               
                });
            },(err) =>{
                res.status(400).send(err);
            });
        }
        else if (obj.user_type == "Company"){
            function updateEmployee(jobID,companyID,employeeID){
                EmployeeSchema.update({_id: employeeID},{$push :  {
                    potentional_jobs:{
                        matched_date: Date.now(),
                        job_id: jobID,
                        company_id: companyID
                    } 
                }}).then();
            }    
            function updateCompany(arrOfObj,companyID){
                CompanySchema.update({_id: companyID},{$set:{potential_employee: arrOfObj}}).then();
            }
            CompanySchema.findById(req.params.id).then((companySchema)=>{    
                JobSchema.find({$or : companySchema.job_position}).then((jobListByCompany)=>{  
                    var listArr = [];     
                    var loopCount = 1;             
                    jobListByCompany.forEach(jobList => {
                       
                        //for each of the job the company listed
                        var count = 0;
                        var objArr = [];
                        [jobList.require_trait_needs,jobList.require_trait_personality,jobList.require_trait_values].map(function(objOfTraits){
                            var traitClass = ["trait_needs","trait_personality","trait_values"];
                            objOfTraits.map(function(objs){
                                var obj = {};
                                obj[traitClass[count]+".trait_name"] = objs.trait_name;
                                objArr.push(obj);
                            });
                        count++;
                        // getting all the traits mapped to compare with database against users (objArr) is the array for compare
                        });
                      
                        EmployeeSchema.find({
                            $or : objArr
                        }).then(possibleEmployee =>{
                            var sum = 0 ; 
                            possibleEmployee.forEach(toMatchEmployee=>{ 
                            var v = true;
                               //start matching model
                            var requireTraitClass = ["require_trait_needs","require_trait_personality","require_trait_values"];
                            var traitClass = ["trait_needs","trait_personality","trait_values"];
                            for(var t =0 ; t<3 ;t++){
                                var jobTraits = eval("jobList."+requireTraitClass[t]);
                                var toMatchTraits = eval("toMatchEmployee."+traitClass[t]);
                                var ylen = jobTraits.length;
                                var xlen = toMatchTraits.length;
                                for(var y= 0 ;y<jobTraits.length; y++ ){
                                    for(var x= 0 ;x <toMatchTraits.length; x++ ){     
                                        if(toMatchTraits[x].trait_name == jobTraits[y].trait_name){
                                            var currentYRank = jobTraits[y].trait_rank;
                                            var currentXRank = toMatchTraits[x].trait_rank;
                                            // y for company , x is for employee 
                                            // why five because the trait of the employees which i used
                                            // watson api to find hence is a fixed amount at 5 and the percentage balancer is (((5+1-ylen)/15)+(10/15). 15 is 5 magic num 
                                            // This below is caculating the need model. divide 3 because 3 traits
                                          
                                            //console.log("X :" ,currentXRank,' Y :',currentYRank);
                                            sum += (((1+ylen)-currentYRank)/(((ylen * ylen) + ylen)/2)* ((1+xlen-currentXRank)/5)/(((6-ylen)/15)+(10/15)))/3;
                                        }  
                                    } 
                                }
                                
                            }
                            if (sum >0.60 ){                                  
                                console.log("More then 60%! Employee name : ",toMatchEmployee.full_name," is a ",Math.round(sum*100) ,"% matched!");
                                                
                                for(var i = 0 ; i<companySchema.potential_employee.length&&v ;i++){
                                    // check if matched before
                                    if(jobList._id == companySchema.potential_employee[i].job_id && companySchema.potential_employee[i].employee_id == toMatchEmployee._id){
                                        v = false;
                                       
                                    }
                                    
                                }
                                if (v){
                                   
                                    listArr.push({
                                        job_id: jobList._id,
                                        company_id: jobList.company_id,
                                        employee_id: toMatchEmployee._id
                                    });
                                    
                                }
                                sum = 0;
                            }
                            else if (sum < 0.60 ){                          
                                console.log('No match > The sum :', sum);
                                sum = 0;
                            }  
                            
                            });
                            
                            if((jobListByCompany.length == loopCount)&&(listArr === undefined || listArr.length == 0 )){
                                // add array together when no list Arr
                                var employeeID = [];
                                for(var i = 0; i<companySchema.potential_employee.length;i++){
                                    employeeID.push({
                                        _id : companySchema.potential_employee[i].employee_id
                                    })
                                }
                                console.log(employeeID);
                                if(employeeID.lenght < 0 ){
                                    console.log("Empty Matching")
                                    res.send([]);
                                }else{
                                    EmployeeSchema.find({$or: employeeID}).then((data)=>{
                                    for(var i = 0; i<data.length; i++){
                                        console.log("The matched employees:",data[i].full_name);
                                    }          
                                    res.send(data);
                                     })
                                 }
                              
                            }else if (jobListByCompany.length == loopCount){
                                var c= companySchema.potential_employee;
                                var employeeCode = "";
                                
                                for(var i = 0; i<listArr.length;i++){
                                    //console.log(listArr[i].employee_id,listArr[i].job_id);
                                    c =c.concat({
                                        matched_date: Date.now(),
                                        employee_id: listArr[i].employee_id,    
                                        job_id: listArr[i].job_id
                                    });
                                    employeeCode =  employeeCode.concat(`updateEmployee(listArr[${i}].job_id,listArr[${i}].company_id,listArr[${i}].employee_id),`);
                                }
                                
                                
                                 var code  = eval(employeeCode.slice(0, -1));
                                 

                                
                                Promise.all([updateCompany(c,listArr[0].company_id),code])
                                .then(() =>{
                                    var employeeID = [];
                                    for(var i = 0; i<c.length;i++){
                                        employeeID.push({
                                            _id : c[i].employee_id
                                        })
                                    }
                                    EmployeeSchema.find({$or: employeeID}).then((data)=>{
                                        for(var i = 0; i<data.length; i++){
                                            console.log("The matched employees:",data[i].full_name);
                                        }
                                        res.send(data);
                                    })
                                });
                            }
                            
                            loopCount++; 
                        });
                        
                         
                    });  
                  
                })
                //res.send({companySchema}); ///website will reply a json for front end to use
            },(err) =>{
                res.status(400).send(err);
            });
        }
        else{
            res.redirect('/');
        }
    });
});
//company
router.get('/jobposting/:id',(req,res)=>{
    JobSchema.find({company_id:req.params.id}).then((data,err)=>{
        if(err)
        res.status(404).send(err);
        //how to use > /jobposting/edit/_id/job_position.job_id
        //             /jobposting/add/_id
        res.send(data);
    });
});

router.get('/getJobpostingById/:id',(req,res)=>{
    JobSchema.findById({_id:req.params.id}).then((data,err)=>{
        if(err)
        res.status(404).send(err);

        //how to use > /jobposting/edit/_id/job_position.job_id
        //             /jobposting/add/_id
        res.send(data);
    });
});
router.post('/jobposting/add/:id',(req,res)=>{
    //how to use >> /jobposting/add/_id < company id
    var createdID = ObjectID.createPk();
        var job = new JobSchema({
            _id: createdID,
            title: req.body.title,
            description: req.body.description,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            company_id: req.params.id,
            specialization: req.body.specialization,
            deadline: req.body.deadline,
            require_skills: req.body.require_skills,
            require_trait_needs: req.body.require_trait_needs,
            require_trait_personality: req.body.require_trait_personality, 
            require_trait_values: req.body.require_trait_values
        });
        function updateCompany(){
            CompanySchema.findOneAndUpdate({
                _id : req.params.id
            },{$push: {
                job_position: {
                    _id: createdID
                }
            }}).then();
        };
        function addJobList(){
           return job.save().catch((err)=>{
                res.send(err);
            });
        };
        Promise.all([
            updateCompany(),
            addJobList()
        ]).then((data)=>{
            res.send(data);
        });
        
    

    

});
router.patch('/jobposting/edit/:jobID',(req,res)=>{
    //how to use >> /jobposting/edit/job_position.job_id
    //Can look nicer but another time
    JobSchema.findOneAndUpdate({'_id': req.params.jobID },{
        $set:{
            'require_trait_needs' : req.body.require_trait_needs,
            'require_trait_personality' : req.body.require_trait_personality,
            'require_trait_values' : req.body.require_trait_values,
            'title' : req.body.title,
            'description' : req.body.description,
            'start_date' : req.body.start_date,
            'end_date' : req.body.end_date,
            'specialization' : req.body.specialization,
            'require_skills' : req.body.require_skills
            } 
        },{new:true}).then((updatedData)=>{
        res.send(updatedData);
    });
});



module.exports = router;
