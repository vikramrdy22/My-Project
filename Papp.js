var app = angular.module('app', ['ngRoute']);

app.controller('ProjectController', function($scope){
	$scope.ProjectName="Pharma Project";
	
	$scope.AngularMenu=[{"DisplayText":"Sample1","Navigation":"#Sample1","Title":"This link is to know about Sample1"},{"DisplayText":"Sample2","Navigation":"#Sample2","Title":"This link is to know about Sample2"},{"DisplayText":"Sample3","Navigation":"#Sample3","Title":"This link is to know about Sample3"}];
	
	$scope.JqueryMenu=[{"DisplayText":"Master Account Form","Navigation":"#MasterAccountForm","Title":"This link is to know about Master Account Form"},{"DisplayText":"Scheme Form","Navigation":"#SchemeForm","Title":"This link is to know about Scheme Form"},{"DisplayText":"Area Master Form","Navigation":"#AreaMasterForm","Title":"This link is to know about Area Master"}];
	
	$scope.TopMenu=[{"DisplayText":"Login","Navigation":"#Login","Title":"Login"},{"DisplayText":"Settings","Navigation":"#Settings","Title":"Settings"},{"DisplayText":"Profile","Navigation":"#Profile","Title":"Profile"},{"DisplayText":"Help","Navigation":"#Help","Title":"Help"}];
	
});

app.controller('MasterAccountFormController',function($scope){	
		$scope.SchemeList = [{"ID":1,"Name":"Scheme1"},{"ID":2,"Name":"Scheme2"},{"ID":3,"Name":"Scheme3"},{"ID":4,"Name":"Scheme4"},{"ID":5,"Name":"Scheme5"},{"ID":6,"Name":"Scheme6"}];							
		$scope.AreaList = [{"ID":1,"Name":"Area1"},{"ID":2,"Name":"Area2"},{"ID":3,"Name":"Area3"},{"ID":4,"Name":"Area4"},{"ID":5,"Name":"Area5"},{"ID":6,"Name":"Area6"}];
		 $scope.Users=[];
			 $scope.submitForm = function () {
				 $scope.submitted = true;
				 if ($scope.userForm.$valid) {
					 $scope.Users.push($scope.user);			 
					 $scope.user={};
					 $scope.userForm.$setPristine();
					 $scope.submitted=false;
				 }
				 else {		 
					$("#formAlert").show('fade');
					setTimeout(function(){
						$("#formAlert").hide('fade');
					},2000);
					$("#linkclose").click(function(){
						$("#formAlert").hide('fade');
					});
				 }
			};

});

app.controller('SchemeFormController', function ($scope) {
 $scope.SchemeList =[{"Scheme":1,"Name":"Assets"},{"Scheme":2,"Name":"Liablities"},{"Scheme":3,"Name":"Trading"},{"Scheme":4,"Name":"Income"},{"Scheme":5,"Name":"Expaneses"}];
$scope.user={};
$scope.Orig=angular.copy($scope.user);
 $scope.Users=[];
	 $scope.submitForm = function () {
		 $scope.submittedScheme = true;
		 if ($scope.SchemeForm.$valid) {
			 $scope.Users.push($scope.user);			 
			 $scope.user={};
			 $scope.SchemeForm.$setPristine();
			 $scope.submittedScheme=false;
			 //
		 }
		 else {
			$("#formAlert").show('fade');
			setTimeout(function(){
				$("#formAlert").hide('fade');
			},2000);
			$("#linkclose").click(function(){
				$("#formAlert").hide('fade');
			});
		 }
	};
});

app.directive('loading', function () {
      return {
        restrict: 'E',
        replace:true,
        template: '<div class="loading"><img src="http://www.nasa.gov/multimedia/videogallery/ajax-loader.gif" width="50" height="50" />LOADING...</div>',
        link: function (scope, element, attr) {
              scope.$watch('loading', function (val) {
                  if (val)
                      $(element).show();
                  else
                      $(element).hide();
              });
        }
      }
  })
