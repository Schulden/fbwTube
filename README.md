# fbwTube - Enterprise Knowledge Graph Implementierung

Inhaltsverzeichnis
==============

- 1 Allgemeine Projektinformationen

- 2 Beschreibung der Architektur

- 3 Zugrundeliegendes Wissensschema 

- 4 User Experience Design

	- 4.1 Information Architektur

	- 4.2 Wireframes

	- 4.3 User Flow

	- 4.4 UI-Style-Guide

- 5 Beschreibung ausgewählter Teile des Source-Codes

- 6 Beispielhafter Use Case




1 Allgemeine Projektinformationen
==============


Dieses Projekt hat im Rahmen der Lehrveranstaltung "Enterprise Knowledge Graph Implementation" im Studiengang Wirtschaftsinformatik (3. Semester Master) der TH Brandenburg unter Betreuung von Fr. Prof. Dr. Vera G. Meister (Auftraggeber) und Fr. Wenxin Hu stattgefunden. Das Projektteam besteht aus: Cristian Cananau, Marcel Cikus, Jennifer Ferle, Shyshlin Juri und Dennis Schulz. Gearbeitet wurde auf Basis von Scrum (eigentständige Pulls von Aufgaben durch das Team).

Ziel des Projektes war es, für die bestehende Videoplattform "fbwTube" der Hochschule eine neue, vom Auftraggeber vorgegebene Architektur für das Einpflegen von Informationen rund um das zu veröffentlichende Video durch den Bearbeiter zu implementieren.
WICHTIGER HINWEIS: Für die Benutzung des Tools ist die aktuelle Version des Internetbrowsers Mozilla Firefox notwendig!

### Ressourcen:

- Live-Plattform „fbwTube“: https://fbwtube.th-brandenburg.de/OntoWiki/fbwTube/Home.html

- Entwickeltes Tool: http://univera.de/fbwTube_Test/tool/index.html

- Zugehöriges OntoWiki (Zugang erforderlich!):

- Scrum-Board: https://trello.com/b/w328rYPt/wpm-meister

### Verwendete Technologien:

- JavaScript 
	- jQuery
	- AJAX
- HTML5
- CSS3

2 Beschreibung der Architektur
==========

Auf Basis der Nutzereingaben (Editor) über ein Web-Formular soll sowohl ein JSON-File, welches dann über FTB auf den Web-Server gelangt, also auch ein RDF-File, welches mit der Graph-Datenbank OntoWiki syncronisiert wird, erstellt werden. Im späteren Kapitel zum Source-Code wird aufgezeigt, wie dies technisch umsetzbar ist (verwendbar auch für ähnliche Projekte). Folgende Grafik fasst die Architektur zusammen:

