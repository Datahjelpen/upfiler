(function() {
	var filesAddedBefore = false;

	var form      = document.getElementById('dh-uploader-form');
		list      = document.getElementById('dh-uploader-filelist'),
		uploadBtn = document.getElementById('dh-uploader-btn'),
		input     = document.getElementById('dh-uploader-input'),
		submitBtn = document.getElementById('dh-uploader-submit'),
		dhTarget  = document.querySelector('.dh-uploader-target');

	uploadBtn.addEventListener('click', function() { input.click() });
	input.addEventListener('change', function() { submitBtn.click() });

	form.addEventListener('submit', function(e) {
		stopDefaultEvent(e);

		var formData = new FormData(form);
		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function() {
			var data = xhr.responseText;

			if (xhr.readyState === XMLHttpRequest.DONE && xhr.status == 200) {

				try {
					data = JSON.parse(data);
					if (data.success) {
						showPreview(data);
						insertData(data, false);
					} else {
						console.log('Error, couldn\'t parse data as JSON.');
						showError(data);
					}
				} catch (e) {
					console.log('Error, something went wrong while parsing data as JSON.', e);
					showError(data);
				}

			} else if (xhr.status == 404 || xhr.status == 500) {
				console.log('Error, status code', xhr.status);
				showError(data);
			}
		}

		xhr.open(form.method, form.action);
		xhr.setRequestHeader('X-API-KEY', 'fck5rfsZKfpdRbG4npSVz3Qz');
		xhr.send(formData)
	});

	function showPreview(data) {
		for (var i = data.files.length - 1; i >= 0; i--) {
			var hash = data.files[i].hash;
			var li = document.createElement('li');
			
			var a = document.createElement('a');
			a.setAttribute('id', hash + '-link');
			a.setAttribute('href', data.files[i].url);
			a.setAttribute('data-name', data.files[i].name);
			a.setAttribute('target', '_blank');
			
			var p = document.createElement('p');
			p.setAttribute('id', hash + '-name');
			
			var img = document.createElement('img');
			img.setAttribute('src', data.files[i].url);

			var del = document.createElement('button');
			del.innerHTML = 'X';
			del.setAttribute('data-target', hash);
			del.addEventListener('click', function(e) {
				e.preventDefault();
				var el = document.getElementById(this.getAttribute('data-target'));
				el.outerHTML = '';

				var data = {
					success: false,
					files: []
				};

				var listItems = list.querySelectorAll('li');

				for (var i = 0; i < listItems.length; i++) {
					var item = {};
					var hash = listItems[i].getAttribute('id');

					item.hash = hash;
					item.name = document.getElementById(hash + '-name').innerHTML;
					item.url = document.getElementById(hash + '-link').getAttribute('href');
					
					data.files.push(item);
				}

				insertData(data, true);
			});
			
			a.appendChild(img);
			p.appendChild(document.createTextNode(data.files[i].name));
			a.appendChild(p);
			li.appendChild(a);
			li.appendChild(del);
			li.setAttribute('id', hash);
			list.appendChild(li);
		}
	}

	function insertData(data, overwrite) {
		var output = '\n\n';

		for (var i = data.files.length - 1; i >= 0; i--) {
			output += data.files[i].name + ':\n' + data.files[i].url + '\n\n';
		}

		if (!filesAddedBefore) output = '-------- VEDLAGTE FILER --------\n' + output;

		if (overwrite) {
			dhTarget.value = '-------- VEDLAGTE FILER --------\n' + output;
		} else {
			dhTarget.value = dhTarget.value + output;
		}

		filesAddedBefore = true;
	}

	function showError(data) {
		console.log('error', data);
	}

	function stopDefaultEvent(e) {
		e.stopPropagation();
		e.preventDefault();
	}
})();
