import ecomAuth from '@ecomplus/auth'

ecomAuth.fetchAuthentication().then((authentication) => {
  const configTawkto = () => {
    window.Tawk_API.visitor = {
      name: authentication.name || authentication.username,
      email: authentication.email
    }
    const setTawkAttrs = function () {
      const store = window.Store
      const tawkAttrs = {
        'store-id': String(authentication.store_id),
        'store-name': store.name || '',
        username: authentication.username,
        'authentication-id': authentication._id,
        homepage: store.homepage || (store.domain && `https://${store.domain}/`),
        'admin-link': 'https://app.e-com.plus/pages/login' +
          `?store_id=${authentication.store_id}` +
          `&my_id=${authentication._id}` +
          `&expires=${encodeURIComponent(ecomAuth.getSession().expires)}` +
          '&access_token=',
        'access-token': window.sessionStorage.getItem('access_token') ||
          window.localStorage.getItem('access_token')
      }
      window.Tawk_API.setAttributes(tawkAttrs, function (error) {
        if (typeof error !== 'undefined') {
          const err = new Error('tawk.to: ' + error)
          err.attributes = tawkAttrs
          console.error(err)
        }
      })
    }
    window.Tawk_API.onLoad = setTawkAttrs
    window.Tawk_API.onChatStarted = setTawkAttrs
  }

  /* eslint-disable */
  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_LoadStart = new Date();
  (function(){
  var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
  s1.async=true;
  s1.src='https://embed.tawk.to/62bf57feb0d10b6f3e7a608a/1g6tmvev0';
  s1.charset='UTF-8';
  s1.setAttribute('crossorigin','*');
  s0.parentNode.insertBefore(s1,s0);
  })();
  /* eslint-enable */
  configTawkto()
})
