'use strict';

//ON DOCUMENT READY
$(function() {
	//Weiter Button
	$('#weiter').on('click', function(){$('#rdf-tab-link').trigger('click');});
	$('.multiple-lecture-name').select2();
	var sparqlQuery = null;
	$('#hochladen').on('click', function(){
		addModalLogin();
	});
	
	$('.for-datetime').datetimepicker({
		icons:{
				up: 'fa fa-angle-up',
				down: 'fa fa-angle-down'
			},
		format: 'mm:ss'
	});
	
	//SPARQL-Query Einfeugen
	$(document).on('click', '#login', function(){
		
		var inputPassword = $('#inputPassword').val();
		var inputUsername = $('#inputUsername').val();
		
		if(inputUsername && inputPassword){
			$.ajax({
			  type: "POST",
			  url: 'http://'+inputUsername+':'+inputPassword+'@fbwsvcdev.fh-brandenburg.de/OntoWiki/update?query=' + 'http://fbwsvcdev.fh-brandenburg.de/OntoWiki/update?query=INSERT DATA INTO <http://fbwsvcdev.fh-brandenburg.de/OntoWiki/test/> ' + sparqlQuery,
			  dataType: 'jsonp',
			  xhrFields : {
				withCredentials : true
			  },
			  contentType: 'application/x-www-form-urlencoded',
			  success: function(successData) {
				location.reload(true);
			  },
			  error: function(errorText) {
				if(errorText.status == 200){
					location.reload(true);
				}else{
					$('#modalLoginForm').modal('hide');
					console.log(errorText);
					addWarningAlert();	 
				}
			  }
			});
		}
	});
	
	//SELECT LECTURER FROM KNOLEDGE GRAPH	
	  var personQuery = "SELECT ?name ?email WHERE { ?person  a <https://bmake.th-brandenburg.de/vidp%23Lecturer>; <http://www.w3.org/2000/01/rdf-schema%23label>  ?name; <https://schema.org/email> ?email. };";
	  var lectureSeriesQuery = "SELECT ?name WHERE { ?lectureSeries  a <https://bmake.th-brandenburg.de/vidp%23LectureSeries>; <https://schema.org/name>  ?name .};"
	  var moduleQuery = "SELECT * WHERE { ?Module  a <https://bmake.th-brandenburg.de/vidp%23Module> .}";
	  var lecturerQuery = "SELECT * FROM { ?person a <https://bmake.th-brandenburg.de/vidp%23Lecturer> . }";
	  
	  
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
	
	  $.ajax({
		  type: "POST",
		  url: 'http://fbwsvcdev.fh-brandenburg.de/OntoWiki/sparql?query=' + lecturerQuery,
		  cache: false,
		  dataType: 'json', 
		  success: function(successData) {
			var sprecher = $('#sprecher');

			$.each(successData.results.bindings, function( index, value) {
				var optionForm = document.createElement('option');
				optionForm.value = value.person.value.split('#')[1];
				optionForm.innerHTML = value.person.value.split('#')[1];
				sprecher.append(optionForm);
			});
		  sprecher.trigger('focusin');
		  },
		  error: function(errorText) {
			 console.log( errorText );
			 addWarningAlert();
		  }
	  });
	//Select on focus  
	$(document).on('focusin', 'select.form-control', function(){
		$(this).next().addClass('active');
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
		//Add Lecture Name to RDF
		var videoLecture = $('[name="videoLecture"]');
		videoLecture.val($('#lectureShortcuts').val());
		videoLecture.trigger('focusin');
		//Add Lecture Title to RDF
		var titleVorlesungDe = $('[name="schemaHeadlineDe"]');
		titleVorlesungDe.val($('#titelVorlesung').val());
		titleVorlesungDe.trigger('focusin');
		
		//Add Clip Title to RDF
		var titleClipNumber = $('#json [id^=titleClip]').length;
		for(var i=0; i < titleClipNumber; i++) {
			$('[name="schemaHeadlineDe'+(i+1)+'"]').val($('#titleClip'+i).val());
			$('[name="schemaHeadlineDe'+(i+1)+'"]').trigger('focusin');
		}
		
		
		
		if(formDataToObjekt.states !== undefined){
			formDataToObjekt.courses[0].lecturer = formDataToObjekt.states.join(', ');
			delete formDataToObjekt.states
		}
		
		//ADD new Lecturer as new Option for RDF
		var newAddedLecturer = $('[id^="newAddedLecturer"]');
		var lecturerNachname = $('[name^="lecturerName"]');
		for(var a = 0; a < lecturerNachname.length; a++) {
			var nachName = $('[name="lecturerNachname'+(a+1)+'"]').val();
			var firstName = $('[name="lecturerName'+(a+1)+'"]').val();
			
			for (var i = 0; i < newAddedLecturer.length; i++) {
				newAddedLecturer[i].value = firstName+nachName;
				newAddedLecturer[i].text = firstName+nachName;
			}
		}		
		
		//ADDING NEW LECTURER TO JSON
		var newLecturer = $(this).find('[id^="formGroupExampleInputNew"]');
		if(newLecturer.length !== 0){
			var newLecturersNames = [];
			$.each($('[name^="lecturerLabe"][id^="formGroupExampleInputNew"]'), function( index, value) {
				newLecturersNames.push(value.value);
			});
			
			$.each($('[name^="lecturerName1"][id^="formGroupExampleInputNew"]'), function( index, value) {				
				if(value.value){					
					if(newLecturersNames[0].includes('Prof.') || newLecturersNames[0].includes('Prof. Dr.') || newLecturersNames[0].includes('Dr.')){						
						newLecturersNames[0] = newLecturersNames[0] + ' ' + value.value;						
					}else{
						if(newLecturersNames[0].includes(',')){
							newLecturersNames[0] = value.value + ' ' + newLecturersNames[0];
						}else{
							newLecturersNames[0] = value.value + ', ' + newLecturersNames[0];
						}						
					}
				}
			});
			
			$.each($('[name^="lecturerNachname1"][id^="formGroupExampleInputNew"]'), function( index, value) {
				if(value.value){
					if(newLecturersNames[0].includes('Prof.') || newLecturersNames[0].includes('Prof. Dr.') || newLecturersNames[0].includes('Dr.')){						
						newLecturersNames[0] = newLecturersNames[0] + ' ' + value.value;						
					}else{
						if(newLecturersNames[0].includes(',')){
							newLecturersNames[0] = value.value + ' ' + newLecturersNames[0];
						}else{
							newLecturersNames[0] = value.value + ', ' + newLecturersNames[0];
						}		
					}
				}
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
		var titleClipNumber = $('#json [id^=titleClip]').length;
		
		divForm.classList.add('md-form');
		inputForm.classList.add('form-control');
		inputForm.setAttribute('type', 'text');
		inputForm.setAttribute('name', 'courses[0][chapters]['+chapter+'][title]');
		inputForm.id = 'titleClip'+(titleClipNumber);
		labelForm.setAttribute('for', 'titleClip'+(titleClipNumber));
		labelForm.innerHTML = 'Titel des Clips '+chapter;
		
		divForm.appendChild(inputForm);
		divForm.appendChild(labelForm);
		
		divFormUrlTeacher.classList.add('md-form');
		inputFormUrlTeacher.classList.add('form-control');
		inputFormUrlTeacher.setAttribute('type', 'text');
		inputFormUrlTeacher.setAttribute('name', 'courses[0][chapters]['+chapter+'][videos][url_teacher]');
		inputFormUrlTeacher.id = 'formGroupExampleInput'+(inputIdNumber+2);
		labelFormUrlTeacher.setAttribute('for', 'formGroupExampleInput'+(inputIdNumber+2));
		labelFormUrlTeacher.innerHTML = 'Vimeo ID Sprecher '+chapter;
		
		divFormUrlTeacher.appendChild(inputFormUrlTeacher);
		divFormUrlTeacher.appendChild(labelFormUrlTeacher);
		
		divFormUrlPresentation.classList.add('md-form');
		inputFormUrlPresentation.classList.add('form-control');
		inputFormUrlPresentation.setAttribute('type', 'text');
		inputFormUrlPresentation.setAttribute('name', 'courses[0][chapters]['+chapter+'][videos][url_presentation]');
		inputFormUrlPresentation.id = 'formGroupExampleInput'+(inputIdNumber+3);
		labelFormUrlPresentation.setAttribute('for', 'formGroupExampleInput'+(inputIdNumber+3));
		labelFormUrlPresentation.innerHTML = 'Vimeo ID Screencast '+chapter;
		
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
			inputFormDuration.classList.add('form-control', 'for-datetime');
			inputFormDuration.setAttribute('type', 'text');
			inputFormDuration.setAttribute('name', 'schemaDuration'+(chapter+1)+'');
			inputFormDuration.id = 'formRdfGroupExampleInput'+(inputIdNumber+2);
			labelFormDuration.setAttribute('for', 'formRdfGroupExampleInput'+(inputIdNumber+2));
			labelFormDuration.innerHTML = 'Laufzeit des Clips '+(chapter+1);	
			divFormDuration.appendChild(inputFormDuration);
			divFormDuration.appendChild(labelFormDuration);
			
			divFormHeadlineDe.classList.add('md-form');
			inputFormHeadlineDe.classList.add('form-control');
			inputFormHeadlineDe.setAttribute('type', 'text');
			inputFormHeadlineDe.setAttribute('name', 'schemaHeadlineDe'+(chapter+1)+'');
			inputFormHeadlineDe.id = 'formRdfGroupExampleInput'+(inputIdNumber+3);
			labelFormHeadlineDe.setAttribute('for', 'formRdfGroupExampleInput'+(inputIdNumber+3));
			labelFormHeadlineDe.innerHTML = 'Titel des Clips '+(chapter+1)+' (de)';	
			divFormHeadlineDe.appendChild(inputFormHeadlineDe);
			divFormHeadlineDe.appendChild(labelFormHeadlineDe);
			
			divFormHeadlineEn.classList.add('md-form');
			inputFormHeadlineEn.classList.add('form-control');
			inputFormHeadlineEn.setAttribute('type', 'text');
			inputFormHeadlineEn.setAttribute('name', 'schemaHeadlineEn'+(chapter+1)+'');
			inputFormHeadlineEn.id = 'formRdfGroupExampleInput'+(inputIdNumber+4);
			labelFormHeadlineEn.setAttribute('for', 'formRdfGroupExampleInput'+(inputIdNumber+4));
			labelFormHeadlineEn.innerHTML = 'Titel des Clips '+(chapter+1)+' (en)';	
			divFormHeadlineEn.appendChild(inputFormHeadlineEn);
			divFormHeadlineEn.appendChild(labelFormHeadlineEn);
			
			var selectSprecher = $('#sprecher');
			
			var clone = selectSprecher.parent()[0].cloneNode(true);
			clone.children[0].id = selectSprecher[0].id + selectSprecher.length;
			clone.children[0].name = clone.children[0].name.split(/[0-9]/)[0] + selectSprecher.length;
			
			var formDataRdf = $('form#rdfDataForm');
			
			formDataRdf.append(divFormHeadlineDe);
			formDataRdf.append(divFormHeadlineEn);
			formDataRdf.append(divFormDuration);
			formDataRdf.append(clone);
			$('.for-datetime').datetimepicker({
				icons:{
						up: 'fa fa-angle-up',
						down: 'fa fa-angle-down'
					},
				format: 'mm:ss'
			});
		}
	});
	var lecturerNumber = null;
	$('#addLecturer').on('click', function(){
		++lecturerNumber;
		var inputIdNumber = $('#json [id^=formGroupExampleInput]').length;			
		var divForm = document.createElement('div');
		var inputForm = document.createElement('input');
		var labelForm =  document.createElement('label');
		
		var divFormTitle = document.createElement('div');
		var selectFormTitle = document.createElement('select');
		var prefixArray = ['Prof.', 'Prof. Dr.', 'Dr.', 'B.Sc.', 'B.A.', 'M.Sc.'];
		var labelFormTitle =  document.createElement('label');
		
		var divFormLecturerType = document.createElement('div');
		var selectFormTitleLecturerType = document.createElement('select');
		var lecturerTypeArray = ['Lecturer', 'Accountable'];
		var labelFormTitleLecturerType =  document.createElement('label');
		
		var divFormEmail = document.createElement('div');
		var inputFormEmail = document.createElement('input');
		var labelFormEmail =  document.createElement('label');
		
		var divFormNachname = document.createElement('div');
		var inputFormNachname = document.createElement('input');
		var labelFormNachname =  document.createElement('label');
		
		divForm.classList.add('md-form');
		inputForm.classList.add('form-control');
		inputForm.setAttribute('type', 'text');
		inputForm.setAttribute('name', 'lecturerName'+lecturerNumber);
		inputForm.id = 'formGroupExampleInputNew'+(inputIdNumber+1);
		labelForm.setAttribute('for', 'formGroupExampleInputNew'+(inputIdNumber+1));
		labelForm.innerHTML = 'Vorname '+lecturerNumber;
		divForm.appendChild(inputForm);
		divForm.appendChild(labelForm);
		
		divFormTitle.classList.add('md-form');
		selectFormTitle.classList.add('form-control');
		selectFormTitle.setAttribute('type', 'text');
		selectFormTitle.setAttribute('name', 'lecturerLabel'+lecturerNumber);
		selectFormTitle.id = 'formGroupExampleInputNew'+(inputIdNumber+2);
		labelFormTitle.setAttribute('for', 'formGroupExampleInputNew'+(inputIdNumber+2));
		labelFormTitle.innerHTML = 'Titel '+lecturerNumber;
		divFormTitle.appendChild(selectFormTitle);
		divFormTitle.appendChild(labelFormTitle);
		//Create and append the options
		for (var i = 0; i < prefixArray.length; i++) {
			var option = document.createElement('option');
			option.value = prefixArray[i];
			option.text = prefixArray[i];
			selectFormTitle.appendChild(option);
		}
		
		divFormLecturerType.classList.add('md-form');
		selectFormTitleLecturerType.classList.add('form-control');
		selectFormTitleLecturerType.setAttribute('type', 'text');
		selectFormTitleLecturerType.id = 'lecturerType';
		labelFormTitleLecturerType.setAttribute('for', 'lecturerType');
		labelFormTitleLecturerType.innerHTML = 'Type '+lecturerNumber;
		divFormLecturerType.appendChild(selectFormTitleLecturerType);
		divFormLecturerType.appendChild(labelFormTitleLecturerType);
		//Create and append the options
		for (var i = 0; i < lecturerTypeArray.length; i++) {
			var option = document.createElement('option');
			option.value = lecturerTypeArray[i];
			option.text = lecturerTypeArray[i];
			selectFormTitleLecturerType.appendChild(option);
		}
		
		divFormEmail.classList.add('md-form');
		inputFormEmail.classList.add('form-control');
		inputFormEmail.setAttribute('type', 'text');
		inputFormEmail.setAttribute('name', 'lecturerEmail'+lecturerNumber);
		inputFormEmail.id = 'formGroupExampleInputNew'+(inputIdNumber+3);
		labelFormEmail.setAttribute('for', 'formGroupExampleInputNew'+(inputIdNumber+3));
		labelFormEmail.innerHTML = 'E-Mail '+lecturerNumber;
		divFormEmail.appendChild(inputFormEmail);
		divFormEmail.appendChild(labelFormEmail);
		
		divFormNachname.classList.add('md-form');
		inputFormNachname.classList.add('form-control');
		inputFormNachname.setAttribute('type', 'text');
		inputFormNachname.setAttribute('name', 'lecturerNachname'+lecturerNumber);
		inputFormNachname.id = 'formGroupExampleInputNew'+(inputIdNumber+4);
		labelFormNachname.setAttribute('for', 'formGroupExampleInputNew'+(inputIdNumber+4));
		labelFormNachname.innerHTML = 'Nachname '+lecturerNumber;
		divFormNachname.appendChild(inputFormNachname);
		divFormNachname.appendChild(labelFormNachname);
		
		var schemaCreator = $('[name^="schemaCreator"]');
		
		for (var i = 0; i < schemaCreator.length; i++) {
			var option = document.createElement('option');
			option.id = 'newAddedLecturer'+i;
			schemaCreator[i].appendChild(option);
		}
		
				
		$(divForm).insertBefore(this);
		$(divFormNachname).insertBefore(this);
		$(divFormTitle).insertBefore(this);
		$(divFormEmail).insertBefore(this);
		$(divFormLecturerType).insertBefore(this);
		
		$(selectFormTitle).trigger('focusin');
		$(selectFormTitleLecturerType).trigger('focusin');
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
				data: {filedata: forCopy, filename: $('#lectureShortcuts').val()},
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
	var schemaHeadlineDeTitle = formDataToObjekt.schemaHeadlineDe;
	var schemaHeadlineEnTitle = formDataToObjekt.schemaHeadlineEn;
	var schemaInLanguage = formDataToObjekt.schemaInLanguage;
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
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
			
			var count = i;
			var schemaHeadlineDe = formDataToObjekt["schemaHeadlineDe"+(i+1)];
			var schemaHeadlineEn = formDataToObjekt["schemaHeadlineEn"+(i+1)];
			var schemaDuration = formDataToObjekt["schemaDuration"+(i+1)];
			var minutes = schemaDuration.split(':')[0];
			var seconds = ((typeof schemaDuration.split(':')[1] === 'undefined') ? '0' : schemaDuration.split(':')[1]);
			var minutesWithoutZero = ((minutes == '') ? '0' : ((minutes.split('')[0] == '0') ? minutes.split('')[1] : (minutes.split('')[0]+minutes.split('')[1])));
			var creatorName = formDataToObjekt["schemaCreator"+i];
			
			Object.assign(obj, {				
				[vide+' schema&colon;name'] : '&quot;'+videName+'&quot; .',
				[vide+' schema&colon;description'] : '&quot;'+schemaDescriptionDe+'&quot;&commat;de&comma; &quot;'+schemaDescriptionEn+'&quot;&commat;en .',
				[vide+' schema&colon;headline'] : '&quot;'+schemaHeadlineDeTitle+'&quot;&commat;de&comma; &quot;'+schemaHeadlineEnTitle+'&quot;&commat;en .',
				[vide+' schema&colon;inLanguage'] : '&quot;'+schemaInLanguage+'&quot; .',
				[vide+' schema&colon;keywords'] : '&quot;'+schemaKeywordsDe+'&quot;&commat;de&comma; &quot;'+schemaKeywordsEn+'&quot;&commat;en .',
				[vide+' schema&colon;url'] : '&quot;http&colon;//univera.de/FHB/fbwTube/?id='+videName+'&quot; .',
				[vide+' schema&colon;licence'] : '&quot;https&colon;//creativecommons.org/licenses/by-nc-sa/2.0/de/&quot; .',								
				[vide+'_0'+count] : ' a vidp&colon;DoubleClip .',
				[vide+'_0'+count+' rdfs&colon;label'] : '&quot;'+videName+' Clip '+count+'&quot; .',
				[vide+'_0'+count+' schema&colon;name'] : '&quot;'+videName+' Clip '+count+'&quot; .',
				[vide+'_0'+count+' schema&colon;dateCreated'] : '&quot;'+date+'&quot;^^xsd&colon;date .',
				[vide+'_0'+count+' schema&colon;isPartOf '] : vide+' .',
				[vide+'_0'+count+' schema&colon;headline'] : '&quot;'+schemaHeadlineDe+'&quot;&commat;de&comma; &quot;'+schemaHeadlineEn+'&quot;&commat;en .',							
				[vide+'_0'+count+' schema&colon;url'] : '&quot;http&colon;//univera.de/FHB/fbwTube/?id='+videName+'&amp;chapter='+count+'&quot; .',
				[vide+'_0'+count+' schema&colon;creator'] : 'vide&colon;'+creatorName+' .',
				[vide+'_0'+count+' schema&colon;duration'] : '&quot;PT'+minutesWithoutZero+'M'+seconds+'S'+'&quot; .'
			});
		Object.assign(rdfPrefix, obj);
	}
	
	//ADD NEW LECTURER	
	var addNewLecturer = $('form#jsonDataFom').find('[id^="formGroupExampleInputNew"]');
	
	if(addNewLecturer.length !== 0){
		var newLecturerObject = {};
		var lecturerCount = $('form#jsonDataFom').find('[name^="lecturerName"]');
		for(var i=1; i <= lecturerCount.length; i++) {
			var name = $('[name="lecturerName'+i+'"]').val();
			var nachname = $('[name="lecturerNachname'+i+'"]').val();
			var nameWithoutSpaces = name.replace(/\s+/g,'')
			var nachnameWithoutSpaces = nachname.replace(/\s+/g,'')
			var rdfName = nameWithoutSpaces + nachnameWithoutSpaces;
			var label = $('[name="lecturerLabel'+i+'"]').val();
			var email = $('[name="lecturerEmail'+i+'"]').val();
			var rdfLabel =  null;
			var lecturerType = $('#lecturerType').val();
			
			if(label.includes('Prof.') || label.includes('Prof. Dr.') || label.includes('Dr.')){
				rdfLabel = label+' '+name+' '+nachname;
			}else{
				rdfLabel = name+' '+nachname+', '+label;
			}
			
			
			Object.assign(newLecturerObject, {
				['vide&colon;'+rdfName] : 'a vidp&colon;'+lecturerType+'&semi;',
				['rdfs&colon;label '+'&quot;'+rdfLabel+'&quot;'] : '&semi;',
				['schema&colon;familyName '+'&quot;'+name+'&quot;'] : '&semi;',
				['schema&colon;givenName '+'&quot;'+nachname+'&quot;'] : '&semi;',
				['schema&colon;name '+'&quot;'+name+' '+nachname+'&quot;'] : '&semi;',
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

function addModalLogin() {
	var modalFade = document.createElement('div');
	modalFade.id = 'modalLoginForm';	
	modalFade.classList.add('modal', 'fade');
	modalFade.setAttribute('role', 'dialog');
	modalFade.setAttribute('aria-hidden', 'true');	

	var modalDialog = document.createElement('div');
	modalDialog.classList.add('modal-dialog');
	modalFade.appendChild(modalDialog);              

	var modalContent = document.createElement('div');
	modalContent.classList.add('modal-content');
	modalDialog.appendChild(modalContent);

	var modalHeader = document.createElement('div');
	modalHeader.classList.add('modal-header', 'text-center');
	modalContent.appendChild(modalHeader);
	
	var headerTitle = document.createElement('H4');
	headerTitle.classList.add('modal-title', 'w-100', 'font-weight-bold');
	modalHeader.appendChild(headerTitle);

	var modalButtonDismiss = document.createElement('button');
	modalButtonDismiss.classList.add('close');
	modalButtonDismiss.setAttribute('data-dismiss', 'modal');
	modalButtonDismiss.setAttribute('type', 'button');
	modalButtonDismiss.setAttribute('aria-label', 'Close');
	modalHeader.appendChild(modalButtonDismiss);
	
	var modalButtonDismissSpan = document.createElement('span');
	modalButtonDismissSpan.setAttribute('aria-hidden', 'true');
	modalButtonDismissSpan.innerHTML = '&times;';
	modalButtonDismiss.appendChild(modalButtonDismissSpan);

	var modalBody = document.createElement('div');
	modalBody.classList.add('modal-body', 'mx-3');
	modalContent.appendChild(modalBody);

	var usernameDiv = document.createElement('div');
	usernameDiv.classList.add('md-form');
	modalBody.appendChild(usernameDiv);
	
	var usernameIcon = document.createElement('i');
	usernameIcon.classList.add('fas', 'fa-user', 'prefix');
	usernameDiv.appendChild(usernameIcon);
	
	var usernameInput = document.createElement('input');
	usernameInput.classList.add('form-control');
	usernameInput.setAttribute('type', 'text');
	usernameInput.setAttribute('name', 'username');
	usernameInput.id = 'inputUsername';
	usernameDiv.appendChild(usernameInput);
	
	var usernameLabel = document.createElement('label');
	usernameLabel.setAttribute('for', 'inputUsername');
	usernameLabel.innerHTML = 'Username';
	usernameDiv.appendChild(usernameLabel);
	
	var passwordDiv = document.createElement('div');
	passwordDiv.classList.add('md-form');
	modalBody.appendChild(passwordDiv);
	
	var passwordIcon = document.createElement('i');
	passwordIcon.classList.add('fas', 'fa-lock', 'prefix');
	passwordDiv.appendChild(passwordIcon);
	
	var passwordInput = document.createElement('input');
	passwordInput.classList.add('form-control', 'validate');
	passwordInput.setAttribute('type', 'password');
	passwordInput.setAttribute('name', 'password');
	passwordInput.id = 'inputPassword';
	passwordDiv.appendChild(passwordInput);
	
	var passwordLabel = document.createElement('label');
	passwordLabel.setAttribute('for', 'inputPassword');
	passwordLabel.innerHTML = 'Password';
	passwordLabel.setAttribute('data-error', 'wrong');
	passwordLabel.setAttribute('data-success', 'right');
	passwordDiv.appendChild(passwordLabel);
	
	var modalFooter =  document.createElement('div');
	modalFooter.classList.add('modal-footer', 'd-flex', 'justify-content-center');
	modalContent.appendChild(modalFooter);

	var loginButton = document.createElement('button');
	loginButton.classList.add('btn', 'btn-danger');
	loginButton.id = 'login';
	loginButton.innerHTML = 'Login';
	modalFooter.appendChild(loginButton);

	document.getElementsByTagName('body')[0].appendChild(modalFade);
	$(modalFade).modal('show');
}
