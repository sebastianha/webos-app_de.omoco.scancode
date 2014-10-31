/*
ScanCode - An application to decode Barcodes and QR-Codes.
Version 1.0.0 (25. Jan 2010)

Copyright (C) 2010 Sebastian Hammerl (E-Mail: scancode@omoco.de)

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of
the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, see <http://www.gnu.org/licenses/>.
*/

var scanResult = [];
var listModel = {listTitle:$L('Ergebnis'), items:scanResult};

var decodedresult = "";

function MainAssistant() {

};

MainAssistant.prototype.setup = function() {
	this.appMenuModel = {
		visible: true,
		items: [
			//{ label: "Einstellungen", command: 'prefs' },
			//{ label: "Aktualisieren", command: 'refreshLocation' },
    		//{ label: "Hilfe", command: 'help' },
			{ label: $L("About"), command: 'about' }
		]
	};
	
	this.controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems: true}, this.appMenuModel);
	
	this.spinnerLAttrs = {spinnerSize: 'large'};
	this.spinnerModel = {spinning: false};
	this.controller.setupWidget('large-activity-spinner', this.spinnerLAttrs, this.spinnerModel);
	
	this.controller.listen($('selectimage'),Mojo.Event.tap, this.handleSelectImagePressed.bind(this));
	this.controller.listen($('cameraimage'),Mojo.Event.tap, this.handleCameraImagePressed.bind(this));
	
	this.controller.listen($('openurl'),Mojo.Event.tap, this.handleOpenUrlPressed.bind(this));
	this.controller.listen($('copytext'),Mojo.Event.tap, this.handleCopyTextPressed.bind(this));
	this.controller.listen($('searchproduct'),Mojo.Event.tap, this.handleSearchProductPressed.bind(this));
	this.controller.listen($('searchgoogle'),Mojo.Event.tap, this.handleSearchGooglePressed.bind(this));
	this.controller.listen($('callnumber'),Mojo.Event.tap, this.handleCallNumberPressed.bind(this));
	this.controller.listen($('sendsms'),Mojo.Event.tap, this.handleSendSmsPressed.bind(this));
	this.controller.listen($('addcontact'),Mojo.Event.tap, this.handleAddContactPressed.bind(this));
	this.controller.listen($('gotogeo'),Mojo.Event.tap, this.handleGoToGeoPressed.bind(this));
	this.controller.listen($('sendmail'),Mojo.Event.tap, this.handleSendMailPressed.bind(this));

	this.controller.setupWidget(
		"results",
		this.attributes = {
			itemTemplate: 'main/static-list-entry', listTemplate: 'main/static-list-container', emptyTemplate:'main/emptylist'
		},
		listModel
	);
	
	$('openurl').hide();
	$('copytext').hide();
	$('searchproduct').hide();
	$('searchgoogle').hide();
	$('callnumber').hide();
	$('sendsms').hide();
	$('addcontact').hide();
	$('gotogeo').hide();
	$('sendmail').hide();
};

MainAssistant.prototype.handleCommand = function(event){
    if(event.type == Mojo.Event.command) {	
		switch (event.command) {
			/*case 'prefs':
				Mojo.Controller.stageController.pushScene("prefs");
				break;
			case 'refreshLocation':
				this.refreshLocation();
				break;
			case 'help':
				Mojo.Controller.stageController.pushScene("help");
				break;*/
			case 'about':
				Mojo.Controller.stageController.pushScene("about");
				break;
		}
	}
}

MainAssistant.prototype.activate = function(event) {
	if (event.filename) {
		this.analyze_cam(event.filename);
	}
};


MainAssistant.prototype.deactivate = function(event) {

};

MainAssistant.prototype.cleanup = function(event) {

};

MainAssistant.prototype.analyze_cam = function(filename){
	this.analyze(filename);
}

MainAssistant.prototype.analyze_pick = function(file){
	this.analyze(file.fullPath);
}

MainAssistant.prototype.analyzeSuccess = function(resp) {
	if(resp.completed == false) {

	}
	if(resp.completed == true && resp.responseString != null) {
		if (resp.responseString == "No barcode found\n") {
			scanResult = 
			[
				{ body: $L("Error: No barcode found.") }
			];
		} else if (resp.responseString == "no file") {
			scanResult = 
			[
				{ body: $L("Error: No file selected for upload.")}
			];
		} else if (resp.responseString == "wrong format") {
			scanResult = 
			[
				{ body: $L("Error: Wrong file format.")}
			];
		} else if (resp.responseString == "too big") {
			scanResult = 
			[
				{ body: $L("Error: Filesize too big.")}
			];
		} else if (resp.responseString == "could not copy") {
			scanResult = 
			[
				{ body: $L("Error: Internal server error. Sorry but you cannot do anything.")}
			];
		} else {
			scanResult = 
			[
				{ body: "Typ: " + resp.responseString.split(";")[0] + " (" + resp.responseString.split(";")[1] + ")"},
				{ body: resp.responseString.split(";")[2]}
			];
		}
		
		decodedresult = resp.responseString.split(";")[2];
		
		if(resp.responseString.split(";")[1] == "URI") {
			$('openurl').show();
		}
		
		//if(resp.responseString.split(";")[1] == "TEXT") {
			$('copytext').show();
		//}
		
		if(resp.responseString.split(";")[1] == "PRODUCT") {
			$('searchproduct').show();
			$('searchgoogle').show();
		}
		
		if(resp.responseString.split(";")[1] == "TEL") {
			$('callnumber').show();
		}
		
		if(resp.responseString.split(";")[1] == "SMS") {
			$('sendsms').show();
		}
		
		/*if(resp.responseString.split(";")[1] == "ADDRESSBOOK") {
			$('addcontact').show();
		}*/

		if(resp.responseString.split(";")[1] == "GEO") {
			$('gotogeo').show();
		}
		if(resp.responseString.split(";")[1] == "EMAIL_ADDRESS") {
			$('sendmail').show();
		}
		
		listModel.items = scanResult;
		this.controller.modelChanged(listModel);
		
		this.spinnerModel.spinning = false;
		this.controller.modelChanged(this.spinnerModel);
	}
};

