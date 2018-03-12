app.service("userService", function($http){
	this.get = function(){
		return $http.get("http://localhost:3000/list");
	}
});