/* eslint-disable no-var, quote-props, no-prototype-builtins */

/*!
 * Copyright 2018 E-Com Club
 */
import * as md5 from 'blueimp-md5'
import * as OTPAuth from 'otpauth'
// eslint-disable-next-line
const qrcodeToCanvas = require('qrcode').toCanvas

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
    const $tabNav = $(`#t${tabId}-nav`)
    $tabNav.find('[data-id=duplicate]').remove()
    const authenticationId = routeParams[routeParams.length - 1]
    const $authenticationForm = $(`#t${tabId}-authentication-form`)
    const $buttonPermission = $authenticationForm.find(`#t${tabId}-action-save-permission`)
    const $permissions = $authenticationForm.find(`#t${tabId}-permissions`)
    const $listPermissions = $permissions.find(`#t${tabId}-list-permissions`)
    const $permissionResources = $listPermissions.find(`#t${tabId}-permission-resources`)
    const $password = $authenticationForm.find(`#t${tabId}-password`)
    const $editStorefront = $(`#t${tabId}-edit-storefront`)
    const myId = localStorage.getItem('my_id')
    const data = Data()
    delete data['pass_md5_hash']
    if (myId === authenticationId) {
      $tabNav.find('[data-id=delete]').remove()  
    }
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
    const checkedAll = (resource, checkboxInputs, checked) => {
      if (resource === '*') {
        if (checked) {
          checkboxInputs.prop('checked', false)
        } else {
          checkboxInputs.prop('checked', true)
        }
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
    // Handle 2FA setup (only visible to the user editing their own account)
    // Note: renderContentIds() converts data-id="foo" to id="t{tabId}-foo", so we use tabId-prefixed selectors
    if (authenticationId === myId) {
      const $section2fa = $(`#t${tabId}-2fa-section`)
      const $disabled = $(`#t${tabId}-2fa-disabled`)
      const $setup = $(`#t${tabId}-2fa-setup`)
      const $enabled = $(`#t${tabId}-2fa-enabled`)
      $section2fa.slideDown()

      const getTotpFlag = (currentData) => Array.isArray(currentData.flags) &&
        currentData.flags.find(function (f) { return f.startsWith('totp:') })

      const show2faState = () => {
        const currentData = Data()
        const prefs = currentData.panel_preferences
        if (prefs && prefs.totp_enabled && getTotpFlag(currentData)) {
          $disabled.hide()
          $setup.hide()
          $enabled.show()
        } else {
          $disabled.show()
          $setup.hide()
          $enabled.hide()
        }
      }
      show2faState()

      let pendingTotpSecret = null

      $(`#t${tabId}-2fa-enable-btn`).click(function () {
        // 9-byte secret → 15 unpadded base32 chars; stored as "totp:XXXXXXXXXXXXXXX" = 20 chars (flags maxLength)
        const secret = new OTPAuth.Secret({ size: 9 })
        pendingTotpSecret = secret.base32.replace(/=/g, '')
        const currentData = Data()
        const issuer = 'EcomPlus'
        const label = currentData.email || currentData.username || 'user'
        const totp = new OTPAuth.TOTP({
          issuer,
          label,
          secret,
          digits: 6,
          period: 30
        })
        const otpauthUri = totp.toString()
        const $qrcodeDiv = $(`#t${tabId}-2fa-qrcode`)
        $qrcodeDiv.empty()
        qrcodeToCanvas(otpauthUri, { width: 200 }, function (err, canvas) {
          if (!err) {
            $qrcodeDiv.append(canvas)
          }
        })
        $(`#t${tabId}-2fa-secret-text`).text(pendingTotpSecret.match(/.{1,4}/g).join(' '))
        $(`#t${tabId}-2fa-confirm-input`).val('')
        $disabled.hide()
        $setup.show()
      })

      $(`#t${tabId}-2fa-cancel-btn`).click(function () {
        pendingTotpSecret = null
        show2faState()
      })

      $(`#t${tabId}-2fa-confirm-btn`).click(function () {
        if (!pendingTotpSecret) return
        const token = $(`#t${tabId}-2fa-confirm-input`).val().replace(/\s/g, '')
        if (!/^\d{6}$/.test(token)) {
          app.toast(i18n({ en_us: 'Enter a valid 6-digit code', pt_br: 'Digite um código de 6 dígitos válido' }))
          return
        }
        try {
          const totp = new OTPAuth.TOTP({
            secret: OTPAuth.Secret.fromBase32(pendingTotpSecret),
            digits: 6,
            period: 30
          })
          const delta = totp.validate({ token, window: 1 })
          if (delta !== null) {
            const currentData = Data()
            if (!currentData.panel_preferences) {
              currentData.panel_preferences = {}
            }
            currentData.panel_preferences.totp_enabled = true
            if (!currentData.flags) {
              currentData.flags = []
            }
            currentData.flags = currentData.flags.filter(function (f) { return !f.startsWith('totp:') })
            currentData.flags.push('totp:' + pendingTotpSecret)
            pendingTotpSecret = null
            commit(currentData, true)
            callApi(`authentications/${authenticationId}.json`, 'PATCH', function (err) {
              if (err) {
                app.toast(i18n({ en_us: 'Error saving 2FA settings', pt_br: 'Erro ao salvar configurações de 2FA' }))
              } else {
                show2faState()
                app.toast(i18n({ en_us: 'Two-factor authentication enabled', pt_br: 'Autenticação em dois fatores ativada' }))
              }
            }, { panel_preferences: currentData.panel_preferences, flags: currentData.flags })
          } else {
            app.toast(i18n({ en_us: 'Invalid code, please try again', pt_br: 'Código inválido, tente novamente' }))
            $(`#t${tabId}-2fa-confirm-input`).val('').focus()
          }
        } catch (e) {
          console.error(e)
          app.toast(i18n({ en_us: 'Error verifying code', pt_br: 'Erro ao verificar o código' }))
        }
      })

      $(`#t${tabId}-2fa-disable-btn`).click(function () {
        const confirmed = window.confirm(i18n({
          en_us: 'Disable two-factor authentication? Your account will be less secure.',
          pt_br: 'Desativar autenticação em dois fatores? Sua conta ficará menos segura.'
        }))
        if (confirmed) {
          const currentData = Data()
          if (currentData.panel_preferences) {
            currentData.panel_preferences.totp_enabled = false
          }
          if (currentData.flags) {
            currentData.flags = currentData.flags.filter(function (f) { return !f.startsWith('totp:') })
          }
          commit(currentData, true)
          callApi(`authentications/${authenticationId}.json`, 'PATCH', function (err) {
            if (err) {
              app.toast(i18n({ en_us: 'Error saving 2FA settings', pt_br: 'Erro ao salvar configurações de 2FA' }))
            } else {
              show2faState()
              app.toast(i18n({ en_us: 'Two-factor authentication disabled', pt_br: 'Autenticação em dois fatores desativada' }))
            }
          }, { panel_preferences: currentData.panel_preferences, flags: currentData.flags })
        }
      })
    }

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
                  name="${resource}" ${checkPermission(permissions, resource) ? 'checked' : ''} />
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
              json['stores'] = ['GET']
              json[resource] = ['all']
              checkedAll(resource, $allResouceInputs, true)
              delete json['*']
            } else {
              checkedAll(resource, $allResouceInputs, false)
              json[resource] = []
              json['stores'] = ['GET']
            }
          })
          $buttonPermission.click(() => {
            callApi(`authentications/${authenticationId}/permissions.json`, 'PATCH', (err, result) => {
              if (err) {
                app.toast(i18n({
                  'en_us': 'Error! Permissions does not save!',
                  'pt_br': 'Erro! Permissões não salvas!'
                }))
              } else {
                app.toast(i18n({
                  'en_us': 'Permission save with success!',
                  'pt_br': 'Permissões salvas com sucesso!'
                }))
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
