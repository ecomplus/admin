/*!
 * Copyright 2018 E-Com Club
 */

(function () {
  'use strict'

  // current tab ID
  var tabId = window.tabId
  var elContainer = $('#' + tabId + '-tab-normal')
  // prefix tab ID on content elements IDs
  window.renderContentIds(elContainer)
  window.setSaveAction()

  // create button
  $('#' + tabId + '-create').click(function () {
    // go to 'new' route
    window.location = '/' + window.location.hash + '/new'
  })

  // resource list data
  var list = window.tabData[tabId].result

  // setup jsGrid
  $('#' + tabId + '-resource-list').jsGrid({
    autoload: true,
    paging: true,
    pageLoading: true,
    pageSize: 15,
    pageIndex: 2,

    controller: {
      loadData: function (filter) {
        return {
          data: list,
          itemsCount: list.length
        }
      }
    },

    fields: [
      { name: 'Name', type: 'text', width: 150 },
      { name: 'Age', type: 'number', width: 50 },
      { name: 'Address', type: 'text', width: 200 },
      { name: 'Married', type: 'checkbox', title: 'Is Married' }
    ]
  })
}())
