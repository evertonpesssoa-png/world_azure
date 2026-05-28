// =========================
// ASURAS
// =========================

const items =
	document.querySelectorAll(".item");

const slider =
	document.querySelector(".slider");

// =========================
// CORES DINÂMICAS
// =========================

items.forEach(item => {

	const color =
		item.dataset.color;

	item.style.setProperty(
		"--glow-color",
		color
	);
});

// =========================
// SOM HOVER
// =========================

const hoverSound =
	document.getElementById(
		"hoverSound"
	);

items.forEach(item => {

	item.addEventListener(
		"mouseenter",
		() => {

			if(!hoverSound) return;

			hoverSound.volume = 0.12;

			hoverSound.currentTime = 0;

			hoverSound
				.play()
				.catch(() => {});
		}
	);
});

// =========================
// PARTICLES
// =========================

const canvas =
	document.getElementById(
		"particles"
	);

const ctx =
	canvas.getContext("2d");

// =========================
// SIZE
// =========================

function resizeCanvas(){

	canvas.width =
		window.innerWidth;

	canvas.height =
		window.innerHeight;
}

resizeCanvas();

// =========================
// PARTICLES ARRAY
// =========================

const particles = [];

const particleCount = 120;

// =========================
// CREATE PARTICLES
// =========================

for(let i = 0; i < particleCount; i++){

	particles.push({

		x:
			Math.random() * canvas.width,

		y:
			Math.random() * canvas.height,

		size:
			Math.random() * 2 + 1,

		speedX:
			(Math.random() - 0.5) * 0.3,

		speedY:
			(Math.random() - 0.5) * 0.3,

		opacity:
			Math.random() * 0.5
	});
}

// =========================
// DRAW PARTICLES
// =========================

function drawParticles(){

	ctx.clearRect(
		0,
		0,
		canvas.width,
		canvas.height
	);

	particles.forEach(particle => {

		ctx.beginPath();

		ctx.arc(
			particle.x,
			particle.y,
			particle.size,
			0,
			Math.PI * 2
		);

		ctx.fillStyle =
			`rgba(255,255,255,${particle.opacity})`;

		ctx.fill();

		particle.x += particle.speedX;
		particle.y += particle.speedY;

		if(
			particle.x < 0 ||
			particle.x > canvas.width
		){
			particle.speedX *= -1;
		}

		if(
			particle.y < 0 ||
			particle.y > canvas.height
		){
			particle.speedY *= -1;
		}
	});

	requestAnimationFrame(drawParticles);
}

drawParticles();

// =========================
// RESIZE
// =========================

window.addEventListener(
	"resize",
	() => {
		resizeCanvas();
	}
);

// =========================
// AMBIENT MUSIC
// =========================

const bgMusic =
	document.getElementById(
		"bgMusic"
	);

if(bgMusic){

	bgMusic.volume = 0;

	bgMusic
		.play()
		.then(() => {

			setTimeout(() => {

				bgMusic.volume = 0.12;

			}, 800);

		})
		.catch(() => {

			window.addEventListener(
				"click",
				handleFirstInteraction,
				{ once: true }
			);

			window.addEventListener(
				"touchstart",
				handleFirstInteraction,
				{ once: true }
			);
		});
}

function handleFirstInteraction(){

	if(!bgMusic) return;

	bgMusic.volume = 0.12;

	bgMusic
		.play()
		.catch(() => {});
}

// =========================
// CURSOR BASE
// =========================

document.body.style.cursor =
	"default";

// =========================
// PORTAL TRANSITION
// =========================

const portalTransition =
	document.getElementById(
		"portalTransition"
	);

// =========================
// CONTROLE
// =========================

let transitioning = false;

// =========================
// CLICK ASURA
// =========================

items.forEach(item => {

	item.addEventListener(
		"click",
		() => {

			if(transitioning) return;

			transitioning = true;

			const asura =
				item.dataset.asura;

			startAsuraTransition(
				item,
				asura
			);
		}
	);
});

// =========================
// START TRANSITION
// =========================

function startAsuraTransition(
	selectedItem,
	asura
){

	slider.style.animationPlayState =
		"paused";

	if(hoverSound){

		hoverSound.volume = 0.2;
		hoverSound.currentTime = 0;
		hoverSound.play().catch(() => {});
	}

	// fade audio
	if(bgMusic){

		const fadeAudio =
			setInterval(() => {

				if(bgMusic.volume > 0.02){
					bgMusic.volume -= 0.01;
				}else{
					bgMusic.volume = 0;
					clearInterval(fadeAudio);
				}

			}, 40);
	}

	slider.classList.add("fade-all");
	selectedItem.classList.add("active");

	document.body.style.transition =
		"transform 1.6s ease";

	document.body.style.transform =
		"scale(1.03)";

	if(portalTransition){
		portalTransition.classList.add("active");
	}

	createPortalFlash(selectedItem.dataset.color);

	console.log("Entrando no mundo:", asura);

	// =========================
	// REDIRECIONAMENTO REAL
	// =========================

	setTimeout(() => {

		window.location.href =
			`worlds/${asura}.html`;

	}, 2200);
}

// =========================
// FLASH PORTAL
// =========================

function createPortalFlash(color){

	const flash =
		document.createElement("div");

	flash.className = "portal-flash";

	flash.style.setProperty(
		"--flash-color",
		color
	);

	document.body.appendChild(flash);

	requestAnimationFrame(() => {
		flash.classList.add("show");
	});

	setTimeout(() => {

		flash.classList.remove("show");

		setTimeout(() => {
			flash.remove();
		}, 1000);

	}, 900);
}