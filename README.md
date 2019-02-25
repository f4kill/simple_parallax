# Simple Multi-Layer Parallax
Light weight library for creating multi layer parallax on scroll.
Pull requests are welcome.

## Usage
html: 
```html
<div id="parallax-container">
	<img class="parallax-layer" src="first-layer.jpg">
	<img class="parallax-layer" src="second-layer.png">
	<img class="parallax-layer" src="third-layer.svg">
	<img class="parallax-layer" src="fourth-layer.gif">
</div>
```
js:
```javascript
let smlp = new Smlp('parallax-container', 'parallax-layer', [{
	start: 0.1,
	height: 0.8,
	offset: -.2,
	slowdown: .5
}]);

smlp.init();
```
css: 
```css
.parallax-layer {
	position: fixed;
}
```

## Parameters
First parameter is the parent container's ID
Second parameter is the layer class
Third is an array of objects that defines the following settings :
`screen` optionnal, the maximum screen width for which the current object applies.
`start` defines at which scroll position the animation begins.
`height` defines for how long of a scroll should the layers be animated.
`offset` is how much the layers move when animating.
`slowdown` optionnal, slows down the scrolling when the parallax is animating (this helps greatly to perceive the animantion and depth).

## Helpers
While setting up your parallax you can enable a visual helper by doing `smlp.showStates = true` which will change the documents background color according to the state of the parallax.
**Blue** will be applied when the parallax scroll position has not been reached yet, **Red** when the parallax is animating and **Green** when the scroll is beyond the parallax.