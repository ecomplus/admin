import { $ecomConfig, i18n as _i18n } from '@ecomplus/utils'
import { reload } from './session'

const { localStorage, $ } = window

let lang = localStorage.getItem('lang')
if (!lang || !/^[a-z]{2}(_[a-z]{2})?$/.test(lang)) {
  lang = 'pt_br'
}
$ecomConfig.set('lang', lang)
if (lang === 'pt_br') {
  $ecomConfig.set('country_code', 'BR')
  $ecomConfig.set('currency', 'BRL')
  $ecomConfig.set('currency_symbol', 'R$')
}

const updateDom = () => {
  const $el = $('#langs-menu [data-lang="' + lang + '"]')
  $el.addClass('active')
  $('#current-lang')
    .find('img').attr('src', $el.find('img').attr('src'))
    .next().text(lang.split('_')[0].toUpperCase())

  $('#langs-menu > a').click(function () {
    localStorage.setItem('lang', $(this).data('lang'))
    reload()
  })

  $('head').append('<style type="text/css">' +
    '.i18n > [data-lang="' + lang + '"]{' +
      'display: inline;' +
    '}' +
  '</style>')
  $('.after-i18n').fadeIn()
}

const i18n = function (label) {
  if (typeof label === 'boolean') {
    if (label) {
      label = {
        en_us: 'Yes',
        pt_br: 'Sim'
      }
    } else {
      label = {
        en_us: 'No',
        pt_br: 'Não'
      }
    }
  } else if (Array.isArray(label)) {
    return label.map(label => _i18n(label))
  }
  return _i18n(label)
}

export default i18n

export { i18n, lang, updateDom }

window.i18n = i18n
window.lang = lang

updateDom()
