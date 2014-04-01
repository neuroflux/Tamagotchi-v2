window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
		  window.webkitRequestAnimationFrame || 
		  window.mozRequestAnimationFrame    || 
		  window.oRequestAnimationFrame      || 
		  window.msRequestAnimationFrame     || 
		  function(/* function */ callback, /* DOMElement */ element){
			window.setTimeout(callback, 1000 / 60);
		  };
})();
  
var canvas, ctx, toggle;
var Pet = {
	/** VARIABLES **/
	DNA: PetAnimations.Idle,
	DisplaySize: 272,
	CellSize: 16,
	
	Animating: null,
	AnimFrame: 0,
	AnimSwitch: 0,
	RunAnim: "",
	HungerTime: 60,
	Alert: "",
	Messy: -1,
	Egg: 1,
	Blink: 1,
	
	/** STATS **/
	Hunger: 30,
	Mood: 0,
	Health: 10,
	Energy: 100,
	XP: 0,
	
	/** FUNCTIONS **/
	Dont: function() {
		clearTimeout(Pet.Animating);
		Pet.Animating = null;
		Pet.AnimFrame = 0;
	},
	Do: function(typ) {
		Pet.DNA = eval("PetAnimations." + typ);
		Pet.RunAnim = "PetAnimations."+typ+".length - 1";
		Pet.Animating = setTimeout(function() {
			if (Pet.AnimSwitch === 0) {
				if (Pet.AnimFrame === (eval(Pet.RunAnim))) {
					Pet.AnimFrame--;
					Pet.AnimSwitch = 1;
				} else {
					Pet.AnimFrame++;
				}
			} else {
				if (Pet.AnimFrame === 0) {
					Pet.AnimFrame++;
					Pet.AnimSwitch = 0;
				} else {
					Pet.AnimFrame--;
				}
			}
			Pet.Do(typ);
		}, 500);
	},
	Play: function() {
		if (Pet.Energy > 25) {
			Pet.Dont();
			Pet.Do("Waiting");
			$('#left,#right').show();
			$('#left,#right').attr('disabled', false);
		} else {
			Pet.Alert = "I\'m too tired!";
			setTimeout(function() {
				Pet.Alert = "";
			}, 1500);
		}
	},
	Dir: function(dir) {
		Pet.Dont();	
		if (dir === 0) {
			Pet.Do("Left");
			Pet.Alert = "Yay!";
			setTimeout(function() {
				Pet.Alert = "";
			}, 1500);
		} else {
			Pet.Do("Right");
			Pet.Alert = "Yay!";
			setTimeout(function() {
				Pet.Alert = "";
			}, 1500);
		}
		setTimeout(function() {
			Pet.Mood += 20;
			if (Pet.Mood > 100) { Pet.Mood = 100; }
			Pet.UpdateStats();
			Pet.Dont();
			Pet.Do("Idle");
			Pet.AnimFrame = 4;
			$('input').attr('disabled', false);
		}, 4000);
	},
	CheckDead: function() {
		if (Pet.Health < 1) {
			$('input').attr('disabled', true);
			$('#reset').attr('disabled', false);
			Pet.Dont();
			clearInterval(Pet.HungerTimer);
			Pet.HungerTimer = null;
			Pet.Do("Dead");
			//$('#reset').click();
		}
	},
	HungerTimer: null,
	StartHunger: function() {
		Pet.HungerTimer = setInterval(function() {
			Pet.Save();
			if (Pet.HungerTime < 1) {
				if (Pet.Egg === 1) {
					Pet.Dont();
					Pet.Egg = 0;
					window.localStorage.setItem("Egg",Pet.Egg);
					Pet.Do("Idle");
					$('input').attr('disabled', false);
				}
				/** HUNGER CHECK **/
				if (Pet.Hunger > 0) {
					Pet.Hunger -= 5;
					Pet.Mood -= (2 * Pet.Messy);
					if (Pet.Mood < -100) { Pet.Mood = -100; }
					if (Pet.Hunger < 0) { Pet.Hunger = 0; }
				} else {
					Pet.Health -= 5;
					Pet.Mood -= (2 * Pet.Messy);
					if (Pet.Mood < -100) { Pet.Mood = -100; }
					Pet.CheckDead();
				}
				Pet.HungerTime = 60;
				/** ENERGY CHECK **/
				if (Pet.Energy >= 10) {
					Pet.Energy -= 10;
					Pet.Mood -= (2 * Pet.Messy);
					if (Pet.Mood < -100) { Pet.Mood = -100; }
					if (Pet.Energy < 0) { Pet.Energy = 0; }
				} else {
					Pet.Health -= 5;
					Pet.Mood -= (2 * Pet.Messy);
					if (Pet.Mood < -100) { Pet.Mood = -100; }
					Pet.CheckDead();
				}
				/** MESS! **/
				Pet.Messy++;
				if (Pet.Messy > 5) { Pet.Messy = 5; }
			} else {
				Pet.HungerTime--;
			}
			Pet.UpdateStats();
		}, 1000);
	},
	
	/** RENDERING ROUTINES **/
	Init: function(col) {
		canvas = document.getElementById('pet');
		canvas.width = Pet.DisplaySize;
		canvas.height = Pet.DisplaySize;
		ctx = canvas.getContext('2d');
		
		$('#start').on('click', function() {
			$(this).animate({
				opacity: 0.0
			}, 350, function() {
				$(this).remove();
			});
			Pet.UpdateStats();
			ctx.fillStyle = '#999';
			
			if (window.localStorage.getItem("PETLogin") === "1") {
				Pet.Egg = eval(window.localStorage.getItem("Egg"));
				Pet.Hunger = eval(window.localStorage.getItem("Hunger"));
				Pet.Mood = eval(window.localStorage.getItem("Mood"));
				Pet.Health = eval(window.localStorage.getItem("Health"));
				Pet.Energy = eval(window.localStorage.getItem("Energy"));
				Pet.XP = eval(window.localStorage.getItem("XP"));
				Pet.Messy = eval(window.localStorage.getItem("Messy"));
				Pet.HungerTime = eval(window.localStorage.getItem("HungerTime"));
			}
						
			setInterval(function() {
				Pet.Blink = 0;
				setTimeout(function() {
					Pet.Blink = 1;
				}, 150);
			}, 3500);
				
			if (Pet.Egg === 1) {
				$('input').attr('disabled', true);
				Pet.Dont();
				Pet.Do('Egg');
				setTimeout(function() {
					Pet.Dont();
					Pet.Do("EggTwo");
				}, 30000);
				setTimeout(function() {
					Pet.Dont();
					Pet.Do("EggThree");
				}, 45000);
				setTimeout(function() {
					Pet.Dont();
					Pet.Do("EggHatch");
				}, 59500);
				Pet.StartHunger();
			} else {
				Pet.Do('Idle');
				Pet.StartHunger();
			}
		});
	},
	Save: function() {
		window.localStorage.setItem("PETLogin","1");
		window.localStorage.setItem("Egg",Pet.Egg);
		window.localStorage.setItem("Hunger",Pet.Hunger);
		window.localStorage.setItem("Mood",Pet.Mood);
		window.localStorage.setItem("Health",Pet.Health);
		window.localStorage.setItem("Energy",Pet.Energy);
		window.localStorage.setItem("XP",Pet.XP);
		window.localStorage.setItem("Messy",Pet.Messy);
		window.localStorage.setItem("HungerTime",Pet.HungerTime);
	},
	UpdateStats: function() {
		$('#health').html(Pet.Health);
		$('#hunger').html(Pet.Hunger);
		$('#mood').html(Pet.Mood);
		$('#energy').html(Pet.Energy);
		$('#xp').html(Pet.XP);
	},
	Update: function() {
		Pet.CheckMood();
	},
	MoodColor: "rgba(25,25,25,1.0)",
	CheckMood: function() {
		if (Pet.Mood > 0) {
			Pet.MoodColor = "rgba(90,"+(120 + Pet.Mood)+",90,1.0)";
		} else if (Pet.Mood < 0) {
			var remMinus = Pet.Mood+"";
			remMinus = eval(remMinus.replace("-",""));
			Pet.MoodColor = "rgba("+(120 - Pet.Mood)+",90,90,1.0)";
		} else {
			Pet.MoodColor = "rgba(135,135,135,1.0)";
		}
	},
	Draw: function() {
		ctx.clearRect(0,0,canvas.width,canvas.height);
		
		if (Pet.Health > -1) {
			ctx.fillStyle = "#fff";
			ctx.fillText("I will be hungry in " + Pet.HungerTime + " seconds!", 65, 15);
			ctx.fillStyle = "rgba(135,135,135,1.0)";
		} else {
			ctx.fillText("You killed your pet! Bad form!", 65, 15);
		}
		if (Pet.Alert.length > 0) {
			ctx.fillStyle = "orange";
			ctx.fillText(Pet.Alert, 0, 30);
			ctx.fillStyle = Pet.MoodColor;
		}
		ctx.fillStyle = "#111";
		/** THE PET **/
		for (var x = 0; x < Pet.DNA[Pet.AnimFrame].length; x++) {
			for (var y = 0; y < Pet.DNA[Pet.AnimFrame][x].length; y++) {
				ctx.shadowOffsetX = 2;
				ctx.shadowOffsetY = 2;
				ctx.shadowBlur = 4;
				ctx.shadowColor = "rgba(0,0,0,0.45)";
				if (Pet.DNA[Pet.AnimFrame][x][y] === 0) { //nothingish
					ctx.fillStyle = "rgba(255,255,255,0.25)";
					ctx.fillRect((Pet.CellSize+1)*y, (Pet.CellSize+1)*x, Pet.CellSize, Pet.CellSize);
				} else if (Pet.DNA[Pet.AnimFrame][x][y] === 1) { //black
					ctx.fillStyle = "rgba(25,25,25,1.0)";
					ctx.fillRect((Pet.CellSize+1)*y, (Pet.CellSize+1)*x, Pet.CellSize, Pet.CellSize);
				} else if (Pet.DNA[Pet.AnimFrame][x][y] === 2) { //eyes (mood)
					if (Pet.Blink > 0) {
						ctx.fillStyle = 'rgba(255,255,255,1.0)';
						ctx.fillRect((Pet.CellSize+1)*y, (Pet.CellSize+1)*x, Pet.CellSize, Pet.CellSize);
						ctx.shadowOffsetX = 0;
						ctx.shadowOffsetY = 0;
						ctx.shadowBlur = 0;
						ctx.shadowColor = "rgba(0,0,0,0.45)";
						ctx.fillStyle = Pet.MoodColor;
						ctx.fillRect((Pet.CellSize+1)*y+1, (Pet.CellSize+1)*x+1, Pet.CellSize-2, Pet.CellSize-2);
						ctx.fillStyle = "rgba(25,25,25,1.0)";
						ctx.fillRect((Pet.CellSize+1)*y+6, (Pet.CellSize+1)*x+6, Pet.CellSize-12, Pet.CellSize-12);
					} else {
						ctx.fillStyle = "rgba(25,25,25,1.0)";
						ctx.fillRect((Pet.CellSize+1)*y, (Pet.CellSize+1)*x, Pet.CellSize, Pet.CellSize);
					}
				} else if (Pet.DNA[Pet.AnimFrame][x][y] === 3) { //brown
					ctx.fillStyle = "rgba(110,65,15,1.0)";
					ctx.fillRect((Pet.CellSize+1)*y, (Pet.CellSize+1)*x, Pet.CellSize, Pet.CellSize);
				} else if (Pet.DNA[Pet.AnimFrame][x][y] === 4) { //red
					ctx.fillStyle = "rgba(235,55,55,1.0)";
					ctx.fillRect((Pet.CellSize+1)*y, (Pet.CellSize+1)*x, Pet.CellSize, Pet.CellSize);
				} else if (Pet.DNA[Pet.AnimFrame][x][y] === 5) { //blue
					ctx.fillStyle = "rgba(60,60,255,1.0)";
					ctx.fillRect((Pet.CellSize+1)*y, (Pet.CellSize+1)*x, Pet.CellSize, Pet.CellSize);
				}
			}
		}
		/** ITEMS **/
		if (Pet.Messy > 0) {
			for (var m = 0; m < Pet.Messy; m++) {
				for (var x = 0; x < PetItems.Mess[Pet.Messy].length; x++) {
					for (var y = 0; y < PetItems.Mess[Pet.Messy][x].length; y++) {
						if (PetItems.Mess[Pet.Messy][x][y] > 0) {
							ctx.fillStyle = "#644621";
							ctx.fillRect((Pet.CellSize+1)*y, (Pet.CellSize+1)*x, Pet.CellSize, Pet.CellSize);
							ctx.FillStyle = Pet.MoodColor;
						}
					}
				}
			}
		}
	},
	Animate: function() {
		Pet.Update();
		requestAnimFrame(Pet.Animate);
		Pet.Draw();		
	}
}

window.onload = function() {
	Pet.Init();	
	Pet.Animate();
}