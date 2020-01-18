# fbwTube

Dieses Projekt hat im Rahmen der Lehrveranstaltung "Enterprise Knowledge Grapg Implementation" im Studiengang Wirtschaftsinformatik (3. Semester) der TH Brandenburg und Betreuung von Fr. Prof. Dr. Vera G. Meister (Auftraggeber) und Fr. Wenxin Hu stattgefunden. Das Projektteam besteht aus: Cristian Cananau, Marcel Cikus, Jennifer Ferle, Shyshlin Juri und Dennis Schulz. Gearbeitet wurde auf Basis von Scrum (eigentständige Pulls von Aufgaben durch das Team).

Ziel des Projektes war es, für die bestehnde Videoplattform "fbwTube" der Hochschule eine neue, vom Auftraggeber vorgegebene Architektur für das Einpflegen von Informationen rund um das zu veröffentlichende Video durch den Bearbeiter zu implementieren. Orientiert wurde sich dabei an: 

![Alt text](/Architektur.PNG?raw=true "Architektur")


Die Herausforderung war dabei, dass auf Basis der Nutzereingaben (Bearbeiter) über ein Web-Formular sowohl ein JSON-File, welches dann über FTB auf den Web-Server gelangt, also auch ein RDF-File, welches mit der Graph-Datenbank OntoWiki syncronisiert wird, erstellt wird. 

Einige wichtige Ressourcen vorab:
- derzeitige Live-Plattform "fbwTube": https://fbwtube.th-brandenburg.de/OntoWiki/fbwTube/Home.html
- zugehöriges OntoWiki (Zugang erforderlich!): http://fbwsvcdev.fh-brandenburg.de/OntoWiki/model/info/?m=http%3A%2F%2Ffbwsvcdev.fh-brandenburg.de%2FOntoWiki%2Ftest%2F
- Prototyp/ Ergebnis des Projektes, webbasiertes Tool für den Bearbeiter von Videos: http://univera.de/fbwTube_Test/tool/index.html
- Scrum-Board: https://trello.com/b/w328rYPt/wpm-meister

## WICHTIGER HINWEIS: Für die Benutzung des Tools ist die aktuelle Version des Internetbrowsers Mozilla FireFox notwendig!

Verwendete Technologien:
- JavaScript
  - jQuery
  - AJAX
- HTML5
- CSS3

## Erläuterung ausgewählter Codes

### Beispiel von Queries
Holen der Daten aus der DB mit jQuery und AJAX:
´
var lectureSeriesQuery = "SELECT ?name WHERE { ?lectureSeries  a <https://bmake.th-brandenburg.de/vidp%23LectureSeries>; <https://schema.org/name>  ?name .};"
´

Hierbei wird eine Variable lectureSeriesQuery erstellt, welche über eine einfache SELECT-Abfrage entsprechende Daten aus der OntoWiki-Datenbank zieht.
```
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
```

Mit hilfe von AJAX wird eine POST-request an den Server ```http://fbwsvcdev.fh-brandenburg.de/OntoWiki/sparql?query= ``` gesendet. Diese Anfrage erwartet einen JSON-Datentyp. Wenn der POST erfolgreich durchgeführt wurde, dann werden die Daten als Option (select) in einem HTML eingefügt. Die Erstellung einer solchen Option wird durch den Befehl ```document.createElement('option')``` realisiert. Der select wird über ```var lectureSeries = $('#lectureSeries')``` deklariert und die option ```lectureSeries.append(optionForm)``` in dem select eingefügt. Wenn der POST nicht funktioniert wird eine Error-Message auf der KOnsole ausgegeben und zusätzlich eine Meldung im HTML genertiert ```addWarningAlert()```. So wird es auch für die anderes queries gemacht (z.B. die personQuery).

### Einfügen eines neuen Chapters
Der folgende Code-Ausschnitt zeigt, wie ein neues Chapter in HTML angelegt werden kann. Dazu wird ein Event angelegt, welches an den Button mit der ID ```addChapter```  gebunden ist. Zunächst werden die Container, Label und Inputs in dem DOM erstellt und als Variablen deklariert, wie beispielsweise ```var jsonCard = document.createElement('div')```. Zu den divs, labels und inputs werden  Klassen angelegt, beispielsweise ```jsonCard.classList.add('json-card')``` und dazu die anderen elemente (z.B.: divs, inputs, labels) beigefügt ```jsonCard.appendChild(divFormTrash)```. Danach werden die Element in der HTML ```$(jsonCard).insertBefore(this)``` eingefügt.


```
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
		labelFormDuration.classList.add('active');
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
		
		//Datatimepicker initialization after append
		$(inputFormDuration).datetimepicker({
			icons:{
				up: 'fa fa-angle-up',
				down: 'fa fa-angle-down'
			},
			format: 'mm:ss',
			defaultDate:moment(new Date()).hours(0).minutes(6).seconds(0).milliseconds(0)
		});
			
		
		//ADD INPUP CHAPTERS IN RDF
		if(chapter > 0) {
			var inputFormHeadlineDe = document.createElement('input');
			
			var inputIdNumber = $('#rdf [id^=formRdfGroupExampleInput]').length;		
			
			inputFormHeadlineDe.classList.add('form-control');
			inputFormHeadlineDe.setAttribute('hidden', '');
			inputFormHeadlineDe.setAttribute('name', 'schemaHeadlineDe'+(chapter+1)+'');
			inputFormHeadlineDe.id = 'formRdfGroupExampleInput'+(inputIdNumber+3);
			
			var formDataRdf = $('form#rdfDataForm');
			
			formDataRdf.append(inputFormHeadlineDe);
		}
	});
```







