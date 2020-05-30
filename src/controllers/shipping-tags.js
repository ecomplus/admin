export default function () {
  const { localStorage, $, ecomUtils, callApi, formatPhone, tabId, routeParams } = window

  const $appTab = $(`#app-tab-${tabId}`)
  const orderIds = routeParams[routeParams.length - 1]

  callApi(`orders.json?_id=${orderIds}&fields=buyers.phones,shipping_lines,number`, 'GET', (error, data) => {
    if (!error) {
      const $shippingTags = []

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

      data.result.forEach((order, i) => {
        if (order.shipping_lines && order.shipping_lines[0]) {
          const { to, from, app } = order.shipping_lines[0]
          if (to && from) {
            if (!to.phone && order.buyers && order.buyers[0]) {
              const { phones } = order.buyers[0]
              if (phones.length) {
                to.phone = phones[0]
              }
            }
            if (!from.name) {
              from.name = localStorage.getItem('fromCorporate') || localStorage.getItem('fromName') || ''
            }
            if (!from.phone) {
              const number = localStorage.getItem('fromContact')
              if (number) {
                from.phone = { number }
              }
            }
            if (!from.street) {
              const localCenderAddress = localStorage.getItem('fromAddress')
              if (localCenderAddress) {
                const addressParts = localCenderAddress.split(',')
                from.street = addressParts[0]
                from.number = addressParts[1]
                from.complement = addressParts[5]
                from.borough = addressParts[2]
                from.city = addressParts[3]
                from.province_code = addressParts[4]
              }
            }

            $shippingTags.push(`
              <div class="col-xs-4 col-md-4" style="border: 2px dashed #ccc;">
                <div class="p-2 pt-3">
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
                  </ul>
                  <span class="text-muted">
                    <span class="text-monospace fs-16">#${order.number}</span>
                    <span class="fs-14 float-right">${((app && app.carrier) || '')}</span>
                  </span>
                </div>
              </div>`)

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
        $appTab.find('.shipping-tags').html($shippingTags)
        $appTab.find('.print-correios').click(() => $correiosEnderecador.submit())
      }
    }
  })
}
