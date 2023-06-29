export default function () {
  const { $, ecomUtils, callApi, formatPhone, tabId, routeParams } = window
  const store = window.Store || {}

  const $appTab = $(`#app-tab-${tabId}`)
  const orderIds = routeParams[routeParams.length - 1]
  const endpoint = `orders.json?_id=${orderIds}` +
    '&fields=buyers.name,buyers.phones,buyers.doc_number,shipping_lines,number,' +
      'items.name,items.quantity,items.price,items.final_price,items.sku,amount.total'

  callApi(endpoint, 'GET', (error, data) => {
    if (!error) {
      let $shippingTags = []
      $appTab.find('.show-total').click(() => {
        $('.total-price').toggle()
      })
      const $correiosEnderecador = $appTab.find('.correios-enderecador')
      const fillCorreiosForm = (from, to, count) => {
        $correiosEnderecador.append(`
          <input type="hidden" name="tipo_cep_${count}" value="2">
          <input type="hidden" name="cep_${count}" value="${(from.zip || '')}">
          <input type="hidden" name="nome_${count}" value="${(from.name || '')}">
          <input type="hidden" name="empresa_${count}" value="">
          <input type="hidden" name="endereco_${count}" value="${(from.street || '')}">
          <input type="hidden" name="numero_${count}" value="${(from.number || '')}">
          <input type="hidden" name="complemento_${count}" value="${(from.complement || '')}">
          <input type="hidden" name="bairro_${count}" value="${(from.borough || '')}">
          <input type="hidden" name="cidade_${count}" value="${(from.city || '')}">
          <input type="hidden" name="uf_${count}" value="${(from.province_code || '')}">
          <input type="hidden" name="selUf_${count}" value="${(from.province_code || '')}">
          <input type="hidden" name="telefone_${count}" value="${(from.phone ? from.phone.number : '')}">
          <input type="hidden" name="desTipo_cep_${count}" value="2">
          <input type="hidden" name="mp_${count}" value="">
          <input type="hidden" name="desCep_${count}" value="${(to.zip || '')}">
          <input type="hidden" name="desNome_${count}" value="${(to.name || '')}">
          <input type="hidden" name="desEmpresa_${count}" value="">
          <input type="hidden" name="desEndereco_${count}" value="${(to.street || '')}">
          <input type="hidden" name="desNumero_${count}" value="${(to.number || '')}">
          <input type="hidden" name="desComplemento_${count}" value="${(to.complement || '')}">
          <input type="hidden" name="desBairro_${count}" value="${(to.borough || '')}">
          <input type="hidden" name="desCidade_${count}" value="${(to.city || '')}">
          <input type="hidden" name="desUf_${count}" value="${(to.province_code || '')}">
          <input type="hidden" name="selDesUf_${count}" value="${(to.province_code || '')}">
          <input type="hidden" name="desTelefone_${count}" value="${(to.phone ? to.phone.number : '')}">
          <input type="hidden" name="desDC_${count}" value="">
          <input type="hidden" name="aut_${count}" checked="">
          <input type="hidden" name="num_${count}" value="">`)
      }
      const { result } = data
      result.forEach((order, i) => {
        const indexChanged = i + 1
        if (order.shipping_lines && order.shipping_lines[0]) {
          const { to, from, app } = order.shipping_lines[0]
          if (to && from) {
            const buyer = order.buyers && order.buyers[0]
            if (buyer) {
              if (!to.phone) {
                const { phones } = buyer
                if (phones && phones.length) {
                  to.phone = phones[0]
                }
              }
              if (!to.name) {
                to.name = ecomUtils.fullName(buyer)
              }
            }
            if (!to.number) {
              to.number = 'S/N'
            }
            if (!from.name) {
              from.name = store.corporate_name || store.name || ''
            }
            if (!from.phone) {
              const number = store.contact_phone
              if (number) {
                from.phone = { number }
              }
            }
            if (!from.street || !from.borough) {
              const localCenderAddress = store.address
              if (localCenderAddress) {
                const addressParts = localCenderAddress.split(',')
                from.street = addressParts[0]
                from.number = (addressParts[1] || 'S/N')
                from.complement = addressParts[5]
                from.borough = addressParts[2]
                from.city = addressParts[3]
                from.province_code = addressParts[4]
              }
            } else if (!from.number) {
              from.number = 'S/N'
            }
            const $containerTags = `
              <div class="tags" style="break-after: page; break-inside: avoid; display: block">
                <div${(i % 9 === 0 ? ` id="line${i}"` : '')} class="row" style="break-inside: avoid;"></div>
              </div>`
            if (i % 9 === 0) {
              $appTab.find('.shipping-tags').append($containerTags)
            }
            let carrierLabel = ''
            if (app) {
              if (app.carrier) {
                carrierLabel = app.carrier
              }
              if (app.label && app.label !== app.carrier) {
                carrierLabel += ` / ${app.label}`
              }
            }
            $shippingTags.push(`
              <div class="col-md-4" style="border: 2px dashed #ccc; break-inside: avoid;">
                <div class="p-2 pt-3" style="break-inside: avoid; display: block">
                  <ul class="list-unstyled  border-bottom">
                    <li><strong>REMETENTE</strong></li>
                    <li class="text-uppercase">${from.name}</li>
                    <li>${(from.phone ? formatPhone(from.phone) : '')}</li>
                    <li>${from.zip.replace(/(\d{5})(\d{3})/, '$1-$2')}</li>
                    <li><address>${ecomUtils.lineAddress(from)}</address></li>
                  </ul>
                  <ul class="list-unstyled mb-0 fs-16">
                    <li><strong>DESTINATÁRIO</strong></li>
                    <li class="text-uppercase">${to.name}</li>
                    <li>${(to.phone ? formatPhone(to.phone) : '')}</li>
                    <li class="pt-1 fs-18"><mark>${to.zip.replace(/(\d{5})(\d{3})/, '$1-$2')}</mark></li>
                    <li class="pt-1 fs-18"><address>${ecomUtils.lineAddress(to)}</address></li>
                    ${(to.near_to ? `<li class="pb-1">Referência: ${to.near_to}</li>` : '')}
                  </ul>
                  <span class="text-muted">
                    <span class="text-monospace fs-16">#${order.number}</span>
                    <span style="display: none" class="total-price">(${(order.amount && order.amount.total)})</span>
                    <span class="fs-14 float-right">${carrierLabel}</span>
                  </span>
                </div>
              </div>`)
            if (indexChanged % 9 === 0) {
              const blockOfTags = $appTab.find(`#line${indexChanged - 9}`)
              blockOfTags.html($shippingTags)
              const paddingBottomNumb = 1480 - blockOfTags.height()
              const paddingBottom = paddingBottomNumb > 0 ? paddingBottomNumb : 0
              blockOfTags[0].style.paddingBottom = `${paddingBottom}px`
              $shippingTags = []
            }

            if (i >= 4) {
              return
            }
            fillCorreiosForm(from, to, i + 1)
          }
        }
      })

      if (data.result.length < 4) {
        let i = data.result.length
        while (i <= 4) {
          fillCorreiosForm({}, {}, i)
          i++
        }
      }
      if (routeParams[0] === 'correios') {
        $correiosEnderecador.submit()
      } else {
        $appTab.find('.print-correios').click(() => $correiosEnderecador.submit())
        $appTab.find('.tags:last-child').after($shippingTags)
        $appTab.find('.spinner-linear').remove()
        $appTab.find('.doc-correios').click(() => {
          let url = 'https://declaracao-correios.netlify.app/?'
          data.result.forEach((order, i) => {
            if (order.shipping_lines && order.shipping_lines[0]) {
              const { to, from } = order.shipping_lines[0]
              if (from && to) {
                const pkg = order.shipping_lines[0].package
                url += `&pedido=${encodeURIComponent(JSON.stringify({
                  remNome: from.name || store.corporate_name,
                  remEndereco: `${from.street}, ${from.number}, ${(from.borough || '')}`,
                  remLinha2: `${(from.complement || '')} - ${(from.near_to || '')}`,
                  remCidade: from.city,
                  remUf: from.province_code,
                  remCep: from.zip,
                  remDoc: store.doc_number,
                  desNome: to.name,
                  desEndereco: `${to.street}, ${to.number}, ${(to.borough || '')}`,
                  desLinha2: `${(to.complement || '')} - ${(to.near_to || '')}`,
                  desCidade: to.city,
                  desUf: to.province_code,
                  desCep: to.zip,
                  desDoc: order.buyers && order.buyers[0] && order.buyers[0].doc_number,
                  itens: order.items.map(item => ({
                    conteudo: `${item.name} (${item.sku})`,
                    quant: item.quantity,
                    valor: ecomUtils.price(item)
                  })),
                  peso: pkg && pkg.weight
                    ? (!pkg.weight.unit || pkg.weight.unit === 'kg')
                      ? pkg.weight.value
                      : pkg.weight.unit === 'g'
                        ? pkg.weight.value / 1000
                        : undefined
                    : undefined
                }))}`
              }
            }
          })
          const win = window.open(url, '_blank')
          win.focus()
        })
      }
    }
  })
}
