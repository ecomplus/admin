/*!
 * Copyright 2018 E-Com Club
 */

(function () {
  'use strict'

  // current tab ID
  var tabId = window.tabId
  var elContainer = $('#' + tabId + '-tab-normal')
  var $form = elContainer.children('form')
  // prefix tab ID on content elements IDs
  window.renderContentIds(elContainer)

  // var lang = window.lang
  var i18n = window.i18n

  // abstraction for callApi function
  var callApi = function (endpoint, method, callback, data) {
    // show loading spinner
    $form.addClass('ajax')
    var Callback = function (err, json) {
      // request done
      $form.removeClass('ajax')
      if (!err) {
        callback(json)
      }
    }
    window.callApi(endpoint, method, Callback, data)
  }

  // edit JSON document
  var commit = window.tabCommit[tabId]
  var Data = function () {
    // current data from global variable
    return window.tabData[tabId]
  }

  var slug = window.routeParams[0]
  var resourceId = window.routeParams[1]
  var creating, endpoint
  if (resourceId === 'new') {
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
    $('#' + tabId + '-delete').click(Delete)
    elContainer.find('.delete-resource').click(Delete).fadeIn()

    $('#' + tabId + '-duplicate').click(function () {
      // create new document with same JSON data
      var callback = function (json) {
        // redirect to new document edit page
        window.location = '/#/resources/' + slug + '/' + json._id
      }
      callApi(slug + '.json', 'POST', callback, Data())
    })

    $('#' + tabId + '-new').click(function () {
      // redirect to create document page
      window.location = '/#/resources/' + slug + '/new'
    })

    // direct link and share
    var link = function (link) {
      if (window.shopDomain && Data().slug) {
        var Link = 'https://' + window.shopDomain + '/' + Data().slug
        if (link) {
          // add link prefix
          Link = link + encodeURIComponent(Link)
        }
        newTabLink(Link)
      } else {
        app.toast(i18n({
          'en_us': 'No link to share',
          'pt_br': 'Nenhum link para compartilhar'
        }))
      }
    }

    $('#' + tabId + '-view').click(function () {
      link()
    })
    $('#' + tabId + '-facebook').click(function () {
      link('https://www.facebook.com/sharer.php?u=')
    })
    $('#' + tabId + '-whatsapp').click(function () {
      var platform
      if ($(window).width() < 480) {
        platform = 'api'
      } else {
        platform = 'web'
      }
      link('https://' + platform + '.whatsapp.com/send?text=')
    })

    // show buttons
    $('#' + tabId + '-nav .edit-btn').fadeIn()
  }

  // count AJAX requests
  var todo = 0
  var done = 0
  var Done = function () {
    done++
    if (done >= todo) {
      // ready
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
      $form.find('input[type="text"],select,textarea').change(function () {
        var prop = $(this).attr('name')
        if (prop && prop !== '') {
          var data = Data()
          var val = $(this).val()
          var obj

          if (typeof val === 'string') {
            obj = strToProperty($(this), val)
            if (obj) {
              // continue with valid value
              data[prop] = obj
            } else if (obj === null && data.hasOwnProperty(prop)) {
              // empty, remove property
              delete data[prop]
            } else {
              // invalid value or nothing to change
              return
            }
          } else if (Array.isArray(val)) {
            // select multiple
            var array = []
            for (var i = 0; i < val.length; i++) {
              obj = strToProperty($(this), val[i])
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
                delete data[prop]
              } else {
                // nothing to change
                return
              }
            }
          }

          // global object already changed by reference
          // commit only to perform reactive actions
          commit(data, true)
        }
      })

      if (!creating) {
        // fill form fields with current data
        var data = Data()
        for (var prop in data) {
          var val = data[prop]
          var $el = $('[name="' + prop + '"]')
          if ($el && !$el.is('input:file')) {
            switch (typeof val) {
              case 'string':
                $el.val(val)
                break

              case 'object':
                // handle JSON objects and arrays
                // select fields ?
                if (Array.isArray(val)) {
                  var list = []
                  for (var i = 0; i < val.length; i++) {
                    var item = val[i]
                    if (typeof item !== 'string') {
                      // array of objects
                      list.push(JSON.stringify(item))
                    } else {
                      list.push(item)
                    }
                  }
                  $el.val(list)
                } else if (val !== null) {
                  // JSON object
                  $el.val(JSON.stringify(val))
                }
            }
          }
        }
      }

      // setup inputs plugins
      $form.find('.tagsinput').tagsinput()
      $form.find('select:not(.tagsinput)').selectpicker({
        style: 'btn-light',
        noneSelectedText: '--',
        windowPadding: 70
      })

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
                    var url = picture.url
                    picture = { zoom: picture }
                    if (url.indexOf('digitaloceanspaces.com/@') !== -1) {
                      // from store bucket
                      picture.normal = {
                        url: url.replace(/^((https?:)?\/\/[^/]+\/)(.*)$/, '$1imgs/400px/$3')
                      }
                    } else {
                      picture.normal = picture.zoom
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
                    window.Sortable.create($list[0], {
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
                  // 24 chars hexadecimal
                  var idPad = '110000000000000000000000'

                  for (i = 0; i < pictures.length; i++) {
                    var item
                    if (thumbnails) {
                      item = pictures[i]
                    } else {
                      // no thumbnails
                      // use image with original (zoom) size
                      item = pictures[i].zoom
                    }
                    var index = '' + i
                    item._id = idPad.substring(0, idPad.length - index.length) + index
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
                  url = pictures[i].normal.url
                } else {
                  url = pictures[i].zoom.url
                }

                if (!isSummernote) {
                  // push content before image loading
                  content.push($('<span />', {
                    html: '<img src="' + url + '"><i class="fa fa-cog"></i>',
                    click: editImage(prop)
                  }))
                }
                var add = function () {
                  if (!isSummernote) {
                    Done()
                  } else {
                    // add image to summernote editor
                    // https://summernote.org/deep-dive/#insertion-api
                    $editor.summernote('insertImage', url, function ($image) {
                      $image.css('max-width', '100%')
                    })
                  }
                }

                var img = new Image()
                img.onload = function () {
                  add()
                  clearTimeout(fallback)
                }
                // fallback if image not loading
                var fallback = setTimeout(add, 5000)
                img.src = url
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
          'class': 'select-image scrollable ajax-content',
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

      // setup save action
      window.setSaveAction($form, function (cb) {
        var method
        var data = Data()
        if (!creating) {
          // overwrite
          method = 'PUT'
        } else {
          method = 'POST'

          // try to auto fill important fields when undefined
          if (data.name && !data.slug && $form.find('[name="slug"]').length) {
            // generate slug from name
            data.slug = data.name.toLowerCase()
              // replace accents
              .replace(/[ÇĆçć]/, 'c')
              .replace(/[ÁÂÃÀáâãà]/, 'a')
              .replace(/[ÉÊẼéêẽ]/, 'e')
              .replace(/[ÍÎĨíîĩ]/, 'i')
              .replace(/[ÓÔÕóôõ]/, 'o')
              .replace(/[ÚÛŨúûõ]/, 'u')
              // replace spaces and new lines
              .replace(/[\s\n]/g, '-')
              // remove illegal characters
              .replace(/[^a-z0-9-_./]/g, '')
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
          if (creating && json._id) {
            // document created
            // redirect to resource edit page
            window.location = '/#/resources/' + slug + '/' + json._id
          }
        }
        callApi(endpoint, method, callback, data)
      })

      // show form
      fixScrollbars($form)
      $form.removeClass('ajax ajax-cards')
    }
  }

  // fill select options (autocomplete)
  var $select = $form.find('select')
  if (!$select.length) {
    Done()
  } else {
    $select.each(function (index) {
      // resource name
      var fill = $(this).data('fill')
      if (fill) {
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
      }
    })
  }
}())
