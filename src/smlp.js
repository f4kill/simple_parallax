/** Class for handling parallax animations */
class Smlp {
	/**
	 * Get dom elements to be animated and animation settings
	 * @param  {string}		containerId					- Id of the parent dom element
	 * @param  {string}		childTagName				- Class of the parallax layers
	 * @param  {object[]}	parallaxSettings			- Animation settings
	 * @param  {number}		parallaxSettings.[screen]	- Maximum screen width for which these settings. If ommited the entry will be considered as default.
	 * @param  {number}		parallaxSettings.start 		- Scroll position at which the animation starts. In fraction of the longest layers' height.
	 * @param  {number}		parallaxSettings.height		- The scrolling length during which the animation is performed. In fraction of the longest layers' height.
	 * @param  {number}		parallaxSettings.offset		- Maximum offset between layers. In fraction of the longest layers' height.
	 * @param  {number}		parallaxSettings.[slowdown]	- Factor by which the scroll is slowed, for 0 the images scroll as usual, for 1 they stay in the view while animating.
	 */
	constructor(containerId, childTagName, parallaxSettings) {
		this.parent = document.getElementById(containerId);
		this.children = this.parent.getElementsByClassName(childTagName);

		this.parallaxSettings = parallaxSettings;

		this.showStates = false;

		this.resizeThrottleDelay = 50;
		this.resizeCallDate = 0;
		this.resizeTimeoutDone = true;

		window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
									 window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	}

	/** Update layers' longest height */
	update() {
		let clientRects = Array.from(this.children).map(x => x.getBoundingClientRect());
		this.parallaxContentHeight = Math.max.apply(null, clientRects.map(x => x.height));
		this.parallaxContentPosY = Math.min.apply(null, clientRects.map(x => x.top));
	}

	/** Attach animation and responsiveness event listeners */
	init() {
		this.update();

		window.addEventListener('resize', () => {

			// throttle updates for perfs
			let now = Date.now();
			if(this.resizeCallDate + this.resizeThrottleDelay < now ) {
				this.resizeCallDate = now;
				this.update();
			} else {
				this.resizeCallDate = now
				if(this.resizeTimeoutDone) {
					this.resizeTimeoutDone = false;
					window.setTimeout(() => {
						this.update();
						this.resizeTimeoutDone = true;
					}, this.resizeThrottleDelay);
				}
			}
			
		});

		window.addEventListener('scroll', this.animate.bind(this), false);
	}

	/** Get settings for current window size */
	currentSettings() {
		let screenWidth = window.innerWidth;
		let settings = {
			slowdown: 0
		};
		for (let set of this.parallaxSettings) {
			if(set.screen < screenWidth || typeof set.screen === 'undefined') {
				for (let prop in set) {
					settings[prop] = set[prop];
				}
			}
		}

		return settings;
	}

	/** Recalculate Y translate of each layers for current scroll position */
	animate() {

		let settings = this.currentSettings();

		let parallaxStart = settings.start * this.parallaxContentHeight;
		let parallaxScrollHeight = settings.height * this.parallaxContentHeight;
		let parallaxOffset = settings.offset * this.parallaxContentHeight;

		let scrollProgress = (window.pageYOffset - parallaxStart + this.parallaxContentPosY + window.innerHeight / 2) / parallaxScrollHeight;

		if(this.showStates) document.body.style.backgroundColor = "blue";

		if(scrollProgress < 0) {
			if(this.showStates) document.body.style.backgroundColor = "red";
			scrollProgress = 0;
		}
		if(scrollProgress > 1) {
			if(this.showStates) document.body.style.backgroundColor = "green";
			scrollProgress = 1;
		}

		let scrollSlowDown = parallaxScrollHeight * settings.slowdown * scrollProgress;
		let parallaxStep = parallaxOffset / this.children.length;

		window.requestAnimationFrame(() => {
			for(let i = 0; i < this.children.length; i++) {
				this.children[i].style.transform = 'translateY(' + ((scrollProgress * parallaxStep * i) + scrollSlowDown - window.pageYOffset) + 'px)';
			}
		});
	} 
}