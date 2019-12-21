'use strict';

//ON DOCUMENT READY
$(function() {
	//Tooltips initialisation
	$('[data-toggle="tooltip"]').tooltip();
	
	//Weiter Button
	$('#weiter').on('click', function(){$('#rdf-tab-link').trigger('click');});
	$('.multiple-lecture-name').select2();
	var sparqlQuery = null;
	$('#hochladen').on('click', function(){
		addModalLogin();
	});
	
	//Datatimepicker initialisation
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
	  var thumbnailQuery = "SELECT * WHERE { ?thumbnail a <https://schema.org/ImageObject> .}";
	  var allPersonQuery = "SELECT ?link ?label FROM <http://fbwsvcdev.fh-brandenburg.de/OntoWiki/test/> WHERE { ?link <http://www.w3.org/2000/01/rdf-schema%23label> ?label . ?link <http://www.w3.org/1999/02/22-rdf-syntax-ns%23type> ?type . ?type <http://www.w3.org/2000/01/rdf-schema%23subClassOf> <https://schema.org/Person> . }";

	  
	  
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
		  url: 'http://fbwsvcdev.fh-brandenburg.de/OntoWiki/sparql?query=' + thumbnailQuery,
		  cache: false,
		  dataType: 'json', 
		  success: function(successData) {
			var bildLogoList = $('#bildLogoList');
			bildLogoList.empty();

			$.each(successData.results.bindings, function( index, value) {
				var optionForm = document.createElement('option');
				optionForm.value = value.thumbnail.value.split('#')[1];
				optionForm.innerHTML = value.thumbnail.value.split('#')[1];
				bildLogoList.append(optionForm);
			});
		  },
		  error: function(errorText) {
			 console.log( errorText );
			 addWarningAlert();
		  }
	  });
	  $.ajax({
		  type: "POST",
		  url: 'http://fbwsvcdev.fh-brandenburg.de/OntoWiki/sparql?query=' + allPersonQuery,
		  cache: false,
		  dataType: 'json', 
		  success: function(successData) {
			console.log(successData);
			
			
			//var sprecher = $('#sprecher');

			//$.each(successData.results.bindings, function( index, value) {
				//var optionForm = document.createElement('option');
				//optionForm.value = value.person.value.split('#')[1];
				//optionForm.innerHTML = value.person.value.split('#')[1];
				//sprecher.append(optionForm);
			//});
		  //sprecher.trigger('focusin');
		  },
		  error: function(errorText) {
			 console.log( errorText );
			 addWarningAlert();
		  }
	  });
	 
	//Remove inserted Element
	$(document).on('click', '[data-remove="delete-element"]', function(){
		var closestCard = $(this).closest('.json-card');
		if(closestCard.length !== 0) {
			var removeElementNumber = parseInt($(this).closest('.json-card').find('.form-control')[0].id.match(/\d+/)[0]);
			$('[name="schemaHeadlineDe'+(removeElementNumber+1)+'"]').closest('.md-form').remove();
			$('[name="schemaHeadlineEn'+(removeElementNumber+1)+'"]').closest('.md-form').remove();
			
			closestCard.remove();
			
			var lecturerName = $('[name^="lecturerName"]');
			var lecturerNachname = $('[name^="lecturerNachname"]');
			var lecturerLabel = $('[name^="lecturerLabel"]');
			var lecturerEmail = $('[name^="lecturerEmail"]');
			if(lecturerName.length !== 0) {				
				for(var i=0; i < lecturerName.length; i++){
					//Change Name for JSON
					lecturerName[i].name = 'lecturerName'+(i+1);
					lecturerNachname[i].name = 'lecturerNachname'+(i+1);
					lecturerLabel[i].name = 'lecturerLabel'+(i+1);
					lecturerEmail[i].name = 'lecturerEmail'+(i+1);
				}
			}
			
			var chaptersClip = $('[id^="titleClip"]');
			var speakerClip = $('[id^="speakerClip"]');
			var screencastClip = $('[id^="screencastClip"]');
			var schemaDuration = $('[id^="schemaDuration"]');
			
			for(var i=0; i < chaptersClip.length; i++){
				//Change ID for JSON
				chaptersClip[i].id = 'titleClip'+i;
				speakerClip[i].id = 'speakerClip'+i;
				screencastClip[i].id = 'screencastClip'+i;
				schemaDuration[i].id = 'schemaDuration'+i;
				
				//Change Name for JSON
				chaptersClip[i].name = 'courses[0][chapters]['+i+'][title]';
				speakerClip[i].name = 'courses[0][chapters]['+i+'][videos][url_teacher]';
				screencastClip[i].name = 'courses[0][chapters]['+i+'][videos][url_presentation]';
			}


		}else{
			$(this).closest('.rdf-card').children().not(':nth-child(2)').remove();			
		}
		$('.form-control').trigger('input');
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
	$(document).on('input', 'form#jsonDataFom', function(){
		var formDataToObjekt = $(this).serializeObject();
		
		//Add Lecture Name to RDF
		var videoLecture = $('[name="videoLecture"]');
		videoLecture.val($('#lectureShortcuts').val());
		videoLecture.trigger('focusin');
		
		//Add Lecture Title to RDF
		var titleVorlesungDe = $('[name="schemaHeadlineDe"]');
		var titleVorlesungEn = $('[name="schemaHeadlineEn"]');
		titleVorlesungDe.val($('#titelVorlesung').val());
		titleVorlesungEn.val($('#titelVorlesung').val());
		titleVorlesungDe.trigger('focusin');
		titleVorlesungEn.trigger('focusin');
		
		//Add Clip Title to RDF
		var titleClipNumber = $('#json [id^=titleClip]').length;
		for(var i=0; i < titleClipNumber; i++) {
			$('[name="schemaHeadlineDe'+(i+1)+'"]').val($('#titleClip'+i).val());
			$('[name="schemaHeadlineEn'+(i+1)+'"]').val($('#titleClip'+i).val());
			$('[name="schemaHeadlineDe'+(i+1)+'"]').trigger('focusin');
			$('[name="schemaHeadlineEn'+(i+1)+'"]').trigger('focusin');
		}

		if(formDataToObjekt.states !== undefined){
			formDataToObjekt.courses[0].lecturer = formDataToObjekt.states.join(', ');
			delete formDataToObjekt.states
		}
		
		//ADD VIMEO LINK
		for(var i = 0; i < formDataToObjekt.courses[0].chapters.length; i++){
			formDataToObjekt.courses[0].chapters[i].videos.url_teacher = 'www.vimeo.com/' + formDataToObjekt.courses[0].chapters[i].videos.url_teacher;
			formDataToObjekt.courses[0].chapters[i].videos.url_presentation = 'www.vimeo.com/' + formDataToObjekt.courses[0].chapters[i].videos.url_presentation;
		}
		
		//ADDING NEW LECTURER TO JSON
		var newLecturer = $(this).find('[id^="formGroupExampleInputNew"]');
		if(newLecturer.length !== 0){
			var newLecturersNames = [];
			$.each($('[name^="lecturerLabe"][id^="formGroupExampleInputNew"]'), function( index, value) {
				newLecturersNames.push(value.value);
			});
			//ADD Name to JSON-View
			$.each($('[name^="lecturerName"][id^="formGroupExampleInputNew"]'), function( index, value) {				
				if(value.value){					
					if(newLecturersNames[index].includes('Prof.') || newLecturersNames[index].includes('Prof. Dr.') || newLecturersNames[index].includes('Dr.')){						
						newLecturersNames[index] = newLecturersNames[index] + ' ' + value.value;						
					}else{
						if(newLecturersNames[index].includes(',')){
							newLecturersNames[index] = value.value + ' ' + newLecturersNames[index];
						}else{
							newLecturersNames[index] = value.value + ', ' + newLecturersNames[index];
						}						
					}
				}
			});
			//ADD Familiename to JSON-View
			$.each($('[name^="lecturerNachname"][id^="formGroupExampleInputNew"]'), function( index, value) {
				if(value.value){
					if(newLecturersNames[index].includes('Prof.') || newLecturersNames[index].includes('Prof. Dr.') || newLecturersNames[index].includes('Dr.')){						
						newLecturersNames[index] = newLecturersNames[index] + ' ' + value.value;						
					}else{
						if(newLecturersNames[index].includes(',')){
							newLecturersNames[index] = newLecturersNames[index].split(',')[0]+' '+value.value+','+newLecturersNames[index].split(',')[1];
						}else{
							newLecturersNames[index] = value.value + ', ' + newLecturersNames[index];
						}		
					}
				}
			});
			//ADD Email to JSON-View
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
	//var chapter = 0;
	$('#addChapters').on('click', function(){
		var chapter = $('[id^="titleClip"]').length;
		
		var jsonCard = document.createElement('div');
		
		var divFormTrash = document.createElement('div');
		var deleteTrashButton = document.createElement('button');
		var deleteTrashIcon =  document.createElement('span');
		
		var divForm = document.createElement('div');
		var inputForm = document.createElement('input');
		var labelForm =  document.createElement('label');
		
		var divFormUrlTeacher = document.createElement('div');
		var inputFormUrlTeacher = document.createElement('input');
		var labelFormUrlTeacher =  document.createElement('label');
		
		var divFormUrlPresentation = document.createElement('div');
		var inputFormUrlPresentation = document.createElement('input');
		var labelFormUrlPresentation =  document.createElement('label');
		
		var divFormDuration = document.createElement('div');
		var inputFormDuration = document.createElement('input');
		var labelFormDuration =  document.createElement('label');
		
		var titleClipNumber = $('#json [id^=titleClip]').length;
		
		jsonCard.classList.add('json-card');
		
		divFormTrash.classList.add('md-form', 'input-border', 'm-0', 'd-flex', 'justify-content-end');	
		deleteTrashButton.classList.add('btn', 'mt-2', 'mb-2', 'p-0', 'shadow-none');
		deleteTrashButton.setAttribute('type', 'button');
		deleteTrashButton.setAttribute('title', 'löschen');		
		deleteTrashIcon.classList.add('fas', 'fa-trash', 'fa-1p3x');
		deleteTrashButton.dataset.remove = 'delete-element';
		deleteTrashButton.appendChild(deleteTrashIcon);
		divFormTrash.appendChild(deleteTrashButton);
		
		divForm.classList.add('md-form');
		inputForm.classList.add('form-control');
		inputForm.setAttribute('type', 'text');
		inputForm.setAttribute('name', 'courses[0][chapters]['+chapter+'][title]');
		inputForm.id = 'titleClip'+(titleClipNumber);
		labelForm.setAttribute('for', 'titleClip'+(titleClipNumber));
		labelForm.innerHTML = 'Titel des Clips';
		
		divForm.appendChild(inputForm);
		divForm.appendChild(labelForm);
		
		divFormUrlTeacher.classList.add('md-form');
		inputFormUrlTeacher.classList.add('form-control');
		inputFormUrlTeacher.setAttribute('type', 'text');
		inputFormUrlTeacher.setAttribute('name', 'courses[0][chapters]['+chapter+'][videos][url_teacher]');
		inputFormUrlTeacher.id = 'speakerClip'+chapter;
		labelFormUrlTeacher.setAttribute('for', 'speakerClip'+chapter);
		labelFormUrlTeacher.innerHTML = 'Vimeo ID Sprecher';
		
		divFormUrlTeacher.appendChild(inputFormUrlTeacher);
		divFormUrlTeacher.appendChild(labelFormUrlTeacher);
		
		divFormUrlPresentation.classList.add('md-form');
		inputFormUrlPresentation.classList.add('form-control');
		inputFormUrlPresentation.setAttribute('type', 'text');
		inputFormUrlPresentation.setAttribute('name', 'courses[0][chapters]['+chapter+'][videos][url_presentation]');
		inputFormUrlPresentation.id = 'screencastClip'+chapter;
		labelFormUrlPresentation.setAttribute('for', 'screencastClip'+chapter);
		labelFormUrlPresentation.innerHTML = 'Vimeo ID Screencast';
		
		divFormDuration.classList.add('md-form');
		inputFormDuration.classList.add('form-control', 'for-datetime');
		inputFormDuration.setAttribute('type', 'text');
		inputFormDuration.id = 'schemaDuration'+chapter;
		labelFormDuration.setAttribute('for', 'schemaDuration'+chapter);
		labelFormDuration.innerHTML = 'Laufzeit des Clips';	
		divFormDuration.appendChild(inputFormDuration);
		divFormDuration.appendChild(labelFormDuration);
		
		divFormUrlPresentation.appendChild(inputFormUrlPresentation);
		divFormUrlPresentation.appendChild(labelFormUrlPresentation);
		divFormUrlPresentation.append(divFormDuration);
		
		jsonCard.appendChild(divFormTrash);
		jsonCard.appendChild(divForm);
		jsonCard.appendChild(divFormUrlTeacher);
		jsonCard.appendChild(divFormUrlPresentation);
		jsonCard.appendChild(divFormDuration);
		$(jsonCard).insertBefore(this);
			
		
		//ADD INPUP CHAPTERS IN RDF
		if(chapter > 0) {
			var divFormHeadlineDe = document.createElement('div');
			var inputFormHeadlineDe = document.createElement('input');
			var labelFormHeadlineDe =  document.createElement('label');
			var divFormHeadlineEn = document.createElement('div');
			var inputFormHeadlineEn = document.createElement('input');
			var labelFormHeadlineEn =  document.createElement('label');
			
			var inputIdNumber = $('#rdf [id^=formRdfGroupExampleInput]').length;		
			
			divFormHeadlineDe.classList.add('md-form');
			inputFormHeadlineDe.classList.add('form-control');
			inputFormHeadlineDe.setAttribute('type', 'text');
			inputFormHeadlineDe.setAttribute('name', 'schemaHeadlineDe'+(chapter+1)+'');
			inputFormHeadlineDe.id = 'formRdfGroupExampleInput'+(inputIdNumber+3);
			labelFormHeadlineDe.setAttribute('for', 'formRdfGroupExampleInput'+(inputIdNumber+3));
			labelFormHeadlineDe.innerHTML = 'Titel des Clips (de)';	
			divFormHeadlineDe.appendChild(inputFormHeadlineDe);
			divFormHeadlineDe.appendChild(labelFormHeadlineDe);
			
			divFormHeadlineEn.classList.add('md-form');
			inputFormHeadlineEn.classList.add('form-control');
			inputFormHeadlineEn.setAttribute('type', 'text');
			inputFormHeadlineEn.setAttribute('name', 'schemaHeadlineEn'+(chapter+1)+'');
			inputFormHeadlineEn.id = 'formRdfGroupExampleInput'+(inputIdNumber+4);
			labelFormHeadlineEn.setAttribute('for', 'formRdfGroupExampleInput'+(inputIdNumber+4));
			labelFormHeadlineEn.innerHTML = 'Titel des Clips (en)';	
			divFormHeadlineEn.appendChild(inputFormHeadlineEn);
			divFormHeadlineEn.appendChild(labelFormHeadlineEn);
			
			var formDataRdf = $('form#rdfDataForm .rdf-card:last-child');
			
			formDataRdf.append(divFormHeadlineDe);
			formDataRdf.append(divFormHeadlineEn);			

		}
	});
	//ADD NEW LECTURER
	var lecturerNumber = null;
	$('#addLecturer').on('click', function(){
		++lecturerNumber;
	
		var jsonCard = document.createElement('div');
		
		var divFormTrash = document.createElement('div');
		var deleteTrashButton = document.createElement('button');
		var deleteTrashIcon =  document.createElement('span');
		
		var inputIdNumber = $('#json [id^=formGroupExampleInput]').length;			
		var divForm = document.createElement('div');
		var inputForm = document.createElement('input');
		var labelForm =  document.createElement('label');
		
		var divFormTitle = document.createElement('div');
		var selectFormTitle = document.createElement('select');
		var prefixArray = ['Prof.', 'Prof. Dr.', 'Dr.', 'B.Sc.', 'B.A.', 'M.Sc.'];
		var labelFormTitle =  document.createElement('label');
		
		var divFormEmail = document.createElement('div');
		var inputFormEmail = document.createElement('input');
		var labelFormEmail =  document.createElement('label');
		
		var divFormNachname = document.createElement('div');
		var inputFormNachname = document.createElement('input');
		var labelFormNachname =  document.createElement('label');
		
		jsonCard.classList.add('json-card');
		
		divFormTrash.classList.add('md-form', 'input-border', 'm-0', 'd-flex', 'justify-content-end');	
		deleteTrashButton.classList.add('btn', 'mt-2', 'mb-2', 'p-0', 'shadow-none');
		deleteTrashButton.setAttribute('type', 'button');
		deleteTrashButton.setAttribute('title', 'löschen');
		deleteTrashIcon.classList.add('fas', 'fa-trash', 'fa-1p3x');
		deleteTrashButton.dataset.remove = 'delete-element';
		deleteTrashButton.appendChild(deleteTrashIcon);
		divFormTrash.appendChild(deleteTrashButton);
		
		divForm.classList.add('md-form');
		inputForm.classList.add('form-control');
		inputForm.setAttribute('type', 'text');
		inputForm.setAttribute('name', 'lecturerName'+lecturerNumber);
		inputForm.id = 'formGroupExampleInputNew'+(inputIdNumber+1);
		labelForm.setAttribute('for', 'formGroupExampleInputNew'+(inputIdNumber+1));
		labelForm.innerHTML = 'Vorname';
		divForm.appendChild(inputForm);
		divForm.appendChild(labelForm);
		
		divFormTitle.classList.add('md-form');
		selectFormTitle.classList.add('form-control');
		selectFormTitle.setAttribute('type', 'text');
		selectFormTitle.setAttribute('name', 'lecturerLabel'+lecturerNumber);
		selectFormTitle.id = 'formGroupExampleInputNew'+(inputIdNumber+2);
		labelFormTitle.setAttribute('for', 'formGroupExampleInputNew'+(inputIdNumber+2));
		labelFormTitle.innerHTML = 'Titel';
		divFormTitle.appendChild(selectFormTitle);
		divFormTitle.appendChild(labelFormTitle);
		//Create and append the options
		for (var i = 0; i < prefixArray.length; i++) {
			var option = document.createElement('option');
			option.value = prefixArray[i];
			option.text = prefixArray[i];
			selectFormTitle.appendChild(option);
		}
		
		divFormEmail.classList.add('md-form');
		inputFormEmail.classList.add('form-control');
		inputFormEmail.setAttribute('type', 'text');
		inputFormEmail.setAttribute('name', 'lecturerEmail'+lecturerNumber);
		inputFormEmail.id = 'formGroupExampleInputNew'+(inputIdNumber+3);
		labelFormEmail.setAttribute('for', 'formGroupExampleInputNew'+(inputIdNumber+3));
		labelFormEmail.innerHTML = 'E-Mail';
		divFormEmail.appendChild(inputFormEmail);
		divFormEmail.appendChild(labelFormEmail);
		
		divFormNachname.classList.add('md-form');
		inputFormNachname.classList.add('form-control');
		inputFormNachname.setAttribute('type', 'text');
		inputFormNachname.setAttribute('name', 'lecturerNachname'+lecturerNumber);
		inputFormNachname.id = 'formGroupExampleInputNew'+(inputIdNumber+4);
		labelFormNachname.setAttribute('for', 'formGroupExampleInputNew'+(inputIdNumber+4));
		labelFormNachname.innerHTML = 'Nachname';
		divFormNachname.appendChild(inputFormNachname);
		divFormNachname.appendChild(labelFormNachname);
		
		var schemaCreator = $('[name^="schemaCreator"]');
		
		for (var i = 0; i < schemaCreator.length; i++) {
			var option = document.createElement('option');
			option.id = 'newAddedLecturer'+i;
			schemaCreator[i].appendChild(option);
		}
		
		jsonCard.appendChild(divFormTrash);
		jsonCard.appendChild(divForm);
		jsonCard.appendChild(divFormNachname);
		jsonCard.appendChild(divFormTitle);		
		jsonCard.appendChild(divFormEmail);
		$(jsonCard).insertBefore(this);
		$(selectFormTitle).trigger('focusin');
	});
	//ADD NEW FOTO
	$('#addFoto').on('click', function(){
		if($('#newFotoIdentifier').length === 0) {
			var divFormIdentifier = document.createElement('div');
			var inputFormIdentifier = document.createElement('input');
			var labelFormIdentifier =  document.createElement('label');
			
			var divFormTrash = document.createElement('div');
			var deleteTrashButton = document.createElement('button');
			var deleteTrashIcon =  document.createElement('span');
			
			divFormIdentifier.classList.add('md-form');
			inputFormIdentifier.classList.add('form-control');
			inputFormIdentifier.setAttribute('type', 'text');
			inputFormIdentifier.setAttribute('name', 'schemaThumbnailIdentifier');
			inputFormIdentifier.id = 'newFotoIdentifier';
			labelFormIdentifier.setAttribute('for', 'newFotoIdentifier');
			labelFormIdentifier.innerHTML = 'Google-Drive ID';
			divFormIdentifier.appendChild(inputFormIdentifier);
			divFormIdentifier.appendChild(labelFormIdentifier);
			
			divFormTrash.classList.add('md-form', 'input-border', 'm-0', 'd-flex', 'justify-content-end');	
			deleteTrashButton.classList.add('btn', 'mt-2', 'mb-2', 'p-0', 'shadow-none');
			deleteTrashButton.setAttribute('type', 'button');
			deleteTrashButton.setAttribute('title', 'löschen');
			deleteTrashIcon.classList.add('fas', 'fa-trash', 'fa-1p3x');
			deleteTrashButton.dataset.remove = 'delete-element';
			deleteTrashButton.appendChild(deleteTrashIcon);
			divFormTrash.appendChild(deleteTrashButton);
			
			var toAppend = $(this).prev();
			
			$(toAppend).prepend(divFormTrash);
			$(toAppend).append(divFormIdentifier);
		}
	});
	//ADD NEW Lecture Series
	$('#addLectureSeries').on('click', function(){
		if($('#newVdipLectureSeriesDe').length === 0) {
			var divFormTrash = document.createElement('div');
			var deleteTrashButton = document.createElement('button');
			var deleteTrashIcon =  document.createElement('span');
			
			var divFormLectureNameSeriesDe = document.createElement('div');
			var inputFormLectureNameSeriesDe = document.createElement('input');
			var labelFormLectureNameSeriesDe =  document.createElement('label');
			
			var divFormLectureNameSeriesEn = document.createElement('div');
			var inputFormLectureNameSeriesEn = document.createElement('input');
			var labelFormLectureNameSeriesEn =  document.createElement('label');
			
			divFormLectureNameSeriesDe.classList.add('md-form');
			inputFormLectureNameSeriesDe.classList.add('form-control');
			inputFormLectureNameSeriesDe.setAttribute('type', 'text');
			inputFormLectureNameSeriesDe.setAttribute('name', 'vdipLectureSeriesDe');
			inputFormLectureNameSeriesDe.id = 'newVdipLectureSeriesDe';
			labelFormLectureNameSeriesDe.setAttribute('for', 'newVdipLectureSeriesDe');
			labelFormLectureNameSeriesDe.innerHTML = 'Bezeichnung der Vorlesungsreihe (de)';
			divFormLectureNameSeriesDe.appendChild(inputFormLectureNameSeriesDe);
			divFormLectureNameSeriesDe.appendChild(labelFormLectureNameSeriesDe);
			
			divFormLectureNameSeriesEn.classList.add('md-form');
			inputFormLectureNameSeriesEn.classList.add('form-control');
			inputFormLectureNameSeriesEn.setAttribute('type', 'text');
			inputFormLectureNameSeriesEn.setAttribute('name', 'vdipLectureSeriesEn');
			inputFormLectureNameSeriesEn.id = 'newVdipLectureSeriesEn';
			labelFormLectureNameSeriesEn.setAttribute('for', 'newVdipLectureSeriesEn');
			labelFormLectureNameSeriesEn.innerHTML = 'Bezeichnung der Vorlesungsreihe (en)';
			divFormLectureNameSeriesEn.appendChild(inputFormLectureNameSeriesEn);
			divFormLectureNameSeriesEn.appendChild(labelFormLectureNameSeriesEn);
			
			divFormTrash.classList.add('md-form', 'input-border', 'm-0', 'd-flex', 'justify-content-end');	
			deleteTrashButton.classList.add('btn', 'mt-2', 'mb-2', 'p-0', 'shadow-none');
			deleteTrashButton.setAttribute('type', 'button');
			deleteTrashButton.setAttribute('title', 'löschen');
			deleteTrashIcon.classList.add('fas', 'fa-trash', 'fa-1p3x');
			deleteTrashButton.dataset.remove = 'delete-element';
			deleteTrashButton.appendChild(deleteTrashIcon);
			divFormTrash.appendChild(deleteTrashButton);
			
			var toAppend = $(this).prev();
			
			$(toAppend).prepend(divFormTrash);
			$(toAppend).append(divFormLectureNameSeriesDe);
			$(toAppend).append(divFormLectureNameSeriesEn);
		}
	});
	//ADD NEW MODULE
	$('#addModule').on('click', function(){
		if($('#moduleUrl').length === 0) {			
			var divFormTrash = document.createElement('div');
			var deleteTrashButton = document.createElement('button');
			var deleteTrashIcon =  document.createElement('span');
			
			var divFormModuleNameDe = document.createElement('div');
			var inputFormModuleNameDe  = document.createElement('input');
			var labelFormModuleNameDe  =  document.createElement('label');
			
			var divFormModuleNameEn = document.createElement('div');
			var inputFormModuleNameEn  = document.createElement('input');
			var labelFormModuleNameEn  =  document.createElement('label');
			
			var divFormCourseOfStudies = document.createElement('div');
			var selectFormCourseOfStudies = document.createElement('select');
			var courseOfStudiesArray = ['Bachelor Wirtschaftsinformatik', 'Master Wirtschaftsinformatik', 'Bachelor Betriebswirtschaftslehre','Master Betriebswirtschaftslehre'];
			var courseOfStudiesValueArray = ['WIB', 'WIM', 'BWLB', 'BWLM'];
			var labelFormCourseOfStudies =  document.createElement('label');
			
			var divFormModuleUrl = document.createElement('div');
			var inputFormModuleUrl  = document.createElement('input');
			var labelFormModuleUrl  =  document.createElement('label');
			
			divFormModuleNameDe.classList.add('md-form');
			inputFormModuleNameDe.classList.add('form-control');
			inputFormModuleNameDe.setAttribute('type', 'text');
			inputFormModuleNameDe.setAttribute('name', 'vdipModuleNameDe');
			inputFormModuleNameDe.id = 'newVdipModuleNameDe';
			labelFormModuleNameDe.setAttribute('for', 'newVdipModuleNameDe');
			labelFormModuleNameDe.innerHTML = 'Bezeichnung des Moduls (de)';
			divFormModuleNameDe.appendChild(inputFormModuleNameDe);
			divFormModuleNameDe.appendChild(labelFormModuleNameDe);
			
			divFormModuleNameEn.classList.add('md-form');
			inputFormModuleNameEn.classList.add('form-control');
			inputFormModuleNameEn.setAttribute('type', 'text');
			inputFormModuleNameEn.setAttribute('name', 'vdipModuleNameEn');
			inputFormModuleNameEn.id = 'newVdipModuleNameEn';
			labelFormModuleNameEn.setAttribute('for', 'newVdipModuleNameEn');
			labelFormModuleNameEn.innerHTML = 'Bezeichnung des Moduls (en)';
			divFormModuleNameEn.appendChild(inputFormModuleNameEn);
			divFormModuleNameEn.appendChild(labelFormModuleNameEn);
			
			divFormCourseOfStudies.classList.add('md-form');
			selectFormCourseOfStudies.classList.add('form-control');
			selectFormCourseOfStudies.setAttribute('type', 'text');
			selectFormCourseOfStudies.id = 'CourseOfStudies';
			labelFormCourseOfStudies.setAttribute('for', 'CourseOfStudies');
			labelFormCourseOfStudies.classList.add('active');
			selectFormCourseOfStudies.setAttribute('name', 'schemaIsPartOfModul');
			labelFormCourseOfStudies.innerHTML = 'Gehört zum Studiengang';
			divFormCourseOfStudies.appendChild(selectFormCourseOfStudies);
			divFormCourseOfStudies.appendChild(labelFormCourseOfStudies);
			//Create and append the options
			for (var i = 0; i < courseOfStudiesValueArray.length; i++) {
				var option = document.createElement('option');
				option.value = courseOfStudiesValueArray[i];
				option.text = courseOfStudiesArray[i];
				selectFormCourseOfStudies.appendChild(option);
			}
			
			divFormModuleUrl.classList.add('md-form');
			inputFormModuleUrl.classList.add('form-control');
			inputFormModuleUrl.setAttribute('type', 'text');
			inputFormModuleUrl.setAttribute('name', 'schemaModuleUrl');
			inputFormModuleUrl.id = 'moduleUrl';
			labelFormModuleUrl.setAttribute('for', 'moduleUrl');
			labelFormModuleUrl.innerHTML = 'Webseite des Moduls';
			divFormModuleUrl.appendChild(inputFormModuleUrl);
			divFormModuleUrl.appendChild(labelFormModuleUrl);
			
			divFormTrash.classList.add('md-form', 'input-border', 'm-0', 'd-flex', 'justify-content-end');	
			deleteTrashButton.classList.add('btn', 'mt-2', 'mb-2', 'p-0', 'shadow-none');
			deleteTrashButton.setAttribute('type', 'button');
			deleteTrashButton.setAttribute('title', 'löschen');
			deleteTrashIcon.classList.add('fas', 'fa-trash', 'fa-1p3x');
			deleteTrashButton.dataset.remove = 'delete-element';
			deleteTrashButton.appendChild(deleteTrashIcon);
			divFormTrash.appendChild(deleteTrashButton);
			
			var toAppend = $(this).prev();
			
			$(toAppend).prepend(divFormTrash);
			$(toAppend).append(divFormModuleNameDe);
			$(toAppend).append(divFormModuleNameEn);
			$(toAppend).append(divFormCourseOfStudies);
			$(toAppend).append(divFormModuleUrl);
		}
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
	$(document).on('input', 'form#rdfDataForm', function(){
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
	var inputDuration = $('[id^="schemaDuratio"]');
	var vide = 'vide&colon;'+formDataToObjekt.videoLecture+'';
	var videName = formDataToObjekt.videoLecture;
	var schemaDescriptionDe = formDataToObjekt.schemaDescriptionDe;
	var schemaDescriptionEn = formDataToObjekt.schemaDescriptionEn;
	var schemaKeywordsDe = formDataToObjekt.schemaKeywordsDe;
	var schemaKeywordsEn = formDataToObjekt.schemaKeywordsEn;
	var schemaHeadlineDeTitle = formDataToObjekt.schemaHeadlineDe;
	var schemaInLanguage = formDataToObjekt.schemaInLanguage;
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var lectureSeriesName = formDataToObjekt.lectureSeriesName.replace( /\s/g, '');
	var lectureSeriesNameWithSpace = formDataToObjekt.lectureSeriesName;
	var moduleName = formDataToObjekt.moduleName;
	var schemaThumbnail = formDataToObjekt["schemaThumbnail"];
	var schemaThumbnailIdentifier = formDataToObjekt["schemaThumbnailIdentifier"];
	var vdipLectureSeriesDe = formDataToObjekt["vdipLectureSeriesDe"];
	var vdipLectureSeriesEn = formDataToObjekt["vdipLectureSeriesEn"];
	var vdipModuleNameDe = formDataToObjekt["vdipModuleNameDe"];
	var vdipModuleNameEn = formDataToObjekt["vdipModuleNameEn"];
	var schemaIsPartOfModul = formDataToObjekt["schemaIsPartOfModul"];
	var schemaModuleUrl = formDataToObjekt["schemaModuleUrl"];
	

	var rdfPrefix = {
			'&commat;prefix rdfs&colon;'   : '&lt;http&colon;//www.w3.org/2000/01/rdf-schema&num;&gt; .',
			'&commat;prefix schema&colon;' : '&lt;https&colon;//schema.org/&gt; .',
			'&commat;prefix vide&colon;'   : '&lt;https&colon;//bmake.th-brandenburg.de/vide&num;&gt; .',
			'&commat;prefix vidp&colon;'   : '&lt;https&colon;//bmake.th-brandenburg.de/vidp&num;&gt; .',
			'&commat;prefix xsd&colon;'   : '&lt;http://www.w3.org/2001/XMLSchema&num;&gt; .',
			'&commat;prefix rdf&colon;'   : '&lt;http&colon;//www.w3.org/1999/02/22-rdf-syntax-ns&num;&gt; .',
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
			var schemaDuration = $('[id="schemaDuration'+i+'"]').val();
			var minutes = schemaDuration.split(':')[0];
			var seconds = ((typeof schemaDuration.split(':')[1] === 'undefined') ? '0' : schemaDuration.split(':')[1]);
			var minutesWithoutZero = ((minutes == '') ? '0' : ((minutes.split('')[0] == '0') ? minutes.split('')[1] : (minutes.split('')[0]+minutes.split('')[1])));
			
			Object.assign(obj, {				
				[vide+' schema&colon;name'] : '&quot;'+videName+'&quot; .',
				[vide+' schema&colon;description'] : '&quot;'+schemaDescriptionDe+'&quot;&commat;de&comma; &quot;'+schemaDescriptionEn+'&quot;&commat;en .',
				[vide+' schema&colon;headline'] : '&quot;'+schemaHeadlineDeTitle+'&quot; .',
				[vide+' schema&colon;inLanguage'] : '&quot;'+schemaInLanguage+'&quot; .',
				[vide+' schema&colon;keywords'] : '&quot;'+schemaKeywordsDe+'&quot;&commat;de&comma; &quot;'+schemaKeywordsEn+'&quot;&commat;en .',
				[vide+' schema&colon;url'] : '&quot;http&colon;//univera.de/FHB/fbwTube/?id='+videName+'&quot; .',
				[vide+' schema&colon;licence'] : '&quot;https&colon;//creativecommons.org/licenses/by-nc-sa/2.0/de/&quot; .'														
			});
			
			if(schemaThumbnail !== "none" && schemaThumbnail.length !== 0) {
				Object.assign(obj, {[vide+' schema&colon;thumbnail'] : 'vide&colon;'+schemaThumbnail+' .'});
			}
			
			Object.assign(obj, {									
				[vide+'_0'+count] : ' a vidp&colon;DoubleClip .',
				[vide+'_0'+count+' rdfs&colon;label'] : '&quot;'+videName+' Clip '+count+'&quot; .',
				[vide+'_0'+count+' schema&colon;name'] : '&quot;'+videName+' Clip '+count+'&quot; .',
				[vide+'_0'+count+' schema&colon;dateCreated'] : '&quot;'+date+'&quot;^^xsd&colon;date .',
				[vide+'_0'+count+' schema&colon;isPartOf '] : vide+' .',
				[vide+'_0'+count+' schema&colon;headline'] : '&quot;'+schemaHeadlineDe+'&quot;&commat;de&comma; &quot;'+schemaHeadlineEn+'&quot;&commat;en .',							
				[vide+'_0'+count+' schema&colon;url'] : '&quot;http&colon;//univera.de/FHB/fbwTube/?id='+videName+'&amp;chapter='+count+'&quot; .',
				[vide+'_0'+count+' schema&colon;duration'] : '&quot;PT'+minutesWithoutZero+'M'+seconds+'S'+'&quot; .'								
			});
			
		
		Object.assign(rdfPrefix, obj);
	}
	
	//ADD NEW FOTO
	if(schemaThumbnailIdentifier !== undefined){
		Object.assign(rdfPrefix, {
				['vide&colon;'+schemaThumbnail] : 'a schema&colon;ImageObject &semi;',
				['schema&colon;identifier &quot;'+schemaThumbnailIdentifier+'&quot;'] : '&semi;',
				['schema&colon;name &quot;'+schemaThumbnail+'.png&quot;'] : '&semi;',
				['schema&colon;url &quot;https&colon;//drive.google.com/open?id='+schemaThumbnailIdentifier+'&quot;'] : '.'				
			});
	}
	
	//ADD NEW Abbreviation for Lecture Series
	if(vdipLectureSeriesDe !== undefined && vdipLectureSeriesEn !== undefined){
		Object.assign(rdfPrefix, {
				['vide&colon;'+lectureSeriesName] : 'a vidp:&colon;LectureSeries &semi;',
				['rdfs&colon;label &quot;'+lectureSeriesNameWithSpace+'&quot;'] : '&semi;',
				['schema&colon;name &quot;'+lectureSeriesNameWithSpace+'&quot;'] : '&semi;',
				['schema&colon;headline &quot;'+vdipLectureSeriesDe+'&quot;&commat;de&comma; &quot;'+vdipLectureSeriesEn+'&quot;&commat;en'] : '.'				
			});
	}
	
	//ADD NEW MODULE
	if(vdipModuleNameDe !== undefined && vdipModuleNameEn !== undefined){
		Object.assign(rdfPrefix, {
				['vide&colon;'+moduleName] : 'a vidp&colon;Module &semi;',
				['rdfs&colon;label &quot;'+vdipModuleNameDe+'&quot;'] : '&semi;',				
				['schema&colon;name &quot;'+vdipModuleNameDe+'&quot;&commat;de&comma; &quot;'+vdipModuleNameEn+'&quot;&commat;en'] : '&semi;',
				['schema&colon;isPartOf vide&colon;'+schemaIsPartOfModul] : '&semi;',
				['schema&colon;url &quot;'+schemaModuleUrl+'&quot;'] : '.'				
			});
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
			
			if(label.includes('Prof.') || label.includes('Prof. Dr.') || label.includes('Dr.')){
				rdfLabel = label+' '+name+' '+nachname;
			}else{
				rdfLabel = name+' '+nachname+', '+label;
			}
			
			Object.assign(newLecturerObject, {
				['vide&colon;'+rdfName] : 'a vidp&colon;Lecturer &semi;',
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
