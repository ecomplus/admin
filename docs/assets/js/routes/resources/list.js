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

  var baseHash = '/' + window.location.hash + '/'
  // create button
  $('#t' + tabId + '-create').click(function () {
    // go to 'new' route
    window.location = baseHash + 'new'
  })

  // resource list data
  var resourceSlug = Tab.slug
  var data, list
  var updateData = function () {
    data = Tab.data
    // map deeper objects
    list = data.result.map(function (doc, index) {
      var newDoc = { _index: index }
      for (var prop in doc) {
        var deepObj = doc[prop]
        if (typeof deepObj === 'object' && deepObj !== null && !Array.isArray(deepObj)) {
          // is object
          // go deeper
          for (var deepProp in deepObj) {
            if (deepObj.hasOwnProperty(deepProp)) {
              // assign to object
              // using / to separate properties because jsGrid converts dot notation
              newDoc[prop + '/' + deepProp] = deepObj[deepProp]
            }
          }
        } else {
          // just keep the original property
          newDoc[prop] = deepObj
        }
      }
      return newDoc
    })
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
    // start default sorting
    var defaultSortField = 'updated_at'
    var defaultSortOrder = 'desc'
    var sort = {
      field: defaultSortField,
      order: defaultSortOrder
    }

    // control pagination
    var updatePage = function (page) {
      if (typeof page !== 'number' || isNaN(page) || page < 1) {
        // fix page number
        page = 1
      }
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
      // set current page input value
      $page.val(Math.ceil(offset / limit) + 1)
    }

    var resetPagination = function () {
      // back to page 1
      offset = 0
      // update pagination controls
      paginationControls()
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
    // global tab pagination handler
    Tab.pagination = function (prev) {
      increasePage(prev ? -1 : 1)
    }

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
    var load = function (cb) {
      if (!loading) {
        loading = true
        var $loading
        if (!cb) {
          $loading = $grid.find('.loading')
          $loading.show()
        }

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
          params += sort.field.replace('/', '.')
        }

        // object properties
        for (var i = 0; i < fieldsList.length; i++) {
          var field = fieldsList[i]
          var value = filters[field]
          if (value && value !== '') {
            var prop = field.replace('/', '.')
            if (/([0-9]+)?>>([0-9]+)?/.test(value)) {
              // query by range
              value = value.split('>>')
              if (value[0] !== '') {
                params += '&' + prop + '>=' + value[0]
              }
              if (value[1] !== '') {
                params += '&' + prop + '<=' + value[1]
              }
            } else {
              params += '&' + prop + '=' + value
            }
          }
        }

        var callback = function (err) {
          // request queue
          loading = false
          if (typeof cb !== 'function') {
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
          } else {
            cb()
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
          // run function async to prevent break with big lists
          var $loading = $grid.find('.loading')
          $loading.show()
          setTimeout(function () {
            $grid.find('.data-list-check input' + selector).next().click()
            $loading.hide()
          }, 50)
          return true
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
    // get from first resource object properties
    var fieldsList = []

    // load lists configuration JSON
    $.getJSON('json/misc/config_lists.json', function (json) {
      var config = json[resourceSlug]
      if (config) {
        var filterRange = function (fieldObj, isMoney) {
          // handle filter by range
          // for numbers only
          fieldObj.filterTemplate = function () {
            // hidden input to handle jsGrid hardcoded filterControl property
            var $hidden = $('<input>', { type: 'hidden' })
            var setValue = function () {
              var min = stringToNumber($min.val()) || ''
              var max = stringToNumber($max.val()) || ''
              $hidden.val(min !== '' || max !== '' ? min + '>>' + max : '')
              // reload data with new filter value
              $grid.jsGrid('loadData')
            }
            this.filterControl = $hidden

            // inputs for min and max values
            var inputsOpts = {
              keydown: function (e) {
                switch (e.which) {
                  // enter
                  case 13:
                    $(this).trigger('change')
                    break
                }
              },
              change: setValue,
              type: 'tel',
              placeholder: i18n({
                'en_us': 'min',
                'pt_br': 'mín'
              })
            }
            var $min = $('<input>', inputsOpts)
            var $max = $('<input>', Object.assign(inputsOpts, {
              placeholder: i18n({
                'en_us': 'min',
                'pt_br': 'mín'
              })
            }))

            if (isMoney) {
              // mask currency inputs
              // true to keep original placeholders
              $min.inputMoney(true)
              $max.inputMoney(true)
            }
            return $('<div>', { html: [ $min, $max ] })
          }
        }

        for (var i = 0; i < config._fields.length; i++) {
          var field = config._fields[i]
          var fieldOpts = config[field] || {}
          // add to fields list
          fieldsList.push(field)
          var fieldObj = {
            name: field,
            type: 'text',
            title: i18n(fieldOpts.label || json._labels[field])
          }

          if (i === 0) {
            // first column
            // link to edit resource
            fieldObj.itemTemplate = function (text, item) {
              if (text && item) {
                return $('<a>', {
                  text: text,
                  href: baseHash + item._id
                })
              }
            }
          } else {
            // custom item template by field type
            switch (fieldOpts.type) {
              case 'link':
                fieldObj.itemTemplate = function (text) {
                  if (text) {
                    // parse to HTML link
                    var ln = text.length
                    return $('<a>', {
                      text: (ln > 32 ? text.substr(0, 12) + '...' + text.substr(ln - 20) : text),
                      href: text,
                      target: '_blank'
                    })
                  }
                }
                break

              case 'bold':
                (function (field, type, enumValues) {
                  // parse to bold text with class by each value defined from field options
                  var genElement = function (value) {
                    var valueObj = enumValues[value] || {}
                    // colored bold text
                    var className = type + ' text-' + (valueObj.class || 'muted')
                    return $('<span>', {
                      'class': className,
                      text: i18n(valueObj.text) || value
                    })
                  }
                  fieldObj.itemTemplate = function (value) {
                    if (value) {
                      return genElement(value)
                    }
                  }

                  // render select element for filtering
                  fieldObj.filterTemplate = function () {
                    var $options = [
                      $('<option>', {
                        text: '--',
                        value: '',
                        selected: true
                      })
                    ]
                    // render an option element for each possible value
                    for (var value in enumValues) {
                      if (enumValues.hasOwnProperty(value)) {
                        $options.push($('<option>', {
                          text: value,
                          value: value,
                          'data-content': genElement(value).prop('outerHTML')
                        }))
                      }
                    }

                    // create and return the select element
                    var $select = $('<select>', {
                      'class': 'hidden',
                      html: $options,
                      change: function () {
                        // reload data with new filter value
                        $grid.jsGrid('loadData')
                      }
                    })
                    this.filterControl = $select
                    setTimeout(function () {
                      $select.selectpicker({
                        noneSelectedText: '--',
                        windowPadding: 70,
                        container: elContainer
                      })
                    }, 200)
                    return $select
                  }
                }(field, fieldOpts.type, fieldOpts.enum))
                break

              case 'money':
                fieldObj.itemTemplate = fieldObj.itemTemplate = function (text) {
                  return formatMoney(text)
                }
                // filter by money value range
                // isMoney = true
                filterRange(fieldObj, true)
                break
            }
          }

          if (fieldOpts.width) {
            // set fixed width
            fieldObj.css = 'data-list-fixed'
            fieldObj.width = fieldOpts.width
          }
          if (fieldOpts.range) {
            // filter by number range
            filterRange(fieldObj)
          }
          fields.push(fieldObj)
          // starts with no filtering
          filters[field] = ''
        }
      }

      fields.push({
        // updated at date
        // default list order
        name: 'updated_at',
        type: 'text',
        title: i18n(json._labels.updated_at),
        filtering: false,
        itemTemplate: function (dateString) {
          return (dateString ? formatDate(dateString) : dateString)
        }
      }, {
        // last cell
        // control filters
        css: 'data-list-control',
        filtering: false,
        sorting: false,
        title: '#',

        // filter buttons
        filterTemplate: function () {
          var el = $('<div>', {
            class: 'data-list-control-buttons',
            html: [
              $('<i>', {
                class: 'fa fa-search',
                click: function () {
                  // reload data with current filters
                  $grid.jsGrid('loadData')
                }
              }),
              $('<i>', {
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
                case 'A':
                  // skip
                  return
              }
            }
          }

          // clicked on item row
          var item = args.item
          // go to 'edit' route with resource ID
          window.location = baseHash + item._id

          // pass item pagination function to new route
          limit = 1
          Tab.state.page = offset + item._index
          Tab.state.pagination = function (prev) {
            // handle prev or next item
            offset = Tab.state.page + (prev ? -1 : 1)
            if (offset > -1) {
              Tab.state.page = offset
              load(function () {
                var result = Tab.data.result
                if (result && result.length) {
                  // redirect to resultant item edit route
                  window.location = baseHash + result[0]._id
                }
              })
            }
          }
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
                if (!query.sortField) {
                  // default sorting
                  query.sortField = defaultSortField
                  query.sortOrder = defaultSortOrder
                }
                if (sort.field !== query.sortField || sort.order !== query.sortOrder) {
                  sort.field = query.sortField
                  sort.order = query.sortOrder
                  if (!changed) {
                    changed = true
                  }
                }

                if (changed) {
                  resetPagination()
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

  // timeout to topbar fallback
  setTimeout(function () {
    window.unsetSaveAction()
  }, 200)
}())
