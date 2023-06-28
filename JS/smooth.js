gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

if (ScrollTrigger.isTouch !== 1) {
	ScrollSmoother.create({
		wrapper: ".ScrollSmoother-wrapper",
		content: ".content",
		smooth : true,
		smoothSpeed: 1.5,
		effects: true,
	});
	gsap.fromTo(
		".text",
		{ opacity: 1 },
		{
			opacity: 0,
			scrollTrigger: {
				trigger: ".text",
				start: "center",
				end: "bottom",
				scrub: true,
			},
		}
	);

	let itemsL = gsap.utils.toArray(".gallery__left .gallery__item");
	itemsL.forEach((item) => {
		gsap.fromTo(
			item,
			{ x: -200, opacity: 0 },
			{
				opacity: 1,
				x: 0,
				scrollTrigger: {
					trigger: item,
					start: "-1050",
					end: "-100",
					scrub: true,
				},
			}
		);
	});
	let itemsR = gsap.utils.toArray(".gallery__right .gallery__item");
	itemsR.forEach((item) => {
		gsap.fromTo(
			item,
			{ x: 150, opacity: 0 },
			{
				opacity: 1,
				x: 0,
				scrollTrigger: {
					trigger: item,
					start: "-1050",
					end: "-150",
					scrub: true,
				},
			}
		);
	});

	gsap.fromTo(
		".main-title",
		{ opacity: 1 },
		{
			opacity: 0,
			scrollTrigger: {
				trigger: ".text",
				start: "center",
				end: "bottom",
				scrub: true,
			},
		}
	);
}

	