(function () {
	'use strict';

	function selectTab(controls, panels, selectedIndex) {
		controls.forEach(function (control, index) {
			const selected = index === selectedIndex;
			control.setAttribute('role', 'tab');
			control.setAttribute('aria-selected', selected ? 'true' : 'false');
			control.setAttribute('tabindex', selected ? '0' : '-1');
			control.classList.toggle('is-active', selected);
		});
		panels.forEach(function (panel, index) {
			const selected = index === selectedIndex;
			panel.setAttribute('role', 'tabpanel');
			panel.tabIndex = 0;
			panel.hidden = !selected;
			panel.classList.toggle('is-active', selected);
		});
	}

	document
		.querySelectorAll('[data-coastalos-block="outcomes"]')
		.forEach(function (root) {
			let controls = Array.from(
				root.querySelectorAll('.coastalos-outcome-tab'),
			);
			let panels = Array.from(
				root.querySelectorAll('.coastalos-outcome-panel'),
			);
			const prototype = root.querySelector('.out-tabs');
			if (!controls.length && prototype) {
				controls = Array.from(prototype.querySelectorAll('.out-list button'));
				panels = Array.from(prototype.querySelectorAll('.viz > div'));
			}
			if (!controls.length || !panels.length) {
				return;
			}

			const tabList = controls[0].closest('.coastalos-outcome-tabs, .out-list');
			if (tabList) {
				tabList.setAttribute('role', 'tablist');
				tabList.setAttribute('aria-label', 'Outcomes');
			}

			controls.forEach(function (control, index) {
				control.addEventListener('click', function (event) {
					event.preventDefault();
					selectTab(controls, panels, index);
				});
				control.addEventListener('keydown', function (event) {
					if (
						!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(
							event.key,
						)
					) {
						return;
					}
					event.preventDefault();
					const nextIndex =
						event.key === 'Home'
							? 0
							: event.key === 'End'
								? controls.length - 1
								: (index +
										(event.key === 'ArrowRight'
											? 1
											: controls.length - 1)) %
									controls.length;
					selectTab(controls, panels, nextIndex);
					controls[nextIndex].focus();
				});
			});
			selectTab(controls, panels, 0);
			if (prototype) {
				const titles = [
					'Direct versus third-party bookings',
					'Cost by function, before and after',
					'A guest conversation, handled centrally',
					'An owner’s reporting view',
				];
				const legends = [
					'<span><i style="background:#6FD0CC"></i>Direct bookings</span><span><i style="background:#C9932F"></i>Third-party channels</span>',
					'<span><i style="background:rgba(255,255,255,.3)"></i>Managed separately</span><span><i style="background:#6FD0CC"></i>Centralized</span>',
					'<span>Sample conversation</span>',
					'<span>Sample layout, no data shown</span>',
				];
				const title = prototype.querySelector('#ptitle');
				const legend = prototype.querySelector('#legend');
				controls.forEach(function (control, index) {
					control.addEventListener('click', function () {
						if (title) title.textContent = titles[index];
						if (legend) legend.innerHTML = legends[index];
					});
				});
			}
		});
})();
