/* eslint-disable no-var, quote-props, no-prototype-builtins */

/*!
 * Copyright 2018 E-Com Club
 */
import {
  i19order
} from '@ecomplus/i18n'

export default function () {
  const { $, lang, tabId, handleInputs, setupInputValues, handleNestedObjects, ecomUtils, formatDate, formatMoney, i18n, callApi } = window

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
      data.doc_number = docNumber
      commit(data, true)
    })

    $(`#t${tabId}-referral`).on('input', function () {
      if ($(this).val() === '') {
        delete data.referral
        commit(data, true)
      }
    })

    // save doc number juridical person
    $cnpj.change(function () {
      var data = Data()
      var docNumber = $cnpj.val().replace(/(\d{2}).(\d{3}).(\d{3})\/(\d{4})-(\d{2})/, '$1$2$3$4$5')
      data.doc_number = docNumber
      commit(data, true)
    })

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

    //$('#t' + tabId + '-add-shipping').click()
    $(`#t${tabId}-zip-code`).on('input', async function() {
      const zipCode = this.value.replace(/\D/g, '')
      if (zipCode && zipCode.length === 8) {
        fetch(`https://viacep.com.br/ws/${zipCode}/json/`).then(response => {
          return response.json()
        }).then(res => {
          const { logradouro, bairro, localidade, uf } = res
          if (res) {
            const combinationsAddress = [['street', logradouro], ['borough', bairro], ['city', localidade], ['province_code', uf]]
            const data = Data()
            let index = 0
            if (data.addresses && data.addresses.length) {
              index = data.addresses.findIndex(address => !address.street)
            }
            combinationsAddress.forEach(each => {
              if (each[1]) {
                $(`#t${tabId}-${each[0]}`).val(each[1])
                data.addresses[index][each[0]] = each[1]
                commit(data, true)
              }
            })
          }
        })
        

      }
    })
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
      scrollY: '400px',
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
    const lengthPoints = data.loyalty_points_entries && data.loyalty_points_entries.length || 0
    $listOfPoints.find('tbody').append(
    `<tr>
       <td>Pontos</td>
       <td>
         <input class="form-control" style="min-width: 80px; max-width: 120px"
           name="earned_points" data-index="${lengthPoints}" type="number" min="0" max="9999999" step="any" value="">
       </td>
       <td>
         <input class="form-control" style="min-width: 80px; max-width: 120px"
           name="active_points" data-index="${lengthPoints}" type="number" min="0" max="9999999" step="any" value="">
       </td>
       <td style="text-align: center">--</td>
       <td>
         <input class="form-control" style="min-width: 98px; max-width: 120px"
           name="valid_thru" data-index="${lengthPoints}" type="text" data-provide="datepicker" data-date-today-highlight="true" value="">
       </td>
   </tr>`)
    $points.slideDown()
    if (lengthPoints >= 0) {
      if (lengthPoints > 0) {
        data.loyalty_points_entries.forEach((entry, i) => {
          $listOfPoints.find('tbody').append(`<tr>
          <td>${entry.name}</td>
          <td>
            <input class="form-control" style="min-width: 80px; max-width: 120px"
              name="earned_points" data-index="${i}" type="number" min="0" max="9999999" step="any" value="${entry.earned_points}">
          </td>
          <td>
            <input class="form-control" style="min-width: 80px; max-width: 120px"
              name="active_points" data-index="${i}" type="number" min="0" max="${entry.earned_points}" step="any" value="${entry.active_points}">
          </td>
          <td style="text-align: center">${entry.order_id ? `<a href="/#/resources/orders/${entry.order_id}">${i18n(i19order)}</a>` : `--`}</td>
          <td>
            <input class="form-control" style="min-width: 98px; max-width: 120px"
              name="valid_thru" data-index="${i}" type="text" data-provide="datepicker" data-date-today-highlight="true" value="${formatDate(entry.valid_thru, [ 'day', 'month', 'year' ]) || ''}">
          </td>
          </tr>`)
        })
  
        const earnedPoints = data.loyalty_points_entries.reduce((acc, entry) => acc + entry.earned_points, 0)
        const activePoints = data.loyalty_points_entries.reduce((acc, entry) => acc + entry.active_points, 0)
        $points.find('.card-body').append(`
        <span class="i18n">
          <span data-lang="en_us">Total earned points:</span>
          <span data-lang="pt_br">Total de pontos ganhos:</span>
        </span> <b>${earnedPoints.toFixed(2)}</b>
        <br><span class="i18n">
          <span data-lang="en_us">Total active points:</span>
          <span data-lang="pt_br">Total de pontos ativos:</span>
        </span> <b>${activePoints.toFixed(2)}</b>
        <br><span class="i18n">
          <span data-lang="en_us">Total used points:</span>
          <span data-lang="pt_br">Total de pontos usados:</span>
        </span> <b>${(earnedPoints - activePoints).toFixed(2)}</b>`)
      } else {
        data.loyalty_points_entries = []
      }

      callApi('applications.json?app_id=124890&fields=_id', 'GET', (err, json) => {
        if (!err) {
          const appId = json.result && json.result.length && json.result[0]._id
          if (appId) {
              callApi(`applications/${appId}.json`, 'GET', (err, json) => {
                if (!err) {
                  const appBody = json.data
                  if (Array.isArray(appBody.programs_rules) && appBody.programs_rules.length) {
                    const program = appBody.programs_rules[0]
                    let edit = 0
                    $listOfPoints.change('input', (e) => {
                      const { target } = e
                      const nameAtt = target.getAttribute('name')
                      const index = target.dataset && target.dataset.index
                      if (index == lengthPoints && edit === 0) {
                        edit++
                        data.loyalty_points_entries.splice(lengthPoints, 0, {
                          _id: ecomUtils.randomObjectId(),
                          name: program.name,
                          program_id: program.program_id ? program.program_id : 'p0_pontos', 
                          ratio: program.ratio,
                        })
                      }
                      let prop = Number(target.value)
                      data.loyalty_points_entries[index][nameAtt] = prop
                      if (nameAtt === 'active_points') {
                        const earnedPoints = data.loyalty_points_entries[index].earned_points
                        if (earnedPoints < prop) {
                          prop = earnedPoints
                          data.loyalty_points_entries[index][nameAtt] = prop
                          target.value = prop
                        }
                      } else if (nameAtt === 'valid_thru') {
                        const [day, month, year] = target.value.split('/')
                        const validDate = new Date(year, month - 1, day, 23, 59, 59, 59)
                        data.loyalty_points_entries[index].valid_thru = validDate.toISOString()
                      }
                      if (data.loyalty_points_entries[index].active_points && data.loyalty_points_entries[index].earned_points) {
                        commit(data, true)
                      }
                    })
                  }
                }
              })
            }
          }
      })
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
        <td>${formatDate(order.created_at)}</td>
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
