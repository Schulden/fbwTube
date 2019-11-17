//'use strict';

//ON DOCUMENT READY
$(function() {
	var sparqlQuery = null;
	$('[title="Hochladen"]').on('dblclick', function(){
	  var query =  'http://fbwsvcdev.fh-brandenburg.de/OntoWiki/update?query=INSERT DATA INTO  <http://fbwsvcdev.fh-brandenburg.de/OntoWiki/test/>  {@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema%23> .  <http://fbwsvcdev.fh-brandenburg.de/OntoWiki/test/> rdfs:label "firstSomeTestWithfbwTubeTechCristianCananau".}';
				
	
	  console.log(sparqlQuery);	
	  
	//httpClient.post('http://fbwsvcdev.fh-brandenburg.de/OntoWiki/update?query='+query, '', (xhr) => {});				
					
					
	  $.ajax({
		  type: "POST",
		  url: 'http://fbwsvcdev.fh-brandenburg.de/OntoWiki/update?query=' + query,
		  cache: false,
		  dataType: 'jsonp',
		  crossDomain: true,
		  //xhrFields : {
			//withCredentials : true
		  //},
		  contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
		  //data: {'query' : query},
		  beforeSend: function (xhr) {
			xhr.setRequestHeader('Authorization', makeBaseAuth('fbwTubeTech','fbwTube2019'));
		  },
		  headers: {
			  //'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',fit1701
			  //'Access-Control-Allow-Origin': '*',
			  //'Authorization': makeBaseAuth('fbwTubeTech','fbwTube2019')
		  },
		  success: function(successData) {
			 console.log( successData ); 

		  },
		  error: function(errorText) {
			 console.log( errorText ); 
		  }
	  });
	});
	
	/*$('[title="Hochladen"]').on('click', function(){
	  var query = 'prefix schema: <https://schema.org/> '+
					'prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#> '+
					'prefix owl:   <http://www.w3.org/2002/07/owl#> '+
					'prefix fitness: <http://th-brandenburg.de/ns/kursplanung-fitnessstudio/> '+
					'prefix xsd:   <http://www.w3.org/2001/XMLSchema#> '+
					'prefix vidp:  <https://bmake.th-brandenburg.de/vidp#> '+
					'prefix dcterms: <http://purl.org/dc/terms/> '+
					'prefix skos:  <http://www.w3.org/2004/02/skos/core#> '+
					'prefix voaf:  <http://purl.org/vocommons/voaf#> '+
					'prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> '+
					'prefix vann:  <http://purl.org/vocab/vann/>'+ 
					'prefix wd:    <http://www.wikidata.org/entity/>'+ 
					'prefix dc:    <http://purl.org/dc/elements/1.1/>'+ 
					'INSERT DATA {fitness:TaiChi123  a schema:SportsEvent; rdfs:comment "Try"; schema:dayOfWeek "Montag";schema:name "Tai Chi123"; schema:organizer fitness:CristianCananau ;}';
	  	  
	  $.ajax({
		  type: "POST",
		  url: 'http://fbwsvcdev.fh-brandenburg.de:8080/fuseki/Kursplanung-Fitnesstudio/update',
		  cache: false,
		  data: {"update": query},
		  dataType: 'json', 
		  success: function(successData) {
			 console.log( successData ); 

		  },
		  error: function(errorText) {
			 console.log( errorText ); 
		  }
	  });
	});*/
	
	//SELECT LECTURER FROM KNOLEDGE GRAPH	
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
	//INSERT MAIL LECTURER IN INPUT
	$('[list="lecturerList"]').on('focusout', function(){
		var email = $('option[value="'+this.value+'"]').attr('data-email');
		var input = $('[data-insert="email"]');
		input.trigger('focusin');
		input.val(email);
		input.trigger('input');
	});
	//SHOW DATA ON SCREEN
	$('form#jsonDataFom').on('input', function(){
		//var formData = $(this).serializeArray();
		var formDataToObjekt = $(this).serializeObject();
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
			a.download = 'test.json';

			document.body.appendChild(a);
			a.click();

			document.body.removeChild(a);
		}
	});
	
	//RDF DATA SHOW ON SCREEN
	$('form#rdfDataForm').on('input', function(){
		var formDataToObjekt = $(this).serializeObject();
		var serialisedDataObjekt = JSON.stringify(addRdfPrefix(formDataToObjekt), undefined, 4);
		
		var addColors = serialisedDataObjekt.replace(/[":,{}\\b]/g, "")
											.replace(/@prefix/g, "<span class="+'"key"'+">@prefix</span>")
											.replace(/@de/g, "<span class="+'"key"'+">@de</span>")
											.replace(/@en/g, "<span class="+'"key"'+">@en</span>")
											.replace(/&lt;(.*)&gt;/g, "<span class="+'"null"'+">&lt;$1&gt;</span>")
											.replace(/&quot(.*)&quot/g, "<span class="+'"string"'+">&quot$1&quot</span>");
		
		var pre = document.createElement('pre');
		pre.innerHTML = addColors;
		
		sparqlQuery = serialisedDataObjekt.replace(/[":,\\b]/g, '')
										  .replace('\n','')
										  .replace(/&colon;/g, ':')
										  .replace(/&quot;/g, '"')
										  .replace(/&comma;/g, ',')
										  .replace(/&lt;/g, '<')
										  .replace(/&gt;/g, '>')
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
	
	var rdfPrefix = {
			'@prefix rdfs&colon;'   : '&lt;http&colon;//www.w3.org/2000/01/rdf-schema&num;&gt; .',
			'@prefix schema&colon;' : '&lt;https&colon;//schema.org/&gt; .',
			'@prefix vide&colon;'   : '&lt;https&colon;//bmake.th-brandenburg.de/vide&num;&gt; .',
			'@prefix vidp&colon;'   : '&lt;https&colon;//bmake.th-brandenburg.de/vidp&num;&gt; .',
		}; 
	var obj = {};
	for(i=0; i<inputDuration.length; i++){
		if(i==0){
			obj = {
				[vide+' a '] : 'vidp&colon;VideoLecture .',
				[vide+' rdfs&colon;label'] : '&quot;'+videName+'&quot; .',
				[vide] : ' a vidp&colon;DoubleClip .',
				[vide+' schema&colon;name'] : '&quot;'+videName+'&quot; .',
				[vide+' schema&colon;url'] : '&quot;http&colon;//univera.de/FHB/fbwTube/?id='+videName+'&quot; .',
				[vide+' schema&colon;licence'] : '&quot;https&colon;//creativecommons.org/licenses/by-nc-sa/2.0/de/&quot; .',
				[vide+' schema&colon;description'] : '&quot;'+schemaDescriptionDe+'&quot; @de&comma; &quot;'+schemaDescriptionEn+'&quot; @en .',
				//[vide+' schema&colon;description '] : '&quot;'+schemaDescriptionEn+'&quot; @en .',
				[vide+' schema&colon;keywords'] : '&quot;'+schemaKeywordsDe+'&quot; @de&comma; &quot;'+schemaKeywordsEn+'&quot; @en .',
				//[vide+' schema&colon;keywords '] : '&quot;'+schemaKeywordsEn+'&quot; @en .',
				[vide+' schema&colon;headline'] : '&quot;'+schemaHeadlineDe+'&quot; @de&comma; &quot;'+schemaHeadlineEn+'&quot; @en .',
				[vide+' schema&colon;inLanguage'] : '&quot;'+schemaInLanguage+'&quot; .',
				[vide+' schema&colon;duration'] : '&quot;PT'+schemaDuration0+'&quot; .'
			}
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
				[vide+'_0'+count+' schema&colon;url'] : '&quot;http&colon;//univera.de/FHB/fbwTube/?id='+videName+'&chapter='+count+'&quot; .',
				[vide+'_0'+count+' schema&colon;headline'] : '&quot;'+schemaHeadlineDe+i+'&quot; @de&comma; &quot;'+schemaHeadlineEn+i+'&quot; @en .',
				[vide+'_0'+count+' schema&colon;dateCreated'] : '&quot;'+date+'&quot;^^xsd&colon;date .',
				[vide+'_0'+count+' schema&colon;creator'] : 'vide&colon;VeraMeister .',
				[vide+'_0'+count+' schema&colon;duration'] : '&quot;PT'+schemaDuration+'&quot; .'
			}
		}
		Object.assign(rdfPrefix,obj);
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


var httpClient = {

	get: function( url, data, callback ) {
		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function () {
			var readyState = xhr.readyState;

			if (readyState == 4) {
				callback(xhr);
			}
		};

		var queryString = '';
		if (typeof data === 'object') {
			for (var propertyName in data) {
				queryString += (queryString.length === 0 ? '' : '&') + propertyName + '=' + encodeURIComponent(data[propertyName]);
			}
		}

		if (queryString.length !== 0) {
			url += (url.indexOf('?') === -1 ? '?' : '&') + queryString;
		}

		xhr.open('GET', url, true);
		xhr.withCredentials = true;
		xhr.send(null);
	},

	post: function(url, data, callback ) {
		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function () {
			var readyState = xhr.readyState;

			if (readyState == 4) {
				callback(xhr);
			}
		};

		var queryString='';
		if (typeof data === 'object') {
			for (var propertyName in data) {
				queryString += (queryString.length === 0 ? '' : '&') + propertyName + '=' + encodeURIComponent(data[propertyName]);
			}
		} else {
			queryString=data
		}

		xhr.open('POST', url, true);
		xhr.withCredentials = true;
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send(queryString);
	}
};
	