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

      push = database.ref().push({
      	ingredient,
      	quantity,
      	unit:unit
      });

      //clear the form
      $("#form-ingredient").val("");
      $("#form-quantity").val("");
    });

    //Refresh Pantry Items on Add
    var check = 1;
    database.ref().on("child_added", function(childSnapshot) {
		loadPantryFromFirebase(childSnapshot);	  
	}, function(errorObject) {
	  console.log("errors handled: " + errorObject.code);
	});


    var itemToAdd = "";
    $(".box").on("click", function() {
    	itemToAdd += ",";
    })

    //Load pantry list from firebase
    function loadPantryFromFirebase(childSnapshot) {
    	// Log everything that's coming out of snapshot
	  console.log(childSnapshot.val().ingredient);
	  console.log(childSnapshot.val().quantity);
	  console.log(childSnapshot.val().unit);
      console.log(childSnapshot.key);

	  $("#pantry-list").append("<tr data-name=\"" + childSnapshot.key + "\"><td>" + childSnapshot.val().ingredient + "</td><td>"
	    + childSnapshot.val().quantity + "</td><td>"  
		+ childSnapshot.val().unit + "</td><td>"
		+ "<input type='checkbox' id='check" + 
		check + "'/><label for='check" + 
		check + "'></label></td><td>"
		+ "<a class='btn-floating btn red box'><i class='small material-icons deletePantryItemButton'>delete_forever</i></a></td></tr>");
		check++;
    }

    //Add items to Mixing Bowl
    $("#addToBowl").on("click", function() {
      console.log($("#pantry-list").children("tr").length);
      for (var i = 0; i < $("#pantry-list").children("tr").length; i++) {
        //if this item is checked add to mixing bowl list
        

        if ($("#pantry-list").children("tr").eq(i).children("td").eq(3).children("input").is(':checked')) {
          $("#mixingBowlList").append("<tr><td><span ingredient-name=\"" + $("#pantry-list").children("tr").eq(i).children("td").eq(0).text() + "\">"
           + $("#pantry-list").children("tr").eq(i).children("td").eq(0).text() + "</span></td><td><span>"
           + $("#pantry-list").children("tr").eq(i).children("td").eq(1).text() + "</span></td><td><span>"
           + $("#pantry-list").children("tr").eq(i).children("td").eq(2).text() + "</span></td><td>"
           + "<a class=\"btn-floating btn red box\"><i class=\"material-icons deleteBowlItemButton\">delete_forever</i></a>"
           );
        }
      }
    });

    // Delete Items from Mixing Bowl
    $(document).on("click", ".deleteBowlItemButton", function() {
      $(this).closest("tr").remove();
    });
    
    //Delete Pantry Item
    var rootRef = database.ref();
    $(document).on("click", ".deletePantryItemButton", function(e) {
      var key = $(this).closest("tr").attr("data-name");
      rootRef.child(key).remove();

     // Refresh pantry list - empty the Pantry List and Load it again
     $("#pantry-list").empty();
	database.ref().on("child_added", function(childSnapshot) {
		loadPantryFromFirebase(childSnapshot);	  
	}, function(errorObject) {
	  console.log("errors handled: " + errorObject.code);
	});
    });