![Alt text](https://github.com/Schulden/fbwTube/blob/master/img/architecture.PNG?raw=true "Architektur")

3 Zugrundeliegendes Wissensschema
========

Folgendes RDF-Schema war die Grundlage, zur Gestaltung des RDF-Formulars. Eines der zentralen Elemente ist der „DoubleClip“: Hierbei geht es um zwei Videos – eines, welches den Sprecher zeigt und ein weiteres, welches die zugehörigen Inhalte (in Form von Folien) zeigt:

![Alt text](https://github.com/Schulden/fbwTube/blob/master/img/schema.PNG?raw=true "Schema")

# 4 User Experience Design 

Dieser Teil der Dokumentation beschreibt das Design der Benutzerinteraktion und enthält Elemente des Interaktionsdesigns, Information Architektur und des User Interface Design unter Berücksichtigung von Methoden wie Human-Centered Design und Human-Computer-Interaction.


## 4.1 Information Architektur

Die horizontale Informationsarchitektur ist so konzipiert, dass die Inhalte des Informationssystems zugänglich für alle Teilnehmer sein wird. Hiermit wird sichergestellt, dass sowohl die Bedürfnisse der Benutzer, als auch der Betreiber so gut wie möglich erfüllt sind. Das System ist einfach und intuitiv zu bedienen. Es bietet eine schnelle und einfache Orientierung. Des Weiteren passt es sich der Zielgruppe an. 

![Alt text](https://github.com/Schulden/fbwTube/blob/master/img/informationArchi.PNG?raw=true "Architektur")

### (IA) Logischer Aufbau: 

Der Zugriff auf die API erfolgt über die Hauptwebsite der fbwTube. Die API hat einen 3-Seiten-Architektur. Jede Seite verfügt über ein Formular zum Ausfüllen des entsprechenden Datenformats (JSON und RDF). Auf jeder Seite gibt es die Möglichkeit, eine Datei zu kopieren, herunterzuladen oder hochzuladen. 

Der Übergang zwischen den Seiten ist hierarchisch angeordnet. Hierbei ist die Startseite eine Seite mit einem JSON-Formular. Das Hochladen von Dateien über Formulare erfolgt schrittweise. Als Startpunkt wird ein JSON-Formular genutzt. Der Endpunkt der Iteration ist das Hochladen von Dateien auf den Server mit der Zwischenseite des RDF-Formulars.


## 4.2 Wireframes

Die Struktur und das Hauptkonzept von dem Interface wurden mit Wireframes entworfen. Jede Seite ist nach einer entwickelten Basis-Vorlage gestaltet.
 
 ![Alt text](https://github.com/Schulden/fbwTube/blob/master/img/UI.PNG?raw=true "UI-Prototyp")
 
### API Interface Struktur

Die API hat die Form einer Webseite mit Dateneingabe-Formularen für die beiden verschiedenen Formate. Das Formular besteht aus zwei Teilen. Rechts sind die Formularfelder, in die alle benötigten Informationen eingetragen werden. Links werden die Daten parallel im ausgewählten Format (JSON oder RDF) angezeigt und zeigen dem User eine Live-Übertragung von den Informationen in rdf. Der Übergang zwischen Seiten verschiedener Formate ist als „Tab-Switcher“ dargestellt und über dem Formularfeld und der Live-Übertragung . Am unteren Rand des Fensters mit dem Code sind 3 Buttons mit folgenden Funktionen: Kopieren des Codes, Hochladen des Codes auf die Website oder Herunterladen als txt.


## 2.3 User Flow

![Alt text](https://github.com/Schulden/fbwTube/blob/master/img/userflow.png?raw=true "UI-Prototyp")

User Flow Beschreibung: 

1)	Der Benutzer hat die Möglichkeit zu wählen - füllen Sie das Formular im JSON Format aus und dann im RDF Format oder sofort im 		RDF aus.
2)	Wenn der Benutzer beschließt, das Formular zuerst im JSON Format auszufüllen, kann er das bereits vorbereitete Formular im JSON-	Format hochladen oder das Formular vom Start ausfüllen.
3)	Dem Benutzer werden zusätzliche Funktionen angeboten: entweder die JSON-Datei zu kopieren oder herunterladen.
4)	Der Benutzer füllt das Formular im RDF-Format aus. Es gibt zwei Möglichkeiten zum Ausfüllen: Die Erste besteht darin, eine Datei 	 im RDF-Format hochzuladen, die Zweite, das Formular selbst auszufüllen.
5)	Nach dem Ausfüllen aller Formulare kann der Benutzer die Datei im RDF-Format herunterladen oder kopieren oder auf dem Server 		übertragen.

## 4.4 UI Style Guide

![Alt text](/img/styleguide.PNG?raw=true "UI-Guide")


5 Beschreibung ausgewählter Teile des Source-Codes
=========
## Source Code

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

### Löschen eines neuen Chapters
Der folgende Code-Ausschnitt zeigt, wie ein Chapter aus HTML gelöscht werden kann. Dazu wird ein Event angelegt, welches an den Button mit dem Data-Atribut ```[data-remove="delete-element"]```  gebunden ist. Zunächst wird überprüft, ob den zu gelöschten Container als von JSON-Formular oder von RDF-Formular zu löschen ist. Dafür wurde die Variable ```closestCard``` deklariert und in einer IF-ELSE-Bedingung verwendet. Der zu löschende Container wird als Variable ```removeElementNumber``` deklariert. Um die Container von DOM zu löschen, wurde die Funktion ```remove()``` verwendet und zwar ```closestCard.remove();```. Um die aktuellen ID's überall zu bekommen, werden bei jedem Löschen des Containers die aktuelle Reihnfolge geändert.


