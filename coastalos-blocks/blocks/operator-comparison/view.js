(function () {
	'use strict';

	document
		.querySelectorAll('[data-coastalos-block="operator-comparison"]')
		.forEach(function (root) {
			const controls = Array.from(
				root.querySelectorAll('.coastalos-comparison-control'),
			);
			const panels = Array.from(
				root.querySelectorAll('.coastalos-comparison-panel'),
			);
			if (!controls.length || !panels.length) {
				return;
			}

			function select(selectedIndex) {
				controls.forEach(function (control, index) {
					const selected = index === selectedIndex;
					control.setAttribute(
						'aria-pressed',
						selected ? 'true' : 'false',
					);
					control.classList.toggle('is-active', selected);
				});
				panels.forEach(function (panel, index) {
					panel.hidden = index !== selectedIndex;
					panel.classList.toggle(
						'is-active',
						index === selectedIndex,
					);
				});
			}

			controls.forEach(function (control, index) {
				control.addEventListener('click', function (event) {
					event.preventDefault();
					select(index);
				});
			});
			select(0);
		});
})();
