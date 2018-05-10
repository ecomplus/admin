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
  var list = window.tabData[tabId].result

  // setup jsGrid
  $('#' + tabId + '-resource-list').jsGrid({
    autoload: true,
    paging: true,
    pageLoading: true,
    pageButtonCount: 7,
    pagerFormat: '{first} {prev} {pages} {next} {last} {pageIndex} / {pageCount}',
    pagePrevText: '<',
    pageNextText: '>',
    pageFirstText: '<<',
    pageLastText: '>>',
    filtering: true,
    sorting: true,
    confirmDeleting: false,
    rowClick: function (args) {
      var id = args.item._id
      console.log(id)
    },

    controller: {
      loadData: function (filter) {
        return {
          data: list,
          itemsCount: list.length
        }
      }
    },

    fields: [{
      /*
      headerTemplate: function () {
        var el = $('<button>').attr('type', 'button').addClass('btn btn-xs btn-danger')
        el.html('Deletar')
        el.on('click', function () {
          deleteSelectedItems()
        })
        return el
      },
      */
      itemTemplate: function (_, item) {
        var el = $('<input>').attr('type', 'checkbox')
        el.prop('checked', $.inArray(item, selectedItems) > -1)
        el.on('change', function () {
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

  var selectedItems = []

  var selectItem = function (item) {
    selectedItems.push(item)
  }

  var unselectItem = function (item) {
    selectedItems = $.grep(selectedItems, function (i) {
      return i !== item
    })
  }

  var deleteSelectedItems = function () {
    if (!selectedItems.length) return
    var $grid = $('#jsgrid-delete')
    $grid.jsGrid('option', 'pageIndex', 1)
    $grid.jsGrid('loadData')
    selectedItems = []
  }
}())