app.controller('AreaMasterController',function($scope,$http){	
		 $scope.Areas=[];
		 $scope.model = {
			contacts: [],
			selected: {}
		};
		  $scope.GetAreas = function () {
			$scope.loading = true;
            $http.get('http://localhost/WCF_Rest_Service/PharmaService.svc/GetAreas')
            .success(function (data, status, headers, config) {
                $scope.model.contacts = data.Data;
				 $scope.loading = false;
            })
            .error(function (data, status, header, config) {
                $scope.ResponseDetails = "Data: " + data +
                    "<br />status: " + status +
                    "<br />headers: " + jsonFilter(header) +
                    "<br />config: " + jsonFilter(config);
            });
        };
		
		$scope.GetAreas();
		
		 $scope.submitForm = function () {
			 $scope.AreaMasterFormsubmitted = true;
			 if ($scope.AreaNameForm.$valid) {
				$http({
					  url: "http://localhost/WCF_Rest_Service/PharmaService.svc/SaveArea", 
					  method: "GET",
					  params:{AreaName: $scope.user.AreaName}
					 })
					.success(function (data, status, headers, config) {
						$scope.status = data.Data;	
						$scope.GetAreas();
					})
					.error(function (data, status, header, config) {
						$scope.ResponseDetails = "Data: " + data +
							"<br />status: " + status +
							"<br />headers: " + jsonFilter(header) +
							"<br />config: " + jsonFilter(config);
					});
		     $scope.Areas.push($scope.user); 
			 $scope.user={};
			 $scope.AreaNameForm.$setPristine();
			 $scope.AreaMasterFormsubmitted=false;
			 }
			 else {
				$("#formAlert").show('fade');
				setTimeout(function(){
					$("#formAlert").hide('fade');
				},2000);
				$("#linkclose").click(function(){
					$("#formAlert").hide('fade');
				});
			 }
		};
			// gets the template to ng-include for a table row / item
		$scope.getTemplate = function (contact) {
			if (contact.AreaID === $scope.model.selected.AreaID) return 'edit';
			else return 'display';
		};

		$scope.editContact = function (contact) {
			$scope.model.selected = angular.copy(contact);			
		};
		$scope.deletecontact = function (contact,eve) {
			$(eve.target).closest('tr').remove();
			var	Index=$scope.model.contacts.indexOf(contact);
			
			$http({
				  url: "http://localhost/WCF_Rest_Service/PharmaService.svc/DeleteArea", 
				  method: "GET",
				  params:{AreaID:contact.AreaID}
				 })
				.success(function (data, status, headers, config) {
					$scope.status = data.Data;						
				})
				.error(function (data, status, header, config) {
					$scope.ResponseDetails = "Data: " + data +
						"<br />status: " + status +
						"<br />headers: " + jsonFilter(header) +
						"<br />config: " + jsonFilter(config);
				});
				if(Index > -1){
					$scope.model.contacts.splice(Index, 1);
				}
		};

		$scope.saveContact = function (idx) {
			console.log("Saving contact");
			$scope.model.contacts[idx] = angular.copy($scope.model.selected);
			$http({
				  url: "http://localhost/WCF_Rest_Service/PharmaService.svc/UpdateArea", 
				  method: "GET",
				  params:{AreaName:$scope.model.contacts[idx].AreaName,AreaID:$scope.model.contacts[idx].AreaID}
				 })
				.success(function (data, status, headers, config) {
					$scope.status = data.Data;						
				})
				.error(function (data, status, header, config) {
					$scope.ResponseDetails = "Data: " + data +
						"<br />status: " + status +
						"<br />headers: " + jsonFilter(header) +
						"<br />config: " + jsonFilter(config);
				});
			$scope.reset();
			
		};

		$scope.reset = function () {
			$scope.model.selected = {};
		};

});

