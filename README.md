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

Mit hilfe von AJAX wird eine POST-request an den Server ```http://fbwsvcdev.fh-brandenburg.de/OntoWiki/sparql?query= ``` gesendet. Diese Anfrage erwartet einen JSON-Datentyp. Wenn der POST erfolgreich durchgeführt wurde, dann werden die Daten als Option (select) in einem HTML eingefügt. Die Erstellung einer solchen Option wird durch den Befehl ```document.createElement('option')``` realisiert. Der select wird über ```var lectureSeries = $('#lectureSeries')``` deklariert und die option ```lectureSeries.append(optionForm)``` in dem select eingefügt. Wenn der POST nicht funktioniert wird eine Error-Message auf der KOnsole ausgegeben und zusätzlich eine Meldung im HTML genertiert ```addWarningAlert()```. 