//  ***Spoonacular API***
	//initialize variables
    var diet = "";
  	var include = "";
  	var exclude = "";
  	var calories = "";
  	var type = "";

    // Search For Recipes
	  $("#select").on("click", function(){
      event.preventDefault();
      var ingredientList = $("#mixingBowlList").children("tr");

      include = "";
      for (var i = 0; i < ingredientList.length; i++) {
        //add ingredients to api parameter
        include += ingredientList.eq(i).children("td").eq(0).text() + ",";
      }
      //remove comma from last ingredient
      include = include.slice(0, -1);
      console.log(include);

      //search through diets and find selected
      diet = "&diet=";
      diet = "&diet=" + $(".dietDropdown ul li.selected").text().replace(/\s/g, "");
      
  		/*exclude = "&excludeIngredients=" + $(".exclude").val().trim();*/
  	  calories = "&maxCalories=" + $(".calories").val().trim();

      //search through type and find selected
      type = "&type=";
      type = "&type=" + $(".courseDropdown ul li.selected").text().replace(/\s/g, "");

  		var queryURL = 
  	  "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?includeIngredients=" + 
  	  include + 
  	  diet +
  	  exclude + 
  	  calories + 
  	  type + 
  	  "&ranking=2&number=6&instructionsRequired=true&addRecipeInformation=true&mashape-key=EtOafYwxEJmsh9OKoxDdDksedhQLp1gkmXbjsnR7Wi1CzQDwpd";

      console.log()
		$.ajax({
		  url: queryURL,
		  method: "GET"
	  }).done(function(response) {
		  console.log(response);
      //Get length of results to display that number of cards
      var responseLength = response.results.length;

      //clear old cards
      $("#recipe-cards").empty();
      //start creating the cards
      for (var i = 0; i < responseLength; i++) {
        var cardDiv = $("<div class=\"col s12 m4 cardDiv\">");
        var card = $("<div class=\"card\">").addClass("medium");
        var cardImage = $("<div class=\"card-image\">");
        var image = $("<img>");
        var cardContent = $("<div class=\"card-content\">");
        var cardTitle = $("<span class=\"card-title\">");
        var cardParagraph = $("<p class=\"cardParagraph\">");
        var cardTime = $("<span class=\"cardTime\">");
        var cardScore = $("<span class=\"cardScore\">");
        /*var cardDescription = $("<span class=\"cardDescription\">");*/
        var cardAction = $("<div class=\"card-action\">");
        var cardSource = $("<a class=\"cardsource\">");

        //add img src
        image.attr("src", response.results[i].image);

        //add card title
        cardTitle.text(response.results[i].title);

        //add card time
        cardTime.text("Ready In " + response.results[i].readyInMinutes + " Minutes");

        //add card score
        cardScore.text("Spoonacular Score: " + response.results[i].spoonacularScore);

        //add card source
        cardSource.attr("href", response.results[i].spoonacularSourceUrl).text("OPEN SOURCE PAGE").attr("target", "_blank");


        $("#recipe-cards").append(cardDiv);
        cardDiv.append(card);
        card.append(cardImage).append(cardContent).append(cardAction);
        cardImage.append(image);
        cardContent.append(cardTitle).append(cardParagraph);
        cardParagraph.append(cardTime).append("<br>").append(cardScore)/*.append(cardDescription)*/.append("<br>");
        cardAction.append(cardSource);
        
        }
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
    

    // to get the Walmart API modal to function **THIS IS WHERE I STARTED WORKING***
    $('.modal').modal({
        dismissible: true,
        opacity: 0
    });

    $("#walmart-search-button").on("click", function(){

      // Walmart API variables
      var apiKey = "fazraus843kfm9js8vn2x22h";
      var itemSearch = $("#walmartSearch").val().trim(); //the item we are searching for, taken from the modal form
      // numItems=5 limits the search to five results
      var walmartQueryUrl = "https://api.walmartlabs.com/v1/search?apiKey=" + apiKey + "&query=" + itemSearch + "&numItems=5"; 

      $.ajax({
        url: walmartQueryUrl,
        method: "GET",
        crossDomain: true,
        dataType: "jsonp",
        beforeSend: setHeader
      }).done(function(result) {
        console.log(result); //test

        // this for-loop is to iterate through the five results from the API call
        for (var i=0; i < result.items.length; i++) {
              var imageSRC = result.items[i].imageEntities[i].mediumImage; 
              console.log("Image src is " + imageSRC); //test

              var cardDiv = $("<div class=\"col s12 m7 cardDiv\">");
              var card = $("<div class=\"card\">").addClass("medium");
              var cardImage = $("<div class=\"card-image\">");
              var image = $("<img>");
              var cardContent = $("<div class=\"card-content\">");
              var cardTitle = $("<span class=\"card-title\">");
              var cardParagraph = $("<p class=\"cardParagraph\">");
              /*var cardTime = $("<span class=\"cardTime\">");*/
              var cardScore = $("<span class=\"cardScore\">");
              /*var cardDescription = $("<span class=\"cardDescription\">");*/
              var cardAction = $("<div class=\"card-action\">");
              var cardSource = $("<a class=\"cardsource\">");
              

              //add img src
              image.attr("src", result.items[i].imageEntities[i].mediumImage);

              //add card title
              cardTitle.text(result.items[i].name);

              //add card paragraph, which will be the sale price of the item
              cardParagraph.text(result.items[i].salePrice);


              //add card score, which will be the product rating off of walmart.com
              cardScore.text(result.items[i].customerRating);

              $("#walmart-search-results").append(cardDiv);
              cardDiv.append(card);
              card.append(cardImage).append(cardContent).append(cardAction);
              cardImage.append(image);
              cardContent.append(cardTitle).append(cardParagraph);
              cardParagraph/*.append(cardTime)*/.append("<br>").append(cardScore)/*.append(cardDescription)*/.append("<br>");
              cardAction.append(cardSource);


          }




          
        }).fail(function(err) {
          throw err;
        });
        
        function setHeader(xhr) {
          xhr.setRequestHeader("Authorization", walmartQueryUrl)
        }




    });
    // ***THIS IS WHERE I ENDED MY WORK***

  //Firebase Authentication
  // CHECK CURRENT PATH
  var currentPath = $(location)[0].pathname;
  // CHECK IF USER IS SIGNED IN
  firebase.auth().onAuthStateChanged(function(user) {
    if(user && (currentPath === '/signInPage.html' || currentPath === '/' )) {
      // REDIRECT IF AUTHENTICATED
      $(location).attr('href', 'index.html');
    } else if(!user && currentPath === '/index.html') {
      // REDIRECT IF NOT AUTHENTICATED
      $(location).attr('href', 'signInPage.html');
    }
  });
  // SIGN IN THE USER
  $('#logIn').on('click', function() {
    console.log("clicked log in");
    var email = $('#email').val().trim();
    var password = $('#password').val().trim();
    if(email && password) {
      // ADD USER TO DATABASE
      firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
          $(location).attr('href', 'index.html');
        }).catch(function(error) {
          alert(error.message);
        });
    }
  });
  // SIGN UP THE USER
  $('#signUp').on('click', function() {
    console.log("clicked Sign Up");
    var email = $('#email').val();
    var password = $('#password').val();
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
        $(location).attr('href', 'index.html');
      }).catch(function(error) {
        alert(error.message);
      });
  });
  // SIGN OUT THE USER
  $('#logOut').on('click', function() {
    firebase.auth().signOut().then(function() {
        $(location).attr('href', 'signInPage.html');
      }).catch(function(error) {
        alert(error.message);
      });
  });
  	


});