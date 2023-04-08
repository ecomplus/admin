/* eslint-disable no-var, quote-props, no-prototype-builtins */

/*!
 * Copyright 2018 E-Com Club
 */

import Sortable from 'sortablejs'
import listOrders from './products/list-orders'
import renderKitItems from './products/render-kit-items'
import renderRelatedItems from './products/render-related-items'

export default function () {
  const {
    $,
    app,
    clearAccents,
    i18n,
    ecomUtils,
    lang,
    tabId,
    randomObjectId,
    objectIdPad,
    normalizeString,
    cutString,
    substringMatcher,
    randomInt,
    setupInputValues,
    getCombinations
  } = window

  // current tab
  var Tab = window.Tabs[tabId]
  // edit JSON document
  var commit = Tab.commit
  var Data = function () {
    // current data from global variable
    return Tab.data
  }

  Tab.continue = function () {
    // get form element from global Tab object
    var $form = Tab.$form
    // generate IDs for each new variation, brand or category
    var idPad = randomObjectId()
    var index = 0

    // setup predefined grids
    // GMC defaults
    var Grids = {
      size: {
        title: i18n({
          en_us: 'Size',
          pt_br: 'Tamanho'
        })
      },
      material: {
        title: 'Material'
      },
      pattern: {
        title: i18n({
          en_us: 'Pattern',
          pt_br: 'Estampa'
        })
      },
      age_group: {
        title: i18n({
          en_us: 'Age group',
          pt_br: 'Idade'
        })
      },
      gender: {
        title: i18n({
          en_us: 'Gender',
          pt_br: 'Gênero'
        })
      },
      colors: {
        title: i18n({
          en_us: 'Primary color',
          pt_br: 'Cor primária'
        })
      },
      // multiple colors
      // for sample purposes only
      'colors.2': {
        title: i18n({
          en_us: 'Secondary color',
          pt_br: 'Cor secundária'
        })
      }
    }
    // save grids and options in use
    var gridsOptions = {}

    // load grids and options samples
    import(/* webpackChunkName: "data_misc_variations-grids" */ '@/data/misc/variations-grids')
      .then(exp => {
        const json = exp.default
        // successful
        for (var gridId in json) {
          var grid = json[gridId]
          if (grid) {
            if (Grids[gridId] && grid.options) {
              // overwrite options only
              Grids[gridId].options = i18n(grid.options)
            } else {
              Grids[gridId] = i18n(grid)
            }
          }
        }
      })
      .catch(console.error)

      .finally(() => {
        // add store custom grids
        const listGridsUrl = 'grids.json?fields=title,grid_id,options,custom_value,attachment,add_to_price'
        window.callApi(listGridsUrl, 'GET', (err, json) => {
          if (!err) {
            for (var i = 0; i < json.result.length; i++) {
              var grid = json.result[i]
              var normalizedTitle = normalizeString(grid.title)
              // check duplicated grids
              for (var gridId in Grids) {
                if (Grids[gridId]) {
                  if (gridId !== grid.grid_id && normalizeString(Grids[gridId].title) === normalizedTitle) {
                    if (!grid.options || !grid.options.length) {
                      grid.options = Grids[gridId].options
                    }
                    delete Grids[gridId]
                  }
                }
              }

              // check if there's a grid object already saved with current ID
              var Grid = Grids[grid.grid_id]
              if (Grid) {
                // keep default options
                Grid.title = grid.title
                if (grid.options) {
                  Grid.options = Grid.options.concat(Grid.options, grid.options)
                }
              } else {
                Grids[grid.grid_id] = grid
              }
            }
          }

          // setup current product variations and specs
          setTimeout(function () {
            const data = Data()
            let gridId
            // setup preseted specifications/customizations
            let { specifications, customizations, variations } = data
            if (specifications) {
              for (gridId in specifications) {
                var specArray = specifications[gridId]
                if (Array.isArray(specArray)) {
                  // add one spec object per grid only
                  var specValue = addSpec(gridId, 'spec', true)
                  if (specValue) {
                    specValue(specArray[0].text)
                  }
                }
              }
            }
            if (customizations) {
              customizations.forEach(grid => addSpec(grid.grid_id, 'customization', true))
            }

            // setup variations
            if (Array.isArray(variations) && variations.length) {
              // sum quantity from variations
              const $inputQnt = $form.find('input[name="quantity"]')
                .attr('readonly', true)
                .val(variations.reduce((totalQnt, { quantity }) => {
                  return totalQnt + (quantity || 0)
                }, 0))

              // dynamically update variation qnt preview and total qnt
              $form.find('input[name="variations.quantity"]').change(() => {
                setTimeout(() => {
                  let totalQnt = 0
                  const { variations } = Data()
                  if (variations) {
                    variations.forEach(({ _id, quantity }) => {
                      const $qntPreview = $(`#t${tabId}-v${_id}-qnt`)
                      if (quantity) {
                        totalQnt += quantity
                        $qntPreview.text(`${quantity} un`)
                      } else {
                        $qntPreview.text('')
                      }
                      $inputQnt.val(totalQnt)
                    })
                  }
                }, 300)
              })

              // add all options in use
              var addOptions = function (addOption, gridId) {
                // delay to wait grid full setup
                setTimeout(function () {
                  for (var i = 0; i < variations.length; i++) {
                    var spec = variations[i].specifications[gridId]
                    if (Array.isArray(spec)) {
                      for (var ii = 0; ii < spec.length; ii++) {
                        addOption(spec[ii])
                      }
                    }
                  }
                }, 600)
              }

              // get grids from first variations
              specifications = variations[0].specifications
              if (specifications) {
                for (gridId in specifications) {
                  if (specifications[gridId]) {
                    // setup new grid
                    var gridObject
                    if (Grids[gridId]) {
                      gridObject = Grids[gridId]
                    } else {
                      gridObject = { title: gridId }
                    }
                    addOptions(addGrid(gridObject), gridId)
                    if (gridId === 'colors' && specifications[gridId].length > 1) {
                      addOptions(addGrid(Grids['colors.2']), gridId)
                    }
                  }
                }
              }

              setTimeout(function () {
                // grid options added
                // true to skip data commits
                generateVariations(true)

                setTimeout(function () {
                  // fix variations list
                  var $checkbox = $listVariations.find('input[type="checkbox"]')
                  for (var i = 0; i < variations.length; i++) {
                    var strValue = ''
                    var specifications = variations[i].specifications
                    // merge all specs values to string
                    for (var gridId in specifications) {
                      var spec = specifications[gridId]
                      if (Array.isArray(spec)) {
                        for (var ii = 0; ii < spec.length; ii++) {
                          strValue += ',' + (spec[ii].value || spec[ii].text)
                        }
                      }
                    }

                    // match variation on list
                    $checkbox.filter(function () {
                      return $(this).data('value') === strValue
                    }).data('checked', true)
                  }

                  // unckech variations not in use
                  // mark as preseted variations
                  $checkbox.filter(function () {
                    return !$(this).data('checked')
                  }).data('skip-data', true).prop('checked', false).trigger('change')
                }, 200)
              }, 800)
            }

            // setup specs/customizations autocomplete
            Typeahead($specInputs.spec, 'specs', substringMatcher(gridsTitles()))
            Typeahead($specInputs.customization, 'customizations', substringMatcher(gridsTitles(true)))
          }, 100)
        })
      })

    var gridsTitles = function (canAcceptCustom) {
      // return strings array with all grids titles
      var titles = []
      for (var gridId in Grids) {
        if (Grids[gridId] && (!Grids[gridId].custom_value || canAcceptCustom)) {
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

    Tab.saveCallback = function () {
      // product document updated
      var data = Data()
      if (data) {
        // save new grids
        // https://developers.e-com.plus/docs/api/#/store/grids/
        var grids = []
        var gridId

        // merge variations and product specs
        var addGrids = function (item) {
          if (item.specifications) {
            for (gridId in item.specifications) {
              if (item.specifications[gridId] !== undefined && grids.indexOf(gridId) === -1) {
                grids.push(gridId)
              }
            }
          }
        }

        // add specs from product body
        addGrids(data)
        if (data.variations) {
          // add specs from each variation
          data.variations.forEach(function (variation) {
            addGrids(variation)
          })
        }

        // list current grids and options stored
        window.callApi('grids.json?fields=grid_id', 'GET', function (err, json) {
          if (!err) {
            grids.forEach(function (gridId) {
              for (var i = 0; i < json.result.length; i++) {
                if (json.result[i].grid_id === gridId) {
                  // grid already saved
                  return
                }
              }

              // save grid with ID and title
              var title
              if (Grids[gridId] && Grids[gridId].title) {
                title = Grids[gridId].title
                if (gridId === 'colors') {
                  switch (title) {
                    case 'Cor primária':
                    case 'Cor secundária':
                      title = 'Cores'
                      break
                    case 'Primary color':
                    case 'Secondary color':
                      title = 'Colors'
                      break
                  }
                }
              } else if (specsTitlesObject[gridId]) {
                title = specsTitlesObject[gridId]
              } else {
                // no title to save
                return
              }
              var gridBody = {
                grid_id: gridId,
                title: title
              }

              // call Store API
              var uri = 'grids.json'
              var skipError = true
              window.callApi(uri, 'POST', null, gridBody, skipError)
            })
          }
        })
        // TODO: save or update grid options
      }
    }

    const fixGridId = function (gridId) {
      // try to match with defined grids titles
      var matched
      for (var id in Grids) {
        if (Grids[id] && normalizeString(Grids[id].title) === gridId) {
          // found respective grid object
          gridId = id
          matched = true
          break
        }
      }

      if (!matched) {
        // try to fix grid ID string
        switch (gridId) {
          case 'cores':
          case 'cor':
          case 'color':
            // fix to colors
            gridId = 'colors'
            break
          case 'tamanhos':
          case 'tamanho':
          case 'sizes':
            // fix to size
            gridId = 'size'
            break
        }
      }
      return gridId
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

    var $listGrids = $('#t' + tabId + '-grids-list')
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
                          '<input class="form-control" type="text" name="grid" placeholder="' +
                          i18n({ en_us: 'Size', pt_br: 'Tamanho' }) + '">' +
                        '</div>' +
                      '</div>' +
                    '</div>' +
                    '<div class="col-6 hidden option-block">' +
                      '<div class="input-group">' +
                        '<input class="form-control" type="text" name="option" placeholder="M">' +
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
    Sortable.create($listGrids[0], {
      // handle sorting on drag icon only
      handle: '.i-drag',

      // listen update event to update saved grids and regenerate variations
      onUpdate: function (e) {
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
      var $colorpicker
      // enable option input after grid only
      var optionDisabled = true
      // auto focus on option input
      var optionFocus = true
      // predefined options for autocomplete
      var options = []
      // save grid ID
      var gridId
      // prevent grid event duplication
      var gridOnChange

      if (gridObject) {
        // preset grid title
        $inputGrid.val(gridObject.title)
      }

      // abstraction for add grid option function
      var addOption = function (specObject) {
        var optionObject
        if (specObject) {
          optionObject = Object.assign({}, specObject)
        } else {
          optionObject = null
        }
        addGridOption($li, $inputOption, $colorpicker, gridId, optionObject)
      }

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
          gridId = fixGridId(normalizeString(grid))

          if (oldGridId !== gridId) {
            // update options for autocomplete
            options = optionsTitles(gridId)
            if (options.length) {
              $inputOption.attr('placeholder', options[0])
            }

            if (gridsOptions.hasOwnProperty(gridId)) {
              // grid already in use
              var idAux = 2
              while (gridsOptions.hasOwnProperty(gridId + '.' + idAux)) {
                idAux++
              }
              gridId += '.' + idAux
            }
            if (oldGridId) {
              gridsOptions[gridId] = gridsOptions[oldGridId]
              delete gridsOptions[oldGridId]
            } else {
              // setup options array
              gridsOptions[gridId] = []
            }

            if (!Grids.hasOwnProperty(gridId)) {
              // save grid name
              Grids[gridId] = {
                title: grid
              }
            }
            $(this).data('grid-id', gridId)
          }

          if (gridId.indexOf('colors') === 0) {
            if (!$colorpicker) {
              // use predefined colors
              var Colors = Grids.colors.options
              var $inputOptionGroup

              // add colorpicker
              $colorpicker = $('<input />', {
                'class': 'form-control',
                placeholder: '#ffffff',
                type: 'text',
                name: 'rgb',

                keydown: function (e) {
                  switch (e.which) {
                    // tab
                    case 9:
                      setTimeout(function () {
                        $inputGrid.focus()
                      }, 100)
                      break
                    // enter
                    case 13:
                      $(this).trigger('change')
                      break
                  }
                },

                change: function () {
                  var value = $(this).val().trim().toLowerCase()
                  // check RGB string
                  if (/^#[a-f0-9]{6}$/.test(value)) {
                    // test preconfigured colors
                    if (Colors) {
                      for (var i = 0; i < Colors.length; i++) {
                        // array first RGB of array only
                        var option = Colors[i]
                        var rgbs = option.colors
                        if (rgbs && rgbs[0] === value) {
                          // matched
                          // set option text input value with color name
                          $inputOption.typeahead('val', option.text)
                          // input option not needed
                          $inputOptionGroup.slideUp()
                          // automatically add option
                          addOption()
                          return
                        }
                      }
                    }

                    // color not found
                    // show input option to set color name
                    var next = function () {
                      $inputOption.focus()
                    }
                    if (!$inputOptionGroup.is(':visible')) {
                      $inputOptionGroup.slideDown(400, next)
                    } else {
                      setTimeout(next, 100)
                    }
                  }
                }
              })
              // insert before option input
              $blockOption.prepend($colorpicker)
              // hide input option (not needed)
              $inputOptionGroup = $colorpicker.nextAll()
              $inputOptionGroup.addClass('mt-10').hide()

              // setup jQuery MiniColors addon
              // https://labs.abeautifulsite.net/jquery-minicolors/
              var minicolorsOptions = {
                theme: 'bootstrap',
                position: 'top left',
                swatches: []
              }
              if (Colors) {
                // preconfigured colors
                for (var i = 0; i < Colors.length; i++) {
                  // array of RGBs
                  var rgbs = Colors[i].colors
                  if (rgbs && rgbs.length) {
                    minicolorsOptions.swatches.push(rgbs[0])
                  }
                }
              }
              $colorpicker.minicolors(minicolorsOptions)
              // fix colorpicker panel position
              var $panel = $colorpicker.nextAll('.minicolors-panel')
              $panel.addClass('swatches-first').css('top', (-($panel.height() + 8)) + 'px')
            }

            if (optionFocus) {
              // focus on RGB input
              $colorpicker.focus()
            }
          } else {
            if ($colorpicker) {
              // remove colorpicker and reset
              $colorpicker.minicolors('destroy').remove()
              $colorpicker = null
            }
            if (optionFocus) {
              // focus on option text input
              $inputOption.focus()
            }
          }
        } else {
          // clear option
          $inputOption.typeahead('val', '')
          if (countGrids > 1) {
            // remove empty grid from list
            removeGrid($li, gridId)
          }
        }

        // reset
        optionFocus = true
        // event done
        setTimeout(function () {
          gridOnChange = false
        }, 100)
      })

        .blur(function () {
          // fix for Safari
          if (!gridOnChange) {
            setTimeout(function () {
              $inputGrid.trigger('change')
            }, 100)
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
                $('#t' + tabId + '-add-option-header').fadeIn()
              }
            }
          } else if (!optionDisabled) {
            // grid name empty
            $blockOption.fadeOut()
            optionDisabled = true
            if (countGrids === 1) {
              $('#t' + tabId + '-add-option-header').fadeOut()
            }
          }
        })

        .keydown(function (e) {
          switch (e.which) {
            // tab, enter
            case 9:
            case 13:
              $inputGrid.trigger('blur')
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
            addOption()
            break
        }
      })

      // setup inputs autocomplete
      Typeahead($inputGrid, 'grids', substringMatcher(gridsTitles()))
      Typeahead($inputOption, 'options', substringMatcher(function () { return options }))

      // setup remove button
      $li.find('.remove-grid').click(function () {
        removeGrid($li, gridId)
      })
      // add button
      $li.find('.add-option').click(function () {
        addOption()
      })

      countGrids++
      if (countGrids === 1) {
        // first added grid
        $('#t' + tabId + '-grids-list-header').slideDown()
      }

      // show added list element
      $li.slideDown(400, function () {
        if (!gridObject) {
          // new variation
          $inputGrid.focus()
        } else {
          // setup preseted grid
          optionFocus = false
          $inputGrid.trigger('keyup').trigger('change')
        }

        setTimeout(function () {
          // handle options sorting
          // https://github.com/RubaXa/Sortable
          Sortable.create($li.find('.badges-list')[0], {
            onUpdate: function (e) {
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

      return addOption
    }

    var searchGridOption = function (gridId, optionId) {
      // find grid option by ID
      var optionObject
      if (Grids[gridId]) {
        // test from predefined grid options
        var options = Grids[gridId].options
        if (options) {
          for (var i = 0; i < options.length; i++) {
            if (optionId === normalizeString(options[i].text)) {
              // matched
              optionObject = options[i]
              break
            }
          }
        }
      }
      return optionObject
    }

    var newGridOption = function ($li, $colorpicker, gridId, optionId, value, text) {
      // handle new grid option
      var savedOptions = gridsOptions[gridId]
      for (var i = 0; i < savedOptions.length; i++) {
        if (optionId === savedOptions[i].option_id) {
          // option already in use
          return false
        }
      }

      // save current option
      var optionObject = {
        'option_id': optionId,
        'text': text
      }
      if ($colorpicker) {
        // save color RGB value
        value = $colorpicker.minicolors('value')
      }
      if (value) {
        optionObject.value = value
      }
      savedOptions.push(optionObject)

      var $liOption = $('<li />', {
        html: '<span class="i-drag white"></span>' + text + '<i class="fa fa-times"></i>'
      })
      $li.find('.badges-list').append($liOption)
      // setup remove icon
      $liOption.find('.fa-times').click(function () {
        $liOption.remove()

        // remove from saved options and update variations
        if (optionId) {
          if (savedOptions.length > 1) {
            // find respective option by ID
            for (var i = 0; i < savedOptions.length; i++) {
              if (savedOptions[i].option_id === optionId) {
                // found, remove
                savedOptions.splice(i, 1)
                break
              }
            }
          } else {
            // last option
            gridsOptions[gridId] = []
          }
          generateVariations()
        }
      })

      // new option added
      return true
    }

    var addGridOption = function ($li, $inputOption, $colorpicker, gridId, optionObject) {
      // add options to grid
      var option, optionId, newOption, skipOption
      var handleNewOption = function () {
        // option value not required
        var value
        if (optionObject) {
          // overwrite option ID
          optionId = optionObject.option_id
          value = (optionObject.value || optionObject.option_id)
        }
        // handle new grid option
        return newGridOption($li, $colorpicker, gridId, optionId, value, option)
      }

      if (!optionObject) {
        option = $inputOption.val().trim()
        // clear input
        $inputOption.typeahead('val', '').attr('placeholder', option).focus()
        if (!gridId) {
          // nothing more to do without grid ID
          return
        }
        // search for an option for the full value string
        // generate option ID
        optionObject = searchGridOption(gridId, normalizeString(option))
      } else {
        // preseted option
        skipOption = true
        option = optionObject.text
        if (!optionObject.option_id) {
          optionObject.option_id = optionObject.value || optionObject.text
        }
      }

      if (optionObject) {
        // full value string matches with some option
        // single new option
        newOption = handleNewOption()
      } else {
        // multiple options should be separated with points
        var options = option.split(/[,;/\\|.]+/g)

        // handle all new options
        for (var i = 0; i < options.length; i++) {
          option = options[i].trim()
          if (option !== '') {
            // set option ID value
            optionId = normalizeString(option)
            // try to find predefined option
            optionObject = searchGridOption(gridId, optionId)

            // handle current option
            var NewOption = handleNewOption()
            if (NewOption && !newOption) {
              // mark new option added
              newOption = NewOption
            }
          }
        }
      }

      if (newOption && !skipOption) {
        // grid option(s) added
        setTimeout(generateVariations, 100)
      }
    }

    var $listVariations = $('#t' + tabId + '-variations-list')
    var variationIndexFromList = function ($li) {
      // get variation index from list DOM element
      return $listVariations.children(':not(.disabled)').index($li)
    }

    // variation li element HTML
    var liVariation = '<div class="flexbox align-items-center">' +
                        '<div>' +
                          '<div class="custom-control custom-checkbox">' +
                            '<input type="checkbox" class="custom-control-input" checked >' +
                            '<label class="custom-control-label fw-400 colored"> </label>' +
                          '</div>' +
                        '</div>' +
                        '<div>' +
                          '<button class="btn btn-light" type="button">' +
                            '<i class="fa fa-cog"></i>' +
                            '<span class="i18n"> ' +
                              '<span data-lang="en_us">Edit variation</span>' +
                              '<span data-lang="pt_br">Editar variação</span>' +
                            '</span>' +
                          '</button>' +
                        '</div>' +
                      '</div>'

    // on checkbox change event
    const uncheckedVariations = []
    const liVariationControl = function ($li, $edit) {
      return function () {
        // add or remove variation from data
        const data = Data()
        let skipData
        if ($(this).data('skip-data')) {
          // don't make changes
          skipData = true
          // change on next event
          $(this).removeData('skip-data')
        }
        // variation index
        let index
        const strValue = $(this).data('value')

        if (!$(this).is(':checked')) {
          if (!skipData) {
            index = variationIndexFromList($li)
            // save variation JSON
            $(this).data('variation', JSON.stringify(data.variations[index]))
            // remove variation from data
            if (data.variations.length > 1) {
              data.variations.splice(index, 1)
            } else {
              // last variation
              delete data.variations
            }
          } else {
            // use original auto-generated variation object
            $(this).data('variation', $(this).data('original-variation'))
          }

          // disable edition
          $li.addClass('disabled')
          $edit.attr('disabled', true)
          if (!uncheckedVariations.includes(strValue)) {
            uncheckedVariations.push(strValue)
          }
        } else {
          // remove disabled class first
          // li most be enabled to get correct index
          $li.removeClass('disabled')
          if (!skipData) {
            index = variationIndexFromList($li)
            // add variation again
            const variation = JSON.parse($(this).data('variation'))
            if (data.variations) {
              data.variations.splice(index, 0, variation)
            } else {
              // first variation
              data.variations = [variation]
            }
          }

          // enable edit button again
          $edit.removeAttr('disabled')
          const uncheckedListIndex = uncheckedVariations.indexOf(strValue)
          if (uncheckedListIndex > -1) {
            uncheckedVariations.splice(uncheckedListIndex, 1)
          }
        }

        if (!skipData) {
          // commit only to perform reactive actions
          commit(data, true)
        }
      }
    }

    // on edit button click event
    var liVariationEdit = function ($li) {
      return function () {
        // edit variation passing current index
        editVariation(variationIndexFromList($li))
      }
    }

    let isResetingVariations = false
    const generateVariations = function (skipData) {
      if (isResetingVariations) {
        return
      }
      isResetingVariations = true
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
        var data
        if (!skipData) {
          data = Data()
        } else {
          data = {}
        }
        var i, ii, ln

        // create new options matches
        var combinations = getCombinations(GridsOptions)
        const $disableCheckboxes = []
        if (combinations.length > 0) {
          var variationsData = []
          for (i = 0; i < combinations.length; i++) {
            // create variation
            var combination = combinations[i]
            var label = ''
            // variation name
            // regex to test variations names
            // check if variation name was generated automatically by pattern
            const baseName = Name.length > 80
              ? Name.substring(0, 77) + '...'
              : Name
            var nameRegex = new RegExp('^' + baseName.replace(/([^\w\s])/ig, '\\$1') + '(\\s\\/\\s.*)?$')
            var name = baseName
            var strValue = ''
            var specifications = {}
            for (gridId in combination) {
              if (combination[gridId]) {
                var option = combination[gridId].text
                if (`${name} / ${option}`.length <= 100) {
                  name += ' / ' + option
                }
                label += '<span>' + option + '</span>'

                // data specifications
                var specObject = {
                  text: option
                }
                // normalized or RGB (if color) option value
                var value = (combination[gridId].value || combination[gridId].option_id)
                strValue += ',' + value
                if (value) {
                  specObject.value = value
                }
                // fix grid ID
                // eg.: 'colors.2'
                gridId = gridId.replace(/\..*/, '')
                if (specifications[gridId]) {
                  specifications[gridId].push(specObject)
                } else {
                  specifications[gridId] = [specObject]
                }
              }
            }

            // add li element
            var $li = $('<li />', {
              html: liVariation
              // 'data-specifications': JSON.stringify(variation)
            })
            $li.find('label').html(label)
            // handle edit button
            var $edit = $li.find('button')
            $edit.click(liVariationEdit($li))
            // handle checkbox to add or remove variation
            var $checkbox = $li.find('input[type="checkbox"]')
              .data('value', strValue).change(liVariationControl($li, $edit))
            if (uncheckedVariations.includes(strValue)) {
              $disableCheckboxes.push($checkbox)
            }
            $listVariations.append($li)
            // show added list element
            $li.slideDown()

            // create new variation object
            var variationObject = {}
            // check if current data has this variation
            if (data.variations) {
              var variationsIndex = variationsData.length
              var bestMatchedVariation = {
                matches: 0,
                index: null
              }

              for (ii = 0; ii < data.variations.length; ii++) {
                // compare each specification
                var specs = data.variations[ii].specifications
                // count matched specs
                var matches = 0

                for (var spec in specs) {
                  if (specs.hasOwnProperty(spec) && specifications.hasOwnProperty(spec)) {
                    ln = specs[spec].length
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
                      // should create new variation
                      matches = 0
                      break
                    }
                  }
                }

                if (!matches && Object.keys(specifications).length === Object.keys(specs).length) {
                  continue
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
                  if (matches === Object.keys(specifications).length && matches === Object.keys(specs).length) {
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
              variationObject.specifications = specifications
            }
            if (!variationObject.name || nameRegex.test(variationObject.name)) {
              // preset variation name
              variationObject.name = name
            }
            variationsData.push(variationObject)
            // save variation JSON on checkbox dataset
            $checkbox.data('original-variation', JSON.stringify(variationObject))

            // preview variations quantities and prices
            const { variations } = Data()
            if (variations) {
              const variation = variations[variationIndexFromList($li)]
              if (variation) {
                let html = ''
                if (typeof variation.quantity === 'number') {
                  html += `<small class="mr-2 text-dark" id="t${tabId}-v${variation._id}-qnt">` +
                    `${variation.quantity} un</small>`
                }
                if (typeof variation.price === 'number') {
                  html += `<small class="mr-2 text-muted">${ecomUtils.formatMoney(variation.price)}</small>`
                }
                if (html) {
                  $(html).insertBefore($edit)
                }
              }
            }

            // no kit and variations together
            $(`#t${tabId}-kit`).hide()
          }

          if (!skipData) {
            // set variations SKUs
            if (Sku === '' && typeof firstSku === 'function') {
              // create random product SKU first
              firstSku()
            }
            // create SKUs automatically for variations
            ln = variationsData.length
            for (i = 0; i < ln; i++) {
              if (!variationsData[i].sku) {
                // new random code based on product SKU
                // should be unique
                var sku = null
                while (!sku) {
                  sku = Sku + '-' + randomInt(100, 999) + '-' + (i + 1)
                  // check if other variation already have same SKU
                  for (ii = 0; ii < ln.length; ii++) {
                    if (sku === variationsData[ii].sku) {
                      sku = null
                      break
                    }
                  }
                }
                variationsData[i].sku = sku
              }
            }

            // set product data variations
            data.variations = variationsData
          }
        } else {
          // no vatiations
          // unset on product data
          delete data.variations
        }

        // show list again
        $(this).slideDown()
        $disableCheckboxes.forEach($checkbox => $checkbox.next().click())
        if (!skipData) {
          // commit only to perform reactive actions
          commit(data, true)
        }
        isResetingVariations = false
      })
    }

    $('#t' + tabId + '-add-grid').click(function () {
      addGrid()
    })

    var removeGrid = function ($li, gridId) {
      // remove list element of respective grid
      $li.slideUp(400, function () {
        $(this).remove()
      })
      countGrids--
      if (countGrids === 0) {
        // all grids removed
        // list is empty, hide list header
        $('#t' + tabId + '-grids-list-header, #t' + tabId + '-add-option-header').slideUp()
      }

      // remove from saved grids object
      delete gridsOptions[gridId]
      // regenerate variations
      generateVariations()
    }

    const updateVariations = function (prop) {
      // update variations properties
      const data = Data()
      // use empty string when undefined or null
      let newValue = data[prop] || ''
      const variations = data.variations
      // local (backup) variable
      let oldValue
      if (prop === 'name') {
        oldValue = Name.length > 80 ? Name.substring(0, 77) : Name
        if (newValue.length > 80) {
          newValue = newValue.substring(0, 77) + '...'
        }
      } else {
        oldValue = Sku
      }

      if (variations) {
        // regex pattern for random variations
        // check if variation property starts with respective product property
        const regex = new RegExp('^' + oldValue + '(\\.{3})?')
        for (let i = 0; i < variations.length; i++) {
          const variation = variations[i]
          if (typeof variation[prop] === 'string') {
            variation[prop] = variation[prop].replace(regex, newValue).substring(0, 100)
          }
        }
        // commit only to perform reactive actions
        commit(data, true)
      }

      // update local variable
      if (prop === 'name') {
        Name = newValue
      } else {
        Sku = newValue
      }
    }

    var Sku = Data().sku || ''
    var $inputSku = $form.find('input[name="sku"]')
    $inputSku.click(function () {
      // select all input text
      $(this).select()
    }).change(function () {
      // update variations SKUs
      updateVariations('sku')
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
      sku += randomInt(1000, 9999)
      $inputSku.val(sku).trigger('change')
      // validate generated SKU
      checkSku(sku, function () {
        // invalid SKU, already in use
        // try another
        randomSku()
      })
    }
    $('#t' + tabId + '-random-sku').click(randomSku)

    var checkSku = function (sku, cb) {
      if (sku) {
        // SKU should be unique
        // checks if another product have the same SKU
        window.callApi('products.json?sku=' + encodeURIComponent(sku), 'GET', function (err, json) {
          if (!err) {
            var list = json.result
            var ln = list.length
            if (ln) {
              // product(s) found
              if (ln > 1 || list[0]._id !== Tab.resourceId) {
                // different of current product
                if (typeof cb === 'function') {
                  cb()
                } else {
                  app.toast(i18n({
                    'en_us': 'There is another product registered with this same SKU',
                    'pt_br': 'Existe outro produto cadastrado com este mesmo SKU'
                  }))
                }
              }
            }
          }
        })
      }
    }

    var firstSku
    if (!Tab.resourceId) {
      // creating
      // generate the SKU previously
      firstSku = function () {
        if (Sku === '') {
          randomSku()
        }
        // run once only
        // remove the event handler
        $form.off('change', 'input[name="name"]', firstSku)
        firstSku = null
      }
      $form.on('change', 'input[name="name"]', firstSku)
    } else if (Sku !== '') {
      // check current SKU
      checkSku(Sku)
    }

    setTimeout(function () {
      var addOption = function ($select, term) {
        // add option to select
        var optionValue = function (objectId) {
          return JSON.stringify({
            _id: objectId,
            name: term,
            slug: clearAccents(term.toLowerCase(), '-').replace(/[^a-z0-9-_./]/g, '')
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
        $select.append($option).appSelectpicker('refresh').trigger('change')

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
        var $dropdown = $(this).siblings('.dropdown-menu')
        if ($dropdown.length) {
          var $select = $(this)
          var addBtnTimeout

          // listen keydown event on search input
          // detect when search have no results
          $dropdown.find('.bs-searchbox input').keydown(function () {
            var $input = $(this)

            // wait for search processing
            if (addBtnTimeout) {
              clearTimeout(addBtnTimeout)
            }
            addBtnTimeout = setTimeout(function () {
              // unset timeout variable
              addBtnTimeout = null

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
                var $div = $('<div />', {
                  html: $btn
                })
                $li.html($div)
                $div.slideDown(120)
              }
            }, 300)
          })
        }
      })
    }, 400)

    var Name = Data().name || ''
    // generic product name
    // used to force product name (required) not empty
    var genericName = i18n({
      'en_us': 'New product',
      'pt_br': 'Novo produto'
    })

    var $inputName = $form.find('input[name="name"]')
    $inputName.attr('placeholder', i18n({
      'en_us': 'Long Sleeve Polo Shirt',
      'pt_br': 'Camisa Polo Manga Longa'
    })).click(function () {
      if ($(this).val() === genericName) {
        // using generic product name
        // clear input
        $(this).val('').trigger('change')
      }
    }).change(function () {
      // update variations names
      updateVariations('name')
    })

    // sample placeholder for variation name
    $form.find('input[name="variations.name"]').attr('placeholder', i18n({
      'en_us': 'Long Sleeve Polo Shirt / M / Red',
      'pt_br': 'Camisa Polo Manga Longa / M / Vermelho'
    }))
    // ready to setup and show form
    Tab.formSetup()

    /* Setup variation form */
    var currentVariationIndex = 0
    // product and variation form fields elements
    var $productFields = $form.children('#t' + tabId + '-product-fields')
    var $variationFields = $form.children('#t' + tabId + '-variation-fields')

    $('#t' + tabId + '-back-to-product').click(function () {
      // show product form again
      $variationFields.slideUp(400, function () {
        $productFields.slideDown()
      })
    })

    const editVariation = function (index) {
      var data = Data()
      var variations = data.variations
      if (variations && index >= 0 && variations.length > index) {
        // first of all, check if product has name and SKU (required)
        if (!data.name) {
          // set generic product name
          $inputName.val(genericName).trigger('change')
        }
        if (!data.sku) {
          // set new random SKU
          randomSku()
        }

        // edit variation by index
        currentVariationIndex = index
        var variation, i

        // check if there is other variation to copy
        var variationsToCopy = []
        for (i = 0; i < variations.length; i++) {
          if (i !== index) {
            variation = variations[i]
            if (variation.sku && Object.keys(variation).length > 4) {
              // _is, sku, specifications and name are the basic variations properties
              // variation has more (edited) properties
              // can be copied
              variationsToCopy.push(variation.sku)
            }
          }
        }
        if (!variationsToCopy.length) {
          $copyVariation.hide()
        } else {
          var $html = []
          for (i = 0; i < variationsToCopy.length; i++) {
            // list variations that can be copied
            $html.push($('<a />', {
              'class': 'dropdown-item',
              text: variationsToCopy[i],
              href: 'javascript:;',
              click: (function (index) {
                return function () {
                  copyVariation(index)
                }
              }(i))
            }))
          }
          $copyVariationList.html($html)
          $copyVariation.show()
        }

        // current variation
        variation = variations[index]
        var specifications = variation.specifications
        var $div = $variationFields

        $productFields.slideUp(400, function () {
          // HTML element describing specifications
          var elSpecs = ''
          for (var gridId in specifications) {
            var options = specifications[gridId]
            if (options) {
              elSpecs += '<h4><small class="subtitle m-0">' + Grids[fixGridId(gridId)].title + '</small>'
              for (i = 0; i < options.length; i++) {
                elSpecs += ' <small>·</small> ' + options[i].text
              }
              elSpecs += '</h4>'
            }
          }
          $div.find('#t' + tabId + '-variation-specs').html(elSpecs)

          // update pagination buttons
          if (index < variations.length - 1) {
            $nextVariation.removeAttr('disabled')
          } else {
            $nextVariation.attr('disabled', true)
          }
          if (index > 0) {
            $prevVariation.removeAttr('disabled')
          } else {
            $prevVariation.attr('disabled', true)
          }

          var pictures = data.pictures
          if (pictures && pictures.length) {
            // handle select image for current variation
            var $html = []
            for (i = 0; i < pictures.length; i++) {
              const picture = pictures[i]
              const src = ecomUtils.img(picture).url
              const objectId = picture._id

              // add span block with image content
              const spanObject = {
                html: '<img src="' + src + '">',
                click: (function (id) {
                  return function () {
                    // select by picture object ID
                    variation.picture_id = id
                    // commit only to perform reactive actions
                    commit(Data(), true)
                    // mark element as selected
                    // unmark previous selected image on list
                    $(this).addClass('selected').siblings('.selected').removeClass('selected')
                  }
                }(objectId))
              }
              if (variation.picture_id === objectId) {
                // preset as selected
                spanObject.class = 'selected'
              }
              $html.push($('<span />', spanObject))
            }

            // set list content and show select image block
            $variationImage.show().find('.images-list').html($html)
          } else {
            // no product images
            // hide select variation image block
            $variationImage.hide()
          }

          // set variation object ID on input fields
          $div.find('input,select').data('object-id', variation._id).each(function () {
            // reset inputs
            $(this).val(($(this).data('default') || ''))
          })
          // setup inputs with values from data
          setupInputValues($div, variation, 'variations.')
          // show form
          $div.slideDown()
        })
      }
    }

    // setup pagination buttons
    var pageVariations = function (addIndex) {
      // hide form, change edited variation, show form
      $variationFields.slideUp(400, function () {
        editVariation(currentVariationIndex + addIndex)
      })
    }
    var $nextVariation = $variationFields.find('#t' + tabId + '-next-variation')
    var $prevVariation = $variationFields.find('#t' + tabId + '-prev-variation')
    $nextVariation.click(function () {
      // pass to next variation
      pageVariations(+1)
    })
    $prevVariation.click(function () {
      // back to previous variation
      pageVariations(-1)
    })

    // setup copy variation button
    var $copyVariation = $variationFields.find('#t' + tabId + '-copy-variation')
    var $copyVariationList = $copyVariation.children('div')

    var copyVariation = function (index) {
      var data = Data()
      var variations = data.variations
      if (variations) {
        // copy variation properties
        var variationToCopy = variations[index]
        // pastle to current variation
        var variation = variations[currentVariationIndex]
        if (variationToCopy && variation) {
          for (var prop in variationToCopy) {
            if (variationToCopy.hasOwnProperty(prop)) {
              switch (prop) {
                case '_id':
                case 'sku':
                case 'specifications':
                case 'name':
                  // skip
                  break
                default:
                  variation[prop] = variationToCopy[prop]
              }
            }
          }

          // commit only to perform reactive actions
          commit(data, true)
          // update inputs with values from data
          setupInputValues($variationFields, data)
        }
      }
    }

    // variation name field with product name
    $variationFields.find('input[name="variations.name"]').focus(function () {
      if ($(this).val() === '') {
        // set product name on field and select all text
        $(this).val(cutString(Name, 100)).select()
      }
    })

    // fix for SKU field
    $variationFields.find('input[name="variations.sku"]').click(function () {
      var sku = $(this).val()
      if (sku.indexOf(Sku) === 0) {
        // stars with product SKU
        // select text part referring to the variation SKU
        // keep product SKU unselected
        $(this).selectRange(Sku.length, sku.length)
      } else {
        // select all
        $(this).select()
      }
    })

    // select variation image from product images
    var $variationImage = $variationFields.find('#t' + tabId + '-variation-image')

    // handling specifications and customizations
    const $specInputs = {}
    const $specLists = {}
    ;['spec', 'customization'].forEach(type => {
      $specInputs[type] = $(`#t${tabId}-${type}-name`)
      $specLists[type] = $(`#t${tabId}-${type}s-list`)

      // handle spec submit with button and enter
      $(`#t${tabId}-add-${type}`).click(function () {
        addSpec(null, type)
      })
      $specInputs[type].keydown(function (e) {
        switch (e.which) {
          // enter
          case 13:
            addSpec(null, type)
            // do not submit form
            e.preventDefault()
            break
        }
      })
    })

    // store original grid title for specifications on object by grid ID
    const specsTitlesObject = {}

    const addSpec = (spec, type = 'spec', isPreset = false) => {
      const $inputSpec = $specInputs[type]
      const $specs = $specLists[type]
      let $input
      if (!spec) {
        spec = $inputSpec.val().trim()
      }
      if (spec === '') {
        $inputSpec.focus()
      } else {
        // clear spec input
        $inputSpec.typeahead('val', '')
        // generate new grid ID
        const originalGridId = normalizeString(spec).substring(0, 30)
        const gridId = fixGridId(originalGridId)
        const grid = Grids[gridId]
        if (grid) {
          // use default grid title
          spec = grid.title
        }
        // save grid title
        specsTitlesObject[gridId] = spec

        if (type === 'spec') {
          // check if input of this grid already exists
          $input = $specs.find('input').filter(function () {
            return $(this).data('grid') === gridId
          })
          if ($input.length) {
            $input.focus()
            return
          }
          // create DOM elements for specification grid
          $input = $('<input>', {
            class: 'form-control',
            'data-grid': gridId,
            type: 'text'
          })
        } else if (grid && !isPreset) {
          // add customization
          const data = Data()
          if (!data.customizations) {
            data.customizations = []
          }
          const customization = {
            _id: randomObjectId(),
            label: grid.title,
            grid_id: gridId,
            custom_value: grid.custom_value,
            attachment: grid.attachment,
            add_to_price: grid.add_to_price
          }
          if (grid.options && !Array.isArray(grid.options)) {
            customization.options = grid.options
          }
          data.customizations.push(customization)
          // commit new data
          commit(data, true)
        }

        let labelAppend = ''
        if (type !== 'spec' && grid.add_to_price) {
          // show customization additional price
          const { type, addition } = grid.add_to_price
          if (addition) {
            labelAppend = '<br><span class="text-info">' +
                (addition > 0 ? '+' : '') +
                (type === 'percentage' ? `%${addition}` : ecomUtils.formatMoney(addition)) +
              '</span>'
          }
        }

        var $remove = $('<a>', {
          class: 'p-2 text-danger',
          href: 'javascript:;',
          html: '<i class="fa fa-ban"></i>'
        })
        var $div = $('<div>', {
          class: 'col-6 hidden',
          html: $('<div>', {
            class: $input ? 'form-group' : null,
            html: [
              $remove,
              '<label>' + spec + labelAppend + '</label>',
              $input
            ]
          })
        })
        $specs.append($div)
        $div.slideDown()

        if ($input) {
          // setup autocomplete
          Typeahead($input, 'features', substringMatcher(optionsTitles(gridId)))
          $input.focus()

          // add specification to product data
          $input.change(function () {
            var text = $(this).val().trim()
            if (text !== '') {
              var skipData
              if ($(this).data('skip-data')) {
                // don't make changes
                skipData = true
                // change on next event
                $(this).removeData('skip-data')
              }

              // set value from text
              var value = normalizeString(text)
              // try to find predefined option
              var optionObject = searchGridOption(gridId, value)
              if (optionObject) {
                if (gridId !== 'colors') {
                  // replace value with saved option ID
                  value = optionObject.option_id
                } else {
                  // RGB code with #
                  value = optionObject.colors[0]
                }
              } else if (gridId === 'colors') {
                // unset value to prevent API error
                value = null
              }

              if (!skipData) {
                // mount specification object
                var specObject = {
                  text: text
                }
                // optional value
                if (value) {
                  specObject.value = value
                }

                // update data
                var data = Data()
                if (!data.specifications) {
                  data.specifications = {}
                }
                var specs = data.specifications
                if (!specs[gridId]) {
                  specs[gridId] = [specObject]
                } else {
                  var specData = $(this).data('spec-data')
                  if (specData) {
                    // update spec object on array
                    for (var i = 0; i < specs[gridId].length; i++) {
                      if (specs[gridId][i].text === specData) {
                        // matched
                        specs[gridId][i] = specObject
                      }
                    }
                  } else {
                    specs[gridId].push(specObject)
                  }
                }
                // commit only to perform reactive actions
                commit(data, true)
              }

              // save spec value to further check
              $(this).data('spec-data', text)
            }
          })
        }

        // remove specification object
        $remove.click(function () {
          // remove from data
          const data = Data()
          if (type === 'spec') {
            const specData = $input.data('spec-data')
            if (specData) {
              const specs = data.specifications
              let currentGridId = gridId
              if (!specs[gridId]) {
                currentGridId = originalGridId
              }
              if (specs && specs[currentGridId]) {
                specs[currentGridId] = $.grep(specs[currentGridId], function (i) {
                  return i.text !== specData
                })
                if (!specs[currentGridId].length) {
                  // remove empty array
                  delete specs[currentGridId]
                }
                // commit only to perform reactive actions
                commit(data, true)
              }
            }
          } else {
            const gridIndex = data.customizations
              .findIndex(customization => customization.grid_id === gridId)
            if (gridIndex > -1) {
              data.customizations.splice(gridIndex, 1)
              // commit only to perform reactive actions
              commit(data, true)
            }
          }

          // remove from DOM
          $div.slideUp(400, function () {
            $(this).remove()
          })
        })
      }

      // returns function to set spec value
      return function (text) {
        if ($input) {
          $input.typeahead('val', text).data('skip-data', true).trigger('change')
        }
      }
    }

    // production time handler
    $form.find('input[name="production_time.days"]').keyup(function () {
      const isEmpty = $(this).val() === ''
      $(`#t${tabId}-production-time-options`)[isEmpty ? 'slideUp' : 'slideDown']()
      if (isEmpty) {
        const data = Data()
        delete data.production_time
        commit(data, true)
      }
    })

    // price effective date range
    const $priceEffectiveDates = $(`#t${tabId}-price-effective-dates`)
      .inputmask(lang === 'pt_br' ? '99/99/9999 ~ 99/99/9999' : '99-99-9999 ~ 99-99-9999')
      .change(function () {
        const val = $(this).val()
        const data = Data()
        delete data.price_effective_date
        if (val) {
          const dateStrs = val.split(' ~ ')
          if (dateStrs.length === 2) {
            dateStrs.forEach((dateStr, i) => {
              const [day, month, year] = dateStr.split(/[/-]/).map(s => Number(s))
              if (day && month && year) {
                const date = new Date(year, month - 1, day)
                if (!isNaN(date.getTime())) {
                  if (!data.price_effective_date) {
                    data.price_effective_date = {}
                  }
                  data.price_effective_date[!i ? 'start' : 'end'] = date.toISOString()
                }
              }
            })
          }
        }
        commit(data, true)
      })

    const data = Data()
    if (data.inventory && Object.keys(data.inventory).length) {
      // multi warehouses stock fields
      const $inputQnt = $form.find('input[name="quantity"]')
      const $formGroupQnt = $inputQnt.closest('.form-group')
      for (const warehouse in data.inventory) {
        let qnt = data.inventory[warehouse]
        if (qnt >= 0) {
          $formGroupQnt.after($('<div>', {
            class: 'form-group',
            html: [
              `<label>${warehouse}</label>`,
              $inputQnt.clone().attr('name', `inventory.${warehouse}`).val(qnt)
            ],
            change ({ target }) {
              const newQnt = target.valueAsNumber
              const data = Data()
              Object.assign(data.inventory, {
                [warehouse]: newQnt
              })
              commit(data, true)
              $inputQnt.val($inputQnt.val() - qnt + newQnt)
              qnt = newQnt
            }
          }))
        }
      }
      $inputQnt.attr('readonly', true)
    }

    if (data.price_effective_date) {
      // manually reset date range
      const { start, end } = data.price_effective_date
      if (start || end) {
        let dateRangeStr = ''
        ;[start, end].forEach((isoDate, i) => {
          let placeholder
          if (i > 0) {
            dateRangeStr += ' ~ '
            placeholder = '_'
          } else {
            placeholder = '0'
          }
          let day = ''.padStart(2, placeholder)
          let month = day
          let year = day + day
          const sep = lang === 'pt_br' ? '/' : '-'
          if (isoDate) {
            const date = new Date(isoDate)
            day = date.getDate().toString().padStart(2, '0')
            month = (date.getMonth() + 1).toString().padStart(2, '0')
            year = date.getFullYear()
          }
          dateRangeStr += `${day}${sep}${month}${sep}${year}`
        })
        $priceEffectiveDates.val(dateRangeStr)
      }
    }

    renderKitItems({ tabId })
    renderRelatedItems(tabId)

    setTimeout(() => {
      listOrders(tabId)
    }, 1500)
    document.getElementById(`t${tabId}-ad-relevance-link`).addEventListener('click', ($el) => {
      $el.currentTarget.classList.add('d-none')
      document.getElementById(`t${tabId}-ad-relevance`).classList.remove('d-none')

    })
  }
}
