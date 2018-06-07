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

  var slug = window.routeParams[0]
  var resourceId = window.routeParams[1]
  var creating
  if (resourceId === 'new') {
    creating = true
  }
  // edit JSON document
  var commit = window.tabCommit[tabId]
  var Data = function () {
    // current data from global variable
    return window.tabData[tabId]
  }

  var $form = elContainer.children('form')
  window.setSaveAction($form, function (cb) {
    var method, uri
    if (creating) {
      uri = slug + '.json'
      method = 'POST'
    } else {
      uri = slug + '/' + resourceId + '.json'
      // overwrite
      method = 'PUT'
    }
    // show loading spinner
    $form.addClass('ajax')

    var callback = function () {
      $form.removeClass('ajax')
      if (typeof cb === 'function') {
        cb(tabId)
      }
    }
    window.callApi(uri, method, callback, Data())
  })

  // count AJAX requests
  var todo = 0
  var done = 0
  var Done = function () {
    done++
    if (done === todo) {
      // ready
      // plugins and addons
      $form.find('.html-editor').summernote()
      $form.find('.tagsinput').tagsinput('items')
      $form.find('select:not(.tags)').selectpicker({
        'style': 'btn-light'
      })

      // treat input values to data properties
      var strToProperty = function ($el, str) {
        str = str.trim()
        if (str !== '') {
          if ($el.data('json')) {
            // value is a JSON string
            var obj
            try {
              obj = JSON.parse(str)
            } catch (e) {
              // ignore invalid JSON
              obj = false
            }
            return obj
          }
        } else {
          return null
        }
        return str
      }

      // setup input events
      $form.find('input[type="text"],select').change(function () {
        var prop = $(this).attr('name')
        if (prop && prop !== '') {
          var data = Data()
          var val = $(this).val()
          var obj

          if (typeof val === 'string') {
            obj = strToProperty($(this), val)
            if (obj) {
              // continue with valid value
              data[prop] = obj
            } else if (obj === null && data.hasOwnProperty(prop)) {
              // empty, remove property
              delete data[prop]
            } else {
              // invalid value or nothing to change
              return
            }
          } else if (Array.isArray(val)) {
            // select multiple
            var array = []
            for (var i = 0; i < val.length; i++) {
              obj = strToProperty($(this), val[i])
              if (obj) {
                // add valid value to array
                array.push(obj)
              }
            }
            if (array.length) {
              data[prop] = array
            } else {
              // empty array
              if (data.hasOwnProperty(prop)) {
                delete data[prop]
              } else {
                // nothing to change
                return
              }
            }
          }

          // global object already changed by reference
          // commit only to perform reactive actions
          commit(data, true)
        }
      })

      // show form
      $form.removeClass('ajax ajax-cards')
    }
  }

  // fill select options (autocomplete)
  $form.find('select').each(function (index) {
    // resource name
    var fill = $(this).data('fill')
    if (fill) {
      todo++
      // array of destination elements
      var $els = [ $(this) ]
      // add select elements with the same options (same resource)
      $form.find('select[data-fill-same="' + $(this).attr('name') + '"]').each(function () {
        $els.push($(this))
      })

      var uri = fill + '.json'
      var fields = $(this).data('properties')
      var object
      if (fields) {
        // object property
        object = true
        uri += '?fields=' + fields
      }

      window.callApi(uri, 'GET', function (err, json) {
        if (!err) {
          // response should be a resource list
          var list = json.result
          if (list) {
            for (var i = 0; i < list.length; i++) {
              var doc = list[i]
              for (var j = 0; j < $els.length; j++) {
                // fill select element with new option
                var value
                if (object) {
                  value = JSON.stringify(doc)
                } else {
                  // string property
                  // use document ID as option value
                  value = doc._id
                }
                $('<option />', { value: value }).text(doc.name).appendTo($els[j])
              }
            }
          }
        }
        Done()
      })
    }
  })
}())
