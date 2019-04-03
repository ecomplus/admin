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
    var $birthDate = $birth.find('input[name="birth_date"]')

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

    // birth date treatement of data
    $birthDate.change(function () {
      console.log($birthDate.val())
      var $newDate = $birthDate.val().replace(/(\d{2})(\d{2})(\d{4})/, '$1.$2.$3')
      console.log($newDate)
      var $date = parseInt($newDate.split('.'))
      console.log($date)
    })

    // mask input
    var toggleBlocksByValue = function ($form) {
      Tab.$form.find('input[data-mask]').each(function () {
        switch ($(this).data('mask')) {
          case 'cpf':
            $(this).inputmask('999.999.999-99')
            break

          case 'cnpj':
            $(this).inputmask('99.999.999/9999-99')
            break
        }
      })
    }
  }

  // wait for the form to be ready
  if (Tab.$form) {
    setup()
  } else {
    $(document).one('form-' + tabId, setup)
  }
}())
