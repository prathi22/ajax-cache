Enables short-term ajax response caching in user's browser using `JavaScript`.

basic example:

lets say we have this code (below), ajax request is sent to server every time we want to obtain data. Which is not always necessary and results in more process time for server, more bandwidth usage and delay while waiting for the response.
```
$.ajax({
    url: ajax_path,
    type: 'GET',
    data: viewData,
    dataType: 'json'
    success: function(response) {
        // update website
        update_website(response);
    },
    error: function(xhr) {
        // handle errors
        handle_errors(xhr);
    },
});
```

We can transform it to:

```
if(cache.on)
{
  var cachedResponse = cache.get(ajax_path, [viewData]);
  if(cachedResponse !== false)
  {
    // update website
    update_website(cachedResponse); // We just avoided one ajax request
    return true;
  }
}
$.ajax({
  url: ajax_path,
  type: 'GET',
  data: viewData,
  dataType: 'json'
  success: function(response) {
    if(cache.on) cache.put(ajax_path, viewData, response); // record the new response
    // update website
    update_website(response);
  },
  error: function(xhr) {
    // handle errors
    handle_errors(xhr);
  },
});
```

We just enabled user-side AJAX response caching
We just wrapped the first code in ajax-cache and now we cache responses in user's browser. So, we save time, bandwidth and server resources.

see the [detailed explanation](HowTo.md) how to wrap your ajax code with ajax-cache.

# Supported types #

All supported request types are listed below:
[URL](#URL.md), [GET](#GET.md)

## URL ##
simple url request possible with parameters (GET method).

Initialization:
```
var cache = new ajaxCache('URL', true, 1800000);
```

Usage examples:
  * `_IG_FetchContent()` Used in google mapplets:
```
function search_map_ajax(query)
{
  var url = 'http://www.example.com/ajax.php?' + query;
  
  if(cache.on)
  {
    var cachedResult = cache.get(url);
    if(cachedResult !== false) return search_map_ajax_handler(cachedResult);
  }
  _IG_FetchContent(url, function(data){
    if(cache.on) cache.put(url, data);
    search_map_ajax_handler(data);
  });
  
  return true;
}
```

## GET ##
GET request, with or without parameters.

Initialization:
```
var cache = new ajaxCache('GET', true, 1800000);
```

Usage examples:
  * jQuery example:
```
function perform_ajax(viewData)
{
  var ajax_path = '/views/ajax';
  
  if(cache.on)
  {
    var cachedResponse = cache.get(ajax_path, [viewData]);
    if(cachedResponse !== false)
    {
      // update website
      update_website(cachedResponse); // We just avoided one ajax request
      return true;
    }
  }
  $.ajax({
    url: ajax_path,
    type: 'GET',
    data: viewData,
    dataType: 'json'
    success: function(response) {
      if(cache.on) cache.put(ajax_path, viewData, response); // record the new response
      // update website
      update_website(response);
    },
    error: function(xhr) {
      // handle errors
      handle_errors(xhr);
    },
  });
  
  return true;
}
```