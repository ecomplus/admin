/*!
 * Copyright 2018 E-Com Club
 */

(function () {
  'use strict'

  // current tab ID
  var tabId = window.tabId
  var Tab = window.Tabs[tabId]
  // edit JSON document
  var commit = Tab.commit
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
    // save grids and options in use
    var gridsOptions = {}

    // add store custom grids
    window.callApi('grids.json?fields=title,grid_id,options', 'GET', function (err, json) {
      if (!err) {
        for (var i = 0; i < json.result.length; i++) {
          var grid = json.result[i]
          var normalizedTitle = normalizeString(grid.title)
          // check duplicated grids
          for (var gridId in Grids) {
            if (Grids.hasOwnProperty(gridId)) {
              if (gridId !== grid.grid_id && normalizeString(Grids[gridId].title) === normalizedTitle) {
                delete Grids[gridId]
              }
            }
          }
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

    var optionsTitles = function (gridId) {
      // return strings array with all grid options titles
      var titles = []
      if (Grids[gridId]) {
        // Ref.: https://ecomstore.docs.apiary.io/#reference/grids/grid-object
        var options = Grids[gridId].options
        if (options !== undefined) {
          for (var i = 0; i < options.length; i++) {
            titles.push(options[i].text)
          }
        }
      }
      return titles
    }

    var Typeahead = function ($el, name, source) {
      // abstraction to setup typeahead addon
      // input autocomplete
      $el.typeahead({
        hint: true,
        highlight: true,
        minLength: 1
      }, {
        name: name,
        source: source
      })
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

    // handle grids sorting
    // https://github.com/RubaXa/Sortable
    window.Sortable.create($listGrids[0], {
      onUpdate: function (e) {
        // console.log(e)
        // move array elements
        // object to array, then mount object reordered again
        var gridsArray = Object.keys(gridsOptions)
        var x = gridsArray.splice(e.oldIndex, 1)[0]
        if (x) {
          gridsArray.splice(e.newIndex, 0, x)
        }
        var GridsOptions = {}
        for (var i = 0; i < gridsArray.length; i++) {
          var gridId = gridsArray[i]
          GridsOptions[gridId] = gridsOptions[gridId]
        }
        gridsOptions = GridsOptions

        // update variations
        generateVariations()
      }
    })

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
      // predefined options for autocomplete
      var options = []
      // save grid ID
      var gridId
      // prevent grid event duplication
      var gridOnChange

      $inputGrid.change(function () {
        if (gridOnChange) {
          // event is already running
          return
        }

        gridOnChange = true
        var grid = $(this).val().trim()
        if (grid !== '') {
          // save grid ID
          var oldGridId
          if (gridId) {
            oldGridId = gridId
          }
          // generate new grid ID
          gridId = normalizeString(grid)
          // try to match with defined grids titles
          for (var id in Grids) {
            if (Grids.hasOwnProperty(id) && normalizeString(Grids[id].title) === gridId) {
              // found respective grid object
              gridId = id
              break
            }
          }

          if (oldGridId !== gridId) {
            // update options for autocomplete
            options = optionsTitles(gridId)
            // console.log(gridId, options)

            if (gridsOptions.hasOwnProperty(gridId)) {
              // grid already in use
              var idAux = 2
              while (gridsOptions.hasOwnProperty(gridId + '_' + idAux)) {
                idAux++
              }
              gridId += '_' + idAux
            }
            if (oldGridId) {
              gridsOptions[gridId] = gridsOptions[oldGridId]
              delete gridsOptions[oldGridId]
            } else {
              // setup options array
              gridsOptions[gridId] = []
            }
            $(this).data('grid-id', gridId)
          }

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

        // event done
        setTimeout(function () {
          gridOnChange = false
        }, 100)
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
            if (!gridOnChange) {
              setTimeout(function () {
                $inputGrid.trigger('change')
              }, 100)
            }
            break
        }
      })

      $inputOption.click(function () {
        // select all text content to facilitate
        $(this).select()
      })

      .keydown(function (e) {
        switch (e.which) {
          // tab
          case 9:
            setTimeout(function () {
              $inputGrid.focus()
            }, 100)
            break
          // enter
          case 13:
            addGridOption($li, $inputOption, gridId)
            break
        }
      })

      // setup inputs autocomplete
      Typeahead($inputGrid, 'grids', substringMatcher(gridsTitles()))
      Typeahead($inputOption, 'options', substringMatcher(function () { return options }))

      // setup remove button
      $li.find('.remove-grid').click(function () {
        removeGrid($li)
      })
      // add button
      $li.find('.add-option').click(function () {
        addGridOption($li, $inputOption, gridId)
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
        setTimeout(function () {
          // handle options sorting
          // https://github.com/RubaXa/Sortable
          window.Sortable.create($li.find('.badges-list')[0], {
            onUpdate: function (e) {
              // console.log(e)
              // move array elements
              var options = gridsOptions[gridId]
              var x = options.splice(e.oldIndex, 1)[0]
              if (x) {
                options.splice(e.newIndex, 0, x)
              }

              // update variations
              generateVariations()
            }
          })
        }, 200)
      })
    }

    var addGridOption = function ($li, $inputOption, gridId) {
      // add options to grid
      // multiple options should be separated with comma
      var options = $inputOption.val().split(',')
      // clear input
      $inputOption.val('').focus()

      for (var i = 0; i < options.length; i++) {
        var option = options[i].trim()
        if (option !== '') {
          var optionIndex, savedOptions
          if (gridId) {
            // set option ID value
            var optionId = normalizeString(option)
            var ii
            if (Grids[gridId] && Grids[gridId].options) {
              for (ii = 0; ii < Grids[gridId].options.length; ii++) {
                var optionObject = Grids[gridId].options[ii]
                if (optionId === normalizeString(optionObject.text)) {
                  optionId = optionObject.option_id
                  break
                }
              }
            }

            savedOptions = gridsOptions[gridId]
            var skip
            for (ii = 0; ii < savedOptions.length; ii++) {
              if (optionId === savedOptions[ii].option_id) {
                // option already in use
                skip = true
                break
              }
            }
            if (skip) {
              continue
            }

            // save current option
            optionIndex = savedOptions.length
            savedOptions[optionIndex] = {
              'option_id': optionId,
              'text': option
            }
          }

          var $liOption = $('<li />', {
            html: '<span class="i-drag white"></span>' + option + '<i class="fa fa-times"></i>'
          })
          $li.find('.badges-list').append($liOption)
          // setup remove icon
          $liOption.find('.fa-times').click(function () {
            $liOption.remove()
            if (optionIndex !== undefined) {
              savedOptions.splice(optionIndex, 1)
              generateVariations()
            }
          })

          generateVariations()
        }
      }
    }

    var $listVariations = $('#' + tabId + '-variations-list')
    // variation li element HTML
    var liVariation = '<div class="flexbox align-items-center">' +
                        '<div>' +
                          '<div class="custom-control custom-checkbox">' +
                            '<input type="checkbox" class="custom-control-input" checked >' +
                            '<label class="custom-control-label fw-400 colored"> </label>' +
                          '</div>' +
                        '</div>' +
                        '<button class="btn btn-light" type="button">' +
                          '<i class="fa fa-cog"></i>' +
                          '<span class="i18n"> ' +
                            '<span data-lang="en_us">Edit variation</span>' +
                            '<span data-lang="pt_br">Editar variação</span>' +
                          '</span>' +
                        '</button>' +
                      '</div>'

    var generateVariations = function () {
      // remove empty grids
      var GridsOptions = {}
      var gridId
      for (gridId in gridsOptions) {
        var gridArray = gridsOptions[gridId]
        if (gridArray && gridArray.length) {
          GridsOptions[gridId] = gridArray
        }
      }

      // clear variations
      $listVariations.slideUp(400, function () {
        $(this).html('')
        // update product resource data
        var data = Data()

        // create new options matches
        var variations = getCombinations(GridsOptions)
        var variationsData = []
        for (var i = 0; i < variations.length; i++) {
          // create variation
          var variation = variations[i]
          // add li element
          var $li = $('<li />', {
            html: liVariation,
            'data-specifications': JSON.stringify(variation)
          })
          var label = ''
          var specifications = {}
          for (gridId in variation) {
            var option = variation[gridId].text
            if (variation.hasOwnProperty(gridId)) {
              label += '<span>' + option + '</span>'
            }
            // data specifications
            specifications[gridId] = [{
              text: option
            }]
          }
          $li.find('label').html(label)
          $listVariations.append($li)
          // show added list element
          $li.slideDown()

          var variationObject = {}
          // check if current data has this variation
          if (data.variations) {
            var variationsIndex = variationsData.length
            var bestMatchedVariation = {
              matches: 0,
              index: null
            }

            for (var ii = 0; ii < data.variations.length; ii++) {
              // compare each specification
              var specs = data.variations[ii].specifications
              // count matched specs
              var matches = 0

              for (var spec in specs) {
                if (specs.hasOwnProperty(spec) && specifications.hasOwnProperty(spec)) {
                  var ln = specs[spec].length
                  var conflict = false
                  // check each specification elements
                  if (ln === specifications[spec].length) {
                    for (var j = 0; j < ln; j++) {
                      if (specs[spec][j].text !== specifications[spec][j].text) {
                        conflict = true
                        break
                      }
                    }
                  } else {
                    conflict = true
                  }

                  if (!conflict) {
                    // current specification matches
                    matches++
                  } else {
                    // specification changed
                    // should to create new variation
                    matches = 0
                    break
                  }
                }
              }

              if (!(matches < bestMatchedVariation.matches)) {
                if (matches === bestMatchedVariation.matches) {
                  // prefer same or lowest index
                  if (ii !== variationsIndex) {
                    continue
                  } else {
                    bestMatchedVariation.sameIndex = true
                  }
                }
                bestMatchedVariation.index = ii
                if (matches === Object.keys(specifications).length) {
                  // all specifications matched
                  bestMatchedVariation.sameSpecs = true
                  break
                }
              }
            }

            if (bestMatchedVariation.index !== null) {
              // copy variation object
              variationObject = data.variations[bestMatchedVariation.index]
              if (!bestMatchedVariation.sameSpecs) {
                // not all specifications matched
                delete variationObject._id
                delete variationObject.specifications
                if (!bestMatchedVariation.sameIndex) {
                  // not keeping same element index
                  // also clear SKU if any
                  delete variationObject.sku
                }
              }
            }
          }

          // push to data
          if (!variationObject._id) {
            // new variation ID
            variationObject._id = objectIdPad(idPad, '' + index)
            index++
            if (!variationObject.sku && data.sku) {
              // new random code based on product SKU
              variationObject.sku = data.sku + '-' + randomInt(100000, 999999)
            }
            variationObject.specifications = specifications
          }
          variationsData.push(variationObject)
        }

        // show list again
        $(this).slideDown()
        // set product data variations
        data.variations = variationsData
        // commit only to perform reactive actions
        commit(data, true)
      })
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
        index++
        // refresh the picker plugin
        // trigger change to handle commit and save action
        $select.append($option).selectpicker('refresh').trigger('change')

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
