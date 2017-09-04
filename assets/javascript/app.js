$(document).ready(function() {
	//materialize functions
	$('select').material_select();
	// Initialize collapse button
    $(".button-collapse").sideNav();
    // Initialize collapsible (uncomment the line below if you use the dropdown variation)
    $('.collapsible').collapsible();
     $('.carousel').carousel();

	$(".dropdown-menu button").click(function(){
			unit = $(this).text();
			console.log(unit);
			$("#form-unit").text($(this).text());
			/*$("#dropdownMenu2").val($(this).text());*/
		});

		// Initialize Firebase
		  var config = {
		    apiKey: "AIzaSyDYf02rgUgE9pbvz9axbMOfOBDD-avr27g",
		    authDomain: "downbutton-d5480.firebaseapp.com",
		    databaseURL: "https://downbutton-d5480.firebaseio.com",
		    projectId: "downbutton-d5480",
		    storageBucket: "downbutton-d5480.appspot.com",
		    messagingSenderId: "445064906768"
		  };
		  firebase.initializeApp(config);


		  var database = firebase.database();

	// Initial Values
		var ingredient = "";
		var quantity = "";
		var unit = "";

		// Capture Button Click
    $("#form-addIngredient").on("click", function() {
      // Don't refresh the page!
      event.preventDefault();

      // YOUR TASK!!!

      // Code in the logic for storing and retrieving the most recent user.
      //store user

      ingredient = $("#form-ingredient").val().trim();
      quantity = $("#form-quantity").val().trim();

      database.ref().push({
      	ingredient,
      	quantity,
      	unit:unit
      });
    });

    //retreive user
      database.ref().on("child_added", function(childSnapshot) {

      	// Log everything that's coming out of snapshot
	      console.log(childSnapshot.val().ingredient);
	      console.log(childSnapshot.val().quantity);
	      console.log(childSnapshot.val().unit);

		$("#pantry-list").append("<tr><td>" + childSnapshot.val().ingredient + "</td><td>"
			+ childSnapshot.val().quantity + "</td><td>"  
			+ childSnapshot.val().unit + "</td><td>"
			+ "checkbox" + "</td><td>"
			+ "Amazon Button" + "</td><td>"
			+ "Walmart Button" + "</td></tr>" );

		/*var unixDate = moment(childSnapshot.val().startDate, "MM/DD/YYYY").format("X");
		unixDate = moment(unixDate, "MM/DD/YYYY");
		console.log("unix date: " + unixDate);
		var snapdate = childSnapshot.val().startDate;

		var unixDate = moment.unix(snapdate, "X");
		console.log("unixDate: " + unixDate);
		console.log("snapdate: " + snapdate);*/


        $("#display-employeeName").html(childSnapshot.val().employeeName);
        /*$("#display-role").html(childSnapshot.val().role);
        $("#display-startDate").html(childSnapshot.val().startDate);
        $("#display-monthlyRate").html(childSnapshot.val().monthlyRate);*/
      }, function(errorObject) {
        console.log("errors handled: " + errorObject.code);
      });

      /*database.ref().orderbyChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
      	$("#display-employeeName").html(snapshot.val().employeeName);
        $("#display-role").html(snapshot.val().role);
        $("#display-startDate").html(snapshot.val().startDate);
        $("#display-monthlyRate").html(snapshot.val().monthlyRate);
      });*/
            // Don't forget to handle the "initial load"

    //Spoonacular API
    var diet = "&diet=";
  	var include = "";
  	var exclude = "&excludeIngredients=";
  	var calories = "&maxCalories=";
  	var type = "&type=";
  
  	// Initialize Firebase
  	var config = {
  	  apiKey: "AIzaSyCBvZc9Z1YbIZR-9MEvCABS4nbg0Z5eICM",
  	  authDomain: "spoonaculartest.firebaseapp.com",
  	  databaseURL: "https://spoonaculartest.firebaseio.com",
  	  projectId: "spoonaculartest",
  	  storageBucket: "spoonaculartest.appspot.com",
  	  messagingSenderId: "362221940130"
  	};
  	  $("#submit").on("click", function(){
  		diet += $(".diet").attr("value");
  		exclude += $(".exclude").val().trim();
  	  calories += $(".calories").val().trim();
  		type += $(".type").attr("value");
  		var queryURL = 
  	  "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?includeIngredients=" + 
  	  include + 
  	  diet +
  	  exclude + 
  	  calories + 
  	  type + 
  	  "&ranking=2&number=5&instructionsRequired=true&addRecipeInformation=true&mashape-key=EtOafYwxEJmsh9OKoxDdDksedhQLp1gkmXbjsnR7Wi1CzQDwpd";
  		$.ajax({
  		  url: queryURL,
  		  method: "GET"
  	  }).done(function(response) {
  		  console.log(response);
  	  });
  	});

});