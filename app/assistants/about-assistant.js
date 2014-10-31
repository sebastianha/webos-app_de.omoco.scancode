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

function AboutAssistant() {

}

AboutAssistant.prototype.setup = function() {
	this.appMenuModel = {
		visible: true,
		items: []
	};

	this.controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems: true}, this.appMenuModel);
}

AboutAssistant.prototype.activate = function(event) {

}

AboutAssistant.prototype.deactivate = function(event) {

}

AboutAssistant.prototype.cleanup = function(event) {

}
