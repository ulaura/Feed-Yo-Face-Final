$(document).ready(function() {
	//populate random joke in footer
	getJoke();
	//  ***Materialize functions***
	$('select').material_select();
	// Initialize collapsible 
	$('.collapsible').collapsible();
	//Select dropdown
	$('select').material_select();
	//Modals
	$(document).ready(function(){
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
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
	//Global Variables
	var pantryItems = "";
	// Initial Values
	var ingredient = "";
	var quantity = "";
	var unit = "";
	//Get Unit information from dropdown click
	$(".dropdown-menu option").click(function() {
		unit = $(this).text();
		$("#form-unit").text($(this).text());
		/*$("#dropdownMenu2").val($(this).text());*/
	});
	// Add Ingredient to Firebase
	$("#form-addIngredient").on("click", function() {
		// Don't refresh the page!
		event.preventDefault();
		//store user
		ingredient = $("#form-ingredient").val().trim();
		quantity = $("#form-quantity").val().trim();
		unit = $(".unitDropdown .selected").text();
		//unit = $("units option:selected").attr("value");
		push = database.ref().push({
			ingredient,
			quantity,
			unit
		});
		//clear the form
		$("#form-ingredient").val("");
		$("#form-quantity").val("");
	});
	//Refresh Pantry Items on Add
	var check = 1;
	$("#pantry-list").empty();
	database.ref().on("child_added", function(childSnapshot) {
		loadPantryFromFirebase(childSnapshot);
	}, function(errorObject) {
		console.log("errors handled: " + errorObject.code);
	});
	//Cook With Deez Master Checkbox Select
	$("#check0").on("click", function() {
			var nowChecked;
			if ($("#check0").is(':checked')) {
				nowChecked = true;
			} else {
				nowChecked = false;
			}
			if (nowChecked) {
				for (var i = 0; i < $("#pantry-list tr").length; i++) {
					$("#pantry-list tr").eq(i).children("td").eq(3).children("input").prop('checked', true);
				}
			} else {
				for (var i = 0; i < $("#pantry-list tr").length; i++) {
					$("#pantry-list tr").eq(i).children("td").eq(3).children("input").prop('checked', false);
				}
			}
		})
	//if checked enable search for recipes
	$(document).on("click",".pantryCheckBox", disableSearch);
	$(document).on("click","#check0", disableSearch);

	function disableSearch() {
		var howManyUnChecked = 0;
		if ($(this).is(":checked", true)) {
			$("#select").removeClass("disabled");
			$("#findOnWalmart").removeClass("disabled");
		} else {
			for (var i = 0; i < $("#pantry-list tr").length; i++) {
				if ($("#pantry-list tr").eq(i).children("td").eq(3).children("input").is(':checked')) {
					
				} else {
					howManyUnChecked++;
				}
			}
			if (howManyUnChecked == $("#pantry-list tr").length) {
				$("#select").addClass("disabled");
				$("#findOnWalmart").addClass("disabled");
			}
			
		}
	};
	//change favorite star from grey to gold and vice versa
	$(document).on("click", ".favoriteStar", function() {
		if ($(this).hasClass("white-text")) {
			$(this).removeClass("yellow-text white-text");
			$(this).addClass("yellow-text");
		} else {
			$(this).removeClass("yellow-text white-text");
			$(this).addClass("white-text");
		}
	});
	var itemToAdd = "";
	$(".box").on("click", function() {
			itemToAdd += ",";
		})
		//Load pantry list from firebase
	function loadPantryFromFirebase(childSnapshot) {
		// Log everything that's coming out of snapshot
		/*console.log(childSnapshot.val().ingredient);
		console.log(childSnapshot.val().quantity);
		console.log(childSnapshot.val().unit);
		console.log(childSnapshot.key);*/
		pantryItems += childSnapshot.val().ingredient + ",";
		$("#pantry-list").append("<tr data-name=\"" + childSnapshot.key + "\"><td>" + childSnapshot.val().ingredient + "</td><td>" + childSnapshot.val().quantity + "</td><td>" + childSnapshot.val().unit + "</td><td>" + "<input type='checkbox' id='check" + check + "' class='pantryCheckBox'/><label for='check" + check + "'></label></td><td>" + "<a href=\"https://www.amazon.com/s/ref=nb_sb_noss?url=srs%3D7301146011%26search-alias%3Dpantry&field-keywords=" + childSnapshot.val().ingredient + "\" target='_blank' class='waves-effect waves-light btn blue darken-1 modal-trigger amazonButton' id='findOnAmazon'>Amazon</a></td><td>" + "<a class='btn-floating btn red box'><i class='small material-icons deletePantryItemButton'>delete_forever</i></a></td></tr>");
		check++;
	}

	function eqDivs() {
		if ($(".pantry .card-content").height() > $(".mixingBowl .card-content").height()) {
			$(".mixingBowl").css("height", $(".pantry .card-content").height());
		} else {
			$(".pantry .card-content").css("height", $(".mixingbowl").height());
		}
	}
	//Pagination
	$(".pagination li").not(".disable").on("click", function() {
		$(".pagination li.active").removeClass("active").addClass("waves-effect");
		$(this).addClass("active").removeClass("waves-effect");
	});
	//Add items to Mixing Bowl
	/*$("#addToBowl").on("click", function() {
		console.log($("#pantry-list").children("tr").length);
		console.log("ingredient list: " + pantryItems);
		for (var i = 0; i < $("#pantry-list").children("tr").length; i++) {
			//if this item is checked add to mixing bowl list
			if ($("#pantry-list").children("tr").eq(i).children("td").eq(3).children("input").is(':checked')) {
				$("#mixingBowlList").append("<tr><td><span ingredient-name=\"" + $("#pantry-list").children("tr").eq(i).children("td").eq(0).text() + "\">" + $("#pantry-list").children("tr").eq(i).children("td").eq(0).text() + "</span></td><td><span>" + $("#pantry-list").children("tr").eq(i).children("td").eq(1).text() + "</span></td><td><span>" + $("#pantry-list").children("tr").eq(i).children("td").eq(2).text() + "</span></td><td>" + "<a class=\"btn-floating btn red box\"><i class=\"material-icons deleteBowlItemButton\">delete_forever</i></a>");
				eqDivs();
			}
		}
	});*/
	// Delete Items from Mixing Bowl
	/*$(document).on("click", ".deleteBowlItemButton", function() {
		$(this).closest("tr").remove();
		eqDivs();
	});*/
	//Delete Pantry Item
	var rootRef = database.ref();
	$(document).on("click", ".deletePantryItemButton", function(e) {
		var key = $(this).closest("tr").attr("data-name");
		rootRef.child(key).remove();
		eqDivs();
		// Refresh pantry list - empty the Pantry List and Load it again
		$("#pantry-list").empty();
		database.ref().on("child_added", function(childSnapshot) {
			loadPantryFromFirebase(childSnapshot);
			eqDivs();
		}, function(errorObject) {
			console.log("errors handled: " + errorObject.code);
		});
	});
	//AMAZON
	var amazonSearchKeyword = "";
	$(document).on("click", ".amazonButton", function() {
			/*console.log($(this).closest("tr").children("td").eq(0).text());*/
		})
		//  ***Spoonacular API***
		//initialize variables
	var diet = "";
	var include = "";
	var exclude = "";
	var calories = "";
	var type = "";
	// Search For Recipes
	$("#select").on("click", function() {
		event.preventDefault();
		var ingredientList = $("#pantry-list").children("tr");
		include = "";
		for (var i = 0; i < ingredientList.length; i++) {
			//add ingredients to api parameter
			if ($("#pantry-list").children("tr").eq(i).children("td").eq(3).children("input").is(':checked')) {
				include += ingredientList.eq(i).children("td").eq(0).text() + ",";
			}
		}
		//remove comma from last ingredient
		include = include.slice(0, -1);
		// console.log(include);
		//search through diets and find selected
		diet = "&diet=";
		diet = "&diet=" + $(".dietDropdown ul li.selected").text().replace(/\s/g, "");
		/*exclude = "&excludeIngredients=" + $(".exclude").val().trim();*/
		calories = "&maxCalories=" + $(".calories").val().trim();
		//search through type and find selected
		type = "&type=";
		type = "&type=" + $(".courseDropdown ul li.selected").text().replace(/\s/g, "");
		var queryURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?includeIngredients=" + include + diet + exclude + calories + type + "&ranking=2&number=6&instructionsRequired=true&addRecipeInformation=true&mashape-key=EtOafYwxEJmsh9OKoxDdDksedhQLp1gkmXbjsnR7Wi1CzQDwpd";
		$.ajax({
			url: queryURL,
			method: "GET"
		}).done(function(response) {
			//Get length of results to display that number of cards
			var responseLength = response.results.length;
			//clear old cards
			$("#recipe-cards").empty();
			//start creating the cards
			for (var i = 0; i < responseLength; i++) {
				var cardDiv = $("<div class=\"col s12 m4 cardDiv\">");
				var card = $("<div class=\"card recipeCard\">");
				var cardImage = $("<div class=\"card-image\">");
				var image = $("<img class=\"recipeImage\">");
				var cardContent = $("<div class=\"card-content\">");
				var cardTitle = $("<span class=\"card-title\">");
				var cardParagraph = $("<p class=\"cardParagraph col s12\">");
				var cardTime = $("<span class=\"cardTime\">");
				var cardScore = $("<span class=\"cardScore\">");
				var cardIngredients = $("<span class=\"cardIngredients\">");
				var Ingredients = "";
				var cardAction = $("<div class=\"card-action\" style='clear:both'>");
				var cardSource = $("<a class=\"cardsource\">");
				var star = $("<a class='btn-floating grey'><i class=\"small material-icons small white-text favoriteStar\">star</i></a>")
				var titleDiv = $("<div class=\"titleDiv\">");
				//add img src
				image.attr("src", response.results[i].image);
				//add card title
				cardTitle.text(response.results[i].title);
				//add card time
				cardTime.text("Ready In " + response.results[i].readyInMinutes + " Minutes");
				//add card score
				cardScore.text("Spoonacular Score: " + response.results[i].spoonacularScore);
				//add missing ingredients
				/*cardIngredients.text("Ingredients: " + Ingredients);*/
				var numberOfIngredients = response.results[0].analyzedInstructions[0].steps[0];
				/*for (var i = 0; i < response.results[i].analyzedInstructions[0].ingredients; i++) {
					var ingredient = response.results[i].analyzedInstructions[0].ingredients[i].name;
					console.log("ingredient: " + ingredient);
				}*/
				//add card source
				cardSource.attr("href", response.results[i].spoonacularSourceUrl).text("VIEW RECIPE").attr("target", "_blank").attr("style","text-center;");
				$("#recipe-cards").append(cardDiv);
				cardDiv.append(card);
				card.append(cardImage).append(cardContent).append(cardAction);
				cardImage.append(image);
				cardContent.append(titleDiv);
				titleDiv.append($("<div class=\"col s10\">").append(cardTitle)).append($("<div class=\"col s2\">").append(star));
				cardContent.append(cardParagraph);
				cardParagraph.append(cardTime).append("<br>").append(cardScore).append("<br>").append(cardIngredients).append("<br>");
				cardAction.append(cardSource);
			}
		});
	});
	//Get a random joke
	function getJoke() {
		var queryURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/jokes/random?mashape-key=EtOafYwxEJmsh9OKoxDdDksedhQLp1gkmXbjsnR7Wi1CzQDwpd"
		$.ajax({
			url: queryURL,
			method: "GET"
		}).done(function(response) {
			var joke = response.text;
			$("#joke").html(joke);
		});
	};
	// to get the Walmart API to function **THIS IS WHERE LAURA STARTED WORKING***
	// the on-click function to initiate Walmart API search
	$("#findOnWalmart").on("click", function() {
		// iterating through however many pantry items we have...
		for (var i = 0; i < $("#pantry-list").children("tr").length; i++) {
			/* if one of the pantry items has a check mark next to it, the Walmart API will run a search
			for that item */
			if ($("#pantry-list").children("tr").eq(i).children("td").eq(3).children("input").is(':checked')) {
				// Walmart API variables
				var apiKey = "fazraus843kfm9js8vn2x22h";
				var itemSearch = $("#pantry-list").children("tr").eq(i).children("td").eq(0).html(); // targetting the actual name of the pantry item
				// numItems=5 limits the search to five responses
				var walmartQueryUrl = "https://api.walmartlabs.com/v1/search?apiKey=" + apiKey + "&query=" + itemSearch + "&numItems=5";
				$.ajax({
					url: walmartQueryUrl,
					method: "GET",
					crossDomain: true, // to get over the CORS issue
					dataType: "jsonp", // to get over the CORS issue
					beforeSend: setHeader // to get over the CORS issue - setHeader is a function defined below
				}).done(function(response) {
					// this for-loop is to iterate through the five responses from the Walmart API call
					for (var j = 0; j < response.items.length; j++) {
						var imageSRC = response.items[j].mediumImage;
						var cardDiv = $("<div class=\"col s4 m4 walmartCardDiv\">");
						var card = $("<div class=\"card walmartCard\">");
						var cardImage = $("<div class=\"card-image\">");
						var image = $("<img style='width: 70%;'>");
						var cardContent = $("<div class=\"card-content\">");
						var cardTitle = $("<span class=\"card-title\">");
						var cardParagraph = $("<p class=\"cardParagraph\">");
						/*var cardTime = $("<span class=\"cardTime\">");*/
						var cardScore = $("<span class=\"cardScore\">");
						/*var cardDescription = $("<span class=\"cardDescription\">");*/
						var cardAction = $("<div class=\"card-action\">");
						var cardSource = $("<a class=\"cardsource\">"); // change this
						//add img src
						image.attr("src", response.items[j].mediumImage);
						//add card title
						cardTitle.text(response.items[j].name);
						//add card paragraph, which will be the sale price of the item
						cardParagraph.text("$" + response.items[j].salePrice);
						//add card score, which will be the product rating off of walmart.com
						cardScore.text("Customer Rating (out of 5): " + response.items[j].customerRating);
						//allow users to add item to their cart on Walmart.com
						cardSource.attr("href", response.items[j].addToCartUrl);
						cardSource.attr("target", "_blank");
						cardSource.text("Add This to Your Walmart Cart");
						$(".walmart-content").append(cardDiv); // the targeted id will have to created or changed to fit the new design
						cardDiv.append(card);
						card.append(cardImage).append(cardContent).append(cardAction);
						cardImage.append(image);
						cardContent.append(cardTitle).append(cardParagraph);
						cardParagraph.append("<br>").append(cardScore).append("<br>");
						cardAction.append(cardSource);
					}
				}).fail(function(err) {
					throw err;
				});
				// setHeader function to help with the CORS issue
				function setHeader(xhr) {
					xhr.setRequestHeader("Authorization", walmartQueryUrl)
				}
			}
		}
	});
	// ***THIS IS WHERE LAURA ENDED HER WORK***
	//Firebase Authentication
	// CHECK CURRENT PATH
	var currentPath = $(location)[0].pathname;
	// CHECK IF USER IS SIGNED IN
	firebase.auth().onAuthStateChanged(function(user) {
		if (user && (currentPath === '/index.html' || currentPath === '/')) {
			// REDIRECT IF AUTHENTICATED
			$(location).attr('href', 'app.html');
		} else if (!user && currentPath === '/app.html') {
			// REDIRECT IF NOT AUTHENTICATED
			$(location).attr('href', 'index.html');
		}
	});
	// SIGN IN THE USER
	$('#logIn').on('click', function() {
		/*console.log("clicked log in");*/
		$("#error").empty();
		var email = $('#email').val().trim();
		var password = $('#password').val().trim();
		if (email && password) {
			// ADD USER TO DATABASE
			firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
				$(location).attr('href', 'app.html');
			}).catch(function(error) {
				$("#error").html("ERROR: " + error.message);
			});
		}
	});
	// SIGN UP THE USER
	$('#signUp').on('click', function() {
		/*console.log("clicked Sign Up");*/
		$("#error").empty();
		var email = $('#email').val();
		var password = $('#password').val();
		firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
			$(location).attr('href', 'app.html');
		}).catch(function(error) {
			$("#error").html("ERROR: " + error.message);
		});
	});
	// SIGN OUT THE USER
	$('#logOut').on('click', function() {
		$("#error").empty();
		firebase.auth().signOut().then(function() {
			$(location).attr('href', 'index.html');
		}).catch(function(error) {
			$("#error").html("ERROR: " + error.message);
		});
	});
});