$('input').on('click', function() {
	$('input').attr('disabled', true);
});

$('#feed').on('click', function() {	
	$('#loading').stop().animate({ width: 0 }, 350);
	Pet.Dont();
	Pet.Do("Eat");
	clearInterval(Pet.HungerTimer);
	Pet.HungerTimer = null;
	$('#loading').animate({ width: 294 }, 4000, function() {
		if (Pet.Hunger <= 95) {
			Pet.Hunger += 15;
			Pet.XP += 50;
			Pet.Mood += 5;
			if (Pet.Mood > 100) { Pet.Mood = 100; }
			Pet.HungerTime = 60;
		} else {
			Pet.Alert = "I\'m not hungry!";
			setTimeout(function() {
				Pet.Alert = "";
			}, 1500);
			Pet.UpdateStats();
		}
		Pet.StartHunger();
		Pet.UpdateStats();
		Pet.Dont();
		Pet.Do("Idle");
		$(this).animate({ width: 0 }, 350);
		Pet.Save();
		$('input').attr('disabled', false);
	});
	return false;
});

$('#sleep').on('click', function() {
	$('#loading').stop().animate({ width: 0 }, 350);
	Pet.Dont();
	$('canvas').css('background-image','url(bg2.png)');
	Pet.Do("Sleep");
	clearInterval(Pet.HungerTimer);
	Pet.HungerTimer = null;
	$('#loading').animate({ width: 294 }, 40000, function() {
		if (Pet.Energy < 100) {
			Pet.Energy = 100;
			Pet.XP += 50;
			if (Pet.Mood > 0) {
				Pet.Mood -= 20;
				if (Pet.Mood < -100) { Pet.Mood = -100; }
			} else if (Pet.Mood < 0) {
				Pet.Mood += 20;
				if (Pet.Mood > 100) { Pet.Mood = 100; }
			}
			$('canvas').css('background-image','url(bg.png)');
		} else {
			Pet.Alert = "I\'m not tired!";
			setTimeout(function() {
				Pet.Alert = "";
			}, 1500);
		}
		Pet.StartHunger();
		Pet.UpdateStats();
		Pet.Dont();
		Pet.Do("Idle");
		$(this).animate({ width: 0 }, 350);
		Pet.Save();
		$('input').attr('disabled', false);
	});
	return false;
});

$('#reset').on('click', function() {
	//var sure = confirm("Are you sure you want to reset?");
	//if (sure === true) {
		Pet.Dont();
		Pet.HungerTime = 60;
		window.localStorage.removeItem("PETLogin");
		window.localStorage.removeItem("Egg");
		window.localStorage.removeItem("Hunger");
		window.localStorage.removeItem("Mood");
		window.localStorage.removeItem("Health");
		window.localStorage.removeItem("Energy");
		window.localStorage.removeItem("XP");
		window.localStorage.removeItem("Messy");
		window.localStorage.removeItem("HungerTime");
		window.location.reload();
	//}
});

$('#clean').on('click', function() {
	$('#loading').stop().animate({ width: 0 }, 350);
	if (Pet.Messy > 0) {
		if (Pet.Energy > 25) {
			Pet.Dont();
			Pet.Do("Cleaning");
			var thisMessy = Pet.Messy;
			var cleaning = window.setInterval(function() {
				Pet.Messy--;
				if (Pet.Messy <= 0) {
					Pet.Messy = 0;
					window.clearInterval(cleaning);
					Pet.Energy -= 30;
					Pet.Mood += 20;
					if (Pet.Mood > 100) { Pet.Mood = 100; }
					Pet.XP += 50;
					Pet.Health += 15;
					if (Pet.Energy < 0) { Pet.Energy = 0; }
					Pet.Dont();
					Pet.Alert = "All clean!";
					setTimeout(function() {
						Pet.Alert = "";
					}, 1500);
					Pet.Save();
					$('input').attr('disabled', false);
					Pet.Do("Idle");
				}
			}, 1500);
		} else {
			Pet.Alert = "I\'m too tired!";
			setTimeout(function() {
				Pet.Alert = "";
			}, 1500);
			$('input').attr('disabled', false);
		}
	} else {
		Pet.Alert = "It\'s not messy!";
		setTimeout(function() {
			Pet.Alert = "";
		}, 1500);
		$('input').attr('disabled', false);
	}
	return false;
});

$('#play').on('click', function() {
	$('#loading').stop().animate({ width: 0 }, 350);
	if (Pet.Energy > 25) {
		Pet.Play();
	} else {
		Pet.Alert = "I\'m too tired!";
		setTimeout(function() {
			Pet.Alert = "";
		}, 1500);
		$('input').attr('disabled', false);
	}
	return false;
});
$('#left,#right').on('click', function() {
	$('#loading').stop().animate({ width: 0 }, 350);
	var thisID = $(this).attr('id');
	$('#left,#right').hide();
	if (thisID === "left") {
		if (Pet.DNA[Pet.AnimFrame] === PetAnimations.Waiting[0]) {
			//Pet.Do("Left");
			Pet.Dir(0);
			Pet.Mood += 10;
			Pet.XP += 50;
		} else {
			Pet.Dont();
			Pet.Do("Idle");
			Pet.Mood -= 10;
		}
	} else if (thisID === "right") {
		if (Pet.DNA[Pet.AnimFrame] === PetAnimations.Waiting[1]) {
			//Pet.Do("Right");
			Pet.Dir(1);
			Pet.Mood += 10;
			Pet.XP += 50;
		} else {
			Pet.Dont();
			Pet.Do("Idle");
			Pet.Mood -= 10;
		}
	}
	Pet.Energy -= 20;
	if (Pet.Mood > 100) { Pet.Mood = 100; }
	if (Pet.Mood < -100) { Pet.Mood = -100; }
	if (Pet.Energy < 0) { Pet.Energy = 0; }
	if (Pet.Hunger >= 5) { Pet.Hunger -= 5; } else {
		if (Pet.Health >= 5) { Pet.Health -= 5; }
		Pet.CheckDead();
	}
	Pet.UpdateStats();
	Pet.Save();
	$('input').attr('disabled', false);
	return false;
});