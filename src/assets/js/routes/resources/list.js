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

  // create button
  $('#' + tabId + '-create').click(function () {
    // go to 'new' route
    window.location = '/' + window.location.hash + '/new'
  })

  // resource list data
  var data = window.tabData[tabId]
  var list = data.result
  if (list.length) {
    // delete checkbox element HTML
    var elCheckbox = '<div class="custom-controls-stacked">' +
                       '<div class="custom-control custom-checkbox">' +
                         '<input type="checkbox" class="custom-control-input" />' +
                         '<label class="custom-control-label"> </label>' +
                       '</div>' +
                     '</div>'

    // setup jsGrid
    var $grid = $('#' + tabId + '-resource-list')
    // current grid row
    var row = 0
    // offset and limit
    // control pagination
    var limit = 100
    var offset = 0

    // http://js-grid.com/docs/#grid-fields
    var fields = [{
      // first cell
      // checkbox to trigger row selection
      // bulk edition and deletion
      align: 'center',
      css: 'data-list-check',
      filtering: false,
      sorting: false,

      // checkbox to select all
      headerTemplate: function () {
        var el = $(elCheckbox)
        el.find('input').on('change', function () {
          var selector = $(this).is(':checked') ? ':not(:checked)' : ':checked'
          $('.data-list-check input' + selector).next().click()
        })
        return el
      },

      // checkbox to select current row item
      itemTemplate: function (_, item) {
        var el = $(elCheckbox)
        var id = item._id
        el.find('input').on('change', function () {
          $(this).is(':checked') ? selectItem(id) : unselectItem(id)
        })
        return el
      }
    }, {
      // resource ID
      // same field for all resources
      name: '_id',
      title: 'ID',
      filtering: false,
      sorting: false
    }]

    // setup resource specific fields
    var field, fieldsList
    if (data.meta.hasOwnProperty('fields')) {
      fieldsList = data.meta.fields
    } else {
      // get from first resource object properties
      fieldsList = []
      for (field in list[0]) {
        fieldsList.push(field)
      }
    }
    for (var i = 0; i < fieldsList.length; i++) {
      field = fieldsList[i]
      if (field !== '_id') {
        fields.push({
          name: field,
          type: 'text'
        })
      }
    }

    fields.push({
      // last cell
      // control filters
      css: 'data-list-control',
      filtering: false,
      sorting: false,
      title: '#',

      // filter buttons
      filterTemplate: function () {
        var el = $('<div />', {
          class: 'data-list-control-buttons',
          html: [
            $('<i />', {
              class: 'fa fa-search',
              click: function () {
                // reload data with current filters
                $grid.jsGrid('loadData')
              }
            }),
            $('<i />', {
              class: 'fa fa-filter',
              click: function () {
                // clear filters and reload
                $grid.jsGrid('clearFilter')
              }
            })
          ]
        })
        return el
      },

      // count grid rows
      itemTemplate: function () {
        row++
        return '#' + (offset + row)
      }
    })

    $grid.jsGrid({
      // http://js-grid.com/docs/
      autoload: true,
      filtering: true,
      sorting: true,
      confirmDeleting: false,
      // pagination
      paging: true,
      pageLoading: true,
      pageSize: limit,
      pageButtonCount: 7,
      pagerFormat: '{first} {prev} {pages} {next} {last}',
      pagePrevText: '<',
      pageNextText: '>',
      pageFirstText: '<<',
      pageLastText: '>>',

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
                  if (elClicked.classList[i] === 'data-list-check') {
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
          // reset current row
          row = 0
          // fix pagination offset
          offset = (filter.pageIndex - 1) * limit
          return {
            data: list.slice(offset, offset + limit),
            itemsCount: list.length
          }
        }
      },

      fields: fields
    })

    // select items from list to delete and edit
    var selectedItems = []

    var selectItem = function (id) {
      selectedItems.push(id)
    }

    var unselectItem = function (id) {
      selectedItems = $.grep(selectedItems, function (i) {
        return i !== id
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
  }
}())
