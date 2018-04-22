var siblingDiscount = {};

siblingDiscount["PlanA"] = function(sibling, miscellaneous) {
	var discount = 0.20 * determineMultiplier(sibling);
	return(parseInt(discount * miscellaneous));
}

siblingDiscount["PlanB"] = function(sibling, miscellaneous) {
	var discount = 0.17 * determineMultiplier(sibling);
	return(parseInt(discount * miscellaneous));
}

siblingDiscount["PlanC"] = function(sibling, miscellaneous) {
	var discount = 0.15 * determineMultiplier(sibling);
	return(parseInt(discount * miscellaneous));
}

siblingDiscount["PlanD"] = function(sibling, miscellaneous) {
	var discount = 0.12 * determineMultiplier(sibling);
	return(parseInt(discount * miscellaneous));
}

siblingDiscount["PlanE"] = function(sibling, miscellaneous) {
	var discount = 0.10 * determineMultiplier(sibling);
	return(parseInt(discount * miscellaneous));
}

function determineMultiplier(sibling) {
	var multiplier = 0;
	if(sibling === "1") {
		multiplier = 1;
	}
	if(sibling === "2") {
		multiplier = 2.5;
	}
	else if(sibling === "3") {
		multiplier = 3.5;
	}
	else if(sibling === "4"){
		multiplier = 4.5;
	}
	else if(sibling > 4) {
		alert("Contact the Administrator for approval");
	}
	return multiplier;
}
