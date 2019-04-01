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
    $('input[type=radio][name=registry_type]').change(function () {
      if (this.value === 'p') {
        $('.cpf').show()
        $('.cnpj').hide()
      } else if (this.value === 'j') {
        $('.cpf').hide()
        $('.cnpj').show()
      }
    })
    $('input[type=radio][name=inscription_type]').change(function () {
      if (this.value === 'State') {
        $('.state').show()
        $('.municipal').hide()
      } else if (this.value === 'Municipal') {
        $('.state').hide()
        $('.municipal').show()
      }
    })
  }
  // mask input
  var toggleBlocksByValue = function ($form) {
    $form.find('input[data-mask]').each(function () {
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

  // wait for the form to be ready
  if (Tab.$form) {
    setup()
  } else {
    $(document).one('form-' + tabId, setup)
  }
}())