```
$(document).on('click', '[data-remove="delete-element"]', function(){
	var closestCard = $(this).closest('.json-card');
	if(closestCard.length !== 0) {
		var removeElementNumber = parseInt($(this).closest('.json-card').find('.form-control')[0].id.match(/\d+/)[0]);
		$('[name="schemaHeadlineDe'+(removeElementNumber+1)+'"]').closest('.md-form').remove();

		var personNamesSelect = $('[name^="personSelect"]');
		if(personNamesSelect.length !== 0){
			var firstName = closestCard.find('[name^="lecturerName"]').val();
			var lastName = closestCard.find('[name^="lecturerNachname"]').val();
			for(var i=0; i < personNamesSelect.length; i++) {
				$('[name="'+personNamesSelect[i].name+'"] option[value="'+firstName+lastName+'"]').remove();
			}
		}

		//DELETE CARD
		closestCard.remove();

		//ADD actual Number to Lecturers
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

		//ADD actual Number to Clips
		var chaptersClip = $('[id^="titleClip"]');
		var speakerClip = $('[id^="speakerClip"]');
		var screencastClip = $('[id^="screencastClip"]');
		var schemaDuration = $('[id^="schemaDuration"]');
		var labelForTitleId = $('[for^="titleClip"]');
		var labelForSpeakerClipId = $('[for^="speakerClip"]');
		var labelForScreencastClipId = $('[for^="screencastClip"]');
		var labelForSchemaDurationId = $('[for^="schemaDuration"]');			
		for(var i=0; i < chaptersClip.length; i++){
			//Change ID for JSON
			chaptersClip[i].id = 'titleClip'+i;
			speakerClip[i].id = 'speakerClip'+i;
			screencastClip[i].id = 'screencastClip'+i;
			schemaDuration[i].id = 'schemaDuration'+i;

			//Change for Id for Labels
			labelForTitleId[i].setAttribute('for', 'titleClip'+i);
			labelForSpeakerClipId[i].setAttribute('for', 'speakerClip'+i);
			labelForScreencastClipId[i].setAttribute('for', 'screencastClip'+i);
			labelForSchemaDurationId[i].setAttribute('for', 'schemaDuration'+i);				

			//Change Name for JSON
			chaptersClip[i].name = 'courses[0][chapters]['+i+'][title]';
			speakerClip[i].name = 'courses[0][chapters]['+i+'][videos][url_teacher]';
			screencastClip[i].name = 'courses[0][chapters]['+i+'][videos][url_presentation]';
		}			
	}else{
		var colosestCard = $(this).closest('.rdf-card');
		if(colosestCard.children().find('#module').length !==0 || colosestCard.children().find('#bildLogo').length !==0 || colosestCard.children().find('#vorlesungsKurzel').length !==0){
			colosestCard.children().not(':nth-child(2)').remove();				
		}else{
			colosestCard.remove();
		}				
		//ADD actual Number to Moduls
		var vdipModuleTitle = $('[name^="vdipModuleTitle"]');
		var vdipModuleNameDe = $('[name^="vdipModuleNameDe"]');
		var vdipModuleNameEn = $('[name^="vdipModuleNameEn"]');
		var schemaIsPartOfModul = $('[name^="schemaIsPartOfModul"]');
		var schemaModuleUrl = $('[name^="schemaModuleUrl"]');
		var personSelect = $('[name^="personSelect"]');
		var vdipModuleTitleIdFor = $('[for^="vdipModuleTitleId"]');
		var vdipModuleNameDeIdFor = $('[for^="vdipModuleNameDeId"]');
		var vdipModuleNameEnIdFor = $('[for^="vdipModuleNameEnId"]');
		var schemaIsPartOfModulIdFor = $('[for^="schemaIsPartOfModulId"]');
		var schemaModuleUrlIdFor = $('[for^="schemaModuleUrlId"]');
		var personSelectIdFor = $('[for^="personSelectId"]');
		for(var i=0; i < vdipModuleTitle.length; i++){
			//Change ID for JSON
			vdipModuleTitle[i].id = 'vdipModuleTitleId'+i;
			vdipModuleNameDe[i].id = 'vdipModuleNameDeId'+i;
			vdipModuleNameEn[i].id = 'vdipModuleNameEnId'+i;
			schemaIsPartOfModul[i].id = 'schemaIsPartOfModulId'+i;
			schemaModuleUrl[i].id = 'schemaModuleUrlId'+i;
			personSelect[i].id = 'personSelectId'+i;

			//Change for Id for Labels
			vdipModuleTitleIdFor[i].setAttribute('for', 'vdipModuleTitleId'+i);
			vdipModuleNameDeIdFor[i].setAttribute('for', 'vdipModuleNameDeId'+i);
			vdipModuleNameEnIdFor[i].setAttribute('for', 'vdipModuleNameEnId'+i);
			schemaIsPartOfModulIdFor[i].setAttribute('for', 'schemaIsPartOfModulId'+i);
			schemaModuleUrlIdFor[i].setAttribute('for', 'schemaModuleUrlId'+i);
			personSelectIdFor[i].setAttribute('for', 'personSelectId'+i);				

			//Change Name for JSON
			vdipModuleTitle[i].name = 'vdipModuleTitle'+i;
			vdipModuleNameDe[i].name = 'vdipModuleNameDe'+i;
			vdipModuleNameEn[i].name = 'vdipModuleNameEn'+i;
			schemaIsPartOfModul[i].name = 'schemaIsPartOfModul'+i;
			schemaModuleUrl[i].name = 'schemaModuleUrl'+i;
			personSelect[i].name = 'personSelect'+i;
		}						
	}
	$('.form-control').trigger('input');
});
```



