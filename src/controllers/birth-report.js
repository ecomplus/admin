import { i19name, i19day, i19email, i19phone, i19month } from '@ecomplus/i18n'
import { $ecomConfig, i18n, phone } from '@ecomplus/utils'
import Papa from 'papaparse'
import Chart from 'chart.js'

export default function () {
  const { $, callApi, tabId, moment } = window
  const $spinner = $('#spinner-wait-api')
  const datatableOptions = {
    pageLength: 10
  }
  if ($ecomConfig.get('lang') === 'pt_br') {
    datatableOptions.language = {
      aria: {
        sortAscending: ': ative para colocar a coluna em ordem crescente',
        sortDescending: ': ative para colocar a coluna em ordem decrescente'
      },
      paginate: {
        next: 'Próxima',
        previous: 'Anterior'
      },
      emptyTable: 'Tabela vazia',
      info: 'Mostrando _START_ a _END_ de _TOTAL_ Aniversariantes carregados',
      infoEmpty: '',
      infoFiltered: '',
      lengthMenu: 'Mostrar _MENU_ resultados',
      search: 'Buscar',
      zeroRecords: 'Nenhum resultado encontrado'
    }
  }
  const datatable = $('#birth-table').DataTable(datatableOptions)
  const renderListBirthReports = month => {
    callApi(
      '$aggregate.json',
      'POST',
      (err, json) => {
        if (!err) {
          $spinner.hide()
          if (json && Array.isArray(json.result) && Array.isArray(json.result[0].birthdays)) {
            const { birthdays } = json.result[0]
            const size = birthdays.length
            if (datatableOptions.pageLength > 20) {
              datatableOptions.pageLength = size
            }
            const rows = []
            birthdays.forEach(client => {
              const phoneNumber = phone(client)
              rows.push([
                client.name,
                client.day,
                client.email,
                phoneNumber
              ])
            })
            datatable.clear()
            datatable.rows.add(rows)
            datatable.draw()
          }
        }
      },
      {
        resource: 'customers',
        pipeline: [
          {
            $match: {
              'birth_date.month': month
            }
          },
          {
            $group: {
              _id: '$birth_date.month',
              total: {
                $sum: 1
              },
              birthdays: {
                $addToSet: {
                  id: '$_id',
                  name: {
                    $concat: [
                      '$name.given_name',
                      ' ',
                      '$name.family_name'
                    ]
                  },
                  day: '$birth_date.day',
                  email: '$main_email',
                  phones: '$phones'
                }
              }
            }
          }
        ]
      }
    )
  }

  const currentMonth = (new Date().getMonth()) + 1
  renderListBirthReports(currentMonth)

  callApi(
    '$aggregate.json',
    'POST',
    (err, json) => {
      if (!err) {
        const totalByMonth = []
        if (Array.isArray(json.result)) {
          const { result } = json
          result.forEach(month => {
            totalByMonth.push(month.total)
          })
          const labelMonths = moment.months()
          const chart = new Chart($('#birth-year'), {
            type: 'bar',
            data: {
              labels: labelMonths,
              datasets: [
                {
                  label: i18n(i19month),
                  fill: false,
                  borderWidth: 3,
                  pointRadius: 0,
                  data: totalByMonth
                }
              ]
            },
            options: {
              legend: {
                display: false
              },
              responsive: true,
              onClick: e => {
                const firstPoint = chart.getElementAtEvent(e)[0]
                if (firstPoint) {
                  const selectedMonth = firstPoint._index + 1
                  $spinner.show()
                  renderListBirthReports(selectedMonth)
                }
              }
            }
          })
        }
      }
    },
    {
      resource: 'customers',
      pipeline: [
        { $match: { 'birth_date.month': { $exists: true } } },
        { $group: { _id: '$birth_date.month', total: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]
    }
  )

  const $exportBirth = $('#export-birth')
  const downloadCsv = exportData => {
    const columns = [i18n(i19name), i18n(i19day), i18n(i19email), i18n(i19phone)]
    const csv = Papa.unparse({
      data: exportData,
      fields: columns
    })
    const csvData = new window.Blob([csv], {
      type: 'text/csv;charset=utf-8;'
    })
    const csvURL = navigator.msSaveBlob
      ? navigator.msSaveBlob(csvData, 'download.csv')
      : window.URL.createObjectURL(csvData)
    const $link = document.createElement('a')
    $link.href = csvURL
    $link.setAttribute('download', 'export-birth.csv')
    $link.click()
    $(`#t${tabId}-loading`).hide()
  }
  $exportBirth.click(() => {
    downloadCsv(datatable.rows().data())
  })
}
