$(document).ready(function(){
	
	$('[list="lecturerList"]').on('focusin', function(){
	  var query = "SELECT ?name ?email WHERE { ?person  a <https://bmake.th-brandenburg.de/vidp%23Lecturer>; <https://schema.org/name>  ?name; <https://schema.org/email> ?email. };";
	  
	  $.ajax({
		  type: "POST",
		  url: 'http://fbwsvcdev.fh-brandenburg.de/OntoWiki/sparql?query=' + query,
		  cache: false,
		  dataType: 'json', 
		  success: function(successData) {
			var lecturerList = $('#lecturerList');
			lecturerList.empty();

			$.each(successData.results.bindings, function( index, value) {
				var optionForm = document.createElement('option');
				optionForm.value = value.name.value;
				optionForm.dataset.email = value.email.value;
				lecturerList.append(optionForm);
			});

		  },
		  error: function(errorText) {
			 console.log( errorText ); 
		  }
	  });
	});
	
	$('[list="lecturerList"]').on('focusout', function(){
		var email = $('option[value="'+this.value+'"]').attr('data-email');
		var input = $('[data-insert="email"]');
		input.trigger('focusin');
		input.val(email);
	});


	$('form').on('input', function(){
		var formData = $('#dataform').serializeArray();
		
		var formDataToObjekt = $('#dataform').serializeObject();
		var serialisedDataObjekt = JSON.stringify(formDataToObjekt, undefined, 4);

		forCopy = serialisedDataObjekt;
		var forAppend = syntaxHighlight(serialisedDataObjekt);
		
		var pre = document.createElement('pre');
		pre.innerHTML = forAppend;
		
		var jsonDataContainer = $("#jsondata");
		
		if(jsonDataContainer.length) {
			jsonDataContainer.empty();
			jsonDataContainer.append(pre);
		}else{
			jsonDataContainer.append(pre);
		}
	});
	var chapter = 0;
	$('.add-button').on('click', function(){
		++chapter;
		var divForm = document.createElement('div');
		var inputForm = document.createElement('input');
		var labelForm =  document.createElement('label');
		
		var divFormUrlTeacher = document.createElement('div');
		var inputFormUrlTeacher = document.createElement('input');
		var labelFormUrlTeacher =  document.createElement('label');
		
		var divFormUrlPresentation = document.createElement('div');
		var inputFormUrlPresentation = document.createElement('input');
		var labelFormUrlPresentation =  document.createElement('label');
		
		var inputIdNumber = parseInt($('#json [id^=formGroupExampleInput]').last().attr('id').replace(/[^0-9]/g,''));		
		
		divForm.classList.add('md-form');
		inputForm.classList.add('form-control');
		inputForm.setAttribute('type', 'text');
		inputForm.setAttribute('name', 'courses[0][chapters]['+chapter+'][title]');
		inputForm.id = 'formGroupExampleInput'+(inputIdNumber+1);
		labelForm.setAttribute('for', 'formGroupExampleInput'+(inputIdNumber+1));
		labelForm.innerHTML = 'Chapter Title '+chapter;
		
		divForm.appendChild(inputForm);
		divForm.appendChild(labelForm);
		
		divFormUrlTeacher.classList.add('md-form');
		inputFormUrlTeacher.classList.add('form-control');
		inputFormUrlTeacher.setAttribute('type', 'text');
		inputFormUrlTeacher.setAttribute('name', 'courses[0][chapters]['+chapter+'][videos][url_teacher]');
		inputFormUrlTeacher.id = 'formGroupExampleInput'+(inputIdNumber+2);
		labelFormUrlTeacher.setAttribute('for', 'formGroupExampleInput'+(inputIdNumber+2));
		labelFormUrlTeacher.innerHTML = 'Video URL Teacher '+chapter;
		
		divFormUrlTeacher.appendChild(inputFormUrlTeacher);
		divFormUrlTeacher.appendChild(labelFormUrlTeacher);
		
		divFormUrlPresentation.classList.add('md-form');
		inputFormUrlPresentation.classList.add('form-control');
		inputFormUrlPresentation.setAttribute('type', 'text');
		inputFormUrlPresentation.setAttribute('name', 'courses[0][chapters]['+chapter+'][videos][url_presentation]');
		inputFormUrlPresentation.id = 'formGroupExampleInput'+(inputIdNumber+3);
		labelFormUrlPresentation.setAttribute('for', 'formGroupExampleInput'+(inputIdNumber+3));
		labelFormUrlPresentation.innerHTML = 'Video URL Presentation '+chapter;
		
		divFormUrlPresentation.appendChild(inputFormUrlPresentation);
		divFormUrlPresentation.appendChild(labelFormUrlPresentation);
		
		$(divForm).insertBefore(this);
		$(divFormUrlTeacher).insertBefore(this);
		$(divFormUrlPresentation).insertBefore(this);

	});
	var forCopy = null;
	$('#copy-json').on('click', function(){
		if(forCopy !== null){
			var teporarElementForCopy = document.createElement('textarea');
			teporarElementForCopy.value = forCopy;
			document.body.appendChild(teporarElementForCopy);
			teporarElementForCopy.select();
			teporarElementForCopy.setSelectionRange(0, 99999); 
			document.execCommand('copy');
			document.body.removeChild(teporarElementForCopy);
		}
	});
	$('#download-json').on('click', function(){
		if(forCopy !== null){
			var a = window.document.createElement('a');
			a.href = window.URL.createObjectURL(new Blob([forCopy], {type: 'application/json'}));
			a.download = 'test.json';

			document.body.appendChild(a);
			a.click();

			document.body.removeChild(a);
		}
	});
});
		
function syntaxHighlight(json) {
	json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
		var cls = 'number';
		if (/^"/.test(match)) {
			if (/:$/.test(match)) {
				cls = 'key';
			} else {
				cls = 'string';
			}
		} else if (/true|false/.test(match)) {
			cls = 'boolean';
		} else if (/null/.test(match)) {
			cls = 'null';
		}
		return '<span class="' + cls + '">' + match + '</span>';
	});
}