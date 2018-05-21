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

  // var lang = window.lang
  var i18n = window.i18n

  // create button
  $('#' + tabId + '-create').click(function () {
    // go to 'new' route
    window.location = '/' + window.location.hash + '/new'
  })

  // resource list data
  var resourceSlug = window.routeParams[0]
  var data, list
  var updateData = function () {
    data = window.tabData[tabId]
    list = data.result
  }
  updateData()

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
    var offset = 0
    var limit
    if (data.meta.hasOwnProperty('limit')) {
      limit = data.meta.limit
    } else {
      // default ?
      limit = 1000
    }
    // current list filters
    var filters = {}
    // start with no sorting
    var sort = {
      field: null,
      order: null
    }

    var dataUpdated = false
    // control request queue
    var loading = false
    var waiting = false
    var load = function () {
      if (!loading) {
        // mount API request query string
        // https://ecomstore.docs.apiary.io/#introduction/overview/url-params
        var params = 'limit=' + limit
        if (offset > 0) {
          params += '&offset=' + offset
        }
        if (sort.field) {
          params += '&sort='
          if (sort.order === 'desc') {
            params += '-'
          }
          params += sort.field
        }

        // object properties
        for (var i = 0; i < fieldsList.length; i++) {
          var field = fieldsList[i]
          if (filters.hasOwnProperty(field) && filters[field] !== '') {
            params += '&' + field + '=' + filters[field]
          }
        }

        var callback = function (err) {
          if (!err) {
            updateData()
            dataUpdated = true
            // update jsGrid
            $grid.jsGrid('loadData')
          }
          // request queue
          loading = false
          if (waiting) {
            // update params and run again
            load()
            waiting = false
          }
        }
        window.tabLoad[tabId](callback, params)
        loading = true
      } else if (!waiting) {
        waiting = true
      }
    }

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
        el.find('input').attr('id', tabId + '-check-all').on('change', function () {
          var selector = $(this).is(':checked') ? ':not(:checked)' : ':checked'
          $grid.find('.data-list-check input' + selector).next().click()
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
        // starts with no filtering
        filters[field] = ''
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
      pageLoading: true,
      pageSize: limit,

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
        loadData: function (query) {
          if (!dataUpdated) {
            var changed = false
            // check if filters has been changed
            for (var field in filters) {
              if (filters.hasOwnProperty(field) && query[field] !== filters[field]) {
                filters[field] = query[field]
                if (!changed) {
                  changed = true
                }
              }
            }
            // check current order
            if (query.sortField) {
              if (sort.field !== query.sortField || sort.order !== query.sortOrder) {
                sort.field = query.sortField
                sort.order = query.sortOrder
                if (!changed) {
                  changed = true
                }
              }
            } else if (sort.field) {
              // no sorting
              sort.field = sort.order = null
              if (!changed) {
                changed = true
              }
            }
            if (changed) {
              // reload data
              load()
            }
          } else {
            // reset data status
            dataUpdated = false
          }

          return {
            data: list,
            itemsCount: list.length
          }
        }
      },
      onRefreshing: function () {
        // reset current row
        row = 0
      },

      fields: fields
    })

    $.getJSON('json/resources/' + resourceSlug + '.json', function (json) {
      // successful
      // change fields labels
      for (var i = 0; i < fieldsList.length; i++) {
        var field = fieldsList[i]
        var obj = json[field]
        if (obj && obj.label) {
          $grid.jsGrid('fieldOption', field, 'title', i18n(obj.label))
        }
      }
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
        // call API to delete documents
        $grid.jsGrid('loadData')
        // reset
        selectedItems = []
        // unckeck if checked
        $('#' + tabId + '-check-all:checked').next().click()
      }
    })
  } else {
    // no resource objects
  }
}())
