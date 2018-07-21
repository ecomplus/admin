/*!
 * Copyright 2018 E-Com Club
 */

(function () {
  'use strict'

  // current tab ID
  var tabId = window.tabId
  var Tab = window.Tabs[tabId]
  // edit JSON document
  // var commit = Tab.commit
  var Data = function () {
    // current data from global variable
    return Tab.data
  }

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
    var liGrid = '<div class="row gap-2">' +
                    '<div class="col-6">' +
                      '<div class="flexbox align-items-center">' +
                        '<div class="i-drag"></div>' +
                        '<div class="input-group">' +
                          '<div class="input-group-prepend">' +
                            '<button class="btn btn-light remove-grid" type="button">' +
                              '<i class="fa fa-trash"></i>' +
                            '</button>' +
                          '</div>' +
                          '<input class="form-control" type="text" name="grid" placeholder="' + i18n({
                            'en_us': 'Size',
                            'pt_br': 'Tamanho'
                          }) + '">' +
                        '</div>' +
                      '</div>' +
                    '</div>' +
                    '<div class="col-6 hidden option-block">' +
                      '<div class="input-group">' +
                        '<input class="form-control" type="text" name="option" placeholder="GG">' +
                        '<div class="input-group-append">' +
                          '<button class="btn btn-light add-option" type="button">' +
                            '<i class="fa fa-plus"></i>' +
                          '</button>' +
                        '</div>' +
                      '</div>' +
                    '</div>' +
                 '</div>' +
                 '<ul class="hide-empty badges-list"></ul>'

    var countGrids = 0
    var addGrid = function (gridObject) {
      var $emptyGrid = $listGrids.find('input[name="grid"]').filter(function () { return $(this).val() === '' })
      if ($emptyGrid.length) {
        // focus on empty input
        // does not add new grid
        $emptyGrid.focus()
        return
      }

      // add li element
      var $li = $('<li />', {
        html: liGrid
      })
      $listGrids.append($li)

      // setup li and input elements
      var $inputGrid = $li.find('input[name="grid"]')
      var $blockOption = $li.find('.option-block')
      var $inputOption = $blockOption.find('input[name="option"]')
      // enable option input after grid only
      var optionDisabled = true

      $inputGrid.change(function () {
        if ($(this).val() !== '') {
          // focus on option text input
          $inputOption.focus()
        } else {
          // clear option
          $inputOption.val('')
          if (countGrids > 1) {
            // remove empty grid from list
            removeGrid($li)
          }
        }
      })

      .keyup(function () {
        if ($inputGrid.val() !== '') {
          // grid name not empty
          if (optionDisabled) {
            // enable to add the grid options
            $blockOption.fadeIn()
            optionDisabled = false
            if (countGrids === 1) {
              $('#' + tabId + '-add-option-header').fadeIn()
            }
          }
        } else if (!optionDisabled) {
          // grid name empty
          $blockOption.fadeOut()
          optionDisabled = true
          if (countGrids === 1) {
            $('#' + tabId + '-add-option-header').fadeOut()
          }
        }
      })
      .keydown(function (e) {
        switch (e.which) {
          // tab, enter
          case 9:
          case 13:
            setTimeout(function () {
              $inputGrid.trigger('change')
            }, 100)
            break
        }
      })

      $inputOption.keydown(function (e) {
        switch (e.which) {
          // tab
          case 9:
            setTimeout(function () {
              $inputGrid.focus()
            }, 100)
            break
          // enter
          case 13:
            addGridOption($li, $inputOption)
            break
        }
      })

      $inputGrid.typeahead({
        hint: true,
        highlight: true,
        minLength: 1
      }, {
        name: 'states',
        source: substringMatcher(states)
      })

      // setup remove button
      $li.find('.remove-grid').click(function () {
        removeGrid($li)
      })
      // add button
      $li.find('.add-option').click(function () {
        addGridOption($li, $inputOption)
      })

      countGrids++
      if (countGrids === 1) {
        // first added grid
        $('#' + tabId + '-grids-list-header').slideDown()
      }
      // show added list element
      $li.slideDown(400, function () {
        if (!gridObject) {
          // new variation
          $inputGrid.focus()
        }
      })
    }

    var addGridOption = function ($li, $inputOption) {
      // add options to grid
      // multiple options should be separated with comma
      var options = $inputOption.val().split(',')
      for (var i = 0; i < options.length; i++) {
        var option = options[i].trim()
        if (option !== '') {
          var $liOption = $('<li />', {
            html: '<span class="i-drag white"></span>' + option + '<i class="fa fa-times"></i>'
          })
          $li.find('.badges-list').append($liOption)
          // setup remove icon
          $liOption.find('.fa-times').click(function () {
            $liOption.remove()
          })
        }
      }
    }

    $('#' + tabId + '-add-grid').click(function () {
      addGrid()
    })

    var removeGrid = function ($li) {
      // remove list element of respective grid
      $li.slideUp(400, function () {
        $(this).remove()
      })
      countGrids--
      if (countGrids === 0) {
        // all grids removed
        // list is empty, hide list header
        $('#' + tabId + '-grids-list-header, #' + tabId + '-add-option-header').slideUp()
      }
    }

    var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
      'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
      'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
      'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
      'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
      'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
      'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
      'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
      'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']

    var substringMatcher = function (strs) {
      return function findMatches (q, cb) {
        var matches, substrRegex
        // an array that will be populated with substring matches
        matches = []
        // regex used to determine if a string contains the substring `q`
        substrRegex = new RegExp(q, 'i')
        // iterate through the pool of strings and for any string that
        // contains the substring `q`, add it to the `matches` array
        $.each(strs, function (i, str) {
          if (substrRegex.test(str)) {
            matches.push(str)
          }
        })
        cb(matches)
      }
    }

    var $inputSku = $form.find('input[name="sku"]')
    $inputSku.click(function () {
      // select all input text
      $(this).select()
    })

    // generate new random SKU
    var randomSku = function () {
      var sku = ''
      // start always with uppercase letters
      var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      for (var i = 0; i < 3; i++) {
        sku += letters.charAt(Math.floor(Math.random() * letters.length))
      }
      // random digits
      sku += randomInt(10000, 99999)
      $inputSku.val(sku).trigger('change')
    }
    $('#' + tabId + '-random-sku').click(randomSku)

    if (!Data().sku) {
      // generate the SKU previously
      var firstSku = function () {
        randomSku()
        // run once only
        // remove the event handler
        $form.off('change', 'input[name="name"]', firstSku)
      }
      $form.on('change', 'input[name="name"]', firstSku)
    }

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

    $form.find('input[name="name"]').attr('placeholder', i18n({
      'en_us': 'Long Sleeve Polo Shirt',
      'pt_br': 'Camisa Polo Manga Longa'
    }))
    // ready to setup and show form
    Tab.formSetup()
  }
}())
