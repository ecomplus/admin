export default (navClick, resourceBlock, selectedExportData, selectedImportData, objectPropExport, objectPropImport) => {
  const { app, i18n, callApi } = window
  const tabId = window.tabId
  const Tab = window.Tabs[tabId]
  navClick.click(() => {
    const selectedResource = selectedExportData
    if (!selectedResource.length > 0) {
      app.toast(i18n({
        en_us: 'Nothing was selected',
        pt_br: 'Nada foi selecionado'
      }))
    } else {
      navClick.find('button').attr('data-toggle', 'dropdown')
      navClick.find('.dropdown-menu a').click((event) => {
        const action = event.currentTarget && event.currentTarget.dataset && event.currentTarget.dataset.action
        const appId = event.currentTarget && event.currentTarget.dataset && event.currentTarget.dataset.appId
        const appName = event.currentTarget && event.currentTarget.dataset && event.currentTarget.dataset.id
        callApi('applications.json', 'GET', (err, data) => {
          if (!err) {
            resourceBlock.closest('.ajax-content').addClass('ajax')
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
                  setTimeout(() => {
                    resourceBlock.closest('.ajax-content').removeClass('ajax')
                    Tab.selectedItems = []
                  }, 800)
                } else {
                  console.log(err)
                  app.toast(i18n({
                    en_us: 'Error. Something get wrong.',
                    pt_br: 'Erro. Algo deu errado.'
                  }))
                }
              }, body)
            } else {
              setTimeout(() => {
                resourceBlock.closest('.ajax-content').removeClass('ajax')
                Tab.selectedItems = []
              }, 800)
              app.toast(i18n({
                en_us: `You dont have ${appName} installed in your shop`,
                pt_br: `Você não tem ${appName} instalado em sua loja`
              }))
            }
          }
        })
      })
    }
  })
}
