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
  var dictionary = {
    'color': i18n({
      'en_us': 'Color',
      'pt_br': 'Cor'
    })
  }

  Tab.continue = function () {
    var $list = $('#t' + tabId + '-options-list')
    // generate IDs for each option
    var idPad = randomObjectId()
    var liIndex = 0
    // option li element HTML
    var liOption = '<div class="input-group">' +
                     '<div class="input-group-prepend">' +
                       '<span class="input-group-text">' +
                         '<div class="custom-control custom-checkbox">' +
                           '<input type="checkbox" class="custom-control-input">' +
                           '<label class="custom-control-label"> </label>' +
                         '</div>' +
                       '</span>' +
                     '</div>' +
                     '<input class="form-control" type="text" name="options." ' +
                       'data-json="true" data-object-assign="true">' +
                     '<span class="input-group-append">' +
                       '<button class="btn btn-light" type="button"><i class="fa fa-cog"></i></button>' +
                     '</span>' +
                   '</div>' +
                   '<div class="mt-10 hidden edit-option">' +
                     '<div class="mb-10 row no-gutters">' +
                       '<div class="col mr-2">' +
                         '<input type="text" class="form-control colorpicker" ' +
                           'name="options.colors[].0" placeholder="' + dictionary.color + ' 1">' +
                       '</div>' +
                       '<div class="col mr-2">' +
                         '<input type="text" class="form-control colorpicker" ' +
                           'name="options.colors[].1" placeholder="' + dictionary.color + ' 2">' +
                       '</div>' +
                       '<div class="col">' +
                         '<input type="text" class="form-control colorpicker" ' +
                           'name="options.colors[].2" placeholder="' + dictionary.color + ' 3">' +
                       '</div>' +
                     '</div>' +
                     '<a class="i18n" href="javascript:;" onclick="$(this).next().slideToggle()">' +
                       '<span data-lang="en_us">+ Option\'s additional cost</span>' +
                       '<span data-lang="pt_br">+ Custo adicional da opção</span>' +
                     '</a>' +
                     '<div class="hidden mt-10">' +
                       // copy content from add to price block
                       $('#t' + tabId + '-add-to-price').html().replace(/(add_to_price)/g, 'options.$1') +
                     '</div>' +
                   '</div>'

    var addOption = function (optionObject) {
      // add li element
      var $li = $('<li />', {
        html: liOption
      })
      $list.append($li)
      var objectId
      if (!optionObject) {
        // new unique ID
        objectId = objectIdPad(idPad, '' + liIndex)
      } else {
        objectId = optionObject._id
      }
      liIndex++

      // setup li and input elements
      var $inputs = $li.find('input')
      $inputs.data('object-id', objectId)
      var $text = $inputs.filter('[name="options."]')
      $text.change(function () {
        var text = $(this).val()
        if (text.trim() !== '') {
          $(this).data('value', JSON.stringify({
            text: text,
            // parse text to option_id
            option_id: clearAccents(text.toLowerCase(), '_').replace(/[^a-z0-9_]/g, '').substr(0, 30)
          }))
        } else {
          $(this).data('value', '')
        }
      })
      $inputs.filter('.colorpicker').minicolors({
        theme: 'bootstrap'
      })
      handleInputs($li, Tab.inputToData)

      // setup edit button
      $li.find('button').click(function () {
        $li.find('.edit-option').slideToggle()
      })

      $li.slideDown(400, function () {
        if (!optionObject) {
          // new option
          $text.focus()
        }
      })
      if (optionObject) {
        // keep option object JSON
        $text.val(optionObject.text).data('value', JSON.stringify(optionObject))
        if (optionObject.colors) {
          for (var i = 0; i < optionObject.colors.length; i++) {
            $inputs.filter('[name="options.colors[].' + i + '"]').minicolors('value', optionObject.colors[i])
          }
        }
      }
    }

    $('#t' + tabId + '-add-option').click(function () {
      addOption()
    })
    $list.next().find('a').click(function () {
      addOption()
    })

    $('#t' + tabId + '-delete-options').click(function () {
      var $options = $list.find('input:checked')
      if ($options.length) {
        var data = Data()
        // remove all selected options
        $options.each(function () {
          if (data.options) {
            for (var i = 0; i < data.options.length; i++) {
              if (data.options[i]._id === $(this).data('object-id')) {
                data.options.splice(i, 1)
              }
            }
            if (!data.options.length) {
              // all deleted
              delete data.options
            }
            // commit only to perform reactive actions
            commit(data, true)
          }

          // remove list element
          $(this).closest('li').slideUp(400, function () {
            $(this).remove()
          })
        })
      } else {
        app.toast(i18n({
          'en_us': 'Select the options to delete',
          'pt_br': 'Selecione as opções para deletar'
        }))
      }
    })

    // setup current grid saved options
    var data = Data()
    if (data.options) {
      for (var i = 0; i < data.options.length; i++) {
        addOption(data.options[i])
      }
    }
    // ready to setup and show form
    Tab.formSetup()
  }
}())
