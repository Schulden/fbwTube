//'use strict';

//ON DOCUMENT READY
$(function() {
	//Weiter Button
	$('#weiter').on('click', function(){$('#rdf-tab-link').trigger('click');});
	$('.multiple-lecture-name').select2();
	var sparqlQuery = null;
	$('#hochladen').on('dblclick', function(){			
		$.ajax({
		  type: "POST",
		  url: 'http://fbwsvcdev.fh-brandenburg.de/OntoWiki/update?query=' + 'http://fbwsvcdev.fh-brandenburg.de/OntoWiki/update?query=INSERT DATA INTO <http://fbwsvcdev.fh-brandenburg.de/OntoWiki/test/> ' + sparqlQuery,
		  dataType: 'jsonp',
		  xhrFields : {
			withCredentials : true
		  },
		  contentType: 'application/x-www-form-urlencoded',
		  //beforeSend: function (xhr) {
			//xhr.setRequestHeader('Access-Control-Allow-Origin', 'http://fbwsvcdev.fh-brandenburg.de/');
			//xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
			//xhr.setRequestHeader('Access-Control-Allow-Headers', 'Authorization');
			//xhr.setRequestHeader('Authorization', makeBaseAuth('fbwTubeTech','fbwTube2019'));
		  //},
		  success: function(successData) {
			 console.log( successData );
		  },
		  error: function(errorText) {
			console.log( errorText );
			addWarningAlert();			 
		  }
		});
	});
	
	//SELECT LECTURER FROM KNOLEDGE GRAPH	
	  var personQuery = "SELECT ?name ?email WHERE { ?person  a <https://bmake.th-brandenburg.de/vidp%23Lecturer>; <http://www.w3.org/2000/01/rdf-schema%23label>  ?name; <https://schema.org/email> ?email. };";
	  var lectureSeriesQuery = "SELECT ?name WHERE { ?lectureSeries  a <https://bmake.th-brandenburg.de/vidp%23LectureSeries>; <https://schema.org/name>  ?name .};"
	  var moduleQuery = "SELECT * WHERE { ?Module  a <https://bmake.th-brandenburg.de/vidp%23Module> .}";
	  
	  
	  $.ajax({
		  type: "POST",
		  url: 'http://fbwsvcdev.fh-brandenburg.de/OntoWiki/sparql?query=' + personQuery,
		  cache: false,
		  dataType: 'json', 
		  success: function(successData) {
			var trys = $('.multiple-lecture-name');

			$.each(successData.results.bindings, function( index, value) {
				var optionForm = document.createElement('option');
				optionForm.value = value.name.value;
				optionForm.innerHTML = value.name.value;
				optionForm.dataset.email = value.email.value;
				trys.append(optionForm);
			});
		  },
		  error: function(errorText) {
			 console.log( errorText );
			 addWarningAlert();
		  }
	  });
	  
	  $.ajax({
		  type: "POST",
		  url: 'http://fbwsvcdev.fh-brandenburg.de/OntoWiki/sparql?query=' + lectureSeriesQuery,
		  cache: false,
		  dataType: 'json', 
		  success: function(successData) {
			var lectureSeries = $('#lectureSeries');
			lectureSeries.empty();

			$.each(successData.results.bindings, function( index, value) {
				var optionForm = document.createElement('option');
				optionForm.value = value.name.value;
				lectureSeries.append(optionForm);
			});
		  $('[name="lectureSeriesName"]').trigger('focusin');
		  },
		  error: function(errorText) {
			 console.log( errorText );
			 addWarningAlert();
		  }
	  });
	  $.ajax({
		  type: "POST",
		  url: 'http://fbwsvcdev.fh-brandenburg.de/OntoWiki/sparql?query=' + moduleQuery,
		  cache: false,
		  dataType: 'json', 
		  success: function(successData) {
			var module = $('#module');
			module.empty();

			$.each(successData.results.bindings, function( index, value) {
				var optionForm = document.createElement('option');
				optionForm.value = value.Module.value.split('#')[1];
				module.append(optionForm);
			});
		  $('[name="moduleName"]').trigger('focusin');
		  },
		  error: function(errorText) {
			 console.log( errorText );
			 addWarningAlert();
		  }
	  });
	  
	//INSERT MAIL LECTURER IN INPUT
	$('.multiple-lecture-name').on('select2:close', function(){
		var input = $('[data-insert="email"]');
		input.trigger('focusin');
		
		var selectedLecturer = $('.select2-selection__choice');
		var emails = [];
		$.each(selectedLecturer, function( index, value) {
			emails.push($('option[value="'+value.title+'"]').attr('data-email'));
		});
		input.val(emails.join(', '));
		input.trigger('input');
	});
	//SHOW DATA ON SCREEN
	$('form#jsonDataFom').on('input', function(){
		var formDataToObjekt = $(this).serializeObject();
		if(formDataToObjekt.states !== undefined){
			formDataToObjekt.courses[0].lecturer = formDataToObjekt.states.join(', ');
			delete formDataToObjekt.states
		}
		//ADDING NEW LECTURER TO JSON
		var newLecturer = $(this).find('[id^="formGroupExampleInputNew"]');
		if(newLecturer.length !== 0){
			var newLecturersNames = [];
			$.each($('[name^="lecturerLabe"][id^="formGroupExampleInputNew"]'), function( index, value) {
				newLecturersNames.push(value.value);
			});
			var newLecturersEmail = [];
			$.each($('[name^="lecturerEmail"][id^="formGroupExampleInputNew"]'), function( index, value) {
				newLecturersEmail.push(value.value);
			});
			
			if(formDataToObjekt.courses[0].lecturer !== '') {
				formDataToObjekt.courses[0].lecturer = formDataToObjekt.courses[0].lecturer+', '+newLecturersNames.join(', ');
				formDataToObjekt.courses[0].lecturerMail = formDataToObjekt.courses[0].lecturerMail+', '+newLecturersEmail.join(', ');
			}else{
				formDataToObjekt.courses[0].lecturer = formDataToObjekt.courses[0].lecturer+newLecturersNames.join(', ');
				formDataToObjekt.courses[0].lecturerMail = formDataToObjekt.courses[0].lecturerMail+newLecturersEmail.join(', ');
			}
			
			$.each(newLecturer, function( index, value) {
				delete formDataToObjekt[value.name];
			});
		}
		
		var serialisedDataObjekt = JSON.stringify(formDataToObjekt, undefined, 4);

		forCopy = serialisedDataObjekt;
		var forAppend = syntaxHighlight(serialisedDataObjekt);
		
		var pre = document.createElement('pre');
		pre.innerHTML = forAppend;
		
		var jsonDataContainer = $("#jsonData");
		
		if(jsonDataContainer.length) {
			jsonDataContainer.empty();
			jsonDataContainer.append(pre);
		}else{
			jsonDataContainer.append(pre);
		}
	});
	//ADD A NEW CHAPTER
	var chapter = 0;
	$('#addChapters').on('click', function(){
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
		
		var inputIdNumber = $('#json [id^=formGroupExampleInput]').length;			
		
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
		
		
		//ADD INPUP CHAPTERS IN RDF
		if(chapter > 0) {
			var divFormDuration = document.createElement('div');
			var inputFormDuration = document.createElement('input');
			var labelFormDuration =  document.createElement('label');
			var divFormHeadlineDe = document.createElement('div');
			var inputFormHeadlineDe = document.createElement('input');
			var labelFormHeadlineDe =  document.createElement('label');
			var divFormHeadlineEn = document.createElement('div');
			var inputFormHeadlineEn = document.createElement('input');
			var labelFormHeadlineEn =  document.createElement('label');
			
			var inputIdNumber = $('#rdf [id^=formRdfGroupExampleInput]').length;		
			
			divFormDuration.classList.add('md-form');
			inputFormDuration.classList.add('form-control');
			inputFormDuration.setAttribute('type', 'text');
			inputFormDuration.setAttribute('name', 'schemaDuration'+chapter+'');
			inputFormDuration.id = 'formRdfGroupExampleInput'+(inputIdNumber+1);
			labelFormDuration.setAttribute('for', 'formRdfGroupExampleInput'+(inputIdNumber+1));
			labelFormDuration.innerHTML = 'Schema Chapter '+chapter+' Duration';	
			divFormDuration.appendChild(inputFormDuration);
			divFormDuration.appendChild(labelFormDuration);
			
			divFormHeadlineDe.classList.add('md-form');
			inputFormHeadlineDe.classList.add('form-control');
			inputFormHeadlineDe.setAttribute('type', 'text');
			inputFormHeadlineDe.setAttribute('name', 'schemaHeadlineDe'+chapter+'');
			inputFormHeadlineDe.id = 'formRdfGroupExampleInput'+(inputIdNumber+2);
			labelFormHeadlineDe.setAttribute('for', 'formRdfGroupExampleInput'+(inputIdNumber+2));
			labelFormHeadlineDe.innerHTML = 'Schema Headline German Chapter '+chapter;	
			divFormHeadlineDe.appendChild(inputFormHeadlineDe);
			divFormHeadlineDe.appendChild(labelFormHeadlineDe);
			
			divFormHeadlineEn.classList.add('md-form');
			inputFormHeadlineEn.classList.add('form-control');
			inputFormHeadlineEn.setAttribute('type', 'text');
			inputFormHeadlineEn.setAttribute('name', 'schemaHeadlineEn'+chapter+'');
			inputFormHeadlineEn.id = 'formRdfGroupExampleInput'+(inputIdNumber+3);
			labelFormHeadlineEn.setAttribute('for', 'formRdfGroupExampleInput'+(inputIdNumber+3));
			labelFormHeadlineEn.innerHTML = 'Schema Headline English Chapter '+chapter;	
			divFormHeadlineEn.appendChild(inputFormHeadlineEn);
			divFormHeadlineEn.appendChild(labelFormHeadlineEn);
			
			var parentForAppend = $('[name="schemaInLanguage"]').parents().first()
			
			$(divFormHeadlineDe).insertBefore(parentForAppend);
			$(divFormHeadlineEn).insertBefore(parentForAppend);
			$('form#rdfDataForm').append(divFormDuration);
		}
	});
	var lecturerNumber = null;
	$('#addLecturer').on('click', function(){
		++lecturerNumber;
		var inputIdNumber = $('#json [id^=formGroupExampleInput]').length;			
		var divForm = document.createElement('div');
		var inputForm = document.createElement('input');
		var labelForm =  document.createElement('label');
		
		var divFormLabel = document.createElement('div');
		var inputFormLabel = document.createElement('input');
		var labelFormLabel =  document.createElement('label');
		
		var divFormEmail = document.createElement('div');
		var inputFormEmail = document.createElement('input');
		var labelFormEmail =  document.createElement('label');
		
		divForm.classList.add('md-form');
		inputForm.classList.add('form-control');
		inputForm.setAttribute('type', 'text');
		inputForm.setAttribute('name', 'lecturerName'+lecturerNumber);
		inputForm.id = 'formGroupExampleInputNew'+(inputIdNumber+1);
		labelForm.setAttribute('for', 'formGroupExampleInputNew'+(inputIdNumber+1));
		labelForm.innerHTML = 'Lecturer Name '+lecturerNumber;
		divForm.appendChild(inputForm);
		divForm.appendChild(labelForm);
		
		divFormLabel.classList.add('md-form');
		inputFormLabel.classList.add('form-control');
		inputFormLabel.setAttribute('type', 'text');
		inputFormLabel.setAttribute('name', 'lecturerLabel'+lecturerNumber);
		inputFormLabel.id = 'formGroupExampleInputNew'+(inputIdNumber+2);
		labelFormLabel.setAttribute('for', 'formGroupExampleInputNew'+(inputIdNumber+2));
		labelFormLabel.innerHTML = 'Lecturer Label '+lecturerNumber;
		divFormLabel.appendChild(inputFormLabel);
		divFormLabel.appendChild(labelFormLabel);
		
		divFormEmail.classList.add('md-form');
		inputFormEmail.classList.add('form-control');
		inputFormEmail.setAttribute('type', 'text');
		inputFormEmail.setAttribute('name', 'lecturerEmail'+lecturerNumber);
		inputFormEmail.id = 'formGroupExampleInputNew'+(inputIdNumber+3);
		labelFormEmail.setAttribute('for', 'formGroupExampleInputNew'+(inputIdNumber+3));
		labelFormEmail.innerHTML = 'Lecturer Email '+lecturerNumber;
		divFormEmail.appendChild(inputFormEmail);
		divFormEmail.appendChild(labelFormEmail);
				
		$(divForm).insertBefore(this);
		$(divFormLabel).insertBefore(this);
		$(divFormEmail).insertBefore(this);
	});
	//COPY JSON
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
	//DOWNLOAD JSON AS JSON-FILE
	$('#download-json').on('click', function(){
		if(forCopy !== null){
			var a = window.document.createElement('a');
			a.href = window.URL.createObjectURL(new Blob([forCopy], {type: 'application/json'}));
			a.download = JSON.parse(forCopy).courses[0].title+'.json';

			document.body.appendChild(a);
			a.click();

			document.body.removeChild(a);
		}
	});
	//UPLOAD JSON AS JSON-FILE
	$('#upload-json').on('click', function(){
		if(forCopy !== null){
		  $.ajax({
				type: 'POST',
				url: 'file.php',
				data: {filedata: forCopy, filename: JSON.parse(forCopy).courses[0].title},
				success: function(result) {
					console.log('Daten wurden hochgeladen.');
					addSuccessAlert();
				},
				error: function(result) {
					console.log(result);
					addWarningAlert();
				}
			});
		}
	});
	
	//RDF DATA SHOW ON SCREEN
	$('form#rdfDataForm').on('input', function(){
		var formDataToObjekt = $(this).serializeObject();
		var serialisedDataObjekt = JSON.stringify(addRdfPrefix(formDataToObjekt), undefined, 4);
		
		var addColors = serialisedDataObjekt.replace(/[{}]/g, '')
											.replace(/\":/g, '')
											.replace(/\"/g, '')
											.replace(/\.,/g, '.')
											.replace(/\ &semi;,/g, ';')
											.replace(/\&semi;,/g, ';')
											.replace(/&semi;/g, ';')
											.replace(/&commat;prefix/g, "<span class="+'"key"'+">&commat;prefix</span>")
											.replace(/&commat;de/g, "<span class="+'"key"'+">&commat;de</span>")
											.replace(/&commat;en/g, "<span class="+'"key"'+">&commat;en</span>")
											.replace(/&lt;(.*)&gt;/g, "<span class="+'"null"'+">&lt;$1&gt;</span>")
											.replace(/&quot;(.*)&quot;/g, "<span class="+'"string"'+">&quot;$1&quot;</span>");
		
		var pre = document.createElement('pre');
		pre.innerHTML = addColors;
		
		sparqlQuery = serialisedDataObjekt.replace(/\":/g, '')
										  .replace(/\"/g, '')
										  .replace(/\.,/g, '.')
										  .replace(/\ &semi;,/g, ';')
										  .replace(/\&semi;,/g, ';')
										  .replace('\n','')
										  .replace( /\s\s\s\s+/g, ' ')
										  .replace(/&colon;/g, ':')
										  .replace(/&quot;/g, '"')
										  .replace(/&comma;/g, ',')
										  .replace(/&semi;/g, ';')
										  .replace(/&lt;/g, '<')
										  .replace(/&gt;/g, '>')
										  .replace(/&commat;/g, '%40')										 
										  .replace(/&amp;/g, '%26')
										  .replace(/&num;/g, '%23');

			
		var rdfDataContainer = $("#rdfData");
		
		if(rdfDataContainer.length) {
			rdfDataContainer.empty();
			rdfDataContainer.append(pre);
		}else{
			rdfDataContainer.append(pre);
		}
	});
});

function addRdfPrefix(formDataToObjekt) {
	var inputDuration = $('[name^="schemaDuratio"]');
	var vide = 'vide&colon;'+formDataToObjekt.videoLecture+'';
	var videName = formDataToObjekt.videoLecture;
	var schemaDescriptionDe = formDataToObjekt.schemaDescriptionDe;
	var schemaDescriptionEn = formDataToObjekt.schemaDescriptionEn;
	var schemaKeywordsDe = formDataToObjekt.schemaKeywordsDe;
	var schemaKeywordsEn = formDataToObjekt.schemaKeywordsEn;
	var schemaHeadlineDe = formDataToObjekt.schemaHeadlineDe;
	var schemaHeadlineEn = formDataToObjekt.schemaHeadlineEn;
	var schemaInLanguage = formDataToObjekt.schemaInLanguage;
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var schemaDuration0 = formDataToObjekt.schemaDuration0;
	var lectureSeriesName = formDataToObjekt.lectureSeriesName.replace( /\s/g, '');
	var moduleName = formDataToObjekt.moduleName;

	var rdfPrefix = {
			'&commat;prefix rdfs&colon;'   : '&lt;http&colon;//www.w3.org/2000/01/rdf-schema&num;&gt; .',
			'&commat;prefix schema&colon;' : '&lt;https&colon;//schema.org/&gt; .',
			'&commat;prefix vide&colon;'   : '&lt;https&colon;//bmake.th-brandenburg.de/vide&num;&gt; .',
			'&commat;prefix vidp&colon;'   : '&lt;https&colon;//bmake.th-brandenburg.de/vidp&num;&gt; .',
			'&commat;prefix xsd&colon;'   : '&lt;http://www.w3.org/2001/XMLSchema&num;&gt; .',
			'&commat;prefix type&colon;'   : '&lt;http&colon;//www.w3.org/1999/02/22-rdf-syntax-ns&num;type&gt; .',
			'&commat;prefix name&colon;'   : '&lt;https&colon;//schema.org/name&gt; .',
		}; 
		
		
	var obj = {};
	for(i=0; i<inputDuration.length; i++){
		if(i==0){
			obj = {
				[vide+' a '] : 'vidp&colon;VideoLecture .',
				[vide+' rdfs&colon;label'] : '&quot;'+videName+'&quot; .'
			}
			if(lectureSeriesName !== "none" && lectureSeriesName.length !== 0){
				Object.assign(obj, {['vide&colon;'+ lectureSeriesName + ' schema&colon;hasPart'] : '&quot;'+vide+'&quot; .',});
			}
			
			if(moduleName !== "none" && moduleName.length !== 0) {
				Object.assign(obj, {[vide+' schema&colon;about'] : 'vide&colon;'+moduleName +' .',});
			}
			
			Object.assign(obj, {				
				[vide] : ' a vidp&colon;DoubleClip .',
				[vide+' schema&colon;name'] : '&quot;'+videName+'&quot; .',
				[vide+' schema&colon;url'] : '&quot;http&colon;//univera.de/FHB/fbwTube/?id='+videName+'&quot; .',
				[vide+' schema&colon;licence'] : '&quot;https&colon;//creativecommons.org/licenses/by-nc-sa/2.0/de/&quot; .',
				[vide+' schema&colon;description'] : '&quot;'+schemaDescriptionDe+'&quot;&commat;de&comma; &quot;'+schemaDescriptionEn+'&quot;&commat;en .',
				[vide+' schema&colon;keywords'] : '&quot;'+schemaKeywordsDe+'&quot;&commat;de&comma; &quot;'+schemaKeywordsEn+'&quot;&commat;en .',
				[vide+' schema&colon;headline'] : '&quot;'+schemaHeadlineDe+'&quot;&commat;de&comma; &quot;'+schemaHeadlineEn+'&quot;&commat;en .',
				[vide+' schema&colon;inLanguage'] : '&quot;'+schemaInLanguage+'&quot; .',
				[vide+' schema&colon;duration'] : '&quot;PT'+schemaDuration0+'&quot; .'
			});
		}else{
			var count = i-1;
			var schemaHeadlineDe = formDataToObjekt["schemaHeadlineDe"+i];
			var schemaHeadlineEn = formDataToObjekt["schemaHeadlineEn"+i];
			var schemaDuration = formDataToObjekt["schemaDuration"+i];
			
			obj = {
				[vide+'_0'+count+' a '] : 'vidp&colon;VideoLecture .',
				[vide+'_0'+count+' rdfs&colon;label'] : '&quot;'+videName+' Clip '+count+'&quot; .',
				[vide+'_0'+count] : ' a vidp&colon;DoubleClip .',
				[vide+'_0'+count+' schema&colon;isPartOf '] : vide+' .',
				[vide+'_0'+count+' schema&colon;name'] : '&quot;'+videName+' Clip 0'+count+'&quot; .',
				[vide+'_0'+count+' schema&colon;url'] : '&quot;http&colon;//univera.de/FHB/fbwTube/?id='+videName+'&amp;chapter='+count+'&quot; .',
				[vide+'_0'+count+' schema&colon;headline'] : '&quot;'+schemaHeadlineDe+i+'&quot;&commat;de&comma; &quot;'+schemaHeadlineEn+i+'&quot;&commat;en .',
				[vide+'_0'+count+' schema&colon;dateCreated'] : '&quot;'+date+'&quot;^^xsd&colon;date .',
				[vide+'_0'+count+' schema&colon;duration'] : '&quot;PT'+schemaDuration+'&quot; .'
			}
		}
		Object.assign(rdfPrefix, obj);
	}
	
	//ADD NEW LECTURER	
	var addNewLecturer = $('form#jsonDataFom').find('[id^="formGroupExampleInputNew"]');
	
	if(addNewLecturer.length !== 0){
		var newLecturerObject = {};
		var lecturerCount = $('form#jsonDataFom').find('[name^="lecturerName"]');
		for(var i=1; i <= lecturerCount.length; i++) {
			var name = $('[name="lecturerName'+i+'"]').val();
			var nameWithoutSpaces = name.replace(/\s+/g,'')
			var label = $('[name="lecturerLabel'+i+'"]').val();
			var email = $('[name="lecturerEmail'+i+'"]').val();
			Object.assign(newLecturerObject, {
				['vide&colon;'+nameWithoutSpaces] : 'a vidp&colon;Lecturer&semi;',
				['rdfs&colon;label '+'&quot;'+label+'&quot;'] : '&semi;',
				['schema&colon;name '+'&quot;'+name+'&quot;'] : '&semi;',
				['schema&colon;email '+'&quot;'+email+'&quot;'] : '.'
			});
		}
		Object.assign(rdfPrefix, newLecturerObject);
	}
	
	return rdfPrefix;
}

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

function makeBaseAuth(user, pswd){ 
  var token = user + ':' + pswd;
  var hash = "";
  if (btoa) {
	 hash = btoa(token);
  }
  return "Basic " + hash;
}


function addWarningAlert() {
	var divAlert = document.createElement('div');
	var spanAlert = document.createElement('span');
	var buttonAlert =  document.createElement('button');
	var spanButtonAlert = document.createElement('span');

	divAlert.classList.add('alert', 'alert-danger', 'alert-dismissible', 'fade', 'show');
	divAlert.setAttribute('role', 'alert');
	spanAlert.innerHTML = 'Es tut uns Leid aber etwas ist schiefgelaufen!';
	buttonAlert.classList.add('close');
	buttonAlert.setAttribute('type', 'button');
	buttonAlert.setAttribute('data-dismiss', 'alert');
	buttonAlert.setAttribute('aria-label', 'Close');
	spanButtonAlert.setAttribute('aria-hidden', 'true');
	spanButtonAlert.innerHTML = '&times;';

	divAlert.appendChild(spanAlert);
	buttonAlert.appendChild(spanButtonAlert);
	divAlert.appendChild(buttonAlert);
	$('#data-content').prepend(divAlert)
};

function addSuccessAlert() {
	var divAlert = document.createElement('div');
	var spanAlert = document.createElement('span');
	var buttonAlert =  document.createElement('button');
	var spanButtonAlert = document.createElement('span');

	divAlert.classList.add('alert', 'alert-success', 'alert-dismissible', 'fade', 'show');
	divAlert.setAttribute('role', 'alert');
	spanAlert.innerHTML = 'Die Daten wurden erfolgreich &uuml;bertragen;!';
	buttonAlert.classList.add('close');
	buttonAlert.setAttribute('type', 'button');
	buttonAlert.setAttribute('data-dismiss', 'alert');
	buttonAlert.setAttribute('aria-label', 'Close');
	spanButtonAlert.setAttribute('aria-hidden', 'true');
	spanButtonAlert.innerHTML = '&times;';

	divAlert.appendChild(spanAlert);
	buttonAlert.appendChild(spanButtonAlert);
	divAlert.appendChild(buttonAlert);
	$('#data-content').prepend(divAlert);
};






