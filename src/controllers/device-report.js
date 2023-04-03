import { i19name, i19day, i19email, i19phone, i19month } from '@ecomplus/i18n'
import { $ecomConfig, i18n, phone } from '@ecomplus/utils'
import Papa from 'papaparse'
import Chart from 'chart.js'

export default function () {
  const { $, callApi, tabId } = window
  const dictionary = {
    january: i18n({
      en_us: 'January',
      pt_br: 'Janeiro'
    }),
    february: i18n({
      en_us: 'February',
      pt_br: 'Fevereiro'
    }),
    march: i18n({
      en_us: 'March',
      pt_br: 'Março'
    }),
    april: i18n({
      en_us: 'April',
      pt_br: 'Abril'
    }),
    may: i18n({
      en_us: 'May',
      pt_br: 'Maio'
    }),
    june: i18n({
      en_us: 'June',
      pt_br: 'Junho'
    }),
    august: i18n({
      en_us: 'August',
      pt_br: 'Agosto'
    }),
    july: i18n({
      en_us: 'July',
      pt_br: 'Julho'
    }),
    september: i18n({
      en_us: 'September',
      pt_br: 'Setembro'
    }),
    october: i18n({
      en_us: 'October',
      pt_br: 'Outubro'
    }),
    november: i18n({
      en_us: 'November',
      pt_br: 'Novembro'
    }),
    december: i18n({
      en_us: 'December',
      pt_br: 'Dezembro'
    })
  }

  callApi(
    '$aggregate.json',
    'POST',
    (err, json) => {
      if (!err) {
        if (Array.isArray(json.result)) {
          console.log(json.result)
          const { result } = json
          
        }
      }
    },
    {
      resource: 'orders',
      pipeline: [
        { 
          $group: { 
            _id: '$client_user_agent',
            count: {
              $sum: 1
            },
            total: {
              $sum: '$amount.total'
            }
          } 
        },
        { $sort: { _id: 1 } }
      ]
    }
  )
}