MainAssistant.prototype.analyze = function(filename) {
	$('introduction').hide();
	
	$('openurl').hide();
	$('copytext').hide();
	$('searchproduct').hide();
	$('searchgoogle').hide();
	$('callnumber').hide();
	$('sendsms').hide();
	$('addcontact').hide();
	$('gotogeo').hide();
	$('sendmail').hide();
	
	this.spinnerModel.spinning = true;
	this.controller.modelChanged(this.spinnerModel);

	var scanResult = [];
	listModel.items = scanResult;
	this.controller.modelChanged(listModel);
	
	this.controller.serviceRequest('palm://com.palm.downloadmanager/', {
		method: 'upload', 
		parameters: {
			'fileName': filename,
			'url': 'http://kirjava.arrowsoft.de/scancode/index.php',
			'contentType': 'img',
			'fileLabel': 'image',
			subscribe: true 
		},
		onSuccess : this.analyzeSuccess.bind(this),
		onFailure : function (e){
		}.bind(this)
	});
};

MainAssistant.prototype.handleSelectImagePressed = function(event) {
	var params = {
		kinds: ['image'],
		onSelect: this.analyze_pick.bind(this)
	};
	Mojo.FilePicker.pickFile(params, this.controller.stageController);
};

MainAssistant.prototype.handleCameraImagePressed = function(event) {
	var d = new Date().getTime();
	var filestring = "/media/internal/ScanCode/"+d+".jpg";
	this.controller.stageController.pushScene(
		{ appId :'com.palm.app.camera', name: 'capture' },
		{ sublaunch : true, filename: filestring }
	);

};

MainAssistant.prototype.handleOpenUrlPressed = function(event){
	this.controller.serviceRequest('palm://com.palm.applicationManager', {
	method: 'open',
	parameters: {
		id: 'com.palm.app.browser',
		params: {
			url: decodedresult
		}
	}
	})
}

MainAssistant.prototype.handleCopyTextPressed = function(event){
	this.controller.stageController.setClipboard(decodedresult);
}

MainAssistant.prototype.handleSearchProductPressed = function(event){
	this.controller.serviceRequest('palm://com.palm.applicationManager', {
	method: 'open',
	parameters: {
		id: 'com.palm.app.browser',
		params: {
			url: "http://www.ean-search.org/perl/ean-search.pl?q=" + decodedresult
		}
	}
	})
}

MainAssistant.prototype.handleSearchGooglePressed = function(event){
	this.controller.serviceRequest('palm://com.palm.applicationManager', {
	method: 'open',
	parameters: {
		id: 'com.palm.app.browser',
		params: {
			url: "http://www.google.com/m/search?client=ms-palm-webOS&channel=iss&q=" + decodedresult
		}
	}
	})
}

MainAssistant.prototype.handleCallNumberPressed = function(event){
	this.controller.serviceRequest('palm://com.palm.applicationManager', {
	     method:'open',
	     parameters: {
	        target: "tel://" + decodedresult.split("\n")[0]
	     }
	 })
}

MainAssistant.prototype.handleSendSmsPressed = function(event){
	this.controller.serviceRequest('palm://com.palm.applicationManager', {
		method:'launch',
		parameters:{
			id:"com.palm.app.messaging",
			params : {
				composeAddress: decodedresult.split("\n")[0],
				messageText: decodedresult.split("\n")[1]
			}
		}
	})
}

MainAssistant.prototype.handleAddContactPressed = function(event){
	this.controller.serviceRequest('palm://com.palm.applicationManager', {
		method:'open',
		parameters:{
		id:"com.palm.app.contacts",
		params:
		{
			"launchType": "addToExisting" | "newContact",
			"contact":
			{
				
			}
			}
		}
	});
}

MainAssistant.prototype.handleGoToGeoPressed = function(event){
	var latitude = decodedresult.split(",")[0];
	var longitude = decodedresult.split(",")[1];
	
	this.controller.serviceRequest('palm://com.palm.applicationManager', {
	method: 'launch',
	parameters: {
		id:"com.palm.app.maps",
		params:{"query":+latitude+","+longitude}
		}
	});
}

MainAssistant.prototype.handleSendMailPressed = function(event){
	this.controller.serviceRequest('palm://com.palm.applicationManager', {
	     method:'open',
	     parameters: {
	        target: "mailto:" + decodedresult.split("\n")[0]
	     }
	 })
}