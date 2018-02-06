'use strict'

require('./config')
require('./util.js')

/*
|--------------------------------------------------------------------------
| Application Is Ready
|--------------------------------------------------------------------------
|
| When all the dependencies of the page are loaded and executed,
| the application automatically call this function. You can consider it as
| a replacer for jQuery ready function - "$( document ).ready()".
|
*/

app.ready(function () {
  var resources = {
    'applications': {
      'label': {
        'en_us': 'Apps'
      },
      'icon': 'puzzle-piece'
    },
    'authentications': {
      'label': {
        'en_us': 'Users',
        'pt_br': 'Usuários'
      },
      'icon': 'users'
    }
  }
})
