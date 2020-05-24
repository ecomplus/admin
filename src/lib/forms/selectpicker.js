const { $ } = window

$.fn.appSelectpicker = function (options) {
  let picker
  if (typeof options !== 'string') {
    picker = this.selectpicker($.extend({}, {
      noneSelectedText: '--',
      windowPadding: 70
    }, options))
  } else {
    picker = this.selectpicker(options)
  }

  this.next('.btn').one('click', function () {
    setTimeout(() => {
      if (!$(this).parent().hasClass('show')) {
        $(this).click()
      }
    }, 50)
  })

  return picker
}
