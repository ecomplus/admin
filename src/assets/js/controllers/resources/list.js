/*!
 * Copyright 2018 E-Com Club
 */

 export const handleList = () => {
  var tabId = window.tabId
  var Tab = window.Tabs[tabId]
  var elContainer = $('#t' + tabId + '-tab-normal')
  // prefix tab ID on content elements IDs
  window.renderContentIds(elContainer)

  // var lang = window.lang
  var i18n = window.i18n
  var appTab = $('#app-tab-' + tabId)

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
        if (deepObj !== null && Array.isArray(deepObj)) {
          for (var i = 0; i < deepObj.length; i++) {
            for (var deepProp in deepObj[i]) {
              if (deepObj[i].hasOwnProperty(deepProp)) {
                // assign to object
                // using / to separate properties because jsGrid converts dot notation
                newDoc[prop + '/' + deepProp] = deepObj[i][deepProp]
              }
            }
          }
        }
        if (typeof deepObj === 'object' && deepObj !== null && !Array.isArray(deepObj)) {
          // is object
          // go deeper
          for (deepProp in deepObj) {
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

    if (resourceSlug === 'orders') {
      $grid.before('<div class="flexbox mb-20 pull-right"><div class="dropdown" id="orders-bulk-action">' +
    '    <button class="btn btn-success order-selected" id="orders-selected" type="button" data-toggle="">' +
    '      <i class="fa fa-pencil"></i>' +
    '      <span class="i18n">' +
    '        <span data-lang="en_us">' +
    '          Shipping <span class="hidden-md-down">tags</span>' +
    '        </span>' +
    '        <span data-lang="pt_br">' +
    '          Etiquetas <span class="hidden-md-down">de envio</span>' +
    '        </span>' +
    '      </span>' +
    '    </button>' +
    '    <div class="dropdown-menu">' +
    '      <a href="javascript:;" class="dropdown-item" id="correios">' +
    '        <span class="i18n">' +
    '          <span data-lang="en_us">Shipping tag</span>' +
    '          <span data-lang="pt_br">Etiqueta dos correios</span>' +
    '        </span>' +
    '      </a>' +
    '      <a href="javascript:;" id="standart" class="dropdown-item">' +
    '        <span class="i18n">' +
    '          <span data-lang="en_us">Standart tag</span>' +
    '          <span data-lang="pt_br">Etiqueta padrão</span>' +
    '        </span>' +
    '      </a>' +
    '    </div>' +
    '  </div></div>')
      var $tagShipping = appTab.find('#orders-selected')
      $tagShipping.click(function () {
        if (!Tab.selectedItems.length > 0) {
          app.toast(i18n({
            'en_us': 'No orders selected',
            'pt_br': 'Nenhum pedido selecionado'
          }))
        } else {
          $tagShipping.attr('data-toggle', 'dropdown')
        }
      })
      appTab.find('#correios').click(function () {
        if (Tab.selectedItems.length === 1) {
          window.location.href = '/#/tag/' + Tab.selectedItems[0]
        } else if (Tab.selectedItems.length > 4) {
          app.toast(i18n({
            'en_us': 'Only 4 orders allowed',
            'pt_br': 'Apenas 4 pedidos permitidos'
          }))
        } else {
          window.location.href = '/#/tag/' + Tab.selectedItems
        }
      })
      appTab.find('#standart').click(function () {
        if (Tab.selectedItems.length < 10) {
          window.location.href = '/#/tagstandart/' + Tab.selectedItems
        } else {
          app.toast(i18n({
            'en_us': 'Only 9 orders allowed',
            'pt_br': 'Apenas 9 pedidos permitidos'
          }))
        }
      })
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

    // select items from list to delete and edit
    var editing = false
    var selectItem = function (id) {
      Tab.selectedItems.push(id)
      if (!editing) {
        editing = true
        toggleEditing()
      }
    }
    var unselectItem = function (id) {
      Tab.selectedItems = $.grep(Tab.selectedItems, function (i) {
        return i !== id
      })
      // disable edit if there are no more items selected
      if (!Tab.selectedItems.length && editing) {
        editing = false
        toggleEditing()
      }
    }

    // icon to search with filters or edit selected items
    var $filtersIcon = $('<i>', {
      click: function () {
        // reload data with current filters
        $grid.jsGrid('loadData')
      }
    })
    var toggleEditing = function () {
      $filtersIcon.attr('class', 'fa fa-' + (!editing ? 'search' : 'pencil text-primary'))
      // disable range filters when editing
      $grid.find('.data-list-range').attr('disabled', editing)
    }
    toggleEditing()

    // delete and edit event effects
    Tab.editItemsCallback = function () {
      // show spinner and let it to fade out after list reload
      $grid.find('.loading').show()
      // returns callback for delete or edit end
      return function () {
        // reload list
        forceReload = true
        // reset data status
        dataUpdated = false
        $grid.jsGrid(editing ? 'clearFilter' : 'loadData')
        // unckeck if checked
        $grid.find('.checkbox-all:checked').next().click()
        // disable editing state
        editing = false
        toggleEditing()
      }
    }

    // http://js-grid.com/docs/#grid-fields
    var fields = []
    // setup resource specific fields
    // get from first resource object properties
    var fieldsList = []
    var bulkEditFields = []

    // load lists configuration JSON
    $.getJSON('json/misc/config_lists.json', function (json) {
      debugger;
      var config = json[resourceSlug]
      if (config) {
        fields.push({
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

          // filter buttons and loading spinner
          filterTemplate: function () {
            var $filter = $('<div>', {
              class: 'data-list-control-buttons',
              html: [
                $filtersIcon,
                $('<i>', {
                  class: 'fa fa-filter',
                  click: function () {
                    // clear filters and reload
                    $grid.jsGrid('clearFilter')
                  }
                })
              ]
            })
            // simple loading spinner
            var $loading = '<div class="spinner-circle-shadow loading"></div>'
            return $('<div>', {
              class: 'data-list-control',
              html: [ $filter, $loading ]
            })
          },

          // checkbox to select current row item
          itemTemplate: function (_, item) {
            var el = $(elCheckbox)
            var id = item._id
            var $checkbox = el.find('input')
            if ($.inArray(id, Tab.selectedItems) > -1) {
              // item already selected
              $checkbox.prop('checked', true)
            }
            row++
            el.attr('title', '#' + (offset + row))
            $checkbox.on('change', function () {
              $(this).is(':checked') ? selectItem(id) : unselectItem(id)
            })

            var hiddenFields = config._hidden_fields
            if (!hiddenFields) {
              // no hidden info
              // create the column with checkbox only
              return el
            }

            // add accordion for hidden fields
            var hiddenEls = []
            for (var i = 0; i < hiddenFields.length; i++) {
              var field = hiddenFields[i]
              if (item[field] !== undefined) {
                if (Array.isArray(item[field])) {
                  if (config[field] && config[field].template) {
                    // handle nested objects
                    for (var ii = 0; ii < item[field].length; ii++) {
                      var nested = item[field][ii]
                      var template = config[field].template
                      for (var prop in nested) {
                        if (nested.hasOwnProperty(prop)) {
                          // replace variables on string HTML template
                          var regex = new RegExp('{{' + prop + '}}', 'g')
                          template = template.replace(regex, nested[prop])
                        }
                      }
                      // replace variables not matched
                      template = template.replace(/{{\S+}}/g, ' - ')

                      // add parsed template to hidden elements
                      hiddenEls.push($('<div>', {
                        html: template
                      }))
                    }
                  }
                } else {
                  // simple string or number field
                  var text = item[field]
                  if (config[field].type === 'money') {
                    text = formatMoney(text)
                  } else if (typeof text === 'boolean') {
                    // parse to 'yes' or 'no'
                    text = i18n(text)
                  }

                  // add span element with text content
                  hiddenEls.push($('<span>', {
                    text: i18n(config[field].label) + ': ' + text
                  }))
                }
              }
            }

            // setup hidden div
            var $hidden = $('<div>', {
              'class': 'data-list-accordion',
              html: hiddenEls
            })

            return $('<div>', {
              'class': 'data-list-extend',
              html: [
                el,
                // icon to toggle accordion with extended row info
                $('<i>', {
                  'class': 'ti-angle-down'
                }).one('click', function () {
                  $(this).closest('tr').append($hidden)
                }).click(function (e) {
                  // prevent redirect
                  e.stopPropagation()
                  var $i = $(this)
                  $hidden.slideToggle(400, function () {
                    // update icon
                    $i.attr('class', $(this).is(':visible') ? 'ti-angle-up' : 'ti-angle-down')
                  })
                })
              ]
            })
          }
        })

        var filterRange = function (fieldObj, inputMask) {
          // handle filter by range
          // for numbers only
          fieldObj.filterTemplate = function () {
            // hidden input to handle jsGrid hardcoded filterControl property
            var $hidden = $('<input>', { type: 'hidden' })
            var setValue = function () {
              var min = $min.data('value') || $min.val() || ''
              var max = $max.data('value') || $max.val() || ''
              $hidden.val(min !== '' || max !== '' ? min + '>>' + max : '')
              // reload data with new filter value
              $grid.jsGrid('loadData')
            }
            this.filterControl = $hidden

            // inputs for min and max values
            var inputsOpts = {
              'class': 'data-list-range',
              keydown: function (e) {
                switch (e.which) {
                  // enter
                  case 13:
                    $(this).trigger('change')
                    break
                }
              },
              type: 'tel',
              placeholder: i18n({
                'en_us': 'min',
                'pt_br': 'mín'
              })
            }
            var $min = $('<input>', inputsOpts)
            var $max = $('<input>', Object.assign(inputsOpts, {
              placeholder: i18n({
                'en_us': 'max',
                'pt_br': 'máx'
              })
            }))

            if (typeof inputMask === 'function') {
              // setup custom mask or pickers for inputs
              inputMask($min, 0)
              inputMask($max, 1)
            }
            // set hidden input value on range inputs change events
            $min.change(setValue)
            $max.change(setValue)
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
            if (field !== '_id') {
              fieldObj.itemTemplate = function (text, item) {
                if (text && item) {
                  return $('<a>', {
                    text: text,
                    href: baseHash + item._id
                  })
                }
              }
            } else {
              // show row counter
              fieldObj.itemTemplate = function (id) {
                if (id) {
                  return $('<a>', {
                    text: '#' + row,
                    href: baseHash + id
                  })
                }
              }

              // simple header for counter row
              fieldObj.title = '#'
              fieldObj.filtering = false
              fieldObj.sorting = false
              // force specific col width
              fieldOpts.width = 60
            }
          } else {
            // custom item template by field type
            if (fieldOpts.templat) {
              fieldObj.itemTemplate = function (item) {
                if (item) {
                  return item
                }
              }
            }
            if (fieldOpts.templates) {
              fieldObj.itemTemplate = function (item) {
                if (item) {
                  return item
                }
              }
            }
            switch (fieldOpts.type) {
              case 'link':
                fieldObj.itemTemplate = function (text) {
                  if (text) {
                    // parse to HTML link
                    var ln = text.length
                    return $('<a>', {
                      text: (ln > 32 ? text.substr(0, 12) + '...' + text.substr(ln - 20) : text),
                      href: text.indexOf('@') === -1 ? text : 'mailto:' + text,
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
                    if (value !== undefined) {
                      return genElement(typeof value === 'string' ? value : value.toString())
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
                fieldObj.itemTemplate = function (text) {
                  return formatMoney(text)
                }
                // filter by money value range
                filterRange(fieldObj, function ($input) {
                  // mask currency inputs
                  // true to keep original placeholders
                  $input.inputMoney(true)
                  // add change event handler to parse input value to number
                  $input.change(function () {
                    $(this).data('value', stringToNumber($(this).val()))
                  })
                })
                break
            }
          }

          if (fieldOpts.cut_string) {
            // max chars of string to fill well inside column
            (function (maxLength) {
              var templateFn = fieldObj.itemTemplate
              fieldObj.itemTemplate = function (text, item) {
                if (text) {
                  // call previous item template function if any
                  var out = typeof templateFn === 'function' ? templateFn(text, item) : text
                  if (text.length >= maxLength) {
                    var abbr = '<abbr title="' + text + '">' + cutString(text, maxLength) + '</abbr>'
                    if (typeof out !== 'string') {
                      // jQuery object
                      // update element HTML content
                      out.html(abbr)
                    } else {
                      out.replace(text, abbr)
                    }
                  }
                  return out
                }
              }
            }(fieldOpts.cut_string))
          }

          if (fieldOpts.width) {
            // set fixed width
            fieldObj.css = 'data-list-fixed'
            fieldObj.width = fieldOpts.width
          }
          if (fieldOpts.range) {
            // filter by number range
            filterRange(fieldObj)
          } else {
            // enable bulk edit for current field
            bulkEditFields.push(field)
          }

          fields.push(fieldObj)
          if (fieldObj.filtering !== false) {
            // starts with no filtering
            filters[field] = ''
          }
        }
      }

      // setup date fields common to all resources lists
      var dateField = function (field, list, bold) {
        // add to fields list and filter object
        filters[field] = ''
        fieldsList.push(field)

        // handle created and updated at date
        var fieldOpts = {
          name: field,
          type: 'text',
          title: i18n(json._labels[field]),
          css: 'data-list-fixed',
          // larger col when text is bold
          width: bold ? 110 : 90,
          // show formatted date possibly with time
          itemTemplate: function (dateString) {
            var text = dateString ? formatDate(dateString, list) : dateString
            if (bold) {
              // greater font weight
              return $('<span>', {
                text: text,
                class: 'fw-400'
              })
            } else {
              return text
            }
          }
        }

        // filter by date range
        filterRange(fieldOpts, function ($input, index) {
          // add change event handler to parse value to date and time UTC string
          $input.change(function () {
            var date = $(this).datepicker('getDate')
            if (date && !isNaN(date.getTime())) {
              // valid date
              if (index === 1) {
                // range max
                // set time to end of day
                date.setHours(23, 59, 59)
              }
              $(this).data('value', date.toISOString())
            }
          })

          // ignore the first input to setup picker for both once only
          if (index === 1) {
            // delay to setup picker after element added to DOM
            setTimeout(function () {
              var $parent = $input.parent()
              // setup datepicker
              $parent.datepicker({
                // config date range with two inputs
                inputs: $parent.children('input')
              })
            }, 300)
          }
        })
        return fieldOpts
      }

      // created at with date only
      var createdAt = dateField('created_at')
      // updated at with resumed date and time info
      // bold = true
      var updatedAt = dateField('updated_at', [ 'day', 'month', 'hour', 'minute' ], true)
      fields.push(createdAt, updatedAt)

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
                case 'ABBR':
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
                var edited = false
                var field

                if (!editing) {
                  for (field in filters) {
                    if (filters.hasOwnProperty(field) && query[field] !== filters[field]) {
                      filters[field] = query[field]
                      if (!changed) {
                        changed = true
                      }
                    }
                  }
                } else {
                  // handle bulk items edit
                  var data = {}
                  for (var i = 0; i < bulkEditFields.length; i++) {
                    field = bulkEditFields[i]
                    if (query[field] !== '') {
                      // parse boolean values
                      switch (query[field]) {
                        case 'true':
                          query[field] = true
                          break
                        case 'false':
                          query[field] = false
                          break
                      }

                      // check for nested properties
                      var paths = field.split('/')
                      var prop = paths[0]
                      if (paths.length > 1) {
                        // parse to nested objects
                        data[prop] = {}
                        var ii = 1
                        var nested = data[prop]
                        while (ii < paths.length - 1) {
                          nested[paths[ii]] = {}
                          ii++
                        }
                        nested[paths[ii]] = query[field]
                      } else {
                        data[prop] = query[field]
                      }
                    }
                  }

                  // check if there are modifications and call API
                  if (Object.keys(data).length) {
                    Tab.editItems(data)
                    edited = true
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
                } else if (editing && !edited) {
                  // click on pencil icon without any changed input (?)
                  app.toast(i18n({
                    'en_us': 'Edit the header fields to modify the selected items',
                    'pt_br': 'Edite os campos no cabeçalho para alterar os itens selecionados'
                  }))
                }
              } else {
                // force reload data
                load()
                forceReload = false
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
  } else {
    // no resource objects
  }

  // timeout to topbar fallback
  setTimeout(function () {
    window.unsetSaveAction()
  }, 200)
 }