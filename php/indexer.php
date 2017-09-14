<!DOCTYPE html>
<head>
    <title></title>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <link rel="stylesheet" type="text/css" href="../assets/css/amazon-style.css">
</head>
<body>
<div class="row">
	<div class="col-lg-12" id="output">
	</div>
</div>
<?php
		require("amazon.php");
		$searchtag = $_GET['Keywords'];
?>
<script type="text/javascript">
	var keyword = $("#amzn-input").val();

	function renderHTML(xml) {
		$.ajax({
			type: "GET",
			dataType: "xml",
			async: false, // stop browser for another activity
			url: "https://cors-anywhere.herokuapp.com/" + xml,
			success: function(xml) {
				var xmlDoc = xml;
		            $xml = $(xmlDoc);
		        var result = "";
		        if ($xml.find("Item").length > 0) {
		            result = "<div class='col-lg-12'>";
		            var keyword = "<?php echo $searchtag; ?>";
		            $xml.find("Item").each(function() {
		                result +=  "<div class='product-box'><a target='_blank' href='" + $(this).find("DetailPageURL").text() + "'><img src='";
		                result +=  $(this).find("MediumImage").find("URL").text() + "' max-width='120' max-height='160'></a><div class='product-title'><h3>";
		                result +=  $(this).find("Title").text() + "</h3></div><p class='product-price'>";
		                result +=  $(this).find("ListPrice").find("FormattedPrice").text() + "<br><a target='_blank' style='color: #337ab7; text-decoration:none;' href='";
		                result +=  $(this).find("MoreOffersUrl").text() + "'> More offers </a></p><div><span class='a-button a-button-primary'><a target='_blank' href='";
		                result +=  $(this).find("DetailPageURL").text() + "' style='text-decoration:none'><span class='a-button-inner'><img src='http://webservices.amazon.com/scratchpad/assets/images/Amazon-Favicon-64x64.png' class='a-icon a-icon-shop-now'><input class='a-button-input' type='submit' value='Add to cart'><span class='a-button-text'>Shop Now</span></span></a></span></div></div>";
		            });
		            result += "</div><a href='https://www.amazon.com/gp/search?linkCode=xm2&amp;SubscriptionId=AKIAITS6SWSK2T6NFVZA&amp;keywords=" + keyword +  "&amp;tag=jmaestas763-20&amp;creative=386001&amp;url=search-alias%3Dgrocery&amp;camp=2025' target='_blank'><div class='product-box' style='border:none;'><img height='160' src='../assets/images/more_results.png' width='120'><div><h4 style='text-align:center;'>More Results<br></h4></div></div></a>";		            
		            $("#output").append(result);
	        	};
			},
		});
	};

	var signedUrl = "<?php echo $request_url; ?>";
	renderHTML(signedUrl);
</script>
</body>
</html>