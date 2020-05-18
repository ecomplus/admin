

// =====================
// Quickview
// =====================
//
+function($, window){

  var quickview = {};

  quickview.init = function() {


    $('.quickview-body').perfectScrollbar();

    // Update scrollbar on tab change
    //
    $(document).on('shown.bs.tab', '.quickview-header a[data-toggle="tab"]', function (e) {
      $(this).closest('.quickview').find('.quickview-body').perfectScrollbar('update');
    })



    // Quickview closer
    //
    $(document).on('click', '[data-dismiss="quickview"]', function(){
      quickview.close( $(this).closest('.quickview') );
    });



    // Handle quickview openner
    //
    $(document).on('click', '[data-toggle="quickview"]', function(e) {
      e.preventDefault();

      if ( $(this).closest('.quickview').length && $(this).hasDataAttr('url') ) {
        return;
      }

      var target = app.getTarget($(this));

      if (target == false) {
        quickview.close( $(this).closest('.quickview') )
      }
      else {
        var url = '';
        if ( $(this).hasDataAttr('url') ) {
          url = $(this).data('url');
        }
        quickview.toggle(target, url);
      }
    });



    // Open quickview
    //
    $(document).on('click', '[data-open="quickview"]', function(e) {
      e.preventDefault();

      
      if ( $(this).closest('.quickview').length && $(this).hasDataAttr('url') ) {
        return;
      }


      var target = app.getTarget($(this));

      if (target == false) {
        
      }
      else {
        var url = '';
        if ( $(this).hasDataAttr('url') ) {
          url = $(this).data('url');
        }

        if ( url !== '' ) {
          $(target).html('<div class="spinner-linear"><div class="line"></div></div>');
          $(target).attr('data-original-url', url);
          $(target).load(url, function() {
            $('.quickview-body').perfectScrollbar();

            // Callback
            var fn = window[ $(target).attr('data-on-load') ];
            if ( typeof fn === 'function' ) {
              fn($(target));
            }
          });
        }
        quickview.open(target);
        //quickview.toggle(target, url);
      }
    });


    // Close quickview when backdrop touches
    //
    $(document).on('click', '.backdrop-quickview', function(){
      var qv = $(this).attr('data-target');
      if ( ! $(qv).is('[data-disable-backdrop-click]') ) {
        quickview.close(qv);
      }
    });

    $(document).on('click', '.quickview .close, [data-dismiss="quickview"]', function(){
      var qv = $(this).closest('.quickview');
      quickview.close(qv);
    });

  };



  // Toggle open/close state
  //
  quickview.toggle = function(e, url) {
    if ( $(e).hasClass('reveal') ) {
      quickview.close(e);
    }
    else {
      if ( url !== '' ) {
        $(e).html('<div class="spinner-linear"><div class="line"></div></div>');
        $(e).attr('data-original-url', url);
        $(e).load(url, function() {
          $('.quickview-body').perfectScrollbar();

          // Callback
          var fn = window[ $(e).attr('data-on-load') ];
          if ( typeof fn === 'function' ) {
            fn($(e));
          }
        });
      }
      quickview.open(e);
    }
  }



  // Open quickview
  //
  quickview.open = function(e) {
    var quickview = $(e);

    // Load content from URL if required
    if ( quickview.hasDataAttr('url') && 'true' !== quickview.data('url-has-loaded') ) {
      quickview.load( quickview.data('url'), function() {
        $('.quickview-body').perfectScrollbar();
        // Don't load it next time, if don't need to
        if ( quickview.hasDataAttr('always-reload') && 'true' === quickview.data('always-reload') ) {

        } else {
          quickview.data('url-has-loaded', 'true');
        }
      });
    }

    // Open it
    quickview.addClass('reveal');

    if ( ! quickview.hasClass('backdrop-remove') ) {
      quickview.after('<div class="app-backdrop backdrop-quickview" data-target="'+ e +'"></div>');
    }
    
  };



  // Close quickview
  //
  quickview.close = function(e) {

    // Callback
    var fn = window[ $(e).attr('data-before-close') ];
    if ( typeof fn === 'function' ) {
      fn($(e));
    }


    $(e).removeClass('reveal');
    $('.backdrop-quickview').remove();


    // Callback
    var fn = window[ $(e).attr('data-on-close') ];
    if ( typeof fn === 'function' ) {
      fn($(e));
    }
  };



  window.quickview = quickview;
}(jQuery, window);
