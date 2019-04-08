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

  // render cart items on table
  var setup = function () {
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
    var $telephone = $infoCustomer.find('#t' + tabId + '-telephone')
    var $cpf = $physical.find('#t' + tabId + '-cpf')
    var $cnpj = $juridical.find('#t' + tabId + '-cnpj')
    var $divPhones = $infoCustomer.find('#t' + tabId + '-groupPhones')
    var phonesList = '<div class="input-group"> ' +
                   '  <div class="input-group-prepend"> ' +
                   '    <span class="input-group-text"> ' +
                   '    <div class="custom-control custom-checkbox"> ' +
                   '      <input type="checkbox" class="custom-control-input"> ' +
                   '      <label class="custom-control-label" for="cc-1"></label> ' +
                   '    </div> ' +
                   '    </span> ' +
                   '  </div> ' +
                   '      <input type="tel" class="form-control" data-id="phone" name="phones.number" data-mask="tel"/> ' +
                   '</div>'

    var addOption = function (phones) {
      // add input element
      var $input = $('<div />', {
        html: phonesList
      })
      $divPhones.after($input)
      handleInputs($input, Tab.inputToData)
    }
    // Show cnpj if is juridical
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

    // separate name
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
      var fullName = data.name.given_name + ' ' + data.name.middle_name + ' ' + data.name.family_name
      $fullName.val(fullName)
    }

    // write current birth date

    if (data.birth_date) {
      var date = data.birth_date.day + '/' + data.birth_date.month + '/' + data.birth_date.year
      $birthDate.val(date)
    }

    // get phones by client
    if (data.phones) {
      var phonesCustomer = data.phones
      var phone = []
      for (var d = 0; d < phonesCustomer.length; d++) {
        phone.push(phonesCustomer[d].number)
        addOption()
      }
    }

    // save phone number
    $telephone.change(function () {
      var data = Data()
      var numb = data.phones.length
      var numberPhone = $telephone.val()
      var numberPhoneStr = numberPhone.replace('(', '').replace(')', '').replace('-', '').replace(' ', '').replace(' ', '')
      if (numb === 0) {
        data.phones[0].number = numberPhoneStr
        commit(data, true)
      } if (numb > 0) {
        data.phones[numb].number = numberPhoneStr
        commit(data, true)
      }
    })

    // birth date treatement of data
    $birthDate.change(function () {
      var data = Data()
      var newDate = $birthDate.val().split(/(\d{2})\/(\d{2})\/(\d{4})/)
      var dateNew = newDate.filter(String)
      var day = parseInt(dateNew[0])
      var month = parseInt(dateNew[1])
      var year = parseInt(dateNew[2])
      data.birth_date.day = day
      data.birth_date.month = month
      data.birth_date.year = year
      commit(data, true)
    })

    // mask input
    $physical.find('#t' + tabId + '-cpf').inputmask('999.999.999-99')
    $juridical.find('#t' + tabId + '-cnpj').inputmask('99.999.999/9999-99')

    // create input of phones
    $('#t' + tabId + '-add-option').click(function () {
      addOption()
    })
  }

  // wait for the form to be ready
  if (Tab.$form) {
    setup()
  } else {
    $(document).one('form-' + tabId, setup)
  }
}())
