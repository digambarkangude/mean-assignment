app.controller('userListController',function($scope, $location, shareData, userService){
	var promise = userService.get();
	$scope.Users = {};
	promise.then(
		function(result){
			let data = result.data;
			let male_obj = {};
			let female_obj = {};
			let nat = {};
			//console.log(result);
			for(let key in data){
				

				if(data[key].gender=='male'){
					if(!male_obj.hasOwnProperty(data[key].nat))
					{
						male_obj[data[key].nat] = [];
						//male_obj[data[key].nat]['cnt']=0;
					}

					let dob = data[key].dob;
					var birthday = +new Date(dob);
  					var age = ((Date.now() - birthday) / (31557600000));
  					//console.log(dob+"=>"+parseInt(age));
  					if(age>=30 && age<=40){
  						if(!male_obj[data[key].nat].hasOwnProperty('30-40'))
  							male_obj[data[key].nat]['30-40'] = 0;
  							male_obj[data[key].nat]['30-40']++;
  					}else if(age>=40 && age<=50){
  						if(!male_obj[data[key].nat].hasOwnProperty('40-50'))
  							male_obj[data[key].nat]['40-50'] = 0;
  							male_obj[data[key].nat]['40-50']++;
  					}else{
  						if(!male_obj[data[key].nat].hasOwnProperty('50'))
  							male_obj[data[key].nat]['50'] = 0;
  							male_obj[data[key].nat]['50']++;
  					}
					//male_obj[data[key].nat]['cnt']++;// = male_obj[data[key].nat]+1;
				}else{
					if(!female_obj.hasOwnProperty(data[key].nat))
					{
						female_obj[data[key].nat] = [];
						//female_obj[data[key].nat]['cnt'] = 0;
					}
					let dob = data[key].dob;
					var birthday = +new Date(dob);
  					var age = ((Date.now() - birthday) / (31557600000));
					if(age>=30 && age<=40){
  						if(!female_obj[data[key].nat].hasOwnProperty('30-40'))
  							female_obj[data[key].nat]['30-40'] = 0;
  							female_obj[data[key].nat]['30-40']++;
  					}else if(age>=40 && age<=50){
  						if(!female_obj[data[key].nat].hasOwnProperty('40-50'))
  							female_obj[data[key].nat]['40-50'] = 0;
  							female_obj[data[key].nat]['40-50']++;
  					}else{
  						if(!female_obj[data[key].nat].hasOwnProperty('50'))
  							female_obj[data[key].nat]['50'] = 0;
  							female_obj[data[key].nat]['50']++;
  					}

					//female_obj[data[key].nat]['cnt']++;// = female_obj[data[key].nat]+1;
				}
			}
			console.log(male_obj);
			console.log(female_obj);
			$scope.Users.male = male_obj;
			$scope.Users.female = female_obj;
		},
		function(error){
			console.log(error);
		});
});
