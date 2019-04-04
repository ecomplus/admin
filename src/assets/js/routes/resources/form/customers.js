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

    // Show cnpj if is juridical
    $registryType.change(function () {
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

    // separate name
    $fullName.change(function () {
      var data = Data()
      var nameFull = $fullName.val().split(' ')
      var nameLength = nameFull.length
      if (nameLength > 0) {
        var firstName = nameFull[0]
        var lastName = nameFull[nameLength - 1]
        var middleName = ' '
        for (var c = 1; c < nameFull.length - 1; c++) {
          middleName += nameFull[c] + ' '
        }
        data.name.given_name = firstName
        data.name.family_name = lastName
        data.name.middle_name = middleName
        commit(data, true)
      } else {
        data.name.given_name = ' '
        data.name.family_name = ' '
        data.name.middle_name = ' '
        commit(data, true)
      }
    })

    // write current full name
    // $fullName.change(function () {
    //  var data = Data()
    //  if (data.name) {
    //    var fullName = data.name.given_name + ' ' + data.name.middle_name + ' ' + data.name.family_name
    //  }
    //  console.log(fullName)
    //  $fullName.val(fullName)
    // })

    // birth date treatement of data
    $birthDate.change(function () {
      var data = Data()
      var newDate = $birthDate.val().split(/(\d{2})\/(\d{2})\/(\d{4})/)
      console.log(newDate)
      var dateNew = newDate.filter(String)
      var day = parseInt(dateNew[0])
      console.log(day)
      var month = parseInt(dateNew[1])
      console.log(month)
      var year = parseInt(dateNew[2])
      console.log(year)
      data.birth_date.day = day
      data.birth_date.month = month
      data.birth_date.year = year
      commit(data, true)
    })

    // mask input
    $juridical.find('#t' + tabId + '-cpf').inputmask('999.999.999-99')
    $physical.find('#t' + tabId + '-cnpj').inputmask('99.999.999/9999-99')

    // write current birth date
    // var data = Data()
    // if (data.birth_date) {
    //  var date = formatDate(eventObj.date_time, dateList)
    // }
  }

  // wait for the form to be ready
  if (Tab.$form) {
    setup()
  } else {
    $(document).one('form-' + tabId, setup)
  }
}())
