export default function () {
  const { $, i18n, localStorage } = window
  // current tab ID
  const tabId = window.tabId
  const Tab = window.Tabs[tabId]
  const elContainer = $('#t' + tabId + '-tab-normal')
  // prefix tab ID on content elements IDs
  window.renderContentIds(elContainer)
  const baseHash = '/' + window.location.hash.replace(/\?.*$/, '') + '/'
  // create button
  $('#t' + tabId + '-create').click(function () {
    // go to 'new' route
    window.location = baseHash + 'new'
  })

  const dictionary = {
    myUser: i18n({
      en_us: 'my user',
      pt_br: 'meu usuário'
    })
  }

  // resource list data
  const resourceSlug = Tab.slug
  let data, list, load

  const updateData = function () {
    data = Tab.data
    // map deeper objects
    list = data.result.map(function (doc, index) {
      const newDoc = { _index: index }
      for (const prop in doc) {
        const deepObj = doc[prop]
        if (deepObj !== null && Array.isArray(deepObj)) {
          for (let i = 0; i < deepObj.length; i++) {
            for (const deepProp in deepObj[i]) {
              if (deepObj[i][deepProp] !== undefined) {
                // assign to object
                // using / to separate properties because jsGrid converts dot notation
                newDoc[prop + '/' + deepProp] = deepObj[i][deepProp]
              }
            }
          }
        }
        if (typeof deepObj === 'object' && deepObj !== null && !Array.isArray(deepObj)) {
          // is object
          const goDeeper = (loopObj, prop) => {
            for (const deepProp in loopObj) {
              if (loopObj[deepProp] !== undefined) {
                // assign to object
                // using / to separate properties because jsGrid converts dot notation
                const newProp = prop + `/${deepProp}`
                if (
                  typeof loopObj[deepProp] === 'object' &&
                  loopObj[deepProp] &&
                  !Array.isArray(loopObj[deepProp])
                ) {
                  goDeeper(Object.assign({}, loopObj[deepProp]), newProp)
                } else {
                  newDoc[newProp] = loopObj[deepProp]
                }
              }
            }
          }
          goDeeper(Object.assign({}, deepObj), prop)
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
    const elCheckbox = '<div class="custom-controls-stacked">' +
                       '<div class="custom-control custom-checkbox">' +
                         '<input type="checkbox" class="custom-control-input" />' +
                         '<label class="custom-control-label"> </label>' +
                       '</div>' +
                     '</div>'

    // setup jsGrid
    const $grid = $('#t' + tabId + '-authentication-list')
    // current grid row
    let row = 0
    // offset and limit
    // control pagination
    let offset = 0
    let limit
    if (data.meta.limit) {
      limit = data.meta.limit
    } else {
      // default ?
      limit = 1000
    }

    // current list filters
    const filters = {}

    // control pagination
    const updatePage = function (page) {
      if (typeof page !== 'number' || isNaN(page) || page < 1) {
        // fix page number
        page = 1
      }
      offset = (page - 1) * limit
      // reload data
      load()
    }
    const increasePage = function (x) {
      const el = $('#t' + tabId + '-page')
      // change page number
      const page = parseInt(el.val(), 10) + x
      if (page > 0) {
        updatePage(page)
        el.val(page)
      }
    }

    const paginationControls = function () {
      // update pagination buttons states
      const $prev = $('#t' + tabId + '-prev')
      const $next = $('#t' + tabId + '-next')
      const $page = $('#t' + tabId + '-page')
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

    const resetPagination = function () {
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
      const val = parseInt($(this).val(), 10)
      if (!isNaN(val) && val > 0) {
        limit = val
        // reset
        offset = 0
        $('#t' + tabId + '-page').val('1')
      }
      // reload data
      load()
    })

    let dataUpdated = false
    let forceReload = false
    // control request queue
    let loading = false
    let waiting = false
    load = function (cb) {
      if (!loading) {
        loading = true
        let $loading
        if (!cb) {
          $loading = $grid.find('.loading')
          $loading.show()
        }

        // mount API request query string
        // https://ecomstore.docs.apiary.io/#introduction/overview/url-params
        let params = 'limit=' + limit
        if (offset > 0) {
          params += '&offset=' + offset
        }

        const callback = function (err) {
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
    let editing = false
    const selectItem = function (id) {
      Tab.selectedItems.push(id)
    }
    const unselectItem = function (id) {
      Tab.selectedItems = $.grep(Tab.selectedItems, function (i) {
        return i !== id
      })
    }

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
      }
    }

    // http://js-grid.com/docs/#grid-fields
    const fields = []
    // setup resource specific fields
    // get from first resource object properties
    const fieldsList = []

    // load lists configuration JSON
    import(/* webpackChunkName: "data_misc_config-lists" */ '@/data/misc/config-lists')
      .then(exp => {
        const myId = localStorage.getItem('my_id')
        const json = exp.default
        const config = json[resourceSlug]
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
              const el = $(elCheckbox)
              el.find('input').addClass('checkbox-all').on('change', function () {
                const selector = $(this).is(':checked') ? ':not(:checked)' : ':checked'
                // run function async to prevent break with big lists
                const $loading = $grid.find('.loading')
                $loading.show()
                setTimeout(function () {
                  $grid.find('.data-list-check input' + selector).next().click()
                  $loading.hide()
                }, 50)
                return true
              })
              return el
            },

            // checkbox to select current row item
            itemTemplate: function (_, item) {
              const el = $(elCheckbox)
              const id = item._id
              const $checkbox = el.find('input')
              if ($.inArray(id, Tab.selectedItems) > -1) {
                // item already selected
                $checkbox.prop('checked', true)
              }
              row++
              el.attr('title', '#' + (offset + row))
              $checkbox.on('change', function () {
                $(this).is(':checked') ? selectItem(id) : unselectItem(id)
              })

              return el
            }
          })

          for (let i = 0; i < config._fields.length; i++) {
            const field = config._fields[i]
            const fieldOpts = config[field] || {}
            // add to fields list
            fieldsList.push(field)
            const fieldObj = {
              name: field,
              type: 'text',
              title: i18n(fieldOpts.label || json._labels[field]),
              css: ''
            }

            if (i === 0) {
              // first column
              // link to edit resource
              if (field !== '_id') {
                fieldObj.itemTemplate = function (text, item) {
                  if (text && item) {
                    const isMyUsername = item._id === myId
                    if (field === 'username' && isMyUsername) {
                      text += ` (${dictionary.myUser})`
                    }
                    let className
                    const title = `#${text}`
                    return $('<a>', {
                      class: className,
                      title,
                      text,
                      href: baseHash + item._id
                    })
                  }
                }
              }
            } else {
              // custom item template by field type
              if (fieldOpts.templates) {
                fieldObj.itemTemplate = function (item) {
                  if (item) {
                    return item
                  }
                }
              }
              fieldObj.itemTemplate = function (text) {
                if (text) {
                  // parse to HTML link
                  return $('<a>', {
                    text,
                    href: text.indexOf('@') === -1 ? text : 'mailto:' + text,
                    target: '_blank'
                  })
                }
              }
            }

            const extraField = fieldOpts.extra_field
            if (extraField) {
              // additional field on same column
              const { itemTemplate } = fieldObj
              if (itemTemplate) {
                fieldObj.itemTemplate = function (text, item) {
                  if (item[extraField]) {
                    const content = extraField.endsWith('email')
                      ? `<a href="mailto:${item[extraField]}" target="_blank">${item[extraField]}</a>`
                      : item[extraField]
                    return [
                      itemTemplate(text, item),
                      `<br><small title="${item[extraField]}">${content}</small>`
                    ]
                  } else {
                    return itemTemplate(text, item)
                  }
                }
              } else {
                fieldObj.itemTemplate = function (text, item) {
                  return text + (item[extraField] ? ` <small>${item[extraField]}</small>` : '')
                }
              }
              fieldObj.css += ' data-list-multi'
              if (fieldObj.css.indexOf('text-truncate') === -1) {
                fieldObj.css += ' text-truncate'
              }
            }

            fields.push(fieldObj)
            if (fieldObj.filtering !== false) {
              // starts with no filtering
              filters[field] = ''
            }
          }
        }

        $grid.jsGrid({
          // http://js-grid.com/docs/
          autoload: true,
          confirmDeleting: false,
          pageLoading: true,
          pageSize: limit,

          // treat click on row
          // select item or redirect to document edit page
          rowClick: function (args) {
            const event = args.event.originalEvent || args.event
            if (event) {
              // check clicked element
              const elClicked = event.target
              if (elClicked) {
                switch (elClicked.nodeName) {
                  case 'TD':
                    // check if is the first cell (delete)
                    for (let i = 0; i < elClicked.classList.length; i++) {
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
            const item = args.item
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
                  const result = Tab.data.result
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
                  let changed = false
                  let field

                  if (!editing) {
                    for (field in filters) {
                      if (filters[field] !== undefined && query[field] !== filters[field]) {
                        filters[field] = query[field]
                        if (!changed) {
                          changed = true
                        }
                      }
                    }
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

          fields
        })
      })
      .catch(console.error)
  } else {
    // no resource objects
    $(`#t${tabId}-nav .edit-btn[data-list]`).fadeOut()
  }

  // timeout to topbar fallback
  setTimeout(function () {
    window.unsetSaveAction()
  }, 200)
}
