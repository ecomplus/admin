const { $, app } = window

const notify = app.toast
const toast = app.toast = obj => {
  if (typeof obj !== 'string' && obj) {
    try {
      obj = JSON.stringify(obj)
    } catch (err) {
      console.error(err)
      return
    }
  }
  notify(obj)

  setTimeout(function () {
    $('div.toast').one('mouseenter', function () {
      $(this).addClass('fix-reveal').one('mouseleave', function () {
        $(this).removeClass('fix-reveal')
      })
    })
  }, 30)
}

const hide = () => {
  $('div.toast.reveal').removeClass('reveal')
}

export default toast

export { toast, hide }
