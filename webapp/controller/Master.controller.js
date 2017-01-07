sap.ui.define([
	"sap/ui/Device",
	"com/wedonate/ssc/eng/util/Controller",
	"com/wedonate/ssc/eng/dev/devapp"
], function(Device, Controller, devapp) {
	"use strict";

	return Controller.extend("com.wedonate.ssc.eng.controller.Master", {
		/**
		 * Called when the master list controller is instantiated. 
		 * It sets up the event handling for the master/detail communication and other lifecycle tasks.
		 */
		onInit: function() {},

		/**
		 * Master view RoutePatternMatched event handler 
		 * @param{sap.ui.base.Event} oEvent router pattern matched event object
		 */
		onRouteMatched: function(oEvent) {},

		/**
		 * Detail changed event handler, set selected item
		 * @param{String} sChanel event channel name
		 * @param{String}} sEvent event name
		 * @param{Object}} oData event data object
		 */
		onDetailChanged: function(sChanel, sEvent, oData) {},

		/**
		 * Detail TabChanged event handler
		 * @param{String} sChanel event channel name
		 * @param{String}} sEvent event name
		 * @param{Object}} oData event data object
		 */
		onDetailTabChanged: function(sChanel, sEvent, oData) {
			this.sTab = oData.sTabKey;
		},

		/**
		 * Detail cancel event handler, reset selected item and show detail view
		 * @param{String} sChanel event channel name
		 * @param{String}} sEvent event name
		 * @param{Object}} oData event data object
		 */
		onDetailChangeCancelled: function() {
			var list = this.getView().byId("list");
			var listItems = list.getItems();
			var selectedItem = listItems[this._selectedItemIdx] ? listItems[this._selectedItemIdx] : listItems[0];
			if (selectedItem) {
				list.setSelectedItem(selectedItem);
				this.showDetail(selectedItem);
			}
		},

		/**
		 * wait until this.oInitialLoadFinishedDeferred is resolved, and list view updated
		 * @param{function} fnToExecute the function will be executed if this.oInitialLoadFinishedDeferred is resolved
		 */
		waitForInitialListLoading: function(fnToExecute) {
			jQuery.when(this.oInitialLoadFinishedDeferred).then(jQuery.proxy(fnToExecute, this));
		},

		/**
		 * Detail NotFound event handler
		 */
		onNotFound: function() {
			this.getView().byId("list").removeSelections();
		},

		/**
		 * set the first item as selected item
		 */
		selectFirstItem: function() {
			var oList = this.getView().byId("list");
			var aItems = oList.getItems();
			if (aItems.length) {
				oList.setSelectedItem(aItems[0], true);
				this._selectedItemIdx = 0;
			}
		},

		/**
		 * Event handler for the master search field. Applies current
		 * filter value and triggers a new search. If the search field's
		 * 'refresh' button has been pressed, no new search is triggered
		 * and the list binding is refresh instead.
		 */
		onSearch: function() {
			// add filter for search
			var filters = [];
			var searchString = this.getView().byId("searchField").getValue();
			if (searchString && searchString.length > 0) {
				filters = [new sap.ui.model.Filter("", sap.ui.model.FilterOperator.Contains, searchString)];
			}

			// update list binding
			var list = this.getView().byId("list");
			list.getBinding("items").filter(filters);
			this._selectedItemIdx = list.indexOfItem(list.getSelectedItem());
		},

		/**
		 * Event handler for the list selection event
		 * @param {sap.ui.base.Event} oEvent the list selectionChange event
		 */
		onSelect: function(oEvent) {
			
		},

		/**
		 * Shows the selected item on the detail page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 */
		showDetail: function(oItem) {
			// If we're on a phone, include nav in history; if not, don't.
			var bReplace = Device.system.phone ? false : true;
			this.getRouter().navTo("detail", {
				from: "master",
				entity: oItem.getBindingContext().getPath().substr(1),
				tab: this.sTab
			}, bReplace);
		}
	});
});