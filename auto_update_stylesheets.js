(function($) {

  var initialized = null;

  $.autoUpdateStylesheets = function(toggle) {
    var linkElements = $('head link[rel=stylesheet]'), index = -1;

    if (!initialized) {
      normalizeQueryStrings();
      initialized = true;
    }

    switch(toggle) {
      case 'disable':
        stop();
        break;
      case 'toggle':
      case true:
        $.autoUpdateStylesheetsTimeout ? stop() : start();
        break;
      default:
        start();
    }

    function stop() {
      showMessage('Stylesheets are now frozen.');
      if ($.autoUpdateStylesheetsTimeout) clearTimeout($.autoUpdateStylesheetsTimeout);
      $.autoUpdateStylesheetsTimeout = false;
    }

    function start() {
      showMessage('Stylesheet changes will be reflected in real-time.');
      if (!$.autoUpdateStylesheetsTimeout) $.autoUpdateStylesheetsTimeout = setTimeout(compareNextStyleSheet, 300);
    }

    function compareNextStyleSheet() {
      if (!$.autoUpdateStylesheetsTimeout) return;

      var link = getNextLinkElement(),
          url = link.href.replace(/timestamp=\d+/, 'timestamp=' + new Date().getTime());

      $.ajax({
        url: url,
        success: function(data) { 
          if (data != $(link).data('cachedData')) {
            $(link).data('cachedData', data).attr('href', url);
          }
        }, 
        complete: function() {
          $.autoUpdateStylesheetsTimeout = setTimeout(compareNextStyleSheet, 300);
        }
      });
    }

    function getNextLinkElement() {
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

    function showMessage(message) {
      var messageContainer = $('<div style="position: fixed; top: 0; padding: 15px 0; width: 100%; text-align: center;" />');
      messageContainer.append('<span style="border: 1px solid #333; padding: 5px 10px; background: #cec; font-size: 14px" />');
      messageContainer.children().html(message);

      $('body').prepend(messageContainer);

      setTimeout(function() {
        messageContainer.fadeOut('slow', function() { $(this).remove() });
      }, 2500);
    }

  }

})(jQuery);
