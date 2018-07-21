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

    // setup predefined grids
    // GMC defaults
    var Grids = {
      'material': {
        'title': 'Material'
      },
      'pattern': {
        'title': i18n({
          'en_us': 'Pattern',
          'pt_br': 'Modelo'
        })
      },
      'size': {
        'title': i18n({
          'en_us': 'Size',
          'pt_br': 'Tamanho'
        })
      },
      'colors': {
        'title': i18n({
          'en_us': 'Color',
          'pt_br': 'Cor'
        })
      }
    }

    // add store custom grids
    window.callApi('grids.json', 'GET', function (err, json) {
      if (!err) {
        for (var i = 0; i < json.result.length; i++) {
          var grid = json.result[i]
          Grids[grid.grid_id] = grid
        }
      }
    })

    var gridsTitles = function () {
      // return strings array with all grids titles
      var titles = []
      for (var gridId in Grids) {
        if (Grids.hasOwnProperty(gridId)) {
          titles.push(Grids[gridId].title)
        }
      }
      return titles
    }

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
        var grid = $(this).val().trim()
        if (grid !== '') {
          // focus on option text input
          $inputOption.focus()

          // save grid ID
          var gridId
          for (var id in Grids) {
            if (Grids.hasOwnProperty(id) && Grids[id].title === grid) {
              // found respective grid object
              gridId = id
              break
            }
          }
          if (!gridId) {
            // grid not found
            // generate new grid ID
            gridId = clearAccents(grid.toLowerCase(), '_')
          }
          $inputGrid.data('grid-id', gridId)
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
        name: 'grids',
        source: substringMatcher(gridsTitles())
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
