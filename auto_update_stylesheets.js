$.autoUpdateStylesheets = function(enable_or_disable) {
  var linkElements = $('head link'), index = -1;

  if (enable_or_disable == 'disable') {
    stop();
    return
  }

  if (!data('initialized')) {
    normalizeQueryStrings();
    data("initialized", true);
  }
  start();

  function compareNextStyleSheet() {
    if (data('timeout') == false) return;
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
        data('timeout', setTimeout(compareNextStyleSheet, 100));
      }
    });
  }

  function data(name, val) {
    return linkElements.data("autoUpdateStylesheets." + name, val);
  }

  function stop() {
    clearTimeout(data('timeout'));
    data('timeout', false);
  }

  function start() {
    if (!data("timeout"))
      data('timeout', setTimeout(compareNextStyleSheet, 100));
  }

  function getNextLink() {
    index = (index + 1) % linkElements.length;
    return linkElements[index];
  }

  function normalizeQueryStrings() {
    linkElements.each(function(i, link) {
      var url = link.href;
      if (url.indexOf('?') == -1) url += '?';
      url += '&timestamp=0000';
      $(link).attr('href', url);
    });
  }
}
