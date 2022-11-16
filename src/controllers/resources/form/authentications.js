/* eslint-disable no-var, quote-props, no-prototype-builtins */

/*!
 * Copyright 2018 E-Com Club
 */
import * as md5 from 'blueimp-md5'

export default function () {
  const { $, i18n, tabId, callApi, routeParams, app, localStorage } = window

  // current tab
  const Tab = window.Tabs[tabId]
  // edit JSON document
  const commit = Tab.commit
  const Data = function () {
    // current data from global variable
    return Tab.data
  }

  // render customers on table
  const setup = function () {
    const authenticationId = routeParams[routeParams.length - 1]
    const $authenticationForm = $(`#t${tabId}-authentication-form`)
    const $permissions = $authenticationForm.find(`#t${tabId}-permissions`)
    const $listPermissions = $permissions.find(`#t${tabId}-list-permissions`)
    const $permissionResources = $listPermissions.find(`#t${tabId}-permission-resources`)
    const $password = $authenticationForm.find(`#t${tabId}-password`)
    const $editStorefront = $(`#t${tabId}-edit-storefront`)
    const myId = localStorage.getItem('my_id')
    const data = Data()
    delete data['pass_md5_hash']
    const dictionary = {
      all: i18n({
        en_us: 'All',
        pt_br: 'Todos'
      }),
      applications: i18n({
        en_us: 'Applications',
        pt_br: 'Aplicativos'
      }),
      authentications: i18n({
        en_us: 'Authentications',
        pt_br: 'Autenticações'
      }),
      brands: i18n({
        en_us: 'Brands',
        pt_br: 'Marcas'
      }),
      carts: i18n({
        en_us: 'Carts',
        pt_br: 'Carrinhos'
      }),
      categories: i18n({
        en_us: 'Categories',
        pt_br: 'Categorias'
      }),
      create: i18n({
        en_us: 'Create',
        pt_br: 'Criar'
      }),
      collections: i18n({
        en_us: 'Collections',
        pt_br: 'Coleções'
      }),
      customers: i18n({
        en_us: 'Customers',
        pt_br: 'Clientes'
      }),
      delete: i18n({
        en_us: 'Delete',
        pt_br: 'Deletar'
      }),
      edit: i18n({
        en_us: 'Edit',
        pt_br: 'Editar'
      }),
      grids: i18n({
        en_us: 'Grids',
        pt_br: 'Grades'
      }),
      orders: i18n({
        en_us: 'Orders',
        pt_br: 'Pedidos'
      }),
      products: i18n({
        en_us: 'Products',
        pt_br: 'Produtos'
      }),
      stores: i18n({
        en_us: 'Edit store',
        pt_br: 'Editar configuração da loja'
      })
    }
    const resources = [
      'applications',
      'authentications',
      'brands',
      'carts',
      'categories',
      'collections',
      'customers',
      'grids',
      'orders',
      'products',
      'stores'
    ]
    const checkPermission = (permissions, permissionToCheck) => {
      if (Array.isArray(permissions[permissionToCheck])) {
        return Boolean(permissions[permissionToCheck][0] === 'all')
      }
    }
    const checkedAll = (resource, checkboxInputs) => {
      if (resource === '*') {
        setTimeout(() => {
          checkboxInputs.next().click()
        }, 50)
      }
    }
    const togglePassword = (eye, input) => {
      eye.click(function () {
        $(this).toggleClass('fa-eye fa-eye-slash')
        if (input.attr('type') === 'password') {
          input.attr('type', 'text')
        } else {
          input.attr('type', 'password')
        }
      })
    }
    togglePassword($('#n-password-eye'), $('#n-password'))
    togglePassword($('#r-password-eye'), $('#r-password'))
    // Handle Change Password
    let password, repeatPassword
    $password.change(el => {
      const data = Data()
      const { target } = el
      if (target.id === 'n-password') {
        password = target.value
      }
      if (target.id === 'r-password') {
        repeatPassword = target.value
      }
      if (repeatPassword && password) {
        if (repeatPassword === password) {
          data.pass_md5_hash = md5(password)
          commit(data, true)
        } else {
          app.toast(i18n({
            'en_us': 'Password is not the same',
            'pt_br': 'Senha não se repete!'
          }))
        }
      } else {
        delete data.pass_md5_hash
      }
    })
    // Handle permissions
    if (authenticationId !== 'new' && (authenticationId !== myId)) {
      callApi(`authentications/${authenticationId}/permissions.json`, 'GET', (err, json) => {
        if (!err) {
          $permissions.slideDown()
          $editStorefront.slideDown()
          const saveButton = $('#action-save')
          const permissions = json
          const isAllAllowed = checkPermission(permissions, '*')
          $permissionResources.before(`
          <div class="form-group">
            <div class="custom-controls-stacked pb-10">
              <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input"
                  name="*"/ ${isAllAllowed ? 'checked' : ''}>
                <label class="custom-control-label">
                  ${dictionary.all}
                </label>
              </div>
            </div>
          </div>`)
          resources.forEach(resource => {
            $permissionResources.append(`<div class="custom-controls-stacked">
              <div class="custom-control custom-checkbox pr-20 pb-10">
                <input type="checkbox" class="custom-control-input checkbox-permissions"
                  name="${resource}" ${isAllAllowed || checkPermission(permissions, resource) ? 'checked' : ''} />
                <label class="custom-control-label">
                  <span class="title">${dictionary[resource]}</span>
                </label>
              </div>
            </div>`)
          })
          const $allResouceInputs = $permissionResources.find('.checkbox-permissions')
          $listPermissions.change(el => {
            const resource = el.target.name
            const checked = el.target.checked
            if (checked) {
              json[resource] = ['all']
              checkedAll(resource, $allResouceInputs)
            } else {
              checkedAll(resource, $allResouceInputs)
              json[resource] = []
            }
          })
          saveButton.click(() => {
            callApi(`authentications/${authenticationId}/permissions.json`, 'PATCH', (err, result) => {
              if (err) {
                app.toast(i18n({
                  'en_us': 'Error! Permissions does not save!',
                  'pt_br': 'Erro! Permissões não salvas!'
                }))
              } else {
                const $done = $('#action-done')
                $done.fadeIn(400, function () {
                  setTimeout(function () {
                    $done.fadeOut(200, function () {
                    })
                  }, 800)
                })
              }
            }, json)
          })
        }
      })
    } else if (authenticationId === 'new') {
      $editStorefront.slideDown()
    } else {
      delete data['edit_storefront']
    }
  }

  // wait for the form to be ready
  if (Tab.$form) {
    setup()
  } else {
    $(document).one('form-' + tabId, setup)
  }
}
