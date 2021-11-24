export default ($resourceBlock, event, selectedExportData, selectedImportData, objectPropExport, objectPropImport, $grid) => {
  const { $, app, i18n, callApi } = window
  const tabId = window.tabId
  const Tab = window.Tabs[tabId]

  const clearInformation = () => {
    $resourceBlock.closest('.ajax-content').removeClass('ajax')
    Tab.selectedItems = []
    $grid.find('input[type="checkbox"]:checked').each(function (index) {
      const $checkbox = $(this)
      setTimeout(function () {
        $checkbox.next().click()
      }, index * 20)
    })
  }

  const selectedResource = selectedExportData
  if (!selectedResource.length > 0) {
    app.toast(i18n({
      en_us: 'No items selected',
      pt_br: 'Nenhum item selecionado'
    }))
    return
  }
  const btnDataset = event.currentTarget && event.currentTarget.dataset
  if (!btnDataset) {
    return
  }
  const action = btnDataset.action
  const appId = btnDataset.appId
  const appName = btnDataset.id

  callApi('applications.json', 'GET', (err, data) => {
    if (!err) {
      $resourceBlock.closest('.ajax-content').addClass('ajax')
      const application = data.result.filter(item => item.state === 'active' && item.app_id === Number(appId))
      const idFromApp = application[0] && application[0]._id
      const body = {}
      if (action === 'export') {
        body.exportation = { [objectPropExport]: selectedExportData }
      } else {
        body.importation = { [objectPropImport]: selectedImportData }
      }
      if (idFromApp) {
        callApi(`applications/${idFromApp}/data.json`, 'PATCH', (err, data) => {
          if (!err) {
            setTimeout(clearInformation, 800)
          }
        }, body)
      } else {
        setTimeout(clearInformation, 800)
        app.toast(i18n({
          en_us: `You dont have ${appName.toUpperCase()} installed in your shop`,
          pt_br: `Você não tem ${appName.toUpperCase()} instalado em sua loja`
        }))
      }
    }
  })
}