### Anzeigen von JSON
Der folgende Code-Ausschnitt zeigt, wie das JSON-Format angezeigt wird. Dazu wird ein Event angelegt, welches an den Inputs von Form mit dem ID ```form#jsonDataFom``` gebunden ist. Zunächst wird das HTML-Formular als JS-Object serialisiert und als Variable ```formDataToObjekt``` deklariert. Zu dem Object wird werden die Links eingefügt und den Lecturer mit dem Name, Vorname, Titel und die Email in der richtige Reihenfolge gewandelt. Damit den serelisierten JS-Object als JSON angezeigt wird, wird dieses Object in den JSON umgewandelt und als Variable ```serialisedDataObjekt``` deklariert. Mit dem ```syntaxHighlight``` wird die entsprechende Farbe für jedes Element eingefügt, damit man die einzelne Elemente wie z.B.: ```{}```, ```:```, ```;``` usw. und diese als ```pre``` DOM-Element eingefügt.


```
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
		$('[name="schemaHeadlineDe'+(i+1)+'"]').trigger('focusin');
	}

	if(formDataToObjekt.states !== undefined){
		formDataToObjekt.courses[0].lecturer = formDataToObjekt.states.join(', ');
		delete formDataToObjekt.states
	}

	//ADD VIMEO LINK
	for(var i = 0; i < formDataToObjekt.courses[0].chapters.length; i++){
		formDataToObjekt.courses[0].chapters[i].videos.url_teacher = 'https://vimeo.com/' + formDataToObjekt.courses[0].chapters[i].videos.url_teacher;
		formDataToObjekt.courses[0].chapters[i].videos.url_presentation = 'https://vimeo.com/' + formDataToObjekt.courses[0].chapters[i].videos.url_presentation;
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
```

### Hochladen von JSON auf dem univera-Server


```
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
```
Hier wird ein AJAX-Post gemacht unter dem URL ```file.php```. Es wird ein JSON gepostet, mit den Keys ```filedata``` und ```filename```. Die beiden sind der JSON an sich und den Name der Datei.


```
<?php
    if (isset($_POST['filedata'])){
        $data = $_POST['filedata'];
        $fileName = $_POST['filename'];
        //DOCUMENT_ROOT ist public_html (hier data als Folder eingeben)
        $file = fopen($_SERVER['DOCUMENT_ROOT'].'/'.$fileName.'.json', 'w+');
        fwrite($file, $data);
        fclose($file);
    }
?>
```

Der PHP-Code wartet auf einem JSON-Post mit dem Name filedata ```$_POST['filedata']```. Sobald der JSON-Post gemacht wurde, wird eine JSON-Datei mit dem Name ```$_POST['filename']``` unter dem ```DOCUMENT_ROOT``` angelegt, was nichts anderes als der Ordner ```public_html``` ist. Der JSON-Post wird unter der Datei gespeichert ```fwrite($file, $data)```. Am Ende muss man umbedingt die Datei schließen ```fclose($file)```.


