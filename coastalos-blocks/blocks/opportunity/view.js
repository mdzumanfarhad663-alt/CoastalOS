(function () {
	'use strict';

	function activate(root, selectedIndex, controls, panels) {
		controls.forEach(function (control, index) {
			const selected = index === selectedIndex;
			control.setAttribute('aria-pressed', selected ? 'true' : 'false');
			control.classList.toggle('is-active', selected);
		});
		panels.forEach(function (panel, index) {
			const selected = index === selectedIndex;
			panel.hidden = !selected;
			panel.classList.toggle('is-active', selected);
		});
		root.dataset.activeChoice = String(selectedIndex);
	}

	document
		.querySelectorAll('[data-coastalos-block="opportunity"]')
		.forEach(function (root) {
			let controls = Array.from(
				root.querySelectorAll('.coastalos-opportunity-control'),
			);
			let panels = Array.from(
				root.querySelectorAll('.coastalos-opportunity-panel'),
			);
			const prototype = root.querySelector('.seg');
			if (!controls.length && prototype) {
				controls = Array.from(prototype.querySelectorAll('button'));
				panels = [];
			}
			if (!controls.length || !panels.length) {
				if (!controls.length || !prototype) return;
				const caption = root.querySelector('.cmp-cap');
				const captions = [
					'Each function runs on its own tools and people, and the owner is left connecting the pieces.',
					'One platform coordinates every function, and the owner gets one clear view of the property.',
				];
				const thumb = prototype.querySelector('.thumb');
				const select = function (index) {
					controls.forEach(function (control, i) {
						control.setAttribute('aria-pressed', i === index ? 'true' : 'false');
						control.classList.toggle('is-active', i === index);
					});
					root.classList.toggle('centralized', index === 1);
					if (caption) caption.textContent = captions[index];
					if (thumb) {
						thumb.style.width = controls[index].offsetWidth + 'px';
						thumb.style.transform = 'translateX(' + (controls[index].offsetLeft - 4) + 'px)';
					}
				};
				controls.forEach(function (control, index) {
					control.addEventListener('click', function () { select(index); });
				});
				select(0);
				window.addEventListener('resize', function () {
					select(controls[1].getAttribute('aria-pressed') === 'true' ? 1 : 0);
				});
				return;
			}

			controls.forEach(function (control, index) {
				control.addEventListener('click', function (event) {
					event.preventDefault();
					activate(root, index, controls, panels);
				});
			});
			activate(
				root,
				Math.min(
					Number(root.dataset.activeChoice || 0),
					controls.length - 1,
				),
				controls,
				panels,
			);
		});
})();
