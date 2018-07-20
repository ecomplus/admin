/*!
 * Copyright 2018 E-Com Club
 */

(function () {
  'use strict'

  // current tab ID
  var tabId = window.tabId
  var Tab = window.Tabs[tabId]

  // var lang = window.lang
  var i18n = window.i18n

  Tab.continue = function () {
    // get form element from global Tab object
    var $form = Tab.$form

    // generate IDs for each new variation, brand or category
    var idPad = randomObjectId()
    var index = 0

    var $listGrids = $('#' + tabId + '-grids-list')
    // grid li element HTML
    var liGrid = '<div class="row">' +
                   '<div class="col-sm-6 col-md-12 col-lg-6">' +
                     '<div class="input-group mb-10">' +
                       '<div class="input-group-prepend">' +
                         '<button class="btn btn-light" type="button"><i class="fa fa-trash"></i></button>' +
                       '</div>' +
                       '<input class="form-control" type="text">' +
                     '</div>' +
                   '</div>' +
                   '<div class="col-sm-6 col-md-12 col-lg-6 hidden">' +
                     '<select multiple ></select>' +
                   '</div>'

    var addGrid = function (gridObject) {
      // add li element
      var $li = $('<li />', {
        html: liGrid
      })
      $listGrids.append($li)

      // setup li and input elements
      var $text = $li.find('input')
      var $select = $li.find('select')
      $text.keyup(function () {
        if ($(this).val() !== '') {
          $select.parent().slideDown()
        } else {
          $select.parent().slideUp()
        }
      }).change(function () {
        if ($(this).val() !== '') {
          // focus on tags input
          $select.parent().find('input').focus()
        }
      })

      $li.slideDown(400, function () {
        if (!gridObject) {
          // new variation
          $text.focus()
        }
      })
      $select.tagsinput()
    }

    $('#' + tabId + '-add-grid').click(function () {
      addGrid()
    })

    // generate new random SKU
    $('#' + tabId + '-random-sku').click(function () {
      var sku = ''
      // start always with uppercase letters
      var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      for (var i = 0; i < 3; i++) {
        sku += letters.charAt(Math.floor(Math.random() * letters.length))
      }
      // random digits
      sku += randomInt(10000, 99999)
      $(this).closest('.input-group').find('input').val(sku).trigger('change')
    })

    setTimeout(function () {
      var addOption = function ($select, term) {
        // add option to select
        var optionValue = function (objectId) {
          return JSON.stringify({
            _id: objectId,
            name: term
          })
        }

        var $option = $('<option />', {
          text: term,
          selected: true,
          value: optionValue(objectIdPad(idPad, '' + index))
        })
        // refresh the picker plugin
        // trigger change to handle commit and save action
        $select.append($option).selectpicker('refresh').trigger('change')
        index++

        // create resource document
        var slug = $select.attr('name')
        var callback = function (err, json) {
          if (!err) {
            // update option value
            $option.val(optionValue(json._id))
            $select.trigger('change')
          }
        }
        window.callApi(slug + '.json', 'POST', callback, { name: term })
      }

      $form.find('select[name="brands"],select[name="categories"]').each(function () {
        var $dropdown = $(this).prev('.dropdown-menu')
        if ($dropdown.length) {
          var $select = $(this)

          // listen keydown event on search input
          // detect when search have no results
          $dropdown.find('.bs-searchbox input').keydown(function () {
            var $input = $(this)
            // wait for search processing
            setTimeout(function () {
              var $li = $dropdown.find('.dropdown-menu > .no-results')
              if ($li.length) {
                // no results
                // create 'add option' button
                var $btn = $('<button />', {
                  'class': 'btn btn-outline btn-secondary btn-sm btn-block',
                  type: 'button',
                  html: '<i class="fa fa-plus"></i> ' + i18n({
                    'en_us': 'Add',
                    'pt_br': 'Adicionar'
                  }),
                  click: function () {
                    addOption($select, $input.val())
                  }
                })
                $li.html($btn)
              }
            }, 300)
          })
        }
      })
    }, 400)

    // ready to setup and show form
    Tab.formSetup()
  }
}())
