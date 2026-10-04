(function () {
	'use strict';

	document
		.querySelectorAll('[data-coastalos-demo-form]')
		.forEach(function (form) {
			const params = new URLSearchParams(window.location.search);
			if (params.get('request') === 'call') {
				const callOption = form.querySelector(
					'input[type="radio"][value="call"]',
				);
				if (callOption) {
					callOption.checked = true;
				}
			}
			const submitButton = form.querySelector('button[type="submit"]');
			const requestOptions = form.querySelectorAll(
				'input[type="radio"][value="review"], input[type="radio"][value="call"]',
			);
			const updateSubmitLabel = function () {
				const isCall = form.querySelector(
					'input[type="radio"][value="call"]:checked',
				);
				if (submitButton) {
					submitButton.textContent = isCall
						? 'Request a Call'
						: 'Request a Property Review';
				}
			};
			requestOptions.forEach(function (option) {
				option.addEventListener('change', updateSubmitLabel);
			});
			updateSubmitLabel();

			form.addEventListener('input', function (event) {
				const field = event.target;
				const error =
					field.parentElement &&
					field.parentElement.querySelector('.err');
				if (error) {
					error.textContent = '';
					field.removeAttribute('aria-invalid');
				}
			});

			form.addEventListener('submit', function (event) {
				event.preventDefault();
				let firstInvalid = null;
				let isValid = true;

				form.querySelectorAll('input[required]').forEach(
					function (field) {
						const error = field.parentElement.querySelector('.err');
						let message = '';
						const label = form.querySelector(
							'label[for="' + CSS.escape(field.id) + '"]',
						);
						const fieldName = label
							? label.textContent.toLowerCase().trim()
							: 'field';

						if (!field.value.trim()) {
							message = 'Enter your ' + fieldName + '.';
						} else if (
							field.type === 'email' &&
							!/^\S+@\S+\.\S+$/.test(field.value)
						) {
							message = 'Enter a valid email address.';
						}

						if (error) {
							error.textContent = message;
						}
						field.setAttribute(
							'aria-invalid',
							message ? 'true' : 'false',
						);
						if (message) {
							isValid = false;
							firstInvalid = firstInvalid || field;
						}
					},
				);

				if (!isValid) {
					firstInvalid.focus();
					return;
				}

				const success = form.querySelector('.coastalos-form-success');
				if (success) {
					success.hidden = false;
				}
				const submit = form.querySelector('button[type="submit"]');
				if (submit) {
					submit.disabled = true;
				}
			});
		});
})();
