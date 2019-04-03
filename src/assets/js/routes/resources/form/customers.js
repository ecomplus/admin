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
    var $cnpj = $juridical.find('input[name="doc_number"]')

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
        $cnpj = $cnpj.val()
        console.log($cnpj)
        cnpj()
      }
    })

    function cnpj () {
      if (!validCNPJ($cnpj)) {
        $juridical.find('#t' + tabId + '-erro').show()
        setTimeout(function () {
          $cnpj.val(' ')
          $juridical.find('#t' + tabId + '-erro').hide()
        }, 12000)
      }
    }

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

  function validCNPJ ($cnpj) {
    if ($cnpj === '') {
      return false
    }
    if ($cnpj.length !== 14) {
      return false
    }
    // Elimina CNPJs invalidos conhecidos
    if ($cnpj === '00000000000000' ||
            $cnpj === '11111111111111' ||
            $cnpj === '22222222222222' ||
            $cnpj === '33333333333333' ||
            $cnpj === '44444444444444' ||
            $cnpj === '55555555555555' ||
            $cnpj === '66666666666666' ||
            $cnpj === '77777777777777' ||
            $cnpj === '88888888888888' ||
            $cnpj === '99999999999999') {
      return false
    }
    // Valida DVs
    var tamanho = $cnpj.length - 2
    var numeros = $cnpj.substring(0, tamanho)
    var digitos = $cnpj.substring(tamanho)
    var soma = 0
    var pos = tamanho - 7
    for (var i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--
      if (pos < 2) {
        pos = 9
      }
    }
    var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
    if (resultado !== digitos.charAt(0)) {
      return false
    }
    tamanho = tamanho + 1
    numeros = $cnpj.substring(0, tamanho)
    soma = 0
    pos = tamanho - 7
    for (var a = tamanho; a >= 1; a--) {
      soma += numeros.charAt(tamanho - a) * pos--
      if (pos < 2) {
        pos = 9
      }
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
    if (resultado !== digitos.charAt(1)) {
      return false
    }
    return true
  }

  // wait for the form to be ready
  if (Tab.$form) {
    setup()
  } else {
    $(document).one('form-' + tabId, setup)
  }
}())
