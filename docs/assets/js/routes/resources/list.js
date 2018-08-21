/*!
 * Copyright 2018 E-Com Club
 */

(function () {
  'use strict'

  // current tab ID
  var tabId = window.tabId
  var Tab = window.Tabs[tabId]
  var elContainer = $('#t' + tabId + '-tab-normal')
  // prefix tab ID on content elements IDs
  window.renderContentIds(elContainer)

  // var lang = window.lang
  var i18n = window.i18n

  // create button
  $('#t' + tabId + '-create').click(function () {
    // go to 'new' route
    window.location = '/' + window.location.hash + '/new'
  })

  // resource list data
  var resourceSlug = Tab.slug
  var data, list
  var updateData = function () {
    data = Tab.data
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
    var $grid = $('#t' + tabId + '-resource-list')
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

    // control pagination
    var updatePage = function (page) {
      offset = (page - 1) * limit
      // reload data
      load()
    }
    var increasePage = function (x) {
      var el = $('#t' + tabId + '-page')
      // change page number
      var page = parseInt(el.val(), 10) + x
      if (page > 0) {
        updatePage(page)
        el.val(page)
      }
    }

    var paginationControls = function () {
      // update pagination buttons states
      var $prev = $('#t' + tabId + '-prev')
      var $next = $('#t' + tabId + '-next')
      var $page = $('#t' + tabId + '-page')
      if (offset <= 0) {
        // no prev page
        $prev.attr('disabled', true)
      } else {
        $prev.removeAttr('disabled')
      }
      if (list.length < limit) {
        // no next page
        $next.attr('disabled', true)
      } else {
        $next.removeAttr('disabled')
      }
      if (offset <= 0 && list.length < limit) {
        // also disable input
        // unique page
        $page.attr('disabled', true)
      } else {
        $page.removeAttr('disabled')
      }
    }

    // pagination input and buttons
    $('#t' + tabId + '-page').keydown(window.keyIsNumber).change(function () {
      updatePage(parseInt($(this).val(), 10))
    })
    $('#t' + tabId + '-next').click(function () {
      increasePage(1)
    })
    $('#t' + tabId + '-prev').click(function () {
      // decrease page number
      increasePage(-1)
    })
    // preset buttons states
    paginationControls()

    // change max number of results
    $('#t' + tabId + '-page-size').change(function () {
      var val = parseInt($(this).val(), 10)
      if (!isNaN(val) && val > 0) {
        limit = val
        // reset
        offset = 0
        $('#t' + tabId + '-page').val('1')
      }
      // reload data
      load()
    })

    var dataUpdated = false
    var forceReload = false
    // control request queue
    var loading = false
    var waiting = false
    var load = function () {
      if (!loading) {
        loading = true
        var $loading = $grid.find('.loading')
        $loading.show()

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
          // request queue
          loading = false
          $loading.fadeOut()
          if (waiting) {
            // update params and run again
            load()
            waiting = false
          }
          if (!err) {
            updateData()
            dataUpdated = true
            // update jsGrid
            $grid.jsGrid('loadData')
            // update pagination controls
            paginationControls()
          }
        }
        Tab.load(callback, params)
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
        el.find('input').addClass('checkbox-all').on('change', function () {
          var selector = $(this).is(':checked') ? ':not(:checked)' : ':checked'
          $grid.find('.data-list-check input' + selector).next().click()
        })
        return el
      },

      // loading spinner
      filterTemplate: function () {
        return '<div class="spinner-circle-shadow loading"></div>'
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
    var field, i
    // get from first resource object properties
    var fieldsList = []
    for (i = 0; i < data.meta.fields.length; i++) {
      field = data.meta.fields[i]
      if (field !== '_id') {
        // check field type
        for (var ii = 0; ii < list.length; ii++) {
          switch (typeof list[ii][field]) {
            case 'undefined':
              // continue and try next list object
              continue
            case 'string':
              // valid field to grid
              fieldsList.push(field)
              break
          }
          // exit for loop
          ii = list.length
        }
      }
    }
    for (i = 0; i < fieldsList.length; i++) {
      field = fieldsList[i]
      fields.push({
        name: field,
        type: 'text'
      })
      // starts with no filtering
      filters[field] = ''
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
            if (!forceReload) {
              // check if filters has been changed
              var changed = false

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
                // reload data with different filters
                load()
              }
            } else {
              // force reload data
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
    var selectItem = function (id) {
      Tab.selectedItems.push(id)
    }
    var unselectItem = function (id) {
      Tab.selectedItems = $.grep(Tab.selectedItems, function (i) {
        return i !== id
      })
    }

    // delete event effects
    Tab.deleteItems = function () {
      // show spinner and let it to fade out after list reload
      $grid.find('.loading').show()
      // returns callback for delete end
      return function () {
        // reload list
        forceReload = true
        // reset data status
        dataUpdated = false
        $grid.jsGrid('loadData')
        // unckeck if checked
        $grid.find('.checkbox-all:checked').next().click()
      }
    }
  } else {
    // no resource objects
  }
}())
