(function($) {

  var initialized = null, timeout = null;

  $.autoUpdateStylesheets = function(enable_or_disable) {
    var linkElements = $('head link'), index = -1;

    if (!initialized) {
      normalizeQueryStrings();
      initialized = true;
    }

    if (enable_or_disable == 'disable') {
      stop();
    } else {
      start();
    }

    function stop() {
      clearTimeout(timeout);
      timeout = false;
    }

    function start() {
      if (!timeout) timeout = setTimeout(compareNextStyleSheet, 100);
    }

    function compareNextStyleSheet() {
      if (!timeout) return;

      var link = getNextLink(),
          url = link.href.replace(/timestamp=\d+/, 'timestamp=' + new Date().getTime());

      $.ajax({
        url: url,
        success: function(data) { 
          if (data != $(link).data('cachedData')) {
            $(link).data('cachedData', data).attr('href', url);
          }
        }, 
        complete: function() {
          timeout = setTimeout(compareNextStyleSheet, 100);
        }
      });
    }

    function getNextLink() {
      index = (index + 1) % linkElements.length;
      return linkElements[index];
    }

    function normalizeQueryStrings() {
      linkElements.each(function(i, link) {
        var url = link.href;
        if (url.indexOf('?') == -1) url += '?';
        url += '&timestamp=0';
        $(link).attr('href', url);
      });
    }

  }

})(jQuery);
