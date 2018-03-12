app.controller('userListController',function($scope, $location, shareData, userService){
	var promise = userService.get();
	var Users = '';
	promise.then(
		function(result){
			let data = result.data;
			let male_obj = {};
			let female_obj = {};
			let nat = {};
			for(let key in data){
				console.log(data[key][k]);
				
				/*if(!Object.values(nat).includes(data[key].nat)){
					
				}*/
				for(let k in data[key]){
				//console.log(data[key][k]);
				if(data[key][k]=='male'){
					//male_obj.push()		
				}
			}

			}
			$scope.Users = result.data;
		},
		function(error){
			console.log(error);
		});
});