### Hochladen von RDF auf dem OntoWiki


```
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
				$('#modalLoginForm').remove();
				$('.modal-backdrop.fade.show').remove();
				console.log(errorText);
				addWarningAlert();	 
			}
		  }
		});
	}
});
```
Beim Clicken auf dem Hochladen-Button werden die Login-Daten (Benutzername und Passwort) geholt und in die URL gepackt, wo auch die Query mit den ganzen Daten erstellt wird ```'http://'+inputUsername+':'+inputPassword+'@fbwsvcdev.fh-brandenburg.de/OntoWiki/update?query=' + 'INSERT DATA INTO <http://fbwsvcdev.fh-brandenburg.de/OntoWiki/test/> ' + sparqlQuery```. Die Query fügt die Daten in ```OntoWiki/test``` ein. Die ```sparqlQuery``` setzt sich aus dem RDF-Formular zusammen. Der Datentyp ist hier ```jsonp```, weil wir eine Cross-Origin haben, und mit einem einfachen JSON würde es nicht funktionieren, da der ```fbwsvcdev.fh-brandenburg.de/OntoWiki``` Server die ganzen Requests blockiert.

6 Beispielhafter Use Case
=======

Hansi Sparc ist als wissenschaftlicher Mitarbeiter neu an der Technischen Hochschule Brandenburg und wurde mit der Aufgabe betreut, ein bereits gedrehtes und aufbereitetes Video (DoubleClip) von Prof. Grapge mit allen relevanten Angaben auf die Videoplatform „fbwTube“ hochzuladen. Es handelt sich dabei um die Vorlesung „Graph Datenbank VS Graph Dracula“ aus dem Model „Graphen und ihre Strukturen“. 

Hansi nutzt dazu das vorgestellte Tool dieses GitHub-Repositories und landet auf einer Seite mit einem JSON Formular. Dort angekommen überträgt er zunächst die ihm bekannten Daten:

![Alt text](/img/bsp1.PNG?raw=true "Beispiel 1")

Da Prof. Grapge scheinbar noch nicht in der Datenbank vorhanden ist, legt Hansi diesen über einen Klick auf den „+“Button an.

![Alt text](/img/bsp2.PNG?raw=true "Beispiel 2")

Da es sich bei der Vorlesung „„Graph Datenbank VS Graph Dracula“ eher um eine satirische Einführungsvorlesung im Modul handelt, sind hierzu zunächst nur zwei Clips vorhanden, die von Hansi ebenfalls angegeben werden. Die Vimeo IDs wurden ihm vom Prof. vorgegeben, die jeweilige Laufzeit entnimmt er direkt den Videos

![Alt text](/img/bsp3.PNG?raw=true "Beispiel 3")

Hansi betrachtet zufrieden das Ergebnis seiner Eingabe und bemerkt, dass ihm zusätzlich das JSON-File visualisiert wird:

![Alt text](/img/bsp4.PNG?raw=true "Beispiel 4")

Nach Prüfung entscheidet wer sich, dieses hochzuladen und klickt anschließend auf „Weiter“:

![Alt text](/img/bsp5.PNG?raw=true "Beispiel 5")

Er wird daraufhin zum RDF-Formular weitergeleitet und bemerkt, dass sich hierbei viele seiner Eingaben aus dem JSON-Formular in einer RDF-Struktur wiederfinden:

![Alt text](/img/bsp6.PNG?raw=true "Beispiel 6")

Im Formular ergänzt er die Kurzbeschreibung in deutscher und englischer Sprache, sowie zugehörige Schlüsselwörter:

![Alt text](/img/bsp7.PNG?raw=true "Beispiel 7")

Da diese Vorlesung zunächst nur im Modul „Graphen und ihre Strukturen“ gehalten wird, übertragt Hansi dies. Da ebenfalls noch kein Zusammenhang zu einer Vorlesungsreihe besteht, lässt Hansi diese Felder auf den Default-Werten:

![Alt text](/img/bsp8.PNG?raw=true "Beispiel 8")

Er überprüft erneut die Visualisierung des RDF-Files und klickt anschließend auf „Hochladen“. Das Video inkl. der angegebenen Informationen ist nun auf „fbwTube“ hochgeladen! Er freut sich.
