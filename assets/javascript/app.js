$(document).ready(function() {
	//populate random joke in footer
	//getJoke();

//  ***Materialize functions***
	$('select').material_select();
    // Initialize collapsible 
    $('.collapsible').collapsible();
    //Select dropdown
    $('select').material_select();

	$(".dropdown-menu option").click(function(){
			unit = $(this).text();
			console.log(unit);
			$("#form-unit").text($(this).text());
			/*$("#dropdownMenu2").val($(this).text());*/
		});

	// Initialize Firebase
	  var config = {
	    apiKey: "AIzaSyCBvZc9Z1YbIZR-9MEvCABS4nbg0Z5eICM",
    	authDomain: "spoonaculartest.firebaseapp.com",
    	databaseURL: "https://spoonaculartest.firebaseio.com",
    	projectId: "spoonaculartest",
    	storageBucket: "spoonaculartest.appspot.com",
    	messagingSenderId: "362221940130"
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

      //store user
      ingredient = $("#form-ingredient").val().trim();
      quantity = $("#form-quantity").val().trim();
      //unit = $("units option:selected").attr("value");

      database.ref().push({
      	ingredient,
      	quantity,
      	unit:unit
      });
    });

    //Add items to pantry
    var check = 1;
    database.ref().on("child_added", function(childSnapshot) {

	  // Log everything that's coming out of snapshot
	  console.log(childSnapshot.val().ingredient);
	  console.log(childSnapshot.val().quantity);
	  console.log(childSnapshot.val().unit);

	  $("#pantry-list").append("<tr><td>" + childSnapshot.val().ingredient + "</td><td>"
	    + childSnapshot.val().quantity + "</td><td>"  
		+ childSnapshot.val().unit + "</td><td>"
		+ "<input type='checkbox' id='check" + 
		check + "'/><label for='check" + 
		check + "'></label></td><td>"
		+ "<a class='btn-floating btn red box'><i class='small material-icons'>delete_forever</i></a></td></tr>");
		check++;
      }, function(errorObject) {
        console.log("errors handled: " + errorObject.code);
      });

    var itemToAdd = "";
    $(".box").on("click", function() {
    	itemToAdd += ",";
    })

    $("#addToBowl").on("click", function() {

    })

    //Add items to Mixing Bowl
    $("#addToBowl").on("click", function() {
      console.log($("#pantry-list").children("tr").length);
      for (var i = 0; i < $("#pantry-list").children("tr").length; i++) {
        //if this item is checked add to mixing bowl list
        if ($("#pantry-list").children("tr").eq(i).children("td").eq(3).children("input").is(':checked')) {
          $(".ingredientList").append("<li><span ingredient-name=\"" + $("#pantry-list").children("tr").eq(i).children("td").eq(0).text() + "\">" + $("#pantry-list").children("tr").eq(i).children("td").eq(0).text() + "</span></li>");
          /*console.log($("#pantry-list").children("tr").eq(i).children("td").eq(0).text() + " checked!");*/
        }
      }
      /*$("#pantrylist").children("tr")*/
    });
    


//  ***Spoonacular API***
	//initialize variables
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

  	//Get a random joke
  	function getJoke(){
  	  var queryURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/jokes/random?mashape-key=EtOafYwxEJmsh9OKoxDdDksedhQLp1gkmXbjsnR7Wi1CzQDwpd"
  	  $.ajax({
  		  url: queryURL,
  		  method: "GET"
  	  }).done(function(response) {
  		var joke = response.text;
  		$("#joke").html(joke);
  	  });
  	};
  	


});