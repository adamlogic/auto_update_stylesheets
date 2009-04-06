$.autoUpdateStylesheets = function() {
  var linkElements = $('head link'), index = -1;

  normalizeQueryStrings();
  compareNextStyleSheet();

  function compareNextStyleSheet() {
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
        setTimeout(compareNextStyleSheet, 100);
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
      url += '&timestamp=0000';
      $(link).attr('href', url);
    });
  }
}
