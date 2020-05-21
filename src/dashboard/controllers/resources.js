import * as resourceHTML from '@/dashboard/views/resources.html'
import * as listHTML from '@/dashboard/views/resources/list.html'
import { handleError } from '../router/'

class Resources {
  constructor (resourceEl) {
    this.resourceEl = resourceEl
    this.resourceHTML = resourceHTML
    this.formHTML = ''
    this.listHTML = listHTML
    this.formLoaders = []
    this.listLoaders = []
  }

  islisting () {
    return this.resourceId === undefined
  }

  isNew () {
    return this.resourceId === 'new'
  }

  getTablabel () {
    if (this.islisting()) {
      return this.i18n({
        'en_us': 'List',
        'pt_br': 'Listar'
      })
    }

    if (this.isNew()) {
      return this.i18n({
        'en_us': 'Create',
        'pt_br': 'Criar'
      })
    }
    return this.i18n({
      'en_us': 'Edit',
      'pt_br': 'Editar'
    })
  }

  getTabTitle() {
    let tabTitle = this.resource.label[this.lang]
    return this.islisting() ? tabTitle : `${tabTitle} · ${this.tabLabel}`
  }

  renderH1() {
    let html = `<strong> ${this.resource.label[this.lang]}</strong> · ${this.tabLabel}`
    if (this.resourceId === undefined) {
      $('#t' + this.tabId + '-resource-name').html(html)
    } else {
      html = `
        ${html}
        <a class="btn btn-pure" style="font-size: 10px; background: rgba(223,242,0,0.1); padding: 3px 10px" data-provide="tooltip" id="clipboad" data-placement="top" data-original-title="Clique para copiar ID" data-clipboard-text="${this.resourceId}">
          ID <i class="ti-clipboard"></i>
        </a>
      `
      $('#t' + this.tabId + '-resource-name').html(html)
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

  renderBreadcrump() {
    const html = `
    <li class="breadcrumb-item">
      <a href="/#/resources/${this.slug}">
        <i class="fa fa-${this.resource.icon}"></i>${this.resource.label[this.lang]}
      </a>
    </li>
    <li class="breadcrumb-item active">
      ${this.tabLabel}
    </li>
    `
    $('#t' + this.tabId + '-breadcrumbs').append(html)
  }

  getJsonEditor() {
    const editor = ace.edit('t' + this.tabId + '-code-editor')
    editor.setTheme('ace/theme/dawn')
    editor.session.setMode('ace/mode/json')
    $('#t' + this.tabId + '-code-tab').click(function () {
      // focus on editor and force viewport update
      setTimeout(function () {
        editor.focus()
        editor.renderer.updateFull()
      }, 200)
    })
    return editor
  }

  loadListContent(el) {
    this.handleHtml(this.listHTML, el)
    window.routeReady(this.tabTitle)
  }

  loadFormContent(el) {
    // commit changes on JSON document globally
    // improve reactivity
    this.Tab.commit = this.commit
    const self = this
    this.editor.on('blur', function () {
      // code editor manually changed (?)
      var json
      try {
        json = JSON.parse(self.editor.session.getValue())
      } catch (e) {
        // invalid JSON
        return
      }
      // update data
      self.Tab.data = json
    })
    this.editor.on('change', function () {
      window.triggerUnsaved(self.tabId)
    })
    this.handleHtml(this.formHTML, el)

    window.routeReady(this.tabTitle)
  }

  loadContent() {
    const el = $('#t' + this.tabId + '-tab-normal')
    if (this.islisting()) {
      return this.loadListContent(el)
    }
    return this.loadFormContent(el)
  }

  handleHtml(html, el) {
    const parent = el.closest('.ajax-content')
    parent.addClass('ajax')
    if (this.islisting()) {
      if (!this.loadedLists) {
        el.html(html)
        for (const listLoader of this.listLoaders) {
          listLoader()
        }
      }
      this.loadedLists = true
    } else {
      if (!this.loadedForms) {
        el.html(html)
        for (const formLoader of this.formLoaders) {
          formLoader()
        }
      }
      this.loadedForms = true
    }
    parent.removeClass('ajax')

  }

  commit(json, updated) {
    let self = this
    if (!self) {
      self = window.Tabs[window.tabId].resourceInstance
    }
    if (!updated) {
      // pass JSON data
      self.Tab.data = json
    }
    // reset Ace editor content
    self.editor.session.setValue(JSON.stringify(json, null, 4))
  }

  handlerPaginationButtons() {
    if (this.Tab.state.pagination) {
      const $next = $('#t' + tabId + '-pagination-next')
      const $prev = $('#t' + tabId + '-pagination-prev')
      if (this.Tab.state.page === 0) {
        $prev.addClass('disabled')
      }
      // global tab pagination handler
      this.Tab.pagination = this.Tab.state.pagination
      const self = this
      $prev.click(function () {
        $(this).addClass('disabled')
        self.Tab.pagination(true)
      })
      $next.click(function () {
        $(this).addClass('disabled')
        self.Tab.pagination()
      }).closest('.pagination-arrows').fadeIn()
    }
  }

  showCreateButton() {
    $('#t' + this.tabId + '-new').fadeIn().click(function () {
      // redirect to create document page
      window.location = '/' + window.location.hash + '/new'
    })
  }

  showDeleteButton() {
    // show delete button
    $('#t' + this.tabId + '-delete').fadeIn().click(function () {
      this.bulkActionDelete('DELETE')
    })
  }

  bulkAction(method, bodyObject) {
    var todo = this.Tab.selectedItems.length
    if (todo > 0) {
      $('#modal-saved').modal('show')
      var cb = Tab.editItemsCallback()
      // call API to delete documents
      var done = 0
      // collect all requests errors
      var errors = []

      var next = function () {
        var callback = function (err) {
          if (err) {
            errors.push(err)
          }
          done++
          if (done === todo) {
            // end
            if (typeof cb === 'function') {
              cb(errors)
            }
            // reset selected IDs
            this.Tab.selectedItems = []
          } else {
            next()
          }
        }
        var id = this.Tab.selectedItems[done]
        window.callApi(this.slug + '/' + id + '.json', method, callback, bodyObject)
      }
      $('#list-save-changes').click(next)
      $('#ignore-unsaved').click(function () {
        this.Tab.selectedItems = []
        this.loadData()
      })
    } else if (!this.resourceId) {
      // nothing to do, alert
      app.toast(i18n({
        'en_us': 'No items selected',
        'pt_br': 'Nenhum item selecionado'
      }))
    }
  }

  bulkActionDelete(method, bodyObject) {
    var todo = this.Tab.selectedItems.length
    if (todo > 0) {
      var cb = this.Tab.editItemsCallback()
      // call API to delete documents
      var done = 0
      // collect all requests errors
      var errors = []

      var next = function () {
        var callback = function (err) {
          if (err) {
            errors.push(err)
          }
          done++
          if (done === todo) {
            // end
            if (typeof cb === 'function') {
              cb(errors)
            }
            // reset selected IDs
            this.Tab.selectedItems = []
          } else {
            next()
          }
        }
        var id = this.Tab.selectedItems[done]
        window.callApi(this.slug + '/' + id + '.json', method, callback, bodyObject)
      }
      next()
    } else if (!this.resourceId) {
      // nothing to do, alert
      app.toast(i18n({
        'en_us': 'No items selected',
        'pt_br': 'Nenhum item selecionado'
      }))
    }
  }

  preLoadData() {
    let params, endpoint
    if (this.islisting()) {
      this.editor.setReadOnly(true)
      endpoint = `${this.slug}.json`
      params = 'limit=60&sort=-updated_at'
    } else {
      endpoint = `${this.slug}/${this.resourceId}.json`
      this.handlerPaginationButtons()
    }
    return { params, endpoint }
  }

  loadData(callback, params) {
    let self = this
    if (!self) {
      self = window.Tabs[window.tabId].resourceInstance
    }
    if (self.isNew()) {
      self.commit({})
      return self.loadContent()
    }
    self.showCreateButton()
    self.showDeleteButton()
    const { otherParams, endpoint } = self.preLoadData()
    params = params ? params : otherParams
    let uri = endpoint
    if (params) {
      uri += '?' + params
    }

    window.callApi(uri, 'GET', function (err, json) {
      if (!err) {
        if (!self.isNew()) {
          // editing
          // show modification timestamps
          if (json.created_at) {
            var dateList = ['day', 'month', 'year', 'hour', 'minute', 'second']
            if (json.updated_at) {
              $('#t' + self.tabId + '-updated-at').text(formatDate(json.updated_at, dateList))
            }
            $('#t' + self.tabId + '-created-at').text(formatDate(json.created_at, dateList))
              .closest('.document-dates').fadeIn()
          }

          // remove common immutable data
          delete json._id
          delete json.store_id
          delete json.created_at
          delete json.updated_at
        }
        // set tab JSON data
        self.commit(json)
      }
      if (typeof(callback) === 'function') {
        callback()
      }
      self.loadContent()
    })

    self.Tab.selectedItems = []
    self.Tab.editItemsCallback = function () {
      // returns callback for bulk action end
      return function () { }
    }

    self.Tab.editItems = function (bodyObject) {
      bulkAction('PATCH', bodyObject)
    }
  }

  handleResource() {
    const parent = this.resourceEl.closest('.ajax-content')
    parent.addClass('ajax')
    this.loadedLists = false
    this.loadedForms = false
    this.resourceEl.html(this.resourceHTML)
    this.tabId = window.tabId
    this.Tab = window.Tabs[this.tabId]
    window.renderContentIds()
    this.resourceId = window.routeParams[1]
    this.slug = window.routeParams[0]
    if (!this.slug) {
      handleError('404', $('#t' + tabId + '-tab-normal'))
    }
    this.Tab.resourceInstance = this
    this.Tab.resourceId = this.resourceId
    this.Tab.selectedItems = []
    this.Tab.slug = this.slug
    this.Tab.load = this.loadData
    this.resource = window.apiResources[this.slug]
    this.lang = window.lang
    this.i18n = window.i18n
    this.tabLabel = this.getTablabel()
    this.listing = this.islisting()
    this.creating = this.isNew()
    this.tabTitle = this.getTabTitle()
    this.editor = this.getJsonEditor()
    this.renderBreadcrump()
    this.loadData(() => {
      this.renderH1()
    })
  }
}

export default Resources
