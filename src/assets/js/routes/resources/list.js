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

  // resource list data
  var list = window.tabData[tabId].result
  // var commit = window.tabCommit[tabId]

  // create button
  $('#' + tabId + '-create').click(function () {
    // go to 'new' route
    window.location = '/' + window.location.hash + '/new'
  })

  // delete checkbox element HTML
  var elCheckbox = '<div class="custom-controls-stacked">' +
                     '<div class="custom-control custom-checkbox">' +
                       '<input type="checkbox" class="custom-control-input" />' +
                       '<label class="custom-control-label"> </label>' +
                     '</div>' +
                   '</div>'

  // setup jsGrid
  var $grid = $('#' + tabId + '-resource-list')
  $grid.jsGrid({
    // http://js-grid.com/docs/
    autoload: true,
    filtering: true,
    sorting: true,
    confirmDeleting: false,
    pageLoading: true,

    // treat click on row
    // select item or redirect to document edit page
    rowClick: function (args) {
      var event = args.event.originalEvent || args.event
      if (event) {
        // check clicked element
        var elClicked = event.target
        if (elClicked) {
          switch (elClicked.nodeName) {
            case 'TD':
              // check if is the first cell (delete)
              for (var i = 0; i < elClicked.classList.length; i++) {
                if (elClicked.classList[i] === 'data-list-delete') {
                  // click on checkbox
                  $(elClicked).find('label').click()
                  return
                }
              }
              break

            case 'LABEL':
            case 'INPUT':
            case 'DIV':
            case 'SELECT':
              // skip
              return
          }
        }
      }

      // clicked on item row
      // go to 'edit' route with resource ID
      window.location = '/' + window.location.hash + '/' + args.item._id
    },

    controller: {
      // load data from API
      // resource list
      // work with pagination and filtering
      loadData: function (filter) {
        return {
          data: list,
          itemsCount: list.length
        }
      }
    },

    fields: [{
      headerTemplate: function () { return $(elCheckbox) },
      itemTemplate: function (_, item) {
        var el = $(elCheckbox)
        var input = el.find('input')
        input.prop('checked', $.inArray(item, selectedItems) > -1)
        input.on('change', function () {
          $(this).is(':checked') ? selectItem(item) : unselectItem(item)
        })
        return el
      },
      align: 'center',
      css: 'data-list-delete',
      filtering: false,
      sorting: false
    }, {
      name: '_id',
      title: 'ID',
      type: 'text'
    }, {
      name: 'sku',
      title: 'SKU',
      type: 'text'
    }]
  })

  // select items from list to delete and edit
  var selectedItems = []

  var selectItem = function (item) {
    selectedItems.push(item)
  }

  var unselectItem = function (item) {
    selectedItems = $.grep(selectedItems, function (i) {
      return i !== item
    })
  }

  // delete button
  $('#' + tabId + '-delete').click(function () {
    if (selectedItems.length) {
      console.log(selectedItems)
      // call API to delete documents
      $grid.jsGrid('loadData')
      // reset
      selectedItems = []
    }
  })
}())
