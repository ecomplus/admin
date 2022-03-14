import Sortable from 'sortablejs'

export default function () {
  const { $, app, ecomUtils, i18n, newTabLink } = window

  // current tab ID
  const tabId = window.tabId
  const Tab = window.Tabs[tabId]
  const elContainer = $('#t' + tabId + '-tab-normal')
  const $form = elContainer.children('form')
  // prefix tab ID on content elements IDs
  window.renderContentIds(elContainer)

  // abstraction for callApi function
  const callApi = function (endpoint, method, callback, data) {
    // show loading spinner
    $form.addClass('ajax')
    const Callback = function (err, json) {
      // request done
      $form.removeClass('ajax')
      if (!err) {
        callback(json)
      }
    }
    window.callApi(endpoint, method, Callback, data)
  }

  // edit JSON document
  var commit = Tab.commit
  var Data = function () {
    // current data from global variable
    return Tab.data
  }

  var slug = Tab.slug
  var resourceId = Tab.resourceId
  var creating, endpoint
  // check if resource has slug property
  var hasSlug = !!$form.find('[name="slug"]').length
  if (!resourceId) {
    creating = true
    endpoint = slug + '.json'
  } else {
    // console.log('editing')
    endpoint = slug + '/' + resourceId + '.json'

    /*  setup edit document buttons */

    var Delete = function () {
      callApi(endpoint, 'DELETE', function (json) {
        // document deleted
        // redirect to resource list
        window.location = '/#/resources/' + slug
      })
    }
    $('#t' + tabId + '-delete').click(Delete)
    elContainer.find('.delete-resource').click(Delete).fadeIn()

    $(`#t${tabId}-duplicate`).click(function () {
      // create new document with same JSON data
      var callback = function (json) {
        // redirect to new document edit page
        window.location = '/#/resources/' + slug + '/' + json._id
      }
      const data = Object.assign({}, Data())
      const rand = () => Math.floor(Math.random() * (1000 - 100)) + 100
      if (data.sku) {
        const suffixSku = () => '-C' + rand()
        data.sku = (data.sku + suffixSku()).slice(0, 100)
        if (data.variations) {
          data.variations.forEach(variation => {
            variation.sku = (variation.sku + suffixSku()).slice(0, 100)
            variation._id = randomObjectId()
          })
        }
      }
      if (data.slug) {
        data.slug = (data.slug + `-c${rand()}`).slice(0, 255)
      }
      ;[
        'views',
        'sales',
        'total_sold',
        'inventory_records',
        'price_change_records',
        'orders'
      ].forEach(field => {
        if (data[field] !== undefined) {
          delete data[field]
        }
      })
      callApi(slug + '.json', 'POST', callback, data)
    })

    $('#t' + tabId + '-new').click(function () {
      // redirect to create document page
      window.location = '/#/resources/' + slug + '/new'
    })

    const domain = window.shopDomain || (window.Store && window.Store.domain)
    let checkoutLink
    if (domain && resourceId) {
      checkoutLink = slug === 'products'
        ? `https://${domain}/app/#/lp/${resourceId}`
        : slug === 'carts'
          ? `https://${domain}/app/#/checkout/${resourceId}`
          : null
    }

    if (hasSlug || checkoutLink) {
      // direct link and share
      const link = function (link) {
        let Link
        if (domain) {
          if (Data().slug) {
            Link = 'https://' + domain + '/' + Data().slug
          } else {
            Link = (Data().permalink || checkoutLink)
          }
          if (Link) {
            if (link) {
              // add link prefix
              Link = link + encodeURIComponent(Link)
            }
            newTabLink(Link)
            return Link
          }
        }
        app.toast(i18n({
          en_us: 'No link to share',
          pt_br: 'Nenhum link para compartilhar'
        }))
      }

      const $view = $('#t' + tabId + '-view')
      $view.click(function () {
        link()
      })
      if (checkoutLink) {
        setTimeout(() => {
          const $checkout = $('<a>', {
            href: 'javascript:;',
            class: 'nav-link edit-btn',
            html: '<i class="ti-credit-card"></i>',
            click () {
              newTabLink(checkoutLink)
            }
          })
          $view.after($checkout)
          $checkout.fadeIn()
        }, 800)
      }

      $('#t' + tabId + '-facebook').click(function () {
        link('https://www.facebook.com/sharer.php?u=')
      })
      $('#t' + tabId + '-whatsapp').click(function () {
        let platform
        if ($(window).width() < 480) {
          platform = 'api'
        } else {
          platform = 'web'
        }
        link('https://' + platform + '.whatsapp.com/send?text=')
      })
    } else {
      // document doest not have link
      $('#t' + tabId + '-view, #t' + tabId + '-facebook, #t' + tabId + '-whatsapp').remove()
    }

    // show buttons
    $('#t' + tabId + '-nav .edit-btn:not([data-list])').fadeIn()
  }

  // count AJAX requests
  var todo = 0
  var done = 0
  var Done = function () {
    done++
    if (done >= todo) {
      // start seting up inputs with Data
      var ready
      // treat input values to data properties
      var strToProperty = function ($el, str) {
        str = str.trim()
        if (str !== '') {
          if ($el.data('json')) {
            // value is a JSON string
            var obj
            try {
              obj = JSON.parse(str)
            } catch (e) {
              // ignore invalid JSON
              obj = false
            }
            return obj
          }
        } else {
          return null
        }
        return str
      }

      // setup input events
      var inputToData = function ($input, checkbox) {
        if (!ready) {
          return
        }
        var prop = $input.attr('name')
        if (prop && prop !== '') {
          var data = Data()
          var i

          // object dot notation
          var parts = prop.split('.')
          if (parts.length) {
            var objectId = $input.data('object-id')
            var isArray
            i = 0
            while (true) {
              if (parts[i] !== '') {
                if (i > 0) {
                  data = data[prop]
                }
                if (!isArray) {
                  if (/\[\]$/.test(parts[i])) {
                    // next property is an array
                    isArray = true
                    // remove [] chars from property name
                    parts[i] = parts[i].slice(0, -2)
                  }
                  prop = parts[i]
                } else {
                  // array element
                  prop = parseInt(parts[i], 10)
                  isArray = false
                }
              }
              if (i === parts.length - 1) {
                break
              }

              if (!data.hasOwnProperty(prop)) {
                // declare object
                if (objectId) {
                  // array of nested objects
                  data[prop] = [{ _id: objectId }]
                } else if (!isArray) {
                  data[prop] = {}
                } else {
                  data[prop] = []
                }
              }

              if (objectId) {
                // array of nested objects
                // pass correct object by checking ID
                for (var j = 0; j < data[prop].length; j++) {
                  if (data[prop][j]._id === objectId) {
                    // add element index on property parts array
                    parts.splice(i + 1, 0, j)
                    // object ID for first level only
                    objectId = null
                    break
                  }
                }
                if (objectId) {
                  // not found
                  data[prop].push({ _id: objectId })
                  parts.splice(i + 1, 0, data[prop].length - 1)
                  objectId = null
                }
              }
              i++
            }
          }

          var remove = function () {
            // remove property
            if (!Array.isArray(data)) {
              if (parts.length === 1) {
                if (typeof data[parts] !== 'string') {
                  delete data[parts]
                } else {
                  data[prop] = ''
                }
              }
            } else {
              data.splice(prop, 1)
            }

            if (parts.length) {
              // remove empty parents
              data = Data()
              for (var i = 0; i < parts.length - 1; i++) {
                var part = parts[i]
                if (!Object.keys(data[part]).length) {
                  delete data[part]
                } else {
                  data = data[part]
                }
              }
              if (data && data[parts[i]]) {
                // remove last level property
                if (Array.isArray(data)) {
                  data.splice(parts[i], 1)
                } else {
                  delete data[parts[i]]
                }
              }
            }
          }

          if (!checkbox) {
            // prefer value from data or get default input value property
            var val = $input.data('value') || $input.val()
            if ($input.hasClass('colorpicker')) {
              // test RGB string value
              if (!/^#[a-f0-9]{6}$/.test(val) && val !== '') {
                // force delayed change event to recheck value after minicolors handler
                setTimeout(function () {
                  $input.trigger('change')
                }, 200)
                return
              }
            }

            var obj
            if (typeof val === 'string') {
              if ($input.data('is-number')) {
                obj = stringToNumber(val)
              } else if ($input.data('is-digits')) {
                obj = val.replace(/\D/g, '')
              } else if ($input.attr('type') === 'number') {
                obj = parseFloat(val)
              } else {
                obj = strToProperty($input, val)
              }

              if (obj || obj === 0) {
                // continue with valid value
                if (!$input.data('object-assign')) {
                  if (Array.isArray(data)) {
                    // fill array to prevent null elements
                    while (data.length < prop) {
                      data.push(obj)
                    }
                  }
                  data[prop] = obj
                } else {
                  Object.assign(data[prop], obj)
                }
              } else if (obj === null || isNaN(obj)) {
                // empty, remove property
                remove()
              } else {
                // invalid value or nothing to change
                return
              }
            } else if (Array.isArray(val)) {
              // select multiple
              var array = []
              for (i = 0; i < val.length; i++) {
                obj = strToProperty($input, val[i])
                if (obj) {
                  // add valid value to array
                  array.push(obj)
                }
              }
              if (array.length) {
                data[prop] = array
              } else {
                // empty array
                if (data.hasOwnProperty(prop)) {
                  remove()
                } else {
                  // nothing to change
                  return
                }
              }
            }
          } else {
            // checkbox
            data[prop] = $input.is(':checked')
          }

          // global object already changed by reference
          // commit only to perform reactive actions
          commit(Data(), true)
        }
      }
      // use function on specific resources forms scripts
      Tab.inputToData = inputToData
      handleInputs($form, inputToData)

      var formSetup = function () {
        if (!creating) {
          // fill form fields with current data
          setupInputValues($form, Data())
        } else {
          // preset for checkbox fields with default values
          setTimeout(function () {
            $form.find('[type="checkbox"]:not([data-skip])').trigger('change')
          }, 100)
        }

        // setup inputs plugins
        $form.find('.tagsinput').tagsinput()
        $form.find('select:not(.tagsinput)').appSelectpicker()

        var $editor = $form.find('.html-editor')
        if ($editor.length) {
          var editorChanged = false
          $editor.summernote({
            // https://summernote.org/deep-dive/
            toolbar: [
              [ 'style', [ 'style' ] ],
              [ 'font', [ 'bold', 'italic', 'underline', 'strikethrough', 'clear' ] ],
              [ 'color', [ 'color' ] ],
              [ 'insert', [ 'picture', 'link', 'video', 'hr', 'table' ] ],
              [ 'paragraph', [ 'ul', 'ol', 'paragraph' ] ],
              [ 'misc', [ 'codeview', 'help' ] ]
            ],
            height: 300,
            dialogsFade: true,

            callbacks: {
              onChange: function (content) {
                editorChanged = true
                var html = content.trim()
                // fix for problem with ENTER and new paragraphs
                if (html.substring(0, 5) !== '<div>') {
                  $editor.summernote('code', '<div><br></div>' + html)
                }
              },
              onBlur: function () {
                if (editorChanged) {
                  // update textarea
                  $editor.trigger('change')
                  editorChanged = false
                }
              }
            }
          })
        }

        // edit common image properties
        var editImage = function (prop) {
          return function (event) {
            // should not open uploads modal
            event.stopPropagation()
            var $span = $(this)
            var data = Data()
            var picture = data[prop]
            if (Array.isArray(picture)) {
              // multiple images, array
              picture = picture[$span.index()]
            }

            // open edit image modal and wait for 'save' action
            var callback = function (err, json) {
              if (!err) {
                if (json === false) {
                  // remove image
                  if (Array.isArray(data[prop])) {
                    // multiple images
                    // remove respective array element only
                    data[prop].splice($span.index(), 1)
                  } else {
                    delete data[prop]
                  }

                  // remove HTML element
                  $span.toggle('slide', function () {
                    $(this).remove()
                  })
                } else if (typeof picture === 'object') {
                  for (var imgProp in json) {
                    var value = json[imgProp]
                    if (value) {
                      if (picture.hasOwnProperty('zoom')) {
                        // with thumbnails
                        if (imgProp !== 'size') {
                          // assing value to all thumbnails
                          for (var thumb in picture) {
                            if (picture.hasOwnProperty(thumb)) {
                              picture[thumb][imgProp] = value
                            }
                          }
                        } else {
                          // vary by thumbnail
                          // assing only to original image size
                          picture.zoom[imgProp] = value
                        }
                      } else {
                        picture[imgProp] = value
                      }
                    }
                  }
                }

                // commit only to perform reactive actions
                commit(data, true)
              }
            }
            window.editImage(callback, (picture.zoom || picture))
          }
        }

        $form.find('input[type="file"]').each(function () {
          // console.log($(this))
          // handle images selection
          // use global dropzone and library
          var text, multiple, thumbnails, max, prop, i
          multiple = $(this).attr('multiple')
          if (multiple) {
            max = $(this).data('max')
            if (!max) {
              // default maximum number of images
              max = 50
            }
            text = i18n({
              'en_us': 'Select images',
              'pt_br': 'Selecionar imagens'
            })
          } else {
            max = 1
            text = i18n({
              'en_us': 'Select image',
              'pt_br': 'Selecionar imagem'
            })
          }
          prop = $(this).attr('name')
          thumbnails = $(this).data('thumbnails')

          // callback after images selection
          var imagesCallback = function (err, pictures, skipCommit) {
            if (!err) {
              var data = Data()
              if (data.hasOwnProperty(prop)) {
                // keep current pictures
                var add = function (picture) {
                  if (picture) {
                    if (!thumbnails) {
                      // no thumbnails
                      // only original (zoom) size is saved
                      picture = {
                        normal: picture,
                        zoom: picture
                      }
                    }
                    pictures.push(picture)
                  }
                }

                if (multiple) {
                  for (i = 0; i < data[prop].length; i++) {
                    var picture = data[prop][i]
                    add(picture)
                  }
                } else if (!pictures.length) {
                  add(data[prop])
                }
                // console.log(pictures)
              }

              // check number of images
              if (!pictures.length) {
                // no images
                return
              }
              if (pictures.length > max) {
                if (multiple) {
                  if (thumbnails) {
                    // remove excess elements
                    pictures.splice(max, pictures.length - max)
                  }
                  app.toast(i18n({
                    'en_us': 'A maximum of ' + max + ' images will be selected',
                    'pt_br': 'No máximo ' + max + ' imagens serão selecionadas'
                  }))
                } else {
                  app.toast(i18n({
                    'en_us': 'Only one image will be selected',
                    'pt_br': 'Apenas uma imagem será selecionada'
                  }))
                }
              }

              if (!isSummernote) {
                // show spinner while loading images
                $el.addClass('ajax')
                // reset images list
                var $list = $el.children('.images-list')
                $list.html('')
                var todo = 0
                var done = 0
                // concat HTML content with images
                var content = []
                var Done = function () {
                  done++
                  if (done === todo) {
                    $list.prepend(content)
                    $el.removeClass('ajax')

                    if (done > 1) {
                      // handle images sorting
                      // https://github.com/RubaXa/Sortable
                      Sortable.create($list[0], {
                        onUpdate: function (e) {
                          // console.log(e.detail)
                          // move array elements on data
                          var data = Data()
                          var x = data[prop].splice(e.oldIndex, 1)[0]
                          if (x) {
                            data[prop].splice(e.newIndex, 0, x)
                            // commit only to perform reactive actions
                            commit(data, true)
                          }
                        }
                      })
                    }
                  }
                }

                if (!skipCommit) {
                  if (multiple) {
                    data[prop] = []
                    // generate IDs for each image
                    var idPad = randomObjectId()

                    for (i = 0; i < pictures.length; i++) {
                      var item
                      if (thumbnails) {
                        item = pictures[i]
                      } else {
                        // no thumbnails
                        // use image with original (zoom) size
                        item = pictures[i].zoom
                      }
                      // keep existing ID if any
                      if (!item._id) {
                        item._id = objectIdPad(idPad, '' + i)
                      }
                      data[prop].push(item)
                    }
                  } else if (thumbnails) {
                    data[prop] = pictures[0]
                  } else {
                    data[prop] = pictures[0].zoom
                  }

                  // commit only to perform reactive actions
                  commit(data, true)
                }
              }

              for (i = 0; i < pictures.length && i < max; i++) {
                // load image, then show inside select image block
                // async process
                (function () {
                  var url
                  if (!isSummernote) {
                    todo++
                    // show thumbnail only
                    url = ecomUtils.img(pictures[i]).url
                  } else {
                    url = ecomUtils.img(pictures[i], null, 'zoom').url
                  }

                  if (!isSummernote) {
                    // push content before image loading
                    content.push($('<span />', {
                      html: '<img src="' + url + '"><i class="fa fa-cog"></i>',
                      click: editImage(prop)
                    }))
                  }

                  if (!isSummernote) {
                    var img = new Image()
                    img.onload = function () {
                      Done()
                      clearTimeout(fallback)
                    }
                    // fallback if image not loading
                    var fallback = setTimeout(Done, 5000)
                    img.src = url
                  } else {
                    // add image to summernote editor
                    // https://summernote.org/deep-dive/#insertion-api
                    $editor.summernote('insertImage', '/assets/img/util/loading.gif', function ($image) {
                      // change spinner gif to correct image after loading
                      var img = new Image()
                      img.onload = function () {
                        $image.attr('src', url)
                        // force data change
                        $editor.summernote('insertText', ' ')
                      }
                      img.src = url
                      // CSS defaults
                      $image.css('max-width', '100%')
                    })
                  }
                }())
              }
            }
          }

          // check if input is from summernote image upload dialog
          var isSummernote = $(this).hasClass('note-image-input')
          var selectImage = function () {
            var delay
            if (isSummernote) {
              // hide summernote modal
              $form.find('.note-editor .modal.show').modal('hide')
              delay = 400
            } else {
              delay = 100
            }
            window.setImagesCallback(imagesCallback)
            // delay to open uploads modal
            setTimeout(function () {
              window.upload()
            }, delay)
          }

          var $el = $('<div/>', {
            'class': 'select-image scrollable scrollable-x ajax-content',
            html: '<div class="ajax-overlay"><div class="spinner-circle-material"></div></div>' +
                  '<div class="images-list"></div>' +
                  '<p><i class="fa fa-picture-o"></i>&nbsp; ' + text + '</p>',
            click: selectImage
          })
          $(this).replaceWith($el)

          if (!creating) {
            // setup images list with current data
            // true to skipCommit, no data changes
            imagesCallback(null, [], true)
          }
        })

        // timeout to wait input changes events
        setTimeout(function () {
          // setup save action
          window.setSaveAction($form, function (cb) {
            // timeout to wait input changes events
            setTimeout(function () {
              var method
              var data = Data()
              if (!creating) {
                // overwrite
                if (slug === 'orders') {
                  method = 'PATCH'
                } else {
                  method = 'PUT'
                }
              } else {
                method = 'POST'

                // try to auto fill important fields when undefined
                if (hasSlug && (!data.slug || !data.slug.trim().length)) {
                  // generate slug from name
                  // prepare string and remove illegal characters
                  data.slug = data.name
                    ? clearAccents(data.name.toLowerCase(), '-').replace(/[^a-z0-9-_./]/g, '')
                    : String(parseInt(Math.random() * 1000000))
                }
                /*
                  Do not copy name and short description (prevent outdating)
                  Shoud be checked on store template
                if (!data.meta_title) {
                  // copy name to title tag
                  data.meta_title = cutString(data.name, 70)
                }
                if (!data.meta_description) {
                  if (data.short_description && $form.find('[name="meta_description"]').length) {
                    // copy short description to meta
                    data.meta_description = data.short_description
                  }
                } else if (!data.short_description) {
                  // copy meta to short description
                  data.short_description = cutString(data.meta_description, 255)
                }
                */
              }

              var callback = function (json) {
                if (typeof cb === 'function') {
                  // save action callback
                  cb(tabId)
                }
                if (typeof Tab.saveCallback === 'function') {
                  // additional route especific callback
                  Tab.saveCallback(json)
                }
                if (creating && json._id) {
                  // document created
                  // redirect to resource edit page
                  window.location = '/#/resources/' + slug + '/' + json._id
                }
              }

              callApi(endpoint, method, callback, data)
            }, 200)
          })

          // save buttons
          elContainer.find('.save-resource').click(function (e) {
            $form.submit()
            e.preventDefault()
          })
        }, 200)

        // inputs ready
        ready = true
        // show form
        fixScrollbars($form)
        $form.removeClass('ajax ajax-cards')
      }

      // form element ready
      Tab.$form = $form
      // trigger custom event
      $(document).trigger('form-' + tabId)
      // wait for async handling
      if (!Tab.wait) {
        setTimeout(formSetup, 200)
      } else {
        Tab.formSetup = function () {
          setTimeout(formSetup, 100)
        }
        if (typeof Tab.continue === 'function') {
          Tab.continue()
        }
      }
    }
  }

  // fill select options (autocomplete)
  var $select = $form.find('select').filter(function () { return $(this).data('fill') })
  if (!$select.length) {
    Done()
  } else {
    $select.each(function () {
      // resource name
      var fill = $(this).data('fill')
      todo++
      // array of destination elements
      var $els = [ $(this) ]
      // add select elements with the same options (same resource)
      $form.find('select[data-fill-same="' + $(this).attr('name') + '"]').each(function () {
        $els.push($(this))
      })

      // default sort by name asc
      var uri = fill + '.json?sort=' + ($(this).data('sort') || 'name')
      var fields = $(this).data('properties')
      var subtextProp
      var object
      if (fields) {
        // object property
        object = true
        uri += '&fields=' + fields
        subtextProp = $(this).data('subtext-property')
        if (subtextProp) {
          // add property to fields on URL
          uri += ',' + subtextProp
        }
      }

      window.callApi(uri, 'GET', function (err, json) {
        if (!err) {
          // response should be a resource list
          var list = json.result
          if (list) {
            for (var i = 0; i < list.length; i++) {
              var doc = list[i]
              // escape itself
              if (doc._id !== resourceId) {
                // fill select element with new option
                var value
                if (object) {
                  // JSON string as value
                  var obj
                  if (fields) {
                    // object with wanted fields only
                    obj = getProperties(doc, fields)
                  } else {
                    obj = doc
                  }
                  value = JSON.stringify(obj)
                } else {
                  // string property
                  // use document ID as option value
                  value = doc._id
                }

                // setup option
                var option = {
                  value: value,
                  text: cutString(doc.name, 42, '...')
                }
                if (subtextProp) {
                  var subtext = getFromDotNotation(doc, subtextProp)
                  if (subtext) {
                    option['data-subtext'] = cutString(subtext, 45, '...')
                  }
                }
                // add element on selects
                for (var j = 0; j < $els.length; j++) {
                  $('<option />', option).appendTo($els[j])
                }
              }
            }
          }
        }
        Done()
      })
    })
  }
}
