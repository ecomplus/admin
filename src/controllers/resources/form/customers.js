/* eslint-disable no-var, quote-props, no-prototype-builtins */

/*!
 * Copyright 2018 E-Com Club
 */
export default function () {
  const { $, lang, tabId, handleInputs, setupInputValues, handleNestedObjects, ecomUtils, formatMoney } = window

  // current tab
  var Tab = window.Tabs[tabId]
  // edit JSON document
  var commit = Tab.commit
  var Data = function () {
    // current data from global variable
    return Tab.data
  }

  // render customers on table
  var setup = function () {
    const $customer = $(`#t${tabId}-customer-form`)
    var $infoCustomer = $('#t' + tabId + '-info-customer')
    var $inputRegister = $infoCustomer.find('#t' + tabId + '-registry-type')
    var $registryType = $inputRegister.find('input[name="registry_type"]')
    var $physical = $infoCustomer.find('#t' + tabId + '-physical')
    var $juridical = $infoCustomer.find('#t' + tabId + '-juridical')
    var $inscriptionType = $infoCustomer.find('#t' + tabId + '-inscription-number')
    var $birth = $infoCustomer.find('#t' + tabId + '-birth-date')
    var $birthDate = $birth.find('#t' + tabId + '-birth')
    var $personal = $('#t' + tabId + '-info-personal')
    var $fullName = $personal.find('#t' + tabId + '-full-name')
    var $cpf = $physical.find('#t' + tabId + '-cpf')
    var $cnpj = $juridical.find('#t' + tabId + '-cnpj')
    var $divPhones = $infoCustomer.find('#t' + tabId + '-groupPhones')
    var optionsIndex = 0
    var $staffNotes = $('#t' + tabId + '-staff-notes')
    var $note = $staffNotes.find('#t' + tabId + '-note')
    var $abstract = $('#t' + tabId + '-abstract')
    var $abstractText = $abstract.find('#t' + tabId + '-personalAbs')
    var $abstractStatistic = $abstract.find('#t' + tabId + '-statisAbs')
    const $listOrders = $(`#t${tabId}-list-orders`)
    const $points = $customer.find(`#t${tabId}-points`)
    const $listOfPoints = $points.find(`#t${tabId}-list-of-points`)
    var addOption = function (phones) {
      // add input element for new telephones
      var $input = $('<div />', {
        'class': 'input-group pb-10',
        html: [
          $('<div />', {
            'class': 'input-group-prepend',
            html: [
              $('<button>', {
                'class': 'btn btn-light delete-options',
                html: [
                  $('<i />', {
                    'class': 'fa fa-trash'
                  })
                ]
              })
            ]
          }),
          $('<input>', {
            'class': 'form-control country-code',
            type: 'tel',
            name: 'phones[].' + optionsIndex + '.country_code',
            'data-is-number': 'true'
          }),
          $('<input>', {
            'class': 'form-control w-120px',
            type: 'tel',
            name: 'phones[].' + optionsIndex + '.number',
            'data-mask': 'tel',
            'data-numeric-string': 'true'
          })
        ]
      })
      $divPhones.append($input)
      optionsIndex++
      // Insert mask into new inputs
      handleInputs($input, Tab.inputToData)
      // Set pre-values into inputs
      setupInputValues($input, phonesCustomer[d].number, 'phones.')
    }
    // On change, show if it's a person or juridical type with his inputs
    $registryType.change(function () {
      // check which type and show his input
      if (this.value === 'p') {
        $physical.show()
        $juridical.hide()
        $inscriptionType.hide()
      } else {
        $physical.hide()
        $juridical.show()
        $inscriptionType.show()
      }
    })

    // save doc number physical person
    $cpf.change(function () {
      var data = Data()
      var docNumber = $cpf.val().replace(/(\d{3}).(\d{3}).(\d{3})-(\d{2})/, '$1$2$3$4')
      console.log(docNumber)
      data.doc_number = docNumber
      commit(data, true)
    })

    // save doc number juridical person
    $cnpj.change(function () {
      var data = Data()
      var docNumber = $cnpj.val().replace(/(\d{2}).(\d{3}).(\d{3})\/(\d{4})-(\d{2})/, '$1$2$3$4$5')
      console.log(docNumber)
      data.doc_number = docNumber
      commit(data, true)
    })

    var maskDocNumber = function (data) {
      if (!data.doc_number) {
        return ''
      }
      if (data.registry_type === 'j') {
        return data.doc_number.replace(/(\d{2})(\d{3})(\d{3})\/(\d{4})(\d{2})/, '$1.$2.$3.$4-$5')
      } else {
        return data.doc_number.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
      }
    }

    // separate fullname
    $fullName.change(function () {
      var data = Data()
      // receive full name and separate
      var nameFull = $fullName.val().split(' ')
      var nameLength = nameFull.length
      // if there is a name
      if (nameLength > 0) {
        var firstName = nameFull[0]
        var lastName = nameFull[nameLength - 1]
        var middleName = ''
        for (var c = 1; c < nameFull.length - 1; c++) {
          if (middleName !== '') {
            middleName += ' '
          }
          middleName += nameFull[c]
        }
        if (!data.hasOwnProperty('name')) {
          data.name = {}
        }
        data.name.given_name = firstName
        data.name.family_name = lastName
        data.name.middle_name = middleName
        commit(data, true)
      } else {
        // unset name
        data.name = {}
        commit(data, true)
      }
    })

    // write current full name

    var data = Data()
    if (data.name) {
      var fullName
      if (data.name.middle_name) {
        fullName = data.name.given_name + ' ' + data.name.middle_name + ' ' + data.name.family_name
      } else {
        fullName = data.name.given_name + ' ' + data.name.family_name
      }
      $fullName.val(fullName)
    }

    // write current birth date

    if (data.birth_date) {
      var day = data.birth_date.day
      var month = data.birth_date.month
      // if the number of day or month are less than 10, add 0 at start of them
      if (data.birth_date.day < 10) {
        day = '0' + data.birth_date.day
      }
      if (data.birth_date.month < 10) {
        month = '0' + data.birth_date.month
      }
      if (lang === 'pt_br') {
        var date = day + '/' + month + '/' + data.birth_date.year
        $birthDate.val(date)
      } else {
        date = month + '/' + day + '/' + data.birth_date.year
        $birthDate.val(date)
      }
    }

    // get phones by client
    if (data.phones) {
      var phonesCustomer = data.phones
      for (var d = 0; d < phonesCustomer.length; d++) {
        addOption()
      }
    }

    // get preset note and show
    if (data.staff_notes) {
      $note.val(data.staff_notes)
    }

    // birth date treatement of data
    $birthDate.change(function () {
      var data = Data()
      var newDate = $birthDate.val().split(/(\d{2})\/(\d{2})\/(\d{4})/)
      var dateNew = newDate.filter(String)
      if (!data.hasOwnProperty('birth_date')) {
        data.birth_date = {}
        if (lang === 'pt_br') {
          var day = parseInt(dateNew[0])
          var month = parseInt(dateNew[1])
          var year = parseInt(dateNew[2])
          data.birth_date.day = day
          data.birth_date.month = month
          data.birth_date.year = year
          commit(data, true)
        } else {
          day = parseInt(dateNew[1])
          month = parseInt(dateNew[0])
          year = parseInt(dateNew[2])
          data.birth_date.day = day
          data.birth_date.month = month
          data.birth_date.year = year
          commit(data, true)
        }
      } else {
        data.birth_date = {}
        commit(data, true)
      }
    })

    // mask input
    $physical.find('#t' + tabId + '-cpf').inputmask('999.999.999-99')
    $juridical.find('#t' + tabId + '-cnpj').inputmask('99.999.999/9999-99')
    $divPhones.find('.country-code').inputmask('+99')

    // create input of phones
    $('#t' + tabId + '-add-option').click(function () {
      addOption()
    })

    // delete input phones
    $divPhones.find('.delete-options').click(function () {
      var data = Data()
      if (data.phones) {
        for (var i = 0; i < data.phones.length; i++) {
          if (data.phones[i]) {
            delete data.phones.splice(1, i)
          }
        }
      }
      // remove list element
      $(this).closest('button').parent().parent().slideUp(400, function () {
        $(this).remove()
      })
      // commit only to perform reactive actions
      commit(data, true)
    })
    var $address = $('#t' + tabId + '-customer-shipping')
    var handleShippingObj = function (obj) {
      // preset address if defined
      var addressNew
      var data = Data()
      var addressConvert = function (e) {
        return e.default === true
      }
      if (data.addresses) {
        for (var i = 0; i < data.addresses.length; i++) {
          if (data.addresses[i].default) {
            // customer default shipping address
            addressNew = data.addresses.filter(addressConvert)
            break
          } else {
            addressNew = data.addresses[0]
          }
        }
      }
      obj.zip = Object.assign({ zip: '00000000' }, addressNew)

      // remove excedent properties
      delete obj.zip.default
      delete obj.zip._id
    }
    handleNestedObjects(
      Data,
      commit,
      $address,
      $('#t' + tabId + '-add-shipping'),
      $('#t' + tabId + '-delete-shipping'),
      $('#t' + tabId + '-next-shipping'),
      'addresses',
      handleShippingObj
    )
    // handle collapse for shipping address
    $('div[data-link-collapse]').each(function () {
      var $block = $(this)
      var $form = $block.children('div')
      var $em = $block.children('em')

      var resumeContent = function () {
        // show resumed content on text line
        var content = ''
        $form.find('input').each(function () {
          var text = $(this).val()
          if ((typeof text === 'string' && text.trim() !== '') || typeof text === 'number') {
            content += text + ', '
          }
        })
        // slice content to remove the last ', '
        $em.text(content.slice(0, -2))
      }

      $block.children('a').click(function () {
        $form.slideToggle('slow')
        resumeContent()
        $em.slideToggle()
      })
      // start the resumed content on em tag
      resumeContent()
    })

    // create and show all information about the costumer
    const datatableOptions = {
      scrollY: '200px',
      scrollCollapse: true,
      paging: false
    }
    datatableOptions.language = {
      infoEmpty: '',
      infoFiltered: '',
      lengthMenu: 'Mostrar _MENU_ resultados',
      search: 'Buscar',
      zeroRecords: 'Nenhum resultado encontrado'
    }
    if (data.loyalty_points_entries && data.loyalty_points_entries.length) {
      $points.slideDown()
      data.loyalty_points_entries.forEach(entry => {
        $listOfPoints.find('tbody').append(`<tr>
        <td>${entry.name}</td>
        <td>${entry.earned_points.toFixed(2)}</td>
        <td>${entry.active_points.toFixed(2)}</td>
        <td><a href="/#/resources/orders/${entry.order_id}">${entry.order_id}</a></td>
        </tr>`)
      })
      const earnedPoints = data.loyalty_points_entries.reduce((acc, entry) => acc + entry.earned_points, 0)
      const activePoints = data.loyalty_points_entries.reduce((acc, entry) => acc + entry.active_points, 0)
      $points.find('.card-body').append(`
      <span class="i18n">
        <span data-lang="en_us"><b>Total earned points:</b></span>
        <span data-lang="pt_br"><b>Total de pontos ganhos:</b></span>
      </span> ${earnedPoints.toFixed(2)}
      <br><span class="i18n">
        <span data-lang="en_us"><b>Total active points:</b></span>
        <span data-lang="pt_br"><b>Total de pontos ativos:</b></span>
      </span> ${activePoints.toFixed(2)}
      <br><span class="i18n">
        <span data-lang="en_us"><b>Total used points:</b></span>
        <span data-lang="pt_br"><b>Total de pontos usados:</b></span>
      </span> ${(earnedPoints - activePoints).toFixed(2)}`)
      datatableOptions.language.emptyTable = 'Nenhum ponto contabilizado'
      datatableOptions.language.info = 'Mostrando _START_ a _END_ de _TOTAL_ pontuações carregadas'
      $listOfPoints.DataTable(datatableOptions)
    }

    if (data.orders_count) {
      $(`#t${tabId}-orders`).append(`<span class="i18n">
    <span data-lang="en_us">Amount of money in order: </span>
    <span data-lang="pt_br">Valor total de pedidos: </span
    </span>${formatMoney(data.orders_total_value || 0)}`)
      if (data.orders.length) {
        data.orders.forEach(order => {
          const { _id, number } = order
          const total = (order && order.amount && order.amount.total) || '0'
          const freight = (order && order.amount && order.amount.freight) || '0'
          const discount = (order && order.amount && order.amount.discount) || '0'
          $listOrders.find('tbody').append(`<tr>
        <td>${ecomUtils.formatDate(order)}</td>
        <td><a href="/#/resources/orders/${_id}">${number}</a></td>
        <td>${formatMoney(freight)}</td>
        <td>${formatMoney(discount)}</td>
        <td>${formatMoney(total)}</td>
        </tr>`)
        })
      }
    }
    datatableOptions.language.emptyTable = 'Nenhum pedido realizado'
    datatableOptions.language.info = 'Mostrando _START_ a _END_ de _TOTAL_ pedidos carregados'
    $listOrders.DataTable(datatableOptions)
  }

  // wait for the form to be ready
  if (Tab.$form) {
    setup()
  } else {
    $(document).one('form-' + tabId, setup)
  }
}
