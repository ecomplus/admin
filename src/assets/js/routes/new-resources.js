class Resources {
  constructor() {
    this.tabId = window.tabId
    this.Tab = window.Tabs[tabId]
    this.resourceId = window.routeParams[1]
    this.slug = window.routeParams[0]
    this.resource = window.apiResources[slug]

  }

  renderH1() {
    let html = `<strong> ${resource.label[lang]}</strong> · ${tabLabel}`
    if (this.resourceId === undefined) {
      $('#t' + tabId + '-resource-name').html(html)
    } else {
      html = `
        ${html}
        <a class="btn btn-pure" style="font-size: 10px; background: rgba(223,242,0,0.1); padding: 3px 10px" data-provide="tooltip" id="clipboad" data-placement="top" data-original-title="Clique para copiar ID" data-clipboard-text="${resourceId}">
          ID <i class="ti-clipboard"></i>
        </a>
      `
      $('#t' + tabId + '-resource-name').html(html)
      $('#clipboad').hover(function () {
        $(this).tooltip('show')
      })
      $('#clipboad').click(function () {
        $(this).attr('data-original-title', 'ID copiado!')
        $(this).find('.ti-clipboard').replaceWith('<i class="ti-check"></i>')
        $(this).tooltip('show')
      })
    }
  }
}

export default Resources